"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var axios_1 = __importDefault(require("axios"));
var cors = require('cors');
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(cors());
app.get('/', function (req, res) {
    res.send('Hello world');
});
app.get('/place', function (req, res) {
    var _a = req.query, query = _a.query, type = _a.type;
    axios_1.default
        .get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=".concat(query, "&key=").concat(process.env.GOOGLE_MAPS_API_KEY, "&type=").concat(type, "&radius=50000"))
        .then(function (apiRes) {
        res.json(apiRes.data);
    });
});
app.listen(process.env.PORT, function () { return console.log('Running server'); });
