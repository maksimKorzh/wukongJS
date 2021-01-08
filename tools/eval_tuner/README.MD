# Evaluation tuner
This is so called naive implementation of Texel's tuning method<br>
which is basically a supervised learning using logistic regression

# Input and output
Script "eval_tuner.py" takes file "initial_weights.json" as an input<br>
and then produces text file with javascript code for material and PST<br>
see files in "/temp_weights" to get some examples

# How to use it
All the functinallity available for usage can be found<br>
within the main driver in the bottom of the file "eval_tuner.py"

```python
# main driver
if __name__ == '__main__':
    tuner = EvalTuner()
    #tuner.generate_dataset()
    #print(tuner.mean_square_error())
    tuner.tune()
```

You can simply comment/uncomment needed methods depending on<br>
what you currently need:

 - generate_dataset() creates training dataset with FEN strings and game results
 - print(tuner.mean_square_error()) calculates mean square error for current input weights
 - tune() is a training routine, see "/test_weights" fot the ongoing outputs

You'll need to specify source to PGN file is using generate_dataset()<br>
You can also change number of positions to calculate mean square error for
