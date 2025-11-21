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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationController = __importStar(require("../controllers/registrationController"));
const router = (0, express_1.Router)();
/**
 * Registration Routes
 * Base path: /api/registration
 */
// POST /api/registration/register - Registracija novog korisnika
router.post('/register', registrationController.registerKorisnik);
// GET /api/registration/check-username/:username - Provera dostupnosti korisničkog imena
router.get('/check-username/:username', registrationController.checkUsernameAvailability);
// GET /api/registration/check-email/:email - Provera dostupnosti email-a
router.get('/check-email/:email', registrationController.checkEmailAvailability);
// ADMIN ROUTES
// GET /api/registration/admin/requests - Get all registration requests
router.get('/admin/requests', registrationController.getAllRegistrationRequests);
// GET /api/registration/admin/pending - Get pending registration requests
router.get('/admin/pending', registrationController.getPendingRegistrationRequests);
// POST /api/registration/admin/approve/:requestId - Approve registration request
router.post('/admin/approve/:requestId', registrationController.approveRegistrationRequest);
// POST /api/registration/admin/reject/:requestId - Reject registration request
router.post('/admin/reject/:requestId', registrationController.rejectRegistrationRequest);
exports.default = router;
//# sourceMappingURL=registrationRoutes.js.map