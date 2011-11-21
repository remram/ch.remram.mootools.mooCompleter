

var mooCompleter = new Class({
	
	Implements: [Options, Events],

	plugins: [],

	options: {
		selectOptions: false,
		data: [],
		unique: true,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.element = document.id(el); if (!this.element) return;
		this.setOptions(options);
		this.prefix = this.options.prefix;
		
		this.constructInputArea();
		//this.convertDivToInput();
	},
	
	convertDivToInput: function() {
		this.element.set('text', this.options.data);
	},
	
	constructInputArea: function() {
		this.element.adopt(
				new Element('ul').adopt(
						new Element('li').adopt(
								new Element('input[type="text"][class="visible"]').removeEvents('click').addEvent('click', function(e) {
									console.info('test');
									this.addInputEvents();
								}.bind(this)),
								new Element('span[text="MY SPANNNNN"]')
						)
				)
		);
	},
	
	addInputEvents: function() {
		this.element.getElements('ul li span').highlight();
	}
	
});