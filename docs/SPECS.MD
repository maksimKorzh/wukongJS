# Board representation
 - 0x88 board representation
 - 32-bit Zobrizt hashing
 - piece lists

# Move generator
 - on the fly attacks
 - incremental updates of position on make move/take back
 - move stack for storing board state variables

# Evaluation
 - based on simplified evaluation by Tomasz Michniewski 
 - material + PST only obtained by <a href="https://github.com/maksimKorzh/wukongJS/blob/main/docs/TEXEL'S_TUNING.MD">Texel's tuning method</a>
 - tapared evaluation
 - insufficient material detection

# Search
 - 50 move rule detection
 - 3 fold repetition detection
 - stand pat quiescence
 - on the fly move sorting
 - MVV_LVA/killer/history/PV move ordering
 - Evaluation pruning
 - NMP (Null move pruning)
 - Razoring
 - Futility pruning
 - LMR (Late move reduction)
 - PVS (Principal variation search)
 
 # Interfaces
 - UCI protocol
 - Web browser
