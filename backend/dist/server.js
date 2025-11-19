"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const goal_routes_1 = __importDefault(require("./routes/goal.routes"));
const webhook_routes_1 = __importDefault(require("./routes/webhook.routes"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use(`/api/${API_VERSION}/auth`, auth_routes_1.default);
app.use(`/api/${API_VERSION}/goals`, goal_routes_1.default);
app.use(`/api/${API_VERSION}/webhooks`, webhook_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API endpoint: http://localhost:${PORT}/api/${API_VERSION}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
exports.default = app;
//# sourceMappingURL=server.js.map