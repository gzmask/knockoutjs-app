//each day of the week will has a bool property of checked, and a bool display property defining if the day of the month is valid.
var Day = function(display, checked, dayofmonth/*optional*/) {
  dayofmonth = dayofmonth || null;
  this.dayofmonth = ko.observable(dayofmonth);
  this.display = ko.observable(display);
  this.checked = ko.observable(checked); };

// each week of the current month will be populated once a month is selected.
var Week = function(days/*fixed length array of 7 booleans indicating the checkbox values, null if not exist*/) {
    if (days.length != 7) throw "invalid week";
    this.days = ko.observableArray(days); };

//changes the current month
function changeMonth(year, month, weeks/*the weeks of a month in an observalbe array*/){

  //initialize the month arrays
  for(var i = 0; i< 7; i++) {
    weeks()[0].days()[i].display(false);
    weeks()[0].days()[i].dayofmonth(null);
    weeks()[1].days()[i].display(false);
    weeks()[1].days()[i].dayofmonth(null);
    weeks()[2].days()[i].display(false);
    weeks()[2].days()[i].dayofmonth(null);
    weeks()[3].days()[i].display(false);
    weeks()[3].days()[i].dayofmonth(null);
    weeks()[4].days()[i].display(false);
    weeks()[4].days()[i].dayofmonth(null);
  }

  //get first day of the month and set counters
  var d = new Date(year, month, 1);
  var dayCounter = d.getDay();
  var weekCounter = 0;

  //get last day of the month
  d = new Date(year, month+1, 0);

  //filling the dates
  for(var i=1; i<=d.getDate(); i++) {
    weeks()[weekCounter].days()[dayCounter].display(true);
    weeks()[weekCounter].days()[dayCounter].dayofmonth(i);
    dayCounter += 1;
    if (dayCounter == 7) 
      weekCounter += 1;
    dayCounter%=7;
  }

  //unessary: weeks()[0].days.valueHasMutated();
}

//view model class
var VM = function(){
  var self = this;
  self.markets=states;
  self.routes=routes,
  self.drivers=drivers;

  //initialze an nested observable array representing a month: 5 weeks for a month, 7 days for a week.
  self.weeks=ko.observableArray(Array.apply(null, Array(5)).map(function(){return new Week(Array.apply(null, Array(7)).map(function(){return new Day(false, false)}))}));

  //current month
  self.month=ko.observable(9);
  //current year
  self.year=ko.observable(2015);
  //current month in words
  self.monthWord=
    ko.pureComputed(function(){
      switch (self.month()) {
        case 0: return "Jan"
                break;
        case 1: return "Feb"
                break;
        case 2: return "Mar"
                break;
        case 3: return "Apr"
                break;
        case 4: return "May"
                break;
        case 5: return "Jun"
                break;
        case 6: return "Jul"
                break;
        case 7: return "Aug"
                break;
        case 8: return "Sep"
                break;
        case 9: return "Oct"
                break;
        case 10: return "Nov"
                break;
        case 11: return "Dec"
                break;}
    });

  //button events for changing current month and year
  self.increaseCurrentMonth=function(){
      this.month((this.month()+1)%12);
      changeMonth(this.year(), this.month(), this.weeks);};
  self.decreaseCurrentMonth=function(){
      this.month((12+(this.month()-1)%12)%12);
      changeMonth(this.year(), this.month(), this.weeks);};
  self.increaseCurrentYear=function(){
      this.year((this.year()+1)%3000);
      changeMonth(this.year(), this.month(), this.weeks);};
  self.decreaseCurrentYear=function(){
      this.year((this.year()-1)%3000);
      changeMonth(this.year(), this.month(), this.weeks);};
};


$(document).ready(function() {
  var vm = new VM();
  ko.applyBindings(vm);
  var d = new Date();
  changeMonth(d.getYear(), d.getDate(), vm.weeks);

});
