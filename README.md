# Wukong JS
Javascript chess engine with UCI support, own GUI and public API<br>
so you can embed it into your own projects as a library<br>
for both front-end & back-end 

# Project goals
- easy to understand source code
- minimalist design
- reach maximal number of users
- online play in browser
- playing versus other engines via UCI
- reusable public API
- mimic agressive tactical playing style of Fritz (5-12)
- long term playground for relative strength improvement

# Play online vs Wukong JS
https://maksimkorzh.github.io/wukongJS/wukong.html

# Play in UCI mode
1. download latest nodejs: https://nodejs.org/en/
2. download source code: https://github.com/maksimKorzh/wukongJS/archive/main.zip
3. UCI mode in console: "full/path/to/nodejs full/path/to/wukong.js"
4. UCI mode in Arena GUI: set engine path to "full/path/to/nodejs" & command line parameters to "full/path/to/wukong.js"

# Features
1. Board representation
 - 0x88 board representation
 - 32-bit Zobrizt hashing
 - piece lists
<br>
2. Move generation
 - on the fly attacks
 - incremental updates of position on make move/take back
 - move stack for storing board state variables
 - MVV_LVA/killer/history move scoring
<br>
3. Evaluation
 - Material & 100% original handcrafted PSTs to mimic style of Frtiz
 - opening/endgame PSTs for pawns, kings and rooks
 - insufficient material detection
 - 50 move rule penalty
<br>
4. Search (placeholder for now)
 - stand pat quiescence
 - on the fly move sorting
 - MVV_LVA/killer/history move ordering
 
