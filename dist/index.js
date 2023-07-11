"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
app.get('/place', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, type, apiRes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, query = _a.query, type = _a.type;
                return [4 /*yield*/, axios_1.default.get("https://maps.googleapis.com/maps/api/place/textsearch/json?query=".concat(query, "&key=").concat(process.env.GOOGLE_MAPS_API_KEY, "&type=").concat(type, "&radius=50000"))];
            case 1:
                apiRes = _b.sent();
                res.json(apiRes.data.results.map(function (item) {
                    return {
                        name: item.name,
                        photoUrl: "https://maps.googleapis.com/maps/api/place/photo?photo_reference=".concat(item.photos[0].photo_reference, "&maxwidth=400&key=").concat(process.env.GOOGLE_MAPS_API_KEY),
                        priceLevel: item.price_level,
                        rating: item.rating,
                        numRatings: item.user_ratings_total,
                    };
                }));
                return [2 /*return*/];
        }
    });
}); });
app.get('/forecast', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, lat, lon, apiRes, weatherForcast, idxIncrement, numWeatherPoints, i, curWeatherData, dateStrSplit, monthStr, dateStr;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, lat = _a.lat, lon = _a.lon;
                return [4 /*yield*/, axios_1.default.get("https://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=".concat(lat, "&lon=").concat(lon, "&appid=").concat(process.env.OPEN_WEATHER_API_KEY))
                    // returns 5 day forcast in 3 hour increments
                    // only collect data at 12pm
                ];
            case 1:
                apiRes = _b.sent();
                weatherForcast = [];
                idxIncrement = 8;
                numWeatherPoints = apiRes.data.list.length;
                for (i = idxIncrement / 2; i < numWeatherPoints; i += idxIncrement) {
                    curWeatherData = apiRes.data.list[i];
                    dateStrSplit = curWeatherData.dt_txt.split(' ')[0].split('-');
                    monthStr = dateStrSplit[1];
                    dateStr = dateStrSplit[2];
                    weatherForcast.push({
                        temp: curWeatherData.main.temp,
                        weatherIcon: "https://openweathermap.org/img/wn/".concat(curWeatherData.weather[0].icon, "@2x.png"),
                        displayDate: "".concat(monthStr, "/").concat(dateStr),
                    });
                }
                res.json(weatherForcast);
                return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT, function () {
    return console.log("Running server on http://localhost".concat(process.env.PORT));
});
