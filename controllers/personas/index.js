var PersonasController = Composer.Controller.extend({
	elements: {
	},

	events: {
		'click .button.add': 'add_persona',
		'click a.add': 'add_persona',
		'click a[href=#edit]': 'edit_persona',
		'click a[href=#delete]': 'delete_persona'
	},

	collection: null,

	init: function()
	{
		if(!this.collection) this.collection = tagit.user.get('personas');
		this.render();
		modal.open(this.el);
		var modalclose = function() {
			modal.removeEvent('close', modalclose);
			this.release();
		}.bind(this);
		modal.addEvent('close', modalclose);
		this.collection.bind(['change', 'add', 'remove', 'destroy', 'reset'], this.render.bind(this), 'personas:monitor:render');
	},

	release: function()
	{
		if(modal.is_open) modal.close();
		this.collection.unbind(['change', 'add', 'remove', 'destroy', 'reset'], 'personas:monitor:render');
		this.parent.apply(this, arguments);
	},

	render: function()
	{
		var personas = this.collection.map(function(persona) {
			return toJSON(persona);
		});
		var content = Template.render('personas/index', {
			personas: personas
		});
		this.html(content);
	},

	add_persona: function(e)
	{
		if(e) e.stop();
		this.release();
		new PersonaEditController({
			collection: this.collection
		});
	},

	get_persona_id: function(target)
	{
		return next_tag_up('li', next_tag_up('li', target).getParent()).className.replace(/^.*persona_([0-9a-f-]+).*?$/, '$1');
	},

	edit_persona: function(e)
	{
		if(!e) return false;
		e.stop();
		var pid		=	this.get_persona_id(e.target);
		var persona	=	this.collection.find_by_id(pid);
		if(!persona) return false;
		this.release();
		new PersonaEditController({
			collection: this.collection,
			model: persona
		});
	},

	delete_persona: function(e)
	{
		if(!e) return false;
		e.stop();
		var pid = this.get_persona_id(e.target);
		var persona = this.collection.find_by_id(pid);
		if(!persona) return false;
		if(!confirm('Really delete this persona? It will be gone forever, along with its keys (both public and private). All data shared with this persona will no longer be accessible to you. THIS IS IRREVERSIBLE.')) return false;
		persona.destroy_persona();
	}
});