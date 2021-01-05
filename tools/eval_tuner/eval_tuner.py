#
#      Script to tune material weights & PST
#   using Texel's tuning and supervised learning
#

# packeges
import chess
import json

# evaluation tuner
class EvalTuner():
    board = chess.Board()
    
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

# main driver
if __name__ == '__main__':
    tuner = EvalTuner()
    tuner.board.set_fen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 10 ')
    print('score:', tuner.quiescence(-50000, 50000))







