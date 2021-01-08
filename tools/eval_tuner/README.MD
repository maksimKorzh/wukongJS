# Evaluation tuner
This is so called naive implementation of Texel's tuning method<br>
which is basically a supervised learning using logistic regression

# What it does
Evaluation tuner allows to come up with your own unique material weights,<br>
piece square tables and game phase scores for opening and endgame game phases<br>
so that later they can be interpolated using tapered evaluation technique<br>
and serve as the only parameters of simplified evaluation function intended<br>
to compensate the lack of any other chess knowledge and not to be supplemented by them

# Manual tuning of initial dataset
Before running automated tuning routine you may want to manually adjust the input weights.<br>
This is done very simply:<br>
1. provide/change initial weights (file "initial_weights.json")
2. calculate mean square error (explanations below)
3. manually adjust the weights

Repeat steps 2 and 3 as many times as needed so that the mean square error<br>
is getting reduced. At very least you need to make sure it doesn't increase significantly

# How to use it
All the functinallity available for usage can be found<br>
within the main driver in the bottom of the file "eval_tuner.py"

```python
# main driver
if __name__ == '__main__':
    tuner = EvalTuner()
    tuner.generate_dataset('games.pgn')
    print(tuner.mean_square_error(0.20, 3000))
    tuner.tune()
```

You can simply comment/uncomment needed methods depending on<br>
what you currently need:

 - generate_dataset(filename) extracts FEN strings and game results from PGN file<br>
 - print(tuner.mean_square_error(K, number_of_games)) calculates mean square error<br>
 - tune() is a core training routine, see "/test_weights" to track ongoing outputs
 
 
 
 
 

