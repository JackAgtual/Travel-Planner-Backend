"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors = require('cors');
dotenv_1.default.config();
var app = (0, express_1.default)();
app.use(cors());
var placeRouter = require('./routes/place');
var weatherRouter = require('./routes/weather');
app.use('/place', placeRouter);
app.use('/weather', weatherRouter);
app.get('/', function (req, res) {
    res.send('Hello world');
});
app.listen(process.env.PORT, function () {
    return console.log("Running server on http://localhost".concat(process.env.PORT));
});
