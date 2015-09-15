$(document).ready(function() {
  // each week of the current month will be populated once a month is selected.
  var Week = 
    function(days/*fixed length array of 7 booleans indicating the checkbox values, null if not exist*/) { 
      if (days.length != 7) throw "invalid week";
      this.days = ko.observableArray(daysofmonth); };
  var vm = {
    markets: 
      states,
    routes: 
      routes,
    drivers: 
      drivers,
    weeks: 
      //nested array representing a month: 5 weeks for a month, 7 days for a week.
      Array.apply(null, Array(5)).map(function(){return new Week(Array.apply(null, Array(7)).map(function(){return null}))}),
    Month:
      9,
    Year:
      2015
  };
  ko.applyBindings(vm);
});
