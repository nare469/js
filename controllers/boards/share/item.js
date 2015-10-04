var BoardsShareItemController = Composer.Controller.extend({
	tag: 'li',

	elements: {
		'.invite-actions': 'actions'
	},

	events: {
		'click .menu a[rel=delete]': 'open_delete'
	},

	model: null,
	pending: false,

	init: function()
	{
		this.with_bind(this.model, 'change', this.render.bind(this));
		this.render();
	},

	render: function()
	{
		var data = this.model.toJSON();
		var persona = this.pending ? data.to_persona : data;
		if(!persona.id) persona = false;

		this.html(view.render('boards/share/item', {
			pending: this.pending,
			persona: persona,
			share: data
		}));

		var actions = [
			[{name: 'Delete'}],
		];
		this.track_subcontroller('actions', function() {
			return new ItemActionsController({
				inject: this.actions,
				actions: actions
			});
		}.bind(this));
	},

	open_delete: function(e)
	{
		if(e) e.stop();
		console.log('delete');
	}
});
