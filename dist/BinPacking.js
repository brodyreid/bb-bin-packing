(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("BinPacking", [], factory);
	else if(typeof exports === 'object')
		exports["BinPacking"] = factory();
	else
		root["BinPacking"] = factory();
})(this, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../node_modules/clone/clone.js":
/*!**************************************!*\
  !*** ../node_modules/clone/clone.js ***!
  \**************************************/
/***/ (function(module) {

var clone = (function() {
'use strict';

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
*/
function clone(parent, circular, depth, prototype) {
  var filter;
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    filter = circular.filter;
    circular = circular.circular
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth == 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      if (Buffer.allocUnsafe) {
        // Node.js >= 4.5.0
        child = Buffer.allocUnsafe(parent.length);
      } else {
        // Older Node.js versions
        child = new Buffer(parent.length);
      }
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
};
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
};
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
};
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
};
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
};
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if ( true && module.exports) {
  module.exports = clone;
}


/***/ }),

/***/ "../node_modules/console.table/index.js":
/*!**********************************************!*\
  !*** ../node_modules/console.table/index.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function () {
  'use strict';

  function setupConsoleTable() {
    if (typeof console === 'undefined') {
      throw new Error('Weird, console object is undefined');
    }
    if (typeof console.table === 'function') {
      // if it is not OUR function, overwrite it
      if (console.table === consoleTable) {
        return;
      }
    }

    function isType(t, x) {
      return typeof x === t;
    }

    var isString = isType.bind(null, 'string');

    function isArrayOf(isTypeFn, a) {
      return Array.isArray(a) &&
        a.every(isTypeFn);
    }

    var isArrayOfStrings = isArrayOf.bind(null, isString);
    var isArrayOfArrays = isArrayOf.bind(null, Array.isArray);

    var Table = __webpack_require__(/*! easy-table */ "../node_modules/easy-table/table.js");

    function arrayToString(arr) {
      var t = new Table();
      arr.forEach(function (record) {
        if (typeof record === 'string' ||
          typeof record === 'number') {
          t.cell('item', record);
        } else {
          // assume plain object
          Object.keys(record).forEach(function (property) {
            t.cell(property, record[property]);
          });
        }
        t.newRow();
      });
      return t.toString();
    }

    function printTableWithColumnTitles(titles, items,noConsole) {
      var t = new Table();
      items.forEach(function (item) {
        item.forEach(function (value, k) {
          t.cell(titles[k], value);
        });
        t.newRow();
      });
      var str = t.toString();

      return noConsole ? str : console.log(str);
    }

    function printTitleTable(title, arr) {
      var str = arrayToString(arr);
      var rowLength = str.indexOf('\n');
      if (rowLength > 0) {
        if (title.length > rowLength) {
          rowLength = title.length;
        }
        console.log(title);
        var sep = '-', k, line = '';
        for (k = 0; k < rowLength; k += 1) {
          line += sep;
       }
        console.log(line);
      }
      console.log(str);
    }

    function getTitleTable(title, arr) {
      var str = arrayToString(arr);
      var rowLength = str.indexOf('\n');
      var strToReturn = '';
      if (rowLength > 0) {
        if (title.length > rowLength) {
          rowLength = title.length;
        }
        
        strToReturn += title + '\n';
        var sep = '-', k, line = '';
        for (k = 0; k < rowLength; k += 1) {
          line += sep;
        }
	
        strToReturn += line + '\n';
      }

      return strToReturn + str;
    }

    function objectToArray(obj) {
      var keys = Object.keys(obj);
      return keys.map(function (key) {
        return {
          key: key,
          value: obj[key]
        };
      });
    }

    function objectToString(obj) {
      return arrayToString(objectToArray(obj));
    }

    function consoleTable () {
      var args = Array.prototype.slice.call(arguments);

      if (args.length === 2 &&
        typeof args[0] === 'string' &&
        Array.isArray(args[1])) {

        return printTitleTable(args[0], args[1]);
      }

      if (args.length === 2 &&
        isArrayOfStrings(args[0]) &&
        isArrayOfArrays(args[1])) {
        return printTableWithColumnTitles(args[0], args[1]);
      }

      args.forEach(function (k) {
        if (typeof k === 'string') {
          return console.log(k);
        } else if (Array.isArray(k)) {
          console.log(arrayToString(k));
        } else if (typeof k === 'object') {
          console.log(objectToString(k));
        }
      });
    }

    module.exports.getTable = function(){
      var args = Array.prototype.slice.call(arguments);

      var strToReturn = '';

      if (args.length === 2 &&
        typeof args[0] === 'string' &&
        Array.isArray(args[1])) {

        return getTitleTable(args[0], args[1]);
      }

      if (args.length === 2 &&
        isArrayOfStrings(args[0]) &&
        isArrayOfArrays(args[1])) {
        return printTableWithColumnTitles(args[0], args[1],true);
      }

      args.forEach(function (k,i) {
        if (typeof k === 'string') {
          strToReturn += k;
	  if (i !== args.length - 1){
	    strToReturn += '\n';
	  }
          return ;
        } else if (Array.isArray(k)) {
          strToReturn += arrayToString(k) + '\n';
        } else if (typeof k === 'object') {
          strToReturn += objectToString(k);
        }
      });

      return strToReturn;
    };

    console.table = consoleTable;
  }

  setupConsoleTable();
}());


/***/ }),

/***/ "../node_modules/defaults/index.js":
/*!*****************************************!*\
  !*** ../node_modules/defaults/index.js ***!
  \*****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var clone = __webpack_require__(/*! clone */ "../node_modules/clone/clone.js");

module.exports = function(options, defaults) {
  options = options || {};

  Object.keys(defaults).forEach(function(key) {
    if (typeof options[key] === 'undefined') {
      options[key] = clone(defaults[key]);
    }
  });

  return options;
};

/***/ }),

/***/ "../node_modules/easy-table/table.js":
/*!*******************************************!*\
  !*** ../node_modules/easy-table/table.js ***!
  \*******************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var wcwidth

try {
  wcwidth = __webpack_require__(/*! wcwidth */ "../node_modules/wcwidth/index.js")
} catch(e) {}

module.exports = Table

function Table() {
  this.rows = []
  this.row = {__printers : {}}
}

/**
 * Push the current row to the table and start a new one
 *
 * @returns {Table} `this`
 */

Table.prototype.newRow = function() {
  this.rows.push(this.row)
  this.row = {__printers : {}}
  return this
}

/**
 * Write cell in the current row
 *
 * @param {String} col          - Column name
 * @param {Any} val             - Cell value
 * @param {Function} [printer]  - Printer function to format the value
 * @returns {Table} `this`
 */

Table.prototype.cell = function(col, val, printer) {
  this.row[col] = val
  this.row.__printers[col] = printer || string
  return this
}

/**
 * String to separate columns
 */

Table.prototype.separator = '  '

function string(val) {
  return val === undefined ? '' : ''+val
}

function length(str) {
  var s = str.replace(/\u001b\[\d+m/g, '')
  return wcwidth == null ? s.length : wcwidth(s)
}

/**
 * Default printer
 */

Table.string = string

/**
 * Create a printer which right aligns the content by padding with `ch` on the left
 *
 * @param {String} ch
 * @returns {Function}
 */

Table.leftPadder = leftPadder

function leftPadder(ch) {
  return function(val, width) {
    var str = string(val)
    var len = length(str)
    var pad = width > len ? Array(width - len + 1).join(ch) : ''
    return pad + str
  }
}

/**
 * Printer which right aligns the content
 */

var padLeft = Table.padLeft = leftPadder(' ')

/**
 * Create a printer which pads with `ch` on the right
 *
 * @param {String} ch
 * @returns {Function}
 */

Table.rightPadder = rightPadder

function rightPadder(ch) {
  return function padRight(val, width) {
    var str = string(val)
    var len = length(str)
    var pad = width > len ? Array(width - len + 1).join(ch) : ''
    return str + pad
  }
}

var padRight = rightPadder(' ')

/**
 * Create a printer for numbers
 *
 * Will do right alignment and optionally fix the number of digits after decimal point
 *
 * @param {Number} [digits] - Number of digits for fixpoint notation
 * @returns {Function}
 */

Table.number = function(digits) {
  return function(val, width) {
    if (val == null) return ''
    if (typeof val != 'number')
      throw new Error(''+val + ' is not a number')
    var str = digits == null ? val+'' : val.toFixed(digits)
    return padLeft(str, width)
  }
}

function each(row, fn) {
  for(var key in row) {
    if (key == '__printers') continue
    fn(key, row[key])
  }
}

/**
 * Get list of columns in printing order
 *
 * @returns {string[]}
 */

Table.prototype.columns = function() {
  var cols = {}
  for(var i = 0; i < 2; i++) { // do 2 times
    this.rows.forEach(function(row) {
      var idx = 0
      each(row, function(key) {
        idx = Math.max(idx, cols[key] || 0)
        cols[key] = idx
        idx++
      })
    })
  }
  return Object.keys(cols).sort(function(a, b) {
    return cols[a] - cols[b]
  })
}

/**
 * Format just rows, i.e. print the table without headers and totals
 *
 * @returns {String} String representaion of the table
 */

Table.prototype.print = function() {
  var cols = this.columns()
  var separator = this.separator
  var widths = {}
  var out = ''

  // Calc widths
  this.rows.forEach(function(row) {
    each(row, function(key, val) {
      var str = row.__printers[key].call(row, val)
      widths[key] = Math.max(length(str), widths[key] || 0)
    })
  })

  // Now print
  this.rows.forEach(function(row) {
    var line = ''
    cols.forEach(function(key) {
      var width = widths[key]
      var str = row.hasOwnProperty(key)
        ? ''+row.__printers[key].call(row, row[key], width)
        : ''
      line += padRight(str, width) + separator
    })
    line = line.slice(0, -separator.length)
    out += line + '\n'
  })

  return out
}

/**
 * Format the table
 *
 * @returns {String}
 */

Table.prototype.toString = function() {
  var cols = this.columns()
  var out = new Table()

  // copy options
  out.separator = this.separator

  // Write header
  cols.forEach(function(col) {
    out.cell(col, col)
  })
  out.newRow()
  out.pushDelimeter(cols)

  // Write body
  out.rows = out.rows.concat(this.rows)

  // Totals
  if (this.totals && this.rows.length) {
    out.pushDelimeter(cols)
    this.forEachTotal(out.cell.bind(out))
    out.newRow()
  }

  return out.print()
}

/**
 * Push delimeter row to the table (with each cell filled with dashs during printing)
 *
 * @param {String[]} [cols]
 * @returns {Table} `this`
 */

Table.prototype.pushDelimeter = function(cols) {
  cols = cols || this.columns()
  cols.forEach(function(col) {
    this.cell(col, undefined, leftPadder('-'))
  }, this)
  return this.newRow()
}

/**
 * Compute all totals and yield the results to `cb`
 *
 * @param {Function} cb - Callback function with signature `(column, value, printer)`
 */

Table.prototype.forEachTotal = function(cb) {
  for(var key in this.totals) {
    var aggr = this.totals[key]
    var acc = aggr.init
    var len = this.rows.length
    this.rows.forEach(function(row, idx) {
      acc = aggr.reduce.call(row, acc, row[key], idx, len)
    })
    cb(key, acc, aggr.printer)
  }
}

/**
 * Format the table so that each row represents column and each column represents row
 *
 * @param {Object} [opts]
 * @param {String} [ops.separator] - Column separation string
 * @param {Function} [opts.namePrinter] - Printer to format column names
 * @returns {String}
 */

Table.prototype.printTransposed = function(opts) {
  opts = opts || {}
  var out = new Table
  out.separator = opts.separator || this.separator
  this.columns().forEach(function(col) {
    out.cell(0, col, opts.namePrinter)
    this.rows.forEach(function(row, idx) {
      out.cell(idx+1, row[col], row.__printers[col])
    })
    out.newRow()
  }, this)
  return out.print()
}

/**
 * Sort the table
 *
 * @param {Function|string[]} [cmp] - Either compare function or a list of columns to sort on
 * @returns {Table} `this`
 */

Table.prototype.sort = function(cmp) {
  if (typeof cmp == 'function') {
    this.rows.sort(cmp)
    return this
  }

  var keys = Array.isArray(cmp) ? cmp : this.columns()

  var comparators = keys.map(function(key) {
    var order = 'asc'
    var m = /(.*)\|\s*(asc|des)\s*$/.exec(key)
    if (m) {
      key = m[1]
      order = m[2]
    }
    return function (a, b) {
      return order == 'asc'
        ? compare(a[key], b[key])
        : compare(b[key], a[key])
    }
  })

  return this.sort(function(a, b) {
    for (var i = 0; i < comparators.length; i++) {
      var order = comparators[i](a, b)
      if (order != 0) return order
    }
    return 0
  })
}

function compare(a, b) {
  if (a === b) return 0
  if (a === undefined) return 1
  if (b === undefined) return -1
  if (a === null) return 1
  if (b === null) return -1
  if (a > b) return 1
  if (a < b) return -1
  return compare(String(a), String(b))
}

/**
 * Add a total for the column
 *
 * @param {String} col - column name
 * @param {Object} [opts]
 * @param {Function} [opts.reduce = sum] - reduce(acc, val, idx, length) function to compute the total value
 * @param {Function} [opts.printer = padLeft] - Printer to format the total cell
 * @param {Any} [opts.init = 0] - Initial value for reduction
 * @returns {Table} `this`
 */

Table.prototype.total = function(col, opts) {
  opts = opts || {}
  this.totals = this.totals || {}
  this.totals[col] = {
    reduce: opts.reduce || Table.aggr.sum,
    printer: opts.printer || padLeft,
    init: opts.init == null ? 0 : opts.init
  }
  return this
}

/**
 * Predefined helpers for totals
 */

Table.aggr = {}

/**
 * Create a printer which formats the value with `printer`,
 * adds the `prefix` to it and right aligns the whole thing
 *
 * @param {String} prefix
 * @param {Function} printer
 * @returns {printer}
 */

Table.aggr.printer = function(prefix, printer) {
  printer = printer || string
  return function(val, width) {
    return padLeft(prefix + printer(val), width)
  }
}

/**
 * Sum reduction
 */

Table.aggr.sum = function(acc, val) {
  return acc + val
}

/**
 * Average reduction
 */

Table.aggr.avg = function(acc, val, idx, len) {
  acc = acc + val
  return idx + 1 == len ? acc/len : acc
}

/**
 * Print the array or object
 *
 * @param {Array|Object} obj - Object to print
 * @param {Function|Object} [format] - Format options
 * @param {Function} [cb] - Table post processing and formating
 * @returns {String}
 */

Table.print = function(obj, format, cb) {
  var opts = format || {}

  format = typeof format == 'function'
    ? format
    : function(obj, cell) {
      for(var key in obj) {
        if (!obj.hasOwnProperty(key)) continue
        var params = opts[key] || {}
        cell(params.name || key, obj[key], params.printer)
      }
    }

  var t = new Table
  var cell = t.cell.bind(t)

  if (Array.isArray(obj)) {
    cb = cb || function(t) { return t.toString() }
    obj.forEach(function(item) {
      format(item, cell)
      t.newRow()
    })
  } else {
    cb = cb || function(t) { return t.printTransposed({separator: ' : '}) }
    format(obj, cell)
    t.newRow()
  }

  return cb(t)
}

/**
 * Same as `Table.print()` but yields the result to `console.log()`
 */

Table.log = function(obj, format, cb) {
  console.log(Table.print(obj, format, cb))
}

/**
 * Same as `.toString()` but yields the result to `console.log()`
 */

Table.prototype.log = function() {
  console.log(this.toString())
}


/***/ }),

/***/ "./2D/Bin.ts":
/*!*******************!*\
  !*** ./2D/Bin.ts ***!
  \*******************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FreeSpaceBox": function() { return /* binding */ FreeSpaceBox; }
/* harmony export */ });
/* harmony import */ var _heuristics_BestShortSideFit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./heuristics/BestShortSideFit */ "./2D/heuristics/BestShortSideFit.js");
/* harmony import */ var _Box__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Box */ "./2D/Box.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};


var Bin = /** @class */ (function () {
    function Bin(width, height, heuristic) {
        this.width = 0;
        this.height = 0;
        this.boxes = [];
        this.heuristic = null;
        this.freeRectangles = [];
        this.width = width;
        this.height = height;
        this.freeRectangles = [new FreeSpaceBox(width, height)];
        this.heuristic = heuristic || new _heuristics_BestShortSideFit__WEBPACK_IMPORTED_MODULE_0__.default();
    }
    Object.defineProperty(Bin.prototype, "area", {
        get: function () {
            return this.width * this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bin.prototype, "efficiency", {
        get: function () {
            var boxesArea = 0;
            this.boxes.forEach(function (box) {
                boxesArea += box.area;
            });
            return (boxesArea * 100) / this.area;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bin.prototype, "label", {
        get: function () {
            return "".concat(this.width, "x").concat(this.height, " ").concat(this.efficiency, "%");
        },
        enumerable: false,
        configurable: true
    });
    Bin.prototype.insert = function (box) {
        if (box.packed)
            return false;
        this.heuristic.findPositionForNewNode(box, this.freeRectangles);
        if (!box.packed)
            return false;
        var numRectanglesToProcess = this.freeRectangles.length;
        var i = 0;
        while (i < numRectanglesToProcess) {
            if (this.splitFreeNode(this.freeRectangles[i], box)) {
                this.freeRectangles.splice(i, 1);
                numRectanglesToProcess--;
            }
            else {
                i++;
            }
        }
        this.pruneFreeList();
        this.boxes.push(box);
        return true;
    };
    Bin.prototype.scoreFor = function (box) {
        var copyBox = new _Box__WEBPACK_IMPORTED_MODULE_1__.default(box.width, box.height, box.constrainRotation);
        var score = this.heuristic.findPositionForNewNode(copyBox, this.freeRectangles);
        return score;
    };
    Bin.prototype.isLargerThan = function (box) {
        return ((this.width >= box.width && this.height >= box.height) ||
            (this.height >= box.width && this.width >= box.height));
    };
    Bin.prototype.splitFreeNode = function (freeNode, usedNode) {
        // Test with SAT if the rectangles even intersect.
        if (usedNode.x >= freeNode.x + freeNode.width ||
            usedNode.x + usedNode.width <= freeNode.x ||
            usedNode.y >= freeNode.y + freeNode.height ||
            usedNode.y + usedNode.height <= freeNode.y) {
            return false;
        }
        this.trySplitFreeNodeVertically(freeNode, usedNode);
        this.trySplitFreeNodeHorizontally(freeNode, usedNode);
        return true;
    };
    Bin.prototype.trySplitFreeNodeVertically = function (freeNode, usedNode) {
        if (usedNode.x < freeNode.x + freeNode.width &&
            usedNode.x + usedNode.width > freeNode.x) {
            this.tryLeaveFreeSpaceAtTop(freeNode, usedNode);
            this.tryLeaveFreeSpaceAtBottom(freeNode, usedNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceAtTop = function (freeNode, usedNode) {
        if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height) {
            var newNode = __assign({}, freeNode);
            newNode.height = usedNode.y - newNode.y;
            this.freeRectangles.push(newNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceAtBottom = function (freeNode, usedNode) {
        if (usedNode.y + usedNode.height < freeNode.y + freeNode.height) {
            var newNode = __assign({}, freeNode);
            newNode.y = usedNode.y + usedNode.height;
            newNode.height =
                freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
            this.freeRectangles.push(newNode);
        }
    };
    Bin.prototype.trySplitFreeNodeHorizontally = function (freeNode, usedNode) {
        if (usedNode.y < freeNode.y + freeNode.height &&
            usedNode.y + usedNode.height > freeNode.y) {
            this.tryLeaveFreeSpaceOnLeft(freeNode, usedNode);
            this.tryLeaveFreeSpaceOnRight(freeNode, usedNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceOnLeft = function (freeNode, usedNode) {
        if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width) {
            var newNode = __assign({}, freeNode);
            newNode.width = usedNode.x - newNode.x;
            this.freeRectangles.push(newNode);
        }
    };
    Bin.prototype.tryLeaveFreeSpaceOnRight = function (freeNode, usedNode) {
        if (usedNode.x + usedNode.width < freeNode.x + freeNode.width) {
            var newNode = __assign({}, freeNode);
            newNode.x = usedNode.x + usedNode.width;
            newNode.width =
                freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
            this.freeRectangles.push(newNode);
        }
    };
    /**
     * Goes through the free rectangle list and removes any redundant entries.
     */
    Bin.prototype.pruneFreeList = function () {
        var i = 0;
        while (i < this.freeRectangles.length) {
            var j = i + 1;
            if (j === this.freeRectangles.length) {
                break;
            }
            while (j < this.freeRectangles.length) {
                if (this.isContainedIn(this.freeRectangles[i], this.freeRectangles[j])) {
                    this.freeRectangles.splice(i, 1);
                    i--;
                    break;
                }
                if (this.isContainedIn(this.freeRectangles[j], this.freeRectangles[i])) {
                    this.freeRectangles.splice(j, 1);
                }
                else {
                    j++;
                }
                i++;
            }
        }
    };
    Bin.prototype.isContainedIn = function (rectA, rectB) {
        return (rectA &&
            rectB &&
            rectA.x >= rectB.x &&
            rectA.y >= rectB.y &&
            rectA.x + rectA.width <= rectB.x + rectB.width &&
            rectA.y + rectA.height <= rectB.y + rectB.height);
    };
    return Bin;
}());
/* harmony default export */ __webpack_exports__["default"] = (Bin);
var FreeSpaceBox = /** @class */ (function () {
    function FreeSpaceBox(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = null;
        this.height = null;
        this.width = width;
        this.height = height;
    }
    return FreeSpaceBox;
}());



/***/ }),

/***/ "./2D/Box.ts":
/*!*******************!*\
  !*** ./2D/Box.ts ***!
  \*******************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Box = /** @class */ (function () {
    function Box(width, height, constrainRotation) {
        if (constrainRotation === void 0) { constrainRotation = false; }
        this.width = 0;
        this.height = 0;
        this.constrainRotation = false;
        this.x = 0;
        this.y = 0;
        this.packed = false;
        this.width = width;
        this.height = height;
        // Avoid the packer to try the rotated dimensions
        this.constrainRotation = constrainRotation;
    }
    Box.prototype.rotate = function () {
        var _a = this, width = _a.width, height = _a.height;
        this.width = height;
        this.height = width;
    };
    Object.defineProperty(Box.prototype, "label", {
        get: function () {
            return "".concat(this.width, "x").concat(this.height, " at [").concat(this.x, ",").concat(this.y, "]");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "area", {
        get: function () {
            return this.width * this.height;
        },
        enumerable: false,
        configurable: true
    });
    return Box;
}());
/* harmony default export */ __webpack_exports__["default"] = (Box);


/***/ }),

/***/ "./2D/Packer.ts":
/*!**********************!*\
  !*** ./2D/Packer.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Score__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Score */ "./2D/Score.ts");
/* harmony import */ var _ScoreBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ScoreBoard */ "./2D/ScoreBoard.ts");


var Packer = /** @class */ (function () {
    function Packer(bins) {
        this.bins = [];
        this.unpackedBoxes = [];
        this.bins = bins;
    }
    Packer.prototype.pack = function (boxes, options) {
        if (options === void 0) { options = {}; }
        var packedBoxes = [];
        var entry;
        boxes = boxes.filter(function (box) { return !box.packed; });
        if (boxes.length === 0)
            return packedBoxes;
        var limit = options.limit || _Score__WEBPACK_IMPORTED_MODULE_0__.default.MAX_INT;
        var board = new _ScoreBoard__WEBPACK_IMPORTED_MODULE_1__.default(this.bins, boxes);
        while ((entry = board.bestFit())) {
            entry.bin.insert(entry.box);
            board.removeBox(entry.box);
            board.recalculateBin(entry.bin);
            packedBoxes.push({ box: entry.box, score: entry.score });
            if (packedBoxes.length >= limit) {
                break;
            }
        }
        this.unpackedBoxes = boxes.filter(function (box) {
            return !box.packed;
        });
        return packedBoxes;
    };
    return Packer;
}());
/* harmony default export */ __webpack_exports__["default"] = (Packer);


/***/ }),

/***/ "./2D/Score.ts":
/*!*********************!*\
  !*** ./2D/Score.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Score = /** @class */ (function () {
    function Score(score_1, score_2) {
        this.score_1 = Score.MAX_INT;
        this.score_2 = Score.MAX_INT;
        if (typeof score_1 != 'undefined')
            this.score_1 = score_1;
        if (typeof score_2 != 'undefined')
            this.score_2 = score_2;
    }
    /**
     * Lower is better
     */
    Score.prototype.valueOf = function () {
        return (this.score_1 + this.score_2);
    };
    Score.prototype.assign = function (other) {
        this.score_1 = other.score_1;
        this.score_2 = other.score_2;
    };
    Score.prototype.isBlank = function () {
        return this.score_1 === Score.MAX_INT;
    };
    Score.prototype.decreaseBy = function (delta) {
        this.score_1 += delta;
        this.score_2 += delta;
    };
    Score.MAX_INT = Number.MAX_SAFE_INTEGER;
    return Score;
}());
/* harmony default export */ __webpack_exports__["default"] = (Score);


/***/ }),

/***/ "./2D/ScoreBoard.ts":
/*!**************************!*\
  !*** ./2D/ScoreBoard.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ScoreBoardEntry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScoreBoardEntry */ "./2D/ScoreBoardEntry.ts");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};

var ScoreBoard = /** @class */ (function () {
    function ScoreBoard(bins, boxes) {
        var _this = this;
        this.entries = [];
        bins.forEach(function (bin) {
            _this.addBinEntries(bin, boxes);
        });
    }
    ScoreBoard.prototype.debug = function () {
        __webpack_require__(/*! console.table */ "../node_modules/console.table/index.js");
        console.table(this.entries.map(function (entry) { return ({
            bin: entry.bin.label,
            box: entry.box.label,
            score: entry.score,
        }); }));
    };
    ScoreBoard.prototype.addBinEntries = function (bin, boxes) {
        var _this = this;
        boxes.forEach(function (box) {
            var entry = new _ScoreBoardEntry__WEBPACK_IMPORTED_MODULE_0__.default(bin, box);
            entry.calculate();
            _this.entries.push(entry);
        });
    };
    ScoreBoard.prototype.largestNotFitingBox = function () {
        var unfit;
        var fittingBoxes = this.entries
            .filter(function (entry) { return entry.fit; })
            .map(function (entry) { return entry.box; });
        this.entries.forEach(function (entry) {
            if (!fittingBoxes.includes(entry.box)) {
                return;
            }
            if (unfit === null || unfit.box.area < entry.box.area) {
                unfit = entry;
            }
        });
        return unfit.box ? unfit : false;
    };
    ScoreBoard.prototype.bestFit = function () {
        var best = null;
        for (var i = 0; i < this.entries.length; i++) {
            var entry = this.entries[i];
            if (!entry.fit()) {
                continue;
            }
            if (best === null || entry.score < best.score) {
                best = entry;
            }
        }
        return best;
    };
    ScoreBoard.prototype.removeBox = function (box) {
        this.entries = this.entries.filter(function (entry) {
            return entry.box !== box;
        });
    };
    ScoreBoard.prototype.addBin = function (bin) {
        this.addBinEntries(bin, this.currentBoxes());
    };
    ScoreBoard.prototype.recalculateBin = function (bin) {
        this.entries
            .filter(function (entry) { return entry.bin === bin; })
            .forEach(function (entry) { return entry.calculate(); });
    };
    ScoreBoard.prototype.currentBoxes = function () {
        return __spreadArray([], __read(new Set(this.entries.map(function (entry) { return entry.box; }))), false);
    };
    return ScoreBoard;
}());
/* harmony default export */ __webpack_exports__["default"] = (ScoreBoard);


/***/ }),

/***/ "./2D/ScoreBoardEntry.ts":
/*!*******************************!*\
  !*** ./2D/ScoreBoardEntry.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var ScoreBoardEntry = /** @class */ (function () {
    function ScoreBoardEntry(bin, box) {
        this.bin = bin;
        this.box = box;
    }
    ScoreBoardEntry.prototype.calculate = function () {
        this.score = this.bin.scoreFor(this.box);
        return this.score;
    };
    ScoreBoardEntry.prototype.fit = function () {
        return !this.score.isBlank();
    };
    return ScoreBoardEntry;
}());
/* harmony default export */ __webpack_exports__["default"] = (ScoreBoardEntry);


/***/ }),

/***/ "./2D/heuristics/Base.ts":
/*!*******************************!*\
  !*** ./2D/heuristics/Base.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Score__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Score */ "./2D/Score.ts");

var Base = /** @class */ (function () {
    function Base() {
    }
    Base.prototype.findPositionForNewNode = function (box, freeRects) {
        var _this = this;
        var bestScore = new _Score__WEBPACK_IMPORTED_MODULE_0__.default();
        var width = box.width;
        var height = box.height;
        freeRects.forEach(function (freeRect) {
            _this.tryPlaceRectIn(freeRect, box, width, height, bestScore);
            if (!box.constrainRotation) {
                _this.tryPlaceRectIn(freeRect, box, height, width, bestScore);
            }
        });
        return bestScore;
    };
    Base.prototype.tryPlaceRectIn = function (freeRect, box, rectWidth, rectHeight, bestScore) {
        if (freeRect.width >= rectWidth && freeRect.height >= rectHeight) {
            var score = this.calculateScore();
            if (score < bestScore) {
                box.x = freeRect.x;
                box.y = freeRect.y;
                box.width = rectWidth;
                box.height = rectHeight;
                box.packed = true;
                bestScore.assign(score);
            }
        }
    };
    Base.prototype.calculateScore = function () {
        throw 'NotImplementedError';
    };
    return Base;
}());
/* harmony default export */ __webpack_exports__["default"] = (Base);


/***/ }),

/***/ "../node_modules/wcwidth/combining.js":
/*!********************************************!*\
  !*** ../node_modules/wcwidth/combining.js ***!
  \********************************************/
/***/ (function(module) {

module.exports = [
    [ 0x0300, 0x036F ], [ 0x0483, 0x0486 ], [ 0x0488, 0x0489 ],
    [ 0x0591, 0x05BD ], [ 0x05BF, 0x05BF ], [ 0x05C1, 0x05C2 ],
    [ 0x05C4, 0x05C5 ], [ 0x05C7, 0x05C7 ], [ 0x0600, 0x0603 ],
    [ 0x0610, 0x0615 ], [ 0x064B, 0x065E ], [ 0x0670, 0x0670 ],
    [ 0x06D6, 0x06E4 ], [ 0x06E7, 0x06E8 ], [ 0x06EA, 0x06ED ],
    [ 0x070F, 0x070F ], [ 0x0711, 0x0711 ], [ 0x0730, 0x074A ],
    [ 0x07A6, 0x07B0 ], [ 0x07EB, 0x07F3 ], [ 0x0901, 0x0902 ],
    [ 0x093C, 0x093C ], [ 0x0941, 0x0948 ], [ 0x094D, 0x094D ],
    [ 0x0951, 0x0954 ], [ 0x0962, 0x0963 ], [ 0x0981, 0x0981 ],
    [ 0x09BC, 0x09BC ], [ 0x09C1, 0x09C4 ], [ 0x09CD, 0x09CD ],
    [ 0x09E2, 0x09E3 ], [ 0x0A01, 0x0A02 ], [ 0x0A3C, 0x0A3C ],
    [ 0x0A41, 0x0A42 ], [ 0x0A47, 0x0A48 ], [ 0x0A4B, 0x0A4D ],
    [ 0x0A70, 0x0A71 ], [ 0x0A81, 0x0A82 ], [ 0x0ABC, 0x0ABC ],
    [ 0x0AC1, 0x0AC5 ], [ 0x0AC7, 0x0AC8 ], [ 0x0ACD, 0x0ACD ],
    [ 0x0AE2, 0x0AE3 ], [ 0x0B01, 0x0B01 ], [ 0x0B3C, 0x0B3C ],
    [ 0x0B3F, 0x0B3F ], [ 0x0B41, 0x0B43 ], [ 0x0B4D, 0x0B4D ],
    [ 0x0B56, 0x0B56 ], [ 0x0B82, 0x0B82 ], [ 0x0BC0, 0x0BC0 ],
    [ 0x0BCD, 0x0BCD ], [ 0x0C3E, 0x0C40 ], [ 0x0C46, 0x0C48 ],
    [ 0x0C4A, 0x0C4D ], [ 0x0C55, 0x0C56 ], [ 0x0CBC, 0x0CBC ],
    [ 0x0CBF, 0x0CBF ], [ 0x0CC6, 0x0CC6 ], [ 0x0CCC, 0x0CCD ],
    [ 0x0CE2, 0x0CE3 ], [ 0x0D41, 0x0D43 ], [ 0x0D4D, 0x0D4D ],
    [ 0x0DCA, 0x0DCA ], [ 0x0DD2, 0x0DD4 ], [ 0x0DD6, 0x0DD6 ],
    [ 0x0E31, 0x0E31 ], [ 0x0E34, 0x0E3A ], [ 0x0E47, 0x0E4E ],
    [ 0x0EB1, 0x0EB1 ], [ 0x0EB4, 0x0EB9 ], [ 0x0EBB, 0x0EBC ],
    [ 0x0EC8, 0x0ECD ], [ 0x0F18, 0x0F19 ], [ 0x0F35, 0x0F35 ],
    [ 0x0F37, 0x0F37 ], [ 0x0F39, 0x0F39 ], [ 0x0F71, 0x0F7E ],
    [ 0x0F80, 0x0F84 ], [ 0x0F86, 0x0F87 ], [ 0x0F90, 0x0F97 ],
    [ 0x0F99, 0x0FBC ], [ 0x0FC6, 0x0FC6 ], [ 0x102D, 0x1030 ],
    [ 0x1032, 0x1032 ], [ 0x1036, 0x1037 ], [ 0x1039, 0x1039 ],
    [ 0x1058, 0x1059 ], [ 0x1160, 0x11FF ], [ 0x135F, 0x135F ],
    [ 0x1712, 0x1714 ], [ 0x1732, 0x1734 ], [ 0x1752, 0x1753 ],
    [ 0x1772, 0x1773 ], [ 0x17B4, 0x17B5 ], [ 0x17B7, 0x17BD ],
    [ 0x17C6, 0x17C6 ], [ 0x17C9, 0x17D3 ], [ 0x17DD, 0x17DD ],
    [ 0x180B, 0x180D ], [ 0x18A9, 0x18A9 ], [ 0x1920, 0x1922 ],
    [ 0x1927, 0x1928 ], [ 0x1932, 0x1932 ], [ 0x1939, 0x193B ],
    [ 0x1A17, 0x1A18 ], [ 0x1B00, 0x1B03 ], [ 0x1B34, 0x1B34 ],
    [ 0x1B36, 0x1B3A ], [ 0x1B3C, 0x1B3C ], [ 0x1B42, 0x1B42 ],
    [ 0x1B6B, 0x1B73 ], [ 0x1DC0, 0x1DCA ], [ 0x1DFE, 0x1DFF ],
    [ 0x200B, 0x200F ], [ 0x202A, 0x202E ], [ 0x2060, 0x2063 ],
    [ 0x206A, 0x206F ], [ 0x20D0, 0x20EF ], [ 0x302A, 0x302F ],
    [ 0x3099, 0x309A ], [ 0xA806, 0xA806 ], [ 0xA80B, 0xA80B ],
    [ 0xA825, 0xA826 ], [ 0xFB1E, 0xFB1E ], [ 0xFE00, 0xFE0F ],
    [ 0xFE20, 0xFE23 ], [ 0xFEFF, 0xFEFF ], [ 0xFFF9, 0xFFFB ],
    [ 0x10A01, 0x10A03 ], [ 0x10A05, 0x10A06 ], [ 0x10A0C, 0x10A0F ],
    [ 0x10A38, 0x10A3A ], [ 0x10A3F, 0x10A3F ], [ 0x1D167, 0x1D169 ],
    [ 0x1D173, 0x1D182 ], [ 0x1D185, 0x1D18B ], [ 0x1D1AA, 0x1D1AD ],
    [ 0x1D242, 0x1D244 ], [ 0xE0001, 0xE0001 ], [ 0xE0020, 0xE007F ],
    [ 0xE0100, 0xE01EF ]
]


/***/ }),

/***/ "../node_modules/wcwidth/index.js":
/*!****************************************!*\
  !*** ../node_modules/wcwidth/index.js ***!
  \****************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! defaults */ "../node_modules/defaults/index.js")
var combining = __webpack_require__(/*! ./combining */ "../node_modules/wcwidth/combining.js")

var DEFAULTS = {
  nul: 0,
  control: 0
}

module.exports = function wcwidth(str) {
  return wcswidth(str, DEFAULTS)
}

module.exports.config = function(opts) {
  opts = defaults(opts || {}, DEFAULTS)
  return function wcwidth(str) {
    return wcswidth(str, opts)
  }
}

/*
 *  The following functions define the column width of an ISO 10646
 *  character as follows:
 *  - The null character (U+0000) has a column width of 0.
 *  - Other C0/C1 control characters and DEL will lead to a return value
 *    of -1.
 *  - Non-spacing and enclosing combining characters (general category
 *    code Mn or Me in the
 *    Unicode database) have a column width of 0.
 *  - SOFT HYPHEN (U+00AD) has a column width of 1.
 *  - Other format characters (general category code Cf in the Unicode
 *    database) and ZERO WIDTH
 *    SPACE (U+200B) have a column width of 0.
 *  - Hangul Jamo medial vowels and final consonants (U+1160-U+11FF)
 *    have a column width of 0.
 *  - Spacing characters in the East Asian Wide (W) or East Asian
 *    Full-width (F) category as
 *    defined in Unicode Technical Report #11 have a column width of 2.
 *  - All remaining characters (including all printable ISO 8859-1 and
 *    WGL4 characters, Unicode control characters, etc.) have a column
 *    width of 1.
 *  This implementation assumes that characters are encoded in ISO 10646.
*/

function wcswidth(str, opts) {
  if (typeof str !== 'string') return wcwidth(str, opts)

  var s = 0
  for (var i = 0; i < str.length; i++) {
    var n = wcwidth(str.charCodeAt(i), opts)
    if (n < 0) return -1
    s += n
  }

  return s
}

function wcwidth(ucs, opts) {
  // test for 8-bit control characters
  if (ucs === 0) return opts.nul
  if (ucs < 32 || (ucs >= 0x7f && ucs < 0xa0)) return opts.control

  // binary search in table of non-spacing characters
  if (bisearch(ucs)) return 0

  // if we arrive here, ucs is not a combining or C0/C1 control character
  return 1 +
      (ucs >= 0x1100 &&
       (ucs <= 0x115f ||                       // Hangul Jamo init. consonants
        ucs == 0x2329 || ucs == 0x232a ||
        (ucs >= 0x2e80 && ucs <= 0xa4cf &&
         ucs != 0x303f) ||                     // CJK ... Yi
        (ucs >= 0xac00 && ucs <= 0xd7a3) ||    // Hangul Syllables
        (ucs >= 0xf900 && ucs <= 0xfaff) ||    // CJK Compatibility Ideographs
        (ucs >= 0xfe10 && ucs <= 0xfe19) ||    // Vertical forms
        (ucs >= 0xfe30 && ucs <= 0xfe6f) ||    // CJK Compatibility Forms
        (ucs >= 0xff00 && ucs <= 0xff60) ||    // Fullwidth Forms
        (ucs >= 0xffe0 && ucs <= 0xffe6) ||
        (ucs >= 0x20000 && ucs <= 0x2fffd) ||
        (ucs >= 0x30000 && ucs <= 0x3fffd)));
}

function bisearch(ucs) {
  var min = 0
  var max = combining.length - 1
  var mid

  if (ucs < combining[0][0] || ucs > combining[max][1]) return false

  while (max >= min) {
    mid = Math.floor((min + max) / 2)
    if (ucs > combining[mid][1]) min = mid + 1
    else if (ucs < combining[mid][0]) max = mid - 1
    else return true
  }

  return false
}


/***/ }),

/***/ "./2D/heuristics/BestAreaFit.js":
/*!**************************************!*\
  !*** ./2D/heuristics/BestAreaFit.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ BestAreaFit; }
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./2D/heuristics/Base.ts");
/* harmony import */ var _Score__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Score */ "./2D/Score.ts");



class BestAreaFit extends _Base__WEBPACK_IMPORTED_MODULE_0__.default {

  calculateScore(freeRect, rectWidth, rectHeight) {
    let areaFit = freeRect.width * freeRect.height - rectWidth * rectHeight;
    let leftOverHoriz = Math.abs(freeRect.width - rectWidth);
    let leftOverVert = Math.abs(freeRect.height - rectHeight);
    let shortSideFit = Math.min(leftOverHoriz, leftOverVert);
    return new _Score__WEBPACK_IMPORTED_MODULE_1__.default(areaFit, shortSideFit);
  }

}

/***/ }),

/***/ "./2D/heuristics/BestLongSideFit.js":
/*!******************************************!*\
  !*** ./2D/heuristics/BestLongSideFit.js ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ BestLongSideFit; }
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./2D/heuristics/Base.ts");
/* harmony import */ var _Score__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Score */ "./2D/Score.ts");



class BestLongSideFit extends _Base__WEBPACK_IMPORTED_MODULE_0__.default {

  calculateScore(freeRect, rectWidth, rectHeight) {
    let leftOverHoriz = Math.abs(freeRect.width - rectWidth);
    let leftOverVert = Math.abs(freeRect.height - rectHeight);
    let args = [leftOverHoriz, leftOverVert].sort((a, b) => a - b).reverse();
    return new _Score__WEBPACK_IMPORTED_MODULE_1__.default(args[0], args[1]);
  }

}

/***/ }),

/***/ "./2D/heuristics/BestShortSideFit.js":
/*!*******************************************!*\
  !*** ./2D/heuristics/BestShortSideFit.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ BestShortSideFit; }
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./2D/heuristics/Base.ts");
/* harmony import */ var _Score__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Score */ "./2D/Score.ts");



class BestShortSideFit extends _Base__WEBPACK_IMPORTED_MODULE_0__.default {

  calculateScore(freeRect, rectWidth, rectHeight) {
    let leftOverHoriz = Math.abs(freeRect.width - rectWidth);
    let leftOverVert = Math.abs(freeRect.height - rectHeight);
    let args = [leftOverHoriz, leftOverVert].sort((a, b) => a - b);
    let score = new _Score__WEBPACK_IMPORTED_MODULE_1__.default(args[0], args[1]);
    return score;
  }

}

/***/ }),

/***/ "./2D/heuristics/BottomLeft.js":
/*!*************************************!*\
  !*** ./2D/heuristics/BottomLeft.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ BottomLeft; }
/* harmony export */ });
/* harmony import */ var _Base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Base */ "./2D/heuristics/Base.ts");
/* harmony import */ var _Score__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Score */ "./2D/Score.ts");



class BottomLeft extends _Base__WEBPACK_IMPORTED_MODULE_0__.default {

  calculateScore(freeRect, rectWidth, rectHeight) {
    let topSideY = freeRect.y + rectHeight;
    return new _Score__WEBPACK_IMPORTED_MODULE_1__.default(topSideY, freeRect.x);
  }

}

/***/ }),

/***/ "./2D/heuristics/index.js":
/*!********************************!*\
  !*** ./2D/heuristics/index.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BestAreaFit": function() { return /* reexport safe */ _BestAreaFit__WEBPACK_IMPORTED_MODULE_0__.default; },
/* harmony export */   "BestLongSideFit": function() { return /* reexport safe */ _BestLongSideFit__WEBPACK_IMPORTED_MODULE_1__.default; },
/* harmony export */   "BestShortSideFit": function() { return /* reexport safe */ _BestShortSideFit__WEBPACK_IMPORTED_MODULE_2__.default; },
/* harmony export */   "BottomLeft": function() { return /* reexport safe */ _BottomLeft__WEBPACK_IMPORTED_MODULE_3__.default; }
/* harmony export */ });
/* harmony import */ var _BestAreaFit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BestAreaFit */ "./2D/heuristics/BestAreaFit.js");
/* harmony import */ var _BestLongSideFit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BestLongSideFit */ "./2D/heuristics/BestLongSideFit.js");
/* harmony import */ var _BestShortSideFit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BestShortSideFit */ "./2D/heuristics/BestShortSideFit.js");
/* harmony import */ var _BottomLeft__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./BottomLeft */ "./2D/heuristics/BottomLeft.js");





/***/ }),

/***/ "./2D/index.js":
/*!*********************!*\
  !*** ./2D/index.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bin": function() { return /* reexport safe */ _Bin__WEBPACK_IMPORTED_MODULE_0__.default; },
/* harmony export */   "Box": function() { return /* reexport safe */ _Box__WEBPACK_IMPORTED_MODULE_1__.default; },
/* harmony export */   "Packer": function() { return /* reexport safe */ _Packer__WEBPACK_IMPORTED_MODULE_2__.default; },
/* harmony export */   "heuristics": function() { return /* reexport module object */ _heuristics__WEBPACK_IMPORTED_MODULE_3__; }
/* harmony export */ });
/* harmony import */ var _Bin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bin */ "./2D/Bin.ts");
/* harmony import */ var _Box__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Box */ "./2D/Box.ts");
/* harmony import */ var _Packer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Packer */ "./2D/Packer.ts");
/* harmony import */ var _heuristics__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./heuristics */ "./2D/heuristics/index.js");







/***/ }),

/***/ "./3D/Bin.js":
/*!*******************!*\
  !*** ./3D/Bin.js ***!
  \*******************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Bin; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./3D/util.js");
/* harmony import */ var _lib_log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/log */ "./lib/log.js");


const log = (0,_lib_log__WEBPACK_IMPORTED_MODULE_1__.createLogger)('3D:');

class Bin {

  name = '';
  width = 0;
  height = 0;
  depth = 0;
  maxWeight = 0;

  items = [];

  constructor(name, w, h, d, mw) {
    this.name = name;
    this.width = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( w );
    this.height = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( h );
    this.depth = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( d );
    this.maxWeight = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( mw );
  }

  getName() {
    return this.name;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getDepth() {
    return this.depth;
  }

  getMaxWeight() {
    return this.maxWeight;
  }

  getItems() {
    return this.items;
  }

  getVolume() {
    return this.getWidth() * this.getHeight() * this.getDepth();
  }

  getPackedWeight() {
    return this.items.reduce( ( weight, item ) => weight + item.getWeight(), 0 );
  }

  weighItem(item) {
    const maxWeight = this.getMaxWeight();
    return ! maxWeight || item.getWeight() + this.getPackedWeight() <= maxWeight;
  }

  /**
   * Calculate a score for a given item and rotation type.
   *
   * Scores are higher for rotations that closest match item dimensions to Bin dimensions.
   * For example, rotating the item so the longest side is aligned with the longest Bin side.
   *
   * Example (Bin is 11 x 8.5 x 5.5, Item is 8.1 x 5.2 x 5.2):
   *  Rotation 0:
   *    8.1 / 11  = 0.736
   *    5.2 / 8.5 = 0.612
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.736 ** 2 + 0.612 ** 2 + 0.945 ** 2 = 1.809
   *
   *  Rotation 1:
   *    8.1 / 8.5 = 0.953
   *    5.2 / 11 = 0.473
   *    5.2 / 5.5 = 0.945
   *    -----------------
   *    0.953 ** 2 + 0.473 ** 2 + 0.945 ** 2 = 2.025
   *
   * @param {Item} item
   * @param {int} rotationType
   * @return {float} score
   */
  scoreRotation(item, rotationType) {
    item.rotationType = rotationType;
    let d = item.getDimension();

    // If the item doesn't fit in the Bin
    if ( this.getWidth() < d[0] || this.getHeight() < d[1] || this.getDepth() < d[2] ) {
        return 0;
    }

    // Square the results to increase the impact of high values (e.g. > 0.8)
    const widthScore = Math.pow( d[0] / this.getWidth(), 2 );
    const heightScore = Math.pow( d[1] / this.getHeight(), 2 );
    const depthScore = Math.pow( d[2] / this.getDepth(), 2 );

    return widthScore + heightScore + depthScore;
  }

  /**
   * Calculate the best rotation order for a given Item based on scoreRotation().
   *
   * @param {Item} item
   * @return {Array} Rotation types sorted by their score, DESC
   */
  getBestRotationOrder(item) {
    const rotationScores = {};

    // Score all rotation types
	for (let i=0; i<item.allowedRotation.length; i++) {
	    const r = item.allowedRotation[i];
		rotationScores[r] = this.scoreRotation( item, r );
    }

    // Sort the rotation types (index of scores object) DESC
    // and ensure Int values (Object.keys returns strings)
    const sortedRotations = Object.keys( rotationScores ).sort( ( a, b ) => {
      return rotationScores[b] - rotationScores[a];
    } ).map( Number );

    return sortedRotations;
  }

  putItem(item, p) {
    const box = this;
    let fit = false;
    const rotations = this.getBestRotationOrder( item );
    item.position = p;

    for ( let i = 0; i < rotations.length; i++ ) {
      item.rotationType = rotations[i];
      let d = item.getDimension();

      if (box.getWidth() < p[0] + d[0] || box.getHeight() < p[1] + d[1] || box.getDepth() < p[2] + d[2]) {
        fit = false;
      } else {
        fit = true;

        for (let j=0; j<box.items.length; j++) {
          let _j = box.items[j];
          if (_j.intersect(item)) {
            fit = false;
            break;
          }
        }

        if (fit) {
          box.items.push(item);
        }
      }

      log('try to putItem', fit, 'item', item.toString(), 'box', box.toString());

      if (fit) {
        break;
      }
    }
    return fit;
  }

  toString() {
    return `Bin:${this.name} (WxHxD = ${this.getWidth()}x${this.getHeight()}x${this.getDepth()}, MaxWg. = ${this.getMaxWeight()})`;
  }

}

/***/ }),

/***/ "./3D/Item.js":
/*!********************!*\
  !*** ./3D/Item.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RotationType_WHD": function() { return /* binding */ RotationType_WHD; },
/* harmony export */   "RotationType_HWD": function() { return /* binding */ RotationType_HWD; },
/* harmony export */   "RotationType_HDW": function() { return /* binding */ RotationType_HDW; },
/* harmony export */   "RotationType_DHW": function() { return /* binding */ RotationType_DHW; },
/* harmony export */   "RotationType_DWH": function() { return /* binding */ RotationType_DWH; },
/* harmony export */   "RotationType_WDH": function() { return /* binding */ RotationType_WDH; },
/* harmony export */   "WidthAxis": function() { return /* binding */ WidthAxis; },
/* harmony export */   "HeightAxis": function() { return /* binding */ HeightAxis; },
/* harmony export */   "DepthAxis": function() { return /* binding */ DepthAxis; },
/* harmony export */   "StartPosition": function() { return /* binding */ StartPosition; },
/* harmony export */   "RotationTypeStrings": function() { return /* binding */ RotationTypeStrings; },
/* harmony export */   "default": function() { return /* binding */ Item; },
/* harmony export */   "rectIntersect": function() { return /* binding */ rectIntersect; }
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./3D/util.js");


const RotationType_WHD = 0;
const RotationType_HWD = 1;
const RotationType_HDW = 2;
const RotationType_DHW = 3;
const RotationType_DWH = 4;
const RotationType_WDH = 5;

const WidthAxis = 0;
const HeightAxis = 1;
const DepthAxis = 2;

const StartPosition = [0, 0, 0];

const RotationTypeStrings = {
  [RotationType_WHD]: 'RotationType_WHD (w,h,d)',
  [RotationType_HWD]: 'RotationType_HWD (h,w,d)',
  [RotationType_HDW]: 'RotationType_HDW (h,d,w)',
  [RotationType_DHW]: 'RotationType_DHW (d,h,w)',
  [RotationType_DWH]: 'RotationType_DWH (d,w,h)',
  [RotationType_WDH]: 'RotationType_WDH (w,d,h)',
};

class Item {

  name = '';
  width = 0;
  height = 0;
  depth = 0;
  weight = 0;
  allowedRotation = [0,1,2,3,4,5];

  rotationType = RotationType_WHD;
  position = []; // x, y, z

  constructor(name, w, h, d, wg, allowedRotation) {
    this.name = name;
    this.width = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( w );
    this.height = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( h );
    this.depth = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( d );
    this.weight = (0,_util__WEBPACK_IMPORTED_MODULE_0__.factoredInteger)( wg );
    this.allowedRotation = allowedRotation ? allowedRotation : this.allowedRotation;
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getDepth() {
    return this.depth;
  }

  getWeight() {
    return this.weight;
  }

  getRotationType() {
    return this.rotationType;
  }

  getAllowedRotation() {
    return this.allowedRotation;
  }

  getRotationTypeString() {
    return RotationTypeStrings[this.getRotationType()];
  }

  getDimension() {
    let d;
    switch (this.rotationType) {
      case RotationType_WHD:
        d = [this.getWidth(), this.getHeight(), this.getDepth()];
        break;
      case RotationType_HWD:
        d = [this.getHeight(), this.getWidth(), this.getDepth()];
        break;
      case RotationType_HDW:
        d = [this.getHeight(), this.getDepth(), this.getWidth()];
        break;
      case RotationType_DHW:
        d = [this.getDepth(), this.getHeight(), this.getWidth()];
        break;
      case RotationType_DWH:
        d = [this.getDepth(), this.getWidth(), this.getHeight()];
        break;
      case RotationType_WDH:
        d = [this.getWidth(), this.getDepth(), this.getHeight()];
        break;
    }
    return d;
  }

  intersect(i2) {
    return rectIntersect(this, i2, WidthAxis, HeightAxis) &&
        rectIntersect(this, i2, HeightAxis, DepthAxis) &&
        rectIntersect(this, i2, WidthAxis, DepthAxis);
  }

  getVolume() {
    return this.getWidth() * this.getHeight() * this.getDepth();
  }

  toString() {
    return `Item:${this.name} (${this.getRotationTypeString()} = ${this.getDimension().join('x')}, Wg. = ${this.weight})`;
  }
}

const rectIntersect = (i1, i2, x, y) => {
  let d1, d2, cx1, cy1, cx2, cy2, ix, iy;

  d1 = i1.getDimension();
  d2 = i2.getDimension();

  cx1 = i1.position[x] + d1[x] / 2;
  cy1 = i1.position[y] + d1[y] / 2;
  cx2 = i2.position[x] + d2[x] / 2;
  cy2 = i2.position[y] + d2[y] / 2;

  ix = Math.max(cx1, cx2) - Math.min(cx1, cx2);
  iy = Math.max(cy1, cy2) - Math.min(cy1, cy2);

  return ix < (d1[x] + d2[x]) / 2 && iy < (d1[y] + d2[y]) / 2;
};

/***/ }),

/***/ "./3D/Packer.js":
/*!**********************!*\
  !*** ./3D/Packer.js ***!
  \**********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Packer; }
/* harmony export */ });
/* harmony import */ var _Bin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bin */ "./3D/Bin.js");
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Item */ "./3D/Item.js");



class Packer {

  bins = [];
  items = [];
  unfitItems = [];

  addBin(bin) {
    this.bins.push(bin);
  }

  addItem(item) {
    this.items.push(item);
  }

  findFittedBin(i) {
    for (let _i=0; _i<this.bins.length; _i++) {
      let b = this.bins[_i];

      if (!b.weighItem(i) || !b.putItem(i, _Item__WEBPACK_IMPORTED_MODULE_1__.StartPosition)) {
        continue;
      }

      if (b.items.length === 1 && b.items[0] === i) {
        b.items = [];
      }

      return b;
    }
    return null;
  }

  getBiggerBinThan(b) {
    let v = b.getVolume();
    for (let _i=0; _i<this.bins; _i++) {
      let b2 = this.bins[_i];
      if (b2.getVolume() > v) {
        return b2;
      }
    }
    return null;
  }

  unfitItem() {
    if (this.items.length === 0) {
      return;
    }
    this.unfitItems.push(this.items[0]);
    this.items.splice(0, 1);
  }

  packToBin(b, items) {
    let b2 = null;
    let unpacked = [];
    let fit = b.weighItem(items[0]) && b.putItem(items[0], _Item__WEBPACK_IMPORTED_MODULE_1__.StartPosition);

    if (!fit) {
      let b2 = this.getBiggerBinThan(b);
      if (b2) {
        return this.packToBin(b2, items);
      }
      return this.items;
    }

    // Pack unpacked items.
    for (let _i=1; _i < this.items.length; _i++) {
      let fitted = false;
      let item = this.items[_i];

      if (b.weighItem(item)) {
        // Try available pivots in current bin that are not intersect with
        // existing items in current bin.
        lookup:
        for (let _pt=0; _pt < 3; _pt++) {
          for (let _j=0; _j < b.items.length; _j++) {
            let pv;
            let ib = b.items[_j];
            let d = ib.getDimension();
            switch (_pt) {
              case _Item__WEBPACK_IMPORTED_MODULE_1__.WidthAxis:
                pv = [ib.position[0] + d[0], ib.position[1], ib.position[2]];
                break;
              case _Item__WEBPACK_IMPORTED_MODULE_1__.HeightAxis:
                pv = [ib.position[0], ib.position[1] + d[1], ib.position[2]];
                break;
              case _Item__WEBPACK_IMPORTED_MODULE_1__.DepthAxis:
                pv = [ib.position[0], ib.position[1], ib.position[2] + d[2]];
                break;
            }

            if (b.putItem(item, pv)) {
              fitted = true;
              break lookup;
            }
          }
        }
      }

      if (!fitted) {
        while (b2 !== null) {
          b2 = this.getBiggerBinThan(b);
          if (b2) {
            b2.items.push(item);
            let left = this.packToBin(b2, b2.items);
            if (left.length === 0) {
              b = b2;
              fitted = true;
              break;
            }
          }
        }

        if (!fitted) {
          unpacked.push(item);
        }
      }
    }

    return unpacked;
  }

  pack() {
    // Sort bins smallest to largest.
    this.bins.sort((a, b) => {
      return a.getVolume() - b.getVolume();
    });

    // Sort items largest to smallest.
    this.items.sort((a, b) => {
      return b.getVolume() - a.getVolume();
    });

    while (this.items.length > 0) {
      let bin = this.findFittedBin(this.items[0]);

      if (bin === null) {
        this.unfitItem();
        continue;
      }

      this.items = this.packToBin(bin, this.items);
    }

    return null;
  }
}


/***/ }),

/***/ "./3D/index.js":
/*!*********************!*\
  !*** ./3D/index.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bin": function() { return /* reexport safe */ _Bin__WEBPACK_IMPORTED_MODULE_0__.default; },
/* harmony export */   "Item": function() { return /* reexport safe */ _Item__WEBPACK_IMPORTED_MODULE_1__.default; },
/* harmony export */   "Packer": function() { return /* reexport safe */ _Packer__WEBPACK_IMPORTED_MODULE_2__.default; }
/* harmony export */ });
/* harmony import */ var _Bin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Bin */ "./3D/Bin.js");
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Item */ "./3D/Item.js");
/* harmony import */ var _Packer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Packer */ "./3D/Packer.js");






/***/ }),

/***/ "./3D/util.js":
/*!********************!*\
  !*** ./3D/util.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "factoredInteger": function() { return /* binding */ factoredInteger; }
/* harmony export */ });
/**
 * Precision to retain in factoredInteger()
 */
const FACTOR = 5;

/**
 * Factor a number by FACTOR and round to the nearest whole number
 */
const factoredInteger = ( value ) => (
    Math.round( value * ( 10 ** FACTOR ) )
);


/***/ }),

/***/ "./lib/log.js":
/*!********************!*\
  !*** ./lib/log.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "enableLog": function() { return /* binding */ enableLog; },
/* harmony export */   "createLogger": function() { return /* binding */ createLogger; },
/* harmony export */   "log": function() { return /* binding */ log; }
/* harmony export */ });
let isLogEnabled = false;
function enableLog(enable = true) {
    isLogEnabled = enable;
}

function createLogger(namespace = 'binpackingjs') {
    return log.bind(undefined, namespace);
}

function log(namespace, ...args) {
    return isLogEnabled ? console.debug.apply(console, [namespace].concat(args)) : undefined;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BP2D": function() { return /* reexport module object */ _2D__WEBPACK_IMPORTED_MODULE_0__; },
/* harmony export */   "BP3D": function() { return /* reexport module object */ _3D__WEBPACK_IMPORTED_MODULE_1__; }
/* harmony export */ });
/* harmony import */ var _2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./2D */ "./2D/index.js");
/* harmony import */ var _3D__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./3D */ "./3D/index.js");




}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jbG9uZS9jbG9uZS5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jb25zb2xlLnRhYmxlL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2RlZmF1bHRzL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2Vhc3ktdGFibGUvdGFibGUuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL0Jpbi50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvQm94LnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9QYWNrZXIudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL1Njb3JlLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkRW50cnkudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvQmFzZS50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2NvbWJpbmluZy5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RBcmVhRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RMb25nU2lkZUZpdC5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvaGV1cmlzdGljcy9CZXN0U2hvcnRTaWRlRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0JvdHRvbUxlZnQuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8zRC9CaW4uanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL0l0ZW0uanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL1BhY2tlci5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vM0QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL3V0aWwuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uL2xpYi9sb2cuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0JpblBhY2tpbmcvLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRCxJQUFJLEtBQTBCO0FBQzlCO0FBQ0E7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsdURBQVk7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNB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QUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekp3QjtBQUNFO0FBQ0k7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRjlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDVkE7QUFDTztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQSxDOzs7Ozs7VUNYQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLDZDQUE2Qyx3REFBd0QsRTs7Ozs7V0NBckc7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ042QjtBQUNBO0FBRVAiLCJmaWxlIjoiQmluUGFja2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiQmluUGFja2luZ1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJCaW5QYWNraW5nXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkJpblBhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJ2YXIgY2xvbmUgPSAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2xvbmVzIChjb3BpZXMpIGFuIE9iamVjdCB1c2luZyBkZWVwIGNvcHlpbmcuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBzdXBwb3J0cyBjaXJjdWxhciByZWZlcmVuY2VzIGJ5IGRlZmF1bHQsIGJ1dCBpZiB5b3UgYXJlIGNlcnRhaW5cbiAqIHRoZXJlIGFyZSBubyBjaXJjdWxhciByZWZlcmVuY2VzIGluIHlvdXIgb2JqZWN0LCB5b3UgY2FuIHNhdmUgc29tZSBDUFUgdGltZVxuICogYnkgY2FsbGluZyBjbG9uZShvYmosIGZhbHNlKS5cbiAqXG4gKiBDYXV0aW9uOiBpZiBgY2lyY3VsYXJgIGlzIGZhbHNlIGFuZCBgcGFyZW50YCBjb250YWlucyBjaXJjdWxhciByZWZlcmVuY2VzLFxuICogeW91ciBwcm9ncmFtIG1heSBlbnRlciBhbiBpbmZpbml0ZSBsb29wIGFuZCBjcmFzaC5cbiAqXG4gKiBAcGFyYW0gYHBhcmVudGAgLSB0aGUgb2JqZWN0IHRvIGJlIGNsb25lZFxuICogQHBhcmFtIGBjaXJjdWxhcmAgLSBzZXQgdG8gdHJ1ZSBpZiB0aGUgb2JqZWN0IHRvIGJlIGNsb25lZCBtYXkgY29udGFpblxuICogICAgY2lyY3VsYXIgcmVmZXJlbmNlcy4gKG9wdGlvbmFsIC0gdHJ1ZSBieSBkZWZhdWx0KVxuICogQHBhcmFtIGBkZXB0aGAgLSBzZXQgdG8gYSBudW1iZXIgaWYgdGhlIG9iamVjdCBpcyBvbmx5IHRvIGJlIGNsb25lZCB0b1xuICogICAgYSBwYXJ0aWN1bGFyIGRlcHRoLiAob3B0aW9uYWwgLSBkZWZhdWx0cyB0byBJbmZpbml0eSlcbiAqIEBwYXJhbSBgcHJvdG90eXBlYCAtIHNldHMgdGhlIHByb3RvdHlwZSB0byBiZSB1c2VkIHdoZW4gY2xvbmluZyBhbiBvYmplY3QuXG4gKiAgICAob3B0aW9uYWwgLSBkZWZhdWx0cyB0byBwYXJlbnQgcHJvdG90eXBlKS5cbiovXG5mdW5jdGlvbiBjbG9uZShwYXJlbnQsIGNpcmN1bGFyLCBkZXB0aCwgcHJvdG90eXBlKSB7XG4gIHZhciBmaWx0ZXI7XG4gIGlmICh0eXBlb2YgY2lyY3VsYXIgPT09ICdvYmplY3QnKSB7XG4gICAgZGVwdGggPSBjaXJjdWxhci5kZXB0aDtcbiAgICBwcm90b3R5cGUgPSBjaXJjdWxhci5wcm90b3R5cGU7XG4gICAgZmlsdGVyID0gY2lyY3VsYXIuZmlsdGVyO1xuICAgIGNpcmN1bGFyID0gY2lyY3VsYXIuY2lyY3VsYXJcbiAgfVxuICAvLyBtYWludGFpbiB0d28gYXJyYXlzIGZvciBjaXJjdWxhciByZWZlcmVuY2VzLCB3aGVyZSBjb3JyZXNwb25kaW5nIHBhcmVudHNcbiAgLy8gYW5kIGNoaWxkcmVuIGhhdmUgdGhlIHNhbWUgaW5kZXhcbiAgdmFyIGFsbFBhcmVudHMgPSBbXTtcbiAgdmFyIGFsbENoaWxkcmVuID0gW107XG5cbiAgdmFyIHVzZUJ1ZmZlciA9IHR5cGVvZiBCdWZmZXIgIT0gJ3VuZGVmaW5lZCc7XG5cbiAgaWYgKHR5cGVvZiBjaXJjdWxhciA9PSAndW5kZWZpbmVkJylcbiAgICBjaXJjdWxhciA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBkZXB0aCA9PSAndW5kZWZpbmVkJylcbiAgICBkZXB0aCA9IEluZmluaXR5O1xuXG4gIC8vIHJlY3Vyc2UgdGhpcyBmdW5jdGlvbiBzbyB3ZSBkb24ndCByZXNldCBhbGxQYXJlbnRzIGFuZCBhbGxDaGlsZHJlblxuICBmdW5jdGlvbiBfY2xvbmUocGFyZW50LCBkZXB0aCkge1xuICAgIC8vIGNsb25pbmcgbnVsbCBhbHdheXMgcmV0dXJucyBudWxsXG4gICAgaWYgKHBhcmVudCA9PT0gbnVsbClcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgaWYgKGRlcHRoID09IDApXG4gICAgICByZXR1cm4gcGFyZW50O1xuXG4gICAgdmFyIGNoaWxkO1xuICAgIHZhciBwcm90bztcbiAgICBpZiAodHlwZW9mIHBhcmVudCAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoY2xvbmUuX19pc0FycmF5KHBhcmVudCkpIHtcbiAgICAgIGNoaWxkID0gW107XG4gICAgfSBlbHNlIGlmIChjbG9uZS5fX2lzUmVnRXhwKHBhcmVudCkpIHtcbiAgICAgIGNoaWxkID0gbmV3IFJlZ0V4cChwYXJlbnQuc291cmNlLCBfX2dldFJlZ0V4cEZsYWdzKHBhcmVudCkpO1xuICAgICAgaWYgKHBhcmVudC5sYXN0SW5kZXgpIGNoaWxkLmxhc3RJbmRleCA9IHBhcmVudC5sYXN0SW5kZXg7XG4gICAgfSBlbHNlIGlmIChjbG9uZS5fX2lzRGF0ZShwYXJlbnQpKSB7XG4gICAgICBjaGlsZCA9IG5ldyBEYXRlKHBhcmVudC5nZXRUaW1lKCkpO1xuICAgIH0gZWxzZSBpZiAodXNlQnVmZmVyICYmIEJ1ZmZlci5pc0J1ZmZlcihwYXJlbnQpKSB7XG4gICAgICBpZiAoQnVmZmVyLmFsbG9jVW5zYWZlKSB7XG4gICAgICAgIC8vIE5vZGUuanMgPj0gNC41LjBcbiAgICAgICAgY2hpbGQgPSBCdWZmZXIuYWxsb2NVbnNhZmUocGFyZW50Lmxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPbGRlciBOb2RlLmpzIHZlcnNpb25zXG4gICAgICAgIGNoaWxkID0gbmV3IEJ1ZmZlcihwYXJlbnQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHBhcmVudC5jb3B5KGNoaWxkKTtcbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBwcm90b3R5cGUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50KTtcbiAgICAgICAgY2hpbGQgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjaGlsZCA9IE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcbiAgICAgICAgcHJvdG8gPSBwcm90b3R5cGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNpcmN1bGFyKSB7XG4gICAgICB2YXIgaW5kZXggPSBhbGxQYXJlbnRzLmluZGV4T2YocGFyZW50KTtcblxuICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICAgIHJldHVybiBhbGxDaGlsZHJlbltpbmRleF07XG4gICAgICB9XG4gICAgICBhbGxQYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICAgIGFsbENoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgaW4gcGFyZW50KSB7XG4gICAgICB2YXIgYXR0cnM7XG4gICAgICBpZiAocHJvdG8pIHtcbiAgICAgICAgYXR0cnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJzICYmIGF0dHJzLnNldCA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRbaV0gPSBfY2xvbmUocGFyZW50W2ldLCBkZXB0aCAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGlsZDtcbiAgfVxuXG4gIHJldHVybiBfY2xvbmUocGFyZW50LCBkZXB0aCk7XG59XG5cbi8qKlxuICogU2ltcGxlIGZsYXQgY2xvbmUgdXNpbmcgcHJvdG90eXBlLCBhY2NlcHRzIG9ubHkgb2JqZWN0cywgdXNlZnVsbCBmb3IgcHJvcGVydHlcbiAqIG92ZXJyaWRlIG9uIEZMQVQgY29uZmlndXJhdGlvbiBvYmplY3QgKG5vIG5lc3RlZCBwcm9wcykuXG4gKlxuICogVVNFIFdJVEggQ0FVVElPTiEgVGhpcyBtYXkgbm90IGJlaGF2ZSBhcyB5b3Ugd2lzaCBpZiB5b3UgZG8gbm90IGtub3cgaG93IHRoaXNcbiAqIHdvcmtzLlxuICovXG5jbG9uZS5jbG9uZVByb3RvdHlwZSA9IGZ1bmN0aW9uIGNsb25lUHJvdG90eXBlKHBhcmVudCkge1xuICBpZiAocGFyZW50ID09PSBudWxsKVxuICAgIHJldHVybiBudWxsO1xuXG4gIHZhciBjID0gZnVuY3Rpb24gKCkge307XG4gIGMucHJvdG90eXBlID0gcGFyZW50O1xuICByZXR1cm4gbmV3IGMoKTtcbn07XG5cbi8vIHByaXZhdGUgdXRpbGl0eSBmdW5jdGlvbnNcblxuZnVuY3Rpb24gX19vYmpUb1N0cihvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59O1xuY2xvbmUuX19vYmpUb1N0ciA9IF9fb2JqVG9TdHI7XG5cbmZ1bmN0aW9uIF9faXNEYXRlKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBfX29ialRvU3RyKG8pID09PSAnW29iamVjdCBEYXRlXSc7XG59O1xuY2xvbmUuX19pc0RhdGUgPSBfX2lzRGF0ZTtcblxuZnVuY3Rpb24gX19pc0FycmF5KG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBfX29ialRvU3RyKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbmNsb25lLl9faXNBcnJheSA9IF9faXNBcnJheTtcblxuZnVuY3Rpb24gX19pc1JlZ0V4cChvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgX19vYmpUb1N0cihvKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59O1xuY2xvbmUuX19pc1JlZ0V4cCA9IF9faXNSZWdFeHA7XG5cbmZ1bmN0aW9uIF9fZ2V0UmVnRXhwRmxhZ3MocmUpIHtcbiAgdmFyIGZsYWdzID0gJyc7XG4gIGlmIChyZS5nbG9iYWwpIGZsYWdzICs9ICdnJztcbiAgaWYgKHJlLmlnbm9yZUNhc2UpIGZsYWdzICs9ICdpJztcbiAgaWYgKHJlLm11bHRpbGluZSkgZmxhZ3MgKz0gJ20nO1xuICByZXR1cm4gZmxhZ3M7XG59O1xuY2xvbmUuX19nZXRSZWdFeHBGbGFncyA9IF9fZ2V0UmVnRXhwRmxhZ3M7XG5cbnJldHVybiBjbG9uZTtcbn0pKCk7XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xufVxuIiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIHNldHVwQ29uc29sZVRhYmxlKCkge1xuICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2VpcmQsIGNvbnNvbGUgb2JqZWN0IGlzIHVuZGVmaW5lZCcpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUudGFibGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIGlmIGl0IGlzIG5vdCBPVVIgZnVuY3Rpb24sIG92ZXJ3cml0ZSBpdFxuICAgICAgaWYgKGNvbnNvbGUudGFibGUgPT09IGNvbnNvbGVUYWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNUeXBlKHQsIHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gdDtcbiAgICB9XG5cbiAgICB2YXIgaXNTdHJpbmcgPSBpc1R5cGUuYmluZChudWxsLCAnc3RyaW5nJyk7XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5T2YoaXNUeXBlRm4sIGEpIHtcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGEpICYmXG4gICAgICAgIGEuZXZlcnkoaXNUeXBlRm4pO1xuICAgIH1cblxuICAgIHZhciBpc0FycmF5T2ZTdHJpbmdzID0gaXNBcnJheU9mLmJpbmQobnVsbCwgaXNTdHJpbmcpO1xuICAgIHZhciBpc0FycmF5T2ZBcnJheXMgPSBpc0FycmF5T2YuYmluZChudWxsLCBBcnJheS5pc0FycmF5KTtcblxuICAgIHZhciBUYWJsZSA9IHJlcXVpcmUoJ2Vhc3ktdGFibGUnKTtcblxuICAgIGZ1bmN0aW9uIGFycmF5VG9TdHJpbmcoYXJyKSB7XG4gICAgICB2YXIgdCA9IG5ldyBUYWJsZSgpO1xuICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xuICAgICAgICBpZiAodHlwZW9mIHJlY29yZCA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICB0eXBlb2YgcmVjb3JkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHQuY2VsbCgnaXRlbScsIHJlY29yZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYXNzdW1lIHBsYWluIG9iamVjdFxuICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZCkuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgIHQuY2VsbChwcm9wZXJ0eSwgcmVjb3JkW3Byb3BlcnR5XSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdC5uZXdSb3coKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmludFRhYmxlV2l0aENvbHVtblRpdGxlcyh0aXRsZXMsIGl0ZW1zLG5vQ29uc29sZSkge1xuICAgICAgdmFyIHQgPSBuZXcgVGFibGUoKTtcbiAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaykge1xuICAgICAgICAgIHQuY2VsbCh0aXRsZXNba10sIHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHQubmV3Um93KCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBzdHIgPSB0LnRvU3RyaW5nKCk7XG5cbiAgICAgIHJldHVybiBub0NvbnNvbGUgPyBzdHIgOiBjb25zb2xlLmxvZyhzdHIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByaW50VGl0bGVUYWJsZSh0aXRsZSwgYXJyKSB7XG4gICAgICB2YXIgc3RyID0gYXJyYXlUb1N0cmluZyhhcnIpO1xuICAgICAgdmFyIHJvd0xlbmd0aCA9IHN0ci5pbmRleE9mKCdcXG4nKTtcbiAgICAgIGlmIChyb3dMZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aXRsZS5sZW5ndGggPiByb3dMZW5ndGgpIHtcbiAgICAgICAgICByb3dMZW5ndGggPSB0aXRsZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2codGl0bGUpO1xuICAgICAgICB2YXIgc2VwID0gJy0nLCBrLCBsaW5lID0gJyc7XG4gICAgICAgIGZvciAoayA9IDA7IGsgPCByb3dMZW5ndGg7IGsgKz0gMSkge1xuICAgICAgICAgIGxpbmUgKz0gc2VwO1xuICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobGluZSk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhzdHIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRpdGxlVGFibGUodGl0bGUsIGFycikge1xuICAgICAgdmFyIHN0ciA9IGFycmF5VG9TdHJpbmcoYXJyKTtcbiAgICAgIHZhciByb3dMZW5ndGggPSBzdHIuaW5kZXhPZignXFxuJyk7XG4gICAgICB2YXIgc3RyVG9SZXR1cm4gPSAnJztcbiAgICAgIGlmIChyb3dMZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aXRsZS5sZW5ndGggPiByb3dMZW5ndGgpIHtcbiAgICAgICAgICByb3dMZW5ndGggPSB0aXRsZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN0clRvUmV0dXJuICs9IHRpdGxlICsgJ1xcbic7XG4gICAgICAgIHZhciBzZXAgPSAnLScsIGssIGxpbmUgPSAnJztcbiAgICAgICAgZm9yIChrID0gMDsgayA8IHJvd0xlbmd0aDsgayArPSAxKSB7XG4gICAgICAgICAgbGluZSArPSBzZXA7XG4gICAgICAgIH1cblx0XG4gICAgICAgIHN0clRvUmV0dXJuICs9IGxpbmUgKyAnXFxuJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0clRvUmV0dXJuICsgc3RyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9iamVjdFRvQXJyYXkob2JqKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICByZXR1cm4ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiBvYmpba2V5XVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcob2JqKSB7XG4gICAgICByZXR1cm4gYXJyYXlUb1N0cmluZyhvYmplY3RUb0FycmF5KG9iaikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnNvbGVUYWJsZSAoKSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICB0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgQXJyYXkuaXNBcnJheShhcmdzWzFdKSkge1xuXG4gICAgICAgIHJldHVybiBwcmludFRpdGxlVGFibGUoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBpc0FycmF5T2ZTdHJpbmdzKGFyZ3NbMF0pICYmXG4gICAgICAgIGlzQXJyYXlPZkFycmF5cyhhcmdzWzFdKSkge1xuICAgICAgICByZXR1cm4gcHJpbnRUYWJsZVdpdGhDb2x1bW5UaXRsZXMoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICB9XG5cbiAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAodHlwZW9mIGsgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGspO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaykpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhhcnJheVRvU3RyaW5nKGspKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgayA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhvYmplY3RUb1N0cmluZyhrKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzLmdldFRhYmxlID0gZnVuY3Rpb24oKXtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgdmFyIHN0clRvUmV0dXJuID0gJyc7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICB0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgQXJyYXkuaXNBcnJheShhcmdzWzFdKSkge1xuXG4gICAgICAgIHJldHVybiBnZXRUaXRsZVRhYmxlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgaXNBcnJheU9mU3RyaW5ncyhhcmdzWzBdKSAmJlxuICAgICAgICBpc0FycmF5T2ZBcnJheXMoYXJnc1sxXSkpIHtcbiAgICAgICAgcmV0dXJuIHByaW50VGFibGVXaXRoQ29sdW1uVGl0bGVzKGFyZ3NbMF0sIGFyZ3NbMV0sdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoayxpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBzdHJUb1JldHVybiArPSBrO1xuXHQgIGlmIChpICE9PSBhcmdzLmxlbmd0aCAtIDEpe1xuXHQgICAgc3RyVG9SZXR1cm4gKz0gJ1xcbic7XG5cdCAgfVxuICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShrKSkge1xuICAgICAgICAgIHN0clRvUmV0dXJuICs9IGFycmF5VG9TdHJpbmcoaykgKyAnXFxuJztcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgayA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBzdHJUb1JldHVybiArPSBvYmplY3RUb1N0cmluZyhrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzdHJUb1JldHVybjtcbiAgICB9O1xuXG4gICAgY29uc29sZS50YWJsZSA9IGNvbnNvbGVUYWJsZTtcbiAgfVxuXG4gIHNldHVwQ29uc29sZVRhYmxlKCk7XG59KCkpO1xuIiwidmFyIGNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zLCBkZWZhdWx0cykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBPYmplY3Qua2V5cyhkZWZhdWx0cykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNba2V5XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG9wdGlvbnNba2V5XSA9IGNsb25lKGRlZmF1bHRzW2tleV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59OyIsInZhciB3Y3dpZHRoXG5cbnRyeSB7XG4gIHdjd2lkdGggPSByZXF1aXJlKCd3Y3dpZHRoJylcbn0gY2F0Y2goZSkge31cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVxuXG5mdW5jdGlvbiBUYWJsZSgpIHtcbiAgdGhpcy5yb3dzID0gW11cbiAgdGhpcy5yb3cgPSB7X19wcmludGVycyA6IHt9fVxufVxuXG4vKipcbiAqIFB1c2ggdGhlIGN1cnJlbnQgcm93IHRvIHRoZSB0YWJsZSBhbmQgc3RhcnQgYSBuZXcgb25lXG4gKlxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUubmV3Um93ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucm93cy5wdXNoKHRoaXMucm93KVxuICB0aGlzLnJvdyA9IHtfX3ByaW50ZXJzIDoge319XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogV3JpdGUgY2VsbCBpbiB0aGUgY3VycmVudCByb3dcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sICAgICAgICAgIC0gQ29sdW1uIG5hbWVcbiAqIEBwYXJhbSB7QW55fSB2YWwgICAgICAgICAgICAgLSBDZWxsIHZhbHVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJpbnRlcl0gIC0gUHJpbnRlciBmdW5jdGlvbiB0byBmb3JtYXQgdGhlIHZhbHVlXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5jZWxsID0gZnVuY3Rpb24oY29sLCB2YWwsIHByaW50ZXIpIHtcbiAgdGhpcy5yb3dbY29sXSA9IHZhbFxuICB0aGlzLnJvdy5fX3ByaW50ZXJzW2NvbF0gPSBwcmludGVyIHx8IHN0cmluZ1xuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFN0cmluZyB0byBzZXBhcmF0ZSBjb2x1bW5zXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnNlcGFyYXRvciA9ICcgICdcblxuZnVuY3Rpb24gc3RyaW5nKHZhbCkge1xuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyAnJyA6ICcnK3ZhbFxufVxuXG5mdW5jdGlvbiBsZW5ndGgoc3RyKSB7XG4gIHZhciBzID0gc3RyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGQrbS9nLCAnJylcbiAgcmV0dXJuIHdjd2lkdGggPT0gbnVsbCA/IHMubGVuZ3RoIDogd2N3aWR0aChzKVxufVxuXG4vKipcbiAqIERlZmF1bHQgcHJpbnRlclxuICovXG5cblRhYmxlLnN0cmluZyA9IHN0cmluZ1xuXG4vKipcbiAqIENyZWF0ZSBhIHByaW50ZXIgd2hpY2ggcmlnaHQgYWxpZ25zIHRoZSBjb250ZW50IGJ5IHBhZGRpbmcgd2l0aCBgY2hgIG9uIHRoZSBsZWZ0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNoXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cblxuVGFibGUubGVmdFBhZGRlciA9IGxlZnRQYWRkZXJcblxuZnVuY3Rpb24gbGVmdFBhZGRlcihjaCkge1xuICByZXR1cm4gZnVuY3Rpb24odmFsLCB3aWR0aCkge1xuICAgIHZhciBzdHIgPSBzdHJpbmcodmFsKVxuICAgIHZhciBsZW4gPSBsZW5ndGgoc3RyKVxuICAgIHZhciBwYWQgPSB3aWR0aCA+IGxlbiA/IEFycmF5KHdpZHRoIC0gbGVuICsgMSkuam9pbihjaCkgOiAnJ1xuICAgIHJldHVybiBwYWQgKyBzdHJcbiAgfVxufVxuXG4vKipcbiAqIFByaW50ZXIgd2hpY2ggcmlnaHQgYWxpZ25zIHRoZSBjb250ZW50XG4gKi9cblxudmFyIHBhZExlZnQgPSBUYWJsZS5wYWRMZWZ0ID0gbGVmdFBhZGRlcignICcpXG5cbi8qKlxuICogQ3JlYXRlIGEgcHJpbnRlciB3aGljaCBwYWRzIHdpdGggYGNoYCBvbiB0aGUgcmlnaHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2hcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuXG5UYWJsZS5yaWdodFBhZGRlciA9IHJpZ2h0UGFkZGVyXG5cbmZ1bmN0aW9uIHJpZ2h0UGFkZGVyKGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwYWRSaWdodCh2YWwsIHdpZHRoKSB7XG4gICAgdmFyIHN0ciA9IHN0cmluZyh2YWwpXG4gICAgdmFyIGxlbiA9IGxlbmd0aChzdHIpXG4gICAgdmFyIHBhZCA9IHdpZHRoID4gbGVuID8gQXJyYXkod2lkdGggLSBsZW4gKyAxKS5qb2luKGNoKSA6ICcnXG4gICAgcmV0dXJuIHN0ciArIHBhZFxuICB9XG59XG5cbnZhciBwYWRSaWdodCA9IHJpZ2h0UGFkZGVyKCcgJylcblxuLyoqXG4gKiBDcmVhdGUgYSBwcmludGVyIGZvciBudW1iZXJzXG4gKlxuICogV2lsbCBkbyByaWdodCBhbGlnbm1lbnQgYW5kIG9wdGlvbmFsbHkgZml4IHRoZSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIGRlY2ltYWwgcG9pbnRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBOdW1iZXIgb2YgZGlnaXRzIGZvciBmaXhwb2ludCBub3RhdGlvblxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5cblRhYmxlLm51bWJlciA9IGZ1bmN0aW9uKGRpZ2l0cykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsLCB3aWR0aCkge1xuICAgIGlmICh2YWwgPT0gbnVsbCkgcmV0dXJuICcnXG4gICAgaWYgKHR5cGVvZiB2YWwgIT0gJ251bWJlcicpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJycrdmFsICsgJyBpcyBub3QgYSBudW1iZXInKVxuICAgIHZhciBzdHIgPSBkaWdpdHMgPT0gbnVsbCA/IHZhbCsnJyA6IHZhbC50b0ZpeGVkKGRpZ2l0cylcbiAgICByZXR1cm4gcGFkTGVmdChzdHIsIHdpZHRoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2gocm93LCBmbikge1xuICBmb3IodmFyIGtleSBpbiByb3cpIHtcbiAgICBpZiAoa2V5ID09ICdfX3ByaW50ZXJzJykgY29udGludWVcbiAgICBmbihrZXksIHJvd1trZXldKVxuICB9XG59XG5cbi8qKlxuICogR2V0IGxpc3Qgb2YgY29sdW1ucyBpbiBwcmludGluZyBvcmRlclxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuY29sdW1ucyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29scyA9IHt9XG4gIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHsgLy8gZG8gMiB0aW1lc1xuICAgIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgICAgdmFyIGlkeCA9IDBcbiAgICAgIGVhY2gocm93LCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWR4ID0gTWF0aC5tYXgoaWR4LCBjb2xzW2tleV0gfHwgMClcbiAgICAgICAgY29sc1trZXldID0gaWR4XG4gICAgICAgIGlkeCsrXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbHMpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBjb2xzW2FdIC0gY29sc1tiXVxuICB9KVxufVxuXG4vKipcbiAqIEZvcm1hdCBqdXN0IHJvd3MsIGkuZS4gcHJpbnQgdGhlIHRhYmxlIHdpdGhvdXQgaGVhZGVycyBhbmQgdG90YWxzXG4gKlxuICogQHJldHVybnMge1N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGFpb24gb2YgdGhlIHRhYmxlXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnByaW50ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb2xzID0gdGhpcy5jb2x1bW5zKClcbiAgdmFyIHNlcGFyYXRvciA9IHRoaXMuc2VwYXJhdG9yXG4gIHZhciB3aWR0aHMgPSB7fVxuICB2YXIgb3V0ID0gJydcblxuICAvLyBDYWxjIHdpZHRoc1xuICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICBlYWNoKHJvdywgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgIHZhciBzdHIgPSByb3cuX19wcmludGVyc1trZXldLmNhbGwocm93LCB2YWwpXG4gICAgICB3aWR0aHNba2V5XSA9IE1hdGgubWF4KGxlbmd0aChzdHIpLCB3aWR0aHNba2V5XSB8fCAwKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gTm93IHByaW50XG4gIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgIHZhciBsaW5lID0gJydcbiAgICBjb2xzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgd2lkdGggPSB3aWR0aHNba2V5XVxuICAgICAgdmFyIHN0ciA9IHJvdy5oYXNPd25Qcm9wZXJ0eShrZXkpXG4gICAgICAgID8gJycrcm93Ll9fcHJpbnRlcnNba2V5XS5jYWxsKHJvdywgcm93W2tleV0sIHdpZHRoKVxuICAgICAgICA6ICcnXG4gICAgICBsaW5lICs9IHBhZFJpZ2h0KHN0ciwgd2lkdGgpICsgc2VwYXJhdG9yXG4gICAgfSlcbiAgICBsaW5lID0gbGluZS5zbGljZSgwLCAtc2VwYXJhdG9yLmxlbmd0aClcbiAgICBvdXQgKz0gbGluZSArICdcXG4nXG4gIH0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgdGFibGVcbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5cblRhYmxlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29scyA9IHRoaXMuY29sdW1ucygpXG4gIHZhciBvdXQgPSBuZXcgVGFibGUoKVxuXG4gIC8vIGNvcHkgb3B0aW9uc1xuICBvdXQuc2VwYXJhdG9yID0gdGhpcy5zZXBhcmF0b3JcblxuICAvLyBXcml0ZSBoZWFkZXJcbiAgY29scy5mb3JFYWNoKGZ1bmN0aW9uKGNvbCkge1xuICAgIG91dC5jZWxsKGNvbCwgY29sKVxuICB9KVxuICBvdXQubmV3Um93KClcbiAgb3V0LnB1c2hEZWxpbWV0ZXIoY29scylcblxuICAvLyBXcml0ZSBib2R5XG4gIG91dC5yb3dzID0gb3V0LnJvd3MuY29uY2F0KHRoaXMucm93cylcblxuICAvLyBUb3RhbHNcbiAgaWYgKHRoaXMudG90YWxzICYmIHRoaXMucm93cy5sZW5ndGgpIHtcbiAgICBvdXQucHVzaERlbGltZXRlcihjb2xzKVxuICAgIHRoaXMuZm9yRWFjaFRvdGFsKG91dC5jZWxsLmJpbmQob3V0KSlcbiAgICBvdXQubmV3Um93KClcbiAgfVxuXG4gIHJldHVybiBvdXQucHJpbnQoKVxufVxuXG4vKipcbiAqIFB1c2ggZGVsaW1ldGVyIHJvdyB0byB0aGUgdGFibGUgKHdpdGggZWFjaCBjZWxsIGZpbGxlZCB3aXRoIGRhc2hzIGR1cmluZyBwcmludGluZylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ1tdfSBbY29sc11cbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnB1c2hEZWxpbWV0ZXIgPSBmdW5jdGlvbihjb2xzKSB7XG4gIGNvbHMgPSBjb2xzIHx8IHRoaXMuY29sdW1ucygpXG4gIGNvbHMuZm9yRWFjaChmdW5jdGlvbihjb2wpIHtcbiAgICB0aGlzLmNlbGwoY29sLCB1bmRlZmluZWQsIGxlZnRQYWRkZXIoJy0nKSlcbiAgfSwgdGhpcylcbiAgcmV0dXJuIHRoaXMubmV3Um93KClcbn1cblxuLyoqXG4gKiBDb21wdXRlIGFsbCB0b3RhbHMgYW5kIHlpZWxkIHRoZSByZXN1bHRzIHRvIGBjYmBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggc2lnbmF0dXJlIGAoY29sdW1uLCB2YWx1ZSwgcHJpbnRlcilgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLmZvckVhY2hUb3RhbCA9IGZ1bmN0aW9uKGNiKSB7XG4gIGZvcih2YXIga2V5IGluIHRoaXMudG90YWxzKSB7XG4gICAgdmFyIGFnZ3IgPSB0aGlzLnRvdGFsc1trZXldXG4gICAgdmFyIGFjYyA9IGFnZ3IuaW5pdFxuICAgIHZhciBsZW4gPSB0aGlzLnJvd3MubGVuZ3RoXG4gICAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93LCBpZHgpIHtcbiAgICAgIGFjYyA9IGFnZ3IucmVkdWNlLmNhbGwocm93LCBhY2MsIHJvd1trZXldLCBpZHgsIGxlbilcbiAgICB9KVxuICAgIGNiKGtleSwgYWNjLCBhZ2dyLnByaW50ZXIpXG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHRhYmxlIHNvIHRoYXQgZWFjaCByb3cgcmVwcmVzZW50cyBjb2x1bW4gYW5kIGVhY2ggY29sdW1uIHJlcHJlc2VudHMgcm93XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHMuc2VwYXJhdG9yXSAtIENvbHVtbiBzZXBhcmF0aW9uIHN0cmluZ1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMubmFtZVByaW50ZXJdIC0gUHJpbnRlciB0byBmb3JtYXQgY29sdW1uIG5hbWVzXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5cblRhYmxlLnByb3RvdHlwZS5wcmludFRyYW5zcG9zZWQgPSBmdW5jdGlvbihvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIHZhciBvdXQgPSBuZXcgVGFibGVcbiAgb3V0LnNlcGFyYXRvciA9IG9wdHMuc2VwYXJhdG9yIHx8IHRoaXMuc2VwYXJhdG9yXG4gIHRoaXMuY29sdW1ucygpLmZvckVhY2goZnVuY3Rpb24oY29sKSB7XG4gICAgb3V0LmNlbGwoMCwgY29sLCBvcHRzLm5hbWVQcmludGVyKVxuICAgIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgaWR4KSB7XG4gICAgICBvdXQuY2VsbChpZHgrMSwgcm93W2NvbF0sIHJvdy5fX3ByaW50ZXJzW2NvbF0pXG4gICAgfSlcbiAgICBvdXQubmV3Um93KClcbiAgfSwgdGhpcylcbiAgcmV0dXJuIG91dC5wcmludCgpXG59XG5cbi8qKlxuICogU29ydCB0aGUgdGFibGVcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ1tdfSBbY21wXSAtIEVpdGhlciBjb21wYXJlIGZ1bmN0aW9uIG9yIGEgbGlzdCBvZiBjb2x1bW5zIHRvIHNvcnQgb25cbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjbXApIHtcbiAgaWYgKHR5cGVvZiBjbXAgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMucm93cy5zb3J0KGNtcClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgdmFyIGtleXMgPSBBcnJheS5pc0FycmF5KGNtcCkgPyBjbXAgOiB0aGlzLmNvbHVtbnMoKVxuXG4gIHZhciBjb21wYXJhdG9ycyA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBvcmRlciA9ICdhc2MnXG4gICAgdmFyIG0gPSAvKC4qKVxcfFxccyooYXNjfGRlcylcXHMqJC8uZXhlYyhrZXkpXG4gICAgaWYgKG0pIHtcbiAgICAgIGtleSA9IG1bMV1cbiAgICAgIG9yZGVyID0gbVsyXVxuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBvcmRlciA9PSAnYXNjJ1xuICAgICAgICA/IGNvbXBhcmUoYVtrZXldLCBiW2tleV0pXG4gICAgICAgIDogY29tcGFyZShiW2tleV0sIGFba2V5XSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHRoaXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wYXJhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9yZGVyID0gY29tcGFyYXRvcnNbaV0oYSwgYilcbiAgICAgIGlmIChvcmRlciAhPSAwKSByZXR1cm4gb3JkZXJcbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfSlcbn1cblxuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuICBpZiAoYSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gMVxuICBpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTFcbiAgaWYgKGEgPT09IG51bGwpIHJldHVybiAxXG4gIGlmIChiID09PSBudWxsKSByZXR1cm4gLTFcbiAgaWYgKGEgPiBiKSByZXR1cm4gMVxuICBpZiAoYSA8IGIpIHJldHVybiAtMVxuICByZXR1cm4gY29tcGFyZShTdHJpbmcoYSksIFN0cmluZyhiKSlcbn1cblxuLyoqXG4gKiBBZGQgYSB0b3RhbCBmb3IgdGhlIGNvbHVtblxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2wgLSBjb2x1bW4gbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucmVkdWNlID0gc3VtXSAtIHJlZHVjZShhY2MsIHZhbCwgaWR4LCBsZW5ndGgpIGZ1bmN0aW9uIHRvIGNvbXB1dGUgdGhlIHRvdGFsIHZhbHVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wcmludGVyID0gcGFkTGVmdF0gLSBQcmludGVyIHRvIGZvcm1hdCB0aGUgdG90YWwgY2VsbFxuICogQHBhcmFtIHtBbnl9IFtvcHRzLmluaXQgPSAwXSAtIEluaXRpYWwgdmFsdWUgZm9yIHJlZHVjdGlvblxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUudG90YWwgPSBmdW5jdGlvbihjb2wsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgdGhpcy50b3RhbHMgPSB0aGlzLnRvdGFscyB8fCB7fVxuICB0aGlzLnRvdGFsc1tjb2xdID0ge1xuICAgIHJlZHVjZTogb3B0cy5yZWR1Y2UgfHwgVGFibGUuYWdnci5zdW0sXG4gICAgcHJpbnRlcjogb3B0cy5wcmludGVyIHx8IHBhZExlZnQsXG4gICAgaW5pdDogb3B0cy5pbml0ID09IG51bGwgPyAwIDogb3B0cy5pbml0XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBQcmVkZWZpbmVkIGhlbHBlcnMgZm9yIHRvdGFsc1xuICovXG5cblRhYmxlLmFnZ3IgPSB7fVxuXG4vKipcbiAqIENyZWF0ZSBhIHByaW50ZXIgd2hpY2ggZm9ybWF0cyB0aGUgdmFsdWUgd2l0aCBgcHJpbnRlcmAsXG4gKiBhZGRzIHRoZSBgcHJlZml4YCB0byBpdCBhbmQgcmlnaHQgYWxpZ25zIHRoZSB3aG9sZSB0aGluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByaW50ZXJcbiAqIEByZXR1cm5zIHtwcmludGVyfVxuICovXG5cblRhYmxlLmFnZ3IucHJpbnRlciA9IGZ1bmN0aW9uKHByZWZpeCwgcHJpbnRlcikge1xuICBwcmludGVyID0gcHJpbnRlciB8fCBzdHJpbmdcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwgd2lkdGgpIHtcbiAgICByZXR1cm4gcGFkTGVmdChwcmVmaXggKyBwcmludGVyKHZhbCksIHdpZHRoKVxuICB9XG59XG5cbi8qKlxuICogU3VtIHJlZHVjdGlvblxuICovXG5cblRhYmxlLmFnZ3Iuc3VtID0gZnVuY3Rpb24oYWNjLCB2YWwpIHtcbiAgcmV0dXJuIGFjYyArIHZhbFxufVxuXG4vKipcbiAqIEF2ZXJhZ2UgcmVkdWN0aW9uXG4gKi9cblxuVGFibGUuYWdnci5hdmcgPSBmdW5jdGlvbihhY2MsIHZhbCwgaWR4LCBsZW4pIHtcbiAgYWNjID0gYWNjICsgdmFsXG4gIHJldHVybiBpZHggKyAxID09IGxlbiA/IGFjYy9sZW4gOiBhY2Ncbn1cblxuLyoqXG4gKiBQcmludCB0aGUgYXJyYXkgb3Igb2JqZWN0XG4gKlxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IG9iaiAtIE9iamVjdCB0byBwcmludFxuICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IFtmb3JtYXRdIC0gRm9ybWF0IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gLSBUYWJsZSBwb3N0IHByb2Nlc3NpbmcgYW5kIGZvcm1hdGluZ1xuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuXG5UYWJsZS5wcmludCA9IGZ1bmN0aW9uKG9iaiwgZm9ybWF0LCBjYikge1xuICB2YXIgb3B0cyA9IGZvcm1hdCB8fCB7fVxuXG4gIGZvcm1hdCA9IHR5cGVvZiBmb3JtYXQgPT0gJ2Z1bmN0aW9uJ1xuICAgID8gZm9ybWF0XG4gICAgOiBmdW5jdGlvbihvYmosIGNlbGwpIHtcbiAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZVxuICAgICAgICB2YXIgcGFyYW1zID0gb3B0c1trZXldIHx8IHt9XG4gICAgICAgIGNlbGwocGFyYW1zLm5hbWUgfHwga2V5LCBvYmpba2V5XSwgcGFyYW1zLnByaW50ZXIpXG4gICAgICB9XG4gICAgfVxuXG4gIHZhciB0ID0gbmV3IFRhYmxlXG4gIHZhciBjZWxsID0gdC5jZWxsLmJpbmQodClcblxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgY2IgPSBjYiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LnRvU3RyaW5nKCkgfVxuICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGZvcm1hdChpdGVtLCBjZWxsKVxuICAgICAgdC5uZXdSb3coKVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgY2IgPSBjYiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LnByaW50VHJhbnNwb3NlZCh7c2VwYXJhdG9yOiAnIDogJ30pIH1cbiAgICBmb3JtYXQob2JqLCBjZWxsKVxuICAgIHQubmV3Um93KClcbiAgfVxuXG4gIHJldHVybiBjYih0KVxufVxuXG4vKipcbiAqIFNhbWUgYXMgYFRhYmxlLnByaW50KClgIGJ1dCB5aWVsZHMgdGhlIHJlc3VsdCB0byBgY29uc29sZS5sb2coKWBcbiAqL1xuXG5UYWJsZS5sb2cgPSBmdW5jdGlvbihvYmosIGZvcm1hdCwgY2IpIHtcbiAgY29uc29sZS5sb2coVGFibGUucHJpbnQob2JqLCBmb3JtYXQsIGNiKSlcbn1cblxuLyoqXG4gKiBTYW1lIGFzIGAudG9TdHJpbmcoKWAgYnV0IHlpZWxkcyB0aGUgcmVzdWx0IHRvIGBjb25zb2xlLmxvZygpYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2codGhpcy50b1N0cmluZygpKVxufVxuIiwiaW1wb3J0IEJlc3RTaG9ydFNpZGVGaXQgZnJvbSAnLi9oZXVyaXN0aWNzL0Jlc3RTaG9ydFNpZGVGaXQnO1xuaW1wb3J0IEJveCBmcm9tICcuL0JveCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpbiB7XG5cdHdpZHRoOiBudW1iZXIgPSAwO1xuXHRoZWlnaHQ6IG51bWJlcj0gMDtcblx0Ym94ZXM6IEJveFtdID0gW107XG5cdGhldXJpc3RpYzogYW55ID0gbnVsbDtcblx0ZnJlZVJlY3RhbmdsZXM6IEZyZWVTcGFjZUJveFtdID0gW107XG5cblx0Y29uc3RydWN0b3Iod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGhldXJpc3RpYykge1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzID0gW25ldyBGcmVlU3BhY2VCb3god2lkdGgsIGhlaWdodCldO1xuXHRcdHRoaXMuaGV1cmlzdGljID0gaGV1cmlzdGljIHx8IG5ldyBCZXN0U2hvcnRTaWRlRml0KCk7XG5cdH1cblxuXHRnZXQgYXJlYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcblx0fVxuXG5cdGdldCBlZmZpY2llbmN5KCkge1xuXHRcdGxldCBib3hlc0FyZWEgPSAwO1xuXHRcdHRoaXMuYm94ZXMuZm9yRWFjaCgoYm94KSA9PiB7XG5cdFx0XHRib3hlc0FyZWEgKz0gYm94LmFyZWE7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIChib3hlc0FyZWEgKiAxMDApIC8gdGhpcy5hcmVhO1xuXHR9XG5cblx0Z2V0IGxhYmVsKCkge1xuXHRcdHJldHVybiBgJHt0aGlzLndpZHRofXgke3RoaXMuaGVpZ2h0fSAke3RoaXMuZWZmaWNpZW5jeX0lYDtcblx0fVxuXG5cdGluc2VydChib3g6IEJveCkge1xuXHRcdGlmIChib3gucGFja2VkKSByZXR1cm4gZmFsc2U7XG5cblx0XHR0aGlzLmhldXJpc3RpYy5maW5kUG9zaXRpb25Gb3JOZXdOb2RlKGJveCwgdGhpcy5mcmVlUmVjdGFuZ2xlcyk7XG5cdFx0aWYgKCFib3gucGFja2VkKSByZXR1cm4gZmFsc2U7XG5cblx0XHRsZXQgbnVtUmVjdGFuZ2xlc1RvUHJvY2VzcyA9IHRoaXMuZnJlZVJlY3RhbmdsZXMubGVuZ3RoO1xuXHRcdGxldCBpID0gMDtcblxuXHRcdHdoaWxlIChpIDwgbnVtUmVjdGFuZ2xlc1RvUHJvY2Vzcykge1xuXHRcdFx0aWYgKHRoaXMuc3BsaXRGcmVlTm9kZSh0aGlzLmZyZWVSZWN0YW5nbGVzW2ldLCBib3gpKSB7XG5cdFx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRudW1SZWN0YW5nbGVzVG9Qcm9jZXNzLS07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5wcnVuZUZyZWVMaXN0KCk7XG5cdFx0dGhpcy5ib3hlcy5wdXNoKGJveCk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHNjb3JlRm9yKGJveDogQm94KSB7XG5cdFx0bGV0IGNvcHlCb3ggPSBuZXcgQm94KGJveC53aWR0aCwgYm94LmhlaWdodCwgYm94LmNvbnN0cmFpblJvdGF0aW9uKTtcblx0XHRsZXQgc2NvcmUgPSB0aGlzLmhldXJpc3RpYy5maW5kUG9zaXRpb25Gb3JOZXdOb2RlKFxuXHRcdFx0Y29weUJveCxcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXNcblx0XHQpO1xuXHRcdHJldHVybiBzY29yZTtcblx0fVxuXG5cdGlzTGFyZ2VyVGhhbihib3g6IEJveCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQodGhpcy53aWR0aCA+PSBib3gud2lkdGggJiYgdGhpcy5oZWlnaHQgPj0gYm94LmhlaWdodCkgfHxcblx0XHRcdCh0aGlzLmhlaWdodCA+PSBib3gud2lkdGggJiYgdGhpcy53aWR0aCA+PSBib3guaGVpZ2h0KVxuXHRcdCk7XG5cdH1cblxuXHRzcGxpdEZyZWVOb2RlKGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdC8vIFRlc3Qgd2l0aCBTQVQgaWYgdGhlIHJlY3RhbmdsZXMgZXZlbiBpbnRlcnNlY3QuXG5cdFx0aWYgKFxuXHRcdFx0dXNlZE5vZGUueCA+PSBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGggfHxcblx0XHRcdHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCA8PSBmcmVlTm9kZS54IHx8XG5cdFx0XHR1c2VkTm9kZS55ID49IGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQgfHxcblx0XHRcdHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQgPD0gZnJlZU5vZGUueVxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMudHJ5U3BsaXRGcmVlTm9kZVZlcnRpY2FsbHkoZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHR0aGlzLnRyeVNwbGl0RnJlZU5vZGVIb3Jpem9udGFsbHkoZnJlZU5vZGUsIHVzZWROb2RlKTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0dHJ5U3BsaXRGcmVlTm9kZVZlcnRpY2FsbHkoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKFxuXHRcdFx0dXNlZE5vZGUueCA8IGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCAmJlxuXHRcdFx0dXNlZE5vZGUueCArIHVzZWROb2RlLndpZHRoID4gZnJlZU5vZGUueFxuXHRcdCkge1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZUF0VG9wKGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0XHR0aGlzLnRyeUxlYXZlRnJlZVNwYWNlQXRCb3R0b20oZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlMZWF2ZUZyZWVTcGFjZUF0VG9wKGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmICh1c2VkTm9kZS55ID4gZnJlZU5vZGUueSAmJiB1c2VkTm9kZS55IDwgZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCkge1xuXHRcdFx0bGV0IG5ld05vZGUgPSB7IC4uLmZyZWVOb2RlIH07XG5cdFx0XHRuZXdOb2RlLmhlaWdodCA9IHVzZWROb2RlLnkgLSBuZXdOb2RlLnk7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VBdEJvdHRvbShmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAodXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodCA8IGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS55ID0gdXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodDtcblx0XHRcdG5ld05vZGUuaGVpZ2h0ID1cblx0XHRcdFx0ZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCAtICh1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0KTtcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMucHVzaChuZXdOb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlTcGxpdEZyZWVOb2RlSG9yaXpvbnRhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmIChcblx0XHRcdHVzZWROb2RlLnkgPCBmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0ICYmXG5cdFx0XHR1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0ID4gZnJlZU5vZGUueVxuXHRcdCkge1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZU9uTGVmdChmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZU9uUmlnaHQoZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlMZWF2ZUZyZWVTcGFjZU9uTGVmdChmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAodXNlZE5vZGUueCA+IGZyZWVOb2RlLnggJiYgdXNlZE5vZGUueCA8IGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCkge1xuXHRcdFx0bGV0IG5ld05vZGUgPSB7IC4uLmZyZWVOb2RlIH07XG5cdFx0XHRuZXdOb2RlLndpZHRoID0gdXNlZE5vZGUueCAtIG5ld05vZGUueDtcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMucHVzaChuZXdOb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlMZWF2ZUZyZWVTcGFjZU9uUmlnaHQoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCA8IGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCkge1xuXHRcdFx0bGV0IG5ld05vZGUgPSB7IC4uLmZyZWVOb2RlIH07XG5cdFx0XHRuZXdOb2RlLnggPSB1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGg7XG5cdFx0XHRuZXdOb2RlLndpZHRoID1cblx0XHRcdFx0ZnJlZU5vZGUueCArIGZyZWVOb2RlLndpZHRoIC0gKHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCk7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdvZXMgdGhyb3VnaCB0aGUgZnJlZSByZWN0YW5nbGUgbGlzdCBhbmQgcmVtb3ZlcyBhbnkgcmVkdW5kYW50IGVudHJpZXMuXG5cdCAqL1xuXHRwcnVuZUZyZWVMaXN0KCkge1xuXHRcdGxldCBpID0gMDtcblx0XHR3aGlsZSAoaSA8IHRoaXMuZnJlZVJlY3RhbmdsZXMubGVuZ3RoKSB7XG5cdFx0XHRsZXQgaiA9IGkgKyAxO1xuXHRcdFx0aWYgKGogPT09IHRoaXMuZnJlZVJlY3RhbmdsZXMubGVuZ3RoKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0d2hpbGUgKGogPCB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5pc0NvbnRhaW5lZEluKHRoaXMuZnJlZVJlY3RhbmdsZXNbaV0sIHRoaXMuZnJlZVJlY3RhbmdsZXNbal0pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdGktLTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5pc0NvbnRhaW5lZEluKHRoaXMuZnJlZVJlY3RhbmdsZXNbal0sIHRoaXMuZnJlZVJlY3RhbmdsZXNbaV0pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMuc3BsaWNlKGosIDEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGorKztcblx0XHRcdFx0fVxuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aXNDb250YWluZWRJbihyZWN0QSwgcmVjdEIpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0cmVjdEEgJiZcblx0XHRcdHJlY3RCICYmXG5cdFx0XHRyZWN0QS54ID49IHJlY3RCLnggJiZcblx0XHRcdHJlY3RBLnkgPj0gcmVjdEIueSAmJlxuXHRcdFx0cmVjdEEueCArIHJlY3RBLndpZHRoIDw9IHJlY3RCLnggKyByZWN0Qi53aWR0aCAmJlxuXHRcdFx0cmVjdEEueSArIHJlY3RBLmhlaWdodCA8PSByZWN0Qi55ICsgcmVjdEIuaGVpZ2h0XG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgRnJlZVNwYWNlQm94IHtcbiAgeCA9IDBcbiAgeSA9IDBcbiAgd2lkdGggPSBudWxsXG4gIGhlaWdodCA9IG51bGxcblxuICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm94IHtcblx0d2lkdGg6IG51bWJlciA9IDA7XG5cdGhlaWdodDogbnVtYmVyID0gMDtcblx0Y29uc3RyYWluUm90YXRpb24gPSBmYWxzZTtcblx0eCA9IDA7XG5cdHkgPSAwO1xuXHRwYWNrZWQgPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3Rvcih3aWR0aDpudW1iZXIgLCBoZWlnaHQ6IG51bWJlciwgY29uc3RyYWluUm90YXRpb24gPSBmYWxzZSkge1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuXHRcdC8vIEF2b2lkIHRoZSBwYWNrZXIgdG8gdHJ5IHRoZSByb3RhdGVkIGRpbWVuc2lvbnNcblx0XHR0aGlzLmNvbnN0cmFpblJvdGF0aW9uID0gY29uc3RyYWluUm90YXRpb247XG5cdH1cblxuXHRyb3RhdGUoKSB7XG5cdFx0bGV0IHsgd2lkdGgsIGhlaWdodCB9ID0gdGhpcztcblx0XHR0aGlzLndpZHRoID0gaGVpZ2h0O1xuXHRcdHRoaXMuaGVpZ2h0ID0gd2lkdGg7XG5cdH1cblxuXHRnZXQgbGFiZWwoKSB7XG5cdFx0cmV0dXJuIGAke3RoaXMud2lkdGh9eCR7dGhpcy5oZWlnaHR9IGF0IFske3RoaXMueH0sJHt0aGlzLnl9XWA7XG5cdH1cblxuXHRnZXQgYXJlYSgpIHtcblx0XHRyZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0O1xuXHR9XG59IiwiaW1wb3J0IEJpbiBmcm9tICcuL0Jpbic7XG5pbXBvcnQgQm94IGZyb20gJy4vQm94JztcbmltcG9ydCBTY29yZSBmcm9tICcuL1Njb3JlJztcbmltcG9ydCBTY29yZUJvYXJkIGZyb20gJy4vU2NvcmVCb2FyZCc7XG5pbXBvcnQgU2NvcmVCb2FyZEVudHJ5IGZyb20gJy4vU2NvcmVCb2FyZEVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2VyIHtcblx0YmluczogQmluW10gPSBbXTtcblx0dW5wYWNrZWRCb3hlczogQm94W10gPSBbXTtcblxuXHRjb25zdHJ1Y3RvcihiaW5zOiBCaW5bXSkge1xuXHRcdHRoaXMuYmlucyA9IGJpbnM7XG5cdH1cblxuXHRwYWNrKGJveGVzOiBCb3hbXSwgb3B0aW9uczogeyBsaW1pdD86IG51bWJlciB9ID0ge30pIHtcbiAgICAgICAgbGV0IHBhY2tlZEJveGVzOiBQYXJ0aWFsPFNjb3JlQm9hcmRFbnRyeT5bXSA9IFtdO1xuICAgICAgICBsZXQgZW50cnk6IFNjb3JlQm9hcmRFbnRyeSB8IG51bGw7XG5cblx0XHRib3hlcyA9IGJveGVzLmZpbHRlcigoYm94KSA9PiAhYm94LnBhY2tlZCk7XG5cdFx0aWYgKGJveGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHBhY2tlZEJveGVzO1xuXG5cdFx0bGV0IGxpbWl0ID0gb3B0aW9ucy5saW1pdCB8fCBTY29yZS5NQVhfSU5UO1xuXHRcdGxldCBib2FyZCA9IG5ldyBTY29yZUJvYXJkKHRoaXMuYmlucywgYm94ZXMpO1xuXHRcdHdoaWxlICgoZW50cnkgPSBib2FyZC5iZXN0Rml0KCkpKSB7XG5cdFx0XHRlbnRyeS5iaW4uaW5zZXJ0KGVudHJ5LmJveCk7XG5cdFx0XHRib2FyZC5yZW1vdmVCb3goZW50cnkuYm94KTtcblx0XHRcdGJvYXJkLnJlY2FsY3VsYXRlQmluKGVudHJ5LmJpbik7XG4gICAgICAgICAgICBwYWNrZWRCb3hlcy5wdXNoKHtib3g6IGVudHJ5LmJveCwgc2NvcmU6IGVudHJ5LnNjb3JlfSk7XG5cdFx0XHRpZiAocGFja2VkQm94ZXMubGVuZ3RoID49IGxpbWl0KSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMudW5wYWNrZWRCb3hlcyA9IGJveGVzLmZpbHRlcigoYm94KSA9PiB7XG5cdFx0XHRyZXR1cm4gIWJveC5wYWNrZWQ7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcGFja2VkQm94ZXM7XG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTY29yZSB7XG4gICAgc3RhdGljIE1BWF9JTlQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICBzY29yZV8xID0gU2NvcmUuTUFYX0lOVDtcbiAgICBzY29yZV8yID0gU2NvcmUuTUFYX0lOVDtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3JlXzE/OiBudW1iZXIsIHNjb3JlXzI/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzY29yZV8xICE9ICd1bmRlZmluZWQnKSB0aGlzLnNjb3JlXzEgPSBzY29yZV8xO1xuICAgICAgICBpZiAodHlwZW9mIHNjb3JlXzIgIT0gJ3VuZGVmaW5lZCcpIHRoaXMuc2NvcmVfMiA9IHNjb3JlXzI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG93ZXIgaXMgYmV0dGVyXG4gICAgICovXG4gICAgdmFsdWVPZigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnNjb3JlXzEgKyB0aGlzLnNjb3JlXzIpO1xuICAgIH1cblxuICAgIGFzc2lnbihvdGhlcikge1xuICAgICAgICB0aGlzLnNjb3JlXzEgPSBvdGhlci5zY29yZV8xO1xuICAgICAgICB0aGlzLnNjb3JlXzIgPSBvdGhlci5zY29yZV8yO1xuICAgIH1cblxuICAgIGlzQmxhbmsoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjb3JlXzEgPT09IFNjb3JlLk1BWF9JTlQ7XG4gICAgfVxuXG4gICAgZGVjcmVhc2VCeShkZWx0YSkge1xuICAgICAgICB0aGlzLnNjb3JlXzEgKz0gZGVsdGE7XG4gICAgICAgIHRoaXMuc2NvcmVfMiArPSBkZWx0YTtcbiAgICB9XG59IiwiLy8gIyAgICAgICBib3hfMSBib3hfMiBib3hfMyAuLi5cbi8vICMgYmluXzEgIDEwMCAgIDIwMCAgICAwXG4vLyAjIGJpbl8yICAgMCAgICAgNSAgICAgMFxuLy8gIyBiaW5fMyAgIDkgICAgMTAwICAgIDBcbi8vICMgLi4uXG5pbXBvcnQgQmluIGZyb20gJy4vQmluJztcbmltcG9ydCBCb3ggZnJvbSAnLi9Cb3gnO1xuaW1wb3J0IFNjb3JlQm9hcmRFbnRyeSBmcm9tICcuL1Njb3JlQm9hcmRFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlQm9hcmQge1xuXHRlbnRyaWVzOiBTY29yZUJvYXJkRW50cnlbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKGJpbnM6IEJpbltdLCBib3hlczogQm94W10pIHtcblx0XHRiaW5zLmZvckVhY2goKGJpbikgPT4ge1xuXHRcdFx0dGhpcy5hZGRCaW5FbnRyaWVzKGJpbiwgYm94ZXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZGVidWcoKSB7XG5cdFx0cmVxdWlyZSgnY29uc29sZS50YWJsZScpO1xuXHRcdGNvbnNvbGUudGFibGUoXG5cdFx0XHR0aGlzLmVudHJpZXMubWFwKChlbnRyeSkgPT4gKHtcblx0XHRcdFx0YmluOiBlbnRyeS5iaW4ubGFiZWwsXG5cdFx0XHRcdGJveDogZW50cnkuYm94LmxhYmVsLFxuXHRcdFx0XHRzY29yZTogZW50cnkuc2NvcmUsXG5cdFx0XHR9KSlcblx0XHQpO1xuXHR9XG5cblx0YWRkQmluRW50cmllcyhiaW4sIGJveGVzKSB7XG5cdFx0Ym94ZXMuZm9yRWFjaCgoYm94KSA9PiB7XG5cdFx0XHRsZXQgZW50cnkgPSBuZXcgU2NvcmVCb2FyZEVudHJ5KGJpbiwgYm94KTtcblx0XHRcdGVudHJ5LmNhbGN1bGF0ZSgpO1xuXHRcdFx0dGhpcy5lbnRyaWVzLnB1c2goZW50cnkpO1xuXHRcdH0pO1xuXHR9XG5cblx0bGFyZ2VzdE5vdEZpdGluZ0JveCgpIHtcbiAgICAgICAgbGV0IHVuZml0O1xuXHRcdGxldCBmaXR0aW5nQm94ZXMgPSB0aGlzLmVudHJpZXNcblx0XHRcdC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5maXQpXG5cdFx0XHQubWFwKChlbnRyeSkgPT4gZW50cnkuYm94KTtcblxuXHRcdHRoaXMuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuXHRcdFx0aWYgKCFmaXR0aW5nQm94ZXMuaW5jbHVkZXMoZW50cnkuYm94KSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodW5maXQgPT09IG51bGwgfHwgdW5maXQuYm94LmFyZWEgPCBlbnRyeS5ib3guYXJlYSkge1xuXHRcdFx0XHR1bmZpdCA9IGVudHJ5O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHVuZml0LmJveCA/IHVuZml0IDogZmFsc2U7XG5cdH1cblxuXHRiZXN0Rml0KCkge1xuXHRcdGxldCBiZXN0OiBTY29yZUJvYXJkRW50cnkgfCBudWxsID0gbnVsbDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IGVudHJ5ID0gdGhpcy5lbnRyaWVzW2ldO1xuXHRcdFx0aWYgKCFlbnRyeS5maXQoKSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGlmIChiZXN0ID09PSBudWxsIHx8IGVudHJ5LnNjb3JlIDwgYmVzdC5zY29yZSkge1xuXHRcdFx0XHRiZXN0ID0gZW50cnk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBiZXN0O1xuXHR9XG5cblx0cmVtb3ZlQm94KGJveCkge1xuXHRcdHRoaXMuZW50cmllcyA9IHRoaXMuZW50cmllcy5maWx0ZXIoKGVudHJ5KSA9PiB7XG5cdFx0XHRyZXR1cm4gZW50cnkuYm94ICE9PSBib3g7XG5cdFx0fSk7XG5cdH1cblxuXHRhZGRCaW4oYmluKSB7XG5cdFx0dGhpcy5hZGRCaW5FbnRyaWVzKGJpbiwgdGhpcy5jdXJyZW50Qm94ZXMoKSk7XG5cdH1cblxuXHRyZWNhbGN1bGF0ZUJpbihiaW4pIHtcblx0XHR0aGlzLmVudHJpZXNcblx0XHRcdC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5iaW4gPT09IGJpbilcblx0XHRcdC5mb3JFYWNoKChlbnRyeSkgPT4gZW50cnkuY2FsY3VsYXRlKCkpO1xuXHR9XG5cblx0Y3VycmVudEJveGVzKCkge1xuXHRcdHJldHVybiBbLi4ubmV3IFNldCh0aGlzLmVudHJpZXMubWFwKChlbnRyeSkgPT4gZW50cnkuYm94KSldO1xuXHR9XG59XG4iLCJpbXBvcnQgQmluIGZyb20gXCIuL0JpblwiO1xuaW1wb3J0IEJveCBmcm9tIFwiLi9Cb3hcIjtcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9TY29yZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29yZUJvYXJkRW50cnkge1xuICAgIGJpbjogQmluO1xuICAgIGJveDogQm94O1xuICAgIHNjb3JlOiBTY29yZTtcblxuICAgIGNvbnN0cnVjdG9yKGJpbjogQmluLCBib3g6IEJveCkge1xuICAgICAgICB0aGlzLmJpbiA9IGJpblxuICAgICAgICB0aGlzLmJveCA9IGJveFxuICAgIH1cblxuICAgIGNhbGN1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5zY29yZSA9IHRoaXMuYmluLnNjb3JlRm9yKHRoaXMuYm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NvcmU7XG4gICAgfVxuXG4gICAgZml0KCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuc2NvcmUuaXNCbGFuaygpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBGcmVlU3BhY2VCb3ggfSBmcm9tICcuLi9CaW4nO1xuaW1wb3J0IEJveCBmcm9tICcuLi9Cb3gnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZSB7XG5cdGZpbmRQb3NpdGlvbkZvck5ld05vZGUoYm94OiBCb3gsIGZyZWVSZWN0czogRnJlZVNwYWNlQm94W10pIHtcblx0XHRsZXQgYmVzdFNjb3JlID0gbmV3IFNjb3JlKCk7XG5cdFx0bGV0IHdpZHRoID0gYm94LndpZHRoO1xuXHRcdGxldCBoZWlnaHQgPSBib3guaGVpZ2h0O1xuXG5cdFx0ZnJlZVJlY3RzLmZvckVhY2goKGZyZWVSZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnRyeVBsYWNlUmVjdEluKGZyZWVSZWN0LCBib3gsIHdpZHRoLCBoZWlnaHQsIGJlc3RTY29yZSk7XG5cdFx0XHRpZiAoIWJveC5jb25zdHJhaW5Sb3RhdGlvbikge1xuXHRcdFx0XHR0aGlzLnRyeVBsYWNlUmVjdEluKGZyZWVSZWN0LCBib3gsIGhlaWdodCwgd2lkdGgsIGJlc3RTY29yZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYmVzdFNjb3JlO1xuXHR9XG5cblx0dHJ5UGxhY2VSZWN0SW4oZnJlZVJlY3QsIGJveCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0LCBiZXN0U2NvcmUpIHtcblx0XHRpZiAoZnJlZVJlY3Qud2lkdGggPj0gcmVjdFdpZHRoICYmIGZyZWVSZWN0LmhlaWdodCA+PSByZWN0SGVpZ2h0KSB7XG5cdFx0XHRsZXQgc2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVNjb3JlKCk7XG5cdFx0XHRpZiAoc2NvcmUgPCBiZXN0U2NvcmUpIHtcblx0XHRcdFx0Ym94LnggPSBmcmVlUmVjdC54O1xuXHRcdFx0XHRib3gueSA9IGZyZWVSZWN0Lnk7XG5cdFx0XHRcdGJveC53aWR0aCA9IHJlY3RXaWR0aDtcblx0XHRcdFx0Ym94LmhlaWdodCA9IHJlY3RIZWlnaHQ7XG5cdFx0XHRcdGJveC5wYWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRiZXN0U2NvcmUuYXNzaWduKHNjb3JlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjYWxjdWxhdGVTY29yZSgpIHtcblx0XHR0aHJvdyAnTm90SW1wbGVtZW50ZWRFcnJvcic7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICBbIDB4MDMwMCwgMHgwMzZGIF0sIFsgMHgwNDgzLCAweDA0ODYgXSwgWyAweDA0ODgsIDB4MDQ4OSBdLFxuICAgIFsgMHgwNTkxLCAweDA1QkQgXSwgWyAweDA1QkYsIDB4MDVCRiBdLCBbIDB4MDVDMSwgMHgwNUMyIF0sXG4gICAgWyAweDA1QzQsIDB4MDVDNSBdLCBbIDB4MDVDNywgMHgwNUM3IF0sIFsgMHgwNjAwLCAweDA2MDMgXSxcbiAgICBbIDB4MDYxMCwgMHgwNjE1IF0sIFsgMHgwNjRCLCAweDA2NUUgXSwgWyAweDA2NzAsIDB4MDY3MCBdLFxuICAgIFsgMHgwNkQ2LCAweDA2RTQgXSwgWyAweDA2RTcsIDB4MDZFOCBdLCBbIDB4MDZFQSwgMHgwNkVEIF0sXG4gICAgWyAweDA3MEYsIDB4MDcwRiBdLCBbIDB4MDcxMSwgMHgwNzExIF0sIFsgMHgwNzMwLCAweDA3NEEgXSxcbiAgICBbIDB4MDdBNiwgMHgwN0IwIF0sIFsgMHgwN0VCLCAweDA3RjMgXSwgWyAweDA5MDEsIDB4MDkwMiBdLFxuICAgIFsgMHgwOTNDLCAweDA5M0MgXSwgWyAweDA5NDEsIDB4MDk0OCBdLCBbIDB4MDk0RCwgMHgwOTREIF0sXG4gICAgWyAweDA5NTEsIDB4MDk1NCBdLCBbIDB4MDk2MiwgMHgwOTYzIF0sIFsgMHgwOTgxLCAweDA5ODEgXSxcbiAgICBbIDB4MDlCQywgMHgwOUJDIF0sIFsgMHgwOUMxLCAweDA5QzQgXSwgWyAweDA5Q0QsIDB4MDlDRCBdLFxuICAgIFsgMHgwOUUyLCAweDA5RTMgXSwgWyAweDBBMDEsIDB4MEEwMiBdLCBbIDB4MEEzQywgMHgwQTNDIF0sXG4gICAgWyAweDBBNDEsIDB4MEE0MiBdLCBbIDB4MEE0NywgMHgwQTQ4IF0sIFsgMHgwQTRCLCAweDBBNEQgXSxcbiAgICBbIDB4MEE3MCwgMHgwQTcxIF0sIFsgMHgwQTgxLCAweDBBODIgXSwgWyAweDBBQkMsIDB4MEFCQyBdLFxuICAgIFsgMHgwQUMxLCAweDBBQzUgXSwgWyAweDBBQzcsIDB4MEFDOCBdLCBbIDB4MEFDRCwgMHgwQUNEIF0sXG4gICAgWyAweDBBRTIsIDB4MEFFMyBdLCBbIDB4MEIwMSwgMHgwQjAxIF0sIFsgMHgwQjNDLCAweDBCM0MgXSxcbiAgICBbIDB4MEIzRiwgMHgwQjNGIF0sIFsgMHgwQjQxLCAweDBCNDMgXSwgWyAweDBCNEQsIDB4MEI0RCBdLFxuICAgIFsgMHgwQjU2LCAweDBCNTYgXSwgWyAweDBCODIsIDB4MEI4MiBdLCBbIDB4MEJDMCwgMHgwQkMwIF0sXG4gICAgWyAweDBCQ0QsIDB4MEJDRCBdLCBbIDB4MEMzRSwgMHgwQzQwIF0sIFsgMHgwQzQ2LCAweDBDNDggXSxcbiAgICBbIDB4MEM0QSwgMHgwQzREIF0sIFsgMHgwQzU1LCAweDBDNTYgXSwgWyAweDBDQkMsIDB4MENCQyBdLFxuICAgIFsgMHgwQ0JGLCAweDBDQkYgXSwgWyAweDBDQzYsIDB4MENDNiBdLCBbIDB4MENDQywgMHgwQ0NEIF0sXG4gICAgWyAweDBDRTIsIDB4MENFMyBdLCBbIDB4MEQ0MSwgMHgwRDQzIF0sIFsgMHgwRDRELCAweDBENEQgXSxcbiAgICBbIDB4MERDQSwgMHgwRENBIF0sIFsgMHgwREQyLCAweDBERDQgXSwgWyAweDBERDYsIDB4MERENiBdLFxuICAgIFsgMHgwRTMxLCAweDBFMzEgXSwgWyAweDBFMzQsIDB4MEUzQSBdLCBbIDB4MEU0NywgMHgwRTRFIF0sXG4gICAgWyAweDBFQjEsIDB4MEVCMSBdLCBbIDB4MEVCNCwgMHgwRUI5IF0sIFsgMHgwRUJCLCAweDBFQkMgXSxcbiAgICBbIDB4MEVDOCwgMHgwRUNEIF0sIFsgMHgwRjE4LCAweDBGMTkgXSwgWyAweDBGMzUsIDB4MEYzNSBdLFxuICAgIFsgMHgwRjM3LCAweDBGMzcgXSwgWyAweDBGMzksIDB4MEYzOSBdLCBbIDB4MEY3MSwgMHgwRjdFIF0sXG4gICAgWyAweDBGODAsIDB4MEY4NCBdLCBbIDB4MEY4NiwgMHgwRjg3IF0sIFsgMHgwRjkwLCAweDBGOTcgXSxcbiAgICBbIDB4MEY5OSwgMHgwRkJDIF0sIFsgMHgwRkM2LCAweDBGQzYgXSwgWyAweDEwMkQsIDB4MTAzMCBdLFxuICAgIFsgMHgxMDMyLCAweDEwMzIgXSwgWyAweDEwMzYsIDB4MTAzNyBdLCBbIDB4MTAzOSwgMHgxMDM5IF0sXG4gICAgWyAweDEwNTgsIDB4MTA1OSBdLCBbIDB4MTE2MCwgMHgxMUZGIF0sIFsgMHgxMzVGLCAweDEzNUYgXSxcbiAgICBbIDB4MTcxMiwgMHgxNzE0IF0sIFsgMHgxNzMyLCAweDE3MzQgXSwgWyAweDE3NTIsIDB4MTc1MyBdLFxuICAgIFsgMHgxNzcyLCAweDE3NzMgXSwgWyAweDE3QjQsIDB4MTdCNSBdLCBbIDB4MTdCNywgMHgxN0JEIF0sXG4gICAgWyAweDE3QzYsIDB4MTdDNiBdLCBbIDB4MTdDOSwgMHgxN0QzIF0sIFsgMHgxN0RELCAweDE3REQgXSxcbiAgICBbIDB4MTgwQiwgMHgxODBEIF0sIFsgMHgxOEE5LCAweDE4QTkgXSwgWyAweDE5MjAsIDB4MTkyMiBdLFxuICAgIFsgMHgxOTI3LCAweDE5MjggXSwgWyAweDE5MzIsIDB4MTkzMiBdLCBbIDB4MTkzOSwgMHgxOTNCIF0sXG4gICAgWyAweDFBMTcsIDB4MUExOCBdLCBbIDB4MUIwMCwgMHgxQjAzIF0sIFsgMHgxQjM0LCAweDFCMzQgXSxcbiAgICBbIDB4MUIzNiwgMHgxQjNBIF0sIFsgMHgxQjNDLCAweDFCM0MgXSwgWyAweDFCNDIsIDB4MUI0MiBdLFxuICAgIFsgMHgxQjZCLCAweDFCNzMgXSwgWyAweDFEQzAsIDB4MURDQSBdLCBbIDB4MURGRSwgMHgxREZGIF0sXG4gICAgWyAweDIwMEIsIDB4MjAwRiBdLCBbIDB4MjAyQSwgMHgyMDJFIF0sIFsgMHgyMDYwLCAweDIwNjMgXSxcbiAgICBbIDB4MjA2QSwgMHgyMDZGIF0sIFsgMHgyMEQwLCAweDIwRUYgXSwgWyAweDMwMkEsIDB4MzAyRiBdLFxuICAgIFsgMHgzMDk5LCAweDMwOUEgXSwgWyAweEE4MDYsIDB4QTgwNiBdLCBbIDB4QTgwQiwgMHhBODBCIF0sXG4gICAgWyAweEE4MjUsIDB4QTgyNiBdLCBbIDB4RkIxRSwgMHhGQjFFIF0sIFsgMHhGRTAwLCAweEZFMEYgXSxcbiAgICBbIDB4RkUyMCwgMHhGRTIzIF0sIFsgMHhGRUZGLCAweEZFRkYgXSwgWyAweEZGRjksIDB4RkZGQiBdLFxuICAgIFsgMHgxMEEwMSwgMHgxMEEwMyBdLCBbIDB4MTBBMDUsIDB4MTBBMDYgXSwgWyAweDEwQTBDLCAweDEwQTBGIF0sXG4gICAgWyAweDEwQTM4LCAweDEwQTNBIF0sIFsgMHgxMEEzRiwgMHgxMEEzRiBdLCBbIDB4MUQxNjcsIDB4MUQxNjkgXSxcbiAgICBbIDB4MUQxNzMsIDB4MUQxODIgXSwgWyAweDFEMTg1LCAweDFEMThCIF0sIFsgMHgxRDFBQSwgMHgxRDFBRCBdLFxuICAgIFsgMHgxRDI0MiwgMHgxRDI0NCBdLCBbIDB4RTAwMDEsIDB4RTAwMDEgXSwgWyAweEUwMDIwLCAweEUwMDdGIF0sXG4gICAgWyAweEUwMTAwLCAweEUwMUVGIF1cbl1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJ2RlZmF1bHRzJylcbnZhciBjb21iaW5pbmcgPSByZXF1aXJlKCcuL2NvbWJpbmluZycpXG5cbnZhciBERUZBVUxUUyA9IHtcbiAgbnVsOiAwLFxuICBjb250cm9sOiAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2N3aWR0aChzdHIpIHtcbiAgcmV0dXJuIHdjc3dpZHRoKHN0ciwgREVGQVVMVFMpXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbmZpZyA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgb3B0cyA9IGRlZmF1bHRzKG9wdHMgfHwge30sIERFRkFVTFRTKVxuICByZXR1cm4gZnVuY3Rpb24gd2N3aWR0aChzdHIpIHtcbiAgICByZXR1cm4gd2Nzd2lkdGgoc3RyLCBvcHRzKVxuICB9XG59XG5cbi8qXG4gKiAgVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgZGVmaW5lIHRoZSBjb2x1bW4gd2lkdGggb2YgYW4gSVNPIDEwNjQ2XG4gKiAgY2hhcmFjdGVyIGFzIGZvbGxvd3M6XG4gKiAgLSBUaGUgbnVsbCBjaGFyYWN0ZXIgKFUrMDAwMCkgaGFzIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBPdGhlciBDMC9DMSBjb250cm9sIGNoYXJhY3RlcnMgYW5kIERFTCB3aWxsIGxlYWQgdG8gYSByZXR1cm4gdmFsdWVcbiAqICAgIG9mIC0xLlxuICogIC0gTm9uLXNwYWNpbmcgYW5kIGVuY2xvc2luZyBjb21iaW5pbmcgY2hhcmFjdGVycyAoZ2VuZXJhbCBjYXRlZ29yeVxuICogICAgY29kZSBNbiBvciBNZSBpbiB0aGVcbiAqICAgIFVuaWNvZGUgZGF0YWJhc2UpIGhhdmUgYSBjb2x1bW4gd2lkdGggb2YgMC5cbiAqICAtIFNPRlQgSFlQSEVOIChVKzAwQUQpIGhhcyBhIGNvbHVtbiB3aWR0aCBvZiAxLlxuICogIC0gT3RoZXIgZm9ybWF0IGNoYXJhY3RlcnMgKGdlbmVyYWwgY2F0ZWdvcnkgY29kZSBDZiBpbiB0aGUgVW5pY29kZVxuICogICAgZGF0YWJhc2UpIGFuZCBaRVJPIFdJRFRIXG4gKiAgICBTUEFDRSAoVSsyMDBCKSBoYXZlIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBIYW5ndWwgSmFtbyBtZWRpYWwgdm93ZWxzIGFuZCBmaW5hbCBjb25zb25hbnRzIChVKzExNjAtVSsxMUZGKVxuICogICAgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAwLlxuICogIC0gU3BhY2luZyBjaGFyYWN0ZXJzIGluIHRoZSBFYXN0IEFzaWFuIFdpZGUgKFcpIG9yIEVhc3QgQXNpYW5cbiAqICAgIEZ1bGwtd2lkdGggKEYpIGNhdGVnb3J5IGFzXG4gKiAgICBkZWZpbmVkIGluIFVuaWNvZGUgVGVjaG5pY2FsIFJlcG9ydCAjMTEgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAyLlxuICogIC0gQWxsIHJlbWFpbmluZyBjaGFyYWN0ZXJzIChpbmNsdWRpbmcgYWxsIHByaW50YWJsZSBJU08gODg1OS0xIGFuZFxuICogICAgV0dMNCBjaGFyYWN0ZXJzLCBVbmljb2RlIGNvbnRyb2wgY2hhcmFjdGVycywgZXRjLikgaGF2ZSBhIGNvbHVtblxuICogICAgd2lkdGggb2YgMS5cbiAqICBUaGlzIGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdGhhdCBjaGFyYWN0ZXJzIGFyZSBlbmNvZGVkIGluIElTTyAxMDY0Ni5cbiovXG5cbmZ1bmN0aW9uIHdjc3dpZHRoKHN0ciwgb3B0cykge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiB3Y3dpZHRoKHN0ciwgb3B0cylcblxuICB2YXIgcyA9IDBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbiA9IHdjd2lkdGgoc3RyLmNoYXJDb2RlQXQoaSksIG9wdHMpXG4gICAgaWYgKG4gPCAwKSByZXR1cm4gLTFcbiAgICBzICs9IG5cbiAgfVxuXG4gIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIHdjd2lkdGgodWNzLCBvcHRzKSB7XG4gIC8vIHRlc3QgZm9yIDgtYml0IGNvbnRyb2wgY2hhcmFjdGVyc1xuICBpZiAodWNzID09PSAwKSByZXR1cm4gb3B0cy5udWxcbiAgaWYgKHVjcyA8IDMyIHx8ICh1Y3MgPj0gMHg3ZiAmJiB1Y3MgPCAweGEwKSkgcmV0dXJuIG9wdHMuY29udHJvbFxuXG4gIC8vIGJpbmFyeSBzZWFyY2ggaW4gdGFibGUgb2Ygbm9uLXNwYWNpbmcgY2hhcmFjdGVyc1xuICBpZiAoYmlzZWFyY2godWNzKSkgcmV0dXJuIDBcblxuICAvLyBpZiB3ZSBhcnJpdmUgaGVyZSwgdWNzIGlzIG5vdCBhIGNvbWJpbmluZyBvciBDMC9DMSBjb250cm9sIGNoYXJhY3RlclxuICByZXR1cm4gMSArXG4gICAgICAodWNzID49IDB4MTEwMCAmJlxuICAgICAgICh1Y3MgPD0gMHgxMTVmIHx8ICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5ndWwgSmFtbyBpbml0LiBjb25zb25hbnRzXG4gICAgICAgIHVjcyA9PSAweDIzMjkgfHwgdWNzID09IDB4MjMyYSB8fFxuICAgICAgICAodWNzID49IDB4MmU4MCAmJiB1Y3MgPD0gMHhhNGNmICYmXG4gICAgICAgICB1Y3MgIT0gMHgzMDNmKSB8fCAgICAgICAgICAgICAgICAgICAgIC8vIENKSyAuLi4gWWlcbiAgICAgICAgKHVjcyA+PSAweGFjMDAgJiYgdWNzIDw9IDB4ZDdhMykgfHwgICAgLy8gSGFuZ3VsIFN5bGxhYmxlc1xuICAgICAgICAodWNzID49IDB4ZjkwMCAmJiB1Y3MgPD0gMHhmYWZmKSB8fCAgICAvLyBDSksgQ29tcGF0aWJpbGl0eSBJZGVvZ3JhcGhzXG4gICAgICAgICh1Y3MgPj0gMHhmZTEwICYmIHVjcyA8PSAweGZlMTkpIHx8ICAgIC8vIFZlcnRpY2FsIGZvcm1zXG4gICAgICAgICh1Y3MgPj0gMHhmZTMwICYmIHVjcyA8PSAweGZlNmYpIHx8ICAgIC8vIENKSyBDb21wYXRpYmlsaXR5IEZvcm1zXG4gICAgICAgICh1Y3MgPj0gMHhmZjAwICYmIHVjcyA8PSAweGZmNjApIHx8ICAgIC8vIEZ1bGx3aWR0aCBGb3Jtc1xuICAgICAgICAodWNzID49IDB4ZmZlMCAmJiB1Y3MgPD0gMHhmZmU2KSB8fFxuICAgICAgICAodWNzID49IDB4MjAwMDAgJiYgdWNzIDw9IDB4MmZmZmQpIHx8XG4gICAgICAgICh1Y3MgPj0gMHgzMDAwMCAmJiB1Y3MgPD0gMHgzZmZmZCkpKTtcbn1cblxuZnVuY3Rpb24gYmlzZWFyY2godWNzKSB7XG4gIHZhciBtaW4gPSAwXG4gIHZhciBtYXggPSBjb21iaW5pbmcubGVuZ3RoIC0gMVxuICB2YXIgbWlkXG5cbiAgaWYgKHVjcyA8IGNvbWJpbmluZ1swXVswXSB8fCB1Y3MgPiBjb21iaW5pbmdbbWF4XVsxXSkgcmV0dXJuIGZhbHNlXG5cbiAgd2hpbGUgKG1heCA+PSBtaW4pIHtcbiAgICBtaWQgPSBNYXRoLmZsb29yKChtaW4gKyBtYXgpIC8gMilcbiAgICBpZiAodWNzID4gY29tYmluaW5nW21pZF1bMV0pIG1pbiA9IG1pZCArIDFcbiAgICBlbHNlIGlmICh1Y3MgPCBjb21iaW5pbmdbbWlkXVswXSkgbWF4ID0gbWlkIC0gMVxuICAgIGVsc2UgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlc3RBcmVhRml0IGV4dGVuZHMgQmFzZSB7XG5cbiAgY2FsY3VsYXRlU2NvcmUoZnJlZVJlY3QsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCkge1xuICAgIGxldCBhcmVhRml0ID0gZnJlZVJlY3Qud2lkdGggKiBmcmVlUmVjdC5oZWlnaHQgLSByZWN0V2lkdGggKiByZWN0SGVpZ2h0O1xuICAgIGxldCBsZWZ0T3Zlckhvcml6ID0gTWF0aC5hYnMoZnJlZVJlY3Qud2lkdGggLSByZWN0V2lkdGgpO1xuICAgIGxldCBsZWZ0T3ZlclZlcnQgPSBNYXRoLmFicyhmcmVlUmVjdC5oZWlnaHQgLSByZWN0SGVpZ2h0KTtcbiAgICBsZXQgc2hvcnRTaWRlRml0ID0gTWF0aC5taW4obGVmdE92ZXJIb3JpeiwgbGVmdE92ZXJWZXJ0KTtcbiAgICByZXR1cm4gbmV3IFNjb3JlKGFyZWFGaXQsIHNob3J0U2lkZUZpdCk7XG4gIH1cblxufSIsImltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZXN0TG9uZ1NpZGVGaXQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IGxlZnRPdmVySG9yaXogPSBNYXRoLmFicyhmcmVlUmVjdC53aWR0aCAtIHJlY3RXaWR0aCk7XG4gICAgbGV0IGxlZnRPdmVyVmVydCA9IE1hdGguYWJzKGZyZWVSZWN0LmhlaWdodCAtIHJlY3RIZWlnaHQpO1xuICAgIGxldCBhcmdzID0gW2xlZnRPdmVySG9yaXosIGxlZnRPdmVyVmVydF0uc29ydCgoYSwgYikgPT4gYSAtIGIpLnJldmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFNjb3JlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICB9XG5cbn0iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVzdFNob3J0U2lkZUZpdCBleHRlbmRzIEJhc2Uge1xuXG4gIGNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpIHtcbiAgICBsZXQgbGVmdE92ZXJIb3JpeiA9IE1hdGguYWJzKGZyZWVSZWN0LndpZHRoIC0gcmVjdFdpZHRoKTtcbiAgICBsZXQgbGVmdE92ZXJWZXJ0ID0gTWF0aC5hYnMoZnJlZVJlY3QuaGVpZ2h0IC0gcmVjdEhlaWdodCk7XG4gICAgbGV0IGFyZ3MgPSBbbGVmdE92ZXJIb3JpeiwgbGVmdE92ZXJWZXJ0XS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgbGV0IHNjb3JlID0gbmV3IFNjb3JlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIHJldHVybiBzY29yZTtcbiAgfVxuXG59IiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdHRvbUxlZnQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IHRvcFNpZGVZID0gZnJlZVJlY3QueSArIHJlY3RIZWlnaHQ7XG4gICAgcmV0dXJuIG5ldyBTY29yZSh0b3BTaWRlWSwgZnJlZVJlY3QueCk7XG4gIH1cblxufSIsImV4cG9ydCB7IGRlZmF1bHQgYXMgQmVzdEFyZWFGaXQgfSBmcm9tICcuL0Jlc3RBcmVhRml0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQmVzdExvbmdTaWRlRml0IH0gZnJvbSAnLi9CZXN0TG9uZ1NpZGVGaXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBCZXN0U2hvcnRTaWRlRml0IH0gZnJvbSAnLi9CZXN0U2hvcnRTaWRlRml0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQm90dG9tTGVmdCB9IGZyb20gJy4vQm90dG9tTGVmdCc7IiwiaW1wb3J0IEJpbiBmcm9tICcuL0JpbidcbmltcG9ydCBCb3ggZnJvbSAnLi9Cb3gnXG5pbXBvcnQgUGFja2VyIGZyb20gJy4vUGFja2VyJ1xuaW1wb3J0ICogYXMgaGV1cmlzdGljcyBmcm9tICcuL2hldXJpc3RpY3MnO1xuXG5leHBvcnQgeyBCaW4sIEJveCwgUGFja2VyLCBoZXVyaXN0aWNzIH07IiwiaW1wb3J0IHsgZmFjdG9yZWRJbnRlZ2VyIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7Y3JlYXRlTG9nZ2VyfSBmcm9tIFwiLi4vbGliL2xvZ1wiO1xuY29uc3QgbG9nID0gY3JlYXRlTG9nZ2VyKCczRDonKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmluIHtcblxuICBuYW1lID0gJyc7XG4gIHdpZHRoID0gMDtcbiAgaGVpZ2h0ID0gMDtcbiAgZGVwdGggPSAwO1xuICBtYXhXZWlnaHQgPSAwO1xuXG4gIGl0ZW1zID0gW107XG5cbiAgY29uc3RydWN0b3IobmFtZSwgdywgaCwgZCwgbXcpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMud2lkdGggPSBmYWN0b3JlZEludGVnZXIoIHcgKTtcbiAgICB0aGlzLmhlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggaCApO1xuICAgIHRoaXMuZGVwdGggPSBmYWN0b3JlZEludGVnZXIoIGQgKTtcbiAgICB0aGlzLm1heFdlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggbXcgKTtcbiAgfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIGdldFdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLndpZHRoO1xuICB9XG5cbiAgZ2V0SGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIGdldERlcHRoKCkge1xuICAgIHJldHVybiB0aGlzLmRlcHRoO1xuICB9XG5cbiAgZ2V0TWF4V2VpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLm1heFdlaWdodDtcbiAgfVxuXG4gIGdldEl0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICB9XG5cbiAgZ2V0Vm9sdW1lKCkge1xuICAgIHJldHVybiB0aGlzLmdldFdpZHRoKCkgKiB0aGlzLmdldEhlaWdodCgpICogdGhpcy5nZXREZXB0aCgpO1xuICB9XG5cbiAgZ2V0UGFja2VkV2VpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLnJlZHVjZSggKCB3ZWlnaHQsIGl0ZW0gKSA9PiB3ZWlnaHQgKyBpdGVtLmdldFdlaWdodCgpLCAwICk7XG4gIH1cblxuICB3ZWlnaEl0ZW0oaXRlbSkge1xuICAgIGNvbnN0IG1heFdlaWdodCA9IHRoaXMuZ2V0TWF4V2VpZ2h0KCk7XG4gICAgcmV0dXJuICEgbWF4V2VpZ2h0IHx8IGl0ZW0uZ2V0V2VpZ2h0KCkgKyB0aGlzLmdldFBhY2tlZFdlaWdodCgpIDw9IG1heFdlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgYSBzY29yZSBmb3IgYSBnaXZlbiBpdGVtIGFuZCByb3RhdGlvbiB0eXBlLlxuICAgKlxuICAgKiBTY29yZXMgYXJlIGhpZ2hlciBmb3Igcm90YXRpb25zIHRoYXQgY2xvc2VzdCBtYXRjaCBpdGVtIGRpbWVuc2lvbnMgdG8gQmluIGRpbWVuc2lvbnMuXG4gICAqIEZvciBleGFtcGxlLCByb3RhdGluZyB0aGUgaXRlbSBzbyB0aGUgbG9uZ2VzdCBzaWRlIGlzIGFsaWduZWQgd2l0aCB0aGUgbG9uZ2VzdCBCaW4gc2lkZS5cbiAgICpcbiAgICogRXhhbXBsZSAoQmluIGlzIDExIHggOC41IHggNS41LCBJdGVtIGlzIDguMSB4IDUuMiB4IDUuMik6XG4gICAqICBSb3RhdGlvbiAwOlxuICAgKiAgICA4LjEgLyAxMSAgPSAwLjczNlxuICAgKiAgICA1LjIgLyA4LjUgPSAwLjYxMlxuICAgKiAgICA1LjIgLyA1LjUgPSAwLjk0NVxuICAgKiAgICAtLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgICAwLjczNiAqKiAyICsgMC42MTIgKiogMiArIDAuOTQ1ICoqIDIgPSAxLjgwOVxuICAgKlxuICAgKiAgUm90YXRpb24gMTpcbiAgICogICAgOC4xIC8gOC41ID0gMC45NTNcbiAgICogICAgNS4yIC8gMTEgPSAwLjQ3M1xuICAgKiAgICA1LjIgLyA1LjUgPSAwLjk0NVxuICAgKiAgICAtLS0tLS0tLS0tLS0tLS0tLVxuICAgKiAgICAwLjk1MyAqKiAyICsgMC40NzMgKiogMiArIDAuOTQ1ICoqIDIgPSAyLjAyNVxuICAgKlxuICAgKiBAcGFyYW0ge0l0ZW19IGl0ZW1cbiAgICogQHBhcmFtIHtpbnR9IHJvdGF0aW9uVHlwZVxuICAgKiBAcmV0dXJuIHtmbG9hdH0gc2NvcmVcbiAgICovXG4gIHNjb3JlUm90YXRpb24oaXRlbSwgcm90YXRpb25UeXBlKSB7XG4gICAgaXRlbS5yb3RhdGlvblR5cGUgPSByb3RhdGlvblR5cGU7XG4gICAgbGV0IGQgPSBpdGVtLmdldERpbWVuc2lvbigpO1xuXG4gICAgLy8gSWYgdGhlIGl0ZW0gZG9lc24ndCBmaXQgaW4gdGhlIEJpblxuICAgIGlmICggdGhpcy5nZXRXaWR0aCgpIDwgZFswXSB8fCB0aGlzLmdldEhlaWdodCgpIDwgZFsxXSB8fCB0aGlzLmdldERlcHRoKCkgPCBkWzJdICkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICAvLyBTcXVhcmUgdGhlIHJlc3VsdHMgdG8gaW5jcmVhc2UgdGhlIGltcGFjdCBvZiBoaWdoIHZhbHVlcyAoZS5nLiA+IDAuOClcbiAgICBjb25zdCB3aWR0aFNjb3JlID0gTWF0aC5wb3coIGRbMF0gLyB0aGlzLmdldFdpZHRoKCksIDIgKTtcbiAgICBjb25zdCBoZWlnaHRTY29yZSA9IE1hdGgucG93KCBkWzFdIC8gdGhpcy5nZXRIZWlnaHQoKSwgMiApO1xuICAgIGNvbnN0IGRlcHRoU2NvcmUgPSBNYXRoLnBvdyggZFsyXSAvIHRoaXMuZ2V0RGVwdGgoKSwgMiApO1xuXG4gICAgcmV0dXJuIHdpZHRoU2NvcmUgKyBoZWlnaHRTY29yZSArIGRlcHRoU2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIHRoZSBiZXN0IHJvdGF0aW9uIG9yZGVyIGZvciBhIGdpdmVuIEl0ZW0gYmFzZWQgb24gc2NvcmVSb3RhdGlvbigpLlxuICAgKlxuICAgKiBAcGFyYW0ge0l0ZW19IGl0ZW1cbiAgICogQHJldHVybiB7QXJyYXl9IFJvdGF0aW9uIHR5cGVzIHNvcnRlZCBieSB0aGVpciBzY29yZSwgREVTQ1xuICAgKi9cbiAgZ2V0QmVzdFJvdGF0aW9uT3JkZXIoaXRlbSkge1xuICAgIGNvbnN0IHJvdGF0aW9uU2NvcmVzID0ge307XG5cbiAgICAvLyBTY29yZSBhbGwgcm90YXRpb24gdHlwZXNcblx0Zm9yIChsZXQgaT0wOyBpPGl0ZW0uYWxsb3dlZFJvdGF0aW9uLmxlbmd0aDsgaSsrKSB7XG5cdCAgICBjb25zdCByID0gaXRlbS5hbGxvd2VkUm90YXRpb25baV07XG5cdFx0cm90YXRpb25TY29yZXNbcl0gPSB0aGlzLnNjb3JlUm90YXRpb24oIGl0ZW0sIHIgKTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSByb3RhdGlvbiB0eXBlcyAoaW5kZXggb2Ygc2NvcmVzIG9iamVjdCkgREVTQ1xuICAgIC8vIGFuZCBlbnN1cmUgSW50IHZhbHVlcyAoT2JqZWN0LmtleXMgcmV0dXJucyBzdHJpbmdzKVxuICAgIGNvbnN0IHNvcnRlZFJvdGF0aW9ucyA9IE9iamVjdC5rZXlzKCByb3RhdGlvblNjb3JlcyApLnNvcnQoICggYSwgYiApID0+IHtcbiAgICAgIHJldHVybiByb3RhdGlvblNjb3Jlc1tiXSAtIHJvdGF0aW9uU2NvcmVzW2FdO1xuICAgIH0gKS5tYXAoIE51bWJlciApO1xuXG4gICAgcmV0dXJuIHNvcnRlZFJvdGF0aW9ucztcbiAgfVxuXG4gIHB1dEl0ZW0oaXRlbSwgcCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXM7XG4gICAgbGV0IGZpdCA9IGZhbHNlO1xuICAgIGNvbnN0IHJvdGF0aW9ucyA9IHRoaXMuZ2V0QmVzdFJvdGF0aW9uT3JkZXIoIGl0ZW0gKTtcbiAgICBpdGVtLnBvc2l0aW9uID0gcDtcblxuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IHJvdGF0aW9ucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGl0ZW0ucm90YXRpb25UeXBlID0gcm90YXRpb25zW2ldO1xuICAgICAgbGV0IGQgPSBpdGVtLmdldERpbWVuc2lvbigpO1xuXG4gICAgICBpZiAoYm94LmdldFdpZHRoKCkgPCBwWzBdICsgZFswXSB8fCBib3guZ2V0SGVpZ2h0KCkgPCBwWzFdICsgZFsxXSB8fCBib3guZ2V0RGVwdGgoKSA8IHBbMl0gKyBkWzJdKSB7XG4gICAgICAgIGZpdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZml0ID0gdHJ1ZTtcblxuICAgICAgICBmb3IgKGxldCBqPTA7IGo8Ym94Lml0ZW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgbGV0IF9qID0gYm94Lml0ZW1zW2pdO1xuICAgICAgICAgIGlmIChfai5pbnRlcnNlY3QoaXRlbSkpIHtcbiAgICAgICAgICAgIGZpdCA9IGZhbHNlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZpdCkge1xuICAgICAgICAgIGJveC5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxvZygndHJ5IHRvIHB1dEl0ZW0nLCBmaXQsICdpdGVtJywgaXRlbS50b1N0cmluZygpLCAnYm94JywgYm94LnRvU3RyaW5nKCkpO1xuXG4gICAgICBpZiAoZml0KSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZml0O1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBCaW46JHt0aGlzLm5hbWV9IChXeEh4RCA9ICR7dGhpcy5nZXRXaWR0aCgpfXgke3RoaXMuZ2V0SGVpZ2h0KCl9eCR7dGhpcy5nZXREZXB0aCgpfSwgTWF4V2cuID0gJHt0aGlzLmdldE1heFdlaWdodCgpfSlgO1xuICB9XG5cbn0iLCJpbXBvcnQgeyBmYWN0b3JlZEludGVnZXIgfSBmcm9tICcuL3V0aWwnO1xuXG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX1dIRCA9IDA7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0hXRCA9IDE7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0hEVyA9IDI7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0RIVyA9IDM7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX0RXSCA9IDQ7XG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlX1dESCA9IDU7XG5cbmV4cG9ydCBjb25zdCBXaWR0aEF4aXMgPSAwO1xuZXhwb3J0IGNvbnN0IEhlaWdodEF4aXMgPSAxO1xuZXhwb3J0IGNvbnN0IERlcHRoQXhpcyA9IDI7XG5cbmV4cG9ydCBjb25zdCBTdGFydFBvc2l0aW9uID0gWzAsIDAsIDBdO1xuXG5leHBvcnQgY29uc3QgUm90YXRpb25UeXBlU3RyaW5ncyA9IHtcbiAgW1JvdGF0aW9uVHlwZV9XSERdOiAnUm90YXRpb25UeXBlX1dIRCAodyxoLGQpJyxcbiAgW1JvdGF0aW9uVHlwZV9IV0RdOiAnUm90YXRpb25UeXBlX0hXRCAoaCx3LGQpJyxcbiAgW1JvdGF0aW9uVHlwZV9IRFddOiAnUm90YXRpb25UeXBlX0hEVyAoaCxkLHcpJyxcbiAgW1JvdGF0aW9uVHlwZV9ESFddOiAnUm90YXRpb25UeXBlX0RIVyAoZCxoLHcpJyxcbiAgW1JvdGF0aW9uVHlwZV9EV0hdOiAnUm90YXRpb25UeXBlX0RXSCAoZCx3LGgpJyxcbiAgW1JvdGF0aW9uVHlwZV9XREhdOiAnUm90YXRpb25UeXBlX1dESCAodyxkLGgpJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEl0ZW0ge1xuXG4gIG5hbWUgPSAnJztcbiAgd2lkdGggPSAwO1xuICBoZWlnaHQgPSAwO1xuICBkZXB0aCA9IDA7XG4gIHdlaWdodCA9IDA7XG4gIGFsbG93ZWRSb3RhdGlvbiA9IFswLDEsMiwzLDQsNV07XG5cbiAgcm90YXRpb25UeXBlID0gUm90YXRpb25UeXBlX1dIRDtcbiAgcG9zaXRpb24gPSBbXTsgLy8geCwgeSwgelxuXG4gIGNvbnN0cnVjdG9yKG5hbWUsIHcsIGgsIGQsIHdnLCBhbGxvd2VkUm90YXRpb24pIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMud2lkdGggPSBmYWN0b3JlZEludGVnZXIoIHcgKTtcbiAgICB0aGlzLmhlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggaCApO1xuICAgIHRoaXMuZGVwdGggPSBmYWN0b3JlZEludGVnZXIoIGQgKTtcbiAgICB0aGlzLndlaWdodCA9IGZhY3RvcmVkSW50ZWdlciggd2cgKTtcbiAgICB0aGlzLmFsbG93ZWRSb3RhdGlvbiA9IGFsbG93ZWRSb3RhdGlvbiA/IGFsbG93ZWRSb3RhdGlvbiA6IHRoaXMuYWxsb3dlZFJvdGF0aW9uO1xuICB9XG5cbiAgZ2V0V2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gIH1cblxuICBnZXRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgZ2V0RGVwdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVwdGg7XG4gIH1cblxuICBnZXRXZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMud2VpZ2h0O1xuICB9XG5cbiAgZ2V0Um90YXRpb25UeXBlKCkge1xuICAgIHJldHVybiB0aGlzLnJvdGF0aW9uVHlwZTtcbiAgfVxuXG4gIGdldEFsbG93ZWRSb3RhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hbGxvd2VkUm90YXRpb247XG4gIH1cblxuICBnZXRSb3RhdGlvblR5cGVTdHJpbmcoKSB7XG4gICAgcmV0dXJuIFJvdGF0aW9uVHlwZVN0cmluZ3NbdGhpcy5nZXRSb3RhdGlvblR5cGUoKV07XG4gIH1cblxuICBnZXREaW1lbnNpb24oKSB7XG4gICAgbGV0IGQ7XG4gICAgc3dpdGNoICh0aGlzLnJvdGF0aW9uVHlwZSkge1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfV0hEOlxuICAgICAgICBkID0gW3RoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXRIZWlnaHQoKSwgdGhpcy5nZXREZXB0aCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9IV0Q6XG4gICAgICAgIGQgPSBbdGhpcy5nZXRIZWlnaHQoKSwgdGhpcy5nZXRXaWR0aCgpLCB0aGlzLmdldERlcHRoKCldO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX0hEVzpcbiAgICAgICAgZCA9IFt0aGlzLmdldEhlaWdodCgpLCB0aGlzLmdldERlcHRoKCksIHRoaXMuZ2V0V2lkdGgoKV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfREhXOlxuICAgICAgICBkID0gW3RoaXMuZ2V0RGVwdGgoKSwgdGhpcy5nZXRIZWlnaHQoKSwgdGhpcy5nZXRXaWR0aCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9EV0g6XG4gICAgICAgIGQgPSBbdGhpcy5nZXREZXB0aCgpLCB0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCldO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX1dESDpcbiAgICAgICAgZCA9IFt0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0RGVwdGgoKSwgdGhpcy5nZXRIZWlnaHQoKV07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gZDtcbiAgfVxuXG4gIGludGVyc2VjdChpMikge1xuICAgIHJldHVybiByZWN0SW50ZXJzZWN0KHRoaXMsIGkyLCBXaWR0aEF4aXMsIEhlaWdodEF4aXMpICYmXG4gICAgICAgIHJlY3RJbnRlcnNlY3QodGhpcywgaTIsIEhlaWdodEF4aXMsIERlcHRoQXhpcykgJiZcbiAgICAgICAgcmVjdEludGVyc2VjdCh0aGlzLCBpMiwgV2lkdGhBeGlzLCBEZXB0aEF4aXMpO1xuICB9XG5cbiAgZ2V0Vm9sdW1lKCkge1xuICAgIHJldHVybiB0aGlzLmdldFdpZHRoKCkgKiB0aGlzLmdldEhlaWdodCgpICogdGhpcy5nZXREZXB0aCgpO1xuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBJdGVtOiR7dGhpcy5uYW1lfSAoJHt0aGlzLmdldFJvdGF0aW9uVHlwZVN0cmluZygpfSA9ICR7dGhpcy5nZXREaW1lbnNpb24oKS5qb2luKCd4Jyl9LCBXZy4gPSAke3RoaXMud2VpZ2h0fSlgO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCByZWN0SW50ZXJzZWN0ID0gKGkxLCBpMiwgeCwgeSkgPT4ge1xuICBsZXQgZDEsIGQyLCBjeDEsIGN5MSwgY3gyLCBjeTIsIGl4LCBpeTtcblxuICBkMSA9IGkxLmdldERpbWVuc2lvbigpO1xuICBkMiA9IGkyLmdldERpbWVuc2lvbigpO1xuXG4gIGN4MSA9IGkxLnBvc2l0aW9uW3hdICsgZDFbeF0gLyAyO1xuICBjeTEgPSBpMS5wb3NpdGlvblt5XSArIGQxW3ldIC8gMjtcbiAgY3gyID0gaTIucG9zaXRpb25beF0gKyBkMlt4XSAvIDI7XG4gIGN5MiA9IGkyLnBvc2l0aW9uW3ldICsgZDJbeV0gLyAyO1xuXG4gIGl4ID0gTWF0aC5tYXgoY3gxLCBjeDIpIC0gTWF0aC5taW4oY3gxLCBjeDIpO1xuICBpeSA9IE1hdGgubWF4KGN5MSwgY3kyKSAtIE1hdGgubWluKGN5MSwgY3kyKTtcblxuICByZXR1cm4gaXggPCAoZDFbeF0gKyBkMlt4XSkgLyAyICYmIGl5IDwgKGQxW3ldICsgZDJbeV0pIC8gMjtcbn07IiwiaW1wb3J0IEJpbiBmcm9tICcuL0Jpbic7XG5pbXBvcnQge1xuICBJdGVtLFxuICBTdGFydFBvc2l0aW9uLFxuICBXaWR0aEF4aXMsXG4gIEhlaWdodEF4aXMsXG4gIERlcHRoQXhpc1xufSBmcm9tICcuL0l0ZW0nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrZXIge1xuXG4gIGJpbnMgPSBbXTtcbiAgaXRlbXMgPSBbXTtcbiAgdW5maXRJdGVtcyA9IFtdO1xuXG4gIGFkZEJpbihiaW4pIHtcbiAgICB0aGlzLmJpbnMucHVzaChiaW4pO1xuICB9XG5cbiAgYWRkSXRlbShpdGVtKSB7XG4gICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xuICB9XG5cbiAgZmluZEZpdHRlZEJpbihpKSB7XG4gICAgZm9yIChsZXQgX2k9MDsgX2k8dGhpcy5iaW5zLmxlbmd0aDsgX2krKykge1xuICAgICAgbGV0IGIgPSB0aGlzLmJpbnNbX2ldO1xuXG4gICAgICBpZiAoIWIud2VpZ2hJdGVtKGkpIHx8ICFiLnB1dEl0ZW0oaSwgU3RhcnRQb3NpdGlvbikpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChiLml0ZW1zLmxlbmd0aCA9PT0gMSAmJiBiLml0ZW1zWzBdID09PSBpKSB7XG4gICAgICAgIGIuaXRlbXMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGI7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZ2V0QmlnZ2VyQmluVGhhbihiKSB7XG4gICAgbGV0IHYgPSBiLmdldFZvbHVtZSgpO1xuICAgIGZvciAobGV0IF9pPTA7IF9pPHRoaXMuYmluczsgX2krKykge1xuICAgICAgbGV0IGIyID0gdGhpcy5iaW5zW19pXTtcbiAgICAgIGlmIChiMi5nZXRWb2x1bWUoKSA+IHYpIHtcbiAgICAgICAgcmV0dXJuIGIyO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHVuZml0SXRlbSgpIHtcbiAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy51bmZpdEl0ZW1zLnB1c2godGhpcy5pdGVtc1swXSk7XG4gICAgdGhpcy5pdGVtcy5zcGxpY2UoMCwgMSk7XG4gIH1cblxuICBwYWNrVG9CaW4oYiwgaXRlbXMpIHtcbiAgICBsZXQgYjIgPSBudWxsO1xuICAgIGxldCB1bnBhY2tlZCA9IFtdO1xuICAgIGxldCBmaXQgPSBiLndlaWdoSXRlbShpdGVtc1swXSkgJiYgYi5wdXRJdGVtKGl0ZW1zWzBdLCBTdGFydFBvc2l0aW9uKTtcblxuICAgIGlmICghZml0KSB7XG4gICAgICBsZXQgYjIgPSB0aGlzLmdldEJpZ2dlckJpblRoYW4oYik7XG4gICAgICBpZiAoYjIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucGFja1RvQmluKGIyLCBpdGVtcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgICB9XG5cbiAgICAvLyBQYWNrIHVucGFja2VkIGl0ZW1zLlxuICAgIGZvciAobGV0IF9pPTE7IF9pIDwgdGhpcy5pdGVtcy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIGxldCBmaXR0ZWQgPSBmYWxzZTtcbiAgICAgIGxldCBpdGVtID0gdGhpcy5pdGVtc1tfaV07XG5cbiAgICAgIGlmIChiLndlaWdoSXRlbShpdGVtKSkge1xuICAgICAgICAvLyBUcnkgYXZhaWxhYmxlIHBpdm90cyBpbiBjdXJyZW50IGJpbiB0aGF0IGFyZSBub3QgaW50ZXJzZWN0IHdpdGhcbiAgICAgICAgLy8gZXhpc3RpbmcgaXRlbXMgaW4gY3VycmVudCBiaW4uXG4gICAgICAgIGxvb2t1cDpcbiAgICAgICAgZm9yIChsZXQgX3B0PTA7IF9wdCA8IDM7IF9wdCsrKSB7XG4gICAgICAgICAgZm9yIChsZXQgX2o9MDsgX2ogPCBiLml0ZW1zLmxlbmd0aDsgX2orKykge1xuICAgICAgICAgICAgbGV0IHB2O1xuICAgICAgICAgICAgbGV0IGliID0gYi5pdGVtc1tfal07XG4gICAgICAgICAgICBsZXQgZCA9IGliLmdldERpbWVuc2lvbigpO1xuICAgICAgICAgICAgc3dpdGNoIChfcHQpIHtcbiAgICAgICAgICAgICAgY2FzZSBXaWR0aEF4aXM6XG4gICAgICAgICAgICAgICAgcHYgPSBbaWIucG9zaXRpb25bMF0gKyBkWzBdLCBpYi5wb3NpdGlvblsxXSwgaWIucG9zaXRpb25bMl1dO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIEhlaWdodEF4aXM6XG4gICAgICAgICAgICAgICAgcHYgPSBbaWIucG9zaXRpb25bMF0sIGliLnBvc2l0aW9uWzFdICsgZFsxXSwgaWIucG9zaXRpb25bMl1dO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlIERlcHRoQXhpczpcbiAgICAgICAgICAgICAgICBwdiA9IFtpYi5wb3NpdGlvblswXSwgaWIucG9zaXRpb25bMV0sIGliLnBvc2l0aW9uWzJdICsgZFsyXV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChiLnB1dEl0ZW0oaXRlbSwgcHYpKSB7XG4gICAgICAgICAgICAgIGZpdHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrIGxvb2t1cDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFmaXR0ZWQpIHtcbiAgICAgICAgd2hpbGUgKGIyICE9PSBudWxsKSB7XG4gICAgICAgICAgYjIgPSB0aGlzLmdldEJpZ2dlckJpblRoYW4oYik7XG4gICAgICAgICAgaWYgKGIyKSB7XG4gICAgICAgICAgICBiMi5pdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgbGV0IGxlZnQgPSB0aGlzLnBhY2tUb0JpbihiMiwgYjIuaXRlbXMpO1xuICAgICAgICAgICAgaWYgKGxlZnQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIGIgPSBiMjtcbiAgICAgICAgICAgICAgZml0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmaXR0ZWQpIHtcbiAgICAgICAgICB1bnBhY2tlZC5wdXNoKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVucGFja2VkO1xuICB9XG5cbiAgcGFjaygpIHtcbiAgICAvLyBTb3J0IGJpbnMgc21hbGxlc3QgdG8gbGFyZ2VzdC5cbiAgICB0aGlzLmJpbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEuZ2V0Vm9sdW1lKCkgLSBiLmdldFZvbHVtZSgpO1xuICAgIH0pO1xuXG4gICAgLy8gU29ydCBpdGVtcyBsYXJnZXN0IHRvIHNtYWxsZXN0LlxuICAgIHRoaXMuaXRlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGIuZ2V0Vm9sdW1lKCkgLSBhLmdldFZvbHVtZSgpO1xuICAgIH0pO1xuXG4gICAgd2hpbGUgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGJpbiA9IHRoaXMuZmluZEZpdHRlZEJpbih0aGlzLml0ZW1zWzBdKTtcblxuICAgICAgaWYgKGJpbiA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLnVuZml0SXRlbSgpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pdGVtcyA9IHRoaXMucGFja1RvQmluKGJpbiwgdGhpcy5pdGVtcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCBCaW4gZnJvbSAnLi9CaW4nO1xuaW1wb3J0IEl0ZW0gZnJvbSAnLi9JdGVtJztcbmltcG9ydCBQYWNrZXIgZnJvbSAnLi9QYWNrZXInO1xuXG5leHBvcnQgeyBCaW4sIEl0ZW0sIFBhY2tlciB9OyIsIi8qKlxuICogUHJlY2lzaW9uIHRvIHJldGFpbiBpbiBmYWN0b3JlZEludGVnZXIoKVxuICovXG5jb25zdCBGQUNUT1IgPSA1O1xuXG4vKipcbiAqIEZhY3RvciBhIG51bWJlciBieSBGQUNUT1IgYW5kIHJvdW5kIHRvIHRoZSBuZWFyZXN0IHdob2xlIG51bWJlclxuICovXG5leHBvcnQgY29uc3QgZmFjdG9yZWRJbnRlZ2VyID0gKCB2YWx1ZSApID0+IChcbiAgICBNYXRoLnJvdW5kKCB2YWx1ZSAqICggMTAgKiogRkFDVE9SICkgKVxuKTtcbiIsImxldCBpc0xvZ0VuYWJsZWQgPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVMb2coZW5hYmxlID0gdHJ1ZSkge1xuICAgIGlzTG9nRW5hYmxlZCA9IGVuYWJsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUxvZ2dlcihuYW1lc3BhY2UgPSAnYmlucGFja2luZ2pzJykge1xuICAgIHJldHVybiBsb2cuYmluZCh1bmRlZmluZWQsIG5hbWVzcGFjZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2cobmFtZXNwYWNlLCAuLi5hcmdzKSB7XG4gICAgcmV0dXJuIGlzTG9nRW5hYmxlZCA/IGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgW25hbWVzcGFjZV0uY29uY2F0KGFyZ3MpKSA6IHVuZGVmaW5lZDtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTsgfSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0ICogYXMgQlAyRCBmcm9tICcuLzJEJztcbmltcG9ydCAqIGFzIEJQM0QgZnJvbSAnLi8zRCc7XG5cbmV4cG9ydCB7IEJQMkQsIEJQM0QgfTsiXSwic291cmNlUm9vdCI6IiJ9