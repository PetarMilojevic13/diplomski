"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const glumacController = __importStar(require("../controllers/glumacController"));
const router = express_1.default.Router();
// GET /api/glumci - Preuzmi sve glumce
router.get('/', glumacController.getAllGlumci);
// GET /api/glumci/search?q=query - Pretraži glumce
router.get('/search', glumacController.searchGlumci);
// GET /api/glumci/ime/:ime - Preuzmi glumca po imenu (mora biti PRE /:id da ne bi bio prepoznat kao ID)
router.get('/ime/:ime', glumacController.getGlumacByIme);
// GET /api/glumci/:ime/filmovi - Preuzmi filmove glumca
router.get('/:ime/filmovi', glumacController.getFilmoviZaGlumca);
// GET /api/glumci/:ime/statistike - Preuzmi statistike glumca
router.get('/:ime/statistike', glumacController.getStatistikeGlumca);
// GET /api/glumci/:id - Preuzmi glumca po ID-u
router.get('/:id', glumacController.getGlumacById);
// POST /api/glumci - Kreiraj novog glumca
router.post('/', glumacController.createGlumac);
// PUT /api/glumci/:id - Ažuriraj glumca
router.put('/:id', glumacController.updateGlumac);
// DELETE /api/glumci/:id - Obriši glumca
router.delete('/:id', glumacController.deleteGlumac);
exports.default = router;
//# sourceMappingURL=glumacRoutes.js.map