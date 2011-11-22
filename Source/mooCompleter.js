

var mooCompleter = new Class({
	Implements: [Options, Events, mooCompleterAutoList, mooCompleterSelectOptions],

	plugins: [],

	options: {
		selectOptions: false,
		data: [],
		unique: true,
		fxHeight: 300,
		fxWidth: 600,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.element = document.id(el); if (!this.element) return;
		this.setOptions(options);
		this.prefix = this.options.prefix;
		this.elementSize = this.element.getSize();
		
		this.morphFx = {};
		
		this.constructInputArea();
		//this.convertDivToInput();
	},
	
	convertDivToInput: function() {
		this.element.set('text', this.options.data);
	},
	
	constructInputArea: function() {		
		this.element.adopt(
				new Element('div[id="' + this.prefix + '-area"][style="visibility: hidden;"]').adopt(
						new Element('div[class="' + this.prefix + '-btn-add"][text="Add"]'),
						new Element('div[class="' + this.prefix + '-btn-cancel"][text="Cancel"]').removeEvents('click').addEvent('click', function(e){
							this.closeContentArea();
						}.bind(this)),
						new Element('div[class="' + this.prefix + '-lable-div"]').adopt(
								new Element('input[type="text"]')
						),
						new Element('div[class="' + this.prefix + '-completer-div"]').adopt(
								new Element('ul').adopt(
										new Element('li').adopt(
												new Element('input[type="text"][class="visible"]'),
												new Element('span[text="MY SPANNNNN"]')
										)
								)
						),
						new Element('div[id="' + this.prefix + '-options-div"][class="' + this.prefix + '-options-div"]')						
				)
		);
		this.showContentArea();
	},

	showContentArea: function() {
		this.element.removeEvents('click').addEvent('click', function(e){
			if(!Object.getFromPath(this.morphFx, 'element')) {
				this.morphFx = new Fx.Morph(this.element, {
				    onComplete: function(element){
				    	document.id(this.prefix + '-area').setStyle('visibility', 'visible');
				    	this.addInputEvents();
				    	this.element.removeEvents('click');
				    }.bind(this)
				});
			}
			
			this.morphFx.start({
				'height': [this.elementSize.y, this.options.fxHeight],
				'width' : [this.elementSize.x, this.options.fxWidth ]
			}).chain(function(){
				document.id(this.prefix + '-area').fade('in');
			}.bind(this));
		}.bind(this));
	},
	
	closeContentArea: function() {
		document.id(this.prefix + '-area').fade('out');
		
		this.morphFx.start({
			'height': [this.options.fxHeight, (this.elementSize.y - 2)],
			'width' : [this.options.fxWidth , (this.elementSize.x - 2)]
		}).chain(function(){
			this.showContentArea();
		}.bind(this));
		
	},
	
	addInputEvents: function() {
		this.element.getElements('ul li span').highlight();
		this.constructSelectOptionArea();
	}
	
});