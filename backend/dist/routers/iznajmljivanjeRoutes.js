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
const iznajmljivanjeController = __importStar(require("../controllers/iznajmljivanjeController"));
const router = express_1.default.Router();
// GET /api/iznajmljivanja - Get all rentals (admin)
router.get('/', iznajmljivanjeController.getAllIznajmljivanja);
// GET /api/iznajmljivanja/korisnik/:kor_ime - Get all rentals for specific user
router.get('/korisnik/:kor_ime', iznajmljivanjeController.getIznajmljivanjaByKorisnik);
// GET /api/iznajmljivanja/aktivna/:kor_ime - Get only active rentals for user
router.get('/aktivna/:kor_ime', iznajmljivanjeController.getAktivnaIznajmljivanja);
// GET /api/iznajmljivanja/statistika/:kor_ime - Get rental statistics for user
router.get('/statistika/:kor_ime', iznajmljivanjeController.getStatistikaIznajmljivanja);
// GET /api/iznajmljivanja/admin/statistics - Get rental statistics for admin
router.get('/admin/statistics', iznajmljivanjeController.getRentalStatisticsAdmin);
// GET /api/iznajmljivanja/admin/monthly-trends - Get monthly rental trends
router.get('/admin/monthly-trends', iznajmljivanjeController.getMonthlyRentalTrends);
// POST /api/iznajmljivanja - Create new rental
router.post('/', iznajmljivanjeController.createIznajmljivanje);
// POST /api/iznajmljivanja/check-conflict - Check for rental conflicts
router.post('/check-conflict', iznajmljivanjeController.checkRentalConflict);
// PUT /api/iznajmljivanja/:id/vrati - Return rental
router.put('/:id/vrati', iznajmljivanjeController.vratiIznajmljivanje);
// DELETE /api/iznajmljivanja/:id - Delete rental (admin)
router.delete('/:id', iznajmljivanjeController.deleteIznajmljivanje);
exports.default = router;
//# sourceMappingURL=iznajmljivanjeRoutes.js.map