
var persist = require("persist"),
    type = persist.type,
    TaxiLocation = require("./TaxiLocation");
    
module.exports = persist.define("taxi", {
    "plate_number": type.STRING,
    "active": type.BOOLEAN      // 0 - inactive, 1 - active
}).hasOne(TaxiLocation);