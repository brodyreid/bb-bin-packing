var isLogEnabled = false;
export function enableLog(enable) {
    if (enable === void 0) { enable = true; }
    isLogEnabled = enable;
}
export function createLogger(namespace) {
    if (namespace === void 0) { namespace = 'binpackingjs'; }
    return log.bind(undefined, namespace);
}
export function log(namespace) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return isLogEnabled ? console.debug.apply(console, [namespace].concat(args)) : undefined;
}
//# sourceMappingURL=log.js.map