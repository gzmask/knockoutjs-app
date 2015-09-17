$(document).ready(function() {

  //each day of the week will has a bool property of checked, and a bool display property defining if the day of the month is valid.
  var Day = function(display,checked) {
    this.display = display;
    this.checked = checked; };

  // each week of the current month will be populated once a month is selected.
  var Week = function(days/*fixed length array of 7 booleans indicating the checkbox values, null if not exist*/) {
      if (days.length != 7) throw "invalid week";
      this.days = ko.observableArray(days); };

  var vm = {
    markets: 
      states,
    routes: 
      routes,
    drivers: 
      drivers,
    weeks: 
      //nested array representing a month: 5 weeks for a month, 7 days for a week.
      ko.observableArray(Array.apply(null, Array(5)).map(function(){return new Week(Array.apply(null, Array(7)).map(function(){return new Day(false, false)}))})),
    month:
      ko.observable(9),
    year:
      ko.observable(2015)
  };

  ko.applyBindings(vm);
  vm.weeks()[0].days()[0] = new Day(true,true);
  vm.weeks()[0].days.valueHasMutated();
});
