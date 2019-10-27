"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var Injectable = function () { return function (target) { }; };
var InjectService = /** @class */ (function () {
    function InjectService() {
        this.a = 'inject';
    }
    return InjectService;
}());
var DemoService = /** @class */ (function () {
    function DemoService(service) {
        this.service = service;
    }
    DemoService.prototype.test = function () {
        console.log(this.service.a);
    };
    DemoService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [InjectService])
    ], DemoService);
    return DemoService;
}());
var Factory = function (target) {
    var providers = Reflect.getMetadata('design:paramtypes', target);
    var args = providers.map(function (provider) { return new provider(); });
    return new (target.bind.apply(target, __spreadArrays([void 0], args)))();
};
Factory(DemoService).test();
//# sourceMappingURL=main.js.map