var Country = function(){}

Country.all = function(callback){
	// Callback in case you need to use ajax requests
	// To get those countries, so when you're done
	// You call the callback function
	var countries = ["Brazil", "Sweden"];
	callback(countries);
}