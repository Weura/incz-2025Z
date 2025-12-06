# ---------------------
# configuration
# ---------------------

## DecibelsService.js

frontend\frontend\src\services\DecibelsService.js

### url

## trilateration.js

frontend\frontend\src\utils\trilateration.js

### distance between detectors
<!-- 
devices position in grid for length=10m
0,0
10,0
5, 5sqrt(2) -->

IF it is equilateral
    set length to appropriate distance
if not 
    adjust dBtoDistance() - r calculation
    set appropriate lenghts: D1, D2, D3

### reference sound

I0 needs to be set to appropriate value

# ---------------------
# Starting
# to start backend

python -u "YOURPATH\incz_prototyp\backend\base.py"

# to start frontend

cd \incz_prototyp\frontend\frontend
npm start