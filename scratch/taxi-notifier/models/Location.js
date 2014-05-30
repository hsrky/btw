
var persist = require("persist"),
    type = persist.type,
    Demand = require("./Demand");
    
module.exports = persist.define("location", {
    "location_name": type.STRING,
    "latitude": type.INTEGER,
    "longtitude": type.INTEGER
}).hasMany(Demand, {through: 'locationdemands'});