app.controller("TodoController", function (apiService) {

  var vm = this;

  vm.tasks = [];
  vm.filterStatus = "all";
  vm.selectedTag = null;

  // Predefined static tags
  vm.staticTags = [
    "default", "Health", "Finance", "Work",
    "Hobby", "Travel", "Social", "Emergency"
  ];

  vm.allTags = [...vm.staticTags];

  vm.newTask = {
    title: "",
    description: "",
    tags: "",
    due: ""
  };

  // Load Tasks
  vm.loadTasks = function () {
    apiService.getTasks().then(function (response) {
      vm.tasks = response.data;

      let tagsSet = new Set();

      vm.tasks.forEach(function (task) {
        // Split tags, trim, and remove empty
        task.tagList = task.tags
          ? task.tags.split(",").map(t => t.trim()).filter(t => t)
          : [];

        // Collect all tags for dynamic filter
        task.tagList.forEach(tag => tagsSet.add(tag));
      });

      // Merge static tags + dynamic tags
      vm.allTags = Array.from(new Set([...vm.staticTags, ...tagsSet]));
    });
  };

  // Add Task
  vm.addTask = function () {
    if (!vm.newTask.title) {
      alert("Task title required");
      return;
    }

    let tagList = vm.newTask.tags
      ? vm.newTask.tags.split(",").map(t => t.trim()).filter(t => t)
      : [];

    var task = {
      title: vm.newTask.title,
      description: vm.newTask.description,
      tags: vm.newTask.tags,
      tagList: tagList,
      priority: vm.newTask.priority,
      due: vm.newTask.due,
      completed: false
    };

    apiService.addTask(task).then(function () {
      vm.newTask = { title: "", description: "", tags: "", due: "" };
      vm.loadTasks();
    });
  };

  // Update Task
  vm.updateTask = function (task) {
    apiService.updateTask(task);
  };

  // Delete Task
  vm.deleteTask = function (id) {
    apiService.deleteTask(id).then(function () {
      vm.loadTasks();
    });
  };

  // Filters
  vm.setFilter = function (status) {
    vm.filterStatus = status;
    vm.selectedTag = null;
  };

  vm.filterByTag = function (tag) {
    vm.selectedTag = tag;
  };

  vm.clearTag = function () {
    vm.selectedTag = null;
  };

  vm.taskFilter = function (task) {
    if (vm.filterStatus === "completed" && !task.completed) return false;
    if (vm.filterStatus === "active" && task.completed) return false;
    if (vm.selectedTag && !task.tagList.includes(vm.selectedTag)) return false;
    return true;
  };

  // Initialize
  vm.loadTasks();
});
