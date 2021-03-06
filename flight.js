var exports = module.exports = {};
var filesystem = require("fs");
var inputsDir = __dirname + "/../inputs";
var FLIGHT_SOURCE= 2;
var FLIGHT_DEST= 3;
var AIRCRAFT_CAPACITY= 3;
var AIRCRAFT_NAME= 2;
var MIN_LOAD= 6;
var LOYALTY_POINTS=4;
var LOYALTY_USE=5;
var LUGGAGE_LOAD=6;
//Route
var ROUTE_PERC=6;
var TICKET_COST= 4;
var TICKET_PRICE= 5;

function isPassenger (instruction){
    var passenger_type = ['airline', 'general', 'loyalty'];
    var _isPassenger = 1;
    passenger_type.forEach(function (type){	    	    
	    if (instruction.match(type)) { 
		_isPassenger = 0
	    }
    });
    if ( _isPassenger){ return 0}
    else return 1
};

function formateOutput (flight){
    var output = flight.passenger.passengerCount + ' ' + flight.passenger.passengerGeneral.count + ' ' + flight.passenger.passengerAirline.count + ' ' + flight.passenger.passengerLoyalty.count + ' ' + flight.passenger.bags + ' ' + flight.passenger.loyalty_points_redemeed + ' ' + flight.Cost.cost_of_flight  + ' ' + flight.Cost.total_unadjusted_ticket_revenue + ' ' + flight.Cost.total_adjusted_revenue + ' ' + flight.can_flight_proceed + '\n';
    return output;
}

function writeOutput(file, flight){ 
    filesystem.writeFile(file, formateOutput(flight), function(err) {
    	    if(err) {
    		return console.log(err);
    	    }
    	});

}

function Passengers (context){
this.passengerCount = context.getPassenger('all').length;
this.passengerGeneral = { count : context.getPassenger('general').length, data :  context.getPassenger('general')};
this.passengerAirline = { count : context.getPassenger('airline').length, data : context.getPassenger('airline')};
this.passengerLoyalty = {count : context.getPassenger('loyalty').length, data : context.getPassenger('loyalty')};
this.bags = context.getBags();
this.loyalty_points_redemeed = context.getLoyaltyPoints();
}

function Route (context){ 
    this.percentage = context.getAllInfo([ ['route', ROUTE_PERC]])[0];
    this.ticket_cost = context.getAllInfo([ ['route', TICKET_COST]])[0];
    this.ticket_price = context.getAllInfo([ ['route', TICKET_PRICE]])[0];
}

function Aircraft (context){ 
    this.name = context.getAllInfo([ [ 'aircraft', AIRCRAFT_NAME ]])[0];
    this.capacity = context.getAllInfo([  [ 'aircraft', AIRCRAFT_CAPACITY] ])[0];
}

function Context (file){
    this.array = filesystem.readFileSync(file).toString().split("\n");

    this.getPassenger = function(type){
	var results = [];
	this.array.forEach(function(instruction){
		if ( isPassenger(instruction) ){
		    var parameters = instruction.split(" ") ;
		    if (type == 'all'){
			parameters.shift();
			results.push({ type : parameters[1], info : parameters});   
		    }
		    else{
			if (instruction.match(type)){
			    parameters.shift();
			    results.push({ type : parameters[1], info : parameters});
			}
		    }
		    return true;
		}
	    });
	return(results);
    };

    this.getLoyaltyPoints = function() {
	var loyalty_points = 0;
	this.getPassenger().forEach(function (passenger){
		if (passenger.info[0].valueOf() == 'loyalty'){
		     if (passenger.info[4].valueOf() == 'TRUE'){
			 loyalty_points = loyalty_points + parseInt(passenger.info[3]);
		    }
		}
	    });
	return loyalty_points;
    };

    this.getBags = function() {
	var bags = this.getPassenger().length;
	this.getPassenger().forEach(function (passenger){
		if (passenger.info[0].valueOf() == 'loyalty'){
		     if (passenger.info[5].valueOf() == 'TRUE'){		    
			 bags++;
		    }
		}
	    });
	return bags;
    };

    this.getAllInfo = function(infos, callback){
	var array = this.array;
	var results = [];	
	infos.forEach(function(request){
		array.forEach(function(instruction){		
			if (instruction.match(request[0])){
			    var parameters = instruction.split(" ") ;
			    results.push((parameters[request[1]]));
			}
		    });
	    });
	return(results);
    };
}

function Cost (passenger, route) {
    this.cost_of_flight = route.ticket_cost * passenger.passengerCount ;
    this.total_unadjusted_ticket_revenue = route.ticket_price * passenger.passengerCount;
    this.total_adjusted_revenue = route.ticket_price * ( passenger.passengerCount -  passenger.passengerAirline.count) - passenger.loyalty_points_redemeed ;
}

function Flight (context){
this.passenger = new Passengers(context);   
this.aircraft = new Aircraft(context);
this.route   = new Route(context);
this.Cost = new Cost(this.passenger,this.route)
this.can_flight_proceed = ( ( this.aircraft.capacity/this.passenger.passengerCount*100 > this.route.percentage )  ? 'TRUE' : 'FALSE'); 
}

exports.run = function(input, output) {
    var _input = input || './inputs/file1.txt';
    var _output = output || '/tmp/output1.txt';
    this.context = new Context(_input);   
    this.flight = new Flight(this.context);
    writeOutput(_output, this.flight);


    var _reader = new FileReader(_input);
};


function IO(fd){
	this.fd = fd;
	this.open = function(fd){
		
	};
}

function File(file){
	this.parent = new IO(file);
	if(!file){
		throw new Exception("no file provided");
	}
	this.file = file;
	this.open = function(paramFile){
		tmpFile = paramFile ? paramFile : this.file;
		this.fileData = filesystem.readFileSync(tmpFile);
	};

}

function FileReader(file){
	this.parent = new File(file);
	if(!file){
		throw new Exception("no file provided");
	}
	this.file = file;
	
	this.parent.open();
	this.eachLine = function(){
		var tmpTab = this.parent.fileData;
		.toString().split("\n")
		//TODO recursive getnextline
	};
}






