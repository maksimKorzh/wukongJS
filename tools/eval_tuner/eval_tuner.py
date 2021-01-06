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
            self.weights = json.loads(f.read())

    # get game phase score
    def get_phase_score(self):
        phase_score = 0
        
        for square in range(64):
            if self.board.piece_at(square):
                if self.board.piece_at(square).piece_type > 1 and self.board.piece_at(square).piece_type < 6:
                    phase_score += self.weights['material'][0][self.board.piece_at(square).piece_type]

        return phase_score
    
    # static evaluation
    def evaluate(self):
        game_phase_score = self.get_phase_score()
        game_phase = -1;
        
        opening = self.weights['opening']
        middlegame = self.weights['middlegame']
        endgame = self.weights['endgame']
        
        opening_phase = self.weights['opening_phase']
        endgame_phase = self.weights['endgame_phase']

        if game_phase_score > opening_phase: game_phase = opening
        elif game_phase_score < endgame_phase: game_phase = endgame
        else: game_phase = middlegame

        score = 0;
        score_opening = 0;
        score_endgame = 0;

        for square in range(64):
            piece = 0;
            
            if self.board.piece_at(square):
                piece_type = self.board.piece_at(square).piece_type - 1
                
                if self.board.piece_at(square).color: piece = self.board.piece_at(square).piece_type
                else: piece = self.board.piece_at(square).piece_type + 6
                
                score_opening += self.weights['material'][opening][piece]
                score_endgame += self.weights['material'][endgame][piece]
                
                if piece >= 1 and piece <= 6:
                    score_opening += self.weights['pst'][opening][piece_type][self.weights['mirror'][square]]
                    score_endgame += self.weights['pst'][opening][piece_type][self.weights['mirror'][square]]
                
                elif piece >= 7 and piece <= 12:
                    score_opening -= self.weights['pst'][opening][piece_type][square]
                    score_endgame -= self.weights['pst'][opening][piece_type][square]

                
        if game_phase == middlegame:
            score = (
                score_opening * game_phase_score +
                score_endgame * (opening_phase - game_phase_score)
            ) / opening_phase;

        elif game_phase == opening: score = score_opening;
        elif game_phase == endgame: score = score_endgame;
        
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
    
    # evaluation parameters extractor
    def extract_eval_params(self):
        eval_params = []
        
        eval_params.append(self.weights['opening_phase'])
        eval_params.append(self.weights['endgame_phase'])
        
        for phase in self.weights['material']:
            for weight in phase:
                eval_params.append(weight)

        for phase in self.weights['pst']:
            for pst in phase:
                for square in pst:
                    eval_params.append(square)
        
        return eval_params
    
    # evaluation parameters updater
    def update_eval_params(self, eval_params):
        with open('new_weights.txt', 'w') as f:
            f.write('// game phase score opening / endgame\n')
            f.write(str(eval_params[0]) + '\n')
            f.write(str(eval_params[1]) + '\n\n')
            
            index = 2
            
            f.write('// material weights opening / endgame\n')
            for weight in range(13): f.write(str(eval_params[index]) + ', '); index += 1
            f.write('\n')
            for weight in range(13): f.write(str(eval_params[index]) + ', '); index += 1
            f.write('\n\n')
            
            for phase in ['opening', 'endgame']:
                for piece in ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king']:
                    f.write('// ' + piece + ' ' + phase + '\n')
                    for weight in range(8):
                        for weight in range(8):
                            f.write(str(eval_params[index]) + ', ');
                            index += 1
                        
                        f.write('\n')
                     
                    f.write('\n')
                 
                f.write('\n')
    
    # evaulation tuner
    def tune(self):
        count = 0
        number_of_games = 1
        
        with open('/home/maksim/Downloads/positions.txt', encoding='iso-8859-1') as f:
            fens = f.read().split('\n')
            
            for fen in fens:
                print(fen)
            '''
            self.board.push(move)
            result = self.result[result_raw]
            score = self.quiescence(-50000, 50000)
            sigmoid = 1 / (1 + pow(10, -0.20 * score / 400))
            average_error += 1 / number_of_positions * pow(result - sigmoid, 2)
            print(average_error)
            '''
            
            
        print(count)
            

# main driver
if __name__ == '__main__':
    tuner = EvalTuner()
    params = tuner.extract_eval_params()
    #tuner.update_eval_params(params)
    tuner.tune()






