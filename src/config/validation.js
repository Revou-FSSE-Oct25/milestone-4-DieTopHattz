"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentVariables = void 0;
exports.validate = validate;
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var EnvironmentVariables = function () {
    var _a;
    var _JWT_SECRET_decorators;
    var _JWT_SECRET_initializers = [];
    var _JWT_SECRET_extraInitializers = [];
    var _JWT_EXPIRATION_decorators;
    var _JWT_EXPIRATION_initializers = [];
    var _JWT_EXPIRATION_extraInitializers = [];
    var _PORT_decorators;
    var _PORT_initializers = [];
    var _PORT_extraInitializers = [];
    var _DB_HOST_decorators;
    var _DB_HOST_initializers = [];
    var _DB_HOST_extraInitializers = [];
    var _DB_PORT_decorators;
    var _DB_PORT_initializers = [];
    var _DB_PORT_extraInitializers = [];
    var _DB_USERNAME_decorators;
    var _DB_USERNAME_initializers = [];
    var _DB_USERNAME_extraInitializers = [];
    var _DB_PASSWORD_decorators;
    var _DB_PASSWORD_initializers = [];
    var _DB_PASSWORD_extraInitializers = [];
    var _DB_DATABASE_decorators;
    var _DB_DATABASE_initializers = [];
    var _DB_DATABASE_extraInitializers = [];
    var _DB_SYNCHRONIZE_decorators;
    var _DB_SYNCHRONIZE_initializers = [];
    var _DB_SYNCHRONIZE_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EnvironmentVariables() {
                this.JWT_SECRET = __runInitializers(this, _JWT_SECRET_initializers, void 0);
                this.JWT_EXPIRATION = (__runInitializers(this, _JWT_SECRET_extraInitializers), __runInitializers(this, _JWT_EXPIRATION_initializers, void 0));
                this.PORT = (__runInitializers(this, _JWT_EXPIRATION_extraInitializers), __runInitializers(this, _PORT_initializers, void 0));
                this.DB_HOST = (__runInitializers(this, _PORT_extraInitializers), __runInitializers(this, _DB_HOST_initializers, void 0));
                this.DB_PORT = (__runInitializers(this, _DB_HOST_extraInitializers), __runInitializers(this, _DB_PORT_initializers, void 0));
                this.DB_USERNAME = (__runInitializers(this, _DB_PORT_extraInitializers), __runInitializers(this, _DB_USERNAME_initializers, void 0));
                this.DB_PASSWORD = (__runInitializers(this, _DB_USERNAME_extraInitializers), __runInitializers(this, _DB_PASSWORD_initializers, void 0));
                this.DB_DATABASE = (__runInitializers(this, _DB_PASSWORD_extraInitializers), __runInitializers(this, _DB_DATABASE_initializers, void 0));
                this.DB_SYNCHRONIZE = (__runInitializers(this, _DB_DATABASE_extraInitializers), __runInitializers(this, _DB_SYNCHRONIZE_initializers, void 0));
                __runInitializers(this, _DB_SYNCHRONIZE_extraInitializers);
            }
            return EnvironmentVariables;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _JWT_SECRET_decorators = [(0, class_validator_1.IsString)()];
            _JWT_EXPIRATION_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _PORT_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _DB_HOST_decorators = [(0, class_validator_1.IsString)()];
            _DB_PORT_decorators = [(0, class_validator_1.IsNumber)()];
            _DB_USERNAME_decorators = [(0, class_validator_1.IsString)()];
            _DB_PASSWORD_decorators = [(0, class_validator_1.IsString)()];
            _DB_DATABASE_decorators = [(0, class_validator_1.IsString)()];
            _DB_SYNCHRONIZE_decorators = [(0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _JWT_SECRET_decorators, { kind: "field", name: "JWT_SECRET", static: false, private: false, access: { has: function (obj) { return "JWT_SECRET" in obj; }, get: function (obj) { return obj.JWT_SECRET; }, set: function (obj, value) { obj.JWT_SECRET = value; } }, metadata: _metadata }, _JWT_SECRET_initializers, _JWT_SECRET_extraInitializers);
            __esDecorate(null, null, _JWT_EXPIRATION_decorators, { kind: "field", name: "JWT_EXPIRATION", static: false, private: false, access: { has: function (obj) { return "JWT_EXPIRATION" in obj; }, get: function (obj) { return obj.JWT_EXPIRATION; }, set: function (obj, value) { obj.JWT_EXPIRATION = value; } }, metadata: _metadata }, _JWT_EXPIRATION_initializers, _JWT_EXPIRATION_extraInitializers);
            __esDecorate(null, null, _PORT_decorators, { kind: "field", name: "PORT", static: false, private: false, access: { has: function (obj) { return "PORT" in obj; }, get: function (obj) { return obj.PORT; }, set: function (obj, value) { obj.PORT = value; } }, metadata: _metadata }, _PORT_initializers, _PORT_extraInitializers);
            __esDecorate(null, null, _DB_HOST_decorators, { kind: "field", name: "DB_HOST", static: false, private: false, access: { has: function (obj) { return "DB_HOST" in obj; }, get: function (obj) { return obj.DB_HOST; }, set: function (obj, value) { obj.DB_HOST = value; } }, metadata: _metadata }, _DB_HOST_initializers, _DB_HOST_extraInitializers);
            __esDecorate(null, null, _DB_PORT_decorators, { kind: "field", name: "DB_PORT", static: false, private: false, access: { has: function (obj) { return "DB_PORT" in obj; }, get: function (obj) { return obj.DB_PORT; }, set: function (obj, value) { obj.DB_PORT = value; } }, metadata: _metadata }, _DB_PORT_initializers, _DB_PORT_extraInitializers);
            __esDecorate(null, null, _DB_USERNAME_decorators, { kind: "field", name: "DB_USERNAME", static: false, private: false, access: { has: function (obj) { return "DB_USERNAME" in obj; }, get: function (obj) { return obj.DB_USERNAME; }, set: function (obj, value) { obj.DB_USERNAME = value; } }, metadata: _metadata }, _DB_USERNAME_initializers, _DB_USERNAME_extraInitializers);
            __esDecorate(null, null, _DB_PASSWORD_decorators, { kind: "field", name: "DB_PASSWORD", static: false, private: false, access: { has: function (obj) { return "DB_PASSWORD" in obj; }, get: function (obj) { return obj.DB_PASSWORD; }, set: function (obj, value) { obj.DB_PASSWORD = value; } }, metadata: _metadata }, _DB_PASSWORD_initializers, _DB_PASSWORD_extraInitializers);
            __esDecorate(null, null, _DB_DATABASE_decorators, { kind: "field", name: "DB_DATABASE", static: false, private: false, access: { has: function (obj) { return "DB_DATABASE" in obj; }, get: function (obj) { return obj.DB_DATABASE; }, set: function (obj, value) { obj.DB_DATABASE = value; } }, metadata: _metadata }, _DB_DATABASE_initializers, _DB_DATABASE_extraInitializers);
            __esDecorate(null, null, _DB_SYNCHRONIZE_decorators, { kind: "field", name: "DB_SYNCHRONIZE", static: false, private: false, access: { has: function (obj) { return "DB_SYNCHRONIZE" in obj; }, get: function (obj) { return obj.DB_SYNCHRONIZE; }, set: function (obj, value) { obj.DB_SYNCHRONIZE = value; } }, metadata: _metadata }, _DB_SYNCHRONIZE_initializers, _DB_SYNCHRONIZE_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EnvironmentVariables = EnvironmentVariables;
function validate(config) {
    var validatedConfig = (0, class_transformer_1.plainToClass)(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });
    var errors = (0, class_validator_1.validateSync)(validatedConfig, {
        skipMissingProperties: false,
    });
    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
