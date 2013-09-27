RallyData = function() {
    this.odometerCoeff = 1.0;      // coefficient to multiply real distance by to get odometer distance

    this.startTime = null;
    this.startOdo  = null;

    this.nextPoint = 0;
    this.path      = [];
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
                          "timeReset":     true,
                          "realOdo":       realOdo,
                          "realTime":      realTime,
                          "claimedDelay":  claimedDelay
                        };

        this.path.splice(nextPoint, 0, pathPoint);

        this.nextPoint++;
    },

    //-------------------------------------

    computeExpectedOdoAndTime: function(pathElement, onlySome) {
        var expectedData = [];

        var expectedOdo  = this.startOdo;
        var expectedTime = this.startTime;

        var windowSize = 100;
        if (onlySome) windowSize = 10;
        var from = Math.max(0,                this.nextPoint - windowSize);
        var to   = Math.min(this.path.length, this.nextPoint + windowSize*2);
        if (to < from + windowSize*3) {
            from = Math.max(0, to - windowSize*3);
            to   = math.min(this.path.length, from + windowSize*3);
        }

        for (var i = from; i < to; i++) {
            var pathPoint = path[i];

            expectedOdo  = pathPoint.timeReset ? pathPoint.realOdo  : this._computeExpectedOdo( expectedOdo, pathPoint.dist );
            expectedTime = pathPoint.timeReset ? pathPoint.realTime : this._computeExpectedTime( expectedTime, pathPoint.dist, pathPoint.avgSpeed, pathPoint.delay );

            var element = { "comment":      pathPoint.comment,
                            "dist":         pathPoint.dist,
                            "acgSpeed":     pathPoint.avgSpeed,
                            "delay":        pathPoint.delay,
                            "expectedOdo":  expectedOdo,
                            "expectedTime": expectedTime,
                            "realOdo":      pathPoint.hasOwnProperty("realOdo")  ? pathPoint.realOdo : null,
                            "realTime":     pathPoint.hasOwnProperty("realTime") ? pathPoint.realTime : null };

            var str = this._toString(element);

            element["asString"] = str;

            expectedData.push( element);
        }

        return { "next": this.nextPoint, "data": expectedData };
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
    }
};

