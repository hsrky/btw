
var gu = require('geoutils');

/**
 * Calculate rectangular upperbound and lowerbound of an area within `radius_distance' from `latlon'.
 * 
 * @param {geoutils.LatLon} latlon Latitude and Longtitude object
 * @param {integer} radius_distance distance in KM from `latlon'
 * @returns {object} {lower_bound: `geoUtils.LatLon` object, upper_bound: `geoUtils.LatLon` object}
 */
function calcRadiusRange(latlon, radius_distance) {
    // use simple rectangle as within range calculation..
    var lat_l = latlon.destinationPoint(180, radius_distance),
        lat_h = latlon.destinationPoint(0, radius_distance),
        lon_l = latlon.destinationPoint(270, radius_distance),
        lon_h = latlon.destinationPoint(90, radius_distance);

    return {
        lower_bound: new gu.LatLon(lat_l._lat, lon_l._lon), 
        upper_bound: new gu.LatLon(lat_h._lat, lon_h._lon)
    };
}

// Functions which will be available to external callers
exports.calcRadiusRange = calcRadiusRange;
