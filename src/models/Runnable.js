"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Timed = void 0;
var Timed = /** @class */ (function () {
    function Timed() {
    }
    Timed.prototype.start = function () {
        // console.log('start')
        this.startDate = new Date().toString();
    };
    Timed.prototype.finish = function () {
        this.endDate = new Date().toString();
        // console.log('finish', run)
    };
    Timed.prototype.get = function () {
        console.log('get');
        // this.startDate = new Date().toString()
    };
    Timed.prototype.save = function () {
        console.log('save');
        // this.endDate = new Date().toString()
    };
    return Timed;
}());
exports.Timed = Timed;
var Run = /** @class */ (function (_super) {
    __extends(Run, _super);
    function Run() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Run;
}(Timed));
var run = new Run();
run.start();
setTimeout(function () {
    run.finish();
    console.log(run);
}, 7250);
