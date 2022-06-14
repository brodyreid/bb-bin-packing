/**
 * Precision to retain in factoredInteger()
 */
var FACTOR = 5;
/**
 * Factor a number by FACTOR and round to the nearest whole number
 */
export var factoredInteger = function (value) { return (Math.round(value * (Math.pow(10, FACTOR)))); };
//# sourceMappingURL=util.js.map