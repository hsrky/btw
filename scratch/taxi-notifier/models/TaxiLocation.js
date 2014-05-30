
var persist = require("persist"),
    type = persist.type;
    
module.exports = persist.define("taxilocation", {
    "latitude": type.INTEGER, // double
    "longtitude": type.INTEGER, // double
    "last_update": type.DATETIME
});