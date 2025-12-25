var app = angular.module("todoApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "views/todo.html",
      controller: "TodoController",
      controllerAs: "vm"
    })
    .when("/analytics", {
      templateUrl: "views/analytics.html",
      controller: "AnalyticsController",
      controllerAs: "vm"
    })
    .when("/suggestions", {
      templateUrl: "views/suggestions.html",
      controller: "SuggestionsController",
      controllerAs: "vm"
    })
    .otherwise({
      redirectTo: "/"
    });
});
