/*
 * Get available taxi nearby a certain location
 */
var persist = require('persist'),
    models = require('./../models'),
    gu = require('geoutils'),
    geoCalc = require('./PoorGeoCalc'),
    util = require('util');
    
function HireSources() {
    
}

/*
 * Get all available taxis which within `distance' from `coord'
 * 
 * @param {geoutils.LatLon} coord LatLon object of `geoutils`; latitude and longtitude of a popular place
 * @param {integer} distance delta from `coord' in KM
 * @param {func} callback when result is ready
 */
HireSources.prototype.getAvailable = function(coord, distance, callback) {
    persist.connect(function(err, conn) {
        if(err) {throw err;}
        
        // get far-most point from current location center        
        var bound = geoCalc.calcRadiusRange(coord, distance);
        console.log(util.format(
                        ' -> Valid position for this taxi should be within: min(%s, %s), max(%s, %s)', 
                        bound.lower_bound._lat, bound.lower_bound._lon, bound.upper_bound._lat, bound.upper_bound._lon)
                   );
        models.Taxi.include('taxilocation')
              .where({active: true})
              .where('taxilocation.latitude >= ? and taxilocation.latitude <= ? and taxilocation.longtitude >=? and taxilocation.longtitude <=?',
                    bound.lower_bound._lat, bound.upper_bound._lat, bound.lower_bound._lon, bound.upper_bound._lon)
              .all(conn, function(err, taxis) {
              
              if(err) {throw err;}
              var results = [];
              for(var i = 0, length = taxis.length; i < length; ++i) {
                  var taxi = taxis[i];
                  //console.log(taxi.id, taxi.plate_number);
                  results.push({id: taxi.id, number: taxi.plate_number});
              }
              callback(results);
        });
        
    });
};


module.exports = new HireSources();