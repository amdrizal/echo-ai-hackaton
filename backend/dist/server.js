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
// Middleware - CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : [
        'http://localhost:8081',
        'http://localhost:19006',
        'https://echo-ai-ez47.onrender.com',
    ];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin)
            return callback(null, true);
        // Check if origin is in allowed list or use wildcard for development
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            // Block CORS but don't throw error (just return false)
            callback(null, false);
        }
    },
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
// Start server - Listen on 0.0.0.0 to allow connections from devices on local network
const HOST = process.env.HOST || '0.0.0.0';
app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Server running on ${HOST}:${PORT}`);
    console.log(`📡 Local API: http://localhost:${PORT}/api/${API_VERSION}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`\n📱 For mobile devices on local network:`);
    console.log(`   Run: npm run network-ip`);
    console.log(`   Then update mobile/.env with: EXPO_PUBLIC_API_URL=http://<YOUR_IP>:${PORT}/api/${API_VERSION}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map