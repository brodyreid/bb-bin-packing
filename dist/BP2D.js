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
                boxesArea += box.width * box.height;
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
        this.x = 0;
        this.y = 0;
        this.constrainRotation = false;
        this.packed = false;
        this.width = width;
        this.height = height;
        this.constrainRotation = constrainRotation;
    }
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
    Packer.prototype.pack = function (boxes) {
        var packedBoxes = [];
        var entry;
        boxes = boxes.filter(function (box) { return !box.packed; });
        if (boxes.length === 0)
            return packedBoxes;
        var limit = _Score__WEBPACK_IMPORTED_MODULE_0__.default.MAX_INT;
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
            var unfitArea = unfit.box.width * unfit.box.height;
            var entryArea = entry.box.width * entry.box.height;
            if (!fittingBoxes.includes(entry.box)) {
                return;
            }
            if (unfit === null || unfitArea < entryArea) {
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
            var score = this.calculateScore(freeRect, rectWidth, rectHeight);
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
    Base.prototype.calculateScore = function (_freeRect, _rectWidth, _rectHeight) {
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
/*!*********************!*\
  !*** ./2D/index.js ***!
  \*********************/
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






}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jbG9uZS9jbG9uZS5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jb25zb2xlLnRhYmxlL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2RlZmF1bHRzL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2Vhc3ktdGFibGUvdGFibGUuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL0Jpbi50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvQm94LnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9QYWNrZXIudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL1Njb3JlLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkRW50cnkudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvQmFzZS50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2NvbWJpbmluZy5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RBcmVhRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RMb25nU2lkZUZpdC5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvaGV1cmlzdGljcy9CZXN0U2hvcnRTaWRlRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0JvdHRvbUxlZnQuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRCxJQUFJLEtBQTBCO0FBQzlCO0FBQ0E7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsdURBQVk7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNB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c0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOdUI7QUFDQTtBQUNNO0FBQ2MiLCJmaWxlIjoiQlAyRC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiQmluUGFja2luZ1wiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJCaW5QYWNraW5nXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkJpblBhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCJ2YXIgY2xvbmUgPSAoZnVuY3Rpb24oKSB7XG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQ2xvbmVzIChjb3BpZXMpIGFuIE9iamVjdCB1c2luZyBkZWVwIGNvcHlpbmcuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBzdXBwb3J0cyBjaXJjdWxhciByZWZlcmVuY2VzIGJ5IGRlZmF1bHQsIGJ1dCBpZiB5b3UgYXJlIGNlcnRhaW5cbiAqIHRoZXJlIGFyZSBubyBjaXJjdWxhciByZWZlcmVuY2VzIGluIHlvdXIgb2JqZWN0LCB5b3UgY2FuIHNhdmUgc29tZSBDUFUgdGltZVxuICogYnkgY2FsbGluZyBjbG9uZShvYmosIGZhbHNlKS5cbiAqXG4gKiBDYXV0aW9uOiBpZiBgY2lyY3VsYXJgIGlzIGZhbHNlIGFuZCBgcGFyZW50YCBjb250YWlucyBjaXJjdWxhciByZWZlcmVuY2VzLFxuICogeW91ciBwcm9ncmFtIG1heSBlbnRlciBhbiBpbmZpbml0ZSBsb29wIGFuZCBjcmFzaC5cbiAqXG4gKiBAcGFyYW0gYHBhcmVudGAgLSB0aGUgb2JqZWN0IHRvIGJlIGNsb25lZFxuICogQHBhcmFtIGBjaXJjdWxhcmAgLSBzZXQgdG8gdHJ1ZSBpZiB0aGUgb2JqZWN0IHRvIGJlIGNsb25lZCBtYXkgY29udGFpblxuICogICAgY2lyY3VsYXIgcmVmZXJlbmNlcy4gKG9wdGlvbmFsIC0gdHJ1ZSBieSBkZWZhdWx0KVxuICogQHBhcmFtIGBkZXB0aGAgLSBzZXQgdG8gYSBudW1iZXIgaWYgdGhlIG9iamVjdCBpcyBvbmx5IHRvIGJlIGNsb25lZCB0b1xuICogICAgYSBwYXJ0aWN1bGFyIGRlcHRoLiAob3B0aW9uYWwgLSBkZWZhdWx0cyB0byBJbmZpbml0eSlcbiAqIEBwYXJhbSBgcHJvdG90eXBlYCAtIHNldHMgdGhlIHByb3RvdHlwZSB0byBiZSB1c2VkIHdoZW4gY2xvbmluZyBhbiBvYmplY3QuXG4gKiAgICAob3B0aW9uYWwgLSBkZWZhdWx0cyB0byBwYXJlbnQgcHJvdG90eXBlKS5cbiovXG5mdW5jdGlvbiBjbG9uZShwYXJlbnQsIGNpcmN1bGFyLCBkZXB0aCwgcHJvdG90eXBlKSB7XG4gIHZhciBmaWx0ZXI7XG4gIGlmICh0eXBlb2YgY2lyY3VsYXIgPT09ICdvYmplY3QnKSB7XG4gICAgZGVwdGggPSBjaXJjdWxhci5kZXB0aDtcbiAgICBwcm90b3R5cGUgPSBjaXJjdWxhci5wcm90b3R5cGU7XG4gICAgZmlsdGVyID0gY2lyY3VsYXIuZmlsdGVyO1xuICAgIGNpcmN1bGFyID0gY2lyY3VsYXIuY2lyY3VsYXJcbiAgfVxuICAvLyBtYWludGFpbiB0d28gYXJyYXlzIGZvciBjaXJjdWxhciByZWZlcmVuY2VzLCB3aGVyZSBjb3JyZXNwb25kaW5nIHBhcmVudHNcbiAgLy8gYW5kIGNoaWxkcmVuIGhhdmUgdGhlIHNhbWUgaW5kZXhcbiAgdmFyIGFsbFBhcmVudHMgPSBbXTtcbiAgdmFyIGFsbENoaWxkcmVuID0gW107XG5cbiAgdmFyIHVzZUJ1ZmZlciA9IHR5cGVvZiBCdWZmZXIgIT0gJ3VuZGVmaW5lZCc7XG5cbiAgaWYgKHR5cGVvZiBjaXJjdWxhciA9PSAndW5kZWZpbmVkJylcbiAgICBjaXJjdWxhciA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBkZXB0aCA9PSAndW5kZWZpbmVkJylcbiAgICBkZXB0aCA9IEluZmluaXR5O1xuXG4gIC8vIHJlY3Vyc2UgdGhpcyBmdW5jdGlvbiBzbyB3ZSBkb24ndCByZXNldCBhbGxQYXJlbnRzIGFuZCBhbGxDaGlsZHJlblxuICBmdW5jdGlvbiBfY2xvbmUocGFyZW50LCBkZXB0aCkge1xuICAgIC8vIGNsb25pbmcgbnVsbCBhbHdheXMgcmV0dXJucyBudWxsXG4gICAgaWYgKHBhcmVudCA9PT0gbnVsbClcbiAgICAgIHJldHVybiBudWxsO1xuXG4gICAgaWYgKGRlcHRoID09IDApXG4gICAgICByZXR1cm4gcGFyZW50O1xuXG4gICAgdmFyIGNoaWxkO1xuICAgIHZhciBwcm90bztcbiAgICBpZiAodHlwZW9mIHBhcmVudCAhPSAnb2JqZWN0Jykge1xuICAgICAgcmV0dXJuIHBhcmVudDtcbiAgICB9XG5cbiAgICBpZiAoY2xvbmUuX19pc0FycmF5KHBhcmVudCkpIHtcbiAgICAgIGNoaWxkID0gW107XG4gICAgfSBlbHNlIGlmIChjbG9uZS5fX2lzUmVnRXhwKHBhcmVudCkpIHtcbiAgICAgIGNoaWxkID0gbmV3IFJlZ0V4cChwYXJlbnQuc291cmNlLCBfX2dldFJlZ0V4cEZsYWdzKHBhcmVudCkpO1xuICAgICAgaWYgKHBhcmVudC5sYXN0SW5kZXgpIGNoaWxkLmxhc3RJbmRleCA9IHBhcmVudC5sYXN0SW5kZXg7XG4gICAgfSBlbHNlIGlmIChjbG9uZS5fX2lzRGF0ZShwYXJlbnQpKSB7XG4gICAgICBjaGlsZCA9IG5ldyBEYXRlKHBhcmVudC5nZXRUaW1lKCkpO1xuICAgIH0gZWxzZSBpZiAodXNlQnVmZmVyICYmIEJ1ZmZlci5pc0J1ZmZlcihwYXJlbnQpKSB7XG4gICAgICBpZiAoQnVmZmVyLmFsbG9jVW5zYWZlKSB7XG4gICAgICAgIC8vIE5vZGUuanMgPj0gNC41LjBcbiAgICAgICAgY2hpbGQgPSBCdWZmZXIuYWxsb2NVbnNhZmUocGFyZW50Lmxlbmd0aCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPbGRlciBOb2RlLmpzIHZlcnNpb25zXG4gICAgICAgIGNoaWxkID0gbmV3IEJ1ZmZlcihwYXJlbnQubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHBhcmVudC5jb3B5KGNoaWxkKTtcbiAgICAgIHJldHVybiBjaGlsZDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBwcm90b3R5cGUgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50KTtcbiAgICAgICAgY2hpbGQgPSBPYmplY3QuY3JlYXRlKHByb3RvKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBjaGlsZCA9IE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcbiAgICAgICAgcHJvdG8gPSBwcm90b3R5cGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNpcmN1bGFyKSB7XG4gICAgICB2YXIgaW5kZXggPSBhbGxQYXJlbnRzLmluZGV4T2YocGFyZW50KTtcblxuICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICAgIHJldHVybiBhbGxDaGlsZHJlbltpbmRleF07XG4gICAgICB9XG4gICAgICBhbGxQYXJlbnRzLnB1c2gocGFyZW50KTtcbiAgICAgIGFsbENoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgaW4gcGFyZW50KSB7XG4gICAgICB2YXIgYXR0cnM7XG4gICAgICBpZiAocHJvdG8pIHtcbiAgICAgICAgYXR0cnMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJzICYmIGF0dHJzLnNldCA9PSBudWxsKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY2hpbGRbaV0gPSBfY2xvbmUocGFyZW50W2ldLCBkZXB0aCAtIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGlsZDtcbiAgfVxuXG4gIHJldHVybiBfY2xvbmUocGFyZW50LCBkZXB0aCk7XG59XG5cbi8qKlxuICogU2ltcGxlIGZsYXQgY2xvbmUgdXNpbmcgcHJvdG90eXBlLCBhY2NlcHRzIG9ubHkgb2JqZWN0cywgdXNlZnVsbCBmb3IgcHJvcGVydHlcbiAqIG92ZXJyaWRlIG9uIEZMQVQgY29uZmlndXJhdGlvbiBvYmplY3QgKG5vIG5lc3RlZCBwcm9wcykuXG4gKlxuICogVVNFIFdJVEggQ0FVVElPTiEgVGhpcyBtYXkgbm90IGJlaGF2ZSBhcyB5b3Ugd2lzaCBpZiB5b3UgZG8gbm90IGtub3cgaG93IHRoaXNcbiAqIHdvcmtzLlxuICovXG5jbG9uZS5jbG9uZVByb3RvdHlwZSA9IGZ1bmN0aW9uIGNsb25lUHJvdG90eXBlKHBhcmVudCkge1xuICBpZiAocGFyZW50ID09PSBudWxsKVxuICAgIHJldHVybiBudWxsO1xuXG4gIHZhciBjID0gZnVuY3Rpb24gKCkge307XG4gIGMucHJvdG90eXBlID0gcGFyZW50O1xuICByZXR1cm4gbmV3IGMoKTtcbn07XG5cbi8vIHByaXZhdGUgdXRpbGl0eSBmdW5jdGlvbnNcblxuZnVuY3Rpb24gX19vYmpUb1N0cihvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59O1xuY2xvbmUuX19vYmpUb1N0ciA9IF9fb2JqVG9TdHI7XG5cbmZ1bmN0aW9uIF9faXNEYXRlKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBfX29ialRvU3RyKG8pID09PSAnW29iamVjdCBEYXRlXSc7XG59O1xuY2xvbmUuX19pc0RhdGUgPSBfX2lzRGF0ZTtcblxuZnVuY3Rpb24gX19pc0FycmF5KG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBfX29ialRvU3RyKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcbmNsb25lLl9faXNBcnJheSA9IF9faXNBcnJheTtcblxuZnVuY3Rpb24gX19pc1JlZ0V4cChvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgX19vYmpUb1N0cihvKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59O1xuY2xvbmUuX19pc1JlZ0V4cCA9IF9faXNSZWdFeHA7XG5cbmZ1bmN0aW9uIF9fZ2V0UmVnRXhwRmxhZ3MocmUpIHtcbiAgdmFyIGZsYWdzID0gJyc7XG4gIGlmIChyZS5nbG9iYWwpIGZsYWdzICs9ICdnJztcbiAgaWYgKHJlLmlnbm9yZUNhc2UpIGZsYWdzICs9ICdpJztcbiAgaWYgKHJlLm11bHRpbGluZSkgZmxhZ3MgKz0gJ20nO1xuICByZXR1cm4gZmxhZ3M7XG59O1xuY2xvbmUuX19nZXRSZWdFeHBGbGFncyA9IF9fZ2V0UmVnRXhwRmxhZ3M7XG5cbnJldHVybiBjbG9uZTtcbn0pKCk7XG5cbmlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGNsb25lO1xufVxuIiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIHNldHVwQ29uc29sZVRhYmxlKCkge1xuICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignV2VpcmQsIGNvbnNvbGUgb2JqZWN0IGlzIHVuZGVmaW5lZCcpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGNvbnNvbGUudGFibGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIGlmIGl0IGlzIG5vdCBPVVIgZnVuY3Rpb24sIG92ZXJ3cml0ZSBpdFxuICAgICAgaWYgKGNvbnNvbGUudGFibGUgPT09IGNvbnNvbGVUYWJsZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNUeXBlKHQsIHgpIHtcbiAgICAgIHJldHVybiB0eXBlb2YgeCA9PT0gdDtcbiAgICB9XG5cbiAgICB2YXIgaXNTdHJpbmcgPSBpc1R5cGUuYmluZChudWxsLCAnc3RyaW5nJyk7XG5cbiAgICBmdW5jdGlvbiBpc0FycmF5T2YoaXNUeXBlRm4sIGEpIHtcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KGEpICYmXG4gICAgICAgIGEuZXZlcnkoaXNUeXBlRm4pO1xuICAgIH1cblxuICAgIHZhciBpc0FycmF5T2ZTdHJpbmdzID0gaXNBcnJheU9mLmJpbmQobnVsbCwgaXNTdHJpbmcpO1xuICAgIHZhciBpc0FycmF5T2ZBcnJheXMgPSBpc0FycmF5T2YuYmluZChudWxsLCBBcnJheS5pc0FycmF5KTtcblxuICAgIHZhciBUYWJsZSA9IHJlcXVpcmUoJ2Vhc3ktdGFibGUnKTtcblxuICAgIGZ1bmN0aW9uIGFycmF5VG9TdHJpbmcoYXJyKSB7XG4gICAgICB2YXIgdCA9IG5ldyBUYWJsZSgpO1xuICAgICAgYXJyLmZvckVhY2goZnVuY3Rpb24gKHJlY29yZCkge1xuICAgICAgICBpZiAodHlwZW9mIHJlY29yZCA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICB0eXBlb2YgcmVjb3JkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIHQuY2VsbCgnaXRlbScsIHJlY29yZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYXNzdW1lIHBsYWluIG9iamVjdFxuICAgICAgICAgIE9iamVjdC5rZXlzKHJlY29yZCkuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgIHQuY2VsbChwcm9wZXJ0eSwgcmVjb3JkW3Byb3BlcnR5XSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdC5uZXdSb3coKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHQudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmludFRhYmxlV2l0aENvbHVtblRpdGxlcyh0aXRsZXMsIGl0ZW1zLG5vQ29uc29sZSkge1xuICAgICAgdmFyIHQgPSBuZXcgVGFibGUoKTtcbiAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwgaykge1xuICAgICAgICAgIHQuY2VsbCh0aXRsZXNba10sIHZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHQubmV3Um93KCk7XG4gICAgICB9KTtcbiAgICAgIHZhciBzdHIgPSB0LnRvU3RyaW5nKCk7XG5cbiAgICAgIHJldHVybiBub0NvbnNvbGUgPyBzdHIgOiBjb25zb2xlLmxvZyhzdHIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByaW50VGl0bGVUYWJsZSh0aXRsZSwgYXJyKSB7XG4gICAgICB2YXIgc3RyID0gYXJyYXlUb1N0cmluZyhhcnIpO1xuICAgICAgdmFyIHJvd0xlbmd0aCA9IHN0ci5pbmRleE9mKCdcXG4nKTtcbiAgICAgIGlmIChyb3dMZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aXRsZS5sZW5ndGggPiByb3dMZW5ndGgpIHtcbiAgICAgICAgICByb3dMZW5ndGggPSB0aXRsZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2codGl0bGUpO1xuICAgICAgICB2YXIgc2VwID0gJy0nLCBrLCBsaW5lID0gJyc7XG4gICAgICAgIGZvciAoayA9IDA7IGsgPCByb3dMZW5ndGg7IGsgKz0gMSkge1xuICAgICAgICAgIGxpbmUgKz0gc2VwO1xuICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobGluZSk7XG4gICAgICB9XG4gICAgICBjb25zb2xlLmxvZyhzdHIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRpdGxlVGFibGUodGl0bGUsIGFycikge1xuICAgICAgdmFyIHN0ciA9IGFycmF5VG9TdHJpbmcoYXJyKTtcbiAgICAgIHZhciByb3dMZW5ndGggPSBzdHIuaW5kZXhPZignXFxuJyk7XG4gICAgICB2YXIgc3RyVG9SZXR1cm4gPSAnJztcbiAgICAgIGlmIChyb3dMZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0aXRsZS5sZW5ndGggPiByb3dMZW5ndGgpIHtcbiAgICAgICAgICByb3dMZW5ndGggPSB0aXRsZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHN0clRvUmV0dXJuICs9IHRpdGxlICsgJ1xcbic7XG4gICAgICAgIHZhciBzZXAgPSAnLScsIGssIGxpbmUgPSAnJztcbiAgICAgICAgZm9yIChrID0gMDsgayA8IHJvd0xlbmd0aDsgayArPSAxKSB7XG4gICAgICAgICAgbGluZSArPSBzZXA7XG4gICAgICAgIH1cblx0XG4gICAgICAgIHN0clRvUmV0dXJuICs9IGxpbmUgKyAnXFxuJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN0clRvUmV0dXJuICsgc3RyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9iamVjdFRvQXJyYXkob2JqKSB7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICByZXR1cm4ga2V5cy5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiBvYmpba2V5XVxuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcob2JqKSB7XG4gICAgICByZXR1cm4gYXJyYXlUb1N0cmluZyhvYmplY3RUb0FycmF5KG9iaikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbnNvbGVUYWJsZSAoKSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICB0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgQXJyYXkuaXNBcnJheShhcmdzWzFdKSkge1xuXG4gICAgICAgIHJldHVybiBwcmludFRpdGxlVGFibGUoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBpc0FycmF5T2ZTdHJpbmdzKGFyZ3NbMF0pICYmXG4gICAgICAgIGlzQXJyYXlPZkFycmF5cyhhcmdzWzFdKSkge1xuICAgICAgICByZXR1cm4gcHJpbnRUYWJsZVdpdGhDb2x1bW5UaXRsZXMoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICB9XG5cbiAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAodHlwZW9mIGsgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGspO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaykpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhhcnJheVRvU3RyaW5nKGspKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgayA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhvYmplY3RUb1N0cmluZyhrKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG1vZHVsZS5leHBvcnRzLmdldFRhYmxlID0gZnVuY3Rpb24oKXtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgdmFyIHN0clRvUmV0dXJuID0gJyc7XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICB0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgQXJyYXkuaXNBcnJheShhcmdzWzFdKSkge1xuXG4gICAgICAgIHJldHVybiBnZXRUaXRsZVRhYmxlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgaXNBcnJheU9mU3RyaW5ncyhhcmdzWzBdKSAmJlxuICAgICAgICBpc0FycmF5T2ZBcnJheXMoYXJnc1sxXSkpIHtcbiAgICAgICAgcmV0dXJuIHByaW50VGFibGVXaXRoQ29sdW1uVGl0bGVzKGFyZ3NbMF0sIGFyZ3NbMV0sdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIGFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoayxpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBzdHJUb1JldHVybiArPSBrO1xuXHQgIGlmIChpICE9PSBhcmdzLmxlbmd0aCAtIDEpe1xuXHQgICAgc3RyVG9SZXR1cm4gKz0gJ1xcbic7XG5cdCAgfVxuICAgICAgICAgIHJldHVybiA7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShrKSkge1xuICAgICAgICAgIHN0clRvUmV0dXJuICs9IGFycmF5VG9TdHJpbmcoaykgKyAnXFxuJztcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgayA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBzdHJUb1JldHVybiArPSBvYmplY3RUb1N0cmluZyhrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzdHJUb1JldHVybjtcbiAgICB9O1xuXG4gICAgY29uc29sZS50YWJsZSA9IGNvbnNvbGVUYWJsZTtcbiAgfVxuXG4gIHNldHVwQ29uc29sZVRhYmxlKCk7XG59KCkpO1xuIiwidmFyIGNsb25lID0gcmVxdWlyZSgnY2xvbmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvcHRpb25zLCBkZWZhdWx0cykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICBPYmplY3Qua2V5cyhkZWZhdWx0cykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNba2V5XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG9wdGlvbnNba2V5XSA9IGNsb25lKGRlZmF1bHRzW2tleV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59OyIsInZhciB3Y3dpZHRoXG5cbnRyeSB7XG4gIHdjd2lkdGggPSByZXF1aXJlKCd3Y3dpZHRoJylcbn0gY2F0Y2goZSkge31cblxubW9kdWxlLmV4cG9ydHMgPSBUYWJsZVxuXG5mdW5jdGlvbiBUYWJsZSgpIHtcbiAgdGhpcy5yb3dzID0gW11cbiAgdGhpcy5yb3cgPSB7X19wcmludGVycyA6IHt9fVxufVxuXG4vKipcbiAqIFB1c2ggdGhlIGN1cnJlbnQgcm93IHRvIHRoZSB0YWJsZSBhbmQgc3RhcnQgYSBuZXcgb25lXG4gKlxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUubmV3Um93ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucm93cy5wdXNoKHRoaXMucm93KVxuICB0aGlzLnJvdyA9IHtfX3ByaW50ZXJzIDoge319XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogV3JpdGUgY2VsbCBpbiB0aGUgY3VycmVudCByb3dcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sICAgICAgICAgIC0gQ29sdW1uIG5hbWVcbiAqIEBwYXJhbSB7QW55fSB2YWwgICAgICAgICAgICAgLSBDZWxsIHZhbHVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJpbnRlcl0gIC0gUHJpbnRlciBmdW5jdGlvbiB0byBmb3JtYXQgdGhlIHZhbHVlXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5jZWxsID0gZnVuY3Rpb24oY29sLCB2YWwsIHByaW50ZXIpIHtcbiAgdGhpcy5yb3dbY29sXSA9IHZhbFxuICB0aGlzLnJvdy5fX3ByaW50ZXJzW2NvbF0gPSBwcmludGVyIHx8IHN0cmluZ1xuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFN0cmluZyB0byBzZXBhcmF0ZSBjb2x1bW5zXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnNlcGFyYXRvciA9ICcgICdcblxuZnVuY3Rpb24gc3RyaW5nKHZhbCkge1xuICByZXR1cm4gdmFsID09PSB1bmRlZmluZWQgPyAnJyA6ICcnK3ZhbFxufVxuXG5mdW5jdGlvbiBsZW5ndGgoc3RyKSB7XG4gIHZhciBzID0gc3RyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGQrbS9nLCAnJylcbiAgcmV0dXJuIHdjd2lkdGggPT0gbnVsbCA/IHMubGVuZ3RoIDogd2N3aWR0aChzKVxufVxuXG4vKipcbiAqIERlZmF1bHQgcHJpbnRlclxuICovXG5cblRhYmxlLnN0cmluZyA9IHN0cmluZ1xuXG4vKipcbiAqIENyZWF0ZSBhIHByaW50ZXIgd2hpY2ggcmlnaHQgYWxpZ25zIHRoZSBjb250ZW50IGJ5IHBhZGRpbmcgd2l0aCBgY2hgIG9uIHRoZSBsZWZ0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNoXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cblxuVGFibGUubGVmdFBhZGRlciA9IGxlZnRQYWRkZXJcblxuZnVuY3Rpb24gbGVmdFBhZGRlcihjaCkge1xuICByZXR1cm4gZnVuY3Rpb24odmFsLCB3aWR0aCkge1xuICAgIHZhciBzdHIgPSBzdHJpbmcodmFsKVxuICAgIHZhciBsZW4gPSBsZW5ndGgoc3RyKVxuICAgIHZhciBwYWQgPSB3aWR0aCA+IGxlbiA/IEFycmF5KHdpZHRoIC0gbGVuICsgMSkuam9pbihjaCkgOiAnJ1xuICAgIHJldHVybiBwYWQgKyBzdHJcbiAgfVxufVxuXG4vKipcbiAqIFByaW50ZXIgd2hpY2ggcmlnaHQgYWxpZ25zIHRoZSBjb250ZW50XG4gKi9cblxudmFyIHBhZExlZnQgPSBUYWJsZS5wYWRMZWZ0ID0gbGVmdFBhZGRlcignICcpXG5cbi8qKlxuICogQ3JlYXRlIGEgcHJpbnRlciB3aGljaCBwYWRzIHdpdGggYGNoYCBvbiB0aGUgcmlnaHRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2hcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuXG5UYWJsZS5yaWdodFBhZGRlciA9IHJpZ2h0UGFkZGVyXG5cbmZ1bmN0aW9uIHJpZ2h0UGFkZGVyKGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBwYWRSaWdodCh2YWwsIHdpZHRoKSB7XG4gICAgdmFyIHN0ciA9IHN0cmluZyh2YWwpXG4gICAgdmFyIGxlbiA9IGxlbmd0aChzdHIpXG4gICAgdmFyIHBhZCA9IHdpZHRoID4gbGVuID8gQXJyYXkod2lkdGggLSBsZW4gKyAxKS5qb2luKGNoKSA6ICcnXG4gICAgcmV0dXJuIHN0ciArIHBhZFxuICB9XG59XG5cbnZhciBwYWRSaWdodCA9IHJpZ2h0UGFkZGVyKCcgJylcblxuLyoqXG4gKiBDcmVhdGUgYSBwcmludGVyIGZvciBudW1iZXJzXG4gKlxuICogV2lsbCBkbyByaWdodCBhbGlnbm1lbnQgYW5kIG9wdGlvbmFsbHkgZml4IHRoZSBudW1iZXIgb2YgZGlnaXRzIGFmdGVyIGRlY2ltYWwgcG9pbnRcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gW2RpZ2l0c10gLSBOdW1iZXIgb2YgZGlnaXRzIGZvciBmaXhwb2ludCBub3RhdGlvblxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5cblRhYmxlLm51bWJlciA9IGZ1bmN0aW9uKGRpZ2l0cykge1xuICByZXR1cm4gZnVuY3Rpb24odmFsLCB3aWR0aCkge1xuICAgIGlmICh2YWwgPT0gbnVsbCkgcmV0dXJuICcnXG4gICAgaWYgKHR5cGVvZiB2YWwgIT0gJ251bWJlcicpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJycrdmFsICsgJyBpcyBub3QgYSBudW1iZXInKVxuICAgIHZhciBzdHIgPSBkaWdpdHMgPT0gbnVsbCA/IHZhbCsnJyA6IHZhbC50b0ZpeGVkKGRpZ2l0cylcbiAgICByZXR1cm4gcGFkTGVmdChzdHIsIHdpZHRoKVxuICB9XG59XG5cbmZ1bmN0aW9uIGVhY2gocm93LCBmbikge1xuICBmb3IodmFyIGtleSBpbiByb3cpIHtcbiAgICBpZiAoa2V5ID09ICdfX3ByaW50ZXJzJykgY29udGludWVcbiAgICBmbihrZXksIHJvd1trZXldKVxuICB9XG59XG5cbi8qKlxuICogR2V0IGxpc3Qgb2YgY29sdW1ucyBpbiBwcmludGluZyBvcmRlclxuICpcbiAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuY29sdW1ucyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29scyA9IHt9XG4gIGZvcih2YXIgaSA9IDA7IGkgPCAyOyBpKyspIHsgLy8gZG8gMiB0aW1lc1xuICAgIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgICAgdmFyIGlkeCA9IDBcbiAgICAgIGVhY2gocm93LCBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWR4ID0gTWF0aC5tYXgoaWR4LCBjb2xzW2tleV0gfHwgMClcbiAgICAgICAgY29sc1trZXldID0gaWR4XG4gICAgICAgIGlkeCsrXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNvbHMpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIHJldHVybiBjb2xzW2FdIC0gY29sc1tiXVxuICB9KVxufVxuXG4vKipcbiAqIEZvcm1hdCBqdXN0IHJvd3MsIGkuZS4gcHJpbnQgdGhlIHRhYmxlIHdpdGhvdXQgaGVhZGVycyBhbmQgdG90YWxzXG4gKlxuICogQHJldHVybnMge1N0cmluZ30gU3RyaW5nIHJlcHJlc2VudGFpb24gb2YgdGhlIHRhYmxlXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnByaW50ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb2xzID0gdGhpcy5jb2x1bW5zKClcbiAgdmFyIHNlcGFyYXRvciA9IHRoaXMuc2VwYXJhdG9yXG4gIHZhciB3aWR0aHMgPSB7fVxuICB2YXIgb3V0ID0gJydcblxuICAvLyBDYWxjIHdpZHRoc1xuICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICBlYWNoKHJvdywgZnVuY3Rpb24oa2V5LCB2YWwpIHtcbiAgICAgIHZhciBzdHIgPSByb3cuX19wcmludGVyc1trZXldLmNhbGwocm93LCB2YWwpXG4gICAgICB3aWR0aHNba2V5XSA9IE1hdGgubWF4KGxlbmd0aChzdHIpLCB3aWR0aHNba2V5XSB8fCAwKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gTm93IHByaW50XG4gIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgIHZhciBsaW5lID0gJydcbiAgICBjb2xzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICB2YXIgd2lkdGggPSB3aWR0aHNba2V5XVxuICAgICAgdmFyIHN0ciA9IHJvdy5oYXNPd25Qcm9wZXJ0eShrZXkpXG4gICAgICAgID8gJycrcm93Ll9fcHJpbnRlcnNba2V5XS5jYWxsKHJvdywgcm93W2tleV0sIHdpZHRoKVxuICAgICAgICA6ICcnXG4gICAgICBsaW5lICs9IHBhZFJpZ2h0KHN0ciwgd2lkdGgpICsgc2VwYXJhdG9yXG4gICAgfSlcbiAgICBsaW5lID0gbGluZS5zbGljZSgwLCAtc2VwYXJhdG9yLmxlbmd0aClcbiAgICBvdXQgKz0gbGluZSArICdcXG4nXG4gIH0pXG5cbiAgcmV0dXJuIG91dFxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgdGFibGVcbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5cblRhYmxlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29scyA9IHRoaXMuY29sdW1ucygpXG4gIHZhciBvdXQgPSBuZXcgVGFibGUoKVxuXG4gIC8vIGNvcHkgb3B0aW9uc1xuICBvdXQuc2VwYXJhdG9yID0gdGhpcy5zZXBhcmF0b3JcblxuICAvLyBXcml0ZSBoZWFkZXJcbiAgY29scy5mb3JFYWNoKGZ1bmN0aW9uKGNvbCkge1xuICAgIG91dC5jZWxsKGNvbCwgY29sKVxuICB9KVxuICBvdXQubmV3Um93KClcbiAgb3V0LnB1c2hEZWxpbWV0ZXIoY29scylcblxuICAvLyBXcml0ZSBib2R5XG4gIG91dC5yb3dzID0gb3V0LnJvd3MuY29uY2F0KHRoaXMucm93cylcblxuICAvLyBUb3RhbHNcbiAgaWYgKHRoaXMudG90YWxzICYmIHRoaXMucm93cy5sZW5ndGgpIHtcbiAgICBvdXQucHVzaERlbGltZXRlcihjb2xzKVxuICAgIHRoaXMuZm9yRWFjaFRvdGFsKG91dC5jZWxsLmJpbmQob3V0KSlcbiAgICBvdXQubmV3Um93KClcbiAgfVxuXG4gIHJldHVybiBvdXQucHJpbnQoKVxufVxuXG4vKipcbiAqIFB1c2ggZGVsaW1ldGVyIHJvdyB0byB0aGUgdGFibGUgKHdpdGggZWFjaCBjZWxsIGZpbGxlZCB3aXRoIGRhc2hzIGR1cmluZyBwcmludGluZylcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ1tdfSBbY29sc11cbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnB1c2hEZWxpbWV0ZXIgPSBmdW5jdGlvbihjb2xzKSB7XG4gIGNvbHMgPSBjb2xzIHx8IHRoaXMuY29sdW1ucygpXG4gIGNvbHMuZm9yRWFjaChmdW5jdGlvbihjb2wpIHtcbiAgICB0aGlzLmNlbGwoY29sLCB1bmRlZmluZWQsIGxlZnRQYWRkZXIoJy0nKSlcbiAgfSwgdGhpcylcbiAgcmV0dXJuIHRoaXMubmV3Um93KClcbn1cblxuLyoqXG4gKiBDb21wdXRlIGFsbCB0b3RhbHMgYW5kIHlpZWxkIHRoZSByZXN1bHRzIHRvIGBjYmBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYiAtIENhbGxiYWNrIGZ1bmN0aW9uIHdpdGggc2lnbmF0dXJlIGAoY29sdW1uLCB2YWx1ZSwgcHJpbnRlcilgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLmZvckVhY2hUb3RhbCA9IGZ1bmN0aW9uKGNiKSB7XG4gIGZvcih2YXIga2V5IGluIHRoaXMudG90YWxzKSB7XG4gICAgdmFyIGFnZ3IgPSB0aGlzLnRvdGFsc1trZXldXG4gICAgdmFyIGFjYyA9IGFnZ3IuaW5pdFxuICAgIHZhciBsZW4gPSB0aGlzLnJvd3MubGVuZ3RoXG4gICAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93LCBpZHgpIHtcbiAgICAgIGFjYyA9IGFnZ3IucmVkdWNlLmNhbGwocm93LCBhY2MsIHJvd1trZXldLCBpZHgsIGxlbilcbiAgICB9KVxuICAgIGNiKGtleSwgYWNjLCBhZ2dyLnByaW50ZXIpXG4gIH1cbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHRhYmxlIHNvIHRoYXQgZWFjaCByb3cgcmVwcmVzZW50cyBjb2x1bW4gYW5kIGVhY2ggY29sdW1uIHJlcHJlc2VudHMgcm93XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHMuc2VwYXJhdG9yXSAtIENvbHVtbiBzZXBhcmF0aW9uIHN0cmluZ1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMubmFtZVByaW50ZXJdIC0gUHJpbnRlciB0byBmb3JtYXQgY29sdW1uIG5hbWVzXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5cblRhYmxlLnByb3RvdHlwZS5wcmludFRyYW5zcG9zZWQgPSBmdW5jdGlvbihvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIHZhciBvdXQgPSBuZXcgVGFibGVcbiAgb3V0LnNlcGFyYXRvciA9IG9wdHMuc2VwYXJhdG9yIHx8IHRoaXMuc2VwYXJhdG9yXG4gIHRoaXMuY29sdW1ucygpLmZvckVhY2goZnVuY3Rpb24oY29sKSB7XG4gICAgb3V0LmNlbGwoMCwgY29sLCBvcHRzLm5hbWVQcmludGVyKVxuICAgIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgaWR4KSB7XG4gICAgICBvdXQuY2VsbChpZHgrMSwgcm93W2NvbF0sIHJvdy5fX3ByaW50ZXJzW2NvbF0pXG4gICAgfSlcbiAgICBvdXQubmV3Um93KClcbiAgfSwgdGhpcylcbiAgcmV0dXJuIG91dC5wcmludCgpXG59XG5cbi8qKlxuICogU29ydCB0aGUgdGFibGVcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufHN0cmluZ1tdfSBbY21wXSAtIEVpdGhlciBjb21wYXJlIGZ1bmN0aW9uIG9yIGEgbGlzdCBvZiBjb2x1bW5zIHRvIHNvcnQgb25cbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjbXApIHtcbiAgaWYgKHR5cGVvZiBjbXAgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRoaXMucm93cy5zb3J0KGNtcClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgdmFyIGtleXMgPSBBcnJheS5pc0FycmF5KGNtcCkgPyBjbXAgOiB0aGlzLmNvbHVtbnMoKVxuXG4gIHZhciBjb21wYXJhdG9ycyA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgIHZhciBvcmRlciA9ICdhc2MnXG4gICAgdmFyIG0gPSAvKC4qKVxcfFxccyooYXNjfGRlcylcXHMqJC8uZXhlYyhrZXkpXG4gICAgaWYgKG0pIHtcbiAgICAgIGtleSA9IG1bMV1cbiAgICAgIG9yZGVyID0gbVsyXVxuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBvcmRlciA9PSAnYXNjJ1xuICAgICAgICA/IGNvbXBhcmUoYVtrZXldLCBiW2tleV0pXG4gICAgICAgIDogY29tcGFyZShiW2tleV0sIGFba2V5XSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHRoaXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb21wYXJhdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9yZGVyID0gY29tcGFyYXRvcnNbaV0oYSwgYilcbiAgICAgIGlmIChvcmRlciAhPSAwKSByZXR1cm4gb3JkZXJcbiAgICB9XG4gICAgcmV0dXJuIDBcbiAgfSlcbn1cblxuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuICBpZiAoYSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gMVxuICBpZiAoYiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gLTFcbiAgaWYgKGEgPT09IG51bGwpIHJldHVybiAxXG4gIGlmIChiID09PSBudWxsKSByZXR1cm4gLTFcbiAgaWYgKGEgPiBiKSByZXR1cm4gMVxuICBpZiAoYSA8IGIpIHJldHVybiAtMVxuICByZXR1cm4gY29tcGFyZShTdHJpbmcoYSksIFN0cmluZyhiKSlcbn1cblxuLyoqXG4gKiBBZGQgYSB0b3RhbCBmb3IgdGhlIGNvbHVtblxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2wgLSBjb2x1bW4gbmFtZVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucmVkdWNlID0gc3VtXSAtIHJlZHVjZShhY2MsIHZhbCwgaWR4LCBsZW5ndGgpIGZ1bmN0aW9uIHRvIGNvbXB1dGUgdGhlIHRvdGFsIHZhbHVlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5wcmludGVyID0gcGFkTGVmdF0gLSBQcmludGVyIHRvIGZvcm1hdCB0aGUgdG90YWwgY2VsbFxuICogQHBhcmFtIHtBbnl9IFtvcHRzLmluaXQgPSAwXSAtIEluaXRpYWwgdmFsdWUgZm9yIHJlZHVjdGlvblxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUudG90YWwgPSBmdW5jdGlvbihjb2wsIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgdGhpcy50b3RhbHMgPSB0aGlzLnRvdGFscyB8fCB7fVxuICB0aGlzLnRvdGFsc1tjb2xdID0ge1xuICAgIHJlZHVjZTogb3B0cy5yZWR1Y2UgfHwgVGFibGUuYWdnci5zdW0sXG4gICAgcHJpbnRlcjogb3B0cy5wcmludGVyIHx8IHBhZExlZnQsXG4gICAgaW5pdDogb3B0cy5pbml0ID09IG51bGwgPyAwIDogb3B0cy5pbml0XG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBQcmVkZWZpbmVkIGhlbHBlcnMgZm9yIHRvdGFsc1xuICovXG5cblRhYmxlLmFnZ3IgPSB7fVxuXG4vKipcbiAqIENyZWF0ZSBhIHByaW50ZXIgd2hpY2ggZm9ybWF0cyB0aGUgdmFsdWUgd2l0aCBgcHJpbnRlcmAsXG4gKiBhZGRzIHRoZSBgcHJlZml4YCB0byBpdCBhbmQgcmlnaHQgYWxpZ25zIHRoZSB3aG9sZSB0aGluZ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcmVmaXhcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByaW50ZXJcbiAqIEByZXR1cm5zIHtwcmludGVyfVxuICovXG5cblRhYmxlLmFnZ3IucHJpbnRlciA9IGZ1bmN0aW9uKHByZWZpeCwgcHJpbnRlcikge1xuICBwcmludGVyID0gcHJpbnRlciB8fCBzdHJpbmdcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwgd2lkdGgpIHtcbiAgICByZXR1cm4gcGFkTGVmdChwcmVmaXggKyBwcmludGVyKHZhbCksIHdpZHRoKVxuICB9XG59XG5cbi8qKlxuICogU3VtIHJlZHVjdGlvblxuICovXG5cblRhYmxlLmFnZ3Iuc3VtID0gZnVuY3Rpb24oYWNjLCB2YWwpIHtcbiAgcmV0dXJuIGFjYyArIHZhbFxufVxuXG4vKipcbiAqIEF2ZXJhZ2UgcmVkdWN0aW9uXG4gKi9cblxuVGFibGUuYWdnci5hdmcgPSBmdW5jdGlvbihhY2MsIHZhbCwgaWR4LCBsZW4pIHtcbiAgYWNjID0gYWNjICsgdmFsXG4gIHJldHVybiBpZHggKyAxID09IGxlbiA/IGFjYy9sZW4gOiBhY2Ncbn1cblxuLyoqXG4gKiBQcmludCB0aGUgYXJyYXkgb3Igb2JqZWN0XG4gKlxuICogQHBhcmFtIHtBcnJheXxPYmplY3R9IG9iaiAtIE9iamVjdCB0byBwcmludFxuICogQHBhcmFtIHtGdW5jdGlvbnxPYmplY3R9IFtmb3JtYXRdIC0gRm9ybWF0IG9wdGlvbnNcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYl0gLSBUYWJsZSBwb3N0IHByb2Nlc3NpbmcgYW5kIGZvcm1hdGluZ1xuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuXG5UYWJsZS5wcmludCA9IGZ1bmN0aW9uKG9iaiwgZm9ybWF0LCBjYikge1xuICB2YXIgb3B0cyA9IGZvcm1hdCB8fCB7fVxuXG4gIGZvcm1hdCA9IHR5cGVvZiBmb3JtYXQgPT0gJ2Z1bmN0aW9uJ1xuICAgID8gZm9ybWF0XG4gICAgOiBmdW5jdGlvbihvYmosIGNlbGwpIHtcbiAgICAgIGZvcih2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSBjb250aW51ZVxuICAgICAgICB2YXIgcGFyYW1zID0gb3B0c1trZXldIHx8IHt9XG4gICAgICAgIGNlbGwocGFyYW1zLm5hbWUgfHwga2V5LCBvYmpba2V5XSwgcGFyYW1zLnByaW50ZXIpXG4gICAgICB9XG4gICAgfVxuXG4gIHZhciB0ID0gbmV3IFRhYmxlXG4gIHZhciBjZWxsID0gdC5jZWxsLmJpbmQodClcblxuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgY2IgPSBjYiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LnRvU3RyaW5nKCkgfVxuICAgIG9iai5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIGZvcm1hdChpdGVtLCBjZWxsKVxuICAgICAgdC5uZXdSb3coKVxuICAgIH0pXG4gIH0gZWxzZSB7XG4gICAgY2IgPSBjYiB8fCBmdW5jdGlvbih0KSB7IHJldHVybiB0LnByaW50VHJhbnNwb3NlZCh7c2VwYXJhdG9yOiAnIDogJ30pIH1cbiAgICBmb3JtYXQob2JqLCBjZWxsKVxuICAgIHQubmV3Um93KClcbiAgfVxuXG4gIHJldHVybiBjYih0KVxufVxuXG4vKipcbiAqIFNhbWUgYXMgYFRhYmxlLnByaW50KClgIGJ1dCB5aWVsZHMgdGhlIHJlc3VsdCB0byBgY29uc29sZS5sb2coKWBcbiAqL1xuXG5UYWJsZS5sb2cgPSBmdW5jdGlvbihvYmosIGZvcm1hdCwgY2IpIHtcbiAgY29uc29sZS5sb2coVGFibGUucHJpbnQob2JqLCBmb3JtYXQsIGNiKSlcbn1cblxuLyoqXG4gKiBTYW1lIGFzIGAudG9TdHJpbmcoKWAgYnV0IHlpZWxkcyB0aGUgcmVzdWx0IHRvIGBjb25zb2xlLmxvZygpYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2codGhpcy50b1N0cmluZygpKVxufVxuIiwiaW1wb3J0IEJlc3RTaG9ydFNpZGVGaXQgZnJvbSAnLi9oZXVyaXN0aWNzL0Jlc3RTaG9ydFNpZGVGaXQnO1xuaW1wb3J0IEJveCBmcm9tICcuL0JveCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpbiB7XG5cdHdpZHRoOiBudW1iZXIgPSAwO1xuXHRoZWlnaHQ6IG51bWJlcj0gMDtcblx0Ym94ZXM6IEJveFtdID0gW107XG5cdGhldXJpc3RpYzogYW55ID0gbnVsbDtcblx0ZnJlZVJlY3RhbmdsZXM6IEZyZWVTcGFjZUJveFtdID0gW107XG5cblx0Y29uc3RydWN0b3Iod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIGhldXJpc3RpYykge1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzID0gW25ldyBGcmVlU3BhY2VCb3god2lkdGgsIGhlaWdodCldO1xuXHRcdHRoaXMuaGV1cmlzdGljID0gaGV1cmlzdGljIHx8IG5ldyBCZXN0U2hvcnRTaWRlRml0KCk7XG5cdH1cblxuXHRnZXQgYXJlYSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2lkdGggKiB0aGlzLmhlaWdodDtcblx0fVxuXG5cdGdldCBlZmZpY2llbmN5KCkge1xuXHRcdGxldCBib3hlc0FyZWEgPSAwO1xuXHRcdHRoaXMuYm94ZXMuZm9yRWFjaCgoYm94KSA9PiB7XG5cdFx0XHRib3hlc0FyZWEgKz0gYm94LndpZHRoICogYm94LmhlaWdodDtcblx0XHR9KTtcblx0XHRyZXR1cm4gKGJveGVzQXJlYSAqIDEwMCkgLyB0aGlzLmFyZWE7XG5cdH1cblxuXHRnZXQgbGFiZWwoKSB7XG5cdFx0cmV0dXJuIGAke3RoaXMud2lkdGh9eCR7dGhpcy5oZWlnaHR9ICR7dGhpcy5lZmZpY2llbmN5fSVgO1xuXHR9XG5cblx0aW5zZXJ0KGJveDogQm94KSB7XG5cdFx0aWYgKGJveC5wYWNrZWQpIHJldHVybiBmYWxzZTtcblxuXHRcdHRoaXMuaGV1cmlzdGljLmZpbmRQb3NpdGlvbkZvck5ld05vZGUoYm94LCB0aGlzLmZyZWVSZWN0YW5nbGVzKTtcblx0XHRpZiAoIWJveC5wYWNrZWQpIHJldHVybiBmYWxzZTtcblxuXHRcdGxldCBudW1SZWN0YW5nbGVzVG9Qcm9jZXNzID0gdGhpcy5mcmVlUmVjdGFuZ2xlcy5sZW5ndGg7XG5cdFx0bGV0IGkgPSAwO1xuXG5cdFx0d2hpbGUgKGkgPCBudW1SZWN0YW5nbGVzVG9Qcm9jZXNzKSB7XG5cdFx0XHRpZiAodGhpcy5zcGxpdEZyZWVOb2RlKHRoaXMuZnJlZVJlY3RhbmdsZXNbaV0sIGJveCkpIHtcblx0XHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdG51bVJlY3RhbmdsZXNUb1Byb2Nlc3MtLTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnBydW5lRnJlZUxpc3QoKTtcblx0XHR0aGlzLmJveGVzLnB1c2goYm94KTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0c2NvcmVGb3IoYm94OiBCb3gpIHtcblx0XHRsZXQgY29weUJveCA9IG5ldyBCb3goYm94LndpZHRoLCBib3guaGVpZ2h0LCBib3guY29uc3RyYWluUm90YXRpb24pO1xuXHRcdGxldCBzY29yZSA9IHRoaXMuaGV1cmlzdGljLmZpbmRQb3NpdGlvbkZvck5ld05vZGUoXG5cdFx0XHRjb3B5Qm94LFxuXHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlc1xuXHRcdCk7XG5cdFx0cmV0dXJuIHNjb3JlO1xuXHR9XG5cblx0aXNMYXJnZXJUaGFuKGJveDogQm94KSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdCh0aGlzLndpZHRoID49IGJveC53aWR0aCAmJiB0aGlzLmhlaWdodCA+PSBib3guaGVpZ2h0KSB8fFxuXHRcdFx0KHRoaXMuaGVpZ2h0ID49IGJveC53aWR0aCAmJiB0aGlzLndpZHRoID49IGJveC5oZWlnaHQpXG5cdFx0KTtcblx0fVxuXG5cdHNwbGl0RnJlZU5vZGUoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0Ly8gVGVzdCB3aXRoIFNBVCBpZiB0aGUgcmVjdGFuZ2xlcyBldmVuIGludGVyc2VjdC5cblx0XHRpZiAoXG5cdFx0XHR1c2VkTm9kZS54ID49IGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCB8fFxuXHRcdFx0dXNlZE5vZGUueCArIHVzZWROb2RlLndpZHRoIDw9IGZyZWVOb2RlLnggfHxcblx0XHRcdHVzZWROb2RlLnkgPj0gZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCB8fFxuXHRcdFx0dXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodCA8PSBmcmVlTm9kZS55XG5cdFx0KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dGhpcy50cnlTcGxpdEZyZWVOb2RlVmVydGljYWxseShmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXHRcdHRoaXMudHJ5U3BsaXRGcmVlTm9kZUhvcml6b250YWxseShmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHR0cnlTcGxpdEZyZWVOb2RlVmVydGljYWxseShmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAoXG5cdFx0XHR1c2VkTm9kZS54IDwgZnJlZU5vZGUueCArIGZyZWVOb2RlLndpZHRoICYmXG5cdFx0XHR1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGggPiBmcmVlTm9kZS54XG5cdFx0KSB7XG5cdFx0XHR0aGlzLnRyeUxlYXZlRnJlZVNwYWNlQXRUb3AoZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHRcdHRoaXMudHJ5TGVhdmVGcmVlU3BhY2VBdEJvdHRvbShmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXHRcdH1cblx0fVxuXG5cdHRyeUxlYXZlRnJlZVNwYWNlQXRUb3AoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKHVzZWROb2RlLnkgPiBmcmVlTm9kZS55ICYmIHVzZWROb2RlLnkgPCBmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0KSB7XG5cdFx0XHRsZXQgbmV3Tm9kZSA9IHsgLi4uZnJlZU5vZGUgfTtcblx0XHRcdG5ld05vZGUuaGVpZ2h0ID0gdXNlZE5vZGUueSAtIG5ld05vZGUueTtcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMucHVzaChuZXdOb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlMZWF2ZUZyZWVTcGFjZUF0Qm90dG9tKGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmICh1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0IDwgZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCkge1xuXHRcdFx0bGV0IG5ld05vZGUgPSB7IC4uLmZyZWVOb2RlIH07XG5cdFx0XHRuZXdOb2RlLnkgPSB1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0O1xuXHRcdFx0bmV3Tm9kZS5oZWlnaHQgPVxuXHRcdFx0XHRmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0IC0gKHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQpO1xuXHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ld05vZGUpO1xuXHRcdH1cblx0fVxuXG5cdHRyeVNwbGl0RnJlZU5vZGVIb3Jpem9udGFsbHkoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKFxuXHRcdFx0dXNlZE5vZGUueSA8IGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQgJiZcblx0XHRcdHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQgPiBmcmVlTm9kZS55XG5cdFx0KSB7XG5cdFx0XHR0aGlzLnRyeUxlYXZlRnJlZVNwYWNlT25MZWZ0KGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0XHR0aGlzLnRyeUxlYXZlRnJlZVNwYWNlT25SaWdodChmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXHRcdH1cblx0fVxuXG5cdHRyeUxlYXZlRnJlZVNwYWNlT25MZWZ0KGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmICh1c2VkTm9kZS54ID4gZnJlZU5vZGUueCAmJiB1c2VkTm9kZS54IDwgZnJlZU5vZGUueCArIGZyZWVOb2RlLndpZHRoKSB7XG5cdFx0XHRsZXQgbmV3Tm9kZSA9IHsgLi4uZnJlZU5vZGUgfTtcblx0XHRcdG5ld05vZGUud2lkdGggPSB1c2VkTm9kZS54IC0gbmV3Tm9kZS54O1xuXHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ld05vZGUpO1xuXHRcdH1cblx0fVxuXG5cdHRyeUxlYXZlRnJlZVNwYWNlT25SaWdodChmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAodXNlZE5vZGUueCArIHVzZWROb2RlLndpZHRoIDwgZnJlZU5vZGUueCArIGZyZWVOb2RlLndpZHRoKSB7XG5cdFx0XHRsZXQgbmV3Tm9kZSA9IHsgLi4uZnJlZU5vZGUgfTtcblx0XHRcdG5ld05vZGUueCA9IHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aDtcblx0XHRcdG5ld05vZGUud2lkdGggPVxuXHRcdFx0XHRmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGggLSAodXNlZE5vZGUueCArIHVzZWROb2RlLndpZHRoKTtcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMucHVzaChuZXdOb2RlKTtcblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogR29lcyB0aHJvdWdoIHRoZSBmcmVlIHJlY3RhbmdsZSBsaXN0IGFuZCByZW1vdmVzIGFueSByZWR1bmRhbnQgZW50cmllcy5cblx0ICovXG5cdHBydW5lRnJlZUxpc3QoKSB7XG5cdFx0bGV0IGkgPSAwO1xuXHRcdHdoaWxlIChpIDwgdGhpcy5mcmVlUmVjdGFuZ2xlcy5sZW5ndGgpIHtcblx0XHRcdGxldCBqID0gaSArIDE7XG5cdFx0XHRpZiAoaiA9PT0gdGhpcy5mcmVlUmVjdGFuZ2xlcy5sZW5ndGgpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAoaiA8IHRoaXMuZnJlZVJlY3RhbmdsZXMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmlzQ29udGFpbmVkSW4odGhpcy5mcmVlUmVjdGFuZ2xlc1tpXSwgdGhpcy5mcmVlUmVjdGFuZ2xlc1tqXSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHRcdFx0aS0tO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHR0aGlzLmlzQ29udGFpbmVkSW4odGhpcy5mcmVlUmVjdGFuZ2xlc1tqXSwgdGhpcy5mcmVlUmVjdGFuZ2xlc1tpXSlcblx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5zcGxpY2UoaiwgMSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aisrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRpc0NvbnRhaW5lZEluKHJlY3RBLCByZWN0Qikge1xuXHRcdHJldHVybiAoXG5cdFx0XHRyZWN0QSAmJlxuXHRcdFx0cmVjdEIgJiZcblx0XHRcdHJlY3RBLnggPj0gcmVjdEIueCAmJlxuXHRcdFx0cmVjdEEueSA+PSByZWN0Qi55ICYmXG5cdFx0XHRyZWN0QS54ICsgcmVjdEEud2lkdGggPD0gcmVjdEIueCArIHJlY3RCLndpZHRoICYmXG5cdFx0XHRyZWN0QS55ICsgcmVjdEEuaGVpZ2h0IDw9IHJlY3RCLnkgKyByZWN0Qi5oZWlnaHRcblx0XHQpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBGcmVlU3BhY2VCb3gge1xuICB4ID0gMFxuICB5ID0gMFxuICB3aWR0aCA9IG51bGxcbiAgaGVpZ2h0ID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLndpZHRoID0gd2lkdGhcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodFxuICB9XG5cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCb3gge1xuXHR3aWR0aDogbnVtYmVyID0gMDtcblx0aGVpZ2h0OiBudW1iZXIgPSAwO1xuXHR4ID0gMDtcbiAgICB5ID0gMDtcbiAgICBjb25zdHJhaW5Sb3RhdGlvbiA9IGZhbHNlO1xuICAgIHBhY2tlZCA9IGZhbHNlO1xuXG5cdGNvbnN0cnVjdG9yKHdpZHRoOm51bWJlciAsIGhlaWdodDogbnVtYmVyLCBjb25zdHJhaW5Sb3RhdGlvbiA9IGZhbHNlKSB7XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgdGhpcy5jb25zdHJhaW5Sb3RhdGlvbiA9IGNvbnN0cmFpblJvdGF0aW9uO1xuXHR9XG59IiwiaW1wb3J0IEJpbiBmcm9tICcuL0Jpbic7XG5pbXBvcnQgQm94IGZyb20gJy4vQm94JztcbmltcG9ydCBTY29yZSBmcm9tICcuL1Njb3JlJztcbmltcG9ydCBTY29yZUJvYXJkIGZyb20gJy4vU2NvcmVCb2FyZCc7XG5pbXBvcnQgeyBQYWNrZWRTY29yZXMgfSBmcm9tICcuL1R5cGVzJztcbmltcG9ydCBTY29yZUJvYXJkRW50cnkgZnJvbSAnLi9TY29yZUJvYXJkRW50cnknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrZXIge1xuXHRiaW5zOiBCaW5bXSA9IFtdO1xuXHR1bnBhY2tlZEJveGVzOiBCb3hbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKGJpbnM6IEJpbltdKSB7XG5cdFx0dGhpcy5iaW5zID0gYmlucztcblx0fVxuXG5cdHBhY2s8VCBleHRlbmRzIEJveD4oYm94ZXM6IFRbXSk6IFBhY2tlZFNjb3JlczxUPltdIHtcbiAgICAgICAgbGV0IHBhY2tlZEJveGVzOiBQYWNrZWRTY29yZXM8VD5bXSA9IFtdO1xuICAgICAgICBsZXQgZW50cnk6IFNjb3JlQm9hcmRFbnRyeSB8IG51bGw7XG5cblx0XHRib3hlcyA9IGJveGVzLmZpbHRlcigoYm94KSA9PiAhYm94LnBhY2tlZCk7XG5cdFx0aWYgKGJveGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHBhY2tlZEJveGVzO1xuXG5cdFx0bGV0IGxpbWl0ID0gU2NvcmUuTUFYX0lOVDtcblx0XHRsZXQgYm9hcmQgPSBuZXcgU2NvcmVCb2FyZCh0aGlzLmJpbnMsIGJveGVzKTtcblx0XHR3aGlsZSAoKGVudHJ5ID0gYm9hcmQuYmVzdEZpdCgpKSkge1xuXHRcdFx0ZW50cnkuYmluLmluc2VydChlbnRyeS5ib3gpO1xuXHRcdFx0Ym9hcmQucmVtb3ZlQm94KGVudHJ5LmJveCk7XG5cdFx0XHRib2FyZC5yZWNhbGN1bGF0ZUJpbihlbnRyeS5iaW4pO1xuICAgICAgICAgICAgcGFja2VkQm94ZXMucHVzaCh7IGJveDogZW50cnkuYm94IGFzIFQsIHNjb3JlOiBlbnRyeS5zY29yZSB9KTtcblx0XHRcdGlmIChwYWNrZWRCb3hlcy5sZW5ndGggPj0gbGltaXQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy51bnBhY2tlZEJveGVzID0gYm94ZXMuZmlsdGVyKChib3gpID0+IHtcblx0XHRcdHJldHVybiAhYm94LnBhY2tlZDtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwYWNrZWRCb3hlcztcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlIHtcbiAgICBzdGF0aWMgTUFYX0lOVCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIHNjb3JlXzEgPSBTY29yZS5NQVhfSU5UO1xuICAgIHNjb3JlXzIgPSBTY29yZS5NQVhfSU5UO1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcmVfMT86IG51bWJlciwgc2NvcmVfMj86IG51bWJlcikge1xuICAgICAgICBpZiAodHlwZW9mIHNjb3JlXzEgIT0gJ3VuZGVmaW5lZCcpIHRoaXMuc2NvcmVfMSA9IHNjb3JlXzE7XG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcmVfMiAhPSAndW5kZWZpbmVkJykgdGhpcy5zY29yZV8yID0gc2NvcmVfMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb3dlciBpcyBiZXR0ZXJcbiAgICAgKi9cbiAgICB2YWx1ZU9mKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuc2NvcmVfMSArIHRoaXMuc2NvcmVfMik7XG4gICAgfVxuXG4gICAgYXNzaWduKG90aGVyKSB7XG4gICAgICAgIHRoaXMuc2NvcmVfMSA9IG90aGVyLnNjb3JlXzE7XG4gICAgICAgIHRoaXMuc2NvcmVfMiA9IG90aGVyLnNjb3JlXzI7XG4gICAgfVxuXG4gICAgaXNCbGFuaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NvcmVfMSA9PT0gU2NvcmUuTUFYX0lOVDtcbiAgICB9XG5cbiAgICBkZWNyZWFzZUJ5KGRlbHRhKSB7XG4gICAgICAgIHRoaXMuc2NvcmVfMSArPSBkZWx0YTtcbiAgICAgICAgdGhpcy5zY29yZV8yICs9IGRlbHRhO1xuICAgIH1cbn0iLCIvLyAjICAgICAgIGJveF8xIGJveF8yIGJveF8zIC4uLlxuLy8gIyBiaW5fMSAgMTAwICAgMjAwICAgIDBcbi8vICMgYmluXzIgICAwICAgICA1ICAgICAwXG4vLyAjIGJpbl8zICAgOSAgICAxMDAgICAgMFxuLy8gIyAuLi5cbmltcG9ydCBCaW4gZnJvbSAnLi9CaW4nO1xuaW1wb3J0IEJveCBmcm9tICcuL0JveCc7XG5pbXBvcnQgU2NvcmVCb2FyZEVudHJ5IGZyb20gJy4vU2NvcmVCb2FyZEVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NvcmVCb2FyZCB7XG5cdGVudHJpZXM6IFNjb3JlQm9hcmRFbnRyeVtdID0gW107XG5cblx0Y29uc3RydWN0b3IoYmluczogQmluW10sIGJveGVzOiBCb3hbXSkge1xuXHRcdGJpbnMuZm9yRWFjaCgoYmluKSA9PiB7XG5cdFx0XHR0aGlzLmFkZEJpbkVudHJpZXMoYmluLCBib3hlcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRkZWJ1ZygpIHtcblx0XHRyZXF1aXJlKCdjb25zb2xlLnRhYmxlJyk7XG5cdFx0Y29uc29sZS50YWJsZShcblx0XHRcdHRoaXMuZW50cmllcy5tYXAoKGVudHJ5KSA9PiAoe1xuXHRcdFx0XHRiaW46IGVudHJ5LmJpbi5sYWJlbCxcblx0XHRcdFx0c2NvcmU6IGVudHJ5LnNjb3JlLFxuXHRcdFx0fSkpXG5cdFx0KTtcblx0fVxuXG5cdGFkZEJpbkVudHJpZXMoYmluLCBib3hlcykge1xuXHRcdGJveGVzLmZvckVhY2goKGJveCkgPT4ge1xuXHRcdFx0bGV0IGVudHJ5ID0gbmV3IFNjb3JlQm9hcmRFbnRyeShiaW4sIGJveCk7XG5cdFx0XHRlbnRyeS5jYWxjdWxhdGUoKTtcblx0XHRcdHRoaXMuZW50cmllcy5wdXNoKGVudHJ5KTtcblx0XHR9KTtcblx0fVxuXG5cdGxhcmdlc3ROb3RGaXRpbmdCb3goKSB7XG4gICAgICAgIGxldCB1bmZpdDogU2NvcmVCb2FyZEVudHJ5O1xuXHRcdGxldCBmaXR0aW5nQm94ZXMgPSB0aGlzLmVudHJpZXNcblx0XHRcdC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5maXQpXG5cdFx0XHQubWFwKChlbnRyeSkgPT4gZW50cnkuYm94KTtcblxuICAgICAgICB0aGlzLmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVuZml0QXJlYSA9IHVuZml0LmJveC53aWR0aCAqIHVuZml0LmJveC5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBlbnRyeUFyZWEgPSBlbnRyeS5ib3gud2lkdGggKiBlbnRyeS5ib3guaGVpZ2h0O1xuXHRcdFx0aWYgKCFmaXR0aW5nQm94ZXMuaW5jbHVkZXMoZW50cnkuYm94KSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodW5maXQgPT09IG51bGwgfHwgdW5maXRBcmVhIDwgZW50cnlBcmVhKSB7XG5cdFx0XHRcdHVuZml0ID0gZW50cnk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdW5maXQuYm94ID8gdW5maXQgOiBmYWxzZTtcblx0fVxuXG5cdGJlc3RGaXQoKSB7XG5cdFx0bGV0IGJlc3Q6IFNjb3JlQm9hcmRFbnRyeSB8IG51bGwgPSBudWxsO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgZW50cnkgPSB0aGlzLmVudHJpZXNbaV07XG5cdFx0XHRpZiAoIWVudHJ5LmZpdCgpKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGJlc3QgPT09IG51bGwgfHwgZW50cnkuc2NvcmUgPCBiZXN0LnNjb3JlKSB7XG5cdFx0XHRcdGJlc3QgPSBlbnRyeTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGJlc3Q7XG5cdH1cblxuXHRyZW1vdmVCb3goYm94KSB7XG5cdFx0dGhpcy5lbnRyaWVzID0gdGhpcy5lbnRyaWVzLmZpbHRlcigoZW50cnkpID0+IHtcblx0XHRcdHJldHVybiBlbnRyeS5ib3ggIT09IGJveDtcblx0XHR9KTtcblx0fVxuXG5cdGFkZEJpbihiaW4pIHtcblx0XHR0aGlzLmFkZEJpbkVudHJpZXMoYmluLCB0aGlzLmN1cnJlbnRCb3hlcygpKTtcblx0fVxuXG5cdHJlY2FsY3VsYXRlQmluKGJpbikge1xuXHRcdHRoaXMuZW50cmllc1xuXHRcdFx0LmZpbHRlcigoZW50cnkpID0+IGVudHJ5LmJpbiA9PT0gYmluKVxuXHRcdFx0LmZvckVhY2goKGVudHJ5KSA9PiBlbnRyeS5jYWxjdWxhdGUoKSk7XG5cdH1cblxuXHRjdXJyZW50Qm94ZXMoKSB7XG5cdFx0cmV0dXJuIFsuLi5uZXcgU2V0KHRoaXMuZW50cmllcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS5ib3gpKV07XG5cdH1cbn1cbiIsImltcG9ydCBCaW4gZnJvbSBcIi4vQmluXCI7XG5pbXBvcnQgQm94IGZyb20gXCIuL0JveFwiO1xuaW1wb3J0IFNjb3JlIGZyb20gXCIuL1Njb3JlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlQm9hcmRFbnRyeSB7XG4gICAgYmluOiBCaW47XG4gICAgYm94OiBCb3g7XG4gICAgc2NvcmU6IFNjb3JlO1xuXG4gICAgY29uc3RydWN0b3IoYmluOiBCaW4sIGJveDogQm94KSB7XG4gICAgICAgIHRoaXMuYmluID0gYmluXG4gICAgICAgIHRoaXMuYm94ID0gYm94XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlKCkge1xuICAgICAgICB0aGlzLnNjb3JlID0gdGhpcy5iaW4uc2NvcmVGb3IodGhpcy5ib3gpO1xuICAgICAgICByZXR1cm4gdGhpcy5zY29yZTtcbiAgICB9XG5cbiAgICBmaXQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5zY29yZS5pc0JsYW5rKCk7XG4gICAgfVxufSIsImltcG9ydCB7IEZyZWVTcGFjZUJveCB9IGZyb20gJy4uL0Jpbic7XG5pbXBvcnQgQm94IGZyb20gJy4uL0JveCc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlIHtcblx0ZmluZFBvc2l0aW9uRm9yTmV3Tm9kZShib3g6IEJveCwgZnJlZVJlY3RzOiBGcmVlU3BhY2VCb3hbXSkge1xuXHRcdGxldCBiZXN0U2NvcmUgPSBuZXcgU2NvcmUoKTtcblx0XHRsZXQgd2lkdGggPSBib3gud2lkdGg7XG5cdFx0bGV0IGhlaWdodCA9IGJveC5oZWlnaHQ7XG5cblx0XHRmcmVlUmVjdHMuZm9yRWFjaCgoZnJlZVJlY3QpID0+IHtcblx0XHRcdHRoaXMudHJ5UGxhY2VSZWN0SW4oZnJlZVJlY3QsIGJveCwgd2lkdGgsIGhlaWdodCwgYmVzdFNjb3JlKTtcblx0XHRcdGlmICghYm94LmNvbnN0cmFpblJvdGF0aW9uKSB7XG5cdFx0XHRcdHRoaXMudHJ5UGxhY2VSZWN0SW4oZnJlZVJlY3QsIGJveCwgaGVpZ2h0LCB3aWR0aCwgYmVzdFNjb3JlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBiZXN0U2NvcmU7XG5cdH1cblxuXHR0cnlQbGFjZVJlY3RJbihcblx0XHRmcmVlUmVjdDogRnJlZVNwYWNlQm94LFxuXHRcdGJveDogQm94LFxuXHRcdHJlY3RXaWR0aCxcblx0XHRyZWN0SGVpZ2h0LFxuXHRcdGJlc3RTY29yZVxuXHQpIHtcblx0XHRpZiAoZnJlZVJlY3Qud2lkdGggPj0gcmVjdFdpZHRoICYmIGZyZWVSZWN0LmhlaWdodCA+PSByZWN0SGVpZ2h0KSB7XG5cdFx0XHRsZXQgc2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpO1xuXHRcdFx0aWYgKHNjb3JlIDwgYmVzdFNjb3JlKSB7XG5cdFx0XHRcdGJveC54ID0gZnJlZVJlY3QueDtcblx0XHRcdFx0Ym94LnkgPSBmcmVlUmVjdC55O1xuXHRcdFx0XHRib3gud2lkdGggPSByZWN0V2lkdGg7XG5cdFx0XHRcdGJveC5oZWlnaHQgPSByZWN0SGVpZ2h0O1xuXHRcdFx0XHRib3gucGFja2VkID0gdHJ1ZTtcblx0XHRcdFx0YmVzdFNjb3JlLmFzc2lnbihzY29yZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y2FsY3VsYXRlU2NvcmUoX2ZyZWVSZWN0LCBfcmVjdFdpZHRoLCBfcmVjdEhlaWdodCk6IFNjb3JlIHtcblx0XHR0aHJvdyAnTm90SW1wbGVtZW50ZWRFcnJvcic7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICBbIDB4MDMwMCwgMHgwMzZGIF0sIFsgMHgwNDgzLCAweDA0ODYgXSwgWyAweDA0ODgsIDB4MDQ4OSBdLFxuICAgIFsgMHgwNTkxLCAweDA1QkQgXSwgWyAweDA1QkYsIDB4MDVCRiBdLCBbIDB4MDVDMSwgMHgwNUMyIF0sXG4gICAgWyAweDA1QzQsIDB4MDVDNSBdLCBbIDB4MDVDNywgMHgwNUM3IF0sIFsgMHgwNjAwLCAweDA2MDMgXSxcbiAgICBbIDB4MDYxMCwgMHgwNjE1IF0sIFsgMHgwNjRCLCAweDA2NUUgXSwgWyAweDA2NzAsIDB4MDY3MCBdLFxuICAgIFsgMHgwNkQ2LCAweDA2RTQgXSwgWyAweDA2RTcsIDB4MDZFOCBdLCBbIDB4MDZFQSwgMHgwNkVEIF0sXG4gICAgWyAweDA3MEYsIDB4MDcwRiBdLCBbIDB4MDcxMSwgMHgwNzExIF0sIFsgMHgwNzMwLCAweDA3NEEgXSxcbiAgICBbIDB4MDdBNiwgMHgwN0IwIF0sIFsgMHgwN0VCLCAweDA3RjMgXSwgWyAweDA5MDEsIDB4MDkwMiBdLFxuICAgIFsgMHgwOTNDLCAweDA5M0MgXSwgWyAweDA5NDEsIDB4MDk0OCBdLCBbIDB4MDk0RCwgMHgwOTREIF0sXG4gICAgWyAweDA5NTEsIDB4MDk1NCBdLCBbIDB4MDk2MiwgMHgwOTYzIF0sIFsgMHgwOTgxLCAweDA5ODEgXSxcbiAgICBbIDB4MDlCQywgMHgwOUJDIF0sIFsgMHgwOUMxLCAweDA5QzQgXSwgWyAweDA5Q0QsIDB4MDlDRCBdLFxuICAgIFsgMHgwOUUyLCAweDA5RTMgXSwgWyAweDBBMDEsIDB4MEEwMiBdLCBbIDB4MEEzQywgMHgwQTNDIF0sXG4gICAgWyAweDBBNDEsIDB4MEE0MiBdLCBbIDB4MEE0NywgMHgwQTQ4IF0sIFsgMHgwQTRCLCAweDBBNEQgXSxcbiAgICBbIDB4MEE3MCwgMHgwQTcxIF0sIFsgMHgwQTgxLCAweDBBODIgXSwgWyAweDBBQkMsIDB4MEFCQyBdLFxuICAgIFsgMHgwQUMxLCAweDBBQzUgXSwgWyAweDBBQzcsIDB4MEFDOCBdLCBbIDB4MEFDRCwgMHgwQUNEIF0sXG4gICAgWyAweDBBRTIsIDB4MEFFMyBdLCBbIDB4MEIwMSwgMHgwQjAxIF0sIFsgMHgwQjNDLCAweDBCM0MgXSxcbiAgICBbIDB4MEIzRiwgMHgwQjNGIF0sIFsgMHgwQjQxLCAweDBCNDMgXSwgWyAweDBCNEQsIDB4MEI0RCBdLFxuICAgIFsgMHgwQjU2LCAweDBCNTYgXSwgWyAweDBCODIsIDB4MEI4MiBdLCBbIDB4MEJDMCwgMHgwQkMwIF0sXG4gICAgWyAweDBCQ0QsIDB4MEJDRCBdLCBbIDB4MEMzRSwgMHgwQzQwIF0sIFsgMHgwQzQ2LCAweDBDNDggXSxcbiAgICBbIDB4MEM0QSwgMHgwQzREIF0sIFsgMHgwQzU1LCAweDBDNTYgXSwgWyAweDBDQkMsIDB4MENCQyBdLFxuICAgIFsgMHgwQ0JGLCAweDBDQkYgXSwgWyAweDBDQzYsIDB4MENDNiBdLCBbIDB4MENDQywgMHgwQ0NEIF0sXG4gICAgWyAweDBDRTIsIDB4MENFMyBdLCBbIDB4MEQ0MSwgMHgwRDQzIF0sIFsgMHgwRDRELCAweDBENEQgXSxcbiAgICBbIDB4MERDQSwgMHgwRENBIF0sIFsgMHgwREQyLCAweDBERDQgXSwgWyAweDBERDYsIDB4MERENiBdLFxuICAgIFsgMHgwRTMxLCAweDBFMzEgXSwgWyAweDBFMzQsIDB4MEUzQSBdLCBbIDB4MEU0NywgMHgwRTRFIF0sXG4gICAgWyAweDBFQjEsIDB4MEVCMSBdLCBbIDB4MEVCNCwgMHgwRUI5IF0sIFsgMHgwRUJCLCAweDBFQkMgXSxcbiAgICBbIDB4MEVDOCwgMHgwRUNEIF0sIFsgMHgwRjE4LCAweDBGMTkgXSwgWyAweDBGMzUsIDB4MEYzNSBdLFxuICAgIFsgMHgwRjM3LCAweDBGMzcgXSwgWyAweDBGMzksIDB4MEYzOSBdLCBbIDB4MEY3MSwgMHgwRjdFIF0sXG4gICAgWyAweDBGODAsIDB4MEY4NCBdLCBbIDB4MEY4NiwgMHgwRjg3IF0sIFsgMHgwRjkwLCAweDBGOTcgXSxcbiAgICBbIDB4MEY5OSwgMHgwRkJDIF0sIFsgMHgwRkM2LCAweDBGQzYgXSwgWyAweDEwMkQsIDB4MTAzMCBdLFxuICAgIFsgMHgxMDMyLCAweDEwMzIgXSwgWyAweDEwMzYsIDB4MTAzNyBdLCBbIDB4MTAzOSwgMHgxMDM5IF0sXG4gICAgWyAweDEwNTgsIDB4MTA1OSBdLCBbIDB4MTE2MCwgMHgxMUZGIF0sIFsgMHgxMzVGLCAweDEzNUYgXSxcbiAgICBbIDB4MTcxMiwgMHgxNzE0IF0sIFsgMHgxNzMyLCAweDE3MzQgXSwgWyAweDE3NTIsIDB4MTc1MyBdLFxuICAgIFsgMHgxNzcyLCAweDE3NzMgXSwgWyAweDE3QjQsIDB4MTdCNSBdLCBbIDB4MTdCNywgMHgxN0JEIF0sXG4gICAgWyAweDE3QzYsIDB4MTdDNiBdLCBbIDB4MTdDOSwgMHgxN0QzIF0sIFsgMHgxN0RELCAweDE3REQgXSxcbiAgICBbIDB4MTgwQiwgMHgxODBEIF0sIFsgMHgxOEE5LCAweDE4QTkgXSwgWyAweDE5MjAsIDB4MTkyMiBdLFxuICAgIFsgMHgxOTI3LCAweDE5MjggXSwgWyAweDE5MzIsIDB4MTkzMiBdLCBbIDB4MTkzOSwgMHgxOTNCIF0sXG4gICAgWyAweDFBMTcsIDB4MUExOCBdLCBbIDB4MUIwMCwgMHgxQjAzIF0sIFsgMHgxQjM0LCAweDFCMzQgXSxcbiAgICBbIDB4MUIzNiwgMHgxQjNBIF0sIFsgMHgxQjNDLCAweDFCM0MgXSwgWyAweDFCNDIsIDB4MUI0MiBdLFxuICAgIFsgMHgxQjZCLCAweDFCNzMgXSwgWyAweDFEQzAsIDB4MURDQSBdLCBbIDB4MURGRSwgMHgxREZGIF0sXG4gICAgWyAweDIwMEIsIDB4MjAwRiBdLCBbIDB4MjAyQSwgMHgyMDJFIF0sIFsgMHgyMDYwLCAweDIwNjMgXSxcbiAgICBbIDB4MjA2QSwgMHgyMDZGIF0sIFsgMHgyMEQwLCAweDIwRUYgXSwgWyAweDMwMkEsIDB4MzAyRiBdLFxuICAgIFsgMHgzMDk5LCAweDMwOUEgXSwgWyAweEE4MDYsIDB4QTgwNiBdLCBbIDB4QTgwQiwgMHhBODBCIF0sXG4gICAgWyAweEE4MjUsIDB4QTgyNiBdLCBbIDB4RkIxRSwgMHhGQjFFIF0sIFsgMHhGRTAwLCAweEZFMEYgXSxcbiAgICBbIDB4RkUyMCwgMHhGRTIzIF0sIFsgMHhGRUZGLCAweEZFRkYgXSwgWyAweEZGRjksIDB4RkZGQiBdLFxuICAgIFsgMHgxMEEwMSwgMHgxMEEwMyBdLCBbIDB4MTBBMDUsIDB4MTBBMDYgXSwgWyAweDEwQTBDLCAweDEwQTBGIF0sXG4gICAgWyAweDEwQTM4LCAweDEwQTNBIF0sIFsgMHgxMEEzRiwgMHgxMEEzRiBdLCBbIDB4MUQxNjcsIDB4MUQxNjkgXSxcbiAgICBbIDB4MUQxNzMsIDB4MUQxODIgXSwgWyAweDFEMTg1LCAweDFEMThCIF0sIFsgMHgxRDFBQSwgMHgxRDFBRCBdLFxuICAgIFsgMHgxRDI0MiwgMHgxRDI0NCBdLCBbIDB4RTAwMDEsIDB4RTAwMDEgXSwgWyAweEUwMDIwLCAweEUwMDdGIF0sXG4gICAgWyAweEUwMTAwLCAweEUwMUVGIF1cbl1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJ2RlZmF1bHRzJylcbnZhciBjb21iaW5pbmcgPSByZXF1aXJlKCcuL2NvbWJpbmluZycpXG5cbnZhciBERUZBVUxUUyA9IHtcbiAgbnVsOiAwLFxuICBjb250cm9sOiAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2N3aWR0aChzdHIpIHtcbiAgcmV0dXJuIHdjc3dpZHRoKHN0ciwgREVGQVVMVFMpXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbmZpZyA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgb3B0cyA9IGRlZmF1bHRzKG9wdHMgfHwge30sIERFRkFVTFRTKVxuICByZXR1cm4gZnVuY3Rpb24gd2N3aWR0aChzdHIpIHtcbiAgICByZXR1cm4gd2Nzd2lkdGgoc3RyLCBvcHRzKVxuICB9XG59XG5cbi8qXG4gKiAgVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgZGVmaW5lIHRoZSBjb2x1bW4gd2lkdGggb2YgYW4gSVNPIDEwNjQ2XG4gKiAgY2hhcmFjdGVyIGFzIGZvbGxvd3M6XG4gKiAgLSBUaGUgbnVsbCBjaGFyYWN0ZXIgKFUrMDAwMCkgaGFzIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBPdGhlciBDMC9DMSBjb250cm9sIGNoYXJhY3RlcnMgYW5kIERFTCB3aWxsIGxlYWQgdG8gYSByZXR1cm4gdmFsdWVcbiAqICAgIG9mIC0xLlxuICogIC0gTm9uLXNwYWNpbmcgYW5kIGVuY2xvc2luZyBjb21iaW5pbmcgY2hhcmFjdGVycyAoZ2VuZXJhbCBjYXRlZ29yeVxuICogICAgY29kZSBNbiBvciBNZSBpbiB0aGVcbiAqICAgIFVuaWNvZGUgZGF0YWJhc2UpIGhhdmUgYSBjb2x1bW4gd2lkdGggb2YgMC5cbiAqICAtIFNPRlQgSFlQSEVOIChVKzAwQUQpIGhhcyBhIGNvbHVtbiB3aWR0aCBvZiAxLlxuICogIC0gT3RoZXIgZm9ybWF0IGNoYXJhY3RlcnMgKGdlbmVyYWwgY2F0ZWdvcnkgY29kZSBDZiBpbiB0aGUgVW5pY29kZVxuICogICAgZGF0YWJhc2UpIGFuZCBaRVJPIFdJRFRIXG4gKiAgICBTUEFDRSAoVSsyMDBCKSBoYXZlIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBIYW5ndWwgSmFtbyBtZWRpYWwgdm93ZWxzIGFuZCBmaW5hbCBjb25zb25hbnRzIChVKzExNjAtVSsxMUZGKVxuICogICAgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAwLlxuICogIC0gU3BhY2luZyBjaGFyYWN0ZXJzIGluIHRoZSBFYXN0IEFzaWFuIFdpZGUgKFcpIG9yIEVhc3QgQXNpYW5cbiAqICAgIEZ1bGwtd2lkdGggKEYpIGNhdGVnb3J5IGFzXG4gKiAgICBkZWZpbmVkIGluIFVuaWNvZGUgVGVjaG5pY2FsIFJlcG9ydCAjMTEgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAyLlxuICogIC0gQWxsIHJlbWFpbmluZyBjaGFyYWN0ZXJzIChpbmNsdWRpbmcgYWxsIHByaW50YWJsZSBJU08gODg1OS0xIGFuZFxuICogICAgV0dMNCBjaGFyYWN0ZXJzLCBVbmljb2RlIGNvbnRyb2wgY2hhcmFjdGVycywgZXRjLikgaGF2ZSBhIGNvbHVtblxuICogICAgd2lkdGggb2YgMS5cbiAqICBUaGlzIGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdGhhdCBjaGFyYWN0ZXJzIGFyZSBlbmNvZGVkIGluIElTTyAxMDY0Ni5cbiovXG5cbmZ1bmN0aW9uIHdjc3dpZHRoKHN0ciwgb3B0cykge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiB3Y3dpZHRoKHN0ciwgb3B0cylcblxuICB2YXIgcyA9IDBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbiA9IHdjd2lkdGgoc3RyLmNoYXJDb2RlQXQoaSksIG9wdHMpXG4gICAgaWYgKG4gPCAwKSByZXR1cm4gLTFcbiAgICBzICs9IG5cbiAgfVxuXG4gIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIHdjd2lkdGgodWNzLCBvcHRzKSB7XG4gIC8vIHRlc3QgZm9yIDgtYml0IGNvbnRyb2wgY2hhcmFjdGVyc1xuICBpZiAodWNzID09PSAwKSByZXR1cm4gb3B0cy5udWxcbiAgaWYgKHVjcyA8IDMyIHx8ICh1Y3MgPj0gMHg3ZiAmJiB1Y3MgPCAweGEwKSkgcmV0dXJuIG9wdHMuY29udHJvbFxuXG4gIC8vIGJpbmFyeSBzZWFyY2ggaW4gdGFibGUgb2Ygbm9uLXNwYWNpbmcgY2hhcmFjdGVyc1xuICBpZiAoYmlzZWFyY2godWNzKSkgcmV0dXJuIDBcblxuICAvLyBpZiB3ZSBhcnJpdmUgaGVyZSwgdWNzIGlzIG5vdCBhIGNvbWJpbmluZyBvciBDMC9DMSBjb250cm9sIGNoYXJhY3RlclxuICByZXR1cm4gMSArXG4gICAgICAodWNzID49IDB4MTEwMCAmJlxuICAgICAgICh1Y3MgPD0gMHgxMTVmIHx8ICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5ndWwgSmFtbyBpbml0LiBjb25zb25hbnRzXG4gICAgICAgIHVjcyA9PSAweDIzMjkgfHwgdWNzID09IDB4MjMyYSB8fFxuICAgICAgICAodWNzID49IDB4MmU4MCAmJiB1Y3MgPD0gMHhhNGNmICYmXG4gICAgICAgICB1Y3MgIT0gMHgzMDNmKSB8fCAgICAgICAgICAgICAgICAgICAgIC8vIENKSyAuLi4gWWlcbiAgICAgICAgKHVjcyA+PSAweGFjMDAgJiYgdWNzIDw9IDB4ZDdhMykgfHwgICAgLy8gSGFuZ3VsIFN5bGxhYmxlc1xuICAgICAgICAodWNzID49IDB4ZjkwMCAmJiB1Y3MgPD0gMHhmYWZmKSB8fCAgICAvLyBDSksgQ29tcGF0aWJpbGl0eSBJZGVvZ3JhcGhzXG4gICAgICAgICh1Y3MgPj0gMHhmZTEwICYmIHVjcyA8PSAweGZlMTkpIHx8ICAgIC8vIFZlcnRpY2FsIGZvcm1zXG4gICAgICAgICh1Y3MgPj0gMHhmZTMwICYmIHVjcyA8PSAweGZlNmYpIHx8ICAgIC8vIENKSyBDb21wYXRpYmlsaXR5IEZvcm1zXG4gICAgICAgICh1Y3MgPj0gMHhmZjAwICYmIHVjcyA8PSAweGZmNjApIHx8ICAgIC8vIEZ1bGx3aWR0aCBGb3Jtc1xuICAgICAgICAodWNzID49IDB4ZmZlMCAmJiB1Y3MgPD0gMHhmZmU2KSB8fFxuICAgICAgICAodWNzID49IDB4MjAwMDAgJiYgdWNzIDw9IDB4MmZmZmQpIHx8XG4gICAgICAgICh1Y3MgPj0gMHgzMDAwMCAmJiB1Y3MgPD0gMHgzZmZmZCkpKTtcbn1cblxuZnVuY3Rpb24gYmlzZWFyY2godWNzKSB7XG4gIHZhciBtaW4gPSAwXG4gIHZhciBtYXggPSBjb21iaW5pbmcubGVuZ3RoIC0gMVxuICB2YXIgbWlkXG5cbiAgaWYgKHVjcyA8IGNvbWJpbmluZ1swXVswXSB8fCB1Y3MgPiBjb21iaW5pbmdbbWF4XVsxXSkgcmV0dXJuIGZhbHNlXG5cbiAgd2hpbGUgKG1heCA+PSBtaW4pIHtcbiAgICBtaWQgPSBNYXRoLmZsb29yKChtaW4gKyBtYXgpIC8gMilcbiAgICBpZiAodWNzID4gY29tYmluaW5nW21pZF1bMV0pIG1pbiA9IG1pZCArIDFcbiAgICBlbHNlIGlmICh1Y3MgPCBjb21iaW5pbmdbbWlkXVswXSkgbWF4ID0gbWlkIC0gMVxuICAgIGVsc2UgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlc3RBcmVhRml0IGV4dGVuZHMgQmFzZSB7XG5cbiAgY2FsY3VsYXRlU2NvcmUoZnJlZVJlY3QsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCkge1xuICAgIGxldCBhcmVhRml0ID0gZnJlZVJlY3Qud2lkdGggKiBmcmVlUmVjdC5oZWlnaHQgLSByZWN0V2lkdGggKiByZWN0SGVpZ2h0O1xuICAgIGxldCBsZWZ0T3Zlckhvcml6ID0gTWF0aC5hYnMoZnJlZVJlY3Qud2lkdGggLSByZWN0V2lkdGgpO1xuICAgIGxldCBsZWZ0T3ZlclZlcnQgPSBNYXRoLmFicyhmcmVlUmVjdC5oZWlnaHQgLSByZWN0SGVpZ2h0KTtcbiAgICBsZXQgc2hvcnRTaWRlRml0ID0gTWF0aC5taW4obGVmdE92ZXJIb3JpeiwgbGVmdE92ZXJWZXJ0KTtcbiAgICByZXR1cm4gbmV3IFNjb3JlKGFyZWFGaXQsIHNob3J0U2lkZUZpdCk7XG4gIH1cblxufSIsImltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZXN0TG9uZ1NpZGVGaXQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IGxlZnRPdmVySG9yaXogPSBNYXRoLmFicyhmcmVlUmVjdC53aWR0aCAtIHJlY3RXaWR0aCk7XG4gICAgbGV0IGxlZnRPdmVyVmVydCA9IE1hdGguYWJzKGZyZWVSZWN0LmhlaWdodCAtIHJlY3RIZWlnaHQpO1xuICAgIGxldCBhcmdzID0gW2xlZnRPdmVySG9yaXosIGxlZnRPdmVyVmVydF0uc29ydCgoYSwgYikgPT4gYSAtIGIpLnJldmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFNjb3JlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICB9XG5cbn0iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVzdFNob3J0U2lkZUZpdCBleHRlbmRzIEJhc2Uge1xuXG4gIGNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpIHtcbiAgICBsZXQgbGVmdE92ZXJIb3JpeiA9IE1hdGguYWJzKGZyZWVSZWN0LndpZHRoIC0gcmVjdFdpZHRoKTtcbiAgICBsZXQgbGVmdE92ZXJWZXJ0ID0gTWF0aC5hYnMoZnJlZVJlY3QuaGVpZ2h0IC0gcmVjdEhlaWdodCk7XG4gICAgbGV0IGFyZ3MgPSBbbGVmdE92ZXJIb3JpeiwgbGVmdE92ZXJWZXJ0XS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgbGV0IHNjb3JlID0gbmV3IFNjb3JlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIHJldHVybiBzY29yZTtcbiAgfVxuXG59IiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdHRvbUxlZnQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IHRvcFNpZGVZID0gZnJlZVJlY3QueSArIHJlY3RIZWlnaHQ7XG4gICAgcmV0dXJuIG5ldyBTY29yZSh0b3BTaWRlWSwgZnJlZVJlY3QueCk7XG4gIH1cblxufSIsImV4cG9ydCB7IGRlZmF1bHQgYXMgQmVzdEFyZWFGaXQgfSBmcm9tICcuL0Jlc3RBcmVhRml0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQmVzdExvbmdTaWRlRml0IH0gZnJvbSAnLi9CZXN0TG9uZ1NpZGVGaXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBCZXN0U2hvcnRTaWRlRml0IH0gZnJvbSAnLi9CZXN0U2hvcnRTaWRlRml0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQm90dG9tTGVmdCB9IGZyb20gJy4vQm90dG9tTGVmdCc7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBCaW4gZnJvbSAnLi9CaW4nXG5pbXBvcnQgQm94IGZyb20gJy4vQm94J1xuaW1wb3J0IFBhY2tlciBmcm9tICcuL1BhY2tlcidcbmltcG9ydCAqIGFzIGhldXJpc3RpY3MgZnJvbSAnLi9oZXVyaXN0aWNzJztcblxuZXhwb3J0IHsgQmluLCBCb3gsIFBhY2tlciwgaGV1cmlzdGljcyB9OyJdLCJzb3VyY2VSb290IjoiIn0=