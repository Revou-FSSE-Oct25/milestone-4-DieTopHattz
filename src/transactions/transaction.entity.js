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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../user/user.entity");
var account_entity_1 = require("../account/account.entity");
var Transaction = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('transactions')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _fromAccountId_decorators;
    var _fromAccountId_initializers = [];
    var _fromAccountId_extraInitializers = [];
    var _toAccountId_decorators;
    var _toAccountId_initializers = [];
    var _toAccountId_extraInitializers = [];
    var _accountId_decorators;
    var _accountId_initializers = [];
    var _accountId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _account_decorators;
    var _account_initializers = [];
    var _account_extraInitializers = [];
    var _fromAccount_decorators;
    var _fromAccount_initializers = [];
    var _fromAccount_extraInitializers = [];
    var _toAccount_decorators;
    var _toAccount_initializers = [];
    var _toAccount_extraInitializers = [];
    var Transaction = _classThis = /** @class */ (function () {
        function Transaction_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.amount = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
            this.fromAccountId = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _fromAccountId_initializers, void 0));
            this.toAccountId = (__runInitializers(this, _fromAccountId_extraInitializers), __runInitializers(this, _toAccountId_initializers, void 0));
            this.accountId = (__runInitializers(this, _toAccountId_extraInitializers), __runInitializers(this, _accountId_initializers, void 0));
            this.userId = (__runInitializers(this, _accountId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.description = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.user = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.account = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _account_initializers, void 0));
            this.fromAccount = (__runInitializers(this, _account_extraInitializers), __runInitializers(this, _fromAccount_initializers, void 0));
            this.toAccount = (__runInitializers(this, _fromAccount_extraInitializers), __runInitializers(this, _toAccount_initializers, void 0));
            __runInitializers(this, _toAccount_extraInitializers);
        }
        return Transaction_1;
    }());
    __setFunctionName(_classThis, "Transaction");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _type_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: ['deposit', 'withdrawal', 'transfer'] })];
        _amount_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 })];
        _fromAccountId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _toAccountId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _accountId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _userId_decorators = [(0, typeorm_1.Column)()];
        _description_decorators = [(0, typeorm_1.Column)()];
        _status_decorators = [(0, typeorm_1.Column)({ type: 'enum', enum: ['pending', 'completed', 'failed'], default: 'completed' })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.transactions; }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _account_decorators = [(0, typeorm_1.ManyToOne)(function () { return account_entity_1.Account; }, function (account) { return account.transactions; }), (0, typeorm_1.JoinColumn)({ name: 'accountId' })];
        _fromAccount_decorators = [(0, typeorm_1.ManyToOne)(function () { return account_entity_1.Account; }), (0, typeorm_1.JoinColumn)({ name: 'fromAccountId' })];
        _toAccount_decorators = [(0, typeorm_1.ManyToOne)(function () { return account_entity_1.Account; }), (0, typeorm_1.JoinColumn)({ name: 'toAccountId' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
        __esDecorate(null, null, _fromAccountId_decorators, { kind: "field", name: "fromAccountId", static: false, private: false, access: { has: function (obj) { return "fromAccountId" in obj; }, get: function (obj) { return obj.fromAccountId; }, set: function (obj, value) { obj.fromAccountId = value; } }, metadata: _metadata }, _fromAccountId_initializers, _fromAccountId_extraInitializers);
        __esDecorate(null, null, _toAccountId_decorators, { kind: "field", name: "toAccountId", static: false, private: false, access: { has: function (obj) { return "toAccountId" in obj; }, get: function (obj) { return obj.toAccountId; }, set: function (obj, value) { obj.toAccountId = value; } }, metadata: _metadata }, _toAccountId_initializers, _toAccountId_extraInitializers);
        __esDecorate(null, null, _accountId_decorators, { kind: "field", name: "accountId", static: false, private: false, access: { has: function (obj) { return "accountId" in obj; }, get: function (obj) { return obj.accountId; }, set: function (obj, value) { obj.accountId = value; } }, metadata: _metadata }, _accountId_initializers, _accountId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _account_decorators, { kind: "field", name: "account", static: false, private: false, access: { has: function (obj) { return "account" in obj; }, get: function (obj) { return obj.account; }, set: function (obj, value) { obj.account = value; } }, metadata: _metadata }, _account_initializers, _account_extraInitializers);
        __esDecorate(null, null, _fromAccount_decorators, { kind: "field", name: "fromAccount", static: false, private: false, access: { has: function (obj) { return "fromAccount" in obj; }, get: function (obj) { return obj.fromAccount; }, set: function (obj, value) { obj.fromAccount = value; } }, metadata: _metadata }, _fromAccount_initializers, _fromAccount_extraInitializers);
        __esDecorate(null, null, _toAccount_decorators, { kind: "field", name: "toAccount", static: false, private: false, access: { has: function (obj) { return "toAccount" in obj; }, get: function (obj) { return obj.toAccount; }, set: function (obj, value) { obj.toAccount = value; } }, metadata: _metadata }, _toAccount_initializers, _toAccount_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Transaction = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Transaction = _classThis;
}();
exports.Transaction = Transaction;
// export class Transaction {
//   id: string;
//   type: 'deposit' | 'withdrawal' | 'transfer';
//   amount: number;
//   fromAccountId?: string;
//   toAccountId?: string;
//   accountId?: string;
//   userId: string;
//   description: string;
//   status: 'pending' | 'completed' | 'failed';
//   createdAt: Date;
// }
