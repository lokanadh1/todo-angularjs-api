app.service("apiService", function ($http) {

  var API = "http://localhost:3000/tasks";

  // GET all tasks
  this.getTasks = function () {
    return $http.get(API);
  };

  // ADD task
  this.addTask = function (task) {
    return $http.post(API, task);
  };

  // UPDATE task
  this.updateTask = function (task) {
    return $http.put(API + "/" + task.id, task);
  };

  // DELETE task
  this.deleteTask = function (id) {
    return $http.delete(API + "/" + id);
  };
});
