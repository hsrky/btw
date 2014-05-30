/*
 * Get taxi demands for all locations
 */

var persist = require('persist'),
    models = require('./../models'),
    gu = require('geoutils');

function HireDemands() {

}

/**
 * Get all locations which met certain demand level on particular time
 * 
 * @param {integer} demandLevel minimum taxi demand level for a particular place, 0 - 10
 * @param {string} hour string of hour, e.g: '07:00', '18:00', ...
 * @param {boolean} isWeekend true to get weekend data only
 * @param {function} callback when data retrieved.
 */
HireDemands.prototype.getAllLocations = function(demandLevel, hour, isWeekend, callback) {
    var results = []; // [{coord: geoutils.LatLon, name: 'location name'}, ...]
    persist.connect(function(err, conn) {
        if(err) {throw err;}
        
        models.Location.include('demands').
               where('demands.demand_level >= ? and demands.weekend = ? and demands.timerange_l <= ? and demands.timerange_h >= ?', 
                    demandLevel, isWeekend, hour, hour)
               .all(conn, function(err, locations) {
                   
            if(err) {throw err;}
            for(var i = 0, length = locations.length; i < length; ++i) {
                var location = locations[i];
                results.push({
                    coord: new gu.LatLon(location.latitude, location.longtitude),
                    name: location.location_name
                });
            }
            
            callback(results);
        });
    });
};

module.exports = new HireDemands();
