#
#      Script to tune material weights & PST
#   using Texel's tuning and supervised learning
#

# packeges
import chess
import chess.pgn
import json

# evaluation tuner
class EvalTuner():
    # chess board instance
    board = chess.Board()
    board.push(chess.Move.from_uci('e2e4'))
    
    # capture ordering
    mvv_lva = [
        0,   0,   0,   0,   0,   0,   0,  0,   0,   0,   0,   0,   0,
        0, 105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
        0, 104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
        0, 103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
        0, 102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
        0, 101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
        0, 100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600,

        0, 105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
        0, 104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
        0, 103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
        0, 102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
        0, 101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
        0, 100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600
    ];
    
    # game result mapping
    result = {
        '1-0': 1.0,
        '1/2-1/2': 0.5,
        '0-1': 0.0
    }
    
    # init
    def __init__(self):
        with open('initial_weights.json') as f:
            self.eval_params = json.loads(f.read())
            
            # map game phases
            self.opening = self.eval_params['opening']
            self.middlegame = self.eval_params['middlegame']
            self.endgame = self.eval_params['endgame']
            
            # map game phase score margins
            self.opening_phase = self.eval_params['weights'][0][0]
            self.endgame_phase = self.eval_params['weights'][1][0]
            
            # map material weights
            self.material_weights = [
                self.eval_params['weights'][0][0:13],
                self.eval_params['weights'][1][0:13]
            ]
            
            # map piece square tables
            self.pst = [
                [
                    self.eval_params['weights'][0][13:77],
                    self.eval_params['weights'][0][77:141],
                    self.eval_params['weights'][0][141:205],
                    self.eval_params['weights'][0][205:269],
                    self.eval_params['weights'][0][269:333],
                    self.eval_params['weights'][0][333:397],
                ],
                
                [
                    self.eval_params['weights'][1][13:77],
                    self.eval_params['weights'][1][77:141],
                    self.eval_params['weights'][1][141:205],
                    self.eval_params['weights'][1][205:269],
                    self.eval_params['weights'][1][269:333],
                    self.eval_params['weights'][1][333:397],
                ]
            ]

    # get game phase score
    def get_phase_score(self):
        phase_score = 0
        material_weights_opening = self.eval_params['weights'][0][0:6]
        
        for square in range(64):
            if self.board.piece_at(square):
                if self.board.piece_at(square).piece_type > 1 and self.board.piece_at(square).piece_type < 6:
                    phase_score += material_weights_opening[self.board.piece_at(square).piece_type]

        return phase_score
    
    # static evaluation
    def evaluate(self):    
        # calculate game phase score based on material
        game_phase_score = self.get_phase_score()
        game_phase = -1;

        # init game phase
        if game_phase_score > self.opening_phase: game_phase = self.opening
        elif game_phase_score < self.endgame_phase: game_phase = self.endgame
        else: game_phase = self.middlegame

        # init scores
        score = 0;
        score_opening = 0;
        score_endgame = 0;

        # loop over bard squares
        for square in range(64):
            piece = 0;
            
            if self.board.piece_at(square):
                piece_type = self.board.piece_at(square).piece_type - 1
                
                if self.board.piece_at(square).color: piece = self.board.piece_at(square).piece_type
                else: piece = self.board.piece_at(square).piece_type + 6

                # evaluate material score
                score_opening += self.material_weights[self.opening][piece]
                score_endgame += self.material_weights[self.endgame][piece]
                
                # evaluate positional score
                if piece >= 1 and piece <= 6:
                    score_opening += self.pst[self.opening][piece_type][self.eval_params['mirror'][square]]
                    score_endgame += self.pst[self.endgame][piece_type][self.eval_params['mirror'][square]]
                
                elif piece >= 7 and piece <= 12:
                    score_opening -= self.pst[self.opening][piece_type][square]
                    score_endgame -= self.pst[self.endgame][piece_type][square]
        
        # interpolate values for middlegame     
        if game_phase == self.middlegame:
            try:
                score = (
                    score_opening * game_phase_score +
                    score_endgame * (self.opening_phase - game_phase_score)
                ) / self.opening_phase;
            
            except: score = 0
        
        # return pure score for opening / endgame
        elif game_phase == self.opening: score = score_opening;
        elif game_phase == self.endgame: score = score_endgame;
        
        score = int(score)
        if self.board.turn: return score
        else: return -score
    
    # quiescence search
    def quiescence(self, alpha, beta):
        stand_pat = self.evaluate();
        
        if stand_pat >= beta: return beta;
        if alpha < stand_pat: alpha = stand_pat;

        legal_moves = self.board.legal_moves
        move_list = []
        
        for move in legal_moves:
            if self.board.is_capture(move):
                move_list.append({
                    'move': move,
                    'score': self.mvv_lva[
                                 self.board.piece_at(move.from_square).piece_type * 13 +
                                 self.board.piece_at(move.to_square).piece_type
                             ]
                })
        
        move_list = sorted(move_list, key=lambda k: k['score'], reverse=True) 

        for move in move_list:
            self.board.push(move['move'])
            score = -self.quiescence(-beta, -alpha)
            self.board.pop()
            
            if score >= beta: return beta
            if score > alpha: alpha = score;
        
        return alpha;
    
    # get mean square error
    def mean_square_error(self):
        number_of_positions = 1000
        with open('positions.txt', encoding='utf-8') as f:
            fens = f.read().split('\n')[0:number_of_positions]
            error = 0.0
            
            for fen in fens:
                try:
                    result = float(fen.split('[')[-1][:-1])
                    position = fen.split('[')[0]
                    self.board.set_fen(position)
                    score = self.evaluate()
                    sigmoid = 1 / (1 + pow(10, -0.20 * score / 400))
                    error += pow(result - sigmoid, 2)
                
                except Exception as e: print(e)

            return error / number_of_positions
    
    # extract weights from evaluation parameters
    def extract_weights(self):
        weights = []
        
        for phase in range(2):
            for weight in self.eval_params['weights'][phase]:
                weights.append(weight)
        
        return weights
    
    # update evaluation parameters with tuned weights
    def update_weights(self, weights):
        # update opening phase weights
        for index in range(len(weights[0:int(len(weights) / 2)])):
            self.eval_params['weights'][0][index] = weights[index]
    
        # update endgame phase weights
        for index in range(len(weights[int(len(weights) / 2):])):
            self.eval_params['weights'][0][index] = weights[index]

    # write weights to file
    def store_weights(self):        
        with open('new_weights.txt', 'w') as f:
            f.write('const openingPhaseScore = %s;\n' % self.opening_phase)
            f.write('const endgamePhaseScore = %s;\n\n' % self.endgame_phase)
            f.write('// material score\nconst materialWeights = [\n  // opening material score\n')
            f.write('  %s,\n\n' % self.material_weights[self.opening])
            f.write('  // endgame material score\n')
            f.write('  %s\n\n};\n\n' % self.material_weights[self.endgame])
            f.write('// piece-square tables\n')
            f.write('const pst = [\n')
            f.write('  // opening phase scores\n  [\n')
            
            for phase in range(2):
                for piece in [
                    {'pawn': 0},
                    {'knight': 1},
                    {'bishop': 2},
                    {'rook': 3},
                    {'queen': 4},
                    {'king': 5}
                ]:  
                    piece_type = list(piece.values())[0]
                    piece_name = list(piece.keys())[0]                   
                    
                    f.write('    // %s\n    [\n' % piece_name)
                    for row in range(8):
                        for col in range(8):
                            square = row * 8 + col
                            
                            if col == 0: f.write('      ')
                            if square != 63: f.write('%s,%s' % (self.pst[phase][piece_type][square],
                                                     ' ' * (4 - len(str(self.pst[phase][piece_type][square])))))
                            
                            elif piece_name != 'king': f.write('%s,   o, o, o, o, o, o, o, o\n   ],\n' % (self.pst[phase][piece_type][square]))
                            else: f.write('%s,   o, o, o, o, o, o, o, o\n    ]' % (self.pst[phase][piece_type][square]))
                        
                        if row != 7: f.write('o, o, o, o, o, o, o, o,\n')
                        else: f.write('\n')
 
                    if phase == 0 and piece_name == 'king':
                        f.write('  ],\n\n  [\n')
            
            f.write('];\n')            

    # evaulation tuner
    def tune(self):
        adjust_value = 50
        best_params = self.eval_params['weights']
        best_error = self.mean_square_error()
        improved = True
        
        while improved:
            improved = False    
            for index in range(len(best_params)):
                new_params = json.loads(json.dumps(best_params))
                new_params[index] += adjust_value
                new_error = self.mean_square_error()

                print('Tuning param %s out of %s, mean square error %s' % 
                         (index, len(best_params), new_error))
                
                if new_error < best_error:
                    best_error = new_error
                    best_params = json.loads(json.dumps(new_params))
                    improved = 1
                    print('found better params +')
                    self.update_eval_params(best_params)
                
                else:
                    new_params[index] -= adjust_value * 2
                    new_error = self.mean_square_error()
                    
                    if new_error < best_error:
                        best_error = new_error
                        best_params = json.loads(json.dumps(new_params))
                        improved = 1
                        print('found better params -')
                        self.update_eval_params(best_params)
                        
        self.update_eval_params(best_params)

# main driver
if __name__ == '__main__':
    tuner = EvalTuner()
    params = tuner.extract_weights()
    tuner.update_weights(params)
    tuner.store_weights()
    #tuner.tune()





