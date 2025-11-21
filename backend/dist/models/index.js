"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reziser = exports.Glumac = exports.RegistrationRequest = exports.Iznajmljivanje = exports.Film = exports.User = void 0;
// Export all models from one place
var user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_1).default; } });
var film_1 = require("./film");
Object.defineProperty(exports, "Film", { enumerable: true, get: function () { return __importDefault(film_1).default; } });
var iznajmljivanje_1 = require("./iznajmljivanje");
Object.defineProperty(exports, "Iznajmljivanje", { enumerable: true, get: function () { return __importDefault(iznajmljivanje_1).default; } });
var registrationRequest_1 = require("./registrationRequest");
Object.defineProperty(exports, "RegistrationRequest", { enumerable: true, get: function () { return __importDefault(registrationRequest_1).default; } });
var glumac_1 = require("./glumac");
Object.defineProperty(exports, "Glumac", { enumerable: true, get: function () { return __importDefault(glumac_1).default; } });
var reziser_1 = require("./reziser");
Object.defineProperty(exports, "Reziser", { enumerable: true, get: function () { return __importDefault(reziser_1).default; } });
//# sourceMappingURL=index.js.map