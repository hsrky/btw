var should = require('should'),
    gu = require('geoutils'),
    hireDemands = require('./../utils/HireDemands');
    
// since all the API don't modify the database or data, before and after functions 
// are omitted. (TODO: until utilized sqlite to manipulate test data..)
// Expect to use only test data in taxi_notifier/setup.js

describe('When using HireDemands', function() {
    var isWeekend = true;
    describe('to get taxi demands on all location', function() {
        
        it('should not return records if no matches', function(done){
            hireDemands.getAllLocations(0, '07:30', isWeekend, function(locations) {
                (locations.length).should.be.exactly(0);
                done(); 
            });
        });
        
        it('should return one record if matches (07:30, weekday, and demand level = 10)', function(done){
            hireDemands.getAllLocations(10, '07:30', !isWeekend, function(locations) {
                (locations.length).should.be.exactly(1);
                done(); 
            });
        });

        it('should return one record if matches (11:30, weekend, and demand level = 10)', function(done){
            hireDemands.getAllLocations(10, '11:30', isWeekend, function(locations) {
                (locations.length).should.be.exactly(1);
                done(); 
            });
        });
        
        it('should not return record if no matches (11:30, weekday, and demand level = 10)', function(done){
            hireDemands.getAllLocations(10, '11:30', !isWeekend, function(locations) {
                (locations.length).should.be.exactly(0);
                done(); 
            });
        });
    });
});