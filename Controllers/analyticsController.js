app.controller("AnalyticsController", function (apiService, $timeout) {
  var vm = this;

  vm.kpis = [];
  vm.sortedTags = [];
  vm.stackedData = {};

  const priorityWeight = { High: 3, Medium: 2, Low: 1 };
  const priorityColors = { High: "#e74c3c", Medium: "#f39c12", Low: "#2ecc71" };

  apiService.getTasks().then(function (res) {
      const tasks = res.data;

      const completedCount = tasks.filter(t => t.completed).length;
      const pendingCount = tasks.length - completedCount;

      // ✅ Completed / Pending in percentage
      const completedPercent = tasks.length ? ((completedCount / tasks.length) * 100).toFixed(1) : 0;
      const pendingPercent = tasks.length ? ((pendingCount / tasks.length) * 100).toFixed(1) : 0;

      // ✅ Pending High-Priority % KPI (replacing old Priority Index)
      const pendingHighCount = tasks.filter(t => !t.completed && t.priority === "High").length;
      const pendingHighPercent = tasks.length ? ((pendingHighCount / tasks.length) * 100).toFixed(1) : 0;

      vm.kpis = [
          { label: "Total Tasks", value: tasks.length },
          { label: "Completed (%)", value: completedPercent + "%" },
          { label: "Pending Tasks", value: pendingCount },
          { label: "Pending High-Priority", value: pendingHighPercent + "%" }
      ];

      // Prepare tag charts
      vm.sortedTags = getSortedTagEffort(tasks);
      vm.stackedData = getStackedTagData(tasks);

      $timeout(function () {
          drawCompletionChart(completedPercent, pendingPercent);
          drawTagChart(vm.sortedTags);
          drawStackedChart(vm.stackedData);
      });
  });

  // --------------------------
  // Helper Functions
  // --------------------------

  function getSortedTagEffort(tasks) {
      const tagMap = {};

      tasks.forEach(task => {
          if (!task.tags) return;
          const weight = priorityWeight[task.priority] || 1;
          const tags = task.tags.split(",").map(t => t.trim());

          tags.forEach(tag => {
              if (!tag) return;
              tagMap[tag] = (tagMap[tag] || 0) + weight;
          });
      });

      return Object.entries(tagMap)
          .sort((a, b) => b[1] - a[1])
          .map(entry => ({ tag: entry[0], effort: entry[1] }));
  }

  function getStackedTagData(tasks) {
      const stackMap = {};
      tasks.forEach(task => {
          if (!task.tags) return;
          const tags = task.tags.split(",").map(t => t.trim());

          tags.forEach(tag => {
              if (!stackMap[tag]) stackMap[tag] = { High: 0, Medium: 0, Low: 0 };
              stackMap[tag][task.priority] += 1; // count per priority
          });
      });
      return stackMap;
  }

  // --------------------------
  // Chart Drawing
  // --------------------------

  function drawCompletionChart(completedPercent, pendingPercent) {
      new Chart(document.getElementById("completionChart"), {
          type: "doughnut",
          data: {
              labels: ["Completed", "Pending"],
              datasets: [{
                  data: [completedPercent, pendingPercent],
                  backgroundColor: ["#2ecc71", "#e74c3c"]
              }]
          },
          options: {
              plugins: {
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              return context.label + ": " + context.raw + "%";
                          }
                      }
                  }
              }
          }
      });
  }

  function drawTagChart(sortedTags) {
      new Chart(document.getElementById("tagChart"), {
          type: "bar",
          data: {
              labels: sortedTags.map(t => t.tag),
              datasets: [{
                  label: "Effort Weight",
                  data: sortedTags.map(t => t.effort),
                  backgroundColor: sortedTags.map(() => "#0d6efd")
              }]
          },
          options: {
              indexAxis: "y",
              plugins: {
                  legend: { display: false },
                  datalabels: {
                      display: true,
                      color: "black",
                      anchor: "end",
                      align: "right"
                  }
              },
              scales: { x: { beginAtZero: true } }
          }
      });
  }

  function drawStackedChart(stackedData) {
      const labels = Object.keys(stackedData);
      new Chart(document.getElementById("stackedChart"), {
          type: "bar",
          data: {
              labels: labels,
              datasets: [
                  { label: "High", backgroundColor: priorityColors.High, data: labels.map(l => stackedData[l].High) },
                  { label: "Medium", backgroundColor: priorityColors.Medium, data: labels.map(l => stackedData[l].Medium) },
                  { label: "Low", backgroundColor: priorityColors.Low, data: labels.map(l => stackedData[l].Low) }
              ]
          },
          options: {
              plugins: { legend: { display: true }, datalabels: { display: true, color: "black" } },
              scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } }
          }
      });
  }
});
