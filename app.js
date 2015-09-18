//each day of the week will has a bool property of checked, and a bool display property defining if the day of the month is valid.
var Day = function(display, checked, dayofmonth/*optional*/) {
  dayofmonth = dayofmonth || null;
  this.dayofmonth = ko.observable(dayofmonth);
  this.display = ko.observable(display);
  this.checked = ko.observable(checked); };

// each week of the current month will be populated once a month is selected.
var Week = function(days/*fixed length array of 7 booleans indicating the checkbox values, null if not exist*/) {
    if (days.length != 7) throw "invalid week";
    this.days = ko.observableArray(days); };// <<------------- This is the required observable array for the checkboxes.

//changes the current month
function changeMonth(year, month, weeks/*the weeks of a month in an observalbe array*/){

  //initialize the month arrays
  for(var i = 0; i< 7; i++) {
    weeks[0].days()[i].display(false);
    weeks[0].days()[i].checked(false);
    weeks[0].days()[i].dayofmonth(null);
    weeks[1].days()[i].display(false);
    weeks[1].days()[i].checked(false);
    weeks[1].days()[i].dayofmonth(null);
    weeks[2].days()[i].display(false);
    weeks[2].days()[i].checked(false);
    weeks[2].days()[i].dayofmonth(null);
    weeks[3].days()[i].display(false);
    weeks[3].days()[i].checked(false);
    weeks[3].days()[i].dayofmonth(null);
    weeks[4].days()[i].display(false);
    weeks[4].days()[i].checked(false);
    weeks[4].days()[i].dayofmonth(null);
    weeks[5].days()[i].display(false);
    weeks[5].days()[i].checked(false);
    weeks[5].days()[i].dayofmonth(null);}

  //get first day of the month and set counters
  var d = new Date(year, month, 1);
  var dayCounter = d.getDay();
  var weekCounter = 0;

  //get last day of the month
  d = new Date(year, month+1, 0);

  //filling the dates
  for(var i=1; i<=d.getDate(); i++) {
    weeks[weekCounter].days()[dayCounter].display(true);
    weeks[weekCounter].days()[dayCounter].dayofmonth(i);
    dayCounter += 1;
    if (dayCounter == 7) 
      weekCounter += 1;
    dayCounter%=7;
  }

  //unessary: weeks[0].days.valueHasMutated();
}


//The knockout view model class
var VM = function(){
  var self = this;
  self.markets=states;
  self.routes=routes,
  self.drivers=drivers;

  //initialze an array representing a month: 6 weeks for a month, 7 days for a week.
  self.weeks=
      Array.apply(null, Array(6)).map(
        function(){return new Week(Array.apply(null, Array(7)).map(
            function(){return new Day(false, false)}))});

  //current month
  self.month=ko.observable(9);
  //current year
  self.year=ko.observable(2015);
  //current month in words
  self.monthWord=
    ko.pureComputed(function(){
      return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][self.month()];
    });

  //handling the weekly repeat routes
  self.weekThs = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  self.weeklyRepeatRoute = function(day/*0 is Sunday, 1 is Monday and so on.*/){
    day = day || 0;
    if (self.weeks[0].days()[day].checked() &&
        self.weeks[1].days()[day].checked() &&
        self.weeks[2].days()[day].checked() &&
        self.weeks[3].days()[day].checked()) { 
    for(var i = 0; i<6; i++) 
      self.weeks[i].days()[day].checked(false);
    } else {
    for(var i = 0; i<6; i++) 
      self.weeks[i].days()[day].checked(true);}
  };

  //AJAX using Jquery
  self.ajaxPost = function(){
    var data = {
      marketID: $("#marketsID option:selected").val(),
      routeID: $("#routesID option:selected").val(),
      driverID: $("#driversID option:selected").val(),
      year: self.year(),
      month: self.monthWord(),
      days: 
        self.weeks[0].days().concat( 
            self.weeks[1].days(), 
            self.weeks[2].days(),
            self.weeks[3].days(),
            self.weeks[4].days(),
            self.weeks[5].days()).
        filter(function(day){ 
          return day.checked() && (day.dayofmonth() !== null); 
        }).map(function(day){
          return day.dayofmonth();
        })
    };
    console.log("Data posted:"); 
    console.log(data);
    $.post( "http://posttestserver.com/post.php", data).done(function( data ) {
      console.log("Response:" + data);
    });
  }

  //button events for changing current month and year
  self.increaseCurrentMonth=function(){
      self.month((self.month()+1)%12);
      changeMonth(self.year(), self.month(), self.weeks);};
  self.decreaseCurrentMonth=function(){
      self.month((12+(self.month()-1)%12)%12);
      changeMonth(self.year(), self.month(), self.weeks);};
  self.increaseCurrentYear=function(){
      self.year((self.year()+1)%3000);
      changeMonth(self.year(), self.month(), self.weeks);};
  self.decreaseCurrentYear=function(){
      self.year((self.year()-1)%3000);
      changeMonth(self.year(), self.month(), self.weeks);};
};

//main binding on ready
$(document).ready(function() {
  var vm = new VM();
  ko.applyBindings(vm);
  var d = new Date();
  vm.month(d.getMonth());
  vm.year(d.getFullYear());
  changeMonth(d.getFullYear(), d.getMonth(), vm.weeks);
});
