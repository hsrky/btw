
var persist = require("persist"),
    type = persist.type;
    
module.exports = persist.define("demand", {
    "demand_level": type.INTEGER, // 0 (no demand) - 10 (very high demand)
    "timerange_l": type.STRING,   // lower bound of timerange, e.g 14:00
    "timerange_h": type.STRING,   // higher bound of timerange, e.g. 16:00
    "weekend" : type.BOOLEAN,     // true to indicate this demand is valid only on weekend
    //"holiday" : type.BOOLEAN    // not implement
});