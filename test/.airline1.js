var assert = require("assert");
var filesystem = require("fs");
var inputsDir = __dirname + "/../inputs";

function ListDir (dir){
    this.dir = dir;
    this.files = [];
}

ListDir.prototype.getList = function(){

    var results = []; 
    var dir = this.dir;
     
    filesystem.readdirSync(dir).forEach(function(file) {
	    file = dir+'/'+file;
	    var stat = filesystem.statSync(file);
	    if (stat && !stat.isDirectory())
		results.push(file);

	});

    this.files = results;
};

function LoadFile(file){
    this.file = file;
}

function CheckFile(file){
    this.file = file;
}

CheckFile.prototype.getInfo = function (type, index, callback){

    var array = filesystem.readFileSync(this.file).toString().split("\n");    
    var passenger  = 0;

    array.forEach(function(instruction){
	    var parameters = instruction.split(" ") ;
	    if (parameters.length > 2 ) {
		if (parameters[1].match(type)) { 
		    //console.log('matHH') ;  
		    callback( parameters[index] );
		}		
	    }
	});
};

CheckFile.prototype.TotalRevenu = function (){

    console.log('flight_cost : ' + this.getInfo('route', 5));
    var total_revenu = this.getInfo('route', 5) * this.TotalPassenger();
    console.log('total_revenu : ' + total_revenu);
    return total_revenu;
};

CheckFile.prototype.FlightInfo = function (type, occurence){

    var array = filesystem.readFileSync(this.file).toString().split("\n");    
    var passenger  = 0;
    array.forEach(function(instruction){
	    var parameters = instruction.split(" ") ;
	    if (parameters.length > 2 ) {
		if (parameters[1].match(type)) {  passenger++ } 
	    }
	}
       );
    
    return passenger;
};

CheckFile.prototype.PassengerInfo = function (type, length){

    var array = filesystem.readFileSync(this.file).toString().split("\n");    
    var passenger = 0;
    array.forEach(function(instruction){
	    var parameters = instruction.split(" ") ;
	    if (parameters.length > length ) {
		if (parameters[1].match(type)) { passenger++ } 
	    }
	}
       );
    
    return passenger;
};

CheckFile.prototype.TotalPassenger = function (type, length){

    var array = filesystem.readFileSync(this.file).toString().split("\n");    
    var passenger = 0;
    array.forEach(function(instruction){
	    var parameters = instruction.split(" ") ;
	    if (parameters.length > 2 ) {
		if (parameters[1].match('general') || parameters[1].match('loyalty') || parameters[1].match('airline') ) { passenger++ } 
	    }
	}
       );

    return passenger;
};

CheckFile.prototype.TotalBags = function (type, length){

    var array = filesystem.readFileSync(this.file).toString().split("\n");    
    var is_info = 0;
    array.forEach(function(instruction){
	    var parameters = instruction.split(" ") ;
	    if (parameters.length > 2 ) {
		if (parameters[1].match('general') || parameters[1].match('loyalty') || parameters[1].match('airline') ) { is_info++ } 
		if ( parameters[1].match('loyalty') ) { 
			if (parameters[6] == 'TRUE') is_info++ ;
		   }
	    }
	}
       );    
    return is_info;
};

CheckFile.prototype.RedeemedPoints = function (type, length){

    var array = filesystem.readFileSync(this.file).toString().split("\n");    
    var loyalty_points = 0 ;
    array.forEach(function(instruction){
	    var parameters = instruction.split(" ") ;
	    if (parameters.length > 2 ) {
		if ( parameters[1].match('loyalty') ) { 
		    if (parameters[5] == 'TRUE') ( loyalty_points = loyalty_points + parameters[4]);
		   }
	    }
	}
       );    
    return loyalty_points;
};

CheckFile.prototype.TotalRevenu = function (file){
    var total_revenu = 0;

    return total_revenu;
};


var Flight = new Flight() 

describe('Flight', function() {
	var inputs = new ListDir(inputsDir);
	inputs.getList();
	if (inputs.files.length == 0 )  throw 'Error : No file to process'

	describe('Aircraft', function() {					    
	       inputs.files.forEach(function(file){
		       var file_array = new CheckFile(file);
		       it('We should only have 1 route instruction by file', function () {
			       assert.equal(1, file_array.FlightInfo('route', 6))
				   });
		       it('We should only have 1 aircraft instruction by file', function () {
			       assert.equal(1, file_array.FlightInfo('aircraft', 4))
				   });
		   });

	    });	           

	describe('Passenger', function() {					    
	       inputs.files.forEach(function(file){
		       var file_array = new CheckFile(file);
		       it('Each General passenger instruction must correctly formated', function () {
			       assert.equal(4, file_array.PassengerInfo('general', 3))
				   });
		       it('Each Loyalty passenger instruction must correctly formated', function () {
			       assert.equal(3, file_array.PassengerInfo('loyalty', 6))
				   });
		       it('Each Airline passenger instruction must correctly formated', function () {
			       assert.equal(1, file_array.PassengerInfo('airline', 3))
				   //assert.notDeepEqual({tea : 'false'},{tea: 'true'});
				   });
		       it('Total Number of passenger must be equal to 8', function () {
			       assert.equal(8, file_array.TotalPassenger())
				   //assert.notDeepEqual({tea : 'false'},{tea: 'true'});
				   });
		   });
	       
	    });	   

	describe('Economics', function() {					    
	       inputs.files.forEach(function(file){
		       var file_array = new CheckFile(file);
		       it('Total Number of passenger must be equal to 8', function () {
			       assert.equal(8, file_array.TotalPassenger())
				   //assert.notDeepEqual({tea : 'false'},{tea: 'true'});
				   });
		       it('Total number of bags must be equal to 9', function () {
			       assert.equal(9, file_array.TotalBags())
				   //assert.notDeepEqual({tea : 'false'},{tea: 'true'});
				   });
		       it('Total number of redeemed points', function () {
			       assert.equal(40, file_array.RedeemedPoints())
				   });

		       it('Total revenu', function () {
			       //assert.equal(40, file_array.TotalRevenu(file_array.getInfo('route', 5)))
			       file_array.getInfo('route', 5,function(myinfo){
				       console.log(myinfo);
				   });
			       console.log(file_array.TotalRevenu());
			   });
		       it('Adjusted revenu', function () {
			       //assert.equal(40, file_array.AdjustedRevenu())
			   });

		   });
	       
	    });	           
	
    });
