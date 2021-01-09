# Abstract
Texel's tuning method is basically a supervised learning using logistic regression.<br>
Current paper offers the most simple <a href="https://github.com/maksimKorzh/wukongJS/tree/main/tools/eval_tuner">implementation</a> possible with an emphasis on<br>
understanding the basic pipe line and explanations of all the basics steps needed<br>
to establish it.

# Generating dataset
There are two major approaches to obtain a dataset for tuning purposes -<br>
external PGN file or one produced by engine's self play. I used both<br>
ways to tune Wukong JS. All we need to do is to extract FEN positions<br>
from the PGN file and associate game result with it so that<br>
white win maps to '1.0', draw to '0.5' and black win to '0.1'<br>
<br>
See example dataset below:<br>

```
8/p5p1/1pnnkp2/4p2p/4P3/P2K1P2/1PN3PP/4B3 b - - 0 37 [0.5]
8/4k3/7R/7p/p6P/1bK5/8/8 b - - 40 60 [0.5]
8/8/5n2/5p2/3N2k1/6P1/6K1/8 w - - 12 120 [0.5]
rn1qk2r/pb2bppp/1pp2n2/3pN3/B2P4/2N1P3/PP3PPP/R1BQK2R b KQkq - 1 9 [0.0]
r1bqr1k1/1p3pp1/3p1n1p/2p5/2Pp4/PQ1P2PP/3NPPB1/R3R1K1 b - - 1 17 [0.5]
1q1r1rk1/pb1pbppp/1p2p3/8/2PnPBn1/P1N2N2/1P1QBPPP/2R2RK1 b - - 11 15 [1.0]
5rk1/r2nbppp/pqp1p3/1p1n4/3PP3/2N2BP1/PP1B1P1P/R1QR2K1 b - - 0 17 [0.5]
8/6k1/3p1np1/b3pP1p/6P1/P3BK1P/8/2N5 b - - 2 43 [1.0]
4r1k1/r4p1p/2p1b1p1/3pP3/1p2nP2/5N1P/1PP3P1/3RRBK1 w - - 0 30 [0.5]
rn1qk2b/pb3p2/2p1pn2/4N1p1/2pPP3/2N3B1/PP3PP1/R2QK3 w Qq - 0 14 [0.0]
8/8/6kP/1pp5/4K1n1/1P6/P2B4/8 b - - 10 50 [1.0]
2Q5/4q1pk/7p/5p2/8/6R1/6KP/4r3 b - - 13 52 [0.0]
8/p2r1pk1/1np1b1p1/2p1p1b1/2P1P2p/qP3B1P/2R1NPP1/2NQ2K1 w - - 2 48 [0.0]
2kr1b2/p1q2p1p/4RQrp/2pp2N1/5p2/3P4/PPPN1P2/5K1R w - - 2 20 [0.5]
2r2rk1/4q1pp/p2n1pn1/3p3N/1p1Pp1PP/4P2B/PPP2QR1/5R1K w - - 1 26 [0.5]
1n1q1r1k/pp4pp/4Q2n/1B1p4/3P2P1/8/1R4KP/6B1 w - - 3 32 [0.0]
7k/6b1/4B2p/r7/1p2KP2/1P5P/P5R1/8 b - - 2 56 [1.0]
```

I've removed first 5 positions from each game and those containing<br>
checkmates on board - just like in the original method. Now the difference is<br>
that in order to label positions with scalar evaluation value later on<br>
using evaluate() function instead of quiescence() I've extracted only<br>
those positions where static evaluation equals quiescence score so that<br>
tactical noise didn't affect the tuning process. All the positions within<br>
a single game are shuffled. Also the overall data has been shuffled as well

# Calculating mean square error
In order to calculate the mean square error all we need is:<br>
1. Get evaluation score 
2. Map evaluation score to probabilistic value using sigmoid
3. Subtract it from game result and square the product
4. Divide sum of errors for all positions by number of positions

See the python implementation below:
```python
def mean_square_error(self, K, number_of_positions):
    # open file containing FEN positions
    with open('positions.txt', encoding='utf-8') as f:
        # init positions list with fixed number of games
        fens = f.read().split('\n')[0:number_of_positions]
        
        # error accumulator
        error = 0.0
        
        # loop over FEN strings
        for fen in fens:
            try:
                # extract game result from FEN string
                result = float(fen.split('[')[-1][:-1])
                
                # extract position
                position = fen.split('[')[0]
                
                # set position on internal chess board (python-chess library)
                self.board.set_fen(position)
                
                # get static evaluation of the position
                score = self.evaluate()
                
                # map evaluation score to probabilistic value
                sigmoid = 1 / (1 + pow(10, -K * score / 400))
                
                # sum error
                error += pow(result - sigmoid, 2)
            
            except Exception as e: print(e)

        # get mean square error
        return error / number_of_positions
```

# Tuning
Now when we're able to get the mean square error for a set of given position<br>
all we need is to loop over the evaluation parameters we want to tune, adjust<br>
them sligthly and recalculate mean square error. If it get's reduced we store<br>
the new parameters otherwise keep existing ones. The procedure is repeated until<br>
mean square error is getting minimized. There are much more efficient and sophisticated<br>
algorithms to adjust the evaluation parameters but I use the simplest possible.<br>
Unfortunately it's the slowest method as well.

See the python implementation below:
```python
def tune(self, K, number_of_positions):
    # value to adjust parameter by
    adjust_value = 1
    
    # get the copy of evaluation parameters actually used to evaluate position
    best_params = self.extract_weights()
    
    # calculate initial mean square error
    best_error = self.mean_square_error(K, number_of_positions)
    
    # variable to flag whether the mean square error has been minimized
    improved = True
    
    # run routine until mean square error is getting minimized
    while improved:
        improved = False    
        
        # loop over all evaluation parameters
        for index in range(len(best_params)):
            # copy evaluation weights
            new_params = json.loads(json.dumps(best_params))
            
            # adjust current parameter by +1
            new_params[index] += adjust_value
            
            # update evaluation parameters actually used to get static evaluation score
            self.update_weights(new_params)
            
            # recalculate mean square error with updated parameter
            new_error = self.mean_square_error(K, number_of_positions)

            print('Tuning param %s out of %s, mean square error %s' % 
                 (index, len(best_params), new_error))
            
            # parameter adjustments reduced mean square error
            if new_error < best_error:
                # remember error
                best_error = new_error
                
                # update best parameters
                best_params = json.loads(json.dumps(new_params))
                
                improved = 1
                print('found better params +')
                self.store_weights('tuning_weights.txt')
            
            # parameter adjustments didn't reduce mean square error
            else:
                # adjust current parameter by -2 (-1 to restore initial state + -1 to adjust)
                new_params[index] -= adjust_value * 2
                
                # update evaluation parameters actually used to get static evaluation score
                self.update_weights(new_params)
                
                # recalculate mean square error with updated parameter
                new_error = self.mean_square_error(K, number_of_positions)
                
                # parameter adjustments reduced mean square error
                if new_error < best_error:
                    # remember error
                    best_error = new_error
                    
                    # update best parameters
                    best_params = json.loads(json.dumps(new_params))
                    
                    improved = 1
                    print('found better params -')
                    self.store_weights('tuning_weights.txt')
        
        # store adjusted evaluation parameters when all of them has been traversed
        self.store_weights('session_weights_' + str(datetime.datetime.today().strftime('%Y-%m-%d-%H-%M')) + '.txt')
        print('Writing current session weights...')

    print('Writing final weights...')
    self.store_weights('final_weights.txt')
```

# Video explanation
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/3JCWxH6IehQ/0.jpg)](https://www.youtube.com/watch?v=3JCWxH6IehQ)






