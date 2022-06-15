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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jbG9uZS9jbG9uZS5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jb25zb2xlLnRhYmxlL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2RlZmF1bHRzL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2Vhc3ktdGFibGUvdGFibGUuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL0Jpbi50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvQm94LnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9QYWNrZXIudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL1Njb3JlLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkRW50cnkudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvQmFzZS50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2NvbWJpbmluZy5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RBcmVhRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RMb25nU2lkZUZpdC5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvaGV1cmlzdGljcy9CZXN0U2hvcnRTaWRlRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0JvdHRvbUxlZnQuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8zRC9CaW4uanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL0l0ZW0uanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL1BhY2tlci5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vM0QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL3V0aWwuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uL2xpYi9sb2cuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0JpblBhY2tpbmcvLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRCxJQUFJLEtBQTBCO0FBQzlCO0FBQ0E7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsdURBQVk7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNB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TztBQUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBLEM7Ozs7OztVQ1hBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsNkNBQTZDLHdEQUF3RCxFOzs7OztXQ0FyRztXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZCO0FBQ0E7QUFFUCIsImZpbGUiOiJCaW5QYWNraW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJCaW5QYWNraW5nXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkJpblBhY2tpbmdcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiQmluUGFja2luZ1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsInZhciBjbG9uZSA9IChmdW5jdGlvbigpIHtcbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDbG9uZXMgKGNvcGllcykgYW4gT2JqZWN0IHVzaW5nIGRlZXAgY29weWluZy5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHN1cHBvcnRzIGNpcmN1bGFyIHJlZmVyZW5jZXMgYnkgZGVmYXVsdCwgYnV0IGlmIHlvdSBhcmUgY2VydGFpblxuICogdGhlcmUgYXJlIG5vIGNpcmN1bGFyIHJlZmVyZW5jZXMgaW4geW91ciBvYmplY3QsIHlvdSBjYW4gc2F2ZSBzb21lIENQVSB0aW1lXG4gKiBieSBjYWxsaW5nIGNsb25lKG9iaiwgZmFsc2UpLlxuICpcbiAqIENhdXRpb246IGlmIGBjaXJjdWxhcmAgaXMgZmFsc2UgYW5kIGBwYXJlbnRgIGNvbnRhaW5zIGNpcmN1bGFyIHJlZmVyZW5jZXMsXG4gKiB5b3VyIHByb2dyYW0gbWF5IGVudGVyIGFuIGluZmluaXRlIGxvb3AgYW5kIGNyYXNoLlxuICpcbiAqIEBwYXJhbSBgcGFyZW50YCAtIHRoZSBvYmplY3QgdG8gYmUgY2xvbmVkXG4gKiBAcGFyYW0gYGNpcmN1bGFyYCAtIHNldCB0byB0cnVlIGlmIHRoZSBvYmplY3QgdG8gYmUgY2xvbmVkIG1heSBjb250YWluXG4gKiAgICBjaXJjdWxhciByZWZlcmVuY2VzLiAob3B0aW9uYWwgLSB0cnVlIGJ5IGRlZmF1bHQpXG4gKiBAcGFyYW0gYGRlcHRoYCAtIHNldCB0byBhIG51bWJlciBpZiB0aGUgb2JqZWN0IGlzIG9ubHkgdG8gYmUgY2xvbmVkIHRvXG4gKiAgICBhIHBhcnRpY3VsYXIgZGVwdGguIChvcHRpb25hbCAtIGRlZmF1bHRzIHRvIEluZmluaXR5KVxuICogQHBhcmFtIGBwcm90b3R5cGVgIC0gc2V0cyB0aGUgcHJvdG90eXBlIHRvIGJlIHVzZWQgd2hlbiBjbG9uaW5nIGFuIG9iamVjdC5cbiAqICAgIChvcHRpb25hbCAtIGRlZmF1bHRzIHRvIHBhcmVudCBwcm90b3R5cGUpLlxuKi9cbmZ1bmN0aW9uIGNsb25lKHBhcmVudCwgY2lyY3VsYXIsIGRlcHRoLCBwcm90b3R5cGUpIHtcbiAgdmFyIGZpbHRlcjtcbiAgaWYgKHR5cGVvZiBjaXJjdWxhciA9PT0gJ29iamVjdCcpIHtcbiAgICBkZXB0aCA9IGNpcmN1bGFyLmRlcHRoO1xuICAgIHByb3RvdHlwZSA9IGNpcmN1bGFyLnByb3RvdHlwZTtcbiAgICBmaWx0ZXIgPSBjaXJjdWxhci5maWx0ZXI7XG4gICAgY2lyY3VsYXIgPSBjaXJjdWxhci5jaXJjdWxhclxuICB9XG4gIC8vIG1haW50YWluIHR3byBhcnJheXMgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZXMsIHdoZXJlIGNvcnJlc3BvbmRpbmcgcGFyZW50c1xuICAvLyBhbmQgY2hpbGRyZW4gaGF2ZSB0aGUgc2FtZSBpbmRleFxuICB2YXIgYWxsUGFyZW50cyA9IFtdO1xuICB2YXIgYWxsQ2hpbGRyZW4gPSBbXTtcblxuICB2YXIgdXNlQnVmZmVyID0gdHlwZW9mIEJ1ZmZlciAhPSAndW5kZWZpbmVkJztcblxuICBpZiAodHlwZW9mIGNpcmN1bGFyID09ICd1bmRlZmluZWQnKVxuICAgIGNpcmN1bGFyID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGRlcHRoID09ICd1bmRlZmluZWQnKVxuICAgIGRlcHRoID0gSW5maW5pdHk7XG5cbiAgLy8gcmVjdXJzZSB0aGlzIGZ1bmN0aW9uIHNvIHdlIGRvbid0IHJlc2V0IGFsbFBhcmVudHMgYW5kIGFsbENoaWxkcmVuXG4gIGZ1bmN0aW9uIF9jbG9uZShwYXJlbnQsIGRlcHRoKSB7XG4gICAgLy8gY2xvbmluZyBudWxsIGFsd2F5cyByZXR1cm5zIG51bGxcbiAgICBpZiAocGFyZW50ID09PSBudWxsKVxuICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICBpZiAoZGVwdGggPT0gMClcbiAgICAgIHJldHVybiBwYXJlbnQ7XG5cbiAgICB2YXIgY2hpbGQ7XG4gICAgdmFyIHByb3RvO1xuICAgIGlmICh0eXBlb2YgcGFyZW50ICE9ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gcGFyZW50O1xuICAgIH1cblxuICAgIGlmIChjbG9uZS5fX2lzQXJyYXkocGFyZW50KSkge1xuICAgICAgY2hpbGQgPSBbXTtcbiAgICB9IGVsc2UgaWYgKGNsb25lLl9faXNSZWdFeHAocGFyZW50KSkge1xuICAgICAgY2hpbGQgPSBuZXcgUmVnRXhwKHBhcmVudC5zb3VyY2UsIF9fZ2V0UmVnRXhwRmxhZ3MocGFyZW50KSk7XG4gICAgICBpZiAocGFyZW50Lmxhc3RJbmRleCkgY2hpbGQubGFzdEluZGV4ID0gcGFyZW50Lmxhc3RJbmRleDtcbiAgICB9IGVsc2UgaWYgKGNsb25lLl9faXNEYXRlKHBhcmVudCkpIHtcbiAgICAgIGNoaWxkID0gbmV3IERhdGUocGFyZW50LmdldFRpbWUoKSk7XG4gICAgfSBlbHNlIGlmICh1c2VCdWZmZXIgJiYgQnVmZmVyLmlzQnVmZmVyKHBhcmVudCkpIHtcbiAgICAgIGlmIChCdWZmZXIuYWxsb2NVbnNhZmUpIHtcbiAgICAgICAgLy8gTm9kZS5qcyA+PSA0LjUuMFxuICAgICAgICBjaGlsZCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShwYXJlbnQubGVuZ3RoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE9sZGVyIE5vZGUuanMgdmVyc2lvbnNcbiAgICAgICAgY2hpbGQgPSBuZXcgQnVmZmVyKHBhcmVudC5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgcGFyZW50LmNvcHkoY2hpbGQpO1xuICAgICAgcmV0dXJuIGNoaWxkO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHByb3RvdHlwZSA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwYXJlbnQpO1xuICAgICAgICBjaGlsZCA9IE9iamVjdC5jcmVhdGUocHJvdG8pO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGNoaWxkID0gT2JqZWN0LmNyZWF0ZShwcm90b3R5cGUpO1xuICAgICAgICBwcm90byA9IHByb3RvdHlwZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2lyY3VsYXIpIHtcbiAgICAgIHZhciBpbmRleCA9IGFsbFBhcmVudHMuaW5kZXhPZihwYXJlbnQpO1xuXG4gICAgICBpZiAoaW5kZXggIT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGFsbENoaWxkcmVuW2luZGV4XTtcbiAgICAgIH1cbiAgICAgIGFsbFBhcmVudHMucHVzaChwYXJlbnQpO1xuICAgICAgYWxsQ2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSBpbiBwYXJlbnQpIHtcbiAgICAgIHZhciBhdHRycztcbiAgICAgIGlmIChwcm90bykge1xuICAgICAgICBhdHRycyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIGkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0cnMgJiYgYXR0cnMuc2V0ID09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjaGlsZFtpXSA9IF9jbG9uZShwYXJlbnRbaV0sIGRlcHRoIC0gMSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkO1xuICB9XG5cbiAgcmV0dXJuIF9jbG9uZShwYXJlbnQsIGRlcHRoKTtcbn1cblxuLyoqXG4gKiBTaW1wbGUgZmxhdCBjbG9uZSB1c2luZyBwcm90b3R5cGUsIGFjY2VwdHMgb25seSBvYmplY3RzLCB1c2VmdWxsIGZvciBwcm9wZXJ0eVxuICogb3ZlcnJpZGUgb24gRkxBVCBjb25maWd1cmF0aW9uIG9iamVjdCAobm8gbmVzdGVkIHByb3BzKS5cbiAqXG4gKiBVU0UgV0lUSCBDQVVUSU9OISBUaGlzIG1heSBub3QgYmVoYXZlIGFzIHlvdSB3aXNoIGlmIHlvdSBkbyBub3Qga25vdyBob3cgdGhpc1xuICogd29ya3MuXG4gKi9cbmNsb25lLmNsb25lUHJvdG90eXBlID0gZnVuY3Rpb24gY2xvbmVQcm90b3R5cGUocGFyZW50KSB7XG4gIGlmIChwYXJlbnQgPT09IG51bGwpXG4gICAgcmV0dXJuIG51bGw7XG5cbiAgdmFyIGMgPSBmdW5jdGlvbiAoKSB7fTtcbiAgYy5wcm90b3R5cGUgPSBwYXJlbnQ7XG4gIHJldHVybiBuZXcgYygpO1xufTtcblxuLy8gcHJpdmF0ZSB1dGlsaXR5IGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBfX29ialRvU3RyKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn07XG5jbG9uZS5fX29ialRvU3RyID0gX19vYmpUb1N0cjtcblxuZnVuY3Rpb24gX19pc0RhdGUobykge1xuICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIF9fb2JqVG9TdHIobykgPT09ICdbb2JqZWN0IERhdGVdJztcbn07XG5jbG9uZS5fX2lzRGF0ZSA9IF9faXNEYXRlO1xuXG5mdW5jdGlvbiBfX2lzQXJyYXkobykge1xuICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIF9fb2JqVG9TdHIobykgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuY2xvbmUuX19pc0FycmF5ID0gX19pc0FycmF5O1xuXG5mdW5jdGlvbiBfX2lzUmVnRXhwKG8pIHtcbiAgcmV0dXJuIHR5cGVvZiBvID09PSAnb2JqZWN0JyAmJiBfX29ialRvU3RyKG8pID09PSAnW29iamVjdCBSZWdFeHBdJztcbn07XG5jbG9uZS5fX2lzUmVnRXhwID0gX19pc1JlZ0V4cDtcblxuZnVuY3Rpb24gX19nZXRSZWdFeHBGbGFncyhyZSkge1xuICB2YXIgZmxhZ3MgPSAnJztcbiAgaWYgKHJlLmdsb2JhbCkgZmxhZ3MgKz0gJ2cnO1xuICBpZiAocmUuaWdub3JlQ2FzZSkgZmxhZ3MgKz0gJ2knO1xuICBpZiAocmUubXVsdGlsaW5lKSBmbGFncyArPSAnbSc7XG4gIHJldHVybiBmbGFncztcbn07XG5jbG9uZS5fX2dldFJlZ0V4cEZsYWdzID0gX19nZXRSZWdFeHBGbGFncztcblxucmV0dXJuIGNsb25lO1xufSkoKTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY2xvbmU7XG59XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gc2V0dXBDb25zb2xlVGFibGUoKSB7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdXZWlyZCwgY29uc29sZSBvYmplY3QgaXMgdW5kZWZpbmVkJyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgY29uc29sZS50YWJsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gaWYgaXQgaXMgbm90IE9VUiBmdW5jdGlvbiwgb3ZlcndyaXRlIGl0XG4gICAgICBpZiAoY29uc29sZS50YWJsZSA9PT0gY29uc29sZVRhYmxlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc1R5cGUodCwgeCkge1xuICAgICAgcmV0dXJuIHR5cGVvZiB4ID09PSB0O1xuICAgIH1cblxuICAgIHZhciBpc1N0cmluZyA9IGlzVHlwZS5iaW5kKG51bGwsICdzdHJpbmcnKTtcblxuICAgIGZ1bmN0aW9uIGlzQXJyYXlPZihpc1R5cGVGbiwgYSkge1xuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYSkgJiZcbiAgICAgICAgYS5ldmVyeShpc1R5cGVGbik7XG4gICAgfVxuXG4gICAgdmFyIGlzQXJyYXlPZlN0cmluZ3MgPSBpc0FycmF5T2YuYmluZChudWxsLCBpc1N0cmluZyk7XG4gICAgdmFyIGlzQXJyYXlPZkFycmF5cyA9IGlzQXJyYXlPZi5iaW5kKG51bGwsIEFycmF5LmlzQXJyYXkpO1xuXG4gICAgdmFyIFRhYmxlID0gcmVxdWlyZSgnZWFzeS10YWJsZScpO1xuXG4gICAgZnVuY3Rpb24gYXJyYXlUb1N0cmluZyhhcnIpIHtcbiAgICAgIHZhciB0ID0gbmV3IFRhYmxlKCk7XG4gICAgICBhcnIuZm9yRWFjaChmdW5jdGlvbiAocmVjb3JkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVjb3JkID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgIHR5cGVvZiByZWNvcmQgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdC5jZWxsKCdpdGVtJywgcmVjb3JkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBhc3N1bWUgcGxhaW4gb2JqZWN0XG4gICAgICAgICAgT2JqZWN0LmtleXMocmVjb3JkKS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgdC5jZWxsKHByb3BlcnR5LCByZWNvcmRbcHJvcGVydHldKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0Lm5ld1JvdygpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHByaW50VGFibGVXaXRoQ29sdW1uVGl0bGVzKHRpdGxlcywgaXRlbXMsbm9Db25zb2xlKSB7XG4gICAgICB2YXIgdCA9IG5ldyBUYWJsZSgpO1xuICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpdGVtLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrKSB7XG4gICAgICAgICAgdC5jZWxsKHRpdGxlc1trXSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgdC5uZXdSb3coKTtcbiAgICAgIH0pO1xuICAgICAgdmFyIHN0ciA9IHQudG9TdHJpbmcoKTtcblxuICAgICAgcmV0dXJuIG5vQ29uc29sZSA/IHN0ciA6IGNvbnNvbGUubG9nKHN0cik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJpbnRUaXRsZVRhYmxlKHRpdGxlLCBhcnIpIHtcbiAgICAgIHZhciBzdHIgPSBhcnJheVRvU3RyaW5nKGFycik7XG4gICAgICB2YXIgcm93TGVuZ3RoID0gc3RyLmluZGV4T2YoJ1xcbicpO1xuICAgICAgaWYgKHJvd0xlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRpdGxlLmxlbmd0aCA+IHJvd0xlbmd0aCkge1xuICAgICAgICAgIHJvd0xlbmd0aCA9IHRpdGxlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyh0aXRsZSk7XG4gICAgICAgIHZhciBzZXAgPSAnLScsIGssIGxpbmUgPSAnJztcbiAgICAgICAgZm9yIChrID0gMDsgayA8IHJvd0xlbmd0aDsgayArPSAxKSB7XG4gICAgICAgICAgbGluZSArPSBzZXA7XG4gICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhsaW5lKTtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUubG9nKHN0cik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGl0bGVUYWJsZSh0aXRsZSwgYXJyKSB7XG4gICAgICB2YXIgc3RyID0gYXJyYXlUb1N0cmluZyhhcnIpO1xuICAgICAgdmFyIHJvd0xlbmd0aCA9IHN0ci5pbmRleE9mKCdcXG4nKTtcbiAgICAgIHZhciBzdHJUb1JldHVybiA9ICcnO1xuICAgICAgaWYgKHJvd0xlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHRpdGxlLmxlbmd0aCA+IHJvd0xlbmd0aCkge1xuICAgICAgICAgIHJvd0xlbmd0aCA9IHRpdGxlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3RyVG9SZXR1cm4gKz0gdGl0bGUgKyAnXFxuJztcbiAgICAgICAgdmFyIHNlcCA9ICctJywgaywgbGluZSA9ICcnO1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcm93TGVuZ3RoOyBrICs9IDEpIHtcbiAgICAgICAgICBsaW5lICs9IHNlcDtcbiAgICAgICAgfVxuXHRcbiAgICAgICAgc3RyVG9SZXR1cm4gKz0gbGluZSArICdcXG4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3RyVG9SZXR1cm4gKyBzdHI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb2JqZWN0VG9BcnJheShvYmopIHtcbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIHJldHVybiBrZXlzLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2V5OiBrZXksXG4gICAgICAgICAgdmFsdWU6IG9ialtrZXldXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvYmopIHtcbiAgICAgIHJldHVybiBhcnJheVRvU3RyaW5nKG9iamVjdFRvQXJyYXkob2JqKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29uc29sZVRhYmxlICgpIHtcbiAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmXG4gICAgICAgIHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJyAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KGFyZ3NbMV0pKSB7XG5cbiAgICAgICAgcmV0dXJuIHByaW50VGl0bGVUYWJsZShhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmXG4gICAgICAgIGlzQXJyYXlPZlN0cmluZ3MoYXJnc1swXSkgJiZcbiAgICAgICAgaXNBcnJheU9mQXJyYXlzKGFyZ3NbMV0pKSB7XG4gICAgICAgIHJldHVybiBwcmludFRhYmxlV2l0aENvbHVtblRpdGxlcyhhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIH1cblxuICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5sb2coayk7XG4gICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShrKSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGFycmF5VG9TdHJpbmcoaykpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBrID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKG9iamVjdFRvU3RyaW5nKGspKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbW9kdWxlLmV4cG9ydHMuZ2V0VGFibGUgPSBmdW5jdGlvbigpe1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICB2YXIgc3RyVG9SZXR1cm4gPSAnJztcblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmXG4gICAgICAgIHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJyAmJlxuICAgICAgICBBcnJheS5pc0FycmF5KGFyZ3NbMV0pKSB7XG5cbiAgICAgICAgcmV0dXJuIGdldFRpdGxlVGFibGUoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICBpc0FycmF5T2ZTdHJpbmdzKGFyZ3NbMF0pICYmXG4gICAgICAgIGlzQXJyYXlPZkFycmF5cyhhcmdzWzFdKSkge1xuICAgICAgICByZXR1cm4gcHJpbnRUYWJsZVdpdGhDb2x1bW5UaXRsZXMoYXJnc1swXSwgYXJnc1sxXSx0cnVlKTtcbiAgICAgIH1cblxuICAgICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChrLGkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHN0clRvUmV0dXJuICs9IGs7XG5cdCAgaWYgKGkgIT09IGFyZ3MubGVuZ3RoIC0gMSl7XG5cdCAgICBzdHJUb1JldHVybiArPSAnXFxuJztcblx0ICB9XG4gICAgICAgICAgcmV0dXJuIDtcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGspKSB7XG4gICAgICAgICAgc3RyVG9SZXR1cm4gKz0gYXJyYXlUb1N0cmluZyhrKSArICdcXG4nO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBrID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHN0clRvUmV0dXJuICs9IG9iamVjdFRvU3RyaW5nKGspO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHN0clRvUmV0dXJuO1xuICAgIH07XG5cbiAgICBjb25zb2xlLnRhYmxlID0gY29uc29sZVRhYmxlO1xuICB9XG5cbiAgc2V0dXBDb25zb2xlVGFibGUoKTtcbn0oKSk7XG4iLCJ2YXIgY2xvbmUgPSByZXF1aXJlKCdjbG9uZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIE9iamVjdC5rZXlzKGRlZmF1bHRzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1trZXldID09PSAndW5kZWZpbmVkJykge1xuICAgICAgb3B0aW9uc1trZXldID0gY2xvbmUoZGVmYXVsdHNba2V5XSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gb3B0aW9ucztcbn07IiwidmFyIHdjd2lkdGhcblxudHJ5IHtcbiAgd2N3aWR0aCA9IHJlcXVpcmUoJ3djd2lkdGgnKVxufSBjYXRjaChlKSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhYmxlXG5cbmZ1bmN0aW9uIFRhYmxlKCkge1xuICB0aGlzLnJvd3MgPSBbXVxuICB0aGlzLnJvdyA9IHtfX3ByaW50ZXJzIDoge319XG59XG5cbi8qKlxuICogUHVzaCB0aGUgY3VycmVudCByb3cgdG8gdGhlIHRhYmxlIGFuZCBzdGFydCBhIG5ldyBvbmVcbiAqXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5uZXdSb3cgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5yb3dzLnB1c2godGhpcy5yb3cpXG4gIHRoaXMucm93ID0ge19fcHJpbnRlcnMgOiB7fX1cbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBXcml0ZSBjZWxsIGluIHRoZSBjdXJyZW50IHJvd1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjb2wgICAgICAgICAgLSBDb2x1bW4gbmFtZVxuICogQHBhcmFtIHtBbnl9IHZhbCAgICAgICAgICAgICAtIENlbGwgdmFsdWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtwcmludGVyXSAgLSBQcmludGVyIGZ1bmN0aW9uIHRvIGZvcm1hdCB0aGUgdmFsdWVcbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLmNlbGwgPSBmdW5jdGlvbihjb2wsIHZhbCwgcHJpbnRlcikge1xuICB0aGlzLnJvd1tjb2xdID0gdmFsXG4gIHRoaXMucm93Ll9fcHJpbnRlcnNbY29sXSA9IHByaW50ZXIgfHwgc3RyaW5nXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogU3RyaW5nIHRvIHNlcGFyYXRlIGNvbHVtbnNcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuc2VwYXJhdG9yID0gJyAgJ1xuXG5mdW5jdGlvbiBzdHJpbmcodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IHVuZGVmaW5lZCA/ICcnIDogJycrdmFsXG59XG5cbmZ1bmN0aW9uIGxlbmd0aChzdHIpIHtcbiAgdmFyIHMgPSBzdHIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZCttL2csICcnKVxuICByZXR1cm4gd2N3aWR0aCA9PSBudWxsID8gcy5sZW5ndGggOiB3Y3dpZHRoKHMpXG59XG5cbi8qKlxuICogRGVmYXVsdCBwcmludGVyXG4gKi9cblxuVGFibGUuc3RyaW5nID0gc3RyaW5nXG5cbi8qKlxuICogQ3JlYXRlIGEgcHJpbnRlciB3aGljaCByaWdodCBhbGlnbnMgdGhlIGNvbnRlbnQgYnkgcGFkZGluZyB3aXRoIGBjaGAgb24gdGhlIGxlZnRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2hcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuXG5UYWJsZS5sZWZ0UGFkZGVyID0gbGVmdFBhZGRlclxuXG5mdW5jdGlvbiBsZWZ0UGFkZGVyKGNoKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWwsIHdpZHRoKSB7XG4gICAgdmFyIHN0ciA9IHN0cmluZyh2YWwpXG4gICAgdmFyIGxlbiA9IGxlbmd0aChzdHIpXG4gICAgdmFyIHBhZCA9IHdpZHRoID4gbGVuID8gQXJyYXkod2lkdGggLSBsZW4gKyAxKS5qb2luKGNoKSA6ICcnXG4gICAgcmV0dXJuIHBhZCArIHN0clxuICB9XG59XG5cbi8qKlxuICogUHJpbnRlciB3aGljaCByaWdodCBhbGlnbnMgdGhlIGNvbnRlbnRcbiAqL1xuXG52YXIgcGFkTGVmdCA9IFRhYmxlLnBhZExlZnQgPSBsZWZ0UGFkZGVyKCcgJylcblxuLyoqXG4gKiBDcmVhdGUgYSBwcmludGVyIHdoaWNoIHBhZHMgd2l0aCBgY2hgIG9uIHRoZSByaWdodFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjaFxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5cblRhYmxlLnJpZ2h0UGFkZGVyID0gcmlnaHRQYWRkZXJcblxuZnVuY3Rpb24gcmlnaHRQYWRkZXIoY2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHBhZFJpZ2h0KHZhbCwgd2lkdGgpIHtcbiAgICB2YXIgc3RyID0gc3RyaW5nKHZhbClcbiAgICB2YXIgbGVuID0gbGVuZ3RoKHN0cilcbiAgICB2YXIgcGFkID0gd2lkdGggPiBsZW4gPyBBcnJheSh3aWR0aCAtIGxlbiArIDEpLmpvaW4oY2gpIDogJydcbiAgICByZXR1cm4gc3RyICsgcGFkXG4gIH1cbn1cblxudmFyIHBhZFJpZ2h0ID0gcmlnaHRQYWRkZXIoJyAnKVxuXG4vKipcbiAqIENyZWF0ZSBhIHByaW50ZXIgZm9yIG51bWJlcnNcbiAqXG4gKiBXaWxsIGRvIHJpZ2h0IGFsaWdubWVudCBhbmQgb3B0aW9uYWxseSBmaXggdGhlIG51bWJlciBvZiBkaWdpdHMgYWZ0ZXIgZGVjaW1hbCBwb2ludFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGlnaXRzXSAtIE51bWJlciBvZiBkaWdpdHMgZm9yIGZpeHBvaW50IG5vdGF0aW9uXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cblxuVGFibGUubnVtYmVyID0gZnVuY3Rpb24oZGlnaXRzKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWwsIHdpZHRoKSB7XG4gICAgaWYgKHZhbCA9PSBudWxsKSByZXR1cm4gJydcbiAgICBpZiAodHlwZW9mIHZhbCAhPSAnbnVtYmVyJylcbiAgICAgIHRocm93IG5ldyBFcnJvcignJyt2YWwgKyAnIGlzIG5vdCBhIG51bWJlcicpXG4gICAgdmFyIHN0ciA9IGRpZ2l0cyA9PSBudWxsID8gdmFsKycnIDogdmFsLnRvRml4ZWQoZGlnaXRzKVxuICAgIHJldHVybiBwYWRMZWZ0KHN0ciwgd2lkdGgpXG4gIH1cbn1cblxuZnVuY3Rpb24gZWFjaChyb3csIGZuKSB7XG4gIGZvcih2YXIga2V5IGluIHJvdykge1xuICAgIGlmIChrZXkgPT0gJ19fcHJpbnRlcnMnKSBjb250aW51ZVxuICAgIGZuKGtleSwgcm93W2tleV0pXG4gIH1cbn1cblxuLyoqXG4gKiBHZXQgbGlzdCBvZiBjb2x1bW5zIGluIHByaW50aW5nIG9yZGVyXG4gKlxuICogQHJldHVybnMge3N0cmluZ1tdfVxuICovXG5cblRhYmxlLnByb3RvdHlwZS5jb2x1bW5zID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb2xzID0ge31cbiAgZm9yKHZhciBpID0gMDsgaSA8IDI7IGkrKykgeyAvLyBkbyAyIHRpbWVzXG4gICAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgICB2YXIgaWR4ID0gMFxuICAgICAgZWFjaChyb3csIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZHggPSBNYXRoLm1heChpZHgsIGNvbHNba2V5XSB8fCAwKVxuICAgICAgICBjb2xzW2tleV0gPSBpZHhcbiAgICAgICAgaWR4KytcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICByZXR1cm4gT2JqZWN0LmtleXMoY29scykuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGNvbHNbYV0gLSBjb2xzW2JdXG4gIH0pXG59XG5cbi8qKlxuICogRm9ybWF0IGp1c3Qgcm93cywgaS5lLiBwcmludCB0aGUgdGFibGUgd2l0aG91dCBoZWFkZXJzIGFuZCB0b3RhbHNcbiAqXG4gKiBAcmV0dXJucyB7U3RyaW5nfSBTdHJpbmcgcmVwcmVzZW50YWlvbiBvZiB0aGUgdGFibGVcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUucHJpbnQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbHMgPSB0aGlzLmNvbHVtbnMoKVxuICB2YXIgc2VwYXJhdG9yID0gdGhpcy5zZXBhcmF0b3JcbiAgdmFyIHdpZHRocyA9IHt9XG4gIHZhciBvdXQgPSAnJ1xuXG4gIC8vIENhbGMgd2lkdGhzXG4gIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdykge1xuICAgIGVhY2gocm93LCBmdW5jdGlvbihrZXksIHZhbCkge1xuICAgICAgdmFyIHN0ciA9IHJvdy5fX3ByaW50ZXJzW2tleV0uY2FsbChyb3csIHZhbClcbiAgICAgIHdpZHRoc1trZXldID0gTWF0aC5tYXgobGVuZ3RoKHN0ciksIHdpZHRoc1trZXldIHx8IDApXG4gICAgfSlcbiAgfSlcblxuICAvLyBOb3cgcHJpbnRcbiAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgdmFyIGxpbmUgPSAnJ1xuICAgIGNvbHMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHZhciB3aWR0aCA9IHdpZHRoc1trZXldXG4gICAgICB2YXIgc3RyID0gcm93Lmhhc093blByb3BlcnR5KGtleSlcbiAgICAgICAgPyAnJytyb3cuX19wcmludGVyc1trZXldLmNhbGwocm93LCByb3dba2V5XSwgd2lkdGgpXG4gICAgICAgIDogJydcbiAgICAgIGxpbmUgKz0gcGFkUmlnaHQoc3RyLCB3aWR0aCkgKyBzZXBhcmF0b3JcbiAgICB9KVxuICAgIGxpbmUgPSBsaW5lLnNsaWNlKDAsIC1zZXBhcmF0b3IubGVuZ3RoKVxuICAgIG91dCArPSBsaW5lICsgJ1xcbidcbiAgfSlcblxuICByZXR1cm4gb3V0XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSB0YWJsZVxuICpcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblxuVGFibGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBjb2xzID0gdGhpcy5jb2x1bW5zKClcbiAgdmFyIG91dCA9IG5ldyBUYWJsZSgpXG5cbiAgLy8gY29weSBvcHRpb25zXG4gIG91dC5zZXBhcmF0b3IgPSB0aGlzLnNlcGFyYXRvclxuXG4gIC8vIFdyaXRlIGhlYWRlclxuICBjb2xzLmZvckVhY2goZnVuY3Rpb24oY29sKSB7XG4gICAgb3V0LmNlbGwoY29sLCBjb2wpXG4gIH0pXG4gIG91dC5uZXdSb3coKVxuICBvdXQucHVzaERlbGltZXRlcihjb2xzKVxuXG4gIC8vIFdyaXRlIGJvZHlcbiAgb3V0LnJvd3MgPSBvdXQucm93cy5jb25jYXQodGhpcy5yb3dzKVxuXG4gIC8vIFRvdGFsc1xuICBpZiAodGhpcy50b3RhbHMgJiYgdGhpcy5yb3dzLmxlbmd0aCkge1xuICAgIG91dC5wdXNoRGVsaW1ldGVyKGNvbHMpXG4gICAgdGhpcy5mb3JFYWNoVG90YWwob3V0LmNlbGwuYmluZChvdXQpKVxuICAgIG91dC5uZXdSb3coKVxuICB9XG5cbiAgcmV0dXJuIG91dC5wcmludCgpXG59XG5cbi8qKlxuICogUHVzaCBkZWxpbWV0ZXIgcm93IHRvIHRoZSB0YWJsZSAod2l0aCBlYWNoIGNlbGwgZmlsbGVkIHdpdGggZGFzaHMgZHVyaW5nIHByaW50aW5nKVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nW119IFtjb2xzXVxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUucHVzaERlbGltZXRlciA9IGZ1bmN0aW9uKGNvbHMpIHtcbiAgY29scyA9IGNvbHMgfHwgdGhpcy5jb2x1bW5zKClcbiAgY29scy5mb3JFYWNoKGZ1bmN0aW9uKGNvbCkge1xuICAgIHRoaXMuY2VsbChjb2wsIHVuZGVmaW5lZCwgbGVmdFBhZGRlcignLScpKVxuICB9LCB0aGlzKVxuICByZXR1cm4gdGhpcy5uZXdSb3coKVxufVxuXG4vKipcbiAqIENvbXB1dGUgYWxsIHRvdGFscyBhbmQgeWllbGQgdGhlIHJlc3VsdHMgdG8gYGNiYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNiIC0gQ2FsbGJhY2sgZnVuY3Rpb24gd2l0aCBzaWduYXR1cmUgYChjb2x1bW4sIHZhbHVlLCBwcmludGVyKWBcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuZm9yRWFjaFRvdGFsID0gZnVuY3Rpb24oY2IpIHtcbiAgZm9yKHZhciBrZXkgaW4gdGhpcy50b3RhbHMpIHtcbiAgICB2YXIgYWdnciA9IHRoaXMudG90YWxzW2tleV1cbiAgICB2YXIgYWNjID0gYWdnci5pbml0XG4gICAgdmFyIGxlbiA9IHRoaXMucm93cy5sZW5ndGhcbiAgICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3csIGlkeCkge1xuICAgICAgYWNjID0gYWdnci5yZWR1Y2UuY2FsbChyb3csIGFjYywgcm93W2tleV0sIGlkeCwgbGVuKVxuICAgIH0pXG4gICAgY2Ioa2V5LCBhY2MsIGFnZ3IucHJpbnRlcilcbiAgfVxufVxuXG4vKipcbiAqIEZvcm1hdCB0aGUgdGFibGUgc28gdGhhdCBlYWNoIHJvdyByZXByZXNlbnRzIGNvbHVtbiBhbmQgZWFjaCBjb2x1bW4gcmVwcmVzZW50cyByb3dcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wcy5zZXBhcmF0b3JdIC0gQ29sdW1uIHNlcGFyYXRpb24gc3RyaW5nXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5uYW1lUHJpbnRlcl0gLSBQcmludGVyIHRvIGZvcm1hdCBjb2x1bW4gbmFtZXNcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblxuVGFibGUucHJvdG90eXBlLnByaW50VHJhbnNwb3NlZCA9IGZ1bmN0aW9uKG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgdmFyIG91dCA9IG5ldyBUYWJsZVxuICBvdXQuc2VwYXJhdG9yID0gb3B0cy5zZXBhcmF0b3IgfHwgdGhpcy5zZXBhcmF0b3JcbiAgdGhpcy5jb2x1bW5zKCkuZm9yRWFjaChmdW5jdGlvbihjb2wpIHtcbiAgICBvdXQuY2VsbCgwLCBjb2wsIG9wdHMubmFtZVByaW50ZXIpXG4gICAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93LCBpZHgpIHtcbiAgICAgIG91dC5jZWxsKGlkeCsxLCByb3dbY29sXSwgcm93Ll9fcHJpbnRlcnNbY29sXSlcbiAgICB9KVxuICAgIG91dC5uZXdSb3coKVxuICB9LCB0aGlzKVxuICByZXR1cm4gb3V0LnByaW50KClcbn1cblxuLyoqXG4gKiBTb3J0IHRoZSB0YWJsZVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb258c3RyaW5nW119IFtjbXBdIC0gRWl0aGVyIGNvbXBhcmUgZnVuY3Rpb24gb3IgYSBsaXN0IG9mIGNvbHVtbnMgdG8gc29ydCBvblxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uKGNtcCkge1xuICBpZiAodHlwZW9mIGNtcCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhpcy5yb3dzLnNvcnQoY21wKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICB2YXIga2V5cyA9IEFycmF5LmlzQXJyYXkoY21wKSA/IGNtcCA6IHRoaXMuY29sdW1ucygpXG5cbiAgdmFyIGNvbXBhcmF0b3JzID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFyIG9yZGVyID0gJ2FzYydcbiAgICB2YXIgbSA9IC8oLiopXFx8XFxzKihhc2N8ZGVzKVxccyokLy5leGVjKGtleSlcbiAgICBpZiAobSkge1xuICAgICAga2V5ID0gbVsxXVxuICAgICAgb3JkZXIgPSBtWzJdXG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIG9yZGVyID09ICdhc2MnXG4gICAgICAgID8gY29tcGFyZShhW2tleV0sIGJba2V5XSlcbiAgICAgICAgOiBjb21wYXJlKGJba2V5XSwgYVtrZXldKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gdGhpcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbXBhcmF0b3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb3JkZXIgPSBjb21wYXJhdG9yc1tpXShhLCBiKVxuICAgICAgaWYgKG9yZGVyICE9IDApIHJldHVybiBvcmRlclxuICAgIH1cbiAgICByZXR1cm4gMFxuICB9KVxufVxuXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG4gIGlmIChhID09PSB1bmRlZmluZWQpIHJldHVybiAxXG4gIGlmIChiID09PSB1bmRlZmluZWQpIHJldHVybiAtMVxuICBpZiAoYSA9PT0gbnVsbCkgcmV0dXJuIDFcbiAgaWYgKGIgPT09IG51bGwpIHJldHVybiAtMVxuICBpZiAoYSA+IGIpIHJldHVybiAxXG4gIGlmIChhIDwgYikgcmV0dXJuIC0xXG4gIHJldHVybiBjb21wYXJlKFN0cmluZyhhKSwgU3RyaW5nKGIpKVxufVxuXG4vKipcbiAqIEFkZCBhIHRvdGFsIGZvciB0aGUgY29sdW1uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbCAtIGNvbHVtbiBuYW1lXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHNdXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5yZWR1Y2UgPSBzdW1dIC0gcmVkdWNlKGFjYywgdmFsLCBpZHgsIGxlbmd0aCkgZnVuY3Rpb24gdG8gY29tcHV0ZSB0aGUgdG90YWwgdmFsdWVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnByaW50ZXIgPSBwYWRMZWZ0XSAtIFByaW50ZXIgdG8gZm9ybWF0IHRoZSB0b3RhbCBjZWxsXG4gKiBAcGFyYW0ge0FueX0gW29wdHMuaW5pdCA9IDBdIC0gSW5pdGlhbCB2YWx1ZSBmb3IgcmVkdWN0aW9uXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS50b3RhbCA9IGZ1bmN0aW9uKGNvbCwgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuICB0aGlzLnRvdGFscyA9IHRoaXMudG90YWxzIHx8IHt9XG4gIHRoaXMudG90YWxzW2NvbF0gPSB7XG4gICAgcmVkdWNlOiBvcHRzLnJlZHVjZSB8fCBUYWJsZS5hZ2dyLnN1bSxcbiAgICBwcmludGVyOiBvcHRzLnByaW50ZXIgfHwgcGFkTGVmdCxcbiAgICBpbml0OiBvcHRzLmluaXQgPT0gbnVsbCA/IDAgOiBvcHRzLmluaXRcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFByZWRlZmluZWQgaGVscGVycyBmb3IgdG90YWxzXG4gKi9cblxuVGFibGUuYWdnciA9IHt9XG5cbi8qKlxuICogQ3JlYXRlIGEgcHJpbnRlciB3aGljaCBmb3JtYXRzIHRoZSB2YWx1ZSB3aXRoIGBwcmludGVyYCxcbiAqIGFkZHMgdGhlIGBwcmVmaXhgIHRvIGl0IGFuZCByaWdodCBhbGlnbnMgdGhlIHdob2xlIHRoaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHByZWZpeFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJpbnRlclxuICogQHJldHVybnMge3ByaW50ZXJ9XG4gKi9cblxuVGFibGUuYWdnci5wcmludGVyID0gZnVuY3Rpb24ocHJlZml4LCBwcmludGVyKSB7XG4gIHByaW50ZXIgPSBwcmludGVyIHx8IHN0cmluZ1xuICByZXR1cm4gZnVuY3Rpb24odmFsLCB3aWR0aCkge1xuICAgIHJldHVybiBwYWRMZWZ0KHByZWZpeCArIHByaW50ZXIodmFsKSwgd2lkdGgpXG4gIH1cbn1cblxuLyoqXG4gKiBTdW0gcmVkdWN0aW9uXG4gKi9cblxuVGFibGUuYWdnci5zdW0gPSBmdW5jdGlvbihhY2MsIHZhbCkge1xuICByZXR1cm4gYWNjICsgdmFsXG59XG5cbi8qKlxuICogQXZlcmFnZSByZWR1Y3Rpb25cbiAqL1xuXG5UYWJsZS5hZ2dyLmF2ZyA9IGZ1bmN0aW9uKGFjYywgdmFsLCBpZHgsIGxlbikge1xuICBhY2MgPSBhY2MgKyB2YWxcbiAgcmV0dXJuIGlkeCArIDEgPT0gbGVuID8gYWNjL2xlbiA6IGFjY1xufVxuXG4vKipcbiAqIFByaW50IHRoZSBhcnJheSBvciBvYmplY3RcbiAqXG4gKiBAcGFyYW0ge0FycmF5fE9iamVjdH0gb2JqIC0gT2JqZWN0IHRvIHByaW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gW2Zvcm1hdF0gLSBGb3JtYXQgb3B0aW9uc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NiXSAtIFRhYmxlIHBvc3QgcHJvY2Vzc2luZyBhbmQgZm9ybWF0aW5nXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5cblRhYmxlLnByaW50ID0gZnVuY3Rpb24ob2JqLCBmb3JtYXQsIGNiKSB7XG4gIHZhciBvcHRzID0gZm9ybWF0IHx8IHt9XG5cbiAgZm9ybWF0ID0gdHlwZW9mIGZvcm1hdCA9PSAnZnVuY3Rpb24nXG4gICAgPyBmb3JtYXRcbiAgICA6IGZ1bmN0aW9uKG9iaiwgY2VsbCkge1xuICAgICAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmICghb2JqLmhhc093blByb3BlcnR5KGtleSkpIGNvbnRpbnVlXG4gICAgICAgIHZhciBwYXJhbXMgPSBvcHRzW2tleV0gfHwge31cbiAgICAgICAgY2VsbChwYXJhbXMubmFtZSB8fCBrZXksIG9ialtrZXldLCBwYXJhbXMucHJpbnRlcilcbiAgICAgIH1cbiAgICB9XG5cbiAgdmFyIHQgPSBuZXcgVGFibGVcbiAgdmFyIGNlbGwgPSB0LmNlbGwuYmluZCh0KVxuXG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBjYiA9IGNiIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQudG9TdHJpbmcoKSB9XG4gICAgb2JqLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgZm9ybWF0KGl0ZW0sIGNlbGwpXG4gICAgICB0Lm5ld1JvdygpXG4gICAgfSlcbiAgfSBlbHNlIHtcbiAgICBjYiA9IGNiIHx8IGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQucHJpbnRUcmFuc3Bvc2VkKHtzZXBhcmF0b3I6ICcgOiAnfSkgfVxuICAgIGZvcm1hdChvYmosIGNlbGwpXG4gICAgdC5uZXdSb3coKVxuICB9XG5cbiAgcmV0dXJuIGNiKHQpXG59XG5cbi8qKlxuICogU2FtZSBhcyBgVGFibGUucHJpbnQoKWAgYnV0IHlpZWxkcyB0aGUgcmVzdWx0IHRvIGBjb25zb2xlLmxvZygpYFxuICovXG5cblRhYmxlLmxvZyA9IGZ1bmN0aW9uKG9iaiwgZm9ybWF0LCBjYikge1xuICBjb25zb2xlLmxvZyhUYWJsZS5wcmludChvYmosIGZvcm1hdCwgY2IpKVxufVxuXG4vKipcbiAqIFNhbWUgYXMgYC50b1N0cmluZygpYCBidXQgeWllbGRzIHRoZSByZXN1bHQgdG8gYGNvbnNvbGUubG9nKClgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyh0aGlzLnRvU3RyaW5nKCkpXG59XG4iLCJpbXBvcnQgQmVzdFNob3J0U2lkZUZpdCBmcm9tICcuL2hldXJpc3RpY3MvQmVzdFNob3J0U2lkZUZpdCc7XG5pbXBvcnQgQm94IGZyb20gJy4vQm94JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmluIHtcblx0d2lkdGg6IG51bWJlciA9IDA7XG5cdGhlaWdodDogbnVtYmVyPSAwO1xuXHRib3hlczogQm94W10gPSBbXTtcblx0aGV1cmlzdGljOiBhbnkgPSBudWxsO1xuXHRmcmVlUmVjdGFuZ2xlczogRnJlZVNwYWNlQm94W10gPSBbXTtcblxuXHRjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgaGV1cmlzdGljKSB7XG5cdFx0dGhpcy53aWR0aCA9IHdpZHRoO1xuXHRcdHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMgPSBbbmV3IEZyZWVTcGFjZUJveCh3aWR0aCwgaGVpZ2h0KV07XG5cdFx0dGhpcy5oZXVyaXN0aWMgPSBoZXVyaXN0aWMgfHwgbmV3IEJlc3RTaG9ydFNpZGVGaXQoKTtcblx0fVxuXG5cdGdldCBhcmVhKCkge1xuICAgICAgICByZXR1cm4gdGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0O1xuXHR9XG5cblx0Z2V0IGVmZmljaWVuY3koKSB7XG5cdFx0bGV0IGJveGVzQXJlYSA9IDA7XG5cdFx0dGhpcy5ib3hlcy5mb3JFYWNoKChib3gpID0+IHtcblx0XHRcdGJveGVzQXJlYSArPSBib3gud2lkdGggKiBib3guaGVpZ2h0O1xuXHRcdH0pO1xuXHRcdHJldHVybiAoYm94ZXNBcmVhICogMTAwKSAvIHRoaXMuYXJlYTtcblx0fVxuXG5cdGdldCBsYWJlbCgpIHtcblx0XHRyZXR1cm4gYCR7dGhpcy53aWR0aH14JHt0aGlzLmhlaWdodH0gJHt0aGlzLmVmZmljaWVuY3l9JWA7XG5cdH1cblxuXHRpbnNlcnQoYm94OiBCb3gpIHtcblx0XHRpZiAoYm94LnBhY2tlZCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0dGhpcy5oZXVyaXN0aWMuZmluZFBvc2l0aW9uRm9yTmV3Tm9kZShib3gsIHRoaXMuZnJlZVJlY3RhbmdsZXMpO1xuXHRcdGlmICghYm94LnBhY2tlZCkgcmV0dXJuIGZhbHNlO1xuXG5cdFx0bGV0IG51bVJlY3RhbmdsZXNUb1Byb2Nlc3MgPSB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aDtcblx0XHRsZXQgaSA9IDA7XG5cblx0XHR3aGlsZSAoaSA8IG51bVJlY3RhbmdsZXNUb1Byb2Nlc3MpIHtcblx0XHRcdGlmICh0aGlzLnNwbGl0RnJlZU5vZGUodGhpcy5mcmVlUmVjdGFuZ2xlc1tpXSwgYm94KSkge1xuXHRcdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0bnVtUmVjdGFuZ2xlc1RvUHJvY2Vzcy0tO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aSsrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMucHJ1bmVGcmVlTGlzdCgpO1xuXHRcdHRoaXMuYm94ZXMucHVzaChib3gpO1xuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRzY29yZUZvcihib3g6IEJveCkge1xuXHRcdGxldCBjb3B5Qm94ID0gbmV3IEJveChib3gud2lkdGgsIGJveC5oZWlnaHQsIGJveC5jb25zdHJhaW5Sb3RhdGlvbik7XG5cdFx0bGV0IHNjb3JlID0gdGhpcy5oZXVyaXN0aWMuZmluZFBvc2l0aW9uRm9yTmV3Tm9kZShcblx0XHRcdGNvcHlCb3gsXG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzXG5cdFx0KTtcblx0XHRyZXR1cm4gc2NvcmU7XG5cdH1cblxuXHRpc0xhcmdlclRoYW4oYm94OiBCb3gpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0KHRoaXMud2lkdGggPj0gYm94LndpZHRoICYmIHRoaXMuaGVpZ2h0ID49IGJveC5oZWlnaHQpIHx8XG5cdFx0XHQodGhpcy5oZWlnaHQgPj0gYm94LndpZHRoICYmIHRoaXMud2lkdGggPj0gYm94LmhlaWdodClcblx0XHQpO1xuXHR9XG5cblx0c3BsaXRGcmVlTm9kZShmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHQvLyBUZXN0IHdpdGggU0FUIGlmIHRoZSByZWN0YW5nbGVzIGV2ZW4gaW50ZXJzZWN0LlxuXHRcdGlmIChcblx0XHRcdHVzZWROb2RlLnggPj0gZnJlZU5vZGUueCArIGZyZWVOb2RlLndpZHRoIHx8XG5cdFx0XHR1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGggPD0gZnJlZU5vZGUueCB8fFxuXHRcdFx0dXNlZE5vZGUueSA+PSBmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0IHx8XG5cdFx0XHR1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0IDw9IGZyZWVOb2RlLnlcblx0XHQpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR0aGlzLnRyeVNwbGl0RnJlZU5vZGVWZXJ0aWNhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0dGhpcy50cnlTcGxpdEZyZWVOb2RlSG9yaXpvbnRhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHRyeVNwbGl0RnJlZU5vZGVWZXJ0aWNhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmIChcblx0XHRcdHVzZWROb2RlLnggPCBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGggJiZcblx0XHRcdHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCA+IGZyZWVOb2RlLnhcblx0XHQpIHtcblx0XHRcdHRoaXMudHJ5TGVhdmVGcmVlU3BhY2VBdFRvcChmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZUF0Qm90dG9tKGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VBdFRvcChmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAodXNlZE5vZGUueSA+IGZyZWVOb2RlLnkgJiYgdXNlZE5vZGUueSA8IGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS5oZWlnaHQgPSB1c2VkTm9kZS55IC0gbmV3Tm9kZS55O1xuXHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ld05vZGUpO1xuXHRcdH1cblx0fVxuXG5cdHRyeUxlYXZlRnJlZVNwYWNlQXRCb3R0b20oZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQgPCBmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0KSB7XG5cdFx0XHRsZXQgbmV3Tm9kZSA9IHsgLi4uZnJlZU5vZGUgfTtcblx0XHRcdG5ld05vZGUueSA9IHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQ7XG5cdFx0XHRuZXdOb2RlLmhlaWdodCA9XG5cdFx0XHRcdGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQgLSAodXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodCk7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5U3BsaXRGcmVlTm9kZUhvcml6b250YWxseShmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAoXG5cdFx0XHR1c2VkTm9kZS55IDwgZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCAmJlxuXHRcdFx0dXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodCA+IGZyZWVOb2RlLnlcblx0XHQpIHtcblx0XHRcdHRoaXMudHJ5TGVhdmVGcmVlU3BhY2VPbkxlZnQoZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHRcdHRoaXMudHJ5TGVhdmVGcmVlU3BhY2VPblJpZ2h0KGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VPbkxlZnQoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKHVzZWROb2RlLnggPiBmcmVlTm9kZS54ICYmIHVzZWROb2RlLnggPCBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGgpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS53aWR0aCA9IHVzZWROb2RlLnggLSBuZXdOb2RlLng7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VPblJpZ2h0KGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmICh1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGggPCBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGgpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS54ID0gdXNlZE5vZGUueCArIHVzZWROb2RlLndpZHRoO1xuXHRcdFx0bmV3Tm9kZS53aWR0aCA9XG5cdFx0XHRcdGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCAtICh1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGgpO1xuXHRcdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcy5wdXNoKG5ld05vZGUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBHb2VzIHRocm91Z2ggdGhlIGZyZWUgcmVjdGFuZ2xlIGxpc3QgYW5kIHJlbW92ZXMgYW55IHJlZHVuZGFudCBlbnRyaWVzLlxuXHQgKi9cblx0cHJ1bmVGcmVlTGlzdCgpIHtcblx0XHRsZXQgaSA9IDA7XG5cdFx0d2hpbGUgKGkgPCB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aCkge1xuXHRcdFx0bGV0IGogPSBpICsgMTtcblx0XHRcdGlmIChqID09PSB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aCkge1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHdoaWxlIChqIDwgdGhpcy5mcmVlUmVjdGFuZ2xlcy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuaXNDb250YWluZWRJbih0aGlzLmZyZWVSZWN0YW5nbGVzW2ldLCB0aGlzLmZyZWVSZWN0YW5nbGVzW2pdKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnNwbGljZShpLCAxKTtcblx0XHRcdFx0XHRpLS07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKFxuXHRcdFx0XHRcdHRoaXMuaXNDb250YWluZWRJbih0aGlzLmZyZWVSZWN0YW5nbGVzW2pdLCB0aGlzLmZyZWVSZWN0YW5nbGVzW2ldKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnNwbGljZShqLCAxKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRqKys7XG5cdFx0XHRcdH1cblx0XHRcdFx0aSsrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlzQ29udGFpbmVkSW4ocmVjdEEsIHJlY3RCKSB7XG5cdFx0cmV0dXJuIChcblx0XHRcdHJlY3RBICYmXG5cdFx0XHRyZWN0QiAmJlxuXHRcdFx0cmVjdEEueCA+PSByZWN0Qi54ICYmXG5cdFx0XHRyZWN0QS55ID49IHJlY3RCLnkgJiZcblx0XHRcdHJlY3RBLnggKyByZWN0QS53aWR0aCA8PSByZWN0Qi54ICsgcmVjdEIud2lkdGggJiZcblx0XHRcdHJlY3RBLnkgKyByZWN0QS5oZWlnaHQgPD0gcmVjdEIueSArIHJlY3RCLmhlaWdodFxuXHRcdCk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEZyZWVTcGFjZUJveCB7XG4gIHggPSAwXG4gIHkgPSAwXG4gIHdpZHRoID0gbnVsbFxuICBoZWlnaHQgPSBudWxsXG5cbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMud2lkdGggPSB3aWR0aFxuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0XG4gIH1cblxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJveCB7XG5cdHdpZHRoOiBudW1iZXIgPSAwO1xuXHRoZWlnaHQ6IG51bWJlciA9IDA7XG5cdHggPSAwO1xuICAgIHkgPSAwO1xuICAgIGNvbnN0cmFpblJvdGF0aW9uID0gZmFsc2U7XG4gICAgcGFja2VkID0gZmFsc2U7XG5cblx0Y29uc3RydWN0b3Iod2lkdGg6bnVtYmVyICwgaGVpZ2h0OiBudW1iZXIsIGNvbnN0cmFpblJvdGF0aW9uID0gZmFsc2UpIHtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB0aGlzLmNvbnN0cmFpblJvdGF0aW9uID0gY29uc3RyYWluUm90YXRpb247XG5cdH1cbn0iLCJpbXBvcnQgQmluIGZyb20gJy4vQmluJztcbmltcG9ydCBCb3ggZnJvbSAnLi9Cb3gnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4vU2NvcmUnO1xuaW1wb3J0IFNjb3JlQm9hcmQgZnJvbSAnLi9TY29yZUJvYXJkJztcbmltcG9ydCBTY29yZUJvYXJkRW50cnkgZnJvbSAnLi9TY29yZUJvYXJkRW50cnknO1xuXG50eXBlIFBhY2tlZFNjb3JlczxUPiA9IFBhcnRpYWw8U2NvcmVCb2FyZEVudHJ5PiAmIHsgYm94OiBUOyB9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYWNrZXIge1xuXHRiaW5zOiBCaW5bXSA9IFtdO1xuXHR1bnBhY2tlZEJveGVzOiBCb3hbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKGJpbnM6IEJpbltdKSB7XG5cdFx0dGhpcy5iaW5zID0gYmlucztcblx0fVxuXG5cdHBhY2s8VCBleHRlbmRzIEJveD4oYm94ZXM6IFRbXSk6IFBhY2tlZFNjb3JlczxUPltdIHtcbiAgICAgICAgbGV0IHBhY2tlZEJveGVzOiBQYWNrZWRTY29yZXM8VD5bXSA9IFtdO1xuICAgICAgICBsZXQgZW50cnk6IFNjb3JlQm9hcmRFbnRyeSB8IG51bGw7XG5cblx0XHRib3hlcyA9IGJveGVzLmZpbHRlcigoYm94KSA9PiAhYm94LnBhY2tlZCk7XG5cdFx0aWYgKGJveGVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHBhY2tlZEJveGVzO1xuXG5cdFx0bGV0IGxpbWl0ID0gU2NvcmUuTUFYX0lOVDtcblx0XHRsZXQgYm9hcmQgPSBuZXcgU2NvcmVCb2FyZCh0aGlzLmJpbnMsIGJveGVzKTtcblx0XHR3aGlsZSAoKGVudHJ5ID0gYm9hcmQuYmVzdEZpdCgpKSkge1xuXHRcdFx0ZW50cnkuYmluLmluc2VydChlbnRyeS5ib3gpO1xuXHRcdFx0Ym9hcmQucmVtb3ZlQm94KGVudHJ5LmJveCk7XG5cdFx0XHRib2FyZC5yZWNhbGN1bGF0ZUJpbihlbnRyeS5iaW4pO1xuICAgICAgICAgICAgcGFja2VkQm94ZXMucHVzaCh7IGJveDogZW50cnkuYm94IGFzIFQsIHNjb3JlOiBlbnRyeS5zY29yZSB9KTtcblx0XHRcdGlmIChwYWNrZWRCb3hlcy5sZW5ndGggPj0gbGltaXQpIHtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy51bnBhY2tlZEJveGVzID0gYm94ZXMuZmlsdGVyKChib3gpID0+IHtcblx0XHRcdHJldHVybiAhYm94LnBhY2tlZDtcblx0XHR9KTtcblxuXHRcdHJldHVybiBwYWNrZWRCb3hlcztcblx0fVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlIHtcbiAgICBzdGF0aWMgTUFYX0lOVCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuICAgIHNjb3JlXzEgPSBTY29yZS5NQVhfSU5UO1xuICAgIHNjb3JlXzIgPSBTY29yZS5NQVhfSU5UO1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcmVfMT86IG51bWJlciwgc2NvcmVfMj86IG51bWJlcikge1xuICAgICAgICBpZiAodHlwZW9mIHNjb3JlXzEgIT0gJ3VuZGVmaW5lZCcpIHRoaXMuc2NvcmVfMSA9IHNjb3JlXzE7XG4gICAgICAgIGlmICh0eXBlb2Ygc2NvcmVfMiAhPSAndW5kZWZpbmVkJykgdGhpcy5zY29yZV8yID0gc2NvcmVfMjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMb3dlciBpcyBiZXR0ZXJcbiAgICAgKi9cbiAgICB2YWx1ZU9mKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMuc2NvcmVfMSArIHRoaXMuc2NvcmVfMik7XG4gICAgfVxuXG4gICAgYXNzaWduKG90aGVyKSB7XG4gICAgICAgIHRoaXMuc2NvcmVfMSA9IG90aGVyLnNjb3JlXzE7XG4gICAgICAgIHRoaXMuc2NvcmVfMiA9IG90aGVyLnNjb3JlXzI7XG4gICAgfVxuXG4gICAgaXNCbGFuaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NvcmVfMSA9PT0gU2NvcmUuTUFYX0lOVDtcbiAgICB9XG5cbiAgICBkZWNyZWFzZUJ5KGRlbHRhKSB7XG4gICAgICAgIHRoaXMuc2NvcmVfMSArPSBkZWx0YTtcbiAgICAgICAgdGhpcy5zY29yZV8yICs9IGRlbHRhO1xuICAgIH1cbn0iLCIvLyAjICAgICAgIGJveF8xIGJveF8yIGJveF8zIC4uLlxuLy8gIyBiaW5fMSAgMTAwICAgMjAwICAgIDBcbi8vICMgYmluXzIgICAwICAgICA1ICAgICAwXG4vLyAjIGJpbl8zICAgOSAgICAxMDAgICAgMFxuLy8gIyAuLi5cbmltcG9ydCBCaW4gZnJvbSAnLi9CaW4nO1xuaW1wb3J0IEJveCBmcm9tICcuL0JveCc7XG5pbXBvcnQgU2NvcmVCb2FyZEVudHJ5IGZyb20gJy4vU2NvcmVCb2FyZEVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2NvcmVCb2FyZCB7XG5cdGVudHJpZXM6IFNjb3JlQm9hcmRFbnRyeVtdID0gW107XG5cblx0Y29uc3RydWN0b3IoYmluczogQmluW10sIGJveGVzOiBCb3hbXSkge1xuXHRcdGJpbnMuZm9yRWFjaCgoYmluKSA9PiB7XG5cdFx0XHR0aGlzLmFkZEJpbkVudHJpZXMoYmluLCBib3hlcyk7XG5cdFx0fSk7XG5cdH1cblxuXHRkZWJ1ZygpIHtcblx0XHRyZXF1aXJlKCdjb25zb2xlLnRhYmxlJyk7XG5cdFx0Y29uc29sZS50YWJsZShcblx0XHRcdHRoaXMuZW50cmllcy5tYXAoKGVudHJ5KSA9PiAoe1xuXHRcdFx0XHRiaW46IGVudHJ5LmJpbi5sYWJlbCxcblx0XHRcdFx0c2NvcmU6IGVudHJ5LnNjb3JlLFxuXHRcdFx0fSkpXG5cdFx0KTtcblx0fVxuXG5cdGFkZEJpbkVudHJpZXMoYmluLCBib3hlcykge1xuXHRcdGJveGVzLmZvckVhY2goKGJveCkgPT4ge1xuXHRcdFx0bGV0IGVudHJ5ID0gbmV3IFNjb3JlQm9hcmRFbnRyeShiaW4sIGJveCk7XG5cdFx0XHRlbnRyeS5jYWxjdWxhdGUoKTtcblx0XHRcdHRoaXMuZW50cmllcy5wdXNoKGVudHJ5KTtcblx0XHR9KTtcblx0fVxuXG5cdGxhcmdlc3ROb3RGaXRpbmdCb3goKSB7XG4gICAgICAgIGxldCB1bmZpdDogU2NvcmVCb2FyZEVudHJ5O1xuXHRcdGxldCBmaXR0aW5nQm94ZXMgPSB0aGlzLmVudHJpZXNcblx0XHRcdC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5maXQpXG5cdFx0XHQubWFwKChlbnRyeSkgPT4gZW50cnkuYm94KTtcblxuICAgICAgICB0aGlzLmVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVuZml0QXJlYSA9IHVuZml0LmJveC53aWR0aCAqIHVuZml0LmJveC5oZWlnaHQ7XG4gICAgICAgICAgICBjb25zdCBlbnRyeUFyZWEgPSBlbnRyeS5ib3gud2lkdGggKiBlbnRyeS5ib3guaGVpZ2h0O1xuXHRcdFx0aWYgKCFmaXR0aW5nQm94ZXMuaW5jbHVkZXMoZW50cnkuYm94KSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRpZiAodW5maXQgPT09IG51bGwgfHwgdW5maXRBcmVhIDwgZW50cnlBcmVhKSB7XG5cdFx0XHRcdHVuZml0ID0gZW50cnk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gdW5maXQuYm94ID8gdW5maXQgOiBmYWxzZTtcblx0fVxuXG5cdGJlc3RGaXQoKSB7XG5cdFx0bGV0IGJlc3Q6IFNjb3JlQm9hcmRFbnRyeSB8IG51bGwgPSBudWxsO1xuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRsZXQgZW50cnkgPSB0aGlzLmVudHJpZXNbaV07XG5cdFx0XHRpZiAoIWVudHJ5LmZpdCgpKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGJlc3QgPT09IG51bGwgfHwgZW50cnkuc2NvcmUgPCBiZXN0LnNjb3JlKSB7XG5cdFx0XHRcdGJlc3QgPSBlbnRyeTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGJlc3Q7XG5cdH1cblxuXHRyZW1vdmVCb3goYm94KSB7XG5cdFx0dGhpcy5lbnRyaWVzID0gdGhpcy5lbnRyaWVzLmZpbHRlcigoZW50cnkpID0+IHtcblx0XHRcdHJldHVybiBlbnRyeS5ib3ggIT09IGJveDtcblx0XHR9KTtcblx0fVxuXG5cdGFkZEJpbihiaW4pIHtcblx0XHR0aGlzLmFkZEJpbkVudHJpZXMoYmluLCB0aGlzLmN1cnJlbnRCb3hlcygpKTtcblx0fVxuXG5cdHJlY2FsY3VsYXRlQmluKGJpbikge1xuXHRcdHRoaXMuZW50cmllc1xuXHRcdFx0LmZpbHRlcigoZW50cnkpID0+IGVudHJ5LmJpbiA9PT0gYmluKVxuXHRcdFx0LmZvckVhY2goKGVudHJ5KSA9PiBlbnRyeS5jYWxjdWxhdGUoKSk7XG5cdH1cblxuXHRjdXJyZW50Qm94ZXMoKSB7XG5cdFx0cmV0dXJuIFsuLi5uZXcgU2V0KHRoaXMuZW50cmllcy5tYXAoKGVudHJ5KSA9PiBlbnRyeS5ib3gpKV07XG5cdH1cbn1cbiIsImltcG9ydCBCaW4gZnJvbSBcIi4vQmluXCI7XG5pbXBvcnQgQm94IGZyb20gXCIuL0JveFwiO1xuaW1wb3J0IFNjb3JlIGZyb20gXCIuL1Njb3JlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlQm9hcmRFbnRyeSB7XG4gICAgYmluOiBCaW47XG4gICAgYm94OiBCb3g7XG4gICAgc2NvcmU6IFNjb3JlO1xuXG4gICAgY29uc3RydWN0b3IoYmluOiBCaW4sIGJveDogQm94KSB7XG4gICAgICAgIHRoaXMuYmluID0gYmluXG4gICAgICAgIHRoaXMuYm94ID0gYm94XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlKCkge1xuICAgICAgICB0aGlzLnNjb3JlID0gdGhpcy5iaW4uc2NvcmVGb3IodGhpcy5ib3gpO1xuICAgICAgICByZXR1cm4gdGhpcy5zY29yZTtcbiAgICB9XG5cbiAgICBmaXQoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5zY29yZS5pc0JsYW5rKCk7XG4gICAgfVxufSIsImltcG9ydCB7IEZyZWVTcGFjZUJveCB9IGZyb20gJy4uL0Jpbic7XG5pbXBvcnQgQm94IGZyb20gJy4uL0JveCc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlIHtcblx0ZmluZFBvc2l0aW9uRm9yTmV3Tm9kZShib3g6IEJveCwgZnJlZVJlY3RzOiBGcmVlU3BhY2VCb3hbXSkge1xuXHRcdGxldCBiZXN0U2NvcmUgPSBuZXcgU2NvcmUoKTtcblx0XHRsZXQgd2lkdGggPSBib3gud2lkdGg7XG5cdFx0bGV0IGhlaWdodCA9IGJveC5oZWlnaHQ7XG5cblx0XHRmcmVlUmVjdHMuZm9yRWFjaCgoZnJlZVJlY3QpID0+IHtcblx0XHRcdHRoaXMudHJ5UGxhY2VSZWN0SW4oZnJlZVJlY3QsIGJveCwgd2lkdGgsIGhlaWdodCwgYmVzdFNjb3JlKTtcblx0XHRcdGlmICghYm94LmNvbnN0cmFpblJvdGF0aW9uKSB7XG5cdFx0XHRcdHRoaXMudHJ5UGxhY2VSZWN0SW4oZnJlZVJlY3QsIGJveCwgaGVpZ2h0LCB3aWR0aCwgYmVzdFNjb3JlKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHJldHVybiBiZXN0U2NvcmU7XG5cdH1cblxuXHR0cnlQbGFjZVJlY3RJbihmcmVlUmVjdCwgYm94OiBCb3gsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCwgYmVzdFNjb3JlKSB7XG5cdFx0aWYgKGZyZWVSZWN0LndpZHRoID49IHJlY3RXaWR0aCAmJiBmcmVlUmVjdC5oZWlnaHQgPj0gcmVjdEhlaWdodCkge1xuXHRcdFx0bGV0IHNjb3JlID0gdGhpcy5jYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KTtcblx0XHRcdGlmIChzY29yZSA8IGJlc3RTY29yZSkge1xuXHRcdFx0XHRib3gueCA9IGZyZWVSZWN0Lng7XG5cdFx0XHRcdGJveC55ID0gZnJlZVJlY3QueTtcblx0XHRcdFx0Ym94LndpZHRoID0gcmVjdFdpZHRoO1xuXHRcdFx0XHRib3guaGVpZ2h0ID0gcmVjdEhlaWdodDtcblx0XHRcdFx0Ym94LnBhY2tlZCA9IHRydWU7XG5cdFx0XHRcdGJlc3RTY29yZS5hc3NpZ24oc2NvcmUpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGNhbGN1bGF0ZVNjb3JlKF9mcmVlUmVjdCwgX3JlY3RXaWR0aCwgX3JlY3RIZWlnaHQpOiBTY29yZSB7XG5cdFx0dGhyb3cgJ05vdEltcGxlbWVudGVkRXJyb3InO1xuXHR9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gICAgWyAweDAzMDAsIDB4MDM2RiBdLCBbIDB4MDQ4MywgMHgwNDg2IF0sIFsgMHgwNDg4LCAweDA0ODkgXSxcbiAgICBbIDB4MDU5MSwgMHgwNUJEIF0sIFsgMHgwNUJGLCAweDA1QkYgXSwgWyAweDA1QzEsIDB4MDVDMiBdLFxuICAgIFsgMHgwNUM0LCAweDA1QzUgXSwgWyAweDA1QzcsIDB4MDVDNyBdLCBbIDB4MDYwMCwgMHgwNjAzIF0sXG4gICAgWyAweDA2MTAsIDB4MDYxNSBdLCBbIDB4MDY0QiwgMHgwNjVFIF0sIFsgMHgwNjcwLCAweDA2NzAgXSxcbiAgICBbIDB4MDZENiwgMHgwNkU0IF0sIFsgMHgwNkU3LCAweDA2RTggXSwgWyAweDA2RUEsIDB4MDZFRCBdLFxuICAgIFsgMHgwNzBGLCAweDA3MEYgXSwgWyAweDA3MTEsIDB4MDcxMSBdLCBbIDB4MDczMCwgMHgwNzRBIF0sXG4gICAgWyAweDA3QTYsIDB4MDdCMCBdLCBbIDB4MDdFQiwgMHgwN0YzIF0sIFsgMHgwOTAxLCAweDA5MDIgXSxcbiAgICBbIDB4MDkzQywgMHgwOTNDIF0sIFsgMHgwOTQxLCAweDA5NDggXSwgWyAweDA5NEQsIDB4MDk0RCBdLFxuICAgIFsgMHgwOTUxLCAweDA5NTQgXSwgWyAweDA5NjIsIDB4MDk2MyBdLCBbIDB4MDk4MSwgMHgwOTgxIF0sXG4gICAgWyAweDA5QkMsIDB4MDlCQyBdLCBbIDB4MDlDMSwgMHgwOUM0IF0sIFsgMHgwOUNELCAweDA5Q0QgXSxcbiAgICBbIDB4MDlFMiwgMHgwOUUzIF0sIFsgMHgwQTAxLCAweDBBMDIgXSwgWyAweDBBM0MsIDB4MEEzQyBdLFxuICAgIFsgMHgwQTQxLCAweDBBNDIgXSwgWyAweDBBNDcsIDB4MEE0OCBdLCBbIDB4MEE0QiwgMHgwQTREIF0sXG4gICAgWyAweDBBNzAsIDB4MEE3MSBdLCBbIDB4MEE4MSwgMHgwQTgyIF0sIFsgMHgwQUJDLCAweDBBQkMgXSxcbiAgICBbIDB4MEFDMSwgMHgwQUM1IF0sIFsgMHgwQUM3LCAweDBBQzggXSwgWyAweDBBQ0QsIDB4MEFDRCBdLFxuICAgIFsgMHgwQUUyLCAweDBBRTMgXSwgWyAweDBCMDEsIDB4MEIwMSBdLCBbIDB4MEIzQywgMHgwQjNDIF0sXG4gICAgWyAweDBCM0YsIDB4MEIzRiBdLCBbIDB4MEI0MSwgMHgwQjQzIF0sIFsgMHgwQjRELCAweDBCNEQgXSxcbiAgICBbIDB4MEI1NiwgMHgwQjU2IF0sIFsgMHgwQjgyLCAweDBCODIgXSwgWyAweDBCQzAsIDB4MEJDMCBdLFxuICAgIFsgMHgwQkNELCAweDBCQ0QgXSwgWyAweDBDM0UsIDB4MEM0MCBdLCBbIDB4MEM0NiwgMHgwQzQ4IF0sXG4gICAgWyAweDBDNEEsIDB4MEM0RCBdLCBbIDB4MEM1NSwgMHgwQzU2IF0sIFsgMHgwQ0JDLCAweDBDQkMgXSxcbiAgICBbIDB4MENCRiwgMHgwQ0JGIF0sIFsgMHgwQ0M2LCAweDBDQzYgXSwgWyAweDBDQ0MsIDB4MENDRCBdLFxuICAgIFsgMHgwQ0UyLCAweDBDRTMgXSwgWyAweDBENDEsIDB4MEQ0MyBdLCBbIDB4MEQ0RCwgMHgwRDREIF0sXG4gICAgWyAweDBEQ0EsIDB4MERDQSBdLCBbIDB4MEREMiwgMHgwREQ0IF0sIFsgMHgwREQ2LCAweDBERDYgXSxcbiAgICBbIDB4MEUzMSwgMHgwRTMxIF0sIFsgMHgwRTM0LCAweDBFM0EgXSwgWyAweDBFNDcsIDB4MEU0RSBdLFxuICAgIFsgMHgwRUIxLCAweDBFQjEgXSwgWyAweDBFQjQsIDB4MEVCOSBdLCBbIDB4MEVCQiwgMHgwRUJDIF0sXG4gICAgWyAweDBFQzgsIDB4MEVDRCBdLCBbIDB4MEYxOCwgMHgwRjE5IF0sIFsgMHgwRjM1LCAweDBGMzUgXSxcbiAgICBbIDB4MEYzNywgMHgwRjM3IF0sIFsgMHgwRjM5LCAweDBGMzkgXSwgWyAweDBGNzEsIDB4MEY3RSBdLFxuICAgIFsgMHgwRjgwLCAweDBGODQgXSwgWyAweDBGODYsIDB4MEY4NyBdLCBbIDB4MEY5MCwgMHgwRjk3IF0sXG4gICAgWyAweDBGOTksIDB4MEZCQyBdLCBbIDB4MEZDNiwgMHgwRkM2IF0sIFsgMHgxMDJELCAweDEwMzAgXSxcbiAgICBbIDB4MTAzMiwgMHgxMDMyIF0sIFsgMHgxMDM2LCAweDEwMzcgXSwgWyAweDEwMzksIDB4MTAzOSBdLFxuICAgIFsgMHgxMDU4LCAweDEwNTkgXSwgWyAweDExNjAsIDB4MTFGRiBdLCBbIDB4MTM1RiwgMHgxMzVGIF0sXG4gICAgWyAweDE3MTIsIDB4MTcxNCBdLCBbIDB4MTczMiwgMHgxNzM0IF0sIFsgMHgxNzUyLCAweDE3NTMgXSxcbiAgICBbIDB4MTc3MiwgMHgxNzczIF0sIFsgMHgxN0I0LCAweDE3QjUgXSwgWyAweDE3QjcsIDB4MTdCRCBdLFxuICAgIFsgMHgxN0M2LCAweDE3QzYgXSwgWyAweDE3QzksIDB4MTdEMyBdLCBbIDB4MTdERCwgMHgxN0REIF0sXG4gICAgWyAweDE4MEIsIDB4MTgwRCBdLCBbIDB4MThBOSwgMHgxOEE5IF0sIFsgMHgxOTIwLCAweDE5MjIgXSxcbiAgICBbIDB4MTkyNywgMHgxOTI4IF0sIFsgMHgxOTMyLCAweDE5MzIgXSwgWyAweDE5MzksIDB4MTkzQiBdLFxuICAgIFsgMHgxQTE3LCAweDFBMTggXSwgWyAweDFCMDAsIDB4MUIwMyBdLCBbIDB4MUIzNCwgMHgxQjM0IF0sXG4gICAgWyAweDFCMzYsIDB4MUIzQSBdLCBbIDB4MUIzQywgMHgxQjNDIF0sIFsgMHgxQjQyLCAweDFCNDIgXSxcbiAgICBbIDB4MUI2QiwgMHgxQjczIF0sIFsgMHgxREMwLCAweDFEQ0EgXSwgWyAweDFERkUsIDB4MURGRiBdLFxuICAgIFsgMHgyMDBCLCAweDIwMEYgXSwgWyAweDIwMkEsIDB4MjAyRSBdLCBbIDB4MjA2MCwgMHgyMDYzIF0sXG4gICAgWyAweDIwNkEsIDB4MjA2RiBdLCBbIDB4MjBEMCwgMHgyMEVGIF0sIFsgMHgzMDJBLCAweDMwMkYgXSxcbiAgICBbIDB4MzA5OSwgMHgzMDlBIF0sIFsgMHhBODA2LCAweEE4MDYgXSwgWyAweEE4MEIsIDB4QTgwQiBdLFxuICAgIFsgMHhBODI1LCAweEE4MjYgXSwgWyAweEZCMUUsIDB4RkIxRSBdLCBbIDB4RkUwMCwgMHhGRTBGIF0sXG4gICAgWyAweEZFMjAsIDB4RkUyMyBdLCBbIDB4RkVGRiwgMHhGRUZGIF0sIFsgMHhGRkY5LCAweEZGRkIgXSxcbiAgICBbIDB4MTBBMDEsIDB4MTBBMDMgXSwgWyAweDEwQTA1LCAweDEwQTA2IF0sIFsgMHgxMEEwQywgMHgxMEEwRiBdLFxuICAgIFsgMHgxMEEzOCwgMHgxMEEzQSBdLCBbIDB4MTBBM0YsIDB4MTBBM0YgXSwgWyAweDFEMTY3LCAweDFEMTY5IF0sXG4gICAgWyAweDFEMTczLCAweDFEMTgyIF0sIFsgMHgxRDE4NSwgMHgxRDE4QiBdLCBbIDB4MUQxQUEsIDB4MUQxQUQgXSxcbiAgICBbIDB4MUQyNDIsIDB4MUQyNDQgXSwgWyAweEUwMDAxLCAweEUwMDAxIF0sIFsgMHhFMDAyMCwgMHhFMDA3RiBdLFxuICAgIFsgMHhFMDEwMCwgMHhFMDFFRiBdXG5dXG4iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgZGVmYXVsdHMgPSByZXF1aXJlKCdkZWZhdWx0cycpXG52YXIgY29tYmluaW5nID0gcmVxdWlyZSgnLi9jb21iaW5pbmcnKVxuXG52YXIgREVGQVVMVFMgPSB7XG4gIG51bDogMCxcbiAgY29udHJvbDogMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdjd2lkdGgoc3RyKSB7XG4gIHJldHVybiB3Y3N3aWR0aChzdHIsIERFRkFVTFRTKVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jb25maWcgPSBmdW5jdGlvbihvcHRzKSB7XG4gIG9wdHMgPSBkZWZhdWx0cyhvcHRzIHx8IHt9LCBERUZBVUxUUylcbiAgcmV0dXJuIGZ1bmN0aW9uIHdjd2lkdGgoc3RyKSB7XG4gICAgcmV0dXJuIHdjc3dpZHRoKHN0ciwgb3B0cylcbiAgfVxufVxuXG4vKlxuICogIFRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIGRlZmluZSB0aGUgY29sdW1uIHdpZHRoIG9mIGFuIElTTyAxMDY0NlxuICogIGNoYXJhY3RlciBhcyBmb2xsb3dzOlxuICogIC0gVGhlIG51bGwgY2hhcmFjdGVyIChVKzAwMDApIGhhcyBhIGNvbHVtbiB3aWR0aCBvZiAwLlxuICogIC0gT3RoZXIgQzAvQzEgY29udHJvbCBjaGFyYWN0ZXJzIGFuZCBERUwgd2lsbCBsZWFkIHRvIGEgcmV0dXJuIHZhbHVlXG4gKiAgICBvZiAtMS5cbiAqICAtIE5vbi1zcGFjaW5nIGFuZCBlbmNsb3NpbmcgY29tYmluaW5nIGNoYXJhY3RlcnMgKGdlbmVyYWwgY2F0ZWdvcnlcbiAqICAgIGNvZGUgTW4gb3IgTWUgaW4gdGhlXG4gKiAgICBVbmljb2RlIGRhdGFiYXNlKSBoYXZlIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBTT0ZUIEhZUEhFTiAoVSswMEFEKSBoYXMgYSBjb2x1bW4gd2lkdGggb2YgMS5cbiAqICAtIE90aGVyIGZvcm1hdCBjaGFyYWN0ZXJzIChnZW5lcmFsIGNhdGVnb3J5IGNvZGUgQ2YgaW4gdGhlIFVuaWNvZGVcbiAqICAgIGRhdGFiYXNlKSBhbmQgWkVSTyBXSURUSFxuICogICAgU1BBQ0UgKFUrMjAwQikgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAwLlxuICogIC0gSGFuZ3VsIEphbW8gbWVkaWFsIHZvd2VscyBhbmQgZmluYWwgY29uc29uYW50cyAoVSsxMTYwLVUrMTFGRilcbiAqICAgIGhhdmUgYSBjb2x1bW4gd2lkdGggb2YgMC5cbiAqICAtIFNwYWNpbmcgY2hhcmFjdGVycyBpbiB0aGUgRWFzdCBBc2lhbiBXaWRlIChXKSBvciBFYXN0IEFzaWFuXG4gKiAgICBGdWxsLXdpZHRoIChGKSBjYXRlZ29yeSBhc1xuICogICAgZGVmaW5lZCBpbiBVbmljb2RlIFRlY2huaWNhbCBSZXBvcnQgIzExIGhhdmUgYSBjb2x1bW4gd2lkdGggb2YgMi5cbiAqICAtIEFsbCByZW1haW5pbmcgY2hhcmFjdGVycyAoaW5jbHVkaW5nIGFsbCBwcmludGFibGUgSVNPIDg4NTktMSBhbmRcbiAqICAgIFdHTDQgY2hhcmFjdGVycywgVW5pY29kZSBjb250cm9sIGNoYXJhY3RlcnMsIGV0Yy4pIGhhdmUgYSBjb2x1bW5cbiAqICAgIHdpZHRoIG9mIDEuXG4gKiAgVGhpcyBpbXBsZW1lbnRhdGlvbiBhc3N1bWVzIHRoYXQgY2hhcmFjdGVycyBhcmUgZW5jb2RlZCBpbiBJU08gMTA2NDYuXG4qL1xuXG5mdW5jdGlvbiB3Y3N3aWR0aChzdHIsIG9wdHMpIHtcbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSByZXR1cm4gd2N3aWR0aChzdHIsIG9wdHMpXG5cbiAgdmFyIHMgPSAwXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIG4gPSB3Y3dpZHRoKHN0ci5jaGFyQ29kZUF0KGkpLCBvcHRzKVxuICAgIGlmIChuIDwgMCkgcmV0dXJuIC0xXG4gICAgcyArPSBuXG4gIH1cblxuICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiB3Y3dpZHRoKHVjcywgb3B0cykge1xuICAvLyB0ZXN0IGZvciA4LWJpdCBjb250cm9sIGNoYXJhY3RlcnNcbiAgaWYgKHVjcyA9PT0gMCkgcmV0dXJuIG9wdHMubnVsXG4gIGlmICh1Y3MgPCAzMiB8fCAodWNzID49IDB4N2YgJiYgdWNzIDwgMHhhMCkpIHJldHVybiBvcHRzLmNvbnRyb2xcblxuICAvLyBiaW5hcnkgc2VhcmNoIGluIHRhYmxlIG9mIG5vbi1zcGFjaW5nIGNoYXJhY3RlcnNcbiAgaWYgKGJpc2VhcmNoKHVjcykpIHJldHVybiAwXG5cbiAgLy8gaWYgd2UgYXJyaXZlIGhlcmUsIHVjcyBpcyBub3QgYSBjb21iaW5pbmcgb3IgQzAvQzEgY29udHJvbCBjaGFyYWN0ZXJcbiAgcmV0dXJuIDEgK1xuICAgICAgKHVjcyA+PSAweDExMDAgJiZcbiAgICAgICAodWNzIDw9IDB4MTE1ZiB8fCAgICAgICAgICAgICAgICAgICAgICAgLy8gSGFuZ3VsIEphbW8gaW5pdC4gY29uc29uYW50c1xuICAgICAgICB1Y3MgPT0gMHgyMzI5IHx8IHVjcyA9PSAweDIzMmEgfHxcbiAgICAgICAgKHVjcyA+PSAweDJlODAgJiYgdWNzIDw9IDB4YTRjZiAmJlxuICAgICAgICAgdWNzICE9IDB4MzAzZikgfHwgICAgICAgICAgICAgICAgICAgICAvLyBDSksgLi4uIFlpXG4gICAgICAgICh1Y3MgPj0gMHhhYzAwICYmIHVjcyA8PSAweGQ3YTMpIHx8ICAgIC8vIEhhbmd1bCBTeWxsYWJsZXNcbiAgICAgICAgKHVjcyA+PSAweGY5MDAgJiYgdWNzIDw9IDB4ZmFmZikgfHwgICAgLy8gQ0pLIENvbXBhdGliaWxpdHkgSWRlb2dyYXBoc1xuICAgICAgICAodWNzID49IDB4ZmUxMCAmJiB1Y3MgPD0gMHhmZTE5KSB8fCAgICAvLyBWZXJ0aWNhbCBmb3Jtc1xuICAgICAgICAodWNzID49IDB4ZmUzMCAmJiB1Y3MgPD0gMHhmZTZmKSB8fCAgICAvLyBDSksgQ29tcGF0aWJpbGl0eSBGb3Jtc1xuICAgICAgICAodWNzID49IDB4ZmYwMCAmJiB1Y3MgPD0gMHhmZjYwKSB8fCAgICAvLyBGdWxsd2lkdGggRm9ybXNcbiAgICAgICAgKHVjcyA+PSAweGZmZTAgJiYgdWNzIDw9IDB4ZmZlNikgfHxcbiAgICAgICAgKHVjcyA+PSAweDIwMDAwICYmIHVjcyA8PSAweDJmZmZkKSB8fFxuICAgICAgICAodWNzID49IDB4MzAwMDAgJiYgdWNzIDw9IDB4M2ZmZmQpKSk7XG59XG5cbmZ1bmN0aW9uIGJpc2VhcmNoKHVjcykge1xuICB2YXIgbWluID0gMFxuICB2YXIgbWF4ID0gY29tYmluaW5nLmxlbmd0aCAtIDFcbiAgdmFyIG1pZFxuXG4gIGlmICh1Y3MgPCBjb21iaW5pbmdbMF1bMF0gfHwgdWNzID4gY29tYmluaW5nW21heF1bMV0pIHJldHVybiBmYWxzZVxuXG4gIHdoaWxlIChtYXggPj0gbWluKSB7XG4gICAgbWlkID0gTWF0aC5mbG9vcigobWluICsgbWF4KSAvIDIpXG4gICAgaWYgKHVjcyA+IGNvbWJpbmluZ1ttaWRdWzFdKSBtaW4gPSBtaWQgKyAxXG4gICAgZWxzZSBpZiAodWNzIDwgY29tYmluaW5nW21pZF1bMF0pIG1heCA9IG1pZCAtIDFcbiAgICBlbHNlIHJldHVybiB0cnVlXG4gIH1cblxuICByZXR1cm4gZmFsc2Vcbn1cbiIsImltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZXN0QXJlYUZpdCBleHRlbmRzIEJhc2Uge1xuXG4gIGNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpIHtcbiAgICBsZXQgYXJlYUZpdCA9IGZyZWVSZWN0LndpZHRoICogZnJlZVJlY3QuaGVpZ2h0IC0gcmVjdFdpZHRoICogcmVjdEhlaWdodDtcbiAgICBsZXQgbGVmdE92ZXJIb3JpeiA9IE1hdGguYWJzKGZyZWVSZWN0LndpZHRoIC0gcmVjdFdpZHRoKTtcbiAgICBsZXQgbGVmdE92ZXJWZXJ0ID0gTWF0aC5hYnMoZnJlZVJlY3QuaGVpZ2h0IC0gcmVjdEhlaWdodCk7XG4gICAgbGV0IHNob3J0U2lkZUZpdCA9IE1hdGgubWluKGxlZnRPdmVySG9yaXosIGxlZnRPdmVyVmVydCk7XG4gICAgcmV0dXJuIG5ldyBTY29yZShhcmVhRml0LCBzaG9ydFNpZGVGaXQpO1xuICB9XG5cbn0iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVzdExvbmdTaWRlRml0IGV4dGVuZHMgQmFzZSB7XG5cbiAgY2FsY3VsYXRlU2NvcmUoZnJlZVJlY3QsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCkge1xuICAgIGxldCBsZWZ0T3Zlckhvcml6ID0gTWF0aC5hYnMoZnJlZVJlY3Qud2lkdGggLSByZWN0V2lkdGgpO1xuICAgIGxldCBsZWZ0T3ZlclZlcnQgPSBNYXRoLmFicyhmcmVlUmVjdC5oZWlnaHQgLSByZWN0SGVpZ2h0KTtcbiAgICBsZXQgYXJncyA9IFtsZWZ0T3Zlckhvcml6LCBsZWZ0T3ZlclZlcnRdLnNvcnQoKGEsIGIpID0+IGEgLSBiKS5yZXZlcnNlKCk7XG4gICAgcmV0dXJuIG5ldyBTY29yZShhcmdzWzBdLCBhcmdzWzFdKTtcbiAgfVxuXG59IiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlc3RTaG9ydFNpZGVGaXQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IGxlZnRPdmVySG9yaXogPSBNYXRoLmFicyhmcmVlUmVjdC53aWR0aCAtIHJlY3RXaWR0aCk7XG4gICAgbGV0IGxlZnRPdmVyVmVydCA9IE1hdGguYWJzKGZyZWVSZWN0LmhlaWdodCAtIHJlY3RIZWlnaHQpO1xuICAgIGxldCBhcmdzID0gW2xlZnRPdmVySG9yaXosIGxlZnRPdmVyVmVydF0uc29ydCgoYSwgYikgPT4gYSAtIGIpO1xuICAgIGxldCBzY29yZSA9IG5ldyBTY29yZShhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICByZXR1cm4gc2NvcmU7XG4gIH1cblxufSIsImltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCb3R0b21MZWZ0IGV4dGVuZHMgQmFzZSB7XG5cbiAgY2FsY3VsYXRlU2NvcmUoZnJlZVJlY3QsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCkge1xuICAgIGxldCB0b3BTaWRlWSA9IGZyZWVSZWN0LnkgKyByZWN0SGVpZ2h0O1xuICAgIHJldHVybiBuZXcgU2NvcmUodG9wU2lkZVksIGZyZWVSZWN0LngpO1xuICB9XG5cbn0iLCJleHBvcnQgeyBkZWZhdWx0IGFzIEJlc3RBcmVhRml0IH0gZnJvbSAnLi9CZXN0QXJlYUZpdCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJlc3RMb25nU2lkZUZpdCB9IGZyb20gJy4vQmVzdExvbmdTaWRlRml0JztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgQmVzdFNob3J0U2lkZUZpdCB9IGZyb20gJy4vQmVzdFNob3J0U2lkZUZpdCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJvdHRvbUxlZnQgfSBmcm9tICcuL0JvdHRvbUxlZnQnOyIsImltcG9ydCBCaW4gZnJvbSAnLi9CaW4nXG5pbXBvcnQgQm94IGZyb20gJy4vQm94J1xuaW1wb3J0IFBhY2tlciBmcm9tICcuL1BhY2tlcidcbmltcG9ydCAqIGFzIGhldXJpc3RpY3MgZnJvbSAnLi9oZXVyaXN0aWNzJztcblxuZXhwb3J0IHsgQmluLCBCb3gsIFBhY2tlciwgaGV1cmlzdGljcyB9OyIsImltcG9ydCB7IGZhY3RvcmVkSW50ZWdlciB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge2NyZWF0ZUxvZ2dlcn0gZnJvbSBcIi4uL2xpYi9sb2dcIjtcbmNvbnN0IGxvZyA9IGNyZWF0ZUxvZ2dlcignM0Q6Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpbiB7XG5cbiAgbmFtZSA9ICcnO1xuICB3aWR0aCA9IDA7XG4gIGhlaWdodCA9IDA7XG4gIGRlcHRoID0gMDtcbiAgbWF4V2VpZ2h0ID0gMDtcblxuICBpdGVtcyA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUsIHcsIGgsIGQsIG13KSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLndpZHRoID0gZmFjdG9yZWRJbnRlZ2VyKCB3ICk7XG4gICAgdGhpcy5oZWlnaHQgPSBmYWN0b3JlZEludGVnZXIoIGggKTtcbiAgICB0aGlzLmRlcHRoID0gZmFjdG9yZWRJbnRlZ2VyKCBkICk7XG4gICAgdGhpcy5tYXhXZWlnaHQgPSBmYWN0b3JlZEludGVnZXIoIG13ICk7XG4gIH1cblxuICBnZXROYW1lKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgfVxuXG4gIGdldEhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XG4gIH1cblxuICBnZXREZXB0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXB0aDtcbiAgfVxuXG4gIGdldE1heFdlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXhXZWlnaHQ7XG4gIH1cblxuICBnZXRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcztcbiAgfVxuXG4gIGdldFZvbHVtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRXaWR0aCgpICogdGhpcy5nZXRIZWlnaHQoKSAqIHRoaXMuZ2V0RGVwdGgoKTtcbiAgfVxuXG4gIGdldFBhY2tlZFdlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5yZWR1Y2UoICggd2VpZ2h0LCBpdGVtICkgPT4gd2VpZ2h0ICsgaXRlbS5nZXRXZWlnaHQoKSwgMCApO1xuICB9XG5cbiAgd2VpZ2hJdGVtKGl0ZW0pIHtcbiAgICBjb25zdCBtYXhXZWlnaHQgPSB0aGlzLmdldE1heFdlaWdodCgpO1xuICAgIHJldHVybiAhIG1heFdlaWdodCB8fCBpdGVtLmdldFdlaWdodCgpICsgdGhpcy5nZXRQYWNrZWRXZWlnaHQoKSA8PSBtYXhXZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlIGEgc2NvcmUgZm9yIGEgZ2l2ZW4gaXRlbSBhbmQgcm90YXRpb24gdHlwZS5cbiAgICpcbiAgICogU2NvcmVzIGFyZSBoaWdoZXIgZm9yIHJvdGF0aW9ucyB0aGF0IGNsb3Nlc3QgbWF0Y2ggaXRlbSBkaW1lbnNpb25zIHRvIEJpbiBkaW1lbnNpb25zLlxuICAgKiBGb3IgZXhhbXBsZSwgcm90YXRpbmcgdGhlIGl0ZW0gc28gdGhlIGxvbmdlc3Qgc2lkZSBpcyBhbGlnbmVkIHdpdGggdGhlIGxvbmdlc3QgQmluIHNpZGUuXG4gICAqXG4gICAqIEV4YW1wbGUgKEJpbiBpcyAxMSB4IDguNSB4IDUuNSwgSXRlbSBpcyA4LjEgeCA1LjIgeCA1LjIpOlxuICAgKiAgUm90YXRpb24gMDpcbiAgICogICAgOC4xIC8gMTEgID0gMC43MzZcbiAgICogICAgNS4yIC8gOC41ID0gMC42MTJcbiAgICogICAgNS4yIC8gNS41ID0gMC45NDVcbiAgICogICAgLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogICAgMC43MzYgKiogMiArIDAuNjEyICoqIDIgKyAwLjk0NSAqKiAyID0gMS44MDlcbiAgICpcbiAgICogIFJvdGF0aW9uIDE6XG4gICAqICAgIDguMSAvIDguNSA9IDAuOTUzXG4gICAqICAgIDUuMiAvIDExID0gMC40NzNcbiAgICogICAgNS4yIC8gNS41ID0gMC45NDVcbiAgICogICAgLS0tLS0tLS0tLS0tLS0tLS1cbiAgICogICAgMC45NTMgKiogMiArIDAuNDczICoqIDIgKyAwLjk0NSAqKiAyID0gMi4wMjVcbiAgICpcbiAgICogQHBhcmFtIHtJdGVtfSBpdGVtXG4gICAqIEBwYXJhbSB7aW50fSByb3RhdGlvblR5cGVcbiAgICogQHJldHVybiB7ZmxvYXR9IHNjb3JlXG4gICAqL1xuICBzY29yZVJvdGF0aW9uKGl0ZW0sIHJvdGF0aW9uVHlwZSkge1xuICAgIGl0ZW0ucm90YXRpb25UeXBlID0gcm90YXRpb25UeXBlO1xuICAgIGxldCBkID0gaXRlbS5nZXREaW1lbnNpb24oKTtcblxuICAgIC8vIElmIHRoZSBpdGVtIGRvZXNuJ3QgZml0IGluIHRoZSBCaW5cbiAgICBpZiAoIHRoaXMuZ2V0V2lkdGgoKSA8IGRbMF0gfHwgdGhpcy5nZXRIZWlnaHQoKSA8IGRbMV0gfHwgdGhpcy5nZXREZXB0aCgpIDwgZFsyXSApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgLy8gU3F1YXJlIHRoZSByZXN1bHRzIHRvIGluY3JlYXNlIHRoZSBpbXBhY3Qgb2YgaGlnaCB2YWx1ZXMgKGUuZy4gPiAwLjgpXG4gICAgY29uc3Qgd2lkdGhTY29yZSA9IE1hdGgucG93KCBkWzBdIC8gdGhpcy5nZXRXaWR0aCgpLCAyICk7XG4gICAgY29uc3QgaGVpZ2h0U2NvcmUgPSBNYXRoLnBvdyggZFsxXSAvIHRoaXMuZ2V0SGVpZ2h0KCksIDIgKTtcbiAgICBjb25zdCBkZXB0aFNjb3JlID0gTWF0aC5wb3coIGRbMl0gLyB0aGlzLmdldERlcHRoKCksIDIgKTtcblxuICAgIHJldHVybiB3aWR0aFNjb3JlICsgaGVpZ2h0U2NvcmUgKyBkZXB0aFNjb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgYmVzdCByb3RhdGlvbiBvcmRlciBmb3IgYSBnaXZlbiBJdGVtIGJhc2VkIG9uIHNjb3JlUm90YXRpb24oKS5cbiAgICpcbiAgICogQHBhcmFtIHtJdGVtfSBpdGVtXG4gICAqIEByZXR1cm4ge0FycmF5fSBSb3RhdGlvbiB0eXBlcyBzb3J0ZWQgYnkgdGhlaXIgc2NvcmUsIERFU0NcbiAgICovXG4gIGdldEJlc3RSb3RhdGlvbk9yZGVyKGl0ZW0pIHtcbiAgICBjb25zdCByb3RhdGlvblNjb3JlcyA9IHt9O1xuXG4gICAgLy8gU2NvcmUgYWxsIHJvdGF0aW9uIHR5cGVzXG5cdGZvciAobGV0IGk9MDsgaTxpdGVtLmFsbG93ZWRSb3RhdGlvbi5sZW5ndGg7IGkrKykge1xuXHQgICAgY29uc3QgciA9IGl0ZW0uYWxsb3dlZFJvdGF0aW9uW2ldO1xuXHRcdHJvdGF0aW9uU2NvcmVzW3JdID0gdGhpcy5zY29yZVJvdGF0aW9uKCBpdGVtLCByICk7XG4gICAgfVxuXG4gICAgLy8gU29ydCB0aGUgcm90YXRpb24gdHlwZXMgKGluZGV4IG9mIHNjb3JlcyBvYmplY3QpIERFU0NcbiAgICAvLyBhbmQgZW5zdXJlIEludCB2YWx1ZXMgKE9iamVjdC5rZXlzIHJldHVybnMgc3RyaW5ncylcbiAgICBjb25zdCBzb3J0ZWRSb3RhdGlvbnMgPSBPYmplY3Qua2V5cyggcm90YXRpb25TY29yZXMgKS5zb3J0KCAoIGEsIGIgKSA9PiB7XG4gICAgICByZXR1cm4gcm90YXRpb25TY29yZXNbYl0gLSByb3RhdGlvblNjb3Jlc1thXTtcbiAgICB9ICkubWFwKCBOdW1iZXIgKTtcblxuICAgIHJldHVybiBzb3J0ZWRSb3RhdGlvbnM7XG4gIH1cblxuICBwdXRJdGVtKGl0ZW0sIHApIHtcbiAgICBjb25zdCBib3ggPSB0aGlzO1xuICAgIGxldCBmaXQgPSBmYWxzZTtcbiAgICBjb25zdCByb3RhdGlvbnMgPSB0aGlzLmdldEJlc3RSb3RhdGlvbk9yZGVyKCBpdGVtICk7XG4gICAgaXRlbS5wb3NpdGlvbiA9IHA7XG5cbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCByb3RhdGlvbnMubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpdGVtLnJvdGF0aW9uVHlwZSA9IHJvdGF0aW9uc1tpXTtcbiAgICAgIGxldCBkID0gaXRlbS5nZXREaW1lbnNpb24oKTtcblxuICAgICAgaWYgKGJveC5nZXRXaWR0aCgpIDwgcFswXSArIGRbMF0gfHwgYm94LmdldEhlaWdodCgpIDwgcFsxXSArIGRbMV0gfHwgYm94LmdldERlcHRoKCkgPCBwWzJdICsgZFsyXSkge1xuICAgICAgICBmaXQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpdCA9IHRydWU7XG5cbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPGJveC5pdGVtcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGxldCBfaiA9IGJveC5pdGVtc1tqXTtcbiAgICAgICAgICBpZiAoX2ouaW50ZXJzZWN0KGl0ZW0pKSB7XG4gICAgICAgICAgICBmaXQgPSBmYWxzZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmaXQpIHtcbiAgICAgICAgICBib3guaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsb2coJ3RyeSB0byBwdXRJdGVtJywgZml0LCAnaXRlbScsIGl0ZW0udG9TdHJpbmcoKSwgJ2JveCcsIGJveC50b1N0cmluZygpKTtcblxuICAgICAgaWYgKGZpdCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZpdDtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgQmluOiR7dGhpcy5uYW1lfSAoV3hIeEQgPSAke3RoaXMuZ2V0V2lkdGgoKX14JHt0aGlzLmdldEhlaWdodCgpfXgke3RoaXMuZ2V0RGVwdGgoKX0sIE1heFdnLiA9ICR7dGhpcy5nZXRNYXhXZWlnaHQoKX0pYDtcbiAgfVxuXG59IiwiaW1wb3J0IHsgZmFjdG9yZWRJbnRlZ2VyIH0gZnJvbSAnLi91dGlsJztcblxuZXhwb3J0IGNvbnN0IFJvdGF0aW9uVHlwZV9XSEQgPSAwO1xuZXhwb3J0IGNvbnN0IFJvdGF0aW9uVHlwZV9IV0QgPSAxO1xuZXhwb3J0IGNvbnN0IFJvdGF0aW9uVHlwZV9IRFcgPSAyO1xuZXhwb3J0IGNvbnN0IFJvdGF0aW9uVHlwZV9ESFcgPSAzO1xuZXhwb3J0IGNvbnN0IFJvdGF0aW9uVHlwZV9EV0ggPSA0O1xuZXhwb3J0IGNvbnN0IFJvdGF0aW9uVHlwZV9XREggPSA1O1xuXG5leHBvcnQgY29uc3QgV2lkdGhBeGlzID0gMDtcbmV4cG9ydCBjb25zdCBIZWlnaHRBeGlzID0gMTtcbmV4cG9ydCBjb25zdCBEZXB0aEF4aXMgPSAyO1xuXG5leHBvcnQgY29uc3QgU3RhcnRQb3NpdGlvbiA9IFswLCAwLCAwXTtcblxuZXhwb3J0IGNvbnN0IFJvdGF0aW9uVHlwZVN0cmluZ3MgPSB7XG4gIFtSb3RhdGlvblR5cGVfV0hEXTogJ1JvdGF0aW9uVHlwZV9XSEQgKHcsaCxkKScsXG4gIFtSb3RhdGlvblR5cGVfSFdEXTogJ1JvdGF0aW9uVHlwZV9IV0QgKGgsdyxkKScsXG4gIFtSb3RhdGlvblR5cGVfSERXXTogJ1JvdGF0aW9uVHlwZV9IRFcgKGgsZCx3KScsXG4gIFtSb3RhdGlvblR5cGVfREhXXTogJ1JvdGF0aW9uVHlwZV9ESFcgKGQsaCx3KScsXG4gIFtSb3RhdGlvblR5cGVfRFdIXTogJ1JvdGF0aW9uVHlwZV9EV0ggKGQsdyxoKScsXG4gIFtSb3RhdGlvblR5cGVfV0RIXTogJ1JvdGF0aW9uVHlwZV9XREggKHcsZCxoKScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJdGVtIHtcblxuICBuYW1lID0gJyc7XG4gIHdpZHRoID0gMDtcbiAgaGVpZ2h0ID0gMDtcbiAgZGVwdGggPSAwO1xuICB3ZWlnaHQgPSAwO1xuICBhbGxvd2VkUm90YXRpb24gPSBbMCwxLDIsMyw0LDVdO1xuXG4gIHJvdGF0aW9uVHlwZSA9IFJvdGF0aW9uVHlwZV9XSEQ7XG4gIHBvc2l0aW9uID0gW107IC8vIHgsIHksIHpcblxuICBjb25zdHJ1Y3RvcihuYW1lLCB3LCBoLCBkLCB3ZywgYWxsb3dlZFJvdGF0aW9uKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLndpZHRoID0gZmFjdG9yZWRJbnRlZ2VyKCB3ICk7XG4gICAgdGhpcy5oZWlnaHQgPSBmYWN0b3JlZEludGVnZXIoIGggKTtcbiAgICB0aGlzLmRlcHRoID0gZmFjdG9yZWRJbnRlZ2VyKCBkICk7XG4gICAgdGhpcy53ZWlnaHQgPSBmYWN0b3JlZEludGVnZXIoIHdnICk7XG4gICAgdGhpcy5hbGxvd2VkUm90YXRpb24gPSBhbGxvd2VkUm90YXRpb24gPyBhbGxvd2VkUm90YXRpb24gOiB0aGlzLmFsbG93ZWRSb3RhdGlvbjtcbiAgfVxuXG4gIGdldFdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLndpZHRoO1xuICB9XG5cbiAgZ2V0SGVpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIGdldERlcHRoKCkge1xuICAgIHJldHVybiB0aGlzLmRlcHRoO1xuICB9XG5cbiAgZ2V0V2VpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLndlaWdodDtcbiAgfVxuXG4gIGdldFJvdGF0aW9uVHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy5yb3RhdGlvblR5cGU7XG4gIH1cblxuICBnZXRBbGxvd2VkUm90YXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsb3dlZFJvdGF0aW9uO1xuICB9XG5cbiAgZ2V0Um90YXRpb25UeXBlU3RyaW5nKCkge1xuICAgIHJldHVybiBSb3RhdGlvblR5cGVTdHJpbmdzW3RoaXMuZ2V0Um90YXRpb25UeXBlKCldO1xuICB9XG5cbiAgZ2V0RGltZW5zaW9uKCkge1xuICAgIGxldCBkO1xuICAgIHN3aXRjaCAodGhpcy5yb3RhdGlvblR5cGUpIHtcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX1dIRDpcbiAgICAgICAgZCA9IFt0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCksIHRoaXMuZ2V0RGVwdGgoKV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfSFdEOlxuICAgICAgICBkID0gW3RoaXMuZ2V0SGVpZ2h0KCksIHRoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXREZXB0aCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9IRFc6XG4gICAgICAgIGQgPSBbdGhpcy5nZXRIZWlnaHQoKSwgdGhpcy5nZXREZXB0aCgpLCB0aGlzLmdldFdpZHRoKCldO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX0RIVzpcbiAgICAgICAgZCA9IFt0aGlzLmdldERlcHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCksIHRoaXMuZ2V0V2lkdGgoKV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfRFdIOlxuICAgICAgICBkID0gW3RoaXMuZ2V0RGVwdGgoKSwgdGhpcy5nZXRXaWR0aCgpLCB0aGlzLmdldEhlaWdodCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9XREg6XG4gICAgICAgIGQgPSBbdGhpcy5nZXRXaWR0aCgpLCB0aGlzLmdldERlcHRoKCksIHRoaXMuZ2V0SGVpZ2h0KCldO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIGQ7XG4gIH1cblxuICBpbnRlcnNlY3QoaTIpIHtcbiAgICByZXR1cm4gcmVjdEludGVyc2VjdCh0aGlzLCBpMiwgV2lkdGhBeGlzLCBIZWlnaHRBeGlzKSAmJlxuICAgICAgICByZWN0SW50ZXJzZWN0KHRoaXMsIGkyLCBIZWlnaHRBeGlzLCBEZXB0aEF4aXMpICYmXG4gICAgICAgIHJlY3RJbnRlcnNlY3QodGhpcywgaTIsIFdpZHRoQXhpcywgRGVwdGhBeGlzKTtcbiAgfVxuXG4gIGdldFZvbHVtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRXaWR0aCgpICogdGhpcy5nZXRIZWlnaHQoKSAqIHRoaXMuZ2V0RGVwdGgoKTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgSXRlbToke3RoaXMubmFtZX0gKCR7dGhpcy5nZXRSb3RhdGlvblR5cGVTdHJpbmcoKX0gPSAke3RoaXMuZ2V0RGltZW5zaW9uKCkuam9pbigneCcpfSwgV2cuID0gJHt0aGlzLndlaWdodH0pYDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmVjdEludGVyc2VjdCA9IChpMSwgaTIsIHgsIHkpID0+IHtcbiAgbGV0IGQxLCBkMiwgY3gxLCBjeTEsIGN4MiwgY3kyLCBpeCwgaXk7XG5cbiAgZDEgPSBpMS5nZXREaW1lbnNpb24oKTtcbiAgZDIgPSBpMi5nZXREaW1lbnNpb24oKTtcblxuICBjeDEgPSBpMS5wb3NpdGlvblt4XSArIGQxW3hdIC8gMjtcbiAgY3kxID0gaTEucG9zaXRpb25beV0gKyBkMVt5XSAvIDI7XG4gIGN4MiA9IGkyLnBvc2l0aW9uW3hdICsgZDJbeF0gLyAyO1xuICBjeTIgPSBpMi5wb3NpdGlvblt5XSArIGQyW3ldIC8gMjtcblxuICBpeCA9IE1hdGgubWF4KGN4MSwgY3gyKSAtIE1hdGgubWluKGN4MSwgY3gyKTtcbiAgaXkgPSBNYXRoLm1heChjeTEsIGN5MikgLSBNYXRoLm1pbihjeTEsIGN5Mik7XG5cbiAgcmV0dXJuIGl4IDwgKGQxW3hdICsgZDJbeF0pIC8gMiAmJiBpeSA8IChkMVt5XSArIGQyW3ldKSAvIDI7XG59OyIsImltcG9ydCBCaW4gZnJvbSAnLi9CaW4nO1xuaW1wb3J0IHtcbiAgSXRlbSxcbiAgU3RhcnRQb3NpdGlvbixcbiAgV2lkdGhBeGlzLFxuICBIZWlnaHRBeGlzLFxuICBEZXB0aEF4aXNcbn0gZnJvbSAnLi9JdGVtJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2VyIHtcblxuICBiaW5zID0gW107XG4gIGl0ZW1zID0gW107XG4gIHVuZml0SXRlbXMgPSBbXTtcblxuICBhZGRCaW4oYmluKSB7XG4gICAgdGhpcy5iaW5zLnB1c2goYmluKTtcbiAgfVxuXG4gIGFkZEl0ZW0oaXRlbSkge1xuICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcbiAgfVxuXG4gIGZpbmRGaXR0ZWRCaW4oaSkge1xuICAgIGZvciAobGV0IF9pPTA7IF9pPHRoaXMuYmlucy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIGxldCBiID0gdGhpcy5iaW5zW19pXTtcblxuICAgICAgaWYgKCFiLndlaWdoSXRlbShpKSB8fCAhYi5wdXRJdGVtKGksIFN0YXJ0UG9zaXRpb24pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYi5pdGVtcy5sZW5ndGggPT09IDEgJiYgYi5pdGVtc1swXSA9PT0gaSkge1xuICAgICAgICBiLml0ZW1zID0gW107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGdldEJpZ2dlckJpblRoYW4oYikge1xuICAgIGxldCB2ID0gYi5nZXRWb2x1bWUoKTtcbiAgICBmb3IgKGxldCBfaT0wOyBfaTx0aGlzLmJpbnM7IF9pKyspIHtcbiAgICAgIGxldCBiMiA9IHRoaXMuYmluc1tfaV07XG4gICAgICBpZiAoYjIuZ2V0Vm9sdW1lKCkgPiB2KSB7XG4gICAgICAgIHJldHVybiBiMjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB1bmZpdEl0ZW0oKSB7XG4gICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudW5maXRJdGVtcy5wdXNoKHRoaXMuaXRlbXNbMF0pO1xuICAgIHRoaXMuaXRlbXMuc3BsaWNlKDAsIDEpO1xuICB9XG5cbiAgcGFja1RvQmluKGIsIGl0ZW1zKSB7XG4gICAgbGV0IGIyID0gbnVsbDtcbiAgICBsZXQgdW5wYWNrZWQgPSBbXTtcbiAgICBsZXQgZml0ID0gYi53ZWlnaEl0ZW0oaXRlbXNbMF0pICYmIGIucHV0SXRlbShpdGVtc1swXSwgU3RhcnRQb3NpdGlvbik7XG5cbiAgICBpZiAoIWZpdCkge1xuICAgICAgbGV0IGIyID0gdGhpcy5nZXRCaWdnZXJCaW5UaGFuKGIpO1xuICAgICAgaWYgKGIyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhY2tUb0JpbihiMiwgaXRlbXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaXRlbXM7XG4gICAgfVxuXG4gICAgLy8gUGFjayB1bnBhY2tlZCBpdGVtcy5cbiAgICBmb3IgKGxldCBfaT0xOyBfaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICBsZXQgZml0dGVkID0gZmFsc2U7XG4gICAgICBsZXQgaXRlbSA9IHRoaXMuaXRlbXNbX2ldO1xuXG4gICAgICBpZiAoYi53ZWlnaEl0ZW0oaXRlbSkpIHtcbiAgICAgICAgLy8gVHJ5IGF2YWlsYWJsZSBwaXZvdHMgaW4gY3VycmVudCBiaW4gdGhhdCBhcmUgbm90IGludGVyc2VjdCB3aXRoXG4gICAgICAgIC8vIGV4aXN0aW5nIGl0ZW1zIGluIGN1cnJlbnQgYmluLlxuICAgICAgICBsb29rdXA6XG4gICAgICAgIGZvciAobGV0IF9wdD0wOyBfcHQgPCAzOyBfcHQrKykge1xuICAgICAgICAgIGZvciAobGV0IF9qPTA7IF9qIDwgYi5pdGVtcy5sZW5ndGg7IF9qKyspIHtcbiAgICAgICAgICAgIGxldCBwdjtcbiAgICAgICAgICAgIGxldCBpYiA9IGIuaXRlbXNbX2pdO1xuICAgICAgICAgICAgbGV0IGQgPSBpYi5nZXREaW1lbnNpb24oKTtcbiAgICAgICAgICAgIHN3aXRjaCAoX3B0KSB7XG4gICAgICAgICAgICAgIGNhc2UgV2lkdGhBeGlzOlxuICAgICAgICAgICAgICAgIHB2ID0gW2liLnBvc2l0aW9uWzBdICsgZFswXSwgaWIucG9zaXRpb25bMV0sIGliLnBvc2l0aW9uWzJdXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBIZWlnaHRBeGlzOlxuICAgICAgICAgICAgICAgIHB2ID0gW2liLnBvc2l0aW9uWzBdLCBpYi5wb3NpdGlvblsxXSArIGRbMV0sIGliLnBvc2l0aW9uWzJdXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBEZXB0aEF4aXM6XG4gICAgICAgICAgICAgICAgcHYgPSBbaWIucG9zaXRpb25bMF0sIGliLnBvc2l0aW9uWzFdLCBpYi5wb3NpdGlvblsyXSArIGRbMl1dO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYi5wdXRJdGVtKGl0ZW0sIHB2KSkge1xuICAgICAgICAgICAgICBmaXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBicmVhayBsb29rdXA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZml0dGVkKSB7XG4gICAgICAgIHdoaWxlIChiMiAhPT0gbnVsbCkge1xuICAgICAgICAgIGIyID0gdGhpcy5nZXRCaWdnZXJCaW5UaGFuKGIpO1xuICAgICAgICAgIGlmIChiMikge1xuICAgICAgICAgICAgYjIuaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIGxldCBsZWZ0ID0gdGhpcy5wYWNrVG9CaW4oYjIsIGIyLml0ZW1zKTtcbiAgICAgICAgICAgIGlmIChsZWZ0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICBiID0gYjI7XG4gICAgICAgICAgICAgIGZpdHRlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZml0dGVkKSB7XG4gICAgICAgICAgdW5wYWNrZWQucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bnBhY2tlZDtcbiAgfVxuXG4gIHBhY2soKSB7XG4gICAgLy8gU29ydCBiaW5zIHNtYWxsZXN0IHRvIGxhcmdlc3QuXG4gICAgdGhpcy5iaW5zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLmdldFZvbHVtZSgpIC0gYi5nZXRWb2x1bWUoKTtcbiAgICB9KTtcblxuICAgIC8vIFNvcnQgaXRlbXMgbGFyZ2VzdCB0byBzbWFsbGVzdC5cbiAgICB0aGlzLml0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBiLmdldFZvbHVtZSgpIC0gYS5nZXRWb2x1bWUoKTtcbiAgICB9KTtcblxuICAgIHdoaWxlICh0aGlzLml0ZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBiaW4gPSB0aGlzLmZpbmRGaXR0ZWRCaW4odGhpcy5pdGVtc1swXSk7XG5cbiAgICAgIGlmIChiaW4gPT09IG51bGwpIHtcbiAgICAgICAgdGhpcy51bmZpdEl0ZW0oKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLnBhY2tUb0JpbihiaW4sIHRoaXMuaXRlbXMpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgQmluIGZyb20gJy4vQmluJztcbmltcG9ydCBJdGVtIGZyb20gJy4vSXRlbSc7XG5pbXBvcnQgUGFja2VyIGZyb20gJy4vUGFja2VyJztcblxuZXhwb3J0IHsgQmluLCBJdGVtLCBQYWNrZXIgfTsiLCIvKipcbiAqIFByZWNpc2lvbiB0byByZXRhaW4gaW4gZmFjdG9yZWRJbnRlZ2VyKClcbiAqL1xuY29uc3QgRkFDVE9SID0gNTtcblxuLyoqXG4gKiBGYWN0b3IgYSBudW1iZXIgYnkgRkFDVE9SIGFuZCByb3VuZCB0byB0aGUgbmVhcmVzdCB3aG9sZSBudW1iZXJcbiAqL1xuZXhwb3J0IGNvbnN0IGZhY3RvcmVkSW50ZWdlciA9ICggdmFsdWUgKSA9PiAoXG4gICAgTWF0aC5yb3VuZCggdmFsdWUgKiAoIDEwICoqIEZBQ1RPUiApIClcbik7XG4iLCJsZXQgaXNMb2dFbmFibGVkID0gZmFsc2U7XG5leHBvcnQgZnVuY3Rpb24gZW5hYmxlTG9nKGVuYWJsZSA9IHRydWUpIHtcbiAgICBpc0xvZ0VuYWJsZWQgPSBlbmFibGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMb2dnZXIobmFtZXNwYWNlID0gJ2JpbnBhY2tpbmdqcycpIHtcbiAgICByZXR1cm4gbG9nLmJpbmQodW5kZWZpbmVkLCBuYW1lc3BhY2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nKG5hbWVzcGFjZSwgLi4uYXJncykge1xuICAgIHJldHVybiBpc0xvZ0VuYWJsZWQgPyBjb25zb2xlLmRlYnVnLmFwcGx5KGNvbnNvbGUsIFtuYW1lc3BhY2VdLmNvbmNhdChhcmdzKSkgOiB1bmRlZmluZWQ7XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAqIGFzIEJQMkQgZnJvbSAnLi8yRCc7XG5pbXBvcnQgKiBhcyBCUDNEIGZyb20gJy4vM0QnO1xuXG5leHBvcnQgeyBCUDJELCBCUDNEIH07Il0sInNvdXJjZVJvb3QiOiIifQ==