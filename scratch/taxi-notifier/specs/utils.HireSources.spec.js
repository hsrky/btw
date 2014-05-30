var should = require('should'),
    gu = require('geoutils'),
    hireSources = require('./../utils/HireSources');
    
// since all the API don't modify the database or data, before and after functions 
// are omitted. (TODO: until utilized sqlite to manipulate test data..)
// Expect to use only test data in taxi_notifier/setup.js

describe('When using HireSources', function() {
    
    describe('to get taxi availability on particular location', function() {
        
        it('should not return taxis if no taxi within range', function(done){
            hireSources.getAvailable(new gu.LatLon(30.000111, 40.00023), 100, function(taxis) {
                (taxis.length).should.be.exactly(0);
                done();
            });
        });

        it('should return 1 taxi within 1KM range', function(done){
            hireSources.getAvailable(new gu.LatLon(3.239333, 101.686855), 1, function(taxis) {
                (taxis.length).should.be.exactly(1);
                done();
            });
        });
        
        it('should return 4 taxis within 100KM range', function(done){
            hireSources.getAvailable(new gu.LatLon(3.239333, 101.686855), 100, function(taxis) {
                (taxis.length).should.be.exactly(4);
                done();
            });
        });
    });
});