#
#      Script to tune material weights & PST
#   using Texel's tuning and supervised learning
#

# packeges
import chess
import json

# evaluation tuner
class EvalTuner():
    # init
    def __init__(self):
        with open('initial_weights.json') as f:
            self.weights = json.loads(f.read())
        
        self.board = chess.Board()

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
        print(self.board)
        game_phase_score = self.get_phase_score()
        game_phase = -1;
        
        opening = self.weights['opening']
        middlegame = self.weights['middlegame']
        endgame = self.weights['endgame']

        if game_phase_score > self.weights['opening_phase']: game_phase = opening
        elif game_phase_score < self.weights['endgame_phase']: game_phase = endgame
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

                
        '''
        // interpolate score in the middlegame
        if (gamePhase == middlegame)
            score = (
                scoreOpening * gamePhaseScore +
                scoreEndgame * (openingPhaseScore - gamePhaseScore)
            ) / openingPhaseScore;
        else if (gamePhase == opening) score = scoreOpening;
        else if (gamePhase == endgame) score = scoreEndgame;

        score = (score * (100 - fifty) / 100) << 0;
        return (side == white) ? score: -score;
        '''
        print(score_opening, score_endgame)

# main driver
if __name__ == '__main__':
    tuner = EvalTuner()
    tuner.evaluate()

