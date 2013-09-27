RallyData = function() {
    this.odometerCoeff = 1.0;      // coefficient to multiply real distance by to get odometer distance

    this.startTime = null;
    this.startOdo  = null;

    this.nextPoint = 0;
    this.path      = [ {"dist": 0, "avgSpeed": 0} ];
};

RallyData.prototype = {

    setOdometerCoeff: function( realDistance, odoDistance ) {
        this.odometerCoeff = odoDistance / realDistance;
    },

    addPathElement: function( distanceFromStart, avgSpeed, expectedDelay, comment ) {
        var pathPoint = { "dist": distanceFromStart, "avgSpeed": avgSpeed, "expectedDelay": expectedDelay, "comment": comment };
        path.push(pathPoint);
    },

    //-------------------------------------
    start: function( realOdo, realTime ) {
        this.startTime = realTime;
        this.startOdo  = realOdo;
    },

    passPathElement: function( realOdo, realTime ) {
        var pathPoint = path[nextPoint];
        pathPoint["realOdo"]  = realOdo;
        pathPoint["realTime"] = realTime;
        this.nextPoint++;
    },

    undoPass: function() {
        this.nextPoint--;
        var pathPoint = path[nextPoint];
        delete pathPoint.realOdo;
        delete pathPoint.realTime;
    },

    addTimeReset: function( realOdo, realTime, claimedDelay ) {
        var currentPathPoint = path[nextPoint];

        var expectedCurrentDistance = ...

        var pathPoint = { "dist":          expectedCurrentDistance,
                          "avgSpeed":      currentPathPoint.avgSpeed,
                          "expectedDelay": 0,
                          "comment":       "checkpoint",
                          "timeReset":     realTime,
                          "realOdo":       realOdo,
                          "realTime":      realTime,
                          "claimedDelay":  claimedDelay
                        };

        this.nextPoint++;

        this.timeReset.push( { "realOdo": realOdo, "realTime": realTime } );
    },

    //-------------------------------------

    computeExpectedOdoAndTime: function(pathElement) {
        var expectedData = [];

        var realOdo  = this.startOdo;
        var realTime = this.startTime;

        for (var i = 0; i < this.path.length; i++) {
            var pathPoint = path[i];

            var expectedRealOdo = pathPoint.realOdo ?



        }


    },

    getExpectedCurrentInfo: function( currentTime )
    {

    },

    _computeExpectedOdo: function( knownRealOdoPoint, distanceFromThatPoint )
    {
        return knownRealOdoPoint + distanceFromThatPoint * this.odometerCoeff;
    },

    _computeExpectedTime: function( prevPointTime, distanceFromThatPoint, averageSpeed, delay )
    {
        var timeToDrive = (distanceFromThatPoint == 0 || averageSpeed == 0) ? 0 : distanceFromThatPoint / averageSpeed;

        var timeToPass = timeToDrive * 60*60 + delay;

        return this._addTime( prevPointTime, timeToPass );
    },

    _addTime: function( time1, diffInSeconds )
    {
        return new Date(time1.getTime() + diffInSeconds*1000);
    },

    _timeBeforeTime: function
};


PathElement = function( distance, avgSpeed, expectedOdometer, expectedTime, realOdometer, realTime, isReset ) {

    this.realOdometer = realOdometer;
    this.realTime     = realTime;

    this.expectedOdometer = expectedOdometer;
    this.expectedTime     = expectedTime;

    this.isResume = isResume;
};

PathElement.prototype = {
    toString: function() {

    }
};

