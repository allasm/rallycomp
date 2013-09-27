//==================================================================================================

_copy2DArray = function(from, to) {
    for (var i = 0; i < from.length; i++) {
        to.push(from[i].slice(0));
    }
}

_makeFlattened2DArrayCopy = function(array) {
    var flattenedcopy = [].concat.apply([], array);
    return flattenedcopy;
}

function cloneObject(obj) {
    var target = {};
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            target[i] = obj[i];
    }
    return target;
}


function arrayContains(array, item) {
    if (Array.prototype.indexOf) {
        return !(array.indexOf(item) < 0);
    }
    else {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item)
                return true;
        }
        return false;
    }
}

function arrayIndexOf(array, item) {
    if (Array.prototype.indexOf) {
        return (array.indexOf(item));
    }
    else {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    }
}

function replaceInArray(array, value, newValue) {
    for(var i in array){
        if(array[i] == value) {
            array[i] = newValue;
            break;
        }
    }
}

function removeFirstOccurrenceByValue(array, item) {
    for(var i in array) {
        if(array[i] == item) {
            array.splice(i,1);
            break;
        }
    }
}

function isInt(n) {
    //return +n === n && !(n % 1);
    return !(n % 1);
}

//-----------------------------------------------

// used for profiling code
Timer = function() {
    this.startTime = undefined;
    this.lastCheck = undefined;
    this.start();
};

Timer.prototype = {

    start: function() {
        this.startTime = new Date().getTime();
        this.lastCheck = this.startTime;
    },

    restart: function() {
        this.start();
    },

    report: function() {
        var current = new Date().getTime();
        var elapsed = current - this.lastCheck;
        return elapsed;
    },

    printSinceLast: function( msg ) {
        var current = new Date().getTime();
        var elapsed = current - this.lastCheck;
        this.lastCheck = current;
        console.log( msg + elapsed + "ms" );
    },
};


//-----------------------------------------------

function stringifyObject(obj) {
    return _printObjectInternal(obj, 1);
}

function printObject(obj) {
    console.log( _printObjectInternal(obj, 0) );
}

function _printObjectInternal(o, level) {
    if (level > 10) return "...[too deep]...";

    var output = '';

    if (typeof o == 'object')
    {

        if (Object.prototype.toString.call(o) === '[object Array]' ||
            o instanceof Uint32Array)
        {
            output = '[';
            for (var i = 0; i < o.length; i++) {
                if (i > 0) output += ', ';
                output += _printObjectInternal(o[i], level+1);
            }
            output += ']';
        }
        else
        {
            output = '{';
            var idx = 0;
            if (level == 0) output += '\n';
            for (property in o) {
                if (!o.hasOwnProperty(property)) continue;

                if (level != 0 && idx != 0 )
                    output += ', ';
                output += property + ': ' + _printObjectInternal(o[property], level+1);

                if (level == 0)
                    output += '\n';
                idx++;
            }
            output += '}';
        }
    }
    else
        output = ''+o;

    return output;
}

