$(document).ready(function() {
  var vm = { 
    Markets: states,
    Routes: routes,
    Drivers: drivers
  };
  ko.applyBindings(vm);
});
