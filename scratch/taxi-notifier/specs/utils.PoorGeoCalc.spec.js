var should = require('should'),
    gu = require('geoutils'),
    geoCalc = require('./../utils/PoorGeoCalc');
    
describe('When using PoorGeoCalc', function() {
    describe('and when getting coordinate 1KM away', function() {
        
        it('should return coordinates that contains this coordinate', function(done){
            var location_lat = 3.000111, location_lon = 101.111000, distance_km = 1;
            var result = geoCalc.calcRadiusRange(new gu.LatLon(location_lat, location_lon), distance_km);
            
            (result.upper_bound._lat).should.be.greaterThan(location_lat).and.be.a.Number;
            (result.upper_bound._lon).should.be.greaterThan(location_lon).and.be.a.Number;
            (result.lower_bound._lat).should.be.lessThan(location_lat).and.be.a.Number;
            (result.lower_bound._lon).should.be.lessThan(location_lon).and.be.a.Number;
            done();
        });
        
    });
});