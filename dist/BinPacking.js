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

/***/ "./2D/Types.ts":
/*!*********************!*\
  !*** ./2D/Types.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);



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
/* harmony export */   "BP3D": function() { return /* reexport module object */ _3D__WEBPACK_IMPORTED_MODULE_1__; },
/* harmony export */   "Types": function() { return /* reexport module object */ _2D_Types__WEBPACK_IMPORTED_MODULE_2__; }
/* harmony export */ });
/* harmony import */ var _2D__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./2D */ "./2D/index.js");
/* harmony import */ var _3D__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./3D */ "./3D/index.js");
/* harmony import */ var _2D_Types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./2D/Types */ "./2D/Types.ts");





}();
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jbG9uZS9jbG9uZS5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy9jb25zb2xlLnRhYmxlL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2RlZmF1bHRzL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi4vbm9kZV9tb2R1bGVzL2Vhc3ktdGFibGUvdGFibGUuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL0Jpbi50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvQm94LnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9QYWNrZXIudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL1Njb3JlLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkLnRzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9TY29yZUJvYXJkRW50cnkudHMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvQmFzZS50cyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2NvbWJpbmluZy5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4uL25vZGVfbW9kdWxlcy93Y3dpZHRoL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RBcmVhRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0Jlc3RMb25nU2lkZUZpdC5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vMkQvaGV1cmlzdGljcy9CZXN0U2hvcnRTaWRlRml0LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8yRC9oZXVyaXN0aWNzL0JvdHRvbUxlZnQuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2hldXJpc3RpY3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzJEL2luZGV4LmpzIiwid2VicGFjazovL0JpblBhY2tpbmcvLi8zRC9CaW4uanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL0l0ZW0uanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL1BhY2tlci5qcyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nLy4vM0QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uLzNEL3V0aWwuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy8uL2xpYi9sb2cuanMiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9CaW5QYWNraW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQmluUGFja2luZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0JpblBhY2tpbmcvLi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7O0FDVkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRCxJQUFJLEtBQTBCO0FBQzlCO0FBQ0E7Ozs7Ozs7Ozs7O0FDcktBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsZ0JBQWdCLG1CQUFPLENBQUMsdURBQVk7O0FBRXBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNB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QUNQO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVPO0FBQ1A7QUFDQSxDOzs7Ozs7VUNYQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLDZDQUE2Qyx3REFBd0QsRTs7Ozs7V0NBckc7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjZCO0FBQ0E7QUFDTztBQUVQIiwiZmlsZSI6IkJpblBhY2tpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIkJpblBhY2tpbmdcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQmluUGFja2luZ1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJCaW5QYWNraW5nXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwidmFyIGNsb25lID0gKGZ1bmN0aW9uKCkge1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIENsb25lcyAoY29waWVzKSBhbiBPYmplY3QgdXNpbmcgZGVlcCBjb3B5aW5nLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gc3VwcG9ydHMgY2lyY3VsYXIgcmVmZXJlbmNlcyBieSBkZWZhdWx0LCBidXQgaWYgeW91IGFyZSBjZXJ0YWluXG4gKiB0aGVyZSBhcmUgbm8gY2lyY3VsYXIgcmVmZXJlbmNlcyBpbiB5b3VyIG9iamVjdCwgeW91IGNhbiBzYXZlIHNvbWUgQ1BVIHRpbWVcbiAqIGJ5IGNhbGxpbmcgY2xvbmUob2JqLCBmYWxzZSkuXG4gKlxuICogQ2F1dGlvbjogaWYgYGNpcmN1bGFyYCBpcyBmYWxzZSBhbmQgYHBhcmVudGAgY29udGFpbnMgY2lyY3VsYXIgcmVmZXJlbmNlcyxcbiAqIHlvdXIgcHJvZ3JhbSBtYXkgZW50ZXIgYW4gaW5maW5pdGUgbG9vcCBhbmQgY3Jhc2guXG4gKlxuICogQHBhcmFtIGBwYXJlbnRgIC0gdGhlIG9iamVjdCB0byBiZSBjbG9uZWRcbiAqIEBwYXJhbSBgY2lyY3VsYXJgIC0gc2V0IHRvIHRydWUgaWYgdGhlIG9iamVjdCB0byBiZSBjbG9uZWQgbWF5IGNvbnRhaW5cbiAqICAgIGNpcmN1bGFyIHJlZmVyZW5jZXMuIChvcHRpb25hbCAtIHRydWUgYnkgZGVmYXVsdClcbiAqIEBwYXJhbSBgZGVwdGhgIC0gc2V0IHRvIGEgbnVtYmVyIGlmIHRoZSBvYmplY3QgaXMgb25seSB0byBiZSBjbG9uZWQgdG9cbiAqICAgIGEgcGFydGljdWxhciBkZXB0aC4gKG9wdGlvbmFsIC0gZGVmYXVsdHMgdG8gSW5maW5pdHkpXG4gKiBAcGFyYW0gYHByb3RvdHlwZWAgLSBzZXRzIHRoZSBwcm90b3R5cGUgdG8gYmUgdXNlZCB3aGVuIGNsb25pbmcgYW4gb2JqZWN0LlxuICogICAgKG9wdGlvbmFsIC0gZGVmYXVsdHMgdG8gcGFyZW50IHByb3RvdHlwZSkuXG4qL1xuZnVuY3Rpb24gY2xvbmUocGFyZW50LCBjaXJjdWxhciwgZGVwdGgsIHByb3RvdHlwZSkge1xuICB2YXIgZmlsdGVyO1xuICBpZiAodHlwZW9mIGNpcmN1bGFyID09PSAnb2JqZWN0Jykge1xuICAgIGRlcHRoID0gY2lyY3VsYXIuZGVwdGg7XG4gICAgcHJvdG90eXBlID0gY2lyY3VsYXIucHJvdG90eXBlO1xuICAgIGZpbHRlciA9IGNpcmN1bGFyLmZpbHRlcjtcbiAgICBjaXJjdWxhciA9IGNpcmN1bGFyLmNpcmN1bGFyXG4gIH1cbiAgLy8gbWFpbnRhaW4gdHdvIGFycmF5cyBmb3IgY2lyY3VsYXIgcmVmZXJlbmNlcywgd2hlcmUgY29ycmVzcG9uZGluZyBwYXJlbnRzXG4gIC8vIGFuZCBjaGlsZHJlbiBoYXZlIHRoZSBzYW1lIGluZGV4XG4gIHZhciBhbGxQYXJlbnRzID0gW107XG4gIHZhciBhbGxDaGlsZHJlbiA9IFtdO1xuXG4gIHZhciB1c2VCdWZmZXIgPSB0eXBlb2YgQnVmZmVyICE9ICd1bmRlZmluZWQnO1xuXG4gIGlmICh0eXBlb2YgY2lyY3VsYXIgPT0gJ3VuZGVmaW5lZCcpXG4gICAgY2lyY3VsYXIgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZGVwdGggPT0gJ3VuZGVmaW5lZCcpXG4gICAgZGVwdGggPSBJbmZpbml0eTtcblxuICAvLyByZWN1cnNlIHRoaXMgZnVuY3Rpb24gc28gd2UgZG9uJ3QgcmVzZXQgYWxsUGFyZW50cyBhbmQgYWxsQ2hpbGRyZW5cbiAgZnVuY3Rpb24gX2Nsb25lKHBhcmVudCwgZGVwdGgpIHtcbiAgICAvLyBjbG9uaW5nIG51bGwgYWx3YXlzIHJldHVybnMgbnVsbFxuICAgIGlmIChwYXJlbnQgPT09IG51bGwpXG4gICAgICByZXR1cm4gbnVsbDtcblxuICAgIGlmIChkZXB0aCA9PSAwKVxuICAgICAgcmV0dXJuIHBhcmVudDtcblxuICAgIHZhciBjaGlsZDtcbiAgICB2YXIgcHJvdG87XG4gICAgaWYgKHR5cGVvZiBwYXJlbnQgIT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuXG4gICAgaWYgKGNsb25lLl9faXNBcnJheShwYXJlbnQpKSB7XG4gICAgICBjaGlsZCA9IFtdO1xuICAgIH0gZWxzZSBpZiAoY2xvbmUuX19pc1JlZ0V4cChwYXJlbnQpKSB7XG4gICAgICBjaGlsZCA9IG5ldyBSZWdFeHAocGFyZW50LnNvdXJjZSwgX19nZXRSZWdFeHBGbGFncyhwYXJlbnQpKTtcbiAgICAgIGlmIChwYXJlbnQubGFzdEluZGV4KSBjaGlsZC5sYXN0SW5kZXggPSBwYXJlbnQubGFzdEluZGV4O1xuICAgIH0gZWxzZSBpZiAoY2xvbmUuX19pc0RhdGUocGFyZW50KSkge1xuICAgICAgY2hpbGQgPSBuZXcgRGF0ZShwYXJlbnQuZ2V0VGltZSgpKTtcbiAgICB9IGVsc2UgaWYgKHVzZUJ1ZmZlciAmJiBCdWZmZXIuaXNCdWZmZXIocGFyZW50KSkge1xuICAgICAgaWYgKEJ1ZmZlci5hbGxvY1Vuc2FmZSkge1xuICAgICAgICAvLyBOb2RlLmpzID49IDQuNS4wXG4gICAgICAgIGNoaWxkID0gQnVmZmVyLmFsbG9jVW5zYWZlKHBhcmVudC5sZW5ndGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT2xkZXIgTm9kZS5qcyB2ZXJzaW9uc1xuICAgICAgICBjaGlsZCA9IG5ldyBCdWZmZXIocGFyZW50Lmxlbmd0aCk7XG4gICAgICB9XG4gICAgICBwYXJlbnQuY29weShjaGlsZCk7XG4gICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvdG90eXBlID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHBhcmVudCk7XG4gICAgICAgIGNoaWxkID0gT2JqZWN0LmNyZWF0ZShwcm90byk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgY2hpbGQgPSBPYmplY3QuY3JlYXRlKHByb3RvdHlwZSk7XG4gICAgICAgIHByb3RvID0gcHJvdG90eXBlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjaXJjdWxhcikge1xuICAgICAgdmFyIGluZGV4ID0gYWxsUGFyZW50cy5pbmRleE9mKHBhcmVudCk7XG5cbiAgICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgICByZXR1cm4gYWxsQ2hpbGRyZW5baW5kZXhdO1xuICAgICAgfVxuICAgICAgYWxsUGFyZW50cy5wdXNoKHBhcmVudCk7XG4gICAgICBhbGxDaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpIGluIHBhcmVudCkge1xuICAgICAgdmFyIGF0dHJzO1xuICAgICAgaWYgKHByb3RvKSB7XG4gICAgICAgIGF0dHJzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgaSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRycyAmJiBhdHRycy5zZXQgPT0gbnVsbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNoaWxkW2ldID0gX2Nsb25lKHBhcmVudFtpXSwgZGVwdGggLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGQ7XG4gIH1cblxuICByZXR1cm4gX2Nsb25lKHBhcmVudCwgZGVwdGgpO1xufVxuXG4vKipcbiAqIFNpbXBsZSBmbGF0IGNsb25lIHVzaW5nIHByb3RvdHlwZSwgYWNjZXB0cyBvbmx5IG9iamVjdHMsIHVzZWZ1bGwgZm9yIHByb3BlcnR5XG4gKiBvdmVycmlkZSBvbiBGTEFUIGNvbmZpZ3VyYXRpb24gb2JqZWN0IChubyBuZXN0ZWQgcHJvcHMpLlxuICpcbiAqIFVTRSBXSVRIIENBVVRJT04hIFRoaXMgbWF5IG5vdCBiZWhhdmUgYXMgeW91IHdpc2ggaWYgeW91IGRvIG5vdCBrbm93IGhvdyB0aGlzXG4gKiB3b3Jrcy5cbiAqL1xuY2xvbmUuY2xvbmVQcm90b3R5cGUgPSBmdW5jdGlvbiBjbG9uZVByb3RvdHlwZShwYXJlbnQpIHtcbiAgaWYgKHBhcmVudCA9PT0gbnVsbClcbiAgICByZXR1cm4gbnVsbDtcblxuICB2YXIgYyA9IGZ1bmN0aW9uICgpIHt9O1xuICBjLnByb3RvdHlwZSA9IHBhcmVudDtcbiAgcmV0dXJuIG5ldyBjKCk7XG59O1xuXG4vLyBwcml2YXRlIHV0aWxpdHkgZnVuY3Rpb25zXG5cbmZ1bmN0aW9uIF9fb2JqVG9TdHIobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufTtcbmNsb25lLl9fb2JqVG9TdHIgPSBfX29ialRvU3RyO1xuXG5mdW5jdGlvbiBfX2lzRGF0ZShvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgX19vYmpUb1N0cihvKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufTtcbmNsb25lLl9faXNEYXRlID0gX19pc0RhdGU7XG5cbmZ1bmN0aW9uIF9faXNBcnJheShvKSB7XG4gIHJldHVybiB0eXBlb2YgbyA9PT0gJ29iamVjdCcgJiYgX19vYmpUb1N0cihvKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5jbG9uZS5fX2lzQXJyYXkgPSBfX2lzQXJyYXk7XG5cbmZ1bmN0aW9uIF9faXNSZWdFeHAobykge1xuICByZXR1cm4gdHlwZW9mIG8gPT09ICdvYmplY3QnICYmIF9fb2JqVG9TdHIobykgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufTtcbmNsb25lLl9faXNSZWdFeHAgPSBfX2lzUmVnRXhwO1xuXG5mdW5jdGlvbiBfX2dldFJlZ0V4cEZsYWdzKHJlKSB7XG4gIHZhciBmbGFncyA9ICcnO1xuICBpZiAocmUuZ2xvYmFsKSBmbGFncyArPSAnZyc7XG4gIGlmIChyZS5pZ25vcmVDYXNlKSBmbGFncyArPSAnaSc7XG4gIGlmIChyZS5tdWx0aWxpbmUpIGZsYWdzICs9ICdtJztcbiAgcmV0dXJuIGZsYWdzO1xufTtcbmNsb25lLl9fZ2V0UmVnRXhwRmxhZ3MgPSBfX2dldFJlZ0V4cEZsYWdzO1xuXG5yZXR1cm4gY2xvbmU7XG59KSgpO1xuXG5pZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjbG9uZTtcbn1cbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBzZXR1cENvbnNvbGVUYWJsZSgpIHtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1dlaXJkLCBjb25zb2xlIG9iamVjdCBpcyB1bmRlZmluZWQnKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlLnRhYmxlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBpZiBpdCBpcyBub3QgT1VSIGZ1bmN0aW9uLCBvdmVyd3JpdGUgaXRcbiAgICAgIGlmIChjb25zb2xlLnRhYmxlID09PSBjb25zb2xlVGFibGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVHlwZSh0LCB4KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHggPT09IHQ7XG4gICAgfVxuXG4gICAgdmFyIGlzU3RyaW5nID0gaXNUeXBlLmJpbmQobnVsbCwgJ3N0cmluZycpO1xuXG4gICAgZnVuY3Rpb24gaXNBcnJheU9mKGlzVHlwZUZuLCBhKSB7XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhKSAmJlxuICAgICAgICBhLmV2ZXJ5KGlzVHlwZUZuKTtcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheU9mU3RyaW5ncyA9IGlzQXJyYXlPZi5iaW5kKG51bGwsIGlzU3RyaW5nKTtcbiAgICB2YXIgaXNBcnJheU9mQXJyYXlzID0gaXNBcnJheU9mLmJpbmQobnVsbCwgQXJyYXkuaXNBcnJheSk7XG5cbiAgICB2YXIgVGFibGUgPSByZXF1aXJlKCdlYXN5LXRhYmxlJyk7XG5cbiAgICBmdW5jdGlvbiBhcnJheVRvU3RyaW5nKGFycikge1xuICAgICAgdmFyIHQgPSBuZXcgVGFibGUoKTtcbiAgICAgIGFyci5mb3JFYWNoKGZ1bmN0aW9uIChyZWNvcmQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZWNvcmQgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgdHlwZW9mIHJlY29yZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICB0LmNlbGwoJ2l0ZW0nLCByZWNvcmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGFzc3VtZSBwbGFpbiBvYmplY3RcbiAgICAgICAgICBPYmplY3Qua2V5cyhyZWNvcmQpLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICB0LmNlbGwocHJvcGVydHksIHJlY29yZFtwcm9wZXJ0eV0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHQubmV3Um93KCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJpbnRUYWJsZVdpdGhDb2x1bW5UaXRsZXModGl0bGVzLCBpdGVtcyxub0NvbnNvbGUpIHtcbiAgICAgIHZhciB0ID0gbmV3IFRhYmxlKCk7XG4gICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGl0ZW0uZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGspIHtcbiAgICAgICAgICB0LmNlbGwodGl0bGVzW2tdLCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0Lm5ld1JvdygpO1xuICAgICAgfSk7XG4gICAgICB2YXIgc3RyID0gdC50b1N0cmluZygpO1xuXG4gICAgICByZXR1cm4gbm9Db25zb2xlID8gc3RyIDogY29uc29sZS5sb2coc3RyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcmludFRpdGxlVGFibGUodGl0bGUsIGFycikge1xuICAgICAgdmFyIHN0ciA9IGFycmF5VG9TdHJpbmcoYXJyKTtcbiAgICAgIHZhciByb3dMZW5ndGggPSBzdHIuaW5kZXhPZignXFxuJyk7XG4gICAgICBpZiAocm93TGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAodGl0bGUubGVuZ3RoID4gcm93TGVuZ3RoKSB7XG4gICAgICAgICAgcm93TGVuZ3RoID0gdGl0bGUubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKHRpdGxlKTtcbiAgICAgICAgdmFyIHNlcCA9ICctJywgaywgbGluZSA9ICcnO1xuICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcm93TGVuZ3RoOyBrICs9IDEpIHtcbiAgICAgICAgICBsaW5lICs9IHNlcDtcbiAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGxpbmUpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coc3RyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUaXRsZVRhYmxlKHRpdGxlLCBhcnIpIHtcbiAgICAgIHZhciBzdHIgPSBhcnJheVRvU3RyaW5nKGFycik7XG4gICAgICB2YXIgcm93TGVuZ3RoID0gc3RyLmluZGV4T2YoJ1xcbicpO1xuICAgICAgdmFyIHN0clRvUmV0dXJuID0gJyc7XG4gICAgICBpZiAocm93TGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAodGl0bGUubGVuZ3RoID4gcm93TGVuZ3RoKSB7XG4gICAgICAgICAgcm93TGVuZ3RoID0gdGl0bGUubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzdHJUb1JldHVybiArPSB0aXRsZSArICdcXG4nO1xuICAgICAgICB2YXIgc2VwID0gJy0nLCBrLCBsaW5lID0gJyc7XG4gICAgICAgIGZvciAoayA9IDA7IGsgPCByb3dMZW5ndGg7IGsgKz0gMSkge1xuICAgICAgICAgIGxpbmUgKz0gc2VwO1xuICAgICAgICB9XG5cdFxuICAgICAgICBzdHJUb1JldHVybiArPSBsaW5lICsgJ1xcbic7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdHJUb1JldHVybiArIHN0cjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvYmplY3RUb0FycmF5KG9iaikge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgcmV0dXJuIGtleXMubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgICB2YWx1ZTogb2JqW2tleV1cbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG9iaikge1xuICAgICAgcmV0dXJuIGFycmF5VG9TdHJpbmcob2JqZWN0VG9BcnJheShvYmopKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb25zb2xlVGFibGUgKCkge1xuICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgdHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnICYmXG4gICAgICAgIEFycmF5LmlzQXJyYXkoYXJnc1sxXSkpIHtcblxuICAgICAgICByZXR1cm4gcHJpbnRUaXRsZVRhYmxlKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgaXNBcnJheU9mU3RyaW5ncyhhcmdzWzBdKSAmJlxuICAgICAgICBpc0FycmF5T2ZBcnJheXMoYXJnc1sxXSkpIHtcbiAgICAgICAgcmV0dXJuIHByaW50VGFibGVXaXRoQ29sdW1uVGl0bGVzKGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgICAgfVxuXG4gICAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmxvZyhrKTtcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGspKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYXJyYXlUb1N0cmluZyhrKSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGsgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cob2JqZWN0VG9TdHJpbmcoaykpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBtb2R1bGUuZXhwb3J0cy5nZXRUYWJsZSA9IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cbiAgICAgIHZhciBzdHJUb1JldHVybiA9ICcnO1xuXG4gICAgICBpZiAoYXJncy5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgdHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnICYmXG4gICAgICAgIEFycmF5LmlzQXJyYXkoYXJnc1sxXSkpIHtcblxuICAgICAgICByZXR1cm4gZ2V0VGl0bGVUYWJsZShhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3MubGVuZ3RoID09PSAyICYmXG4gICAgICAgIGlzQXJyYXlPZlN0cmluZ3MoYXJnc1swXSkgJiZcbiAgICAgICAgaXNBcnJheU9mQXJyYXlzKGFyZ3NbMV0pKSB7XG4gICAgICAgIHJldHVybiBwcmludFRhYmxlV2l0aENvbHVtblRpdGxlcyhhcmdzWzBdLCBhcmdzWzFdLHRydWUpO1xuICAgICAgfVxuXG4gICAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24gKGssaSkge1xuICAgICAgICBpZiAodHlwZW9mIGsgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgc3RyVG9SZXR1cm4gKz0gaztcblx0ICBpZiAoaSAhPT0gYXJncy5sZW5ndGggLSAxKXtcblx0ICAgIHN0clRvUmV0dXJuICs9ICdcXG4nO1xuXHQgIH1cbiAgICAgICAgICByZXR1cm4gO1xuICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoaykpIHtcbiAgICAgICAgICBzdHJUb1JldHVybiArPSBhcnJheVRvU3RyaW5nKGspICsgJ1xcbic7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGsgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgc3RyVG9SZXR1cm4gKz0gb2JqZWN0VG9TdHJpbmcoayk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc3RyVG9SZXR1cm47XG4gICAgfTtcblxuICAgIGNvbnNvbGUudGFibGUgPSBjb25zb2xlVGFibGU7XG4gIH1cblxuICBzZXR1cENvbnNvbGVUYWJsZSgpO1xufSgpKTtcbiIsInZhciBjbG9uZSA9IHJlcXVpcmUoJ2Nsb25lJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0aW9ucywgZGVmYXVsdHMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgT2JqZWN0LmtleXMoZGVmYXVsdHMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zW2tleV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBvcHRpb25zW2tleV0gPSBjbG9uZShkZWZhdWx0c1trZXldKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBvcHRpb25zO1xufTsiLCJ2YXIgd2N3aWR0aFxuXG50cnkge1xuICB3Y3dpZHRoID0gcmVxdWlyZSgnd2N3aWR0aCcpXG59IGNhdGNoKGUpIHt9XG5cbm1vZHVsZS5leHBvcnRzID0gVGFibGVcblxuZnVuY3Rpb24gVGFibGUoKSB7XG4gIHRoaXMucm93cyA9IFtdXG4gIHRoaXMucm93ID0ge19fcHJpbnRlcnMgOiB7fX1cbn1cblxuLyoqXG4gKiBQdXNoIHRoZSBjdXJyZW50IHJvdyB0byB0aGUgdGFibGUgYW5kIHN0YXJ0IGEgbmV3IG9uZVxuICpcbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLm5ld1JvdyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnJvd3MucHVzaCh0aGlzLnJvdylcbiAgdGhpcy5yb3cgPSB7X19wcmludGVycyA6IHt9fVxuICByZXR1cm4gdGhpc1xufVxuXG4vKipcbiAqIFdyaXRlIGNlbGwgaW4gdGhlIGN1cnJlbnQgcm93XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNvbCAgICAgICAgICAtIENvbHVtbiBuYW1lXG4gKiBAcGFyYW0ge0FueX0gdmFsICAgICAgICAgICAgIC0gQ2VsbCB2YWx1ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3ByaW50ZXJdICAtIFByaW50ZXIgZnVuY3Rpb24gdG8gZm9ybWF0IHRoZSB2YWx1ZVxuICogQHJldHVybnMge1RhYmxlfSBgdGhpc2BcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUuY2VsbCA9IGZ1bmN0aW9uKGNvbCwgdmFsLCBwcmludGVyKSB7XG4gIHRoaXMucm93W2NvbF0gPSB2YWxcbiAgdGhpcy5yb3cuX19wcmludGVyc1tjb2xdID0gcHJpbnRlciB8fCBzdHJpbmdcbiAgcmV0dXJuIHRoaXNcbn1cblxuLyoqXG4gKiBTdHJpbmcgdG8gc2VwYXJhdGUgY29sdW1uc1xuICovXG5cblRhYmxlLnByb3RvdHlwZS5zZXBhcmF0b3IgPSAnICAnXG5cbmZ1bmN0aW9uIHN0cmluZyh2YWwpIHtcbiAgcmV0dXJuIHZhbCA9PT0gdW5kZWZpbmVkID8gJycgOiAnJyt2YWxcbn1cblxuZnVuY3Rpb24gbGVuZ3RoKHN0cikge1xuICB2YXIgcyA9IHN0ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkK20vZywgJycpXG4gIHJldHVybiB3Y3dpZHRoID09IG51bGwgPyBzLmxlbmd0aCA6IHdjd2lkdGgocylcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHByaW50ZXJcbiAqL1xuXG5UYWJsZS5zdHJpbmcgPSBzdHJpbmdcblxuLyoqXG4gKiBDcmVhdGUgYSBwcmludGVyIHdoaWNoIHJpZ2h0IGFsaWducyB0aGUgY29udGVudCBieSBwYWRkaW5nIHdpdGggYGNoYCBvbiB0aGUgbGVmdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjaFxuICogQHJldHVybnMge0Z1bmN0aW9ufVxuICovXG5cblRhYmxlLmxlZnRQYWRkZXIgPSBsZWZ0UGFkZGVyXG5cbmZ1bmN0aW9uIGxlZnRQYWRkZXIoY2gpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwgd2lkdGgpIHtcbiAgICB2YXIgc3RyID0gc3RyaW5nKHZhbClcbiAgICB2YXIgbGVuID0gbGVuZ3RoKHN0cilcbiAgICB2YXIgcGFkID0gd2lkdGggPiBsZW4gPyBBcnJheSh3aWR0aCAtIGxlbiArIDEpLmpvaW4oY2gpIDogJydcbiAgICByZXR1cm4gcGFkICsgc3RyXG4gIH1cbn1cblxuLyoqXG4gKiBQcmludGVyIHdoaWNoIHJpZ2h0IGFsaWducyB0aGUgY29udGVudFxuICovXG5cbnZhciBwYWRMZWZ0ID0gVGFibGUucGFkTGVmdCA9IGxlZnRQYWRkZXIoJyAnKVxuXG4vKipcbiAqIENyZWF0ZSBhIHByaW50ZXIgd2hpY2ggcGFkcyB3aXRoIGBjaGAgb24gdGhlIHJpZ2h0XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNoXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cblxuVGFibGUucmlnaHRQYWRkZXIgPSByaWdodFBhZGRlclxuXG5mdW5jdGlvbiByaWdodFBhZGRlcihjaCkge1xuICByZXR1cm4gZnVuY3Rpb24gcGFkUmlnaHQodmFsLCB3aWR0aCkge1xuICAgIHZhciBzdHIgPSBzdHJpbmcodmFsKVxuICAgIHZhciBsZW4gPSBsZW5ndGgoc3RyKVxuICAgIHZhciBwYWQgPSB3aWR0aCA+IGxlbiA/IEFycmF5KHdpZHRoIC0gbGVuICsgMSkuam9pbihjaCkgOiAnJ1xuICAgIHJldHVybiBzdHIgKyBwYWRcbiAgfVxufVxuXG52YXIgcGFkUmlnaHQgPSByaWdodFBhZGRlcignICcpXG5cbi8qKlxuICogQ3JlYXRlIGEgcHJpbnRlciBmb3IgbnVtYmVyc1xuICpcbiAqIFdpbGwgZG8gcmlnaHQgYWxpZ25tZW50IGFuZCBvcHRpb25hbGx5IGZpeCB0aGUgbnVtYmVyIG9mIGRpZ2l0cyBhZnRlciBkZWNpbWFsIHBvaW50XG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IFtkaWdpdHNdIC0gTnVtYmVyIG9mIGRpZ2l0cyBmb3IgZml4cG9pbnQgbm90YXRpb25cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn1cbiAqL1xuXG5UYWJsZS5udW1iZXIgPSBmdW5jdGlvbihkaWdpdHMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwgd2lkdGgpIHtcbiAgICBpZiAodmFsID09IG51bGwpIHJldHVybiAnJ1xuICAgIGlmICh0eXBlb2YgdmFsICE9ICdudW1iZXInKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCcnK3ZhbCArICcgaXMgbm90IGEgbnVtYmVyJylcbiAgICB2YXIgc3RyID0gZGlnaXRzID09IG51bGwgPyB2YWwrJycgOiB2YWwudG9GaXhlZChkaWdpdHMpXG4gICAgcmV0dXJuIHBhZExlZnQoc3RyLCB3aWR0aClcbiAgfVxufVxuXG5mdW5jdGlvbiBlYWNoKHJvdywgZm4pIHtcbiAgZm9yKHZhciBrZXkgaW4gcm93KSB7XG4gICAgaWYgKGtleSA9PSAnX19wcmludGVycycpIGNvbnRpbnVlXG4gICAgZm4oa2V5LCByb3dba2V5XSlcbiAgfVxufVxuXG4vKipcbiAqIEdldCBsaXN0IG9mIGNvbHVtbnMgaW4gcHJpbnRpbmcgb3JkZXJcbiAqXG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKi9cblxuVGFibGUucHJvdG90eXBlLmNvbHVtbnMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbHMgPSB7fVxuICBmb3IodmFyIGkgPSAwOyBpIDwgMjsgaSsrKSB7IC8vIGRvIDIgdGltZXNcbiAgICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICAgIHZhciBpZHggPSAwXG4gICAgICBlYWNoKHJvdywgZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlkeCA9IE1hdGgubWF4KGlkeCwgY29sc1trZXldIHx8IDApXG4gICAgICAgIGNvbHNba2V5XSA9IGlkeFxuICAgICAgICBpZHgrK1xuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIHJldHVybiBPYmplY3Qua2V5cyhjb2xzKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gY29sc1thXSAtIGNvbHNbYl1cbiAgfSlcbn1cblxuLyoqXG4gKiBGb3JtYXQganVzdCByb3dzLCBpLmUuIHByaW50IHRoZSB0YWJsZSB3aXRob3V0IGhlYWRlcnMgYW5kIHRvdGFsc1xuICpcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFN0cmluZyByZXByZXNlbnRhaW9uIG9mIHRoZSB0YWJsZVxuICovXG5cblRhYmxlLnByb3RvdHlwZS5wcmludCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29scyA9IHRoaXMuY29sdW1ucygpXG4gIHZhciBzZXBhcmF0b3IgPSB0aGlzLnNlcGFyYXRvclxuICB2YXIgd2lkdGhzID0ge31cbiAgdmFyIG91dCA9ICcnXG5cbiAgLy8gQ2FsYyB3aWR0aHNcbiAgdGhpcy5yb3dzLmZvckVhY2goZnVuY3Rpb24ocm93KSB7XG4gICAgZWFjaChyb3csIGZ1bmN0aW9uKGtleSwgdmFsKSB7XG4gICAgICB2YXIgc3RyID0gcm93Ll9fcHJpbnRlcnNba2V5XS5jYWxsKHJvdywgdmFsKVxuICAgICAgd2lkdGhzW2tleV0gPSBNYXRoLm1heChsZW5ndGgoc3RyKSwgd2lkdGhzW2tleV0gfHwgMClcbiAgICB9KVxuICB9KVxuXG4gIC8vIE5vdyBwcmludFxuICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3cpIHtcbiAgICB2YXIgbGluZSA9ICcnXG4gICAgY29scy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgdmFyIHdpZHRoID0gd2lkdGhzW2tleV1cbiAgICAgIHZhciBzdHIgPSByb3cuaGFzT3duUHJvcGVydHkoa2V5KVxuICAgICAgICA/ICcnK3Jvdy5fX3ByaW50ZXJzW2tleV0uY2FsbChyb3csIHJvd1trZXldLCB3aWR0aClcbiAgICAgICAgOiAnJ1xuICAgICAgbGluZSArPSBwYWRSaWdodChzdHIsIHdpZHRoKSArIHNlcGFyYXRvclxuICAgIH0pXG4gICAgbGluZSA9IGxpbmUuc2xpY2UoMCwgLXNlcGFyYXRvci5sZW5ndGgpXG4gICAgb3V0ICs9IGxpbmUgKyAnXFxuJ1xuICB9KVxuXG4gIHJldHVybiBvdXRcbn1cblxuLyoqXG4gKiBGb3JtYXQgdGhlIHRhYmxlXG4gKlxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGNvbHMgPSB0aGlzLmNvbHVtbnMoKVxuICB2YXIgb3V0ID0gbmV3IFRhYmxlKClcblxuICAvLyBjb3B5IG9wdGlvbnNcbiAgb3V0LnNlcGFyYXRvciA9IHRoaXMuc2VwYXJhdG9yXG5cbiAgLy8gV3JpdGUgaGVhZGVyXG4gIGNvbHMuZm9yRWFjaChmdW5jdGlvbihjb2wpIHtcbiAgICBvdXQuY2VsbChjb2wsIGNvbClcbiAgfSlcbiAgb3V0Lm5ld1JvdygpXG4gIG91dC5wdXNoRGVsaW1ldGVyKGNvbHMpXG5cbiAgLy8gV3JpdGUgYm9keVxuICBvdXQucm93cyA9IG91dC5yb3dzLmNvbmNhdCh0aGlzLnJvd3MpXG5cbiAgLy8gVG90YWxzXG4gIGlmICh0aGlzLnRvdGFscyAmJiB0aGlzLnJvd3MubGVuZ3RoKSB7XG4gICAgb3V0LnB1c2hEZWxpbWV0ZXIoY29scylcbiAgICB0aGlzLmZvckVhY2hUb3RhbChvdXQuY2VsbC5iaW5kKG91dCkpXG4gICAgb3V0Lm5ld1JvdygpXG4gIH1cblxuICByZXR1cm4gb3V0LnByaW50KClcbn1cblxuLyoqXG4gKiBQdXNoIGRlbGltZXRlciByb3cgdG8gdGhlIHRhYmxlICh3aXRoIGVhY2ggY2VsbCBmaWxsZWQgd2l0aCBkYXNocyBkdXJpbmcgcHJpbnRpbmcpXG4gKlxuICogQHBhcmFtIHtTdHJpbmdbXX0gW2NvbHNdXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5wdXNoRGVsaW1ldGVyID0gZnVuY3Rpb24oY29scykge1xuICBjb2xzID0gY29scyB8fCB0aGlzLmNvbHVtbnMoKVxuICBjb2xzLmZvckVhY2goZnVuY3Rpb24oY29sKSB7XG4gICAgdGhpcy5jZWxsKGNvbCwgdW5kZWZpbmVkLCBsZWZ0UGFkZGVyKCctJykpXG4gIH0sIHRoaXMpXG4gIHJldHVybiB0aGlzLm5ld1JvdygpXG59XG5cbi8qKlxuICogQ29tcHV0ZSBhbGwgdG90YWxzIGFuZCB5aWVsZCB0aGUgcmVzdWx0cyB0byBgY2JgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2IgLSBDYWxsYmFjayBmdW5jdGlvbiB3aXRoIHNpZ25hdHVyZSBgKGNvbHVtbiwgdmFsdWUsIHByaW50ZXIpYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5mb3JFYWNoVG90YWwgPSBmdW5jdGlvbihjYikge1xuICBmb3IodmFyIGtleSBpbiB0aGlzLnRvdGFscykge1xuICAgIHZhciBhZ2dyID0gdGhpcy50b3RhbHNba2V5XVxuICAgIHZhciBhY2MgPSBhZ2dyLmluaXRcbiAgICB2YXIgbGVuID0gdGhpcy5yb3dzLmxlbmd0aFxuICAgIHRoaXMucm93cy5mb3JFYWNoKGZ1bmN0aW9uKHJvdywgaWR4KSB7XG4gICAgICBhY2MgPSBhZ2dyLnJlZHVjZS5jYWxsKHJvdywgYWNjLCByb3dba2V5XSwgaWR4LCBsZW4pXG4gICAgfSlcbiAgICBjYihrZXksIGFjYywgYWdnci5wcmludGVyKVxuICB9XG59XG5cbi8qKlxuICogRm9ybWF0IHRoZSB0YWJsZSBzbyB0aGF0IGVhY2ggcm93IHJlcHJlc2VudHMgY29sdW1uIGFuZCBlYWNoIGNvbHVtbiByZXByZXNlbnRzIHJvd1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3BzLnNlcGFyYXRvcl0gLSBDb2x1bW4gc2VwYXJhdGlvbiBzdHJpbmdcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLm5hbWVQcmludGVyXSAtIFByaW50ZXIgdG8gZm9ybWF0IGNvbHVtbiBuYW1lc1xuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUucHJpbnRUcmFuc3Bvc2VkID0gZnVuY3Rpb24ob3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuICB2YXIgb3V0ID0gbmV3IFRhYmxlXG4gIG91dC5zZXBhcmF0b3IgPSBvcHRzLnNlcGFyYXRvciB8fCB0aGlzLnNlcGFyYXRvclxuICB0aGlzLmNvbHVtbnMoKS5mb3JFYWNoKGZ1bmN0aW9uKGNvbCkge1xuICAgIG91dC5jZWxsKDAsIGNvbCwgb3B0cy5uYW1lUHJpbnRlcilcbiAgICB0aGlzLnJvd3MuZm9yRWFjaChmdW5jdGlvbihyb3csIGlkeCkge1xuICAgICAgb3V0LmNlbGwoaWR4KzEsIHJvd1tjb2xdLCByb3cuX19wcmludGVyc1tjb2xdKVxuICAgIH0pXG4gICAgb3V0Lm5ld1JvdygpXG4gIH0sIHRoaXMpXG4gIHJldHVybiBvdXQucHJpbnQoKVxufVxuXG4vKipcbiAqIFNvcnQgdGhlIHRhYmxlXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbnxzdHJpbmdbXX0gW2NtcF0gLSBFaXRoZXIgY29tcGFyZSBmdW5jdGlvbiBvciBhIGxpc3Qgb2YgY29sdW1ucyB0byBzb3J0IG9uXG4gKiBAcmV0dXJucyB7VGFibGV9IGB0aGlzYFxuICovXG5cblRhYmxlLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oY21wKSB7XG4gIGlmICh0eXBlb2YgY21wID09ICdmdW5jdGlvbicpIHtcbiAgICB0aGlzLnJvd3Muc29ydChjbXApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHZhciBrZXlzID0gQXJyYXkuaXNBcnJheShjbXApID8gY21wIDogdGhpcy5jb2x1bW5zKClcblxuICB2YXIgY29tcGFyYXRvcnMgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICB2YXIgb3JkZXIgPSAnYXNjJ1xuICAgIHZhciBtID0gLyguKilcXHxcXHMqKGFzY3xkZXMpXFxzKiQvLmV4ZWMoa2V5KVxuICAgIGlmIChtKSB7XG4gICAgICBrZXkgPSBtWzFdXG4gICAgICBvcmRlciA9IG1bMl1cbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gb3JkZXIgPT0gJ2FzYydcbiAgICAgICAgPyBjb21wYXJlKGFba2V5XSwgYltrZXldKVxuICAgICAgICA6IGNvbXBhcmUoYltrZXldLCBhW2tleV0pXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiB0aGlzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29tcGFyYXRvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvcmRlciA9IGNvbXBhcmF0b3JzW2ldKGEsIGIpXG4gICAgICBpZiAob3JkZXIgIT0gMCkgcmV0dXJuIG9yZGVyXG4gICAgfVxuICAgIHJldHVybiAwXG4gIH0pXG59XG5cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcbiAgaWYgKGEgPT09IHVuZGVmaW5lZCkgcmV0dXJuIDFcbiAgaWYgKGIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIC0xXG4gIGlmIChhID09PSBudWxsKSByZXR1cm4gMVxuICBpZiAoYiA9PT0gbnVsbCkgcmV0dXJuIC0xXG4gIGlmIChhID4gYikgcmV0dXJuIDFcbiAgaWYgKGEgPCBiKSByZXR1cm4gLTFcbiAgcmV0dXJuIGNvbXBhcmUoU3RyaW5nKGEpLCBTdHJpbmcoYikpXG59XG5cbi8qKlxuICogQWRkIGEgdG90YWwgZm9yIHRoZSBjb2x1bW5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY29sIC0gY29sdW1uIG5hbWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c11cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnJlZHVjZSA9IHN1bV0gLSByZWR1Y2UoYWNjLCB2YWwsIGlkeCwgbGVuZ3RoKSBmdW5jdGlvbiB0byBjb21wdXRlIHRoZSB0b3RhbCB2YWx1ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMucHJpbnRlciA9IHBhZExlZnRdIC0gUHJpbnRlciB0byBmb3JtYXQgdGhlIHRvdGFsIGNlbGxcbiAqIEBwYXJhbSB7QW55fSBbb3B0cy5pbml0ID0gMF0gLSBJbml0aWFsIHZhbHVlIGZvciByZWR1Y3Rpb25cbiAqIEByZXR1cm5zIHtUYWJsZX0gYHRoaXNgXG4gKi9cblxuVGFibGUucHJvdG90eXBlLnRvdGFsID0gZnVuY3Rpb24oY29sLCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9XG4gIHRoaXMudG90YWxzID0gdGhpcy50b3RhbHMgfHwge31cbiAgdGhpcy50b3RhbHNbY29sXSA9IHtcbiAgICByZWR1Y2U6IG9wdHMucmVkdWNlIHx8IFRhYmxlLmFnZ3Iuc3VtLFxuICAgIHByaW50ZXI6IG9wdHMucHJpbnRlciB8fCBwYWRMZWZ0LFxuICAgIGluaXQ6IG9wdHMuaW5pdCA9PSBudWxsID8gMCA6IG9wdHMuaW5pdFxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogUHJlZGVmaW5lZCBoZWxwZXJzIGZvciB0b3RhbHNcbiAqL1xuXG5UYWJsZS5hZ2dyID0ge31cblxuLyoqXG4gKiBDcmVhdGUgYSBwcmludGVyIHdoaWNoIGZvcm1hdHMgdGhlIHZhbHVlIHdpdGggYHByaW50ZXJgLFxuICogYWRkcyB0aGUgYHByZWZpeGAgdG8gaXQgYW5kIHJpZ2h0IGFsaWducyB0aGUgd2hvbGUgdGhpbmdcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJlZml4XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmludGVyXG4gKiBAcmV0dXJucyB7cHJpbnRlcn1cbiAqL1xuXG5UYWJsZS5hZ2dyLnByaW50ZXIgPSBmdW5jdGlvbihwcmVmaXgsIHByaW50ZXIpIHtcbiAgcHJpbnRlciA9IHByaW50ZXIgfHwgc3RyaW5nXG4gIHJldHVybiBmdW5jdGlvbih2YWwsIHdpZHRoKSB7XG4gICAgcmV0dXJuIHBhZExlZnQocHJlZml4ICsgcHJpbnRlcih2YWwpLCB3aWR0aClcbiAgfVxufVxuXG4vKipcbiAqIFN1bSByZWR1Y3Rpb25cbiAqL1xuXG5UYWJsZS5hZ2dyLnN1bSA9IGZ1bmN0aW9uKGFjYywgdmFsKSB7XG4gIHJldHVybiBhY2MgKyB2YWxcbn1cblxuLyoqXG4gKiBBdmVyYWdlIHJlZHVjdGlvblxuICovXG5cblRhYmxlLmFnZ3IuYXZnID0gZnVuY3Rpb24oYWNjLCB2YWwsIGlkeCwgbGVuKSB7XG4gIGFjYyA9IGFjYyArIHZhbFxuICByZXR1cm4gaWR4ICsgMSA9PSBsZW4gPyBhY2MvbGVuIDogYWNjXG59XG5cbi8qKlxuICogUHJpbnQgdGhlIGFycmF5IG9yIG9iamVjdFxuICpcbiAqIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBvYmogLSBPYmplY3QgdG8gcHJpbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSBbZm9ybWF0XSAtIEZvcm1hdCBvcHRpb25zXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2JdIC0gVGFibGUgcG9zdCBwcm9jZXNzaW5nIGFuZCBmb3JtYXRpbmdcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cblxuVGFibGUucHJpbnQgPSBmdW5jdGlvbihvYmosIGZvcm1hdCwgY2IpIHtcbiAgdmFyIG9wdHMgPSBmb3JtYXQgfHwge31cblxuICBmb3JtYXQgPSB0eXBlb2YgZm9ybWF0ID09ICdmdW5jdGlvbidcbiAgICA/IGZvcm1hdFxuICAgIDogZnVuY3Rpb24ob2JqLCBjZWxsKSB7XG4gICAgICBmb3IodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkgY29udGludWVcbiAgICAgICAgdmFyIHBhcmFtcyA9IG9wdHNba2V5XSB8fCB7fVxuICAgICAgICBjZWxsKHBhcmFtcy5uYW1lIHx8IGtleSwgb2JqW2tleV0sIHBhcmFtcy5wcmludGVyKVxuICAgICAgfVxuICAgIH1cblxuICB2YXIgdCA9IG5ldyBUYWJsZVxuICB2YXIgY2VsbCA9IHQuY2VsbC5iaW5kKHQpXG5cbiAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgIGNiID0gY2IgfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC50b1N0cmluZygpIH1cbiAgICBvYmouZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICBmb3JtYXQoaXRlbSwgY2VsbClcbiAgICAgIHQubmV3Um93KClcbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIGNiID0gY2IgfHwgZnVuY3Rpb24odCkgeyByZXR1cm4gdC5wcmludFRyYW5zcG9zZWQoe3NlcGFyYXRvcjogJyA6ICd9KSB9XG4gICAgZm9ybWF0KG9iaiwgY2VsbClcbiAgICB0Lm5ld1JvdygpXG4gIH1cblxuICByZXR1cm4gY2IodClcbn1cblxuLyoqXG4gKiBTYW1lIGFzIGBUYWJsZS5wcmludCgpYCBidXQgeWllbGRzIHRoZSByZXN1bHQgdG8gYGNvbnNvbGUubG9nKClgXG4gKi9cblxuVGFibGUubG9nID0gZnVuY3Rpb24ob2JqLCBmb3JtYXQsIGNiKSB7XG4gIGNvbnNvbGUubG9nKFRhYmxlLnByaW50KG9iaiwgZm9ybWF0LCBjYikpXG59XG5cbi8qKlxuICogU2FtZSBhcyBgLnRvU3RyaW5nKClgIGJ1dCB5aWVsZHMgdGhlIHJlc3VsdCB0byBgY29uc29sZS5sb2coKWBcbiAqL1xuXG5UYWJsZS5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKHRoaXMudG9TdHJpbmcoKSlcbn1cbiIsImltcG9ydCBCZXN0U2hvcnRTaWRlRml0IGZyb20gJy4vaGV1cmlzdGljcy9CZXN0U2hvcnRTaWRlRml0JztcbmltcG9ydCBCb3ggZnJvbSAnLi9Cb3gnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaW4ge1xuXHR3aWR0aDogbnVtYmVyID0gMDtcblx0aGVpZ2h0OiBudW1iZXI9IDA7XG5cdGJveGVzOiBCb3hbXSA9IFtdO1xuXHRoZXVyaXN0aWM6IGFueSA9IG51bGw7XG5cdGZyZWVSZWN0YW5nbGVzOiBGcmVlU3BhY2VCb3hbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBoZXVyaXN0aWMpIHtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0dGhpcy5mcmVlUmVjdGFuZ2xlcyA9IFtuZXcgRnJlZVNwYWNlQm94KHdpZHRoLCBoZWlnaHQpXTtcblx0XHR0aGlzLmhldXJpc3RpYyA9IGhldXJpc3RpYyB8fCBuZXcgQmVzdFNob3J0U2lkZUZpdCgpO1xuXHR9XG5cblx0Z2V0IGFyZWEoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLndpZHRoICogdGhpcy5oZWlnaHQ7XG5cdH1cblxuXHRnZXQgZWZmaWNpZW5jeSgpIHtcblx0XHRsZXQgYm94ZXNBcmVhID0gMDtcblx0XHR0aGlzLmJveGVzLmZvckVhY2goKGJveCkgPT4ge1xuXHRcdFx0Ym94ZXNBcmVhICs9IGJveC53aWR0aCAqIGJveC5oZWlnaHQ7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIChib3hlc0FyZWEgKiAxMDApIC8gdGhpcy5hcmVhO1xuXHR9XG5cblx0Z2V0IGxhYmVsKCkge1xuXHRcdHJldHVybiBgJHt0aGlzLndpZHRofXgke3RoaXMuaGVpZ2h0fSAke3RoaXMuZWZmaWNpZW5jeX0lYDtcblx0fVxuXG5cdGluc2VydChib3g6IEJveCkge1xuXHRcdGlmIChib3gucGFja2VkKSByZXR1cm4gZmFsc2U7XG5cblx0XHR0aGlzLmhldXJpc3RpYy5maW5kUG9zaXRpb25Gb3JOZXdOb2RlKGJveCwgdGhpcy5mcmVlUmVjdGFuZ2xlcyk7XG5cdFx0aWYgKCFib3gucGFja2VkKSByZXR1cm4gZmFsc2U7XG5cblx0XHRsZXQgbnVtUmVjdGFuZ2xlc1RvUHJvY2VzcyA9IHRoaXMuZnJlZVJlY3RhbmdsZXMubGVuZ3RoO1xuXHRcdGxldCBpID0gMDtcblxuXHRcdHdoaWxlIChpIDwgbnVtUmVjdGFuZ2xlc1RvUHJvY2Vzcykge1xuXHRcdFx0aWYgKHRoaXMuc3BsaXRGcmVlTm9kZSh0aGlzLmZyZWVSZWN0YW5nbGVzW2ldLCBib3gpKSB7XG5cdFx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRudW1SZWN0YW5nbGVzVG9Qcm9jZXNzLS07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGhpcy5wcnVuZUZyZWVMaXN0KCk7XG5cdFx0dGhpcy5ib3hlcy5wdXNoKGJveCk7XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdHNjb3JlRm9yKGJveDogQm94KSB7XG5cdFx0bGV0IGNvcHlCb3ggPSBuZXcgQm94KGJveC53aWR0aCwgYm94LmhlaWdodCwgYm94LmNvbnN0cmFpblJvdGF0aW9uKTtcblx0XHRsZXQgc2NvcmUgPSB0aGlzLmhldXJpc3RpYy5maW5kUG9zaXRpb25Gb3JOZXdOb2RlKFxuXHRcdFx0Y29weUJveCxcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXNcblx0XHQpO1xuXHRcdHJldHVybiBzY29yZTtcblx0fVxuXG5cdGlzTGFyZ2VyVGhhbihib3g6IEJveCkge1xuXHRcdHJldHVybiAoXG5cdFx0XHQodGhpcy53aWR0aCA+PSBib3gud2lkdGggJiYgdGhpcy5oZWlnaHQgPj0gYm94LmhlaWdodCkgfHxcblx0XHRcdCh0aGlzLmhlaWdodCA+PSBib3gud2lkdGggJiYgdGhpcy53aWR0aCA+PSBib3guaGVpZ2h0KVxuXHRcdCk7XG5cdH1cblxuXHRzcGxpdEZyZWVOb2RlKGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdC8vIFRlc3Qgd2l0aCBTQVQgaWYgdGhlIHJlY3RhbmdsZXMgZXZlbiBpbnRlcnNlY3QuXG5cdFx0aWYgKFxuXHRcdFx0dXNlZE5vZGUueCA+PSBmcmVlTm9kZS54ICsgZnJlZU5vZGUud2lkdGggfHxcblx0XHRcdHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCA8PSBmcmVlTm9kZS54IHx8XG5cdFx0XHR1c2VkTm9kZS55ID49IGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQgfHxcblx0XHRcdHVzZWROb2RlLnkgKyB1c2VkTm9kZS5oZWlnaHQgPD0gZnJlZU5vZGUueVxuXHRcdCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMudHJ5U3BsaXRGcmVlTm9kZVZlcnRpY2FsbHkoZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHR0aGlzLnRyeVNwbGl0RnJlZU5vZGVIb3Jpem9udGFsbHkoZnJlZU5vZGUsIHVzZWROb2RlKTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0dHJ5U3BsaXRGcmVlTm9kZVZlcnRpY2FsbHkoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKFxuXHRcdFx0dXNlZE5vZGUueCA8IGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCAmJlxuXHRcdFx0dXNlZE5vZGUueCArIHVzZWROb2RlLndpZHRoID4gZnJlZU5vZGUueFxuXHRcdCkge1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZUF0VG9wKGZyZWVOb2RlLCB1c2VkTm9kZSk7XG5cdFx0XHR0aGlzLnRyeUxlYXZlRnJlZVNwYWNlQXRCb3R0b20oZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlMZWF2ZUZyZWVTcGFjZUF0VG9wKGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmICh1c2VkTm9kZS55ID4gZnJlZU5vZGUueSAmJiB1c2VkTm9kZS55IDwgZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCkge1xuXHRcdFx0bGV0IG5ld05vZGUgPSB7IC4uLmZyZWVOb2RlIH07XG5cdFx0XHRuZXdOb2RlLmhlaWdodCA9IHVzZWROb2RlLnkgLSBuZXdOb2RlLnk7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0dHJ5TGVhdmVGcmVlU3BhY2VBdEJvdHRvbShmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAodXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodCA8IGZyZWVOb2RlLnkgKyBmcmVlTm9kZS5oZWlnaHQpIHtcblx0XHRcdGxldCBuZXdOb2RlID0geyAuLi5mcmVlTm9kZSB9O1xuXHRcdFx0bmV3Tm9kZS55ID0gdXNlZE5vZGUueSArIHVzZWROb2RlLmhlaWdodDtcblx0XHRcdG5ld05vZGUuaGVpZ2h0ID1cblx0XHRcdFx0ZnJlZU5vZGUueSArIGZyZWVOb2RlLmhlaWdodCAtICh1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0KTtcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMucHVzaChuZXdOb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlTcGxpdEZyZWVOb2RlSG9yaXpvbnRhbGx5KGZyZWVOb2RlLCB1c2VkTm9kZSkge1xuXHRcdGlmIChcblx0XHRcdHVzZWROb2RlLnkgPCBmcmVlTm9kZS55ICsgZnJlZU5vZGUuaGVpZ2h0ICYmXG5cdFx0XHR1c2VkTm9kZS55ICsgdXNlZE5vZGUuaGVpZ2h0ID4gZnJlZU5vZGUueVxuXHRcdCkge1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZU9uTGVmdChmcmVlTm9kZSwgdXNlZE5vZGUpO1xuXHRcdFx0dGhpcy50cnlMZWF2ZUZyZWVTcGFjZU9uUmlnaHQoZnJlZU5vZGUsIHVzZWROb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlMZWF2ZUZyZWVTcGFjZU9uTGVmdChmcmVlTm9kZSwgdXNlZE5vZGUpIHtcblx0XHRpZiAodXNlZE5vZGUueCA+IGZyZWVOb2RlLnggJiYgdXNlZE5vZGUueCA8IGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCkge1xuXHRcdFx0bGV0IG5ld05vZGUgPSB7IC4uLmZyZWVOb2RlIH07XG5cdFx0XHRuZXdOb2RlLndpZHRoID0gdXNlZE5vZGUueCAtIG5ld05vZGUueDtcblx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMucHVzaChuZXdOb2RlKTtcblx0XHR9XG5cdH1cblxuXHR0cnlMZWF2ZUZyZWVTcGFjZU9uUmlnaHQoZnJlZU5vZGUsIHVzZWROb2RlKSB7XG5cdFx0aWYgKHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCA8IGZyZWVOb2RlLnggKyBmcmVlTm9kZS53aWR0aCkge1xuXHRcdFx0bGV0IG5ld05vZGUgPSB7IC4uLmZyZWVOb2RlIH07XG5cdFx0XHRuZXdOb2RlLnggPSB1c2VkTm9kZS54ICsgdXNlZE5vZGUud2lkdGg7XG5cdFx0XHRuZXdOb2RlLndpZHRoID1cblx0XHRcdFx0ZnJlZU5vZGUueCArIGZyZWVOb2RlLndpZHRoIC0gKHVzZWROb2RlLnggKyB1c2VkTm9kZS53aWR0aCk7XG5cdFx0XHR0aGlzLmZyZWVSZWN0YW5nbGVzLnB1c2gobmV3Tm9kZSk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIEdvZXMgdGhyb3VnaCB0aGUgZnJlZSByZWN0YW5nbGUgbGlzdCBhbmQgcmVtb3ZlcyBhbnkgcmVkdW5kYW50IGVudHJpZXMuXG5cdCAqL1xuXHRwcnVuZUZyZWVMaXN0KCkge1xuXHRcdGxldCBpID0gMDtcblx0XHR3aGlsZSAoaSA8IHRoaXMuZnJlZVJlY3RhbmdsZXMubGVuZ3RoKSB7XG5cdFx0XHRsZXQgaiA9IGkgKyAxO1xuXHRcdFx0aWYgKGogPT09IHRoaXMuZnJlZVJlY3RhbmdsZXMubGVuZ3RoKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0d2hpbGUgKGogPCB0aGlzLmZyZWVSZWN0YW5nbGVzLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5pc0NvbnRhaW5lZEluKHRoaXMuZnJlZVJlY3RhbmdsZXNbaV0sIHRoaXMuZnJlZVJlY3RhbmdsZXNbal0pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMuc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRcdGktLTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0dGhpcy5pc0NvbnRhaW5lZEluKHRoaXMuZnJlZVJlY3RhbmdsZXNbal0sIHRoaXMuZnJlZVJlY3RhbmdsZXNbaV0pXG5cdFx0XHRcdCkge1xuXHRcdFx0XHRcdHRoaXMuZnJlZVJlY3RhbmdsZXMuc3BsaWNlKGosIDEpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGorKztcblx0XHRcdFx0fVxuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aXNDb250YWluZWRJbihyZWN0QSwgcmVjdEIpIHtcblx0XHRyZXR1cm4gKFxuXHRcdFx0cmVjdEEgJiZcblx0XHRcdHJlY3RCICYmXG5cdFx0XHRyZWN0QS54ID49IHJlY3RCLnggJiZcblx0XHRcdHJlY3RBLnkgPj0gcmVjdEIueSAmJlxuXHRcdFx0cmVjdEEueCArIHJlY3RBLndpZHRoIDw9IHJlY3RCLnggKyByZWN0Qi53aWR0aCAmJlxuXHRcdFx0cmVjdEEueSArIHJlY3RBLmhlaWdodCA8PSByZWN0Qi55ICsgcmVjdEIuaGVpZ2h0XG5cdFx0KTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgRnJlZVNwYWNlQm94IHtcbiAgeCA9IDBcbiAgeSA9IDBcbiAgd2lkdGggPSBudWxsXG4gIGhlaWdodCA9IG51bGxcblxuICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHRcbiAgfVxuXG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm94IHtcblx0d2lkdGg6IG51bWJlciA9IDA7XG5cdGhlaWdodDogbnVtYmVyID0gMDtcblx0eCA9IDA7XG4gICAgeSA9IDA7XG4gICAgY29uc3RyYWluUm90YXRpb24gPSBmYWxzZTtcbiAgICBwYWNrZWQgPSBmYWxzZTtcblxuXHRjb25zdHJ1Y3Rvcih3aWR0aDpudW1iZXIgLCBoZWlnaHQ6IG51bWJlciwgY29uc3RyYWluUm90YXRpb24gPSBmYWxzZSkge1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIHRoaXMuY29uc3RyYWluUm90YXRpb24gPSBjb25zdHJhaW5Sb3RhdGlvbjtcblx0fVxufSIsImltcG9ydCBCaW4gZnJvbSAnLi9CaW4nO1xuaW1wb3J0IEJveCBmcm9tICcuL0JveCc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi9TY29yZSc7XG5pbXBvcnQgU2NvcmVCb2FyZCBmcm9tICcuL1Njb3JlQm9hcmQnO1xuaW1wb3J0IHsgUGFja2VkU2NvcmVzIH0gZnJvbSAnLi9UeXBlcyc7XG5pbXBvcnQgU2NvcmVCb2FyZEVudHJ5IGZyb20gJy4vU2NvcmVCb2FyZEVudHJ5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFja2VyIHtcblx0YmluczogQmluW10gPSBbXTtcblx0dW5wYWNrZWRCb3hlczogQm94W10gPSBbXTtcblxuXHRjb25zdHJ1Y3RvcihiaW5zOiBCaW5bXSkge1xuXHRcdHRoaXMuYmlucyA9IGJpbnM7XG5cdH1cblxuXHRwYWNrPFQgZXh0ZW5kcyBCb3g+KGJveGVzOiBUW10pOiBQYWNrZWRTY29yZXM8VD5bXSB7XG4gICAgICAgIGxldCBwYWNrZWRCb3hlczogUGFja2VkU2NvcmVzPFQ+W10gPSBbXTtcbiAgICAgICAgbGV0IGVudHJ5OiBTY29yZUJvYXJkRW50cnkgfCBudWxsO1xuXG5cdFx0Ym94ZXMgPSBib3hlcy5maWx0ZXIoKGJveCkgPT4gIWJveC5wYWNrZWQpO1xuXHRcdGlmIChib3hlcy5sZW5ndGggPT09IDApIHJldHVybiBwYWNrZWRCb3hlcztcblxuXHRcdGxldCBsaW1pdCA9IFNjb3JlLk1BWF9JTlQ7XG5cdFx0bGV0IGJvYXJkID0gbmV3IFNjb3JlQm9hcmQodGhpcy5iaW5zLCBib3hlcyk7XG5cdFx0d2hpbGUgKChlbnRyeSA9IGJvYXJkLmJlc3RGaXQoKSkpIHtcblx0XHRcdGVudHJ5LmJpbi5pbnNlcnQoZW50cnkuYm94KTtcblx0XHRcdGJvYXJkLnJlbW92ZUJveChlbnRyeS5ib3gpO1xuXHRcdFx0Ym9hcmQucmVjYWxjdWxhdGVCaW4oZW50cnkuYmluKTtcbiAgICAgICAgICAgIHBhY2tlZEJveGVzLnB1c2goeyBib3g6IGVudHJ5LmJveCBhcyBULCBzY29yZTogZW50cnkuc2NvcmUgfSk7XG5cdFx0XHRpZiAocGFja2VkQm94ZXMubGVuZ3RoID49IGxpbWl0KSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMudW5wYWNrZWRCb3hlcyA9IGJveGVzLmZpbHRlcigoYm94KSA9PiB7XG5cdFx0XHRyZXR1cm4gIWJveC5wYWNrZWQ7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcGFja2VkQm94ZXM7XG5cdH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTY29yZSB7XG4gICAgc3RhdGljIE1BWF9JTlQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICBzY29yZV8xID0gU2NvcmUuTUFYX0lOVDtcbiAgICBzY29yZV8yID0gU2NvcmUuTUFYX0lOVDtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3JlXzE/OiBudW1iZXIsIHNjb3JlXzI/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzY29yZV8xICE9ICd1bmRlZmluZWQnKSB0aGlzLnNjb3JlXzEgPSBzY29yZV8xO1xuICAgICAgICBpZiAodHlwZW9mIHNjb3JlXzIgIT0gJ3VuZGVmaW5lZCcpIHRoaXMuc2NvcmVfMiA9IHNjb3JlXzI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG93ZXIgaXMgYmV0dGVyXG4gICAgICovXG4gICAgdmFsdWVPZigpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLnNjb3JlXzEgKyB0aGlzLnNjb3JlXzIpO1xuICAgIH1cblxuICAgIGFzc2lnbihvdGhlcikge1xuICAgICAgICB0aGlzLnNjb3JlXzEgPSBvdGhlci5zY29yZV8xO1xuICAgICAgICB0aGlzLnNjb3JlXzIgPSBvdGhlci5zY29yZV8yO1xuICAgIH1cblxuICAgIGlzQmxhbmsoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNjb3JlXzEgPT09IFNjb3JlLk1BWF9JTlQ7XG4gICAgfVxuXG4gICAgZGVjcmVhc2VCeShkZWx0YSkge1xuICAgICAgICB0aGlzLnNjb3JlXzEgKz0gZGVsdGE7XG4gICAgICAgIHRoaXMuc2NvcmVfMiArPSBkZWx0YTtcbiAgICB9XG59IiwiLy8gIyAgICAgICBib3hfMSBib3hfMiBib3hfMyAuLi5cbi8vICMgYmluXzEgIDEwMCAgIDIwMCAgICAwXG4vLyAjIGJpbl8yICAgMCAgICAgNSAgICAgMFxuLy8gIyBiaW5fMyAgIDkgICAgMTAwICAgIDBcbi8vICMgLi4uXG5pbXBvcnQgQmluIGZyb20gJy4vQmluJztcbmltcG9ydCBCb3ggZnJvbSAnLi9Cb3gnO1xuaW1wb3J0IFNjb3JlQm9hcmRFbnRyeSBmcm9tICcuL1Njb3JlQm9hcmRFbnRyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JlQm9hcmQge1xuXHRlbnRyaWVzOiBTY29yZUJvYXJkRW50cnlbXSA9IFtdO1xuXG5cdGNvbnN0cnVjdG9yKGJpbnM6IEJpbltdLCBib3hlczogQm94W10pIHtcblx0XHRiaW5zLmZvckVhY2goKGJpbikgPT4ge1xuXHRcdFx0dGhpcy5hZGRCaW5FbnRyaWVzKGJpbiwgYm94ZXMpO1xuXHRcdH0pO1xuXHR9XG5cblx0ZGVidWcoKSB7XG5cdFx0cmVxdWlyZSgnY29uc29sZS50YWJsZScpO1xuXHRcdGNvbnNvbGUudGFibGUoXG5cdFx0XHR0aGlzLmVudHJpZXMubWFwKChlbnRyeSkgPT4gKHtcblx0XHRcdFx0YmluOiBlbnRyeS5iaW4ubGFiZWwsXG5cdFx0XHRcdHNjb3JlOiBlbnRyeS5zY29yZSxcblx0XHRcdH0pKVxuXHRcdCk7XG5cdH1cblxuXHRhZGRCaW5FbnRyaWVzKGJpbiwgYm94ZXMpIHtcblx0XHRib3hlcy5mb3JFYWNoKChib3gpID0+IHtcblx0XHRcdGxldCBlbnRyeSA9IG5ldyBTY29yZUJvYXJkRW50cnkoYmluLCBib3gpO1xuXHRcdFx0ZW50cnkuY2FsY3VsYXRlKCk7XG5cdFx0XHR0aGlzLmVudHJpZXMucHVzaChlbnRyeSk7XG5cdFx0fSk7XG5cdH1cblxuXHRsYXJnZXN0Tm90Rml0aW5nQm94KCkge1xuICAgICAgICBsZXQgdW5maXQ6IFNjb3JlQm9hcmRFbnRyeTtcblx0XHRsZXQgZml0dGluZ0JveGVzID0gdGhpcy5lbnRyaWVzXG5cdFx0XHQuZmlsdGVyKChlbnRyeSkgPT4gZW50cnkuZml0KVxuXHRcdFx0Lm1hcCgoZW50cnkpID0+IGVudHJ5LmJveCk7XG5cbiAgICAgICAgdGhpcy5lbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB1bmZpdEFyZWEgPSB1bmZpdC5ib3gud2lkdGggKiB1bmZpdC5ib3guaGVpZ2h0O1xuICAgICAgICAgICAgY29uc3QgZW50cnlBcmVhID0gZW50cnkuYm94LndpZHRoICogZW50cnkuYm94LmhlaWdodDtcblx0XHRcdGlmICghZml0dGluZ0JveGVzLmluY2x1ZGVzKGVudHJ5LmJveCkpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHVuZml0ID09PSBudWxsIHx8IHVuZml0QXJlYSA8IGVudHJ5QXJlYSkge1xuXHRcdFx0XHR1bmZpdCA9IGVudHJ5O1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHVuZml0LmJveCA/IHVuZml0IDogZmFsc2U7XG5cdH1cblxuXHRiZXN0Rml0KCkge1xuXHRcdGxldCBiZXN0OiBTY29yZUJvYXJkRW50cnkgfCBudWxsID0gbnVsbDtcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50cmllcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0bGV0IGVudHJ5ID0gdGhpcy5lbnRyaWVzW2ldO1xuXHRcdFx0aWYgKCFlbnRyeS5maXQoKSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdGlmIChiZXN0ID09PSBudWxsIHx8IGVudHJ5LnNjb3JlIDwgYmVzdC5zY29yZSkge1xuXHRcdFx0XHRiZXN0ID0gZW50cnk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBiZXN0O1xuXHR9XG5cblx0cmVtb3ZlQm94KGJveCkge1xuXHRcdHRoaXMuZW50cmllcyA9IHRoaXMuZW50cmllcy5maWx0ZXIoKGVudHJ5KSA9PiB7XG5cdFx0XHRyZXR1cm4gZW50cnkuYm94ICE9PSBib3g7XG5cdFx0fSk7XG5cdH1cblxuXHRhZGRCaW4oYmluKSB7XG5cdFx0dGhpcy5hZGRCaW5FbnRyaWVzKGJpbiwgdGhpcy5jdXJyZW50Qm94ZXMoKSk7XG5cdH1cblxuXHRyZWNhbGN1bGF0ZUJpbihiaW4pIHtcblx0XHR0aGlzLmVudHJpZXNcblx0XHRcdC5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5iaW4gPT09IGJpbilcblx0XHRcdC5mb3JFYWNoKChlbnRyeSkgPT4gZW50cnkuY2FsY3VsYXRlKCkpO1xuXHR9XG5cblx0Y3VycmVudEJveGVzKCkge1xuXHRcdHJldHVybiBbLi4ubmV3IFNldCh0aGlzLmVudHJpZXMubWFwKChlbnRyeSkgPT4gZW50cnkuYm94KSldO1xuXHR9XG59XG4iLCJpbXBvcnQgQmluIGZyb20gXCIuL0JpblwiO1xuaW1wb3J0IEJveCBmcm9tIFwiLi9Cb3hcIjtcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9TY29yZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29yZUJvYXJkRW50cnkge1xuICAgIGJpbjogQmluO1xuICAgIGJveDogQm94O1xuICAgIHNjb3JlOiBTY29yZTtcblxuICAgIGNvbnN0cnVjdG9yKGJpbjogQmluLCBib3g6IEJveCkge1xuICAgICAgICB0aGlzLmJpbiA9IGJpblxuICAgICAgICB0aGlzLmJveCA9IGJveFxuICAgIH1cblxuICAgIGNhbGN1bGF0ZSgpIHtcbiAgICAgICAgdGhpcy5zY29yZSA9IHRoaXMuYmluLnNjb3JlRm9yKHRoaXMuYm94KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NvcmU7XG4gICAgfVxuXG4gICAgZml0KCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuc2NvcmUuaXNCbGFuaygpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBGcmVlU3BhY2VCb3ggfSBmcm9tICcuLi9CaW4nO1xuaW1wb3J0IEJveCBmcm9tICcuLi9Cb3gnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZSB7XG5cdGZpbmRQb3NpdGlvbkZvck5ld05vZGUoYm94OiBCb3gsIGZyZWVSZWN0czogRnJlZVNwYWNlQm94W10pIHtcblx0XHRsZXQgYmVzdFNjb3JlID0gbmV3IFNjb3JlKCk7XG5cdFx0bGV0IHdpZHRoID0gYm94LndpZHRoO1xuXHRcdGxldCBoZWlnaHQgPSBib3guaGVpZ2h0O1xuXG5cdFx0ZnJlZVJlY3RzLmZvckVhY2goKGZyZWVSZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnRyeVBsYWNlUmVjdEluKGZyZWVSZWN0LCBib3gsIHdpZHRoLCBoZWlnaHQsIGJlc3RTY29yZSk7XG5cdFx0XHRpZiAoIWJveC5jb25zdHJhaW5Sb3RhdGlvbikge1xuXHRcdFx0XHR0aGlzLnRyeVBsYWNlUmVjdEluKGZyZWVSZWN0LCBib3gsIGhlaWdodCwgd2lkdGgsIGJlc3RTY29yZSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYmVzdFNjb3JlO1xuXHR9XG5cblx0dHJ5UGxhY2VSZWN0SW4oZnJlZVJlY3QsIGJveDogQm94LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQsIGJlc3RTY29yZSkge1xuXHRcdGlmIChmcmVlUmVjdC53aWR0aCA+PSByZWN0V2lkdGggJiYgZnJlZVJlY3QuaGVpZ2h0ID49IHJlY3RIZWlnaHQpIHtcblx0XHRcdGxldCBzY29yZSA9IHRoaXMuY2FsY3VsYXRlU2NvcmUoZnJlZVJlY3QsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCk7XG5cdFx0XHRpZiAoc2NvcmUgPCBiZXN0U2NvcmUpIHtcblx0XHRcdFx0Ym94LnggPSBmcmVlUmVjdC54O1xuXHRcdFx0XHRib3gueSA9IGZyZWVSZWN0Lnk7XG5cdFx0XHRcdGJveC53aWR0aCA9IHJlY3RXaWR0aDtcblx0XHRcdFx0Ym94LmhlaWdodCA9IHJlY3RIZWlnaHQ7XG5cdFx0XHRcdGJveC5wYWNrZWQgPSB0cnVlO1xuXHRcdFx0XHRiZXN0U2NvcmUuYXNzaWduKHNjb3JlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRjYWxjdWxhdGVTY29yZShfZnJlZVJlY3QsIF9yZWN0V2lkdGgsIF9yZWN0SGVpZ2h0KTogU2NvcmUge1xuXHRcdHRocm93ICdOb3RJbXBsZW1lbnRlZEVycm9yJztcblx0fVxufSIsIm1vZHVsZS5leHBvcnRzID0gW1xuICAgIFsgMHgwMzAwLCAweDAzNkYgXSwgWyAweDA0ODMsIDB4MDQ4NiBdLCBbIDB4MDQ4OCwgMHgwNDg5IF0sXG4gICAgWyAweDA1OTEsIDB4MDVCRCBdLCBbIDB4MDVCRiwgMHgwNUJGIF0sIFsgMHgwNUMxLCAweDA1QzIgXSxcbiAgICBbIDB4MDVDNCwgMHgwNUM1IF0sIFsgMHgwNUM3LCAweDA1QzcgXSwgWyAweDA2MDAsIDB4MDYwMyBdLFxuICAgIFsgMHgwNjEwLCAweDA2MTUgXSwgWyAweDA2NEIsIDB4MDY1RSBdLCBbIDB4MDY3MCwgMHgwNjcwIF0sXG4gICAgWyAweDA2RDYsIDB4MDZFNCBdLCBbIDB4MDZFNywgMHgwNkU4IF0sIFsgMHgwNkVBLCAweDA2RUQgXSxcbiAgICBbIDB4MDcwRiwgMHgwNzBGIF0sIFsgMHgwNzExLCAweDA3MTEgXSwgWyAweDA3MzAsIDB4MDc0QSBdLFxuICAgIFsgMHgwN0E2LCAweDA3QjAgXSwgWyAweDA3RUIsIDB4MDdGMyBdLCBbIDB4MDkwMSwgMHgwOTAyIF0sXG4gICAgWyAweDA5M0MsIDB4MDkzQyBdLCBbIDB4MDk0MSwgMHgwOTQ4IF0sIFsgMHgwOTRELCAweDA5NEQgXSxcbiAgICBbIDB4MDk1MSwgMHgwOTU0IF0sIFsgMHgwOTYyLCAweDA5NjMgXSwgWyAweDA5ODEsIDB4MDk4MSBdLFxuICAgIFsgMHgwOUJDLCAweDA5QkMgXSwgWyAweDA5QzEsIDB4MDlDNCBdLCBbIDB4MDlDRCwgMHgwOUNEIF0sXG4gICAgWyAweDA5RTIsIDB4MDlFMyBdLCBbIDB4MEEwMSwgMHgwQTAyIF0sIFsgMHgwQTNDLCAweDBBM0MgXSxcbiAgICBbIDB4MEE0MSwgMHgwQTQyIF0sIFsgMHgwQTQ3LCAweDBBNDggXSwgWyAweDBBNEIsIDB4MEE0RCBdLFxuICAgIFsgMHgwQTcwLCAweDBBNzEgXSwgWyAweDBBODEsIDB4MEE4MiBdLCBbIDB4MEFCQywgMHgwQUJDIF0sXG4gICAgWyAweDBBQzEsIDB4MEFDNSBdLCBbIDB4MEFDNywgMHgwQUM4IF0sIFsgMHgwQUNELCAweDBBQ0QgXSxcbiAgICBbIDB4MEFFMiwgMHgwQUUzIF0sIFsgMHgwQjAxLCAweDBCMDEgXSwgWyAweDBCM0MsIDB4MEIzQyBdLFxuICAgIFsgMHgwQjNGLCAweDBCM0YgXSwgWyAweDBCNDEsIDB4MEI0MyBdLCBbIDB4MEI0RCwgMHgwQjREIF0sXG4gICAgWyAweDBCNTYsIDB4MEI1NiBdLCBbIDB4MEI4MiwgMHgwQjgyIF0sIFsgMHgwQkMwLCAweDBCQzAgXSxcbiAgICBbIDB4MEJDRCwgMHgwQkNEIF0sIFsgMHgwQzNFLCAweDBDNDAgXSwgWyAweDBDNDYsIDB4MEM0OCBdLFxuICAgIFsgMHgwQzRBLCAweDBDNEQgXSwgWyAweDBDNTUsIDB4MEM1NiBdLCBbIDB4MENCQywgMHgwQ0JDIF0sXG4gICAgWyAweDBDQkYsIDB4MENCRiBdLCBbIDB4MENDNiwgMHgwQ0M2IF0sIFsgMHgwQ0NDLCAweDBDQ0QgXSxcbiAgICBbIDB4MENFMiwgMHgwQ0UzIF0sIFsgMHgwRDQxLCAweDBENDMgXSwgWyAweDBENEQsIDB4MEQ0RCBdLFxuICAgIFsgMHgwRENBLCAweDBEQ0EgXSwgWyAweDBERDIsIDB4MERENCBdLCBbIDB4MERENiwgMHgwREQ2IF0sXG4gICAgWyAweDBFMzEsIDB4MEUzMSBdLCBbIDB4MEUzNCwgMHgwRTNBIF0sIFsgMHgwRTQ3LCAweDBFNEUgXSxcbiAgICBbIDB4MEVCMSwgMHgwRUIxIF0sIFsgMHgwRUI0LCAweDBFQjkgXSwgWyAweDBFQkIsIDB4MEVCQyBdLFxuICAgIFsgMHgwRUM4LCAweDBFQ0QgXSwgWyAweDBGMTgsIDB4MEYxOSBdLCBbIDB4MEYzNSwgMHgwRjM1IF0sXG4gICAgWyAweDBGMzcsIDB4MEYzNyBdLCBbIDB4MEYzOSwgMHgwRjM5IF0sIFsgMHgwRjcxLCAweDBGN0UgXSxcbiAgICBbIDB4MEY4MCwgMHgwRjg0IF0sIFsgMHgwRjg2LCAweDBGODcgXSwgWyAweDBGOTAsIDB4MEY5NyBdLFxuICAgIFsgMHgwRjk5LCAweDBGQkMgXSwgWyAweDBGQzYsIDB4MEZDNiBdLCBbIDB4MTAyRCwgMHgxMDMwIF0sXG4gICAgWyAweDEwMzIsIDB4MTAzMiBdLCBbIDB4MTAzNiwgMHgxMDM3IF0sIFsgMHgxMDM5LCAweDEwMzkgXSxcbiAgICBbIDB4MTA1OCwgMHgxMDU5IF0sIFsgMHgxMTYwLCAweDExRkYgXSwgWyAweDEzNUYsIDB4MTM1RiBdLFxuICAgIFsgMHgxNzEyLCAweDE3MTQgXSwgWyAweDE3MzIsIDB4MTczNCBdLCBbIDB4MTc1MiwgMHgxNzUzIF0sXG4gICAgWyAweDE3NzIsIDB4MTc3MyBdLCBbIDB4MTdCNCwgMHgxN0I1IF0sIFsgMHgxN0I3LCAweDE3QkQgXSxcbiAgICBbIDB4MTdDNiwgMHgxN0M2IF0sIFsgMHgxN0M5LCAweDE3RDMgXSwgWyAweDE3REQsIDB4MTdERCBdLFxuICAgIFsgMHgxODBCLCAweDE4MEQgXSwgWyAweDE4QTksIDB4MThBOSBdLCBbIDB4MTkyMCwgMHgxOTIyIF0sXG4gICAgWyAweDE5MjcsIDB4MTkyOCBdLCBbIDB4MTkzMiwgMHgxOTMyIF0sIFsgMHgxOTM5LCAweDE5M0IgXSxcbiAgICBbIDB4MUExNywgMHgxQTE4IF0sIFsgMHgxQjAwLCAweDFCMDMgXSwgWyAweDFCMzQsIDB4MUIzNCBdLFxuICAgIFsgMHgxQjM2LCAweDFCM0EgXSwgWyAweDFCM0MsIDB4MUIzQyBdLCBbIDB4MUI0MiwgMHgxQjQyIF0sXG4gICAgWyAweDFCNkIsIDB4MUI3MyBdLCBbIDB4MURDMCwgMHgxRENBIF0sIFsgMHgxREZFLCAweDFERkYgXSxcbiAgICBbIDB4MjAwQiwgMHgyMDBGIF0sIFsgMHgyMDJBLCAweDIwMkUgXSwgWyAweDIwNjAsIDB4MjA2MyBdLFxuICAgIFsgMHgyMDZBLCAweDIwNkYgXSwgWyAweDIwRDAsIDB4MjBFRiBdLCBbIDB4MzAyQSwgMHgzMDJGIF0sXG4gICAgWyAweDMwOTksIDB4MzA5QSBdLCBbIDB4QTgwNiwgMHhBODA2IF0sIFsgMHhBODBCLCAweEE4MEIgXSxcbiAgICBbIDB4QTgyNSwgMHhBODI2IF0sIFsgMHhGQjFFLCAweEZCMUUgXSwgWyAweEZFMDAsIDB4RkUwRiBdLFxuICAgIFsgMHhGRTIwLCAweEZFMjMgXSwgWyAweEZFRkYsIDB4RkVGRiBdLCBbIDB4RkZGOSwgMHhGRkZCIF0sXG4gICAgWyAweDEwQTAxLCAweDEwQTAzIF0sIFsgMHgxMEEwNSwgMHgxMEEwNiBdLCBbIDB4MTBBMEMsIDB4MTBBMEYgXSxcbiAgICBbIDB4MTBBMzgsIDB4MTBBM0EgXSwgWyAweDEwQTNGLCAweDEwQTNGIF0sIFsgMHgxRDE2NywgMHgxRDE2OSBdLFxuICAgIFsgMHgxRDE3MywgMHgxRDE4MiBdLCBbIDB4MUQxODUsIDB4MUQxOEIgXSwgWyAweDFEMUFBLCAweDFEMUFEIF0sXG4gICAgWyAweDFEMjQyLCAweDFEMjQ0IF0sIFsgMHhFMDAwMSwgMHhFMDAwMSBdLCBbIDB4RTAwMjAsIDB4RTAwN0YgXSxcbiAgICBbIDB4RTAxMDAsIDB4RTAxRUYgXVxuXVxuIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnZGVmYXVsdHMnKVxudmFyIGNvbWJpbmluZyA9IHJlcXVpcmUoJy4vY29tYmluaW5nJylcblxudmFyIERFRkFVTFRTID0ge1xuICBudWw6IDAsXG4gIGNvbnRyb2w6IDBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3Y3dpZHRoKHN0cikge1xuICByZXR1cm4gd2Nzd2lkdGgoc3RyLCBERUZBVUxUUylcbn1cblxubW9kdWxlLmV4cG9ydHMuY29uZmlnID0gZnVuY3Rpb24ob3B0cykge1xuICBvcHRzID0gZGVmYXVsdHMob3B0cyB8fCB7fSwgREVGQVVMVFMpXG4gIHJldHVybiBmdW5jdGlvbiB3Y3dpZHRoKHN0cikge1xuICAgIHJldHVybiB3Y3N3aWR0aChzdHIsIG9wdHMpXG4gIH1cbn1cblxuLypcbiAqICBUaGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBkZWZpbmUgdGhlIGNvbHVtbiB3aWR0aCBvZiBhbiBJU08gMTA2NDZcbiAqICBjaGFyYWN0ZXIgYXMgZm9sbG93czpcbiAqICAtIFRoZSBudWxsIGNoYXJhY3RlciAoVSswMDAwKSBoYXMgYSBjb2x1bW4gd2lkdGggb2YgMC5cbiAqICAtIE90aGVyIEMwL0MxIGNvbnRyb2wgY2hhcmFjdGVycyBhbmQgREVMIHdpbGwgbGVhZCB0byBhIHJldHVybiB2YWx1ZVxuICogICAgb2YgLTEuXG4gKiAgLSBOb24tc3BhY2luZyBhbmQgZW5jbG9zaW5nIGNvbWJpbmluZyBjaGFyYWN0ZXJzIChnZW5lcmFsIGNhdGVnb3J5XG4gKiAgICBjb2RlIE1uIG9yIE1lIGluIHRoZVxuICogICAgVW5pY29kZSBkYXRhYmFzZSkgaGF2ZSBhIGNvbHVtbiB3aWR0aCBvZiAwLlxuICogIC0gU09GVCBIWVBIRU4gKFUrMDBBRCkgaGFzIGEgY29sdW1uIHdpZHRoIG9mIDEuXG4gKiAgLSBPdGhlciBmb3JtYXQgY2hhcmFjdGVycyAoZ2VuZXJhbCBjYXRlZ29yeSBjb2RlIENmIGluIHRoZSBVbmljb2RlXG4gKiAgICBkYXRhYmFzZSkgYW5kIFpFUk8gV0lEVEhcbiAqICAgIFNQQUNFIChVKzIwMEIpIGhhdmUgYSBjb2x1bW4gd2lkdGggb2YgMC5cbiAqICAtIEhhbmd1bCBKYW1vIG1lZGlhbCB2b3dlbHMgYW5kIGZpbmFsIGNvbnNvbmFudHMgKFUrMTE2MC1VKzExRkYpXG4gKiAgICBoYXZlIGEgY29sdW1uIHdpZHRoIG9mIDAuXG4gKiAgLSBTcGFjaW5nIGNoYXJhY3RlcnMgaW4gdGhlIEVhc3QgQXNpYW4gV2lkZSAoVykgb3IgRWFzdCBBc2lhblxuICogICAgRnVsbC13aWR0aCAoRikgY2F0ZWdvcnkgYXNcbiAqICAgIGRlZmluZWQgaW4gVW5pY29kZSBUZWNobmljYWwgUmVwb3J0ICMxMSBoYXZlIGEgY29sdW1uIHdpZHRoIG9mIDIuXG4gKiAgLSBBbGwgcmVtYWluaW5nIGNoYXJhY3RlcnMgKGluY2x1ZGluZyBhbGwgcHJpbnRhYmxlIElTTyA4ODU5LTEgYW5kXG4gKiAgICBXR0w0IGNoYXJhY3RlcnMsIFVuaWNvZGUgY29udHJvbCBjaGFyYWN0ZXJzLCBldGMuKSBoYXZlIGEgY29sdW1uXG4gKiAgICB3aWR0aCBvZiAxLlxuICogIFRoaXMgaW1wbGVtZW50YXRpb24gYXNzdW1lcyB0aGF0IGNoYXJhY3RlcnMgYXJlIGVuY29kZWQgaW4gSVNPIDEwNjQ2LlxuKi9cblxuZnVuY3Rpb24gd2Nzd2lkdGgoc3RyLCBvcHRzKSB7XG4gIGlmICh0eXBlb2Ygc3RyICE9PSAnc3RyaW5nJykgcmV0dXJuIHdjd2lkdGgoc3RyLCBvcHRzKVxuXG4gIHZhciBzID0gMFxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBuID0gd2N3aWR0aChzdHIuY2hhckNvZGVBdChpKSwgb3B0cylcbiAgICBpZiAobiA8IDApIHJldHVybiAtMVxuICAgIHMgKz0gblxuICB9XG5cbiAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gd2N3aWR0aCh1Y3MsIG9wdHMpIHtcbiAgLy8gdGVzdCBmb3IgOC1iaXQgY29udHJvbCBjaGFyYWN0ZXJzXG4gIGlmICh1Y3MgPT09IDApIHJldHVybiBvcHRzLm51bFxuICBpZiAodWNzIDwgMzIgfHwgKHVjcyA+PSAweDdmICYmIHVjcyA8IDB4YTApKSByZXR1cm4gb3B0cy5jb250cm9sXG5cbiAgLy8gYmluYXJ5IHNlYXJjaCBpbiB0YWJsZSBvZiBub24tc3BhY2luZyBjaGFyYWN0ZXJzXG4gIGlmIChiaXNlYXJjaCh1Y3MpKSByZXR1cm4gMFxuXG4gIC8vIGlmIHdlIGFycml2ZSBoZXJlLCB1Y3MgaXMgbm90IGEgY29tYmluaW5nIG9yIEMwL0MxIGNvbnRyb2wgY2hhcmFjdGVyXG4gIHJldHVybiAxICtcbiAgICAgICh1Y3MgPj0gMHgxMTAwICYmXG4gICAgICAgKHVjcyA8PSAweDExNWYgfHwgICAgICAgICAgICAgICAgICAgICAgIC8vIEhhbmd1bCBKYW1vIGluaXQuIGNvbnNvbmFudHNcbiAgICAgICAgdWNzID09IDB4MjMyOSB8fCB1Y3MgPT0gMHgyMzJhIHx8XG4gICAgICAgICh1Y3MgPj0gMHgyZTgwICYmIHVjcyA8PSAweGE0Y2YgJiZcbiAgICAgICAgIHVjcyAhPSAweDMwM2YpIHx8ICAgICAgICAgICAgICAgICAgICAgLy8gQ0pLIC4uLiBZaVxuICAgICAgICAodWNzID49IDB4YWMwMCAmJiB1Y3MgPD0gMHhkN2EzKSB8fCAgICAvLyBIYW5ndWwgU3lsbGFibGVzXG4gICAgICAgICh1Y3MgPj0gMHhmOTAwICYmIHVjcyA8PSAweGZhZmYpIHx8ICAgIC8vIENKSyBDb21wYXRpYmlsaXR5IElkZW9ncmFwaHNcbiAgICAgICAgKHVjcyA+PSAweGZlMTAgJiYgdWNzIDw9IDB4ZmUxOSkgfHwgICAgLy8gVmVydGljYWwgZm9ybXNcbiAgICAgICAgKHVjcyA+PSAweGZlMzAgJiYgdWNzIDw9IDB4ZmU2ZikgfHwgICAgLy8gQ0pLIENvbXBhdGliaWxpdHkgRm9ybXNcbiAgICAgICAgKHVjcyA+PSAweGZmMDAgJiYgdWNzIDw9IDB4ZmY2MCkgfHwgICAgLy8gRnVsbHdpZHRoIEZvcm1zXG4gICAgICAgICh1Y3MgPj0gMHhmZmUwICYmIHVjcyA8PSAweGZmZTYpIHx8XG4gICAgICAgICh1Y3MgPj0gMHgyMDAwMCAmJiB1Y3MgPD0gMHgyZmZmZCkgfHxcbiAgICAgICAgKHVjcyA+PSAweDMwMDAwICYmIHVjcyA8PSAweDNmZmZkKSkpO1xufVxuXG5mdW5jdGlvbiBiaXNlYXJjaCh1Y3MpIHtcbiAgdmFyIG1pbiA9IDBcbiAgdmFyIG1heCA9IGNvbWJpbmluZy5sZW5ndGggLSAxXG4gIHZhciBtaWRcblxuICBpZiAodWNzIDwgY29tYmluaW5nWzBdWzBdIHx8IHVjcyA+IGNvbWJpbmluZ1ttYXhdWzFdKSByZXR1cm4gZmFsc2VcblxuICB3aGlsZSAobWF4ID49IG1pbikge1xuICAgIG1pZCA9IE1hdGguZmxvb3IoKG1pbiArIG1heCkgLyAyKVxuICAgIGlmICh1Y3MgPiBjb21iaW5pbmdbbWlkXVsxXSkgbWluID0gbWlkICsgMVxuICAgIGVsc2UgaWYgKHVjcyA8IGNvbWJpbmluZ1ttaWRdWzBdKSBtYXggPSBtaWQgLSAxXG4gICAgZWxzZSByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlXG59XG4iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVzdEFyZWFGaXQgZXh0ZW5kcyBCYXNlIHtcblxuICBjYWxjdWxhdGVTY29yZShmcmVlUmVjdCwgcmVjdFdpZHRoLCByZWN0SGVpZ2h0KSB7XG4gICAgbGV0IGFyZWFGaXQgPSBmcmVlUmVjdC53aWR0aCAqIGZyZWVSZWN0LmhlaWdodCAtIHJlY3RXaWR0aCAqIHJlY3RIZWlnaHQ7XG4gICAgbGV0IGxlZnRPdmVySG9yaXogPSBNYXRoLmFicyhmcmVlUmVjdC53aWR0aCAtIHJlY3RXaWR0aCk7XG4gICAgbGV0IGxlZnRPdmVyVmVydCA9IE1hdGguYWJzKGZyZWVSZWN0LmhlaWdodCAtIHJlY3RIZWlnaHQpO1xuICAgIGxldCBzaG9ydFNpZGVGaXQgPSBNYXRoLm1pbihsZWZ0T3Zlckhvcml6LCBsZWZ0T3ZlclZlcnQpO1xuICAgIHJldHVybiBuZXcgU2NvcmUoYXJlYUZpdCwgc2hvcnRTaWRlRml0KTtcbiAgfVxuXG59IiwiaW1wb3J0IEJhc2UgZnJvbSAnLi9CYXNlJztcbmltcG9ydCBTY29yZSBmcm9tICcuLi9TY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJlc3RMb25nU2lkZUZpdCBleHRlbmRzIEJhc2Uge1xuXG4gIGNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpIHtcbiAgICBsZXQgbGVmdE92ZXJIb3JpeiA9IE1hdGguYWJzKGZyZWVSZWN0LndpZHRoIC0gcmVjdFdpZHRoKTtcbiAgICBsZXQgbGVmdE92ZXJWZXJ0ID0gTWF0aC5hYnMoZnJlZVJlY3QuaGVpZ2h0IC0gcmVjdEhlaWdodCk7XG4gICAgbGV0IGFyZ3MgPSBbbGVmdE92ZXJIb3JpeiwgbGVmdE92ZXJWZXJ0XS5zb3J0KChhLCBiKSA9PiBhIC0gYikucmV2ZXJzZSgpO1xuICAgIHJldHVybiBuZXcgU2NvcmUoYXJnc1swXSwgYXJnc1sxXSk7XG4gIH1cblxufSIsImltcG9ydCBCYXNlIGZyb20gJy4vQmFzZSc7XG5pbXBvcnQgU2NvcmUgZnJvbSAnLi4vU2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZXN0U2hvcnRTaWRlRml0IGV4dGVuZHMgQmFzZSB7XG5cbiAgY2FsY3VsYXRlU2NvcmUoZnJlZVJlY3QsIHJlY3RXaWR0aCwgcmVjdEhlaWdodCkge1xuICAgIGxldCBsZWZ0T3Zlckhvcml6ID0gTWF0aC5hYnMoZnJlZVJlY3Qud2lkdGggLSByZWN0V2lkdGgpO1xuICAgIGxldCBsZWZ0T3ZlclZlcnQgPSBNYXRoLmFicyhmcmVlUmVjdC5oZWlnaHQgLSByZWN0SGVpZ2h0KTtcbiAgICBsZXQgYXJncyA9IFtsZWZ0T3Zlckhvcml6LCBsZWZ0T3ZlclZlcnRdLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcbiAgICBsZXQgc2NvcmUgPSBuZXcgU2NvcmUoYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgcmV0dXJuIHNjb3JlO1xuICB9XG5cbn0iLCJpbXBvcnQgQmFzZSBmcm9tICcuL0Jhc2UnO1xuaW1wb3J0IFNjb3JlIGZyb20gJy4uL1Njb3JlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQm90dG9tTGVmdCBleHRlbmRzIEJhc2Uge1xuXG4gIGNhbGN1bGF0ZVNjb3JlKGZyZWVSZWN0LCByZWN0V2lkdGgsIHJlY3RIZWlnaHQpIHtcbiAgICBsZXQgdG9wU2lkZVkgPSBmcmVlUmVjdC55ICsgcmVjdEhlaWdodDtcbiAgICByZXR1cm4gbmV3IFNjb3JlKHRvcFNpZGVZLCBmcmVlUmVjdC54KTtcbiAgfVxuXG59IiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBCZXN0QXJlYUZpdCB9IGZyb20gJy4vQmVzdEFyZWFGaXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBCZXN0TG9uZ1NpZGVGaXQgfSBmcm9tICcuL0Jlc3RMb25nU2lkZUZpdCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEJlc3RTaG9ydFNpZGVGaXQgfSBmcm9tICcuL0Jlc3RTaG9ydFNpZGVGaXQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBCb3R0b21MZWZ0IH0gZnJvbSAnLi9Cb3R0b21MZWZ0JzsiLCJpbXBvcnQgQmluIGZyb20gJy4vQmluJ1xuaW1wb3J0IEJveCBmcm9tICcuL0JveCdcbmltcG9ydCBQYWNrZXIgZnJvbSAnLi9QYWNrZXInXG5pbXBvcnQgKiBhcyBoZXVyaXN0aWNzIGZyb20gJy4vaGV1cmlzdGljcyc7XG5cbmV4cG9ydCB7IEJpbiwgQm94LCBQYWNrZXIsIGhldXJpc3RpY3MgfTsiLCJpbXBvcnQgeyBmYWN0b3JlZEludGVnZXIgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtjcmVhdGVMb2dnZXJ9IGZyb20gXCIuLi9saWIvbG9nXCI7XG5jb25zdCBsb2cgPSBjcmVhdGVMb2dnZXIoJzNEOicpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaW4ge1xuXG4gIG5hbWUgPSAnJztcbiAgd2lkdGggPSAwO1xuICBoZWlnaHQgPSAwO1xuICBkZXB0aCA9IDA7XG4gIG1heFdlaWdodCA9IDA7XG5cbiAgaXRlbXMgPSBbXTtcblxuICBjb25zdHJ1Y3RvcihuYW1lLCB3LCBoLCBkLCBtdykge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy53aWR0aCA9IGZhY3RvcmVkSW50ZWdlciggdyApO1xuICAgIHRoaXMuaGVpZ2h0ID0gZmFjdG9yZWRJbnRlZ2VyKCBoICk7XG4gICAgdGhpcy5kZXB0aCA9IGZhY3RvcmVkSW50ZWdlciggZCApO1xuICAgIHRoaXMubWF4V2VpZ2h0ID0gZmFjdG9yZWRJbnRlZ2VyKCBtdyApO1xuICB9XG5cbiAgZ2V0TmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5uYW1lO1xuICB9XG5cbiAgZ2V0V2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMud2lkdGg7XG4gIH1cblxuICBnZXRIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgZ2V0RGVwdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVwdGg7XG4gIH1cblxuICBnZXRNYXhXZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMubWF4V2VpZ2h0O1xuICB9XG5cbiAgZ2V0SXRlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXM7XG4gIH1cblxuICBnZXRWb2x1bWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V2lkdGgoKSAqIHRoaXMuZ2V0SGVpZ2h0KCkgKiB0aGlzLmdldERlcHRoKCk7XG4gIH1cblxuICBnZXRQYWNrZWRXZWlnaHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMucmVkdWNlKCAoIHdlaWdodCwgaXRlbSApID0+IHdlaWdodCArIGl0ZW0uZ2V0V2VpZ2h0KCksIDAgKTtcbiAgfVxuXG4gIHdlaWdoSXRlbShpdGVtKSB7XG4gICAgY29uc3QgbWF4V2VpZ2h0ID0gdGhpcy5nZXRNYXhXZWlnaHQoKTtcbiAgICByZXR1cm4gISBtYXhXZWlnaHQgfHwgaXRlbS5nZXRXZWlnaHQoKSArIHRoaXMuZ2V0UGFja2VkV2VpZ2h0KCkgPD0gbWF4V2VpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSBhIHNjb3JlIGZvciBhIGdpdmVuIGl0ZW0gYW5kIHJvdGF0aW9uIHR5cGUuXG4gICAqXG4gICAqIFNjb3JlcyBhcmUgaGlnaGVyIGZvciByb3RhdGlvbnMgdGhhdCBjbG9zZXN0IG1hdGNoIGl0ZW0gZGltZW5zaW9ucyB0byBCaW4gZGltZW5zaW9ucy5cbiAgICogRm9yIGV4YW1wbGUsIHJvdGF0aW5nIHRoZSBpdGVtIHNvIHRoZSBsb25nZXN0IHNpZGUgaXMgYWxpZ25lZCB3aXRoIHRoZSBsb25nZXN0IEJpbiBzaWRlLlxuICAgKlxuICAgKiBFeGFtcGxlIChCaW4gaXMgMTEgeCA4LjUgeCA1LjUsIEl0ZW0gaXMgOC4xIHggNS4yIHggNS4yKTpcbiAgICogIFJvdGF0aW9uIDA6XG4gICAqICAgIDguMSAvIDExICA9IDAuNzM2XG4gICAqICAgIDUuMiAvIDguNSA9IDAuNjEyXG4gICAqICAgIDUuMiAvIDUuNSA9IDAuOTQ1XG4gICAqICAgIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICAgIDAuNzM2ICoqIDIgKyAwLjYxMiAqKiAyICsgMC45NDUgKiogMiA9IDEuODA5XG4gICAqXG4gICAqICBSb3RhdGlvbiAxOlxuICAgKiAgICA4LjEgLyA4LjUgPSAwLjk1M1xuICAgKiAgICA1LjIgLyAxMSA9IDAuNDczXG4gICAqICAgIDUuMiAvIDUuNSA9IDAuOTQ1XG4gICAqICAgIC0tLS0tLS0tLS0tLS0tLS0tXG4gICAqICAgIDAuOTUzICoqIDIgKyAwLjQ3MyAqKiAyICsgMC45NDUgKiogMiA9IDIuMDI1XG4gICAqXG4gICAqIEBwYXJhbSB7SXRlbX0gaXRlbVxuICAgKiBAcGFyYW0ge2ludH0gcm90YXRpb25UeXBlXG4gICAqIEByZXR1cm4ge2Zsb2F0fSBzY29yZVxuICAgKi9cbiAgc2NvcmVSb3RhdGlvbihpdGVtLCByb3RhdGlvblR5cGUpIHtcbiAgICBpdGVtLnJvdGF0aW9uVHlwZSA9IHJvdGF0aW9uVHlwZTtcbiAgICBsZXQgZCA9IGl0ZW0uZ2V0RGltZW5zaW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgaXRlbSBkb2Vzbid0IGZpdCBpbiB0aGUgQmluXG4gICAgaWYgKCB0aGlzLmdldFdpZHRoKCkgPCBkWzBdIHx8IHRoaXMuZ2V0SGVpZ2h0KCkgPCBkWzFdIHx8IHRoaXMuZ2V0RGVwdGgoKSA8IGRbMl0gKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIC8vIFNxdWFyZSB0aGUgcmVzdWx0cyB0byBpbmNyZWFzZSB0aGUgaW1wYWN0IG9mIGhpZ2ggdmFsdWVzIChlLmcuID4gMC44KVxuICAgIGNvbnN0IHdpZHRoU2NvcmUgPSBNYXRoLnBvdyggZFswXSAvIHRoaXMuZ2V0V2lkdGgoKSwgMiApO1xuICAgIGNvbnN0IGhlaWdodFNjb3JlID0gTWF0aC5wb3coIGRbMV0gLyB0aGlzLmdldEhlaWdodCgpLCAyICk7XG4gICAgY29uc3QgZGVwdGhTY29yZSA9IE1hdGgucG93KCBkWzJdIC8gdGhpcy5nZXREZXB0aCgpLCAyICk7XG5cbiAgICByZXR1cm4gd2lkdGhTY29yZSArIGhlaWdodFNjb3JlICsgZGVwdGhTY29yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGUgdGhlIGJlc3Qgcm90YXRpb24gb3JkZXIgZm9yIGEgZ2l2ZW4gSXRlbSBiYXNlZCBvbiBzY29yZVJvdGF0aW9uKCkuXG4gICAqXG4gICAqIEBwYXJhbSB7SXRlbX0gaXRlbVxuICAgKiBAcmV0dXJuIHtBcnJheX0gUm90YXRpb24gdHlwZXMgc29ydGVkIGJ5IHRoZWlyIHNjb3JlLCBERVNDXG4gICAqL1xuICBnZXRCZXN0Um90YXRpb25PcmRlcihpdGVtKSB7XG4gICAgY29uc3Qgcm90YXRpb25TY29yZXMgPSB7fTtcblxuICAgIC8vIFNjb3JlIGFsbCByb3RhdGlvbiB0eXBlc1xuXHRmb3IgKGxldCBpPTA7IGk8aXRlbS5hbGxvd2VkUm90YXRpb24ubGVuZ3RoOyBpKyspIHtcblx0ICAgIGNvbnN0IHIgPSBpdGVtLmFsbG93ZWRSb3RhdGlvbltpXTtcblx0XHRyb3RhdGlvblNjb3Jlc1tyXSA9IHRoaXMuc2NvcmVSb3RhdGlvbiggaXRlbSwgciApO1xuICAgIH1cblxuICAgIC8vIFNvcnQgdGhlIHJvdGF0aW9uIHR5cGVzIChpbmRleCBvZiBzY29yZXMgb2JqZWN0KSBERVNDXG4gICAgLy8gYW5kIGVuc3VyZSBJbnQgdmFsdWVzIChPYmplY3Qua2V5cyByZXR1cm5zIHN0cmluZ3MpXG4gICAgY29uc3Qgc29ydGVkUm90YXRpb25zID0gT2JqZWN0LmtleXMoIHJvdGF0aW9uU2NvcmVzICkuc29ydCggKCBhLCBiICkgPT4ge1xuICAgICAgcmV0dXJuIHJvdGF0aW9uU2NvcmVzW2JdIC0gcm90YXRpb25TY29yZXNbYV07XG4gICAgfSApLm1hcCggTnVtYmVyICk7XG5cbiAgICByZXR1cm4gc29ydGVkUm90YXRpb25zO1xuICB9XG5cbiAgcHV0SXRlbShpdGVtLCBwKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcztcbiAgICBsZXQgZml0ID0gZmFsc2U7XG4gICAgY29uc3Qgcm90YXRpb25zID0gdGhpcy5nZXRCZXN0Um90YXRpb25PcmRlciggaXRlbSApO1xuICAgIGl0ZW0ucG9zaXRpb24gPSBwO1xuXG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgcm90YXRpb25zLmxlbmd0aDsgaSsrICkge1xuICAgICAgaXRlbS5yb3RhdGlvblR5cGUgPSByb3RhdGlvbnNbaV07XG4gICAgICBsZXQgZCA9IGl0ZW0uZ2V0RGltZW5zaW9uKCk7XG5cbiAgICAgIGlmIChib3guZ2V0V2lkdGgoKSA8IHBbMF0gKyBkWzBdIHx8IGJveC5nZXRIZWlnaHQoKSA8IHBbMV0gKyBkWzFdIHx8IGJveC5nZXREZXB0aCgpIDwgcFsyXSArIGRbMl0pIHtcbiAgICAgICAgZml0ID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaXQgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGo9MDsgajxib3guaXRlbXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICBsZXQgX2ogPSBib3guaXRlbXNbal07XG4gICAgICAgICAgaWYgKF9qLmludGVyc2VjdChpdGVtKSkge1xuICAgICAgICAgICAgZml0ID0gZmFsc2U7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZml0KSB7XG4gICAgICAgICAgYm94Lml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbG9nKCd0cnkgdG8gcHV0SXRlbScsIGZpdCwgJ2l0ZW0nLCBpdGVtLnRvU3RyaW5nKCksICdib3gnLCBib3gudG9TdHJpbmcoKSk7XG5cbiAgICAgIGlmIChmaXQpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmaXQ7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEJpbjoke3RoaXMubmFtZX0gKFd4SHhEID0gJHt0aGlzLmdldFdpZHRoKCl9eCR7dGhpcy5nZXRIZWlnaHQoKX14JHt0aGlzLmdldERlcHRoKCl9LCBNYXhXZy4gPSAke3RoaXMuZ2V0TWF4V2VpZ2h0KCl9KWA7XG4gIH1cblxufSIsImltcG9ydCB7IGZhY3RvcmVkSW50ZWdlciB9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBjb25zdCBSb3RhdGlvblR5cGVfV0hEID0gMDtcbmV4cG9ydCBjb25zdCBSb3RhdGlvblR5cGVfSFdEID0gMTtcbmV4cG9ydCBjb25zdCBSb3RhdGlvblR5cGVfSERXID0gMjtcbmV4cG9ydCBjb25zdCBSb3RhdGlvblR5cGVfREhXID0gMztcbmV4cG9ydCBjb25zdCBSb3RhdGlvblR5cGVfRFdIID0gNDtcbmV4cG9ydCBjb25zdCBSb3RhdGlvblR5cGVfV0RIID0gNTtcblxuZXhwb3J0IGNvbnN0IFdpZHRoQXhpcyA9IDA7XG5leHBvcnQgY29uc3QgSGVpZ2h0QXhpcyA9IDE7XG5leHBvcnQgY29uc3QgRGVwdGhBeGlzID0gMjtcblxuZXhwb3J0IGNvbnN0IFN0YXJ0UG9zaXRpb24gPSBbMCwgMCwgMF07XG5cbmV4cG9ydCBjb25zdCBSb3RhdGlvblR5cGVTdHJpbmdzID0ge1xuICBbUm90YXRpb25UeXBlX1dIRF06ICdSb3RhdGlvblR5cGVfV0hEICh3LGgsZCknLFxuICBbUm90YXRpb25UeXBlX0hXRF06ICdSb3RhdGlvblR5cGVfSFdEIChoLHcsZCknLFxuICBbUm90YXRpb25UeXBlX0hEV106ICdSb3RhdGlvblR5cGVfSERXIChoLGQsdyknLFxuICBbUm90YXRpb25UeXBlX0RIV106ICdSb3RhdGlvblR5cGVfREhXIChkLGgsdyknLFxuICBbUm90YXRpb25UeXBlX0RXSF06ICdSb3RhdGlvblR5cGVfRFdIIChkLHcsaCknLFxuICBbUm90YXRpb25UeXBlX1dESF06ICdSb3RhdGlvblR5cGVfV0RIICh3LGQsaCknLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSXRlbSB7XG5cbiAgbmFtZSA9ICcnO1xuICB3aWR0aCA9IDA7XG4gIGhlaWdodCA9IDA7XG4gIGRlcHRoID0gMDtcbiAgd2VpZ2h0ID0gMDtcbiAgYWxsb3dlZFJvdGF0aW9uID0gWzAsMSwyLDMsNCw1XTtcblxuICByb3RhdGlvblR5cGUgPSBSb3RhdGlvblR5cGVfV0hEO1xuICBwb3NpdGlvbiA9IFtdOyAvLyB4LCB5LCB6XG5cbiAgY29uc3RydWN0b3IobmFtZSwgdywgaCwgZCwgd2csIGFsbG93ZWRSb3RhdGlvbikge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy53aWR0aCA9IGZhY3RvcmVkSW50ZWdlciggdyApO1xuICAgIHRoaXMuaGVpZ2h0ID0gZmFjdG9yZWRJbnRlZ2VyKCBoICk7XG4gICAgdGhpcy5kZXB0aCA9IGZhY3RvcmVkSW50ZWdlciggZCApO1xuICAgIHRoaXMud2VpZ2h0ID0gZmFjdG9yZWRJbnRlZ2VyKCB3ZyApO1xuICAgIHRoaXMuYWxsb3dlZFJvdGF0aW9uID0gYWxsb3dlZFJvdGF0aW9uID8gYWxsb3dlZFJvdGF0aW9uIDogdGhpcy5hbGxvd2VkUm90YXRpb247XG4gIH1cblxuICBnZXRXaWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgfVxuXG4gIGdldEhlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy5oZWlnaHQ7XG4gIH1cblxuICBnZXREZXB0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5kZXB0aDtcbiAgfVxuXG4gIGdldFdlaWdodCgpIHtcbiAgICByZXR1cm4gdGhpcy53ZWlnaHQ7XG4gIH1cblxuICBnZXRSb3RhdGlvblR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMucm90YXRpb25UeXBlO1xuICB9XG5cbiAgZ2V0QWxsb3dlZFJvdGF0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmFsbG93ZWRSb3RhdGlvbjtcbiAgfVxuXG4gIGdldFJvdGF0aW9uVHlwZVN0cmluZygpIHtcbiAgICByZXR1cm4gUm90YXRpb25UeXBlU3RyaW5nc1t0aGlzLmdldFJvdGF0aW9uVHlwZSgpXTtcbiAgfVxuXG4gIGdldERpbWVuc2lvbigpIHtcbiAgICBsZXQgZDtcbiAgICBzd2l0Y2ggKHRoaXMucm90YXRpb25UeXBlKSB7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9XSEQ6XG4gICAgICAgIGQgPSBbdGhpcy5nZXRXaWR0aCgpLCB0aGlzLmdldEhlaWdodCgpLCB0aGlzLmdldERlcHRoKCldO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX0hXRDpcbiAgICAgICAgZCA9IFt0aGlzLmdldEhlaWdodCgpLCB0aGlzLmdldFdpZHRoKCksIHRoaXMuZ2V0RGVwdGgoKV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfSERXOlxuICAgICAgICBkID0gW3RoaXMuZ2V0SGVpZ2h0KCksIHRoaXMuZ2V0RGVwdGgoKSwgdGhpcy5nZXRXaWR0aCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFJvdGF0aW9uVHlwZV9ESFc6XG4gICAgICAgIGQgPSBbdGhpcy5nZXREZXB0aCgpLCB0aGlzLmdldEhlaWdodCgpLCB0aGlzLmdldFdpZHRoKCldO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgUm90YXRpb25UeXBlX0RXSDpcbiAgICAgICAgZCA9IFt0aGlzLmdldERlcHRoKCksIHRoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXRIZWlnaHQoKV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBSb3RhdGlvblR5cGVfV0RIOlxuICAgICAgICBkID0gW3RoaXMuZ2V0V2lkdGgoKSwgdGhpcy5nZXREZXB0aCgpLCB0aGlzLmdldEhlaWdodCgpXTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiBkO1xuICB9XG5cbiAgaW50ZXJzZWN0KGkyKSB7XG4gICAgcmV0dXJuIHJlY3RJbnRlcnNlY3QodGhpcywgaTIsIFdpZHRoQXhpcywgSGVpZ2h0QXhpcykgJiZcbiAgICAgICAgcmVjdEludGVyc2VjdCh0aGlzLCBpMiwgSGVpZ2h0QXhpcywgRGVwdGhBeGlzKSAmJlxuICAgICAgICByZWN0SW50ZXJzZWN0KHRoaXMsIGkyLCBXaWR0aEF4aXMsIERlcHRoQXhpcyk7XG4gIH1cblxuICBnZXRWb2x1bWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0V2lkdGgoKSAqIHRoaXMuZ2V0SGVpZ2h0KCkgKiB0aGlzLmdldERlcHRoKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gYEl0ZW06JHt0aGlzLm5hbWV9ICgke3RoaXMuZ2V0Um90YXRpb25UeXBlU3RyaW5nKCl9ID0gJHt0aGlzLmdldERpbWVuc2lvbigpLmpvaW4oJ3gnKX0sIFdnLiA9ICR7dGhpcy53ZWlnaHR9KWA7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJlY3RJbnRlcnNlY3QgPSAoaTEsIGkyLCB4LCB5KSA9PiB7XG4gIGxldCBkMSwgZDIsIGN4MSwgY3kxLCBjeDIsIGN5MiwgaXgsIGl5O1xuXG4gIGQxID0gaTEuZ2V0RGltZW5zaW9uKCk7XG4gIGQyID0gaTIuZ2V0RGltZW5zaW9uKCk7XG5cbiAgY3gxID0gaTEucG9zaXRpb25beF0gKyBkMVt4XSAvIDI7XG4gIGN5MSA9IGkxLnBvc2l0aW9uW3ldICsgZDFbeV0gLyAyO1xuICBjeDIgPSBpMi5wb3NpdGlvblt4XSArIGQyW3hdIC8gMjtcbiAgY3kyID0gaTIucG9zaXRpb25beV0gKyBkMlt5XSAvIDI7XG5cbiAgaXggPSBNYXRoLm1heChjeDEsIGN4MikgLSBNYXRoLm1pbihjeDEsIGN4Mik7XG4gIGl5ID0gTWF0aC5tYXgoY3kxLCBjeTIpIC0gTWF0aC5taW4oY3kxLCBjeTIpO1xuXG4gIHJldHVybiBpeCA8IChkMVt4XSArIGQyW3hdKSAvIDIgJiYgaXkgPCAoZDFbeV0gKyBkMlt5XSkgLyAyO1xufTsiLCJpbXBvcnQgQmluIGZyb20gJy4vQmluJztcbmltcG9ydCB7XG4gIEl0ZW0sXG4gIFN0YXJ0UG9zaXRpb24sXG4gIFdpZHRoQXhpcyxcbiAgSGVpZ2h0QXhpcyxcbiAgRGVwdGhBeGlzXG59IGZyb20gJy4vSXRlbSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhY2tlciB7XG5cbiAgYmlucyA9IFtdO1xuICBpdGVtcyA9IFtdO1xuICB1bmZpdEl0ZW1zID0gW107XG5cbiAgYWRkQmluKGJpbikge1xuICAgIHRoaXMuYmlucy5wdXNoKGJpbik7XG4gIH1cblxuICBhZGRJdGVtKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG4gIH1cblxuICBmaW5kRml0dGVkQmluKGkpIHtcbiAgICBmb3IgKGxldCBfaT0wOyBfaTx0aGlzLmJpbnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICBsZXQgYiA9IHRoaXMuYmluc1tfaV07XG5cbiAgICAgIGlmICghYi53ZWlnaEl0ZW0oaSkgfHwgIWIucHV0SXRlbShpLCBTdGFydFBvc2l0aW9uKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGIuaXRlbXMubGVuZ3RoID09PSAxICYmIGIuaXRlbXNbMF0gPT09IGkpIHtcbiAgICAgICAgYi5pdGVtcyA9IFtdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYjtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXRCaWdnZXJCaW5UaGFuKGIpIHtcbiAgICBsZXQgdiA9IGIuZ2V0Vm9sdW1lKCk7XG4gICAgZm9yIChsZXQgX2k9MDsgX2k8dGhpcy5iaW5zOyBfaSsrKSB7XG4gICAgICBsZXQgYjIgPSB0aGlzLmJpbnNbX2ldO1xuICAgICAgaWYgKGIyLmdldFZvbHVtZSgpID4gdikge1xuICAgICAgICByZXR1cm4gYjI7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdW5maXRJdGVtKCkge1xuICAgIGlmICh0aGlzLml0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnVuZml0SXRlbXMucHVzaCh0aGlzLml0ZW1zWzBdKTtcbiAgICB0aGlzLml0ZW1zLnNwbGljZSgwLCAxKTtcbiAgfVxuXG4gIHBhY2tUb0JpbihiLCBpdGVtcykge1xuICAgIGxldCBiMiA9IG51bGw7XG4gICAgbGV0IHVucGFja2VkID0gW107XG4gICAgbGV0IGZpdCA9IGIud2VpZ2hJdGVtKGl0ZW1zWzBdKSAmJiBiLnB1dEl0ZW0oaXRlbXNbMF0sIFN0YXJ0UG9zaXRpb24pO1xuXG4gICAgaWYgKCFmaXQpIHtcbiAgICAgIGxldCBiMiA9IHRoaXMuZ2V0QmlnZ2VyQmluVGhhbihiKTtcbiAgICAgIGlmIChiMikge1xuICAgICAgICByZXR1cm4gdGhpcy5wYWNrVG9CaW4oYjIsIGl0ZW1zKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLml0ZW1zO1xuICAgIH1cblxuICAgIC8vIFBhY2sgdW5wYWNrZWQgaXRlbXMuXG4gICAgZm9yIChsZXQgX2k9MTsgX2kgPCB0aGlzLml0ZW1zLmxlbmd0aDsgX2krKykge1xuICAgICAgbGV0IGZpdHRlZCA9IGZhbHNlO1xuICAgICAgbGV0IGl0ZW0gPSB0aGlzLml0ZW1zW19pXTtcblxuICAgICAgaWYgKGIud2VpZ2hJdGVtKGl0ZW0pKSB7XG4gICAgICAgIC8vIFRyeSBhdmFpbGFibGUgcGl2b3RzIGluIGN1cnJlbnQgYmluIHRoYXQgYXJlIG5vdCBpbnRlcnNlY3Qgd2l0aFxuICAgICAgICAvLyBleGlzdGluZyBpdGVtcyBpbiBjdXJyZW50IGJpbi5cbiAgICAgICAgbG9va3VwOlxuICAgICAgICBmb3IgKGxldCBfcHQ9MDsgX3B0IDwgMzsgX3B0KyspIHtcbiAgICAgICAgICBmb3IgKGxldCBfaj0wOyBfaiA8IGIuaXRlbXMubGVuZ3RoOyBfaisrKSB7XG4gICAgICAgICAgICBsZXQgcHY7XG4gICAgICAgICAgICBsZXQgaWIgPSBiLml0ZW1zW19qXTtcbiAgICAgICAgICAgIGxldCBkID0gaWIuZ2V0RGltZW5zaW9uKCk7XG4gICAgICAgICAgICBzd2l0Y2ggKF9wdCkge1xuICAgICAgICAgICAgICBjYXNlIFdpZHRoQXhpczpcbiAgICAgICAgICAgICAgICBwdiA9IFtpYi5wb3NpdGlvblswXSArIGRbMF0sIGliLnBvc2l0aW9uWzFdLCBpYi5wb3NpdGlvblsyXV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgSGVpZ2h0QXhpczpcbiAgICAgICAgICAgICAgICBwdiA9IFtpYi5wb3NpdGlvblswXSwgaWIucG9zaXRpb25bMV0gKyBkWzFdLCBpYi5wb3NpdGlvblsyXV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgRGVwdGhBeGlzOlxuICAgICAgICAgICAgICAgIHB2ID0gW2liLnBvc2l0aW9uWzBdLCBpYi5wb3NpdGlvblsxXSwgaWIucG9zaXRpb25bMl0gKyBkWzJdXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGIucHV0SXRlbShpdGVtLCBwdikpIHtcbiAgICAgICAgICAgICAgZml0dGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWsgbG9va3VwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWZpdHRlZCkge1xuICAgICAgICB3aGlsZSAoYjIgIT09IG51bGwpIHtcbiAgICAgICAgICBiMiA9IHRoaXMuZ2V0QmlnZ2VyQmluVGhhbihiKTtcbiAgICAgICAgICBpZiAoYjIpIHtcbiAgICAgICAgICAgIGIyLml0ZW1zLnB1c2goaXRlbSk7XG4gICAgICAgICAgICBsZXQgbGVmdCA9IHRoaXMucGFja1RvQmluKGIyLCBiMi5pdGVtcyk7XG4gICAgICAgICAgICBpZiAobGVmdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgYiA9IGIyO1xuICAgICAgICAgICAgICBmaXR0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWZpdHRlZCkge1xuICAgICAgICAgIHVucGFja2VkLnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdW5wYWNrZWQ7XG4gIH1cblxuICBwYWNrKCkge1xuICAgIC8vIFNvcnQgYmlucyBzbWFsbGVzdCB0byBsYXJnZXN0LlxuICAgIHRoaXMuYmlucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYS5nZXRWb2x1bWUoKSAtIGIuZ2V0Vm9sdW1lKCk7XG4gICAgfSk7XG5cbiAgICAvLyBTb3J0IGl0ZW1zIGxhcmdlc3QgdG8gc21hbGxlc3QuXG4gICAgdGhpcy5pdGVtcy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gYi5nZXRWb2x1bWUoKSAtIGEuZ2V0Vm9sdW1lKCk7XG4gICAgfSk7XG5cbiAgICB3aGlsZSAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgYmluID0gdGhpcy5maW5kRml0dGVkQmluKHRoaXMuaXRlbXNbMF0pO1xuXG4gICAgICBpZiAoYmluID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMudW5maXRJdGVtKCk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLml0ZW1zID0gdGhpcy5wYWNrVG9CaW4oYmluLCB0aGlzLml0ZW1zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IEJpbiBmcm9tICcuL0Jpbic7XG5pbXBvcnQgSXRlbSBmcm9tICcuL0l0ZW0nO1xuaW1wb3J0IFBhY2tlciBmcm9tICcuL1BhY2tlcic7XG5cbmV4cG9ydCB7IEJpbiwgSXRlbSwgUGFja2VyIH07IiwiLyoqXG4gKiBQcmVjaXNpb24gdG8gcmV0YWluIGluIGZhY3RvcmVkSW50ZWdlcigpXG4gKi9cbmNvbnN0IEZBQ1RPUiA9IDU7XG5cbi8qKlxuICogRmFjdG9yIGEgbnVtYmVyIGJ5IEZBQ1RPUiBhbmQgcm91bmQgdG8gdGhlIG5lYXJlc3Qgd2hvbGUgbnVtYmVyXG4gKi9cbmV4cG9ydCBjb25zdCBmYWN0b3JlZEludGVnZXIgPSAoIHZhbHVlICkgPT4gKFxuICAgIE1hdGgucm91bmQoIHZhbHVlICogKCAxMCAqKiBGQUNUT1IgKSApXG4pO1xuIiwibGV0IGlzTG9nRW5hYmxlZCA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUxvZyhlbmFibGUgPSB0cnVlKSB7XG4gICAgaXNMb2dFbmFibGVkID0gZW5hYmxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9nZ2VyKG5hbWVzcGFjZSA9ICdiaW5wYWNraW5nanMnKSB7XG4gICAgcmV0dXJuIGxvZy5iaW5kKHVuZGVmaW5lZCwgbmFtZXNwYWNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZyhuYW1lc3BhY2UsIC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gaXNMb2dFbmFibGVkID8gY29uc29sZS5kZWJ1Zy5hcHBseShjb25zb2xlLCBbbmFtZXNwYWNlXS5jb25jYXQoYXJncykpIDogdW5kZWZpbmVkO1xufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgKiBhcyBCUDJEIGZyb20gJy4vMkQnO1xuaW1wb3J0ICogYXMgQlAzRCBmcm9tICcuLzNEJztcbmltcG9ydCAqIGFzIFR5cGVzIGZyb20gJy4vMkQvVHlwZXMnO1xuXG5leHBvcnQgeyBCUDJELCBCUDNELCBUeXBlcyB9OyJdLCJzb3VyY2VSb290IjoiIn0=