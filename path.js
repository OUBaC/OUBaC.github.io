var types = ['m', 'l', 'c', 'z', 'h', 'v', 's', 'q', 't', 'a'];
var lengths = [2, 2, 6, 0, 1, 1, 4, 4, 2, 7];
var allBreaks = ['m', 'l', 'c', 'z', 'h', 'v', 's', 'q', 't', 'a', ',', ' ', '-', '.'];

function Path(path) {
  'use strict';
  this.path = path;
  this.canonicalForm = this.getCanonicalForm();
}

// Miscellaneous Utility functions.

Path.findIndexOfClosestMatch = function(array, valueToMatch) {
  'use strict';
  //We could optimise this if we enforce that the arrays are ordered but we won't.
  var currentClosest = 0;
  var distance = Math.abs(array[0] - valueToMatch);
  for (var i = 1; i < array.length; i++) {
    if (Math.abs(array[i] - valueToMatch)) {
      distance = Math.abs(array[0] - valueToMatch);
      currentClosest = i;
    }
  }
  return currentClosest;
};

Path.findEndOfNumber = function(string, startOfNumber) {
  'use strict';
  var currentlyDecimal = false;
  if (string.charAt(startOfNumber) === '.') {
    currentlyDecimal = true;
  } else if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', 'e'].indexOf(string.charAt(startOfNumber)) === -1) {
    throw ('Not a Number');
  }
  var char;
  for (var j = startOfNumber + 1; j < string.length; j++) {
    char = string.charAt(j).toLowerCase();
    if (char === 'e') {
      currentlyDecimal = false;
      j++; //Skip the first number
    }if (char === '.' && currentlyDecimal === false) {
      currentlyDecimal = true;
    } else if (allBreaks.indexOf(char) !== -1) {
      return j - 1;
    }
  }
  return string.length;
};

Path.convertArrayToString = function(arrayOfSegments) {
  'use strict';
  var string  = '';

  for (var i = 0; i < arrayOfSegments.length; i++) {
    for (var j = 0; j < arrayOfSegments[i].length; j++) {
      string += arrayOfSegments[i][j] + ' ';
    }
  }
  return string;
};

//Functions on segments. These are used in functions on the whole path.

Path.addRelativeSegmentToAbsolutePosition = function(pathSectionStartX, pathSectionStartY, x, y, segment) {
  'use strict';
  var type;
  type = segment[0];
  if (type === 'm') {
    x = +x +  (+segment[1]);
    y = +y +  (+segment[2]);
    pathSectionStartX = x;
    pathSectionStartY = y;
  } else if (type === 'l' || type === 't') {
    x = +x +  (+segment[1]);
    y = +y +  (+segment[2]);
  } else if (type === 'c') {
    x = +x +  (+segment[5]);
    y = +y +  (+segment[6]);
  } else if (type === 'z') {
    x = pathSectionStartX;
    y = pathSectionStartY;
  } else if (type === 'h') {
    x = +x +  (+segment[1]);
  } else if (type === 'v') {
    y = +y +  (+segment[1]);
  } else if (type === 's' || type === 'q') {
    x = +x +  (+segment[3]);
    y = +y +  (+segment[4]);
  } else if (type === 'a') {
    x = +x +  (+segment[6]);
    y = +y +  (+segment[7]);
  }
  return [pathSectionStartX, pathSectionStartY, x, y];
};

Path.splitRelativeSegment = function(segment, t) {
  'use strict';
  if (t < 0 || t > 1) {
    throw 'Invalid t: ' + t;
  }

  var type = segment[0];
  var segment1 = [];
  var segment2 = [];
  var EX,EY,FX,FY; //JavaScript doesn't have block scope and these are used for both 'q' and 'c'.

  if (type === 'm' || type === 'z') {
    throw 'Unable to split';
  } else if (type === 's' || type === 't') {
    throw 'Unable to split shorthand';
  } else if (type === 'a') {
    throw 'Allow';
  } else if (type === 'l') {
    segment1 = ['l', t * segment[1], t * (segment[2])];
    segment2 = ['l', (1 - t) * segment[1], (1 - t) * segment[2]];
    return [segment1, segment2];
  } else if (type === 'v' || type === 'h') {
    segment1 = [type, t * segment[1]];
    segment2 = [type, (1 - t) * segment[1]];
    return [segment1, segment2];
  } else if (type === 'c') {
    //Calculate the x co-ordinates first.
    EX = t * segment[1];
    FX = (1 - t) * segment[1] + t * segment[3];
    var GX = (1 - t) * segment[3] + t * segment[5];
    var HX = (1 - t) * EX + t * FX;
    var JX = (1 - t) * FX + t * GX;
    var KX = (1 - t) * HX + t * JX;
    //Calculate the y co-ordinates.
    EY = t * segment[2];
    FY = (1 - t) * segment[2] + t * segment[4];
    var GY = (1 - t) * segment[4] + t * segment[6];
    var HY = (1 - t) * EY + t * FY;
    var JY = (1 - t) * FY + t * GY;
    var KY = (1 - t) * HY + t * JY;

    segment1 = ['c', EX, EY, HX, HY, KX, KY];
    segment2 = ['c', JX - KX, JY - KY, GX - KX, GY - KY, segment[5] - KX, segment[6] - KY];

    return [segment1, segment2];
  }else if (type === 'q') {
    // Calculate the x coordinates first
    var DX = t * segment[1];
    EX = (1 - t) * segment[1] + t * segment[3];
    FX = (1 - t) * DX + t * EX;
    //Calculate the y coordinates
    var DY = t * segment[2];
    EY = (1 - t) * segment[2] + t * segment[4];
    FY = (1 - t) * DY + t * EY;

    segment1 = ['q', DX, DY, FX, FY];
    segment2 = ['q', EX - FX, EY - FY, segment[3] - FX, segment[4] - FY];

    return [segment1, segment2];
  }
};

Path.getRelativeSegmentLengthAtPoints = function(segment, points, tol) {
  'use strict';
  var type = segment[0];
  var lengths = [];
  var i; //Javascript doesn't have block scope.
  if (type === 'm') {
    for (i = 0; i < points.length; i++) {
      lengths.push(0);
    }
    return lengths;
  } else if (['z', 's', 't', 'a'].indexOf(type) !== -1) {
    throw 'length of ' + type + ' is not supported';
  } else if (type === 'l') {
    for (i = 0; i < points.length; i++) {
      lengths.push(Math.sqrt(segment[1] * segment[1] + segment[2] * segment[2]) * points[i]);
    }
    return lengths;
  } else if (type === 'v' || type === 'h') {
    for (i = 0; i < points.length; i++) {
      lengths.push(Math.abs(segment[1]) * points[i]);
    }
    return lengths;
  } else {
    //We use adaptive simpson. Gauss-Kronrod may be better but I don't think it is worth it.
    tol = tol / points.length;
    lengths.push(Path.adaptiveSimpson(segment, 0, points[0], tol));
    for (i = 1; i < points.length; i++) {
      lengths.push(lengths[i - 1] + Path.adaptiveSimpson(segment, points[i - 1], points[i], tol));
    }
    return lengths;
  }
};

Path.lengthIntegrandC = function(segment, t) {
  'use strict';
  var dx = 3 * (1 - t) * (1 - t) * segment[1] + 6 * (1 - t) * t * (segment[3] - segment[1]) + 3 * t * t * (segment[5] - segment[3]);
  var dy = 3 * (1 - t) * (1 - t) * segment[2] + 6 * (1 - t) * t * (segment[4] - segment[2]) + 3 * t * t * (segment[6] - segment[4]);
  return Math.sqrt(dx * dx + dy * dy);
};

Path.lengthIntegrandQ = function(segment, t) {
  'use strict';
  var dx = 2 * (1 - t) * segment[1] + 2 * t * (segment[3] - segment[1]);
  var dy = 2 * (1 - t) * segment[2] + 2 * t * (segment[4] - segment[2]);
  return Math.sqrt(dx * dx + dy * dy);
};

Path.adaptiveSimpson = function(segment, a, b, tol, maxDepth) {
  'use strict';
  if (typeof tol === 'undefined') {
    tol = 1e-6;
  }
  if (typeof maxDepth === 'undefined') {
    maxDepth = 10;
  }
  var f;
  if (segment[0] === 'c') {
    f = function(t) {return Path.lengthIntegrandC(segment, t);};
  } else {
    f = function(t) {return Path.lengthIntegrandQ(segment, t);};
  }
  //Calculate an initial value
  var fa = f(a);
  var fm = f(0.5 * (a + b));
  var fb = f(b);
  var initialValue = (b - a) / 6 * (fa + 4 * fm + fb);

  return Path.adaptiveSimpsonStep(f, a, b, fa, fm, fb, initialValue, tol, maxDepth, 1);
};

Path.adaptiveSimpsonStep = function(f, a, b, fa, fm, fb, initialValue, tol, maxDepth, currentDepth) {
  'use strict';
  var h = b - a;
  var f1m = f(a + h * 0.25);
  var f2m = f(b - h * 0.25);
  var firstHalf = h / 12 * (fa + 4 * f1m + fm);
  var secondHalf = h / 12 * (fm + 4 * f2m + fb);
  var totalValue = firstHalf + secondHalf;
  var errorEstimate = (totalValue - initialValue) / 15;
  if (currentDepth === maxDepth) {
    return totalValue + errorEstimate;
  } else if (Math.abs(errorEstimate) < tol) {
    return totalValue + errorEstimate;
  } else {
    var m = 0.5 * (a + b);
    firstHalf = Path.adaptiveSimpsonStep(f, a, m, fa, f1m, fm, firstHalf, tol * 0.5, maxDepth, currentDepth + 1);
    secondHalf = Path.adaptiveSimpsonStep(f, m, b, fm, f2m, fb, secondHalf, tol * 0.5, maxDepth, currentDepth + 1);
    return firstHalf + (+secondHalf);
  }
};

Path.getTValueAtLength = function(relativeSegment, length, tol) {
  'use strict';
  var lengthOfSegment = 0;
  if (['z','s','t','a'].indexOf(relativeSegment[0]) !== -1) {
    throw relativeSegment[0] + ' is not supported';
  }else if (['m','l','v','h'].indexOf(relativeSegment[0]) !== -1) {
    lengthOfSegment = Path.getRelativeSegmentLengthAtPoints(relativeSegment, [1], 1e-8);
    if (lengthOfSegment === 0) {
      return 0;
    }
    return length / lengthOfSegment;
  }else {
    var pointsToCheck;
    var arrayOfLengths;
    var a = 0;
    var b = 1;
    var width = b - a;
    while (width > tol) {
      pointsToCheck = [];
      for (var i = 0; i < 11; i++) {
        pointsToCheck.push(a + width * i / 10);
      }
      arrayOfLengths = Path.getRelativeSegmentLengthAtPoints(relativeSegment, pointsToCheck, tol);
      for (i = 0; i < arrayOfLengths.length - 1; i++) {
        if (arrayOfLengths[i] >= length) {
          break;
        }
      }
      b = a + width * i / 10;
      a = a + width * Math.max(i - 1, 0) / 10;
      width = b - a;
    }
    return (a + b) / 2;
  }
};

//These functions only relate to curves.
Path.getPointOnRelativeCurveAt = function(segment, t) {
  'use strict';
  var x = 3 * (1 - +t) * (1 - +t) * t * segment[1] + 3 * (1 - +t) * t * t * segment[3] + t * t * t * segment[5];
  var y = 3 * (1 - +t) * (1 - +t) * t * segment[2] + 3 * (1 - +t) * t * t * segment[4] +  t * t * t * segment[6];
  return [x, y];
};

// Functions on the whole path. These are often just applying the functions on segments over all the segments.

Path.prototype.getArrayOfSegments = function() {
  // NOTE: This doesn't check that the path is valid.
  'use strict';
  var arrayOfSegments = [];

  var currentSegment = [];
  var type = '';
  var length = '';
  var char = '';
  var endOfNumber;
  for (var i = 0; i < this.path.length; i++) {
    //Check if type has changed.
    char = this.path.charAt(i).toLowerCase();
    if (types.indexOf(char) !== -1) {
      type = this.path.charAt(i);
      length = lengths[types.indexOf(char)];
      currentSegment = [type];
      if (char === 'z') {
        arrayOfSegments.push(currentSegment);
      }
    } else if (char !== ' ' && char !== ',') {
      //We are a number
      endOfNumber = Path.findEndOfNumber(this.path, i);
      currentSegment.push(this.path.substring(i, endOfNumber + 1));
      i = endOfNumber;
      if (currentSegment.length === length + 1) {
        arrayOfSegments.push(currentSegment);
        currentSegment = [type];
      }
    }

  }
  return arrayOfSegments;
};

Path.prototype.getRelativeArrayOfSegments = function() {
  'use strict';
  var arrayOfSegments = this.getArrayOfSegments();

  var pathSectionStartX = 0;
  var pathSectionStartY = 0;
  var currentX = 0;
  var currentY = 0;

  var segment;
  var type;
  var newCoordinates;
  for (var i = 0; i < arrayOfSegments.length; i++) {
    segment = arrayOfSegments[i];
    if (types.indexOf(segment[0]) === -1) {
      // The segment is absolute;
      type = segment[0].toLowerCase();
      segment[0] = type;
      if (type === 'm' || type === 'l' || type === 't') {
        segment[1] = segment[1] - +currentX;
        segment[2] = segment[2] - +currentY;
      } else if (type === 'c') {
        segment[1] = segment[1] - +currentX;
        segment[2] = segment[2] - +currentY;
        segment[3] = segment[3] - +currentX;
        segment[4] = segment[4] - +currentY;
        segment[5] = segment[5] - +currentX;
        segment[6] = segment[6] - +currentY;
      } else if (type === 'h') {
        segment[1] = segment[1] - +currentX;
      } else if (type === 'v') {
        segment[1] = segment[1] - +currentY;
      } else if (type === 's' || type === 'q') {
        segment[1] = segment[1] - +currentX;
        segment[2] = segment[2] - +currentY;
        segment[3] = segment[3] - +currentX;
        segment[4] = segment[4] - +currentY;
      } else if (type === 'a') {
        segment[6] = segment[6] - +currentX;
        segment[7] = segment[7] - +currentY;
      }
    }
    newCoordinates = Path.addRelativeSegmentToAbsolutePosition(pathSectionStartX, pathSectionStartY, currentX, currentY, segment);
    pathSectionStartX = newCoordinates[0];
    pathSectionStartY = newCoordinates[1];
    currentX = newCoordinates[2];
    currentY = newCoordinates[3];
  }
  return arrayOfSegments;
};

Path.prototype.getRelativeArrayOfSegmentsWithoutShortHand = function() {
  'use strict';
  var relativeArrayOfSegments  = this.getRelativeArrayOfSegments();

  var type;
  var segment;
  var previousSegment;
  // A path has to start with a move so we can ignore the first segment.
  // We are removing the shorthand as we go so we don't need to worry about 'ss' or 'tt'
  for (var i = 1; i < relativeArrayOfSegments.length; i++) {
    type = relativeArrayOfSegments[i][0];
    if (type === 's') {
      segment = relativeArrayOfSegments[i].slice(); //Deep copy.
      previousSegment = relativeArrayOfSegments[i - 1];
      if (previousSegment[0] === 'c') {
        relativeArrayOfSegments[i] = ['c', previousSegment[5] - +previousSegment[3], previousSegment[6] - +previousSegment[4], segment[1], segment[2], segment[3], segment[4]];
      } else {
        relativeArrayOfSegments[i] = ['c', 0, 0, segment[1], segment[2], segment[3], segment[4]];
      }
    } else if (type === 't') {
      segment = relativeArrayOfSegments[i].slice(); //Deep copy.
      previousSegment = relativeArrayOfSegments[i - 1];
      if (previousSegment[0] === 'q') {
        relativeArrayOfSegments[i] = ['c', previousSegment[3] - +previousSegment[1], previousSegment[4] - +previousSegment[2], segment[1], segment[2]];
      } else {
        relativeArrayOfSegments[i] = ['c', 0, 0, segment[1], segment[2]];
      }
    }
  }
  return relativeArrayOfSegments;
};

Path.prototype.getCanonicalForm = function() {
  'use strict';
  var array = this.getRelativeArrayOfSegmentsWithoutShortHand();

  for (var i = array.length - 1; i > -1; i--) {
    if (array[i][0] === 'z' && i < array.length - 2 && array[i + 1][0] !== 'm') {
      array.splice(i + 1, 0 , ['m', 0 , 0]);
    }
  }

  var currentX = 0;
  var currentY = 0;
  var startX = 0;
  var startY = 0;

  var positionUpdate;
  var length = array.length;
  var numberOfSegmentsAdded = 0;
  for (var i = 1; i < length; i++) {
    var segment = array[i + numberOfSegmentsAdded];
    if (segment[0] === 'z' && (startX !== currentX || startY != currentY)) {
      var closingSegment = ["l",startX - currentX, startY - currentY];
      array.splice(i+numberOfSegmentsAdded, 0, closingSegment);
      numberOfSegmentsAdded++;
    }
    positionUpdate = Path.addRelativeSegmentToAbsolutePosition(startX, startY, currentX, currentY, segment);
    startX = positionUpdate[0];
    startY = positionUpdate[1];
    currentX = positionUpdate[2];
    currentY = positionUpdate[3];
  }
  return array;
};

Path.prototype.createArrayOfLengths = function() {
  'use strict';
  var segments = this.canonicalForm;

  var currentX  = 0;
  var currentY = 0;
  var startX = 0;
  var startY = 0;

  var positionUpdate;
  var lengths = [0]; //Note that we start with a move of zero length;

  var lengthOfSegment;
  for (var i = 1; i < segments.length; i++) {
    if (segments[i][0] !== 'z') {
      lengthOfSegment = Path.getRelativeSegmentLengthAtPoints(segments[i], [1], 1e-10)[0];
      lengths.push(lengths[i - 1] + lengthOfSegment);
    }else {
      var dx = startX - currentX;
      var dy = startY - currentY;
      lengthOfSegment = Math.sqrt(dx * dx + dy * dy);
      lengths.push(lengths[i - 1] + lengthOfSegment);
    }

    positionUpdate = Path.addRelativeSegmentToAbsolutePosition(startX, startY, currentX, currentY, segments[i]);
    startX = positionUpdate[0];
    startY = positionUpdate[1];
    currentX = positionUpdate[2];
    currentY = positionUpdate[3];
  }

  return lengths;
};

Path.prototype.translatePath = function(x, y) {
  'use strict';
  var segments = this.canonicalForm;
  segments[0][1] = +segments[0][1] + (+x);
  segments[0][2] = +segments[0][2] + (+y);
  this.path = Path.convertArrayToString(segments);
  return this;
};

Path.prototype.scalePath = function(x, y) {
  'use strict';
  var segments = this.canonicalForm;
  if (y === null || y === undefined) {
    y = x;
  }
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    var type = segment[0];
    if (type === 'm') {
      segment[1] = segment[1] * x;
      segment[2] = segment[2] * y;
    }else if (type === 'c') {
      segment[1] = segment[1] * x;
      segment[2] = segment[2] * y;
      segment[3] = segment[3] * x;
      segment[4] = segment[4] * y;
      segment[5] = segment[5] * x;
      segment[6] = segment[6] * y;
    }
  }
  this.path = Path.convertArrayToString(segments);
};
