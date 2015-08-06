describe('something slow', function() {
	this.timeout(1000);

	it('should take more than 500ms', function(done) {
		setTimeout(done, 600);
	 });
   
});