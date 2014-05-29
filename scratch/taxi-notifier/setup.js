/**
 * Setting up required database and dummy initial data for running this app
 */

var persist = require('persist'),
    models = require('./models');
    
persist.connect(function(err, connection) {
    if(err) {
        throw err;
    } 

    var data = [],
        current_time = new Date();
        
    data.push(taxi1 = new models.TaxiLocation({
        latitude: 3.137111,
        longtitude: 101.686855,
        last_update: current_time
    }));

    data.push(taxi2 = new models.TaxiLocation({
        latitude: 3.149222,
        longtitude: 101.686855,
        last_update: current_time
    }));

    data.push(taxi3 = new models.TaxiLocation({
        latitude: 3.239333,
        longtitude: 101.686855,
        last_update: current_time
    }));

    data.push(taxi4 = new models.TaxiLocation({
        latitude: 3.189444,
        longtitude: 101.686855,
        last_update: current_time
    }));

    data.push(new models.Taxi({
        plate_number: 'TAXI 1111',
        active: 1,
        taxilocation: taxi1
    }));

    data.push(new models.Taxi({
        plate_number: 'TAXI 2222',
        active: 1,
        taxilocation: taxi2
    }));

    data.push(new models.Taxi({
        plate_number: 'TAXI 3333',
        active: 1,
        taxilocation: taxi3
    }));

    data.push(new models.Taxi({
        plate_number: 'TAXI 4444',
        active: 1,
        taxilocation: taxi4
    }));
    
    // data for location demands
    
    data.push(working_peak = new models.Demand({
        demand_level: 10,
        timerange_l: '07:00',
        timerange_h: '08:00',
        weekday: true,
        weekend: false
    }));

    data.push(weekend_peak = new models.Demand({
        demand_level: 10,
        timerange_l: '11:00',
        timerange_h: '13:00',
        weekday: false,
        weekend: true
    }));
    
    data.push(new models.Location({
        location_name: 'Some Condo A',
        latitude: 3.139002,
        longtitude: 101.686855,
        demands: [working_peak, weekend_peak]
    }));
    
    connection.save(data, function(err) {
      if(err) { throw err; }
      console.log('Initial data created successfully.');
    });  
});