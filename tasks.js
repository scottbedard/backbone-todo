(function() {

  // App namespace
  var App = {
    Collections: {},
    Models: {},
    Views: {},
  };

  // Individual task model
  App.Models.Task = Backbone.Model.extend({
    defaults: {
      title: '',
      isEditing: false,
      isComplete: false,
    },
  });

  // Tasks collection
  App.Collections.Tasks = Backbone.Collection.extend({
    model: App.Models.Task,
  });

  // Task view
  App.Views.Task = Backbone.View.extend({
    tagName: 'tr',
    template: _.template($('#task-template').html()),
    initialize: function() {
      this.model.on('destroy', this.onRemove, this);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    events: {
      'click .onDestroy': 'onDestroy',
      'click .onEdit': 'onEdit',
      'click .onToggle': 'onToggle',
      'click .onSave': 'onSave',
    },
    onDestroy: function() {
      this.model.destroy();
    },
    onEdit: function() {
      this.model.set('isEditing', true);
      this.render();
      this.$el.find('input[type=text]').first().focus();
    },
    onRemove: function() {
      this.$el.remove();
    },
    onSave: function() {
      var $newTitle = this.$el.find('input[type=text]').first();
      this.model.set({ title: $newTitle.val(), isEditing: false });
      this.render();
    },
    onToggle: function() {
      this.model.set('isComplete', !this.model.get('isComplete'));
      this.render();
    },
  });

  // Tasks collection view
  App.Views.Tasks = Backbone.View.extend({
    tagName: 'tbody',
    render: function() {
      this.collection.each(function(task) {
        this.onAddTask(task);
      }, this);
      return this;
    },
    initialize: function() {
      this.collection.on('add', this.onAddTask, this);
    },
    onAddTask: function(task) {
      var taskView = new App.Views.Task({ model: task });
      this.$el.append(taskView.render().el);
    },
  });

  // New task view
  App.Views.NewTask = Backbone.View.extend({
    el: '#new-task-view',
    events: {
      'submit': 'onSubmit',
    },
    onSubmit: function(e) {
      e.preventDefault();
      var $input = this.$el.find('input[type=text]').first(),
          newTask = new App.Models.Task({ title: $.trim($input.val()) });

      $input.val('');

      this.collection.add(newTask);
    }
  });

  // Seed some tasks
  var tasksCollection = new App.Collections.Tasks([
    { title: 'Go to the store', isComplete: true },
    { title: 'Learn Backbone' },
    { title: 'Learn Marionette' },
  ]);

  // Set up the new task view
  var newTaskView = new App.Views.NewTask({ collection: tasksCollection });

  // Pass the collection into the view and render it into it's continer
  var tasksView = new App.Views.Tasks({ collection: tasksCollection });
  tasksView.render().$el.insertAfter('#tasks-view thead');

})();
