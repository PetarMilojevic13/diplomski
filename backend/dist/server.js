"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("./routers/authRoutes"));
const registrationRoutes_1 = __importDefault(require("./routers/registrationRoutes"));
const filmRoutes_1 = __importDefault(require("./routers/filmRoutes"));
const reziser_1 = __importDefault(require("./routes/reziser"));
const glumacRoutes_1 = __importDefault(require("./routers/glumacRoutes"));
const iznajmljivanjeRoutes_1 = __importDefault(require("./routers/iznajmljivanjeRoutes"));
const userRoutes_1 = __importDefault(require("./routers/userRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
mongoose_1.default.connect('mongodb://127.0.0.1:27017/diplomski');
const conn = mongoose_1.default.connection;
conn.once('open', () => {
    console.log("DB ok");
});
const router = express_1.default.Router();
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Auth routes
app.use('/api/auth', authRoutes_1.default);
// Registration routes
app.use('/api/registration', registrationRoutes_1.default);
// Film routes
app.use('/api/films', filmRoutes_1.default);
// Reziser routes
app.use('/api/reziseri', reziser_1.default);
// Glumac routes
app.use('/api/glumci', glumacRoutes_1.default);
// Iznajmljivanje routes
app.use('/api/iznajmljivanja', iznajmljivanjeRoutes_1.default);
// User routes
app.use('/api/users', userRoutes_1.default);
app.use('/', router);
app.listen(8080, () => console.log('Express running on port 8080'));
//# sourceMappingURL=server.js.map