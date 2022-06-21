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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jbG9uZS9jbG9uZS5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jb25zb2xlLnRhYmxlL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2RlZmF1bHRzL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2Vhc3ktdGFibGUvdGFibGUuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL0Jpbi50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvQm94LnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9QYWNrZXIudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL1Njb3JlLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkRW50cnkudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvQmFzZS50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2NvbWJpbmluZy5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RBcmVhRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RMb25nU2lkZUZpdC5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvaGV1cmlzdGljcy9CZXN0U2hvcnRTaWRlRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0JvdHRvbUxlZnQuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRCxJQUFJLEtBQTBCO0FBQzlCO0FBQ0E7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsdURBQVk7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLGVBQWU7QUFDbEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQSxJQUFJLHVCQUF1QjtBQUMzQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDbExELFlBQVksbUJBQU8sQ0FBQyw2Q0FBTzs7QUFFM0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSxFOzs7Ozs7Ozs7O0FDWkE7O0FBRUE7QUFDQSxZQUFZLG1CQUFPLENBQUMsaURBQVM7QUFDN0IsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsTUFBTTtBQUNuQjs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsSUFBSTtBQUNmLFdBQVcsU0FBUztBQUNwQixhQUFhLE1BQU07QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixhQUFhO0FBQ2I7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU8sT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxTQUFTO0FBQ3BCLGFBQWEsTUFBTTtBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixXQUFXLFNBQVM7QUFDcEIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGtCQUFrQjtBQUM3QixhQUFhLE1BQU07QUFDbkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsbUJBQW1CLHdCQUF3QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsU0FBUztBQUNwQixXQUFXLFNBQVM7QUFDcEIsV0FBVyxJQUFJO0FBQ2YsYUFBYSxNQUFNO0FBQ25COztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLFNBQVM7QUFDcEIsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsV0FBVyxnQkFBZ0I7QUFDM0IsV0FBVyxTQUFTO0FBQ3BCLGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0gsNEJBQTRCLDJCQUEyQixpQkFBaUI7QUFDeEU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzViNkQ7QUFDckM7QUFFeEI7SUFPQyxhQUFZLEtBQWEsRUFBRSxNQUFjLEVBQUUsU0FBUztRQU5wRCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFdBQU0sR0FBVSxDQUFDLENBQUM7UUFDbEIsVUFBSyxHQUFVLEVBQUUsQ0FBQztRQUNsQixjQUFTLEdBQVEsSUFBSSxDQUFDO1FBQ3RCLG1CQUFjLEdBQW1CLEVBQUUsQ0FBQztRQUduQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxZQUFZLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLElBQUksSUFBSSxpRUFBZ0IsRUFBRSxDQUFDO0lBQ3RELENBQUM7SUFFRCxzQkFBSSxxQkFBSTthQUFSO1lBQ08sT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDdkMsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwyQkFBVTthQUFkO1lBQ0MsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztnQkFDdEIsU0FBUyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU8sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTtJQUVELHNCQUFJLHNCQUFLO2FBQVQ7WUFDQyxPQUFPLFVBQUcsSUFBSSxDQUFDLEtBQUssY0FBSSxJQUFJLENBQUMsTUFBTSxjQUFJLElBQUksQ0FBQyxVQUFVLE1BQUcsQ0FBQztRQUMzRCxDQUFDOzs7T0FBQTtJQUVELG9CQUFNLEdBQU4sVUFBTyxHQUFRO1FBQ2QsSUFBSSxHQUFHLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDO1FBRTdCLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU07WUFBRSxPQUFPLEtBQUssQ0FBQztRQUU5QixJQUFJLHNCQUFzQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDO1FBQ3hELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVWLE9BQU8sQ0FBQyxHQUFHLHNCQUFzQixFQUFFO1lBQ2xDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNwRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLHNCQUFzQixFQUFFLENBQUM7YUFDekI7aUJBQU07Z0JBQ04sQ0FBQyxFQUFFLENBQUM7YUFDSjtTQUNEO1FBRUQsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXJCLE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELHNCQUFRLEdBQVIsVUFBUyxHQUFRO1FBQ2hCLElBQUksT0FBTyxHQUFHLElBQUkseUNBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDcEUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FDaEQsT0FBTyxFQUNQLElBQUksQ0FBQyxjQUFjLENBQ25CLENBQUM7UUFDRixPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCwwQkFBWSxHQUFaLFVBQWEsR0FBUTtRQUNwQixPQUFPLENBQ04sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQ3RELENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUN0RCxDQUFDO0lBQ0gsQ0FBQztJQUVELDJCQUFhLEdBQWIsVUFBYyxRQUFRLEVBQUUsUUFBUTtRQUMvQixrREFBa0Q7UUFDbEQsSUFDQyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUs7WUFDekMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTTtZQUMxQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLElBQUksUUFBUSxDQUFDLENBQUMsRUFDekM7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNiO1FBRUQsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwRCxJQUFJLENBQUMsNEJBQTRCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXRELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELHdDQUEwQixHQUExQixVQUEyQixRQUFRLEVBQUUsUUFBUTtRQUM1QyxJQUNDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSztZQUN4QyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFDdkM7WUFDRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbkQ7SUFDRixDQUFDO0lBRUQsb0NBQXNCLEdBQXRCLFVBQXVCLFFBQVEsRUFBRSxRQUFRO1FBQ3hDLElBQUksUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ3pFLElBQUksT0FBTyxnQkFBUSxRQUFRLENBQUUsQ0FBQztZQUM5QixPQUFPLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsQztJQUNGLENBQUM7SUFFRCx1Q0FBeUIsR0FBekIsVUFBMEIsUUFBUSxFQUFFLFFBQVE7UUFDM0MsSUFBSSxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ2hFLElBQUksT0FBTyxnQkFBUSxRQUFRLENBQUUsQ0FBQztZQUM5QixPQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxPQUFPLENBQUMsTUFBTTtnQkFDYixRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNsQztJQUNGLENBQUM7SUFFRCwwQ0FBNEIsR0FBNUIsVUFBNkIsUUFBUSxFQUFFLFFBQVE7UUFDOUMsSUFDQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU07WUFDekMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQ3hDO1lBQ0QsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsd0JBQXdCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0YsQ0FBQztJQUVELHFDQUF1QixHQUF2QixVQUF3QixRQUFRLEVBQUUsUUFBUTtRQUN6QyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRTtZQUN4RSxJQUFJLE9BQU8sZ0JBQVEsUUFBUSxDQUFFLENBQUM7WUFDOUIsT0FBTyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEM7SUFDRixDQUFDO0lBRUQsc0NBQXdCLEdBQXhCLFVBQXlCLFFBQVEsRUFBRSxRQUFRO1FBQzFDLElBQUksUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRTtZQUM5RCxJQUFJLE9BQU8sZ0JBQVEsUUFBUSxDQUFFLENBQUM7WUFDOUIsT0FBTyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7WUFDeEMsT0FBTyxDQUFDLEtBQUs7Z0JBQ1osUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbEM7SUFDRixDQUFDO0lBRUQ7O09BRUc7SUFDSCwyQkFBYSxHQUFiO1FBQ0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUU7WUFDdEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFO2dCQUNyQyxNQUFNO2FBQ047WUFDRCxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRTtnQkFDdEMsSUFDQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNqRTtvQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLENBQUMsRUFBRSxDQUFDO29CQUNKLE1BQU07aUJBQ047Z0JBQ0QsSUFDQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNqRTtvQkFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ2pDO3FCQUFNO29CQUNOLENBQUMsRUFBRSxDQUFDO2lCQUNKO2dCQUNELENBQUMsRUFBRSxDQUFDO2FBQ0o7U0FDRDtJQUNGLENBQUM7SUFFRCwyQkFBYSxHQUFiLFVBQWMsS0FBSyxFQUFFLEtBQUs7UUFDekIsT0FBTyxDQUNOLEtBQUs7WUFDTCxLQUFLO1lBQ0wsS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztZQUNsQixLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLO1lBQzlDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQ2hELENBQUM7SUFDSCxDQUFDO0lBQ0YsVUFBQztBQUFELENBQUM7O0FBRUQ7SUFNRSxzQkFBWSxLQUFLLEVBQUUsTUFBTTtRQUx6QixNQUFDLEdBQUcsQ0FBQztRQUNMLE1BQUMsR0FBRyxDQUFDO1FBQ0wsVUFBSyxHQUFHLElBQUk7UUFDWixXQUFNLEdBQUcsSUFBSTtRQUdYLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU07SUFDdEIsQ0FBQztJQUVILG1CQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN2TUQ7SUFRQyxhQUFZLEtBQVksRUFBRyxNQUFjLEVBQUUsaUJBQXlCO1FBQXpCLDZEQUF5QjtRQVBwRSxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsTUFBQyxHQUFHLENBQUMsQ0FBQztRQUNILE1BQUMsR0FBRyxDQUFDLENBQUM7UUFDTixzQkFBaUIsR0FBRyxLQUFLLENBQUM7UUFDMUIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUdqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztJQUNsRCxDQUFDO0lBQ0YsVUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNYMkI7QUFDVTtBQUl0QztJQUlDLGdCQUFZLElBQVc7UUFIdkIsU0FBSSxHQUFVLEVBQUUsQ0FBQztRQUNqQixrQkFBYSxHQUFVLEVBQUUsQ0FBQztRQUd6QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDO0lBRUQscUJBQUksR0FBSixVQUFvQixLQUFVO1FBQ3ZCLElBQUksV0FBVyxHQUFzQixFQUFFLENBQUM7UUFDeEMsSUFBSSxLQUE2QixDQUFDO1FBRXhDLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxJQUFLLFFBQUMsR0FBRyxDQUFDLE1BQU0sRUFBWCxDQUFXLENBQUMsQ0FBQztRQUMzQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQztZQUFFLE9BQU8sV0FBVyxDQUFDO1FBRTNDLElBQUksS0FBSyxHQUFHLG1EQUFhLENBQUM7UUFDMUIsSUFBSSxLQUFLLEdBQUcsSUFBSSxnREFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDN0MsT0FBTyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRTtZQUNqQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0IsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBUSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUN2RSxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksS0FBSyxFQUFFO2dCQUNoQyxNQUFNO2FBQ047U0FDRDtRQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUc7WUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7UUFDcEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFdBQVcsQ0FBQztJQUNwQixDQUFDO0lBQ0YsYUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDeENEO0lBS0ksZUFBWSxPQUFnQixFQUFFLE9BQWdCO1FBSDlDLFlBQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3hCLFlBQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBR3BCLElBQUksT0FBTyxPQUFPLElBQUksV0FBVztZQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQzFELElBQUksT0FBTyxPQUFPLElBQUksV0FBVztZQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzlELENBQUM7SUFFRDs7T0FFRztJQUNILHVCQUFPLEdBQVA7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELHNCQUFNLEdBQU4sVUFBTyxLQUFLO1FBQ1IsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRUQsdUJBQU8sR0FBUDtRQUNJLE9BQU8sSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDO0lBQzFDLENBQUM7SUFFRCwwQkFBVSxHQUFWLFVBQVcsS0FBSztRQUNaLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxDQUFDO0lBQzFCLENBQUM7SUE1Qk0sYUFBTyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQTZCN0MsWUFBQztDQUFBOytEQTlCb0IsS0FBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDT3NCO0FBRWhEO0lBR0Msb0JBQVksSUFBVyxFQUFFLEtBQVk7UUFBckMsaUJBSUM7UUFORCxZQUFPLEdBQXNCLEVBQUUsQ0FBQztRQUcvQixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztZQUNoQixLQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCwwQkFBSyxHQUFMO1FBQ0MsbUJBQU8sQ0FBQyw2REFBZSxDQUFDLENBQUM7UUFDekIsT0FBTyxDQUFDLEtBQUssQ0FDWixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssSUFBSyxRQUFDO1lBQzVCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUs7WUFDcEIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO1NBQ2xCLENBQUMsRUFIMEIsQ0FHMUIsQ0FBQyxDQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsa0NBQWEsR0FBYixVQUFjLEdBQUcsRUFBRSxLQUFLO1FBQXhCLGlCQU1DO1FBTEEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUc7WUFDakIsSUFBSSxLQUFLLEdBQUcsSUFBSSxxREFBZSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUMxQyxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbEIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsd0NBQW1CLEdBQW5CO1FBQ08sSUFBSSxLQUFzQixDQUFDO1FBQ2pDLElBQUksWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPO2FBQzdCLE1BQU0sQ0FBQyxVQUFDLEtBQUssSUFBSyxZQUFLLENBQUMsR0FBRyxFQUFULENBQVMsQ0FBQzthQUM1QixHQUFHLENBQUMsVUFBQyxLQUFLLElBQUssWUFBSyxDQUFDLEdBQUcsRUFBVCxDQUFTLENBQUMsQ0FBQztRQUV0QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDdkIsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDckQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDOUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUN0QyxPQUFPO2FBQ1A7WUFDRCxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksU0FBUyxHQUFHLFNBQVMsRUFBRTtnQkFDNUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUNkO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ2xDLENBQUM7SUFFRCw0QkFBTyxHQUFQO1FBQ0MsSUFBSSxJQUFJLEdBQTJCLElBQUksQ0FBQztRQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNqQixTQUFTO2FBQ1Q7WUFDRCxJQUFJLElBQUksS0FBSyxJQUFJLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUM5QyxJQUFJLEdBQUcsS0FBSyxDQUFDO2FBQ2I7U0FDRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2IsQ0FBQztJQUVELDhCQUFTLEdBQVQsVUFBVSxHQUFHO1FBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUs7WUFDeEMsT0FBTyxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCwyQkFBTSxHQUFOLFVBQU8sR0FBRztRQUNULElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxtQ0FBYyxHQUFkLFVBQWUsR0FBRztRQUNqQixJQUFJLENBQUMsT0FBTzthQUNWLE1BQU0sQ0FBQyxVQUFDLEtBQUssSUFBSyxZQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsRUFBakIsQ0FBaUIsQ0FBQzthQUNwQyxPQUFPLENBQUMsVUFBQyxLQUFLLElBQUssWUFBSyxDQUFDLFNBQVMsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELGlDQUFZLEdBQVo7UUFDQyxnQ0FBVyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEtBQUssSUFBSyxZQUFLLENBQUMsR0FBRyxFQUFULENBQVMsQ0FBQyxDQUFDLFVBQUU7SUFDN0QsQ0FBQztJQUNGLGlCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNyRkQ7SUFLSSx5QkFBWSxHQUFRLEVBQUUsR0FBUTtRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7UUFDZCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUc7SUFDbEIsQ0FBQztJQUVELG1DQUFTLEdBQVQ7UUFDSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQUVELDZCQUFHLEdBQUg7UUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBQ0wsc0JBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUNwQjRCO0FBRTdCO0lBQUE7SUFpQ0EsQ0FBQztJQWhDQSxxQ0FBc0IsR0FBdEIsVUFBdUIsR0FBUSxFQUFFLFNBQXlCO1FBQTFELGlCQWFDO1FBWkEsSUFBSSxTQUFTLEdBQUcsSUFBSSwyQ0FBSyxFQUFFLENBQUM7UUFDNUIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztRQUN0QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1FBRXhCLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO1lBQzFCLEtBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7Z0JBQzNCLEtBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQzdEO1FBQ0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFNBQVMsQ0FBQztJQUNsQixDQUFDO0lBRUQsNkJBQWMsR0FBZCxVQUFlLFFBQVEsRUFBRSxHQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTO1FBQ2xFLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxTQUFTLElBQUksUUFBUSxDQUFDLE1BQU0sSUFBSSxVQUFVLEVBQUU7WUFDakUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQ2pFLElBQUksS0FBSyxHQUFHLFNBQVMsRUFBRTtnQkFDdEIsR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixHQUFHLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLEdBQUcsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO2dCQUN0QixHQUFHLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztnQkFDeEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDeEI7U0FDRDtJQUNGLENBQUM7SUFFRCw2QkFBYyxHQUFkLFVBQWUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXO1FBQ2hELE1BQU0scUJBQXFCLENBQUM7SUFDN0IsQ0FBQztJQUNGLFdBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7QUNyQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakRZOztBQUVaLGVBQWUsbUJBQU8sQ0FBQyxtREFBVTtBQUNqQyxnQkFBZ0IsbUJBQU8sQ0FBQyx5REFBYTs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHFCQUFxQjtBQUNyQiw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xHMEI7QUFDRzs7QUFFZCwwQkFBMEIsMENBQUk7O0FBRTdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDJDQUFLO0FBQ3BCOztBQUVBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDYjBCO0FBQ0c7O0FBRWQsOEJBQThCLDBDQUFJOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsMkNBQUs7QUFDcEI7O0FBRUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaMEI7QUFDRzs7QUFFZCwrQkFBK0IsMENBQUk7O0FBRWxEO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLDJDQUFLO0FBQ3pCO0FBQ0E7O0FBRUEsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiMEI7QUFDRzs7QUFFZCx5QkFBeUIsMENBQUk7O0FBRTVDO0FBQ0E7QUFDQSxlQUFlLDJDQUFLO0FBQ3BCOztBQUVBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNWdUQ7QUFDUTtBQUNFOzs7Ozs7O1VDRmpFO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsNkNBQTZDLHdEQUF3RCxFOzs7OztXQ0FyRztXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ051QjtBQUNBO0FBQ007QUFDYyIsImZpbGUiOiJCUDJELmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJCaW5QYWNraW5nXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkJpblBhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiQmluUGFja2luZ1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsInZhciBjbG9uZSA9IChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDbG9uZXMgKGNvcGllcykgYW4gT2JqZWN0IHVzaW5nIGRlZXAgY29weWluZy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHN1cHBvcnRzIGNpcmN1bGFyIHJlZmVyZW5jZXMgYnkgZGVmYXVsdCwgYnV0IGlmIHlvdSBhcmUgY2VydGFpblxuICogdGhlcmUgYXJlIG5vIGNpcmN1bGFyIHJlZmVyZW5jZXMgaW4geW91ciBvYmplY3QsIHlvdSBjYW4gc2F2ZSBzb21lIENQVSB0aW1lXG4gKiBieSBjYWxsaW5nIGNsb25lKG9iaiwgZmFsc2UpLlxuICpcbiAqIENhdXRpb246IGlmIGBjaXJjdWxhcmAgaXMgZmFsc2UgYW5kIGBwYXJlbnRgIGNvbnRhaW5zIGNpcmN1bGFyIHJlZmVyZW5jZXMsXG4gKiB5b3VyIHByb2dyYW0gbWF5IGVudGVyIGFuIGluZmluaXRlIGxvb3AgYW5kIGNyYXNoLlxuICpcbiAqIEBwYXJhbSBgcGFyZW50YCAtIHRoZSBvYmplY3QgdG8gYmUgY2xvbmVkXG4gKiBAcGFyYW0gYGNpcmN1bGFyYCAtIHNldCB0byB0cnVlIGlmIHRoZSBvYmplY3QgdG8gYmUgY2xvbmVkIG1heSBjb250YWluXG4gKiAgICBjaXJjdWxhciByZWZlcmVuY2VzLiAob3B0aW9uYWwgLSB0cnVlIGJ5IGRlZmF1bHQpXG4gKiBAcGFyYW0gYGRlcHRoYCAtIHNldCB0byBhIG51bWJlciBpZiB0aGUgb2JqZWN0IGlzIG9ubHkgdG8gYmUgY2xvbmVkIHRvXG4gKiAgICBhIHBhcnRpY3VsYXIgZGVwdGguIChvcHRpb25hbCAtIGRlZmF1bHRzIHRvIEluZmluaXR5KVxuICogQHBhcmFtIGBwcm90b3R5cGVgIC0gc2V0cyB0aGUgcHJvdG90eXBlIHRvIGJlIHVzZWQgd2hlbiBjbG9uaW5nIGFuIG9iamVjdC5cbiAqICAgIChvcHRpb25hbCAtIGRlZmF1bHRzIHRvIHBhcmVudCBwcm90b3R5cGUpLlxuKi9cbmZ1bmN0aW9uIGNsb25lKHBhcmVudCwgY2lyY3VsYXIsIGRlcHRoLCBwcm90b3R5cGUpIHtcbiAgdmFyIGZpbHRlcjtcbiAgaWYgKHR5cGVvZiBjaXJjdWxhciA9PT0gJ29iamVjdCcpIHtcbiAgICBkZXB0aCA9IGNpcmN1bGFyLmRlcHRoO1xuICAgIHByb3RvdHlwZSA9IGNpcmN1bGFyLnByb3RvdHlwZTtcbiAgICBmaWx0ZXIgPSBjaXJjdWxhci5maWx0ZXI7XG4gICAgY2lyY3VsYXIgPSBjaXJjdWxhci5jaXJjdWxhclxuICB9XG4gIC8vIG1haW50YWluIHR3byBhcnJheXMgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMsIHdoZXJlIGNvcnJlc3BvbmRpbmcgcGFyZW50c1xuICAvLyBhbmQgY2hpbGRyZW4gaGF2ZSB0aGUgc2FtZSBpbmRleFxuICB2YXIgYWxsUGFyZW50cyA9IFtdO1xuICB2YXIgYWxsQ2hpbGRyZW4gPSBbXTtcblxuICB2YXIgdXNlQnVmZmVyID0gdHlwZW9mIEJ1ZmZlciAhPSAndW5kZWZpbmVkJztcblxuICBpZiAodHlwZW9mIGNpcmN1bGFyID09ICd1bmRlZmluZWQnKVxuICAgIGNpcmN1bGFyID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGRlcHRoID09ICd1bmRlZmluZWQnKVxuICAgIGRlcHRoID0gSW5maW5pdHk7XG5cbiAgLy8gcmVjdXJzZSB0aGlzIGZ1bmN0aW9uIHNvIHdlIGRvbid0IHJlc2V0IGFsbFBhcmVudHMgYW5kIGFsbENoaWxkcmVuXG4gIGZ1bmN0aW9uIF9jbG9uZShwYXJlbnQsIGRlcHRoKSB7XG4gICAgLy8gY2xvbmluZyBudWxsIGFsd2F5cyByZXR1cm5zIG51bGxcbiAgICBpZiAocGFyZW50ID09PSBudWxsKVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoZGVwdGggPT0gMClcbiAgICAgIHJldHVybiBwYXJlbnQ7XG5cbiAgICB2YXIgY2hpbGQ7XG4gICAgdmFyIHByb3RvO1xuICAgIGlmICh0eXBlb2YgcGFyZW50ICE9ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gcGFyZW50O1xuICAgIH1cblxuICAgIGlmIChjbG9uZS5fX2lzQXJyYXkocGFyZW50KSkge1xuICAgICAgY2hpbGQgPSBbXTtcbiAgICB9IGVsc2UgaWYgKGNsb25lLl9faXNSZWdFeHAocGFyZW50KSkge1xuICAgICAgY2hpbGQgPSBuZXcgUmVnRXhwKHBhcmVudC5zb3VyY2UsIF9fZ2V0UmVnRXhwRmxhZ3MocGFyZW50KSk7XG4gICAgICBpZiAocGFyZW50Lmxhc3RJbmRleCkgY2hpbGQubGFzdEluZGV4ID0gcGFyZW50Lmxhc3RJbmRleDtcbiAgICB9IGVsc2UgaWYgKGNsb25lLl9faXNEYXRlKHBhcmVudCkpIHtcbiAgICAgIGNoaWxkID0gbmV3IERhdGUocGFyZW50LmdldFRpbWUoKSk7XG4gICAgfSBlbHNlIGlmICh1c2VCdWZmZXIgJiYgQnVmZmVyLmlzQnVmZmVyKHBhcmVudCkpIHtcbiAgICAgIGlmIChCdWZmZXIuYWxsb2NVbnNhZmUpIHtcbiAgICAgICAgLy8gTm9kZS5qcyA+PSA0LjUuMFxuICAgICAgICBjaGlsZCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShwYXJlbnQubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE9sZGVyIE5vZGUuanMgdmVyc2lvbnNcbiAgICAgICAgY2hpbGQgPSBuZXcgQnVmZmVyKHBhcmVudC5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgcGFyZW50LmNvcHkoY2hpbGQpO1xuICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHByb3RvdHlwZSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwYXJlbnQpO1xuICAgICAgICBjaGlsZCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNoaWxkID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuICAgICAgICBwcm90byA9IHByb3RvdHlwZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2lyY3VsYXIpIHtcbiAgICAgIHZhciBpbmRleCA9IGFsbFBhcmVudHMuaW5kZXhPZihwYXJlbnQpO1xuXG4gICAgICBpZiAoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGFsbENoaWxkcmVuW2luZGV4XTtcbiAgICAgIH1cbiAgICAgIGFsbFBhcmVudHMucHVzaChwYXJlbnQpO1xuICAgICAgYWxsQ2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSBpbiBwYXJlbnQpIHtcbiAgICAgIHZhciBhdHRycztcbiAgICAgIGlmIChwcm90bykge1xuICAgICAgICBhdHRycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0cnMgJiYgYXR0cnMuc2V0ID09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjaGlsZFtpXSA9IF9jbG9uZShwYXJlbnRbaV0sIGRlcHRoIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9XG5cbiAgcmV0dXJuIF9jbG9uZShwYXJlbnQsIGRlcHRoKTtcbn1cblxuLyoqXG4gKiBTaW1wbGUgZmxhdCBjbG9uZSB1c2luZyBwcm90b3R5cGUsIGFjY2VwdHMgb25seSBvYmplY3RzLCB1c2VmdWxsIGZvciBwcm9wZXJ0eVxuICogb3ZlcnJpZGUgb24gRkxBVCBjb25maWd1cmF0aW9uIG9iamVjdCAobm8gbmVzdGVkIHByb3BzKS5cbiAqXG4gKiBVU0UgV0lUSCBDQVVUSU9OISBUaGlzIG1heSBub3QgYmVoYXZlIGFzIHlvdSB3aXNoIGlmIHlvdSBkbyBub3Qga25vdyBob3cgdGhpc1xuICogd29ya3MuXG4gKi9cbmNsb25lLmNsb25lUHJvdG90eXBlID0gZnVuY3Rpb24gY2xvbmVQcm90b3R5cGUocGFyZW50KSB7XG4gIGlmIChwYXJlbnQgPT09IG51bGwpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgdmFyIGMgPSBmdW5jdGlvbiAoKSB7fTtcbiAgYy5wcm90b3R5cGUgPSBwYXJlbnQ7XG4gIHJldHVybiBuZXcgYygpO1xufTtcblxuLy8gcHJpdmF0ZSB1dGlsaXR5IGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBfX29ialRvU3RyKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn07XG5jbG9uZS5fX29ialRvU3RyID0gX19vYmpUb1N0cjtcblxuZnVuY3Rpb24gX19pc0RhdGUobykge1xuICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIF9fb2JqVG9TdHIobykgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5jbG9uZS5fX2lzRGF0ZSA9IF9faXNEYXRlO1xuXG5mdW5jdGlvbiBfX2lzQXJyYXkobykge1xuICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIF9fb2JqVG9TdHIobykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuY2xvbmUuX19pc0FycmF5ID0gX19pc0FycmF5O1xuXG5mdW5jdGlvbiBfX2lzUmVnRXhwKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBfX29ialRvU3RyKG8pID09PSAnW29iamVjdCBSZWdFeHBdJztcbn07XG5jbG9uZS5fX2lzUmVnRXhwID0gX19pc1JlZ0V4cDtcblxuZnVuY3Rpb24gX19nZXRSZWdFeHBGbGFncyhyZSkge1xuICB2YXIgZmxhZ3MgPSAnJztcbiAgaWYgKHJlLmdsb2JhbCkgZmxhZ3MgKz0gJ2cnO1xuICBpZiAocmUuaWdub3JlQ2FzZSkgZmxhZ3MgKz0gJ2knO1xuICBpZiAocmUubXVsdGlsaW5lKSBmbGFncyArPSAnbSc7XG4gIHJldHVybiBmbGFncztcbn07XG5jbG9uZS5fX2dldFJlZ0V4cEZsYWdzID0gX19nZXRSZWdFeHBGbGFncztcblxucmV0dXJuIGNsb25lO1xufSkoKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG59XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gc2V0dXBDb25zb2xlVGFibGUoKSB7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdXZWlyZCwgY29uc29sZSBvYmplY3QgaXMgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uc29sZS50YWJsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gaWYgaXQgaXMgbm90IE9VUiBmdW5jdGlvbiwgb3ZlcndyaXRlIGl0XG4gICAgICBpZiAoY29uc29sZS50YWJsZSA9PT0gY29uc29sZVRhYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1R5cGUodCwgeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSB0O1xuICAgIH1cblxuICAgIHZhciBpc1N0cmluZyA9IGlzVHlwZS5iaW5kKG51bGwsICdzdHJpbmcnKTtcblxuICAgIGZ1bmN0aW9uIGlzQXJyYXlPZihpc1R5cGVGbiwgYSkge1xuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgJiZcbiAgICAgICAgYS5ldmVyeShpc1R5cGVGbik7XG4gICAgfVxuXG4gICAgdmFyIGlzQXJyYXlPZlN0cmluZ3MgPSBpc0FycmF5T2YuYmluZChudWxsLCBpc1N0cmluZyk7XG4gICAgdmFyIGlzQXJyYXlPZkFycmF5cyA9IGlzQXJyYXlPZi5iaW5kKG51bGwsIEFycmF5LmlzQXJyYXkpO1xuXG4gICAgdmFyIFRhYmxlID0gcmVxdWlyZSgnZWFzeS10YWJsZScpO1xuXG4gICAgZnVuY3Rpb24gYXJyYXlUb1N0cmluZyhhcnIpIHtcbiAgICAgIHZhciB0ID0gbmV3IFRhYmxlKCk7XG4gICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAocmVjb3JkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVjb3JkID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgIHR5cGVvZiByZWNvcmQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdC5jZWxsKCdpdGVtJywgcmVjb3JkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBhc3N1bWUgcGxhaW4gb2JqZWN0XG4gICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdC5jZWxsKHByb3BlcnR5LCByZWNvcmRbcHJvcGVydHldKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0Lm5ld1JvdygpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByaW50VGFibGVXaXRoQ29sdW1uVGl0bGVzKHRpdGxlcywgaXRlbXMsbm9Db25zb2xlKSB7XG4gICAgICB2YXIgdCA9IG5ldyBUYWJsZSgpO1xuICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpdGVtLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrKSB7XG4gICAgICAgICAgdC5jZWxsKHRpdGxlc1trXSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdC5uZXdSb3coKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHN0ciA9IHQudG9TdHJpbmcoKTtcblxuICAgICAgcmV0dXJuIG5vQ29uc29sZSA/IHN0ciA6IGNvbnNvbGUubG9nKHN0cik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJpbnRUaXRsZVRhYmxlKHRpdGxlLCBhcnIpIHtcbiAgICAgIHZhciBzdHIgPSBhcnJheVRvU3RyaW5nKGFycik7XG4gICAgICB2YXIgcm93TGVuZ3RoID0gc3RyLmluZGV4T2YoJ1xcbicpO1xuICAgICAgaWYgKHJvd0xlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRpdGxlLmxlbmd0aCA+IHJvd0xlbmd0aCkge1xuICAgICAgICAgIHJvd0xlbmd0aCA9IHRpdGxlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgIHZhciBzZXAgPSAnLScsIGssIGxpbmUgPSAnJztcbiAgICAgICAgZm9yIChrID0gMDsgayA8IHJvd0xlbmd0aDsgayArPSAxKSB7XG4gICAgICAgICAgbGluZSArPSBzZXA7XG4gICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhsaW5lKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKHN0cik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGl0bGVUYWJsZSh0aXRsZSwgYXJyKSB7XG4gICAgICB2YXIgc3RyID0gYXJyYXlUb1N0cmluZyhhcnIpO1xuICAgICAgdmFyIHJvd0xlbmd0aCA9IHN0ci5pbmRleE9mKCdcXG4nKTtcbiAgICAgIHZhciBzdHJUb1JldHVybiA9ICcnO1xuICAgICAgaWYgKHJvd0xlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRpdGxlLmxlbmd0aCA+IHJvd0xlbmd0aCkge1xuICAgICAgICAgIHJvd0xlbmd0aCA9IHRpdGxlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3RyVG9SZXR1cm4gKz0gdGl0bGUgKyAnXFxuJztcbiAgICAgICAgdmFyIHNlcCA9ICctJywgaywgbGluZSA9ICcnO1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcm93TGVuZ3RoOyBrICs9IDEpIHtcbiAgICAgICAgICBsaW5lICs9IHNlcDtcbiAgICAgICAgfVxuXHRcbiAgICAgICAgc3RyVG9SZXR1cm4gKz0gbGluZSArICdcXG4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyVG9SZXR1cm4gKyBzdHI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2JqZWN0VG9BcnJheShvYmopIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIHJldHVybiBrZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IG9ialtrZXldXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvYmopIHtcbiAgICAgIHJldHVybiBhcnJheVRvU3RyaW5nKG9iamVjdFRvQXJyYXkob2JqKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc29sZVRhYmxlICgpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmXG4gICAgICAgIHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJyAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KGFyZ3NbMV0pKSB7XG5cbiAgICAgICAgcmV0dXJuIHByaW50VGl0bGVUYWJsZShhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmXG4gICAgICAgIGlzQXJyYXlPZlN0cmluZ3MoYXJnc1swXSkgJiZcbiAgICAgICAgaXNBcnJheU9mQXJyYXlzKGFyZ3NbMV0pKSB7XG4gICAgICAgIHJldHVybiBwcmludFRhYmxlV2l0aENvbHVtblRpdGxlcyhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIH1cblxuICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coayk7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShrKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFycmF5VG9TdHJpbmcoaykpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBrID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKG9iamVjdFRvU3RyaW5nKGspKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMuZ2V0VGFibGUgPSBmdW5jdGlvbigpe1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICB2YXIgc3RyVG9SZXR1cm4gPSAnJztcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmXG4gICAgICAgIHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJyAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KGFyZ3NbMV0pKSB7XG5cbiAgICAgICAgcmV0dXJuIGdldFRpdGxlVGFibGUoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBpc0FycmF5T2ZTdHJpbmdzKGFyZ3NbMF0pICYmXG4gICAgICAgIGlzQXJyYXlPZkFycmF5cyhhcmdzWzFdKSkge1xuICAgICAgICByZXR1cm4gcHJpbnRUYWJsZVdpdGhDb2x1bW5UaXRsZXMoYXJnc1swXSwgYXJnc1sxXSx0cnVlKTtcbiAgICAgIH1cblxuICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChrLGkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHN0clRvUmV0dXJuICs9IGs7XG5cdCAgaWYgKGkgIT09IGFyZ3MubGVuZ3RoIC0gMSl7XG5cdCAgICBzdHJUb1JldHVybiArPSAnXFxuJztcblx0ICB9XG4gICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGspKSB7XG4gICAgICAgICAgc3RyVG9SZXR1cm4gKz0gYXJyYXlUb1N0cmluZyhrKSArICdcXG4nO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBrID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHN0clRvUmV0dXJuICs9IG9iamVjdFRvU3RyaW5nKGspO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHN0clRvUmV0dXJuO1xuICAgIH07XG5cbiAgICBjb25zb2xlLnRhYmxlID0gY29uc29sZVRhYmxlO1xuICB9XG5cbiAgc2V0dXBDb25zb2xlVGFibGUoKTtcbn0oKSk7XG4iLCJ2YXIgY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1trZXldID09PSAndW5kZWZpbmVkJykge1xuICAgICAgb3B0aW9uc1trZXldID0gY2xvbmUoZGVmYXVsdHNba2V5XSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gb3B0aW9ucztcbn07IiwidmFyIHdjd2lkdGhcblxudHJ5IHtcbiAgd2N3aWR0aCA9IHJlcXVpcmUoJ3djd2lkdGgnKVxufSBjYXRjaChlKSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlXG5cbmZ1bmN0aW9uIFRhYmxlKCkge1xuICB0aGlzLnJvd3MgPSBbXVxuICB0aGlzLnJvdyA9IHtfX3ByaW50ZXJzIDoge319XG59XG5cbi8qKlxuICogUHVzaCB0aGUgY3VycmVudCByb3cgdG8gdGhlIHRhYmxlIGFuZCBzdGFydCBhIG5ldyBvbmVcbiAqXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5uZXdSb3cgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yb3dzLnB1c2godGhpcy5yb3cpXG4gIHRoaXMucm93ID0ge19fcHJpbnRlcnMgOiB7fX1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBXcml0ZSBjZWxsIGluIHRoZSBjdXJyZW50IHJvd1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2wgICAgICAgICAgLSBDb2x1bW4gbmFtZVxuICogQHBhcmFtIHtBbnl9IHZhbCAgICAgICAgICAgICAtIENlbGwgdmFsdWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcmludGVyXSAgLSBQcmludGVyIGZ1bmN0aW9uIHRvIGZvcm1hdCB0aGUgdmFsdWVcbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLmNlbGwgPSBmdW5jdGlvbihjb2wsIHZhbCwgcHJpbnRlcikge1xuICB0aGlzLnJvd1tjb2xdID0gdmFsXG4gIHRoaXMucm93Ll9fcHJpbnRlcnNbY29sXSA9IHByaW50ZXIgfHwgc3RyaW5nXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogU3RyaW5nIHRvIHNlcGFyYXRlIGNvbHVtbnNcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuc2VwYXJhdG9yID0gJyAgJ1xuXG5mdW5jdGlvbiBzdHJpbmcodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/ICcnIDogJycrdmFsXG59XG5cbmZ1bmN0aW9uIGxlbmd0aChzdHIpIHtcbiAgdmFyIHMgPSBzdHIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZCttL2csICcnKVxuICByZXR1cm4gd2N3aWR0aCA9PSBudWxsID8gcy5sZW5ndGggOiB3Y3dpZHRoKHMpXG59XG5cbi8qKlxuICogRGVmYXVsdCBwcmludGVyXG4gKi9cblxuVGFibGUuc3RyaW5nID0gc3RyaW5nXG5cbi8qKlxuICogQ3JlYXRlIGEgcHJpbnRlciB3aGljaCByaWdodCBhbGlnbnMgdGhlIGNvbnRlbnQgYnkgcGFkZGluZyB3aXRoIGBjaGAgb24gdGhlIGxlZnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2hcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuXG5UYWJsZS5sZWZ0UGFkZGVyID0gbGVmdFBhZGRlclxuXG5mdW5jdGlvbiBsZWZ0UGFkZGVyKGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWwsIHdpZHRoKSB7XG4gICAgdmFyIHN0ciA9IHN0cmluZyh2YWwpXG4gICAgdmFyIGxlbiA9IGxlbmd0aChzdHIpXG4gICAgdmFyIHBhZCA9IHdpZHRoID4gbGVuID8gQXJyYXkod2lkdGggLSBsZW4gKyAxKS5qb2luKGNoKSA6ICcnXG4gICAgcmV0dXJuIHBhZCArIHN0clxuICB9XG59XG5cbi8qKlxuICogUHJpbnRlciB3aGljaCByaWdodCBhbGlnbnMgdGhlIGNvbnRlbnRcbiAqL1xuXG52YXIgcGFkTGVmdCA9IFRhYmxlLnBhZExlZnQgPSBsZWZ0UGFkZGVyKCcgJylcblxuLyoqXG4gKiBDcmVhdGUgYSBwcmludGVyIHdoaWNoIHBhZHMgd2l0aCBgY2hgIG9uIHRoZSByaWdodFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjaFxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5cblRhYmxlLnJpZ2h0UGFkZGVyID0gcmlnaHRQYWRkZXJcblxuZnVuY3Rpb24gcmlnaHRQYWRkZXIoY2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHBhZFJpZ2h0KHZhbCwgd2lkdGgpIHtcbiAgICB2YXIgc3RyID0gc3RyaW5nKHZhbClcbiAgICB2YXIgbGVuID0gbGVuZ3RoKHN0cilcbiAgICB2YXIgcGFkID0gd2lkdGggPiBsZW4gPyBBcnJheSh3aWR0aCAtIGxlbiArIDEpLmpvaW4oY2gpIDogJydcbiAgICByZXR1cm4gc3RyICsgcGFkXG4gIH1cbn1cblxudmFyIHBhZFJpZ2h0ID0gcmlnaHRQYWRkZXIoJyAnKVxuXG4vKipcbiAqIENyZWF0ZSBhIHByaW50ZXIgZm9yIG51bWJlcnNcbiAqXG4gKiBXaWxsIGRvIHJpZ2h0IGFsaWdubWVudCBhbmQgb3B0aW9uYWxseSBmaXggdGhlIG51bWJlciBvZiBkaWdpdHMgYWZ0ZXIgZGVjaW1hbCBwb2ludFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIE51bWJlciBvZiBkaWdpdHMgZm9yIGZpeHBvaW50IG5vdGF0aW9uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cblxuVGFibGUubnVtYmVyID0gZnVuY3Rpb24oZGlnaXRzKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWwsIHdpZHRoKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSByZXR1cm4gJydcbiAgICBpZiAodHlwZW9mIHZhbCAhPSAnbnVtYmVyJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignJyt2YWwgKyAnIGlzIG5vdCBhIG51bWJlcicpXG4gICAgdmFyIHN0ciA9IGRpZ2l0cyA9PSBudWxsID8gdmFsKycnIDogdmFsLnRvRml4ZWQoZGlnaXRzKVxuICAgIHJldHVybiBwYWRMZWZ0KHN0ciwgd2lkdGgpXG4gIH1cbn1cblxuZnVuY3Rpb24gZWFjaChyb3csIGZuKSB7XG4gIGZvcih2YXIga2V5IGluIHJvdykge1xuICAgIGlmIChrZXkgPT0gJ19fcHJpbnRlcnMnKSBjb250aW51ZVxuICAgIGZuKGtleSwgcm93W2tleV0pXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgbGlzdCBvZiBjb2x1bW5zIGluIHByaW50aW5nIG9yZGVyXG4gKlxuICogQHJldHVybnMge3N0cmluZ1tdfVxuICovXG5cblRhYmxlLnByb3RvdHlwZS5jb2x1bW5zID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb2xzID0ge31cbiAgZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKykgeyAvLyBkbyAyIHRpbWVzXG4gICAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgICB2YXIgaWR4ID0gMFxuICAgICAgZWFjaChyb3csIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZHggPSBNYXRoLm1heChpZHgsIGNvbHNba2V5XSB8fCAwKVxuICAgICAgICBjb2xzW2tleV0gPSBpZHhcbiAgICAgICAgaWR4KytcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICByZXR1cm4gT2JqZWN0LmtleXMoY29scykuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGNvbHNbYV0gLSBjb2xzW2JdXG4gIH0pXG59XG5cbi8qKlxuICogRm9ybWF0IGp1c3Qgcm93cywgaS5lLiBwcmludCB0aGUgdGFibGUgd2l0aG91dCBoZWFkZXJzIGFuZCB0b3RhbHNcbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50YWlvbiBvZiB0aGUgdGFibGVcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUucHJpbnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbHMgPSB0aGlzLmNvbHVtbnMoKVxuICB2YXIgc2VwYXJhdG9yID0gdGhpcy5zZXBhcmF0b3JcbiAgdmFyIHdpZHRocyA9IHt9XG4gIHZhciBvdXQgPSAnJ1xuXG4gIC8vIENhbGMgd2lkdGhzXG4gIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgIGVhY2gocm93LCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgdmFyIHN0ciA9IHJvdy5fX3ByaW50ZXJzW2tleV0uY2FsbChyb3csIHZhbClcbiAgICAgIHdpZHRoc1trZXldID0gTWF0aC5tYXgobGVuZ3RoKHN0ciksIHdpZHRoc1trZXldIHx8IDApXG4gICAgfSlcbiAgfSlcblxuICAvLyBOb3cgcHJpbnRcbiAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgdmFyIGxpbmUgPSAnJ1xuICAgIGNvbHMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciB3aWR0aCA9IHdpZHRoc1trZXldXG4gICAgICB2YXIgc3RyID0gcm93Lmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgPyAnJytyb3cuX19wcmludGVyc1trZXldLmNhbGwocm93LCByb3dba2V5XSwgd2lkdGgpXG4gICAgICAgIDogJydcbiAgICAgIGxpbmUgKz0gcGFkUmlnaHQoc3RyLCB3aWR0aCkgKyBzZXBhcmF0b3JcbiAgICB9KVxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKDAsIC1zZXBhcmF0b3IubGVuZ3RoKVxuICAgIG91dCArPSBsaW5lICsgJ1xcbidcbiAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSB0YWJsZVxuICpcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblxuVGFibGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb2xzID0gdGhpcy5jb2x1bW5zKClcbiAgdmFyIG91dCA9IG5ldyBUYWJsZSgpXG5cbiAgLy8gY29weSBvcHRpb25zXG4gIG91dC5zZXBhcmF0b3IgPSB0aGlzLnNlcGFyYXRvclxuXG4gIC8vIFdyaXRlIGhlYWRlclxuICBjb2xzLmZvckVhY2goZnVuY3Rpb24oY29sKSB7XG4gICAgb3V0LmNlbGwoY29sLCBjb2wpXG4gIH0pXG4gIG91dC5uZXdSb3coKVxuICBvdXQucHVzaERlbGltZXRlcihjb2xzKVxuXG4gIC8vIFdyaXRlIGJvZHlcbiAgb3V0LnJvd3MgPSBvdXQucm93cy5jb25jYXQodGhpcy5yb3dzKVxuXG4gIC8vIFRvdGFsc1xuICBpZiAodGhpcy50b3RhbHMgJiYgdGhpcy5yb3dzLmxlbmd0aCkge1xuICAgIG91dC5wdXNoRGVsaW1ldGVyKGNvbHMpXG4gICAgdGhpcy5mb3JFYWNoVG90YWwob3V0LmNlbGwuYmluZChvdXQpKVxuICAgIG91dC5uZXdSb3coKVxuICB9XG5cbiAgcmV0dXJuIG91dC5wcmludCgpXG59XG5cbi8qKlxuICogUHVzaCBkZWxpbWV0ZXIgcm93IHRvIHRoZSB0YWJsZSAod2l0aCBlYWNoIGNlbGwgZmlsbGVkIHdpdGggZGFzaHMgZHVyaW5nIHByaW50aW5nKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nW119IFtjb2xzXVxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUucHVzaERlbGltZXRlciA9IGZ1bmN0aW9uKGNvbHMpIHtcbiAgY29scyA9IGNvbHMgfHwgdGhpcy5jb2x1bW5zKClcbiAgY29scy5mb3JFYWNoKGZ1bmN0aW9uKGNvbCkge1xuICAgIHRoaXMuY2VsbChjb2wsIHVuZGVmaW5lZCwgbGVmdFBhZGRlcignLScpKVxuICB9LCB0aGlzKVxuICByZXR1cm4gdGhpcy5uZXdSb3coKVxufVxuXG4vKipcbiAqIENvbXB1dGUgYWxsIHRvdGFscyBhbmQgeWllbGQgdGhlIHJlc3VsdHMgdG8gYGNiYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBzaWduYXR1cmUgYChjb2x1bW4sIHZhbHVlLCBwcmludGVyKWBcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuZm9yRWFjaFRvdGFsID0gZnVuY3Rpb24oY2IpIHtcbiAgZm9yKHZhciBrZXkgaW4gdGhpcy50b3RhbHMpIHtcbiAgICB2YXIgYWdnciA9IHRoaXMudG90YWxzW2tleV1cbiAgICB2YXIgYWNjID0gYWdnci5pbml0XG4gICAgdmFyIGxlbiA9IHRoaXMucm93cy5sZW5ndGhcbiAgICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3csIGlkeCkge1xuICAgICAgYWNjID0gYWdnci5yZWR1Y2UuY2FsbChyb3csIGFjYywgcm93W2tleV0sIGlkeCwgbGVuKVxuICAgIH0pXG4gICAgY2Ioa2V5LCBhY2MsIGFnZ3IucHJpbnRlcilcbiAgfVxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgdGFibGUgc28gdGhhdCBlYWNoIHJvdyByZXByZXNlbnRzIGNvbHVtbiBhbmQgZWFjaCBjb2x1bW4gcmVwcmVzZW50cyByb3dcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wcy5zZXBhcmF0b3JdIC0gQ29sdW1uIHNlcGFyYXRpb24gc3RyaW5nXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5uYW1lUHJpbnRlcl0gLSBQcmludGVyIHRvIGZvcm1hdCBjb2x1bW4gbmFtZXNcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblxuVGFibGUucHJvdG90eXBlLnByaW50VHJhbnNwb3NlZCA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgdmFyIG91dCA9IG5ldyBUYWJsZVxuICBvdXQuc2VwYXJhdG9yID0gb3B0cy5zZXBhcmF0b3IgfHwgdGhpcy5zZXBhcmF0b3JcbiAgdGhpcy5jb2x1bW5zKCkuZm9yRWFjaChmdW5jdGlvbihjb2wpIHtcbiAgICBvdXQuY2VsbCgwLCBjb2wsIG9wdHMubmFtZVByaW50ZXIpXG4gICAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93LCBpZHgpIHtcbiAgICAgIG91dC5jZWxsKGlkeCsxLCByb3dbY29sXSwgcm93Ll9fcHJpbnRlcnNbY29sXSlcbiAgICB9KVxuICAgIG91dC5uZXdSb3coKVxuICB9LCB0aGlzKVxuICByZXR1cm4gb3V0LnByaW50KClcbn1cblxuLyoqXG4gKiBTb3J0IHRoZSB0YWJsZVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nW119IFtjbXBdIC0gRWl0aGVyIGNvbXBhcmUgZnVuY3Rpb24gb3IgYSBsaXN0IG9mIGNvbHVtbnMgdG8gc29ydCBvblxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNtcCkge1xuICBpZiAodHlwZW9mIGNtcCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5yb3dzLnNvcnQoY21wKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICB2YXIga2V5cyA9IEFycmF5LmlzQXJyYXkoY21wKSA/IGNtcCA6IHRoaXMuY29sdW1ucygpXG5cbiAgdmFyIGNvbXBhcmF0b3JzID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIG9yZGVyID0gJ2FzYydcbiAgICB2YXIgbSA9IC8oLiopXFx8XFxzKihhc2N8ZGVzKVxccyokLy5leGVjKGtleSlcbiAgICBpZiAobSkge1xuICAgICAga2V5ID0gbVsxXVxuICAgICAgb3JkZXIgPSBtWzJdXG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIG9yZGVyID09ICdhc2MnXG4gICAgICAgID8gY29tcGFyZShhW2tleV0sIGJba2V5XSlcbiAgICAgICAgOiBjb21wYXJlKGJba2V5XSwgYVtrZXldKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gdGhpcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBhcmF0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb3JkZXIgPSBjb21wYXJhdG9yc1tpXShhLCBiKVxuICAgICAgaWYgKG9yZGVyICE9IDApIHJldHVybiBvcmRlclxuICAgIH1cbiAgICByZXR1cm4gMFxuICB9KVxufVxuXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG4gIGlmIChhID09PSB1bmRlZmluZWQpIHJldHVybiAxXG4gIGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiAtMVxuICBpZiAoYSA9PT0gbnVsbCkgcmV0dXJuIDFcbiAgaWYgKGIgPT09IG51bGwpIHJldHVybiAtMVxuICBpZiAoYSA+IGIpIHJldHVybiAxXG4gIGlmIChhIDwgYikgcmV0dXJuIC0xXG4gIHJldHVybiBjb21wYXJlKFN0cmluZyhhKSwgU3RyaW5nKGIpKVxufVxuXG4vKipcbiAqIEFkZCBhIHRvdGFsIGZvciB0aGUgY29sdW1uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbCAtIGNvbHVtbiBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5yZWR1Y2UgPSBzdW1dIC0gcmVkdWNlKGFjYywgdmFsLCBpZHgsIGxlbmd0aCkgZnVuY3Rpb24gdG8gY29tcHV0ZSB0aGUgdG90YWwgdmFsdWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnByaW50ZXIgPSBwYWRMZWZ0XSAtIFByaW50ZXIgdG8gZm9ybWF0IHRoZSB0b3RhbCBjZWxsXG4gKiBAcGFyYW0ge0FueX0gW29wdHMuaW5pdCA9IDBdIC0gSW5pdGlhbCB2YWx1ZSBmb3IgcmVkdWN0aW9uXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS50b3RhbCA9IGZ1bmN0aW9uKGNvbCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuICB0aGlzLnRvdGFscyA9IHRoaXMudG90YWxzIHx8IHt9XG4gIHRoaXMudG90YWxzW2NvbF0gPSB7XG4gICAgcmVkdWNlOiBvcHRzLnJlZHVjZSB8fCBUYWJsZS5hZ2dyLnN1bSxcbiAgICBwcmludGVyOiBvcHRzLnByaW50ZXIgfHwgcGFkTGVmdCxcbiAgICBpbml0OiBvcHRzLmluaXQgPT0gbnVsbCA/IDAgOiBvcHRzLmluaXRcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFByZWRlZmluZWQgaGVscGVycyBmb3IgdG90YWxzXG4gKi9cblxuVGFibGUuYWdnciA9IHt9XG5cbi8qKlxuICogQ3JlYXRlIGEgcHJpbnRlciB3aGljaCBmb3JtYXRzIHRoZSB2YWx1ZSB3aXRoIGBwcmludGVyYCxcbiAqIGFkZHMgdGhlIGBwcmVmaXhgIHRvIGl0IGFuZCByaWdodCBhbGlnbnMgdGhlIHdob2xlIHRoaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJpbnRlclxuICogQHJldHVybnMge3ByaW50ZXJ9XG4gKi9cblxuVGFibGUuYWdnci5wcmludGVyID0gZnVuY3Rpb24ocHJlZml4LCBwcmludGVyKSB7XG4gIHByaW50ZXIgPSBwcmludGVyIHx8IHN0cmluZ1xuICByZXR1cm4gZnVuY3Rpb24odmFsLCB3aWR0aCkge1xuICAgIHJldHVybiBwYWRMZWZ0KHByZWZpeCArIHByaW50ZXIodmFsKSwgd2lkdGgpXG4gIH1cbn1cblxuLyoqXG4gKiBTdW0gcmVkdWN0aW9uXG4gKi9cblxuVGFibGUuYWdnci5zdW0gPSBmdW5jdGlvbihhY2MsIHZhbCkge1xuICByZXR1cm4gYWNjICsgdmFsXG59XG5cbi8qKlxuICogQXZlcmFnZSByZWR1Y3Rpb25cbiAqL1xuXG5UYWJsZS5hZ2dyLmF2ZyA9IGZ1bmN0aW9uKGFjYywgdmFsLCBpZHgsIGxlbikge1xuICBhY2MgPSBhY2MgKyB2YWxcbiAgcmV0dXJuIGlkeCArIDEgPT0gbGVuID8gYWNjL2xlbiA6IGFjY1xufVxuXG4vKipcbiAqIFByaW50IHRoZSBhcnJheSBvciBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqIC0gT2JqZWN0IHRvIHByaW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW2Zvcm1hdF0gLSBGb3JtYXQgb3B0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXSAtIFRhYmxlIHBvc3QgcHJvY2Vzc2luZyBhbmQgZm9ybWF0aW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5cblRhYmxlLnByaW50ID0gZnVuY3Rpb24ob2JqLCBmb3JtYXQsIGNiKSB7XG4gIHZhciBvcHRzID0gZm9ybWF0IHx8IHt9XG5cbiAgZm9ybWF0ID0gdHlwZW9mIGZvcm1hdCA9PSAnZnVuY3Rpb24nXG4gICAgPyBmb3JtYXRcbiAgICA6IGZ1bmN0aW9uKG9iaiwgY2VsbCkge1xuICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlXG4gICAgICAgIHZhciBwYXJhbXMgPSBvcHRzW2tleV0gfHwge31cbiAgICAgICAgY2VsbChwYXJhbXMubmFtZSB8fCBrZXksIG9ialtrZXldLCBwYXJhbXMucHJpbnRlcilcbiAgICAgIH1cbiAgICB9XG5cbiAgdmFyIHQgPSBuZXcgVGFibGVcbiAgdmFyIGNlbGwgPSB0LmNlbGwuYmluZCh0KVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBjYiA9IGNiIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQudG9TdHJpbmcoKSB9XG4gICAgb2JqLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgZm9ybWF0KGl0ZW0sIGNlbGwpXG4gICAgICB0Lm5ld1JvdygpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBjYiA9IGNiIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQucHJpbnRUcmFuc3Bvc2VkKHtzZXBhcmF0b3I6ICcgOiAnfSkgfVxuICAgIGZvcm1hdChvYmosIGNlbGwpXG4gICAgdC5uZXdSb3coKVxuICB9XG5cbiAgcmV0dXJuIGNiKHQpXG59XG5cbi8qKlxuICogU2FtZSBhcyBgVGFibGUucHJpbnQoKWAgYnV0IHlpZWxkcyB0aGUgcmVzdWx0IHRvIGBjb25zb2xlLmxvZygpYFxuICovXG5cblRhYmxlLmxvZyA9IGZ1bmN0aW9uKG9iaiwgZm9ybWF0LCBjYikge1xuICBjb25zb2xlLmxvZyhUYWJsZS5wcmludChvYmosIGZvcm1hdCwgY2IpKVxufVxuXG4vKipcbiAqIFNhbWUgYXMgYC50b1N0cmluZygpYCBidXQgeWllbGRzIHRoZSByZXN1bHQgdG8gYGNvbnNvbGUubG9nKClgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyh0aGlzLnRvU3RyaW5nKCkpXG59XG4iLCJpbXBvcnQgQmVzdFNob3J0U2lkZUZpdCBmcm9tICcuL2hldXJpc3RpY3MvQmVzdFNob3J0U2lkZUZpdCc7XG5pbXBvcnQgQm94IGZyb20gJy4vQm94JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmluIHtcblx0d2lkdGg6IG51bWJlciA9IDA7XG5cdGhlaWdodDogbnVtYmVyPSAwO1xuXHRib3hlczogQm94W10gPSBbXTtcblx0aGV1cmlzdGljOiBhbnkgPSBudWxsO1xuXHRmcmVlUmVjdGFuZ2xlczogRnJlZVNwYWNlQm94W10gPSBbXTtcblxuXHRjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgaGV1cmlzdGljKSB7XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMgPSBbbmV3IEZyZWVTcGFjZUJveCh3aWR0aCwgaGVpZ2h0KV07XG5cdFx0dGhpcy5oZXVyaXN0aWMgPSBoZXVyaXN0aWMgfHwgbmV3IEJlc3RTaG9ydFNpZGVGaXQoKTtcblx0fVxuXG5cdGdldCBhcmVhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0O1xuXHR9XG5cblx0Z2V0IGVmZmljaWVuY3koKSB7XG5cdFx0bGV0IGJveGVzQXJlYSA9IDA7XG5cdFx0dGhpcy5ib3hlcy5mb3JFYWNoKChib3gpID0+IHtcblx0XHRcdGJveGVzQXJlYSArPSBib3gud2lkdGggKiBib3guaGVpZ2h0O1xuXHRcdH0pO1xuXHRcdHJldHVybiAoYm94ZXNBcmVhICogMTAwKSAvIHRoaXMuYXJlYTtcblx0fVxuXG5cdGdldCBsYWJlbCgpIHtcblx0XHRyZXR1cm4gYCR7dGhpcy53aWR0aH14JHt0aGlzLmhlaWdodH0gJHt0aGlzLmVmZmljaWVuY3l9JWA7XG5cdH1cblxuXHRpbnNlcnQoYm94OiBCb3gpIHtcblx0XHRpZiAoYm94LnBhY2tlZCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0dGhpcy5oZXVyaXN0aWMuZmluZFBvc2l0aW9uRm9yTmV3Tm9kZShib3gsIHRoaXMuZnJlZVJlY3RhbmdsZXMpO1xuXHRcdGlmICghYm94LnBhY2tlZCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0bGV0IG51bVJlY3RhbmdsZXNUb1Byb2Nlc3MgPSB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aDtcblx0XHRsZXQgaSA9IDA7XG5cblx0XHR3aGlsZSAoaSA8IG51bVJlY3RhbmdsZXNUb1Byb2Nlc3MpIHtcblx0XHRcdGlmICh0aGlzLnNwbGl0RnJlZU5vZGUodGhpcy5mcmVlUmVjdGFuZ2xlc1tpXSwgYm94KSkge1xuXHRcdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0bnVtUmVjdGFuZ2xlc1RvUHJvY2Vzcy0tO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aSsrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMucHJ1bmVGcmVlTGlzdCgpO1xuXHRcdHRoaXMuYm94ZXMucHVzaChib3gpO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRzY29yZUZvcihib3g6IEJveCkge1xuXHRcdGxldCBjb3B5Qm94ID0gbmV3IEJveChib3gud2lkdGgsIGJveC5oZWlnaHQsIGJveC5jb25zdHJhaW5Sb3RhdGlvbik7XG5cdFx0bGV0IHNjb3JlID0gdGhpcy5oZXVyaXN0aWMuZmluZFBvc2l0aW9uRm9yTmV3Tm9kZShcblx0XHRcdGNvcHlCb3gsXG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzXG5cdFx0KTtcblx0XHRyZXR1cm4gc2NvcmU7XG5cdH1cblxuXHRpc0xhcmdlclRoYW4oYm94OiBCb3gpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0KHRoaXMud2lkdGggPj0gYm94LndpZHRoICYmIHRoaXMuaGVpZ2h0ID49IGJveC5oZWlnaHQpIHx8XG5cdFx0XHQodGhpcy5oZWlnaHQgPj0gYm94LndpZHRoICYmIHRoaXMud2lkdGggPj0gYm94LmhlaWdodClcblx0XHQpO1xuXHR9XG5cblx0c3BsaXRGcmVlTm9kZShmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHQvLyBUZXN0IHdpdGggU0FUIGlmIHRoZSByZWN0YW5nbGVzIGV2ZW4gaW50ZXJzZWN0LlxuXHRcdGlmIChcblx0XHRcdHVzZWROb2RlLnggPj0gZnJlZU5vZGUueCArIGZyZWVOb2RlLndpZHRoIHx8XG5cdFx0XHR1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGggPD0gZnJlZU5vZGUueCB8fFxuXHRcdFx0dXNlZE5vZGUueSA+PSBmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0IHx8XG5cdFx0XHR1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0IDw9IGZyZWVOb2RlLnlcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLnRyeVNwbGl0RnJlZU5vZGVWZXJ0aWNhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0dGhpcy50cnlTcGxpdEZyZWVOb2RlSG9yaXpvbnRhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHRyeVNwbGl0RnJlZU5vZGVWZXJ0aWNhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmIChcblx0XHRcdHVzZWROb2RlLnggPCBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGggJiZcblx0XHRcdHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCA+IGZyZWVOb2RlLnhcblx0XHQpIHtcblx0XHRcdHRoaXMudHJ5TGVhdmVGcmVlU3BhY2VBdFRvcChmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZUF0Qm90dG9tKGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VBdFRvcChmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAodXNlZE5vZGUueSA+IGZyZWVOb2RlLnkgJiYgdXNlZE5vZGUueSA8IGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS5oZWlnaHQgPSB1c2VkTm9kZS55IC0gbmV3Tm9kZS55O1xuXHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ld05vZGUpO1xuXHRcdH1cblx0fVxuXG5cdHRyeUxlYXZlRnJlZVNwYWNlQXRCb3R0b20oZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQgPCBmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0KSB7XG5cdFx0XHRsZXQgbmV3Tm9kZSA9IHsgLi4uZnJlZU5vZGUgfTtcblx0XHRcdG5ld05vZGUueSA9IHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQ7XG5cdFx0XHRuZXdOb2RlLmhlaWdodCA9XG5cdFx0XHRcdGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQgLSAodXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodCk7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5U3BsaXRGcmVlTm9kZUhvcml6b250YWxseShmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAoXG5cdFx0XHR1c2VkTm9kZS55IDwgZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCAmJlxuXHRcdFx0dXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodCA+IGZyZWVOb2RlLnlcblx0XHQpIHtcblx0XHRcdHRoaXMudHJ5TGVhdmVGcmVlU3BhY2VPbkxlZnQoZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHRcdHRoaXMudHJ5TGVhdmVGcmVlU3BhY2VPblJpZ2h0KGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VPbkxlZnQoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKHVzZWROb2RlLnggPiBmcmVlTm9kZS54ICYmIHVzZWROb2RlLnggPCBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGgpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS53aWR0aCA9IHVzZWROb2RlLnggLSBuZXdOb2RlLng7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VPblJpZ2h0KGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmICh1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGggPCBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGgpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS54ID0gdXNlZE5vZGUueCArIHVzZWROb2RlLndpZHRoO1xuXHRcdFx0bmV3Tm9kZS53aWR0aCA9XG5cdFx0XHRcdGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCAtICh1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGgpO1xuXHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ld05vZGUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBHb2VzIHRocm91Z2ggdGhlIGZyZWUgcmVjdGFuZ2xlIGxpc3QgYW5kIHJlbW92ZXMgYW55IHJlZHVuZGFudCBlbnRyaWVzLlxuXHQgKi9cblx0cHJ1bmVGcmVlTGlzdCgpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0d2hpbGUgKGkgPCB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aCkge1xuXHRcdFx0bGV0IGogPSBpICsgMTtcblx0XHRcdGlmIChqID09PSB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHdoaWxlIChqIDwgdGhpcy5mcmVlUmVjdGFuZ2xlcy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuaXNDb250YWluZWRJbih0aGlzLmZyZWVSZWN0YW5nbGVzW2ldLCB0aGlzLmZyZWVSZWN0YW5nbGVzW2pdKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRpLS07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuaXNDb250YWluZWRJbih0aGlzLmZyZWVSZWN0YW5nbGVzW2pdLCB0aGlzLmZyZWVSZWN0YW5nbGVzW2ldKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnNwbGljZShqLCAxKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRqKys7XG5cdFx0XHRcdH1cblx0XHRcdFx0aSsrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlzQ29udGFpbmVkSW4ocmVjdEEsIHJlY3RCKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHJlY3RBICYmXG5cdFx0XHRyZWN0QiAmJlxuXHRcdFx0cmVjdEEueCA+PSByZWN0Qi54ICYmXG5cdFx0XHRyZWN0QS55ID49IHJlY3RCLnkgJiZcblx0XHRcdHJlY3RBLnggKyByZWN0QS53aWR0aCA8PSByZWN0Qi54ICsgcmVjdEIud2lkdGggJiZcblx0XHRcdHJlY3RBLnkgKyByZWN0QS5oZWlnaHQgPD0gcmVjdEIueSArIHJlY3RCLmhlaWdodFxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEZyZWVTcGFjZUJveCB7XG4gIHggPSAwXG4gIHkgPSAwXG4gIHdpZHRoID0gbnVsbFxuICBoZWlnaHQgPSBudWxsXG5cbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJveCB7XG5cdHdpZHRoOiBudW1iZXIgPSAwO1xuXHRoZWlnaHQ6IG51bWJlciA9IDA7XG5cdHggPSAwO1xuICAgIHkgPSAwO1xuICAgIGNvbnN0cmFpblJvdGF0aW9uID0gZmFsc2U7XG4gICAgcGFja2VkID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3Iod2lkdGg6bnVtYmVyICwgaGVpZ2h0OiBudW1iZXIsIGNvbnN0cmFpblJvdGF0aW9uID0gZmFsc2UpIHtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLmNvbnN0cmFpblJvdGF0aW9uID0gY29uc3RyYWluUm90YXRpb247XG5cdH1cbn0iLCJpbXBvcnQgQmluIGZyb20gJy4vQmluJztcbmltcG9ydCBCb3ggZnJvbSAnLi9Cb3gnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4vU2NvcmUnO1xuaW1wb3J0IFNjb3JlQm9hcmQgZnJvbSAnLi9TY29yZUJvYXJkJztcbmltcG9ydCB7IFBhY2tlZFNjb3JlcyB9IGZyb20gJy4vVHlwZXMnO1xuaW1wb3J0IFNjb3JlQm9hcmRFbnRyeSBmcm9tICcuL1Njb3JlQm9hcmRFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2tlciB7XG5cdGJpbnM6IEJpbltdID0gW107XG5cdHVucGFja2VkQm94ZXM6IEJveFtdID0gW107XG5cblx0Y29uc3RydWN0b3IoYmluczogQmluW10pIHtcblx0XHR0aGlzLmJpbnMgPSBiaW5zO1xuXHR9XG5cblx0cGFjazxUIGV4dGVuZHMgQm94Pihib3hlczogVFtdKTogUGFja2VkU2NvcmVzPFQ+W10ge1xuICAgICAgICBsZXQgcGFja2VkQm94ZXM6IFBhY2tlZFNjb3JlczxUPltdID0gW107XG4gICAgICAgIGxldCBlbnRyeTogU2NvcmVCb2FyZEVudHJ5IHwgbnVsbDtcblxuXHRcdGJveGVzID0gYm94ZXMuZmlsdGVyKChib3gpID0+ICFib3gucGFja2VkKTtcblx0XHRpZiAoYm94ZXMubGVuZ3RoID09PSAwKSByZXR1cm4gcGFja2VkQm94ZXM7XG5cblx0XHRsZXQgbGltaXQgPSBTY29yZS5NQVhfSU5UO1xuXHRcdGxldCBib2FyZCA9IG5ldyBTY29yZUJvYXJkKHRoaXMuYmlucywgYm94ZXMpO1xuXHRcdHdoaWxlICgoZW50cnkgPSBib2FyZC5iZXN0Rml0KCkpKSB7XG5cdFx0XHRlbnRyeS5iaW4uaW5zZXJ0KGVudHJ5LmJveCk7XG5cdFx0XHRib2FyZC5yZW1vdmVCb3goZW50cnkuYm94KTtcblx0XHRcdGJvYXJkLnJlY2FsY3VsYXRlQmluKGVudHJ5LmJpbik7XG4gICAgICAgICAgICBwYWNrZWRCb3hlcy5wdXNoKHsgYm94OiBlbnRyeS5ib3ggYXMgVCwgc2NvcmU6IGVudHJ5LnNjb3JlIH0pO1xuXHRcdFx0aWYgKHBhY2tlZEJveGVzLmxlbmd0aCA+PSBsaW1pdCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHR0aGlzLnVucGFja2VkQm94ZXMgPSBib3hlcy5maWx0ZXIoKGJveCkgPT4ge1xuXHRcdFx0cmV0dXJuICFib3gucGFja2VkO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHBhY2tlZEJveGVzO1xuXHR9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NvcmUge1xuICAgIHN0YXRpYyBNQVhfSU5UID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG4gICAgc2NvcmVfMSA9IFNjb3JlLk1BWF9JTlQ7XG4gICAgc2NvcmVfMiA9IFNjb3JlLk1BWF9JTlQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29yZV8xPzogbnVtYmVyLCBzY29yZV8yPzogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcmVfMSAhPSAndW5kZWZpbmVkJykgdGhpcy5zY29yZV8xID0gc2NvcmVfMTtcbiAgICAgICAgaWYgKHR5cGVvZiBzY29yZV8yICE9ICd1bmRlZmluZWQnKSB0aGlzLnNjb3JlXzIgPSBzY29yZV8yO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvd2VyIGlzIGJldHRlclxuICAgICAqL1xuICAgIHZhbHVlT2YoKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5zY29yZV8xICsgdGhpcy5zY29yZV8yKTtcbiAgICB9XG5cbiAgICBhc3NpZ24ob3RoZXIpIHtcbiAgICAgICAgdGhpcy5zY29yZV8xID0gb3RoZXIuc2NvcmVfMTtcbiAgICAgICAgdGhpcy5zY29yZV8yID0gb3RoZXIuc2NvcmVfMjtcbiAgICB9XG5cbiAgICBpc0JsYW5rKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zY29yZV8xID09PSBTY29yZS5NQVhfSU5UO1xuICAgIH1cblxuICAgIGRlY3JlYXNlQnkoZGVsdGEpIHtcbiAgICAgICAgdGhpcy5zY29yZV8xICs9IGRlbHRhO1xuICAgICAgICB0aGlzLnNjb3JlXzIgKz0gZGVsdGE7XG4gICAgfVxufSIsIi8vICMgICAgICAgYm94XzEgYm94XzIgYm94XzMgLi4uXG4vLyAjIGJpbl8xICAxMDAgICAyMDAgICAgMFxuLy8gIyBiaW5fMiAgIDAgICAgIDUgICAgIDBcbi8vICMgYmluXzMgICA5ICAgIDEwMCAgICAwXG4vLyAjIC4uLlxuaW1wb3J0IEJpbiBmcm9tICcuL0Jpbic7XG5pbXBvcnQgQm94IGZyb20gJy4vQm94JztcbmltcG9ydCBTY29yZUJvYXJkRW50cnkgZnJvbSAnLi9TY29yZUJvYXJkRW50cnknO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29yZUJvYXJkIHtcblx0ZW50cmllczogU2NvcmVCb2FyZEVudHJ5W10gPSBbXTtcblxuXHRjb25zdHJ1Y3RvcihiaW5zOiBCaW5bXSwgYm94ZXM6IEJveFtdKSB7XG5cdFx0Ymlucy5mb3JFYWNoKChiaW4pID0+IHtcblx0XHRcdHRoaXMuYWRkQmluRW50cmllcyhiaW4sIGJveGVzKTtcblx0XHR9KTtcblx0fVxuXG5cdGRlYnVnKCkge1xuXHRcdHJlcXVpcmUoJ2NvbnNvbGUudGFibGUnKTtcblx0XHRjb25zb2xlLnRhYmxlKFxuXHRcdFx0dGhpcy5lbnRyaWVzLm1hcCgoZW50cnkpID0+ICh7XG5cdFx0XHRcdGJpbjogZW50cnkuYmluLmxhYmVsLFxuXHRcdFx0XHRzY29yZTogZW50cnkuc2NvcmUsXG5cdFx0XHR9KSlcblx0XHQpO1xuXHR9XG5cblx0YWRkQmluRW50cmllcyhiaW4sIGJveGVzKSB7XG5cdFx0Ym94ZXMuZm9yRWFjaCgoYm94KSA9PiB7XG5cdFx0XHRsZXQgZW50cnkgPSBuZXcgU2NvcmVCb2FyZEVudHJ5KGJpbiwgYm94KTtcblx0XHRcdGVudHJ5LmNhbGN1bGF0ZSgpO1xuXHRcdFx0dGhpcy5lbnRyaWVzLnB1c2goZW50cnkpO1xuXHRcdH0pO1xuXHR9XG5cblx0bGFyZ2VzdE5vdEZpdGluZ0JveCgpIHtcbiAgICAgICAgbGV0IHVuZml0OiBTY29yZUJvYXJkRW50cnk7XG5cdFx0bGV0IGZpdHRpbmdCb3hlcyA9IHRoaXMuZW50cmllc1xuXHRcdFx0LmZpbHRlcigoZW50cnkpID0+IGVudHJ5LmZpdClcblx0XHRcdC5tYXAoKGVudHJ5KSA9PiBlbnRyeS5ib3gpO1xuXG4gICAgICAgIHRoaXMuZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdW5maXRBcmVhID0gdW5maXQuYm94LndpZHRoICogdW5maXQuYm94LmhlaWdodDtcbiAgICAgICAgICAgIGNvbnN0IGVudHJ5QXJlYSA9IGVudHJ5LmJveC53aWR0aCAqIGVudHJ5LmJveC5oZWlnaHQ7XG5cdFx0XHRpZiAoIWZpdHRpbmdCb3hlcy5pbmNsdWRlcyhlbnRyeS5ib3gpKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGlmICh1bmZpdCA9PT0gbnVsbCB8fCB1bmZpdEFyZWEgPCBlbnRyeUFyZWEpIHtcblx0XHRcdFx0dW5maXQgPSBlbnRyeTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiB1bmZpdC5ib3ggPyB1bmZpdCA6IGZhbHNlO1xuXHR9XG5cblx0YmVzdEZpdCgpIHtcblx0XHRsZXQgYmVzdDogU2NvcmVCb2FyZEVudHJ5IHwgbnVsbCA9IG51bGw7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudHJpZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGxldCBlbnRyeSA9IHRoaXMuZW50cmllc1tpXTtcblx0XHRcdGlmICghZW50cnkuZml0KCkpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHRpZiAoYmVzdCA9PT0gbnVsbCB8fCBlbnRyeS5zY29yZSA8IGJlc3Quc2NvcmUpIHtcblx0XHRcdFx0YmVzdCA9IGVudHJ5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gYmVzdDtcblx0fVxuXG5cdHJlbW92ZUJveChib3gpIHtcblx0XHR0aGlzLmVudHJpZXMgPSB0aGlzLmVudHJpZXMuZmlsdGVyKChlbnRyeSkgPT4ge1xuXHRcdFx0cmV0dXJuIGVudHJ5LmJveCAhPT0gYm94O1xuXHRcdH0pO1xuXHR9XG5cblx0YWRkQmluKGJpbikge1xuXHRcdHRoaXMuYWRkQmluRW50cmllcyhiaW4sIHRoaXMuY3VycmVudEJveGVzKCkpO1xuXHR9XG5cblx0cmVjYWxjdWxhdGVCaW4oYmluKSB7XG5cdFx0dGhpcy5lbnRyaWVzXG5cdFx0XHQuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkuYmluID09PSBiaW4pXG5cdFx0XHQuZm9yRWFjaCgoZW50cnkpID0+IGVudHJ5LmNhbGN1bGF0ZSgpKTtcblx0fVxuXG5cdGN1cnJlbnRCb3hlcygpIHtcblx0XHRyZXR1cm4gWy4uLm5ldyBTZXQodGhpcy5lbnRyaWVzLm1hcCgoZW50cnkpID0+IGVudHJ5LmJveCkpXTtcblx0fVxufVxuIiwiaW1wb3J0IEJpbiBmcm9tIFwiLi9CaW5cIjtcbmltcG9ydCBCb3ggZnJvbSBcIi4vQm94XCI7XG5pbXBvcnQgU2NvcmUgZnJvbSBcIi4vU2NvcmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NvcmVCb2FyZEVudHJ5IHtcbiAgICBiaW46IEJpbjtcbiAgICBib3g6IEJveDtcbiAgICBzY29yZTogU2NvcmU7XG5cbiAgICBjb25zdHJ1Y3RvcihiaW46IEJpbiwgYm94OiBCb3gpIHtcbiAgICAgICAgdGhpcy5iaW4gPSBiaW5cbiAgICAgICAgdGhpcy5ib3ggPSBib3hcbiAgICB9XG5cbiAgICBjYWxjdWxhdGUoKSB7XG4gICAgICAgIHRoaXMuc2NvcmUgPSB0aGlzLmJpbi5zY29yZUZvcih0aGlzLmJveCk7XG4gICAgICAgIHJldHVybiB0aGlzLnNjb3JlO1xuICAgIH1cblxuICAgIGZpdCgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnNjb3JlLmlzQmxhbmsoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgRnJlZVNwYWNlQm94IH0gZnJvbSAnLi4vQmluJztcbmltcG9ydCBCb3ggZnJvbSAnLi4vQm94JztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2Uge1xuXHRmaW5kUG9zaXRpb25Gb3JOZXdOb2RlKGJveDogQm94LCBmcmVlUmVjdHM6IEZyZWVTcGFjZUJveFtdKSB7XG5cdFx0bGV0IGJlc3RTY29yZSA9IG5ldyBTY29yZSgpO1xuXHRcdGxldCB3aWR0aCA9IGJveC53aWR0aDtcblx0XHRsZXQgaGVpZ2h0ID0gYm94LmhlaWdodDtcblxuXHRcdGZyZWVSZWN0cy5mb3JFYWNoKChmcmVlUmVjdCkgPT4ge1xuXHRcdFx0dGhpcy50cnlQbGFjZVJlY3RJbihmcmVlUmVjdCwgYm94LCB3aWR0aCwgaGVpZ2h0LCBiZXN0U2NvcmUpO1xuXHRcdFx0aWYgKCFib3guY29uc3RyYWluUm90YXRpb24pIHtcblx0XHRcdFx0dGhpcy50cnlQbGFjZVJlY3RJbihmcmVlUmVjdCwgYm94LCBoZWlnaHQsIHdpZHRoLCBiZXN0U2NvcmUpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGJlc3RTY29yZTtcblx0fVxuXG5cdHRyeVBsYWNlUmVjdEluKGZyZWVSZWN0LCBib3g6IEJveCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0LCBiZXN0U2NvcmUpIHtcblx0XHRpZiAoZnJlZVJlY3Qud2lkdGggPj0gcmVjdFdpZHRoICYmIGZyZWVSZWN0LmhlaWdodCA+PSByZWN0SGVpZ2h0KSB7XG5cdFx0XHRsZXQgc2NvcmUgPSB0aGlzLmNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpO1xuXHRcdFx0aWYgKHNjb3JlIDwgYmVzdFNjb3JlKSB7XG5cdFx0XHRcdGJveC54ID0gZnJlZVJlY3QueDtcblx0XHRcdFx0Ym94LnkgPSBmcmVlUmVjdC55O1xuXHRcdFx0XHRib3gud2lkdGggPSByZWN0V2lkdGg7XG5cdFx0XHRcdGJveC5oZWlnaHQgPSByZWN0SGVpZ2h0O1xuXHRcdFx0XHRib3gucGFja2VkID0gdHJ1ZTtcblx0XHRcdFx0YmVzdFNjb3JlLmFzc2lnbihzY29yZSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y2FsY3VsYXRlU2NvcmUoX2ZyZWVSZWN0LCBfcmVjdFdpZHRoLCBfcmVjdEhlaWdodCk6IFNjb3JlIHtcblx0XHR0aHJvdyAnTm90SW1wbGVtZW50ZWRFcnJvcic7XG5cdH1cbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgICBbIDB4MDMwMCwgMHgwMzZGIF0sIFsgMHgwNDgzLCAweDA0ODYgXSwgWyAweDA0ODgsIDB4MDQ4OSBdLFxuICAgIFsgMHgwNTkxLCAweDA1QkQgXSwgWyAweDA1QkYsIDB4MDVCRiBdLCBbIDB4MDVDMSwgMHgwNUMyIF0sXG4gICAgWyAweDA1QzQsIDB4MDVDNSBdLCBbIDB4MDVDNywgMHgwNUM3IF0sIFsgMHgwNjAwLCAweDA2MDMgXSxcbiAgICBbIDB4MDYxMCwgMHgwNjE1IF0sIFsgMHgwNjRCLCAweDA2NUUgXSwgWyAweDA2NzAsIDB4MDY3MCBdLFxuICAgIFsgMHgwNkQ2LCAweDA2RTQgXSwgWyAweDA2RTcsIDB4MDZFOCBdLCBbIDB4MDZFQSwgMHgwNkVEIF0sXG4gICAgWyAweDA3MEYsIDB4MDcwRiBdLCBbIDB4MDcxMSwgMHgwNzExIF0sIFsgMHgwNzMwLCAweDA3NEEgXSxcbiAgICBbIDB4MDdBNiwgMHgwN0IwIF0sIFsgMHgwN0VCLCAweDA3RjMgXSwgWyAweDA5MDEsIDB4MDkwMiBdLFxuICAgIFsgMHgwOTNDLCAweDA5M0MgXSwgWyAweDA5NDEsIDB4MDk0OCBdLCBbIDB4MDk0RCwgMHgwOTREIF0sXG4gICAgWyAweDA5NTEsIDB4MDk1NCBdLCBbIDB4MDk2MiwgMHgwOTYzIF0sIFsgMHgwOTgxLCAweDA5ODEgXSxcbiAgICBbIDB4MDlCQywgMHgwOUJDIF0sIFsgMHgwOUMxLCAweDA5QzQgXSwgWyAweDA5Q0QsIDB4MDlDRCBdLFxuICAgIFsgMHgwOUUyLCAweDA5RTMgXSwgWyAweDBBMDEsIDB4MEEwMiBdLCBbIDB4MEEzQywgMHgwQTNDIF0sXG4gICAgWyAweDBBNDEsIDB4MEE0MiBdLCBbIDB4MEE0NywgMHgwQTQ4IF0sIFsgMHgwQTRCLCAweDBBNEQgXSxcbiAgICBbIDB4MEE3MCwgMHgwQTcxIF0sIFsgMHgwQTgxLCAweDBBODIgXSwgWyAweDBBQkMsIDB4MEFCQyBdLFxuICAgIFsgMHgwQUMxLCAweDBBQzUgXSwgWyAweDBBQzcsIDB4MEFDOCBdLCBbIDB4MEFDRCwgMHgwQUNEIF0sXG4gICAgWyAweDBBRTIsIDB4MEFFMyBdLCBbIDB4MEIwMSwgMHgwQjAxIF0sIFsgMHgwQjNDLCAweDBCM0MgXSxcbiAgICBbIDB4MEIzRiwgMHgwQjNGIF0sIFsgMHgwQjQxLCAweDBCNDMgXSwgWyAweDBCNEQsIDB4MEI0RCBdLFxuICAgIFsgMHgwQjU2LCAweDBCNTYgXSwgWyAweDBCODIsIDB4MEI4MiBdLCBbIDB4MEJDMCwgMHgwQkMwIF0sXG4gICAgWyAweDBCQ0QsIDB4MEJDRCBdLCBbIDB4MEMzRSwgMHgwQzQwIF0sIFsgMHgwQzQ2LCAweDBDNDggXSxcbiAgICBbIDB4MEM0QSwgMHgwQzREIF0sIFsgMHgwQzU1LCAweDBDNTYgXSwgWyAweDBDQkMsIDB4MENCQyBdLFxuICAgIFsgMHgwQ0JGLCAweDBDQkYgXSwgWyAweDBDQzYsIDB4MENDNiBdLCBbIDB4MENDQywgMHgwQ0NEIF0sXG4gICAgWyAweDBDRTIsIDB4MENFMyBdLCBbIDB4MEQ0MSwgMHgwRDQzIF0sIFsgMHgwRDRELCAweDBENEQgXSxcbiAgICBbIDB4MERDQSwgMHgwRENBIF0sIFsgMHgwREQyLCAweDBERDQgXSwgWyAweDBERDYsIDB4MERENiBdLFxuICAgIFsgMHgwRTMxLCAweDBFMzEgXSwgWyAweDBFMzQsIDB4MEUzQSBdLCBbIDB4MEU0NywgMHgwRTRFIF0sXG4gICAgWyAweDBFQjEsIDB4MEVCMSBdLCBbIDB4MEVCNCwgMHgwRUI5IF0sIFsgMHgwRUJCLCAweDBFQkMgXSxcbiAgICBbIDB4MEVDOCwgMHgwRUNEIF0sIFsgMHgwRjE4LCAweDBGMTkgXSwgWyAweDBGMzUsIDB4MEYzNSBdLFxuICAgIFsgMHgwRjM3LCAweDBGMzcgXSwgWyAweDBGMzksIDB4MEYzOSBdLCBbIDB4MEY3MSwgMHgwRjdFIF0sXG4gICAgWyAweDBGODAsIDB4MEY4NCBdLCBbIDB4MEY4NiwgMHgwRjg3IF0sIFsgMHgwRjkwLCAweDBGOTcgXSxcbiAgICBbIDB4MEY5OSwgMHgwRkJDIF0sIFsgMHgwRkM2LCAweDBGQzYgXSwgWyAweDEwMkQsIDB4MTAzMCBdLFxuICAgIFsgMHgxMDMyLCAweDEwMzIgXSwgWyAweDEwMzYsIDB4MTAzNyBdLCBbIDB4MTAzOSwgMHgxMDM5IF0sXG4gICAgWyAweDEwNTgsIDB4MTA1OSBdLCBbIDB4MTE2MCwgMHgxMUZGIF0sIFsgMHgxMzVGLCAweDEzNUYgXSxcbiAgICBbIDB4MTcxMiwgMHgxNzE0IF0sIFsgMHgxNzMyLCAweDE3MzQgXSwgWyAweDE3NTIsIDB4MTc1MyBdLFxuICAgIFsgMHgxNzcyLCAweDE3NzMgXSwgWyAweDE3QjQsIDB4MTdCNSBdLCBbIDB4MTdCNywgMHgxN0JEIF0sXG4gICAgWyAweDE3QzYsIDB4MTdDNiBdLCBbIDB4MTdDOSwgMHgxN0QzIF0sIFsgMHgxN0RELCAweDE3REQgXSxcbiAgICBbIDB4MTgwQiwgMHgxODBEIF0sIFsgMHgxOEE5LCAweDE4QTkgXSwgWyAweDE5MjAsIDB4MTkyMiBdLFxuICAgIFsgMHgxOTI3LCAweDE5MjggXSwgWyAweDE5MzIsIDB4MTkzMiBdLCBbIDB4MTkzOSwgMHgxOTNCIF0sXG4gICAgWyAweDFBMTcsIDB4MUExOCBdLCBbIDB4MUIwMCwgMHgxQjAzIF0sIFsgMHgxQjM0LCAweDFCMzQgXSxcbiAgICBbIDB4MUIzNiwgMHgxQjNBIF0sIFsgMHgxQjNDLCAweDFCM0MgXSwgWyAweDFCNDIsIDB4MUI0MiBdLFxuICAgIFsgMHgxQjZCLCAweDFCNzMgXSwgWyAweDFEQzAsIDB4MURDQSBdLCBbIDB4MURGRSwgMHgxREZGIF0sXG4gICAgWyAweDIwMEIsIDB4MjAwRiBdLCBbIDB4MjAyQSwgMHgyMDJFIF0sIFsgMHgyMDYwLCAweDIwNjMgXSxcbiAgICBbIDB4MjA2QSwgMHgyMDZGIF0sIFsgMHgyMEQwLCAweDIwRUYgXSwgWyAweDMwMkEsIDB4MzAyRiBdLFxuICAgIFsgMHgzMDk5LCAweDMwOUEgXSwgWyAweEE4MDYsIDB4QTgwNiBdLCBbIDB4QTgwQiwgMHhBODBCIF0sXG4gICAgWyAweEE4MjUsIDB4QTgyNiBdLCBbIDB4RkIxRSwgMHhGQjFFIF0sIFsgMHhGRTAwLCAweEZFMEYgXSxcbiAgICBbIDB4RkUyMCwgMHhGRTIzIF0sIFsgMHhGRUZGLCAweEZFRkYgXSwgWyAweEZGRjksIDB4RkZGQiBdLFxuICAgIFsgMHgxMEEwMSwgMHgxMEEwMyBdLCBbIDB4MTBBMDUsIDB4MTBBMDYgXSwgWyAweDEwQTBDLCAweDEwQTBGIF0sXG4gICAgWyAweDEwQTM4LCAweDEwQTNBIF0sIFsgMHgxMEEzRiwgMHgxMEEzRiBdLCBbIDB4MUQxNjcsIDB4MUQxNjkgXSxcbiAgICBbIDB4MUQxNzMsIDB4MUQxODIgXSwgWyAweDFEMTg1LCAweDFEMThCIF0sIFsgMHgxRDFBQSwgMHgxRDFBRCBdLFxuICAgIFsgMHgxRDI0MiwgMHgxRDI0NCBdLCBbIDB4RTAwMDEsIDB4RTAwMDEgXSwgWyAweEUwMDIwLCAweEUwMDdGIF0sXG4gICAgWyAweEUwMTAwLCAweEUwMUVGIF1cbl1cbiIsIlwidXNlIHN0cmljdFwiXG5cbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJ2RlZmF1bHRzJylcbnZhciBjb21iaW5pbmcgPSByZXF1aXJlKCcuL2NvbWJpbmluZycpXG5cbnZhciBERUZBVUxUUyA9IHtcbiAgbnVsOiAwLFxuICBjb250cm9sOiAwXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2N3aWR0aChzdHIpIHtcbiAgcmV0dXJuIHdjc3dpZHRoKHN0ciwgREVGQVVMVFMpXG59XG5cbm1vZHVsZS5leHBvcnRzLmNvbmZpZyA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgb3B0cyA9IGRlZmF1bHRzKG9wdHMgfHwge30sIERFRkFVTFRTKVxuICByZXR1cm4gZnVuY3Rpb24gd2N3aWR0aChzdHIpIHtcbiAgICByZXR1cm4gd2Nzd2lkdGgoc3RyLCBvcHRzKVxuICB9XG59XG5cbi8qXG4gKiAgVGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgZGVmaW5lIHRoZSBjb2x1bW4gd2lkdGggb2YgYW4gSVNPIDEwNjQ2XG4gKiAgY2hhcmFjdGVyIGFzIGZvbGxvd3M6XG4gKiAgLSBUaGUgbnVsbCBjaGFyYWN0ZXIgKFUrMDAwMCkgaGFzIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBPdGhlciBDMC9DMSBjb250cm9sIGNoYXJhY3RlcnMgYW5kIERFTCB3aWxsIGxlYWQgdG8gYSByZXR1cm4gdmFsdWVcbiAqICAgIG9mIC0xLlxuICogIC0gTm9uLXNwYWNpbmcgYW5kIGVuY2xvc2luZyBjb21iaW5pbmcgY2hhcmFjdGVycyAoZ2VuZXJhbCBjYXRlZ29yeVxuICogICAgY29kZSBNbiBvciBNZSBpbiB0aGVcbiAqICAgIFVuaWNvZGUgZGF0YWJhc2UpIGhhdmUgYSBjb2x1bW4gd2lkdGggb2YgMC5cbiAqICAtIFNPRlQgSFlQSEVOIChVKzAwQUQpIGhhcyBhIGNvbHVtbiB3aWR0aCBvZiAxLlxuICogIC0gT3RoZXIgZm9ybWF0IGNoYXJhY3RlcnMgKGdlbmVyYWwgY2F0ZWdvcnkgY29kZSBDZiBpbiB0aGUgVW5pY29kZVxuICogICAgZGF0YWJhc2UpIGFuZCBaRVJPIFdJRFRIXG4gKiAgICBTUEFDRSAoVSsyMDBCKSBoYXZlIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBIYW5ndWwgSmFtbyBtZWRpYWwgdm93ZWxzIGFuZCBmaW5hbCBjb25zb25hbnRzIChVKzExNjAtVSsxMUZGKVxuICogICAgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAwLlxuICogIC0gU3BhY2luZyBjaGFyYWN0ZXJzIGluIHRoZSBFYXN0IEFzaWFuIFdpZGUgKFcpIG9yIEVhc3QgQXNpYW5cbiAqICAgIEZ1bGwtd2lkdGggKEYpIGNhdGVnb3J5IGFzXG4gKiAgICBkZWZpbmVkIGluIFVuaWNvZGUgVGVjaG5pY2FsIFJlcG9ydCAjMTEgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAyLlxuICogIC0gQWxsIHJlbWFpbmluZyBjaGFyYWN0ZXJzIChpbmNsdWRpbmcgYWxsIHByaW50YWJsZSBJU08gODg1OS0xIGFuZFxuICogICAgV0dMNCBjaGFyYWN0ZXJzLCBVbmljb2RlIGNvbnRyb2wgY2hhcmFjdGVycywgZXRjLikgaGF2ZSBhIGNvbHVtblxuICogICAgd2lkdGggb2YgMS5cbiAqICBUaGlzIGltcGxlbWVudGF0aW9uIGFzc3VtZXMgdGhhdCBjaGFyYWN0ZXJzIGFyZSBlbmNvZGVkIGluIElTTyAxMDY0Ni5cbiovXG5cbmZ1bmN0aW9uIHdjc3dpZHRoKHN0ciwgb3B0cykge1xuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHJldHVybiB3Y3dpZHRoKHN0ciwgb3B0cylcblxuICB2YXIgcyA9IDBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbiA9IHdjd2lkdGgoc3RyLmNoYXJDb2RlQXQoaSksIG9wdHMpXG4gICAgaWYgKG4gPCAwKSByZXR1cm4gLTFcbiAgICBzICs9IG5cbiAgfVxuXG4gIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIHdjd2lkdGgodWNzLCBvcHRzKSB7XG4gIC8vIHRlc3QgZm9yIDgtYml0IGNvbnRyb2wgY2hhcmFjdGVyc1xuICBpZiAodWNzID09PSAwKSByZXR1cm4gb3B0cy5udWxcbiAgaWYgKHVjcyA8IDMyIHx8ICh1Y3MgPj0gMHg3ZiAmJiB1Y3MgPCAweGEwKSkgcmV0dXJuIG9wdHMuY29udHJvbFxuXG4gIC8vIGJpbmFyeSBzZWFyY2ggaW4gdGFibGUgb2Ygbm9uLXNwYWNpbmcgY2hhcmFjdGVyc1xuICBpZiAoYmlzZWFyY2godWNzKSkgcmV0dXJuIDBcblxuICAvLyBpZiB3ZSBhcnJpdmUgaGVyZSwgdWNzIGlzIG5vdCBhIGNvbWJpbmluZyBvciBDMC9DMSBjb250cm9sIGNoYXJhY3RlclxuICByZXR1cm4gMSArXG4gICAgICAodWNzID49IDB4MTEwMCAmJlxuICAgICAgICh1Y3MgPD0gMHgxMTVmIHx8ICAgICAgICAgICAgICAgICAgICAgICAvLyBIYW5ndWwgSmFtbyBpbml0LiBjb25zb25hbnRzXG4gICAgICAgIHVjcyA9PSAweDIzMjkgfHwgdWNzID09IDB4MjMyYSB8fFxuICAgICAgICAodWNzID49IDB4MmU4MCAmJiB1Y3MgPD0gMHhhNGNmICYmXG4gICAgICAgICB1Y3MgIT0gMHgzMDNmKSB8fCAgICAgICAgICAgICAgICAgICAgIC8vIENKSyAuLi4gWWlcbiAgICAgICAgKHVjcyA+PSAweGFjMDAgJiYgdWNzIDw9IDB4ZDdhMykgfHwgICAgLy8gSGFuZ3VsIFN5bGxhYmxlc1xuICAgICAgICAodWNzID49IDB4ZjkwMCAmJiB1Y3MgPD0gMHhmYWZmKSB8fCAgICAvLyBDSksgQ29tcGF0aWJpbGl0eSBJZGVvZ3JhcGhzXG4gICAgICAgICh1Y3MgPj0gMHhmZTEwICYmIHVjcyA8PSAweGZlMTkpIHx8ICAgIC8vIFZlcnRpY2FsIGZvcm1zXG4gICAgICAgICh1Y3MgPj0gMHhmZTMwICYmIHVjcyA8PSAweGZlNmYpIHx8ICAgIC8vIENKSyBDb21wYXRpYmlsaXR5IEZvcm1zXG4gICAgICAgICh1Y3MgPj0gMHhmZjAwICYmIHVjcyA8PSAweGZmNjApIHx8ICAgIC8vIEZ1bGx3aWR0aCBGb3Jtc1xuICAgICAgICAodWNzID49IDB4ZmZlMCAmJiB1Y3MgPD0gMHhmZmU2KSB8fFxuICAgICAgICAodWNzID49IDB4MjAwMDAgJiYgdWNzIDw9IDB4MmZmZmQpIHx8XG4gICAgICAgICh1Y3MgPj0gMHgzMDAwMCAmJiB1Y3MgPD0gMHgzZmZmZCkpKTtcbn1cblxuZnVuY3Rpb24gYmlzZWFyY2godWNzKSB7XG4gIHZhciBtaW4gPSAwXG4gIHZhciBtYXggPSBjb21iaW5pbmcubGVuZ3RoIC0gMVxuICB2YXIgbWlkXG5cbiAgaWYgKHVjcyA8IGNvbWJpbmluZ1swXVswXSB8fCB1Y3MgPiBjb21iaW5pbmdbbWF4XVsxXSkgcmV0dXJuIGZhbHNlXG5cbiAgd2hpbGUgKG1heCA+PSBtaW4pIHtcbiAgICBtaWQgPSBNYXRoLmZsb29yKChtaW4gKyBtYXgpIC8gMilcbiAgICBpZiAodWNzID4gY29tYmluaW5nW21pZF1bMV0pIG1pbiA9IG1pZCArIDFcbiAgICBlbHNlIGlmICh1Y3MgPCBjb21iaW5pbmdbbWlkXVswXSkgbWF4ID0gbWlkIC0gMVxuICAgIGVsc2UgcmV0dXJuIHRydWVcbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuIiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlc3RBcmVhRml0IGV4dGVuZHMgQmFzZSB7XG5cbiAgY2FsY3VsYXRlU2NvcmUoZnJlZVJlY3QsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCkge1xuICAgIGxldCBhcmVhRml0ID0gZnJlZVJlY3Qud2lkdGggKiBmcmVlUmVjdC5oZWlnaHQgLSByZWN0V2lkdGggKiByZWN0SGVpZ2h0O1xuICAgIGxldCBsZWZ0T3Zlckhvcml6ID0gTWF0aC5hYnMoZnJlZVJlY3Qud2lkdGggLSByZWN0V2lkdGgpO1xuICAgIGxldCBsZWZ0T3ZlclZlcnQgPSBNYXRoLmFicyhmcmVlUmVjdC5oZWlnaHQgLSByZWN0SGVpZ2h0KTtcbiAgICBsZXQgc2hvcnRTaWRlRml0ID0gTWF0aC5taW4obGVmdE92ZXJIb3JpeiwgbGVmdE92ZXJWZXJ0KTtcbiAgICByZXR1cm4gbmV3IFNjb3JlKGFyZWFGaXQsIHNob3J0U2lkZUZpdCk7XG4gIH1cblxufSIsImltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZXN0TG9uZ1NpZGVGaXQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IGxlZnRPdmVySG9yaXogPSBNYXRoLmFicyhmcmVlUmVjdC53aWR0aCAtIHJlY3RXaWR0aCk7XG4gICAgbGV0IGxlZnRPdmVyVmVydCA9IE1hdGguYWJzKGZyZWVSZWN0LmhlaWdodCAtIHJlY3RIZWlnaHQpO1xuICAgIGxldCBhcmdzID0gW2xlZnRPdmVySG9yaXosIGxlZnRPdmVyVmVydF0uc29ydCgoYSwgYikgPT4gYSAtIGIpLnJldmVyc2UoKTtcbiAgICByZXR1cm4gbmV3IFNjb3JlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICB9XG5cbn0iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVzdFNob3J0U2lkZUZpdCBleHRlbmRzIEJhc2Uge1xuXG4gIGNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpIHtcbiAgICBsZXQgbGVmdE92ZXJIb3JpeiA9IE1hdGguYWJzKGZyZWVSZWN0LndpZHRoIC0gcmVjdFdpZHRoKTtcbiAgICBsZXQgbGVmdE92ZXJWZXJ0ID0gTWF0aC5hYnMoZnJlZVJlY3QuaGVpZ2h0IC0gcmVjdEhlaWdodCk7XG4gICAgbGV0IGFyZ3MgPSBbbGVmdE92ZXJIb3JpeiwgbGVmdE92ZXJWZXJ0XS5zb3J0KChhLCBiKSA9PiBhIC0gYik7XG4gICAgbGV0IHNjb3JlID0gbmV3IFNjb3JlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIHJldHVybiBzY29yZTtcbiAgfVxuXG59IiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJvdHRvbUxlZnQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IHRvcFNpZGVZID0gZnJlZVJlY3QueSArIHJlY3RIZWlnaHQ7XG4gICAgcmV0dXJuIG5ldyBTY29yZSh0b3BTaWRlWSwgZnJlZVJlY3QueCk7XG4gIH1cblxufSIsImV4cG9ydCB7IGRlZmF1bHQgYXMgQmVzdEFyZWFGaXQgfSBmcm9tICcuL0Jlc3RBcmVhRml0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQmVzdExvbmdTaWRlRml0IH0gZnJvbSAnLi9CZXN0TG9uZ1NpZGVGaXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBCZXN0U2hvcnRTaWRlRml0IH0gZnJvbSAnLi9CZXN0U2hvcnRTaWRlRml0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQm90dG9tTGVmdCB9IGZyb20gJy4vQm90dG9tTGVmdCc7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBCaW4gZnJvbSAnLi9CaW4nXG5pbXBvcnQgQm94IGZyb20gJy4vQm94J1xuaW1wb3J0IFBhY2tlciBmcm9tICcuL1BhY2tlcidcbmltcG9ydCAqIGFzIGhldXJpc3RpY3MgZnJvbSAnLi9oZXVyaXN0aWNzJztcblxuZXhwb3J0IHsgQmluLCBCb3gsIFBhY2tlciwgaGV1cmlzdGljcyB9OyJdLCJzb3VyY2VSb290IjoiIn0=