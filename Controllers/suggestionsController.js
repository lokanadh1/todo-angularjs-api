app.controller("SuggestionsController", function (apiService) {

    var vm = this;
    vm.suggestions = [];
  
    apiService.getTasks().then(function (res) {
      const tasks = res.data;
  
      if (!tasks.length) return;
  
      const completed = tasks.filter(t => t.completed).length;
      const pending = tasks.length - completed;
  
      const highPending = tasks.filter(
        t => !t.completed && t.priority === "High"
      ).length;
  
      const tagCount = {};
      tasks.forEach(t => {
        if (!t.tags) return;
        t.tags.split(",").forEach(tag => {
          tag = tag.trim();
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      });
  
      const topTag = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])[0];
  
      // 🔍 Suggestions logic
      if (completed / tasks.length < 0.5) {
        vm.suggestions.push({
          title: "Low Completion Rate",
          message: "Try completing smaller tasks first to build momentum."
        });
      }
  
      if (highPending > 0) {
        vm.suggestions.push({
          title: "High Priority Tasks Pending",
          message: `You have ${highPending} high-priority tasks pending. Consider finishing them soon.`
        });
      }
  
      if (topTag) {
        vm.suggestions.push({
          title: "Dominant Task Category",
          message: `Most of your tasks are related to "${topTag[0]}". You may want to balance other areas.`
        });
      }
    });
  });
  