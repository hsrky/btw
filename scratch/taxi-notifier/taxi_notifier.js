/**
 * Main logic of finding and notify taxis nearby popular location based on history data
 * Usage:
 *  node taxi_notifier.js
 *  
 * Expect to be called every 30 minutes by some scheduler;
 */

var hireDemands = require('./utils/HireDemands'),
    hireSources = require('./utils/HireSources'),
    redisManager = require('redis-client-manager'),
    notifyEvent = new (require('events').EventEmitter), // notify taxi event
    redisClient = redisManager.getClient(),
    util = require('util'),     // nodejs standard util library
    moment = require('moment'); // datetime library

console.log('\n\nStarting taxi_notifier...\n=========================');

var currentMoment = new moment(),
    dayOfToday = currentMoment.day(),               // Sunday as 0 and Saturday as 6.
    nextSlot = currentMoment.add('minutes', 30),    // assume 30 minutes each slot, i.e. check for update every 30 minutes
    nextSlot = nextSlot.format('HH:mm').toString(), // we only need the hour and minutes in string, eg. "14:30"
    HIGH_DEMAND_LVL = 10,                           // we want places with highest demand only
    isWeekend = false;

notifyEvent.on('notify_taxi', function(taxi_id) {
    redisClient.lpush('prediction', taxi_id);
});

console.log(util.format('INPUT: Today is "%s", and next slot is: "%s"', dayOfToday, nextSlot));

if(dayOfToday === 0 || dayOfToday === 6) {
    isWeekend = true;
}

// FIXME: since db don't have too much data, fake the slot data...
console.log('DEBUGGING...MOCK TO WEEKDAY AND 07:30.');
nextSlot = '07:30';
isWeekend = false;

hireDemands.getAllLocations(HIGH_DEMAND_LVL, nextSlot, isWeekend, function(locations) {
    console.log('Following locations has high demands on next 30 mins:', locations);
    
    if(locations.length === 0) {
        console.log('\nNo taxi available nearby. \nEnd\n======')
        return;
    }
    
    for(var i = 0, totalLocations = locations.length; i < totalLocations; ++i) {
        var location = locations[i];
        console.log('\nGet taxi within 5km from this point', location.coord);
        
        hireSources.getAvailable(location.coord, 5, function(taxis) {
            console.log(util.format('\nThere are %s taxis within 5km of "%s"', taxis.length, location.name));
            // put them to redis queue
            for(var j = 0, totalTaxis = taxis.length; j < totalTaxis; ++j) {
                var taxi = taxis[j];
                console.log(util.format(' -> Need to notify taxi: "%s" (id=%s)', taxi.number, taxi.id));
                notifyEvent.emit('notify_taxi', taxi.id);
            }
        });
    }
});