var assert = require("assert");
var should = require('should');
var filesystem = require("fs");
var App = require("../flight.js");

App.run("./inputs/file1.txt", "/tmp/test1.txt");
describe('Flight', function() {
	describe('Route', function() {					    
		it('Percentage should be 75', function () {
			assert.equal(75, App.flight.route.percentage);
		    });
		it('Ticket Cost should be 100', function () {
			assert.equal(100, App.flight.route.ticket_cost);
		    });		
		it('Ticket Price should be 150', function () {
			assert.equal(150, App.flight.route.ticket_price);
		    });		
	    });	           		
	describe('Aircraft', function() {					    
		it('Aircraft capacity should be 8', function () {
			assert.equal(8, App.flight.aircraft.capacity);
		    });
	    });	       
	describe('Passenger', function() {					    
		it('PassengerCount should be 8', function () {
			assert.equal(8, App.flight.passenger.passengerCount);
		    });		
		it('passengerGeneral Count should be 4', function () {
			assert.equal(4, App.flight.passenger.passengerGeneral.count);
		    });		
		it('passengerAirline Count should be 1', function () {
			assert.equal(1, App.flight.passenger.passengerAirline.count);
		    });		
		it('passengerLoyalty Count should be 3', function () {
			assert.equal(3, App.flight.passenger.passengerLoyalty.count);
		    });
		it('passenger bags should be 9', function () {
			assert.equal(9, App.flight.passenger.bags);
		    });
	    });	    		    		
	describe('Cost', function() {			    
		it('cost_of_flight  should be 800', function () {
			assert.equal(800, App.flight.Cost.cost_of_flight);
		    });		
		it('total_unadjusted_ticket_revenue should be 1200', function () {
			assert.equal(1200, App.flight.Cost.total_unadjusted_ticket_revenue);
		    });		
		it('total_adjusted_revenue should be 1010', function () {
			assert.equal(1010, App.flight.Cost.total_adjusted_revenue);
		    });
	    });
	    		    	       
	describe('Can Fly', function() {	       
		it('Flight should be allowed to fly', function () {
			App.flight.can_flight_proceed.should.equal('TRUE');
		    });
	    });    	       			    

    });



