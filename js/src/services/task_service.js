angular.module('Karela')
  .service('TaskService', function($q){
    var TaskService = this;

    TaskService.taskClass = Parse.Object.extend("Task");

    TaskService.create = function(title, description) {
      var task = new TaskService.taskClass();
      task.set("title", title);
      task.set("description", description);
      task.save({
        success: function(obj) {
          console.log("Task saved successfully");
        },
        error: function(obj, error) {
          console.log("Error saving task: " + error.message);
        }
      });
    };

    TaskService.fetch = function() {
      TaskService.tasks = [];
      var differedQuery = $q.defer();
      var query = new Parse.Query(TaskService.taskClass);
      query.find().then(function (data) {
      	differedQuery.resolve(data);
      }, function (error) {
      	differedQuery.reject(data);
      });
      differedQuery.promise
        .then(function (data) {
          angular.forEach(data, function(obj) {
            task = {};
            task.title = obj.get("title");
            task.description = obj.get("description");
            TaskService.tasks.push(task);
          });
        })
        .catch(function (error) {
        	console.log("Error fetching tasks: " + error.message);
        });

      return TaskService.tasks;
    };
  });