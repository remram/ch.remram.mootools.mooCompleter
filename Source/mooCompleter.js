

var mooCompleter = new Class({
	selectedItems: [],
	Implements: [Options, Events, mooCompleterAutoList, mooCompleterSelectOptions],

	plugins: [],

	options: {
		selectOptions: false,
		data: [],
		selectedItems: [],
		lable: '',
		unique: true,
		fxHeight: 300,
		fxWidth: 600,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.setOptions(options);
		this.element       = document.id(el); if (!this.element) return;		
		this.prefix        = this.options.prefix;
		this.elementSize   = this.element.getSize();
		this.selectedItems = this.options.selectedItems || this.selectedItems;
		this.morphFx       = {};
		
		this.constructInputArea();
		//this.convertDivToInput();
	},
	
	convertDivToInput: function() {
		this.element.set('text', this.options.data);
	},
	
	constructInputArea: function() {
		this.element.addClass('rounded-corner').adopt(
				new Element('div[id="' + this.prefix + '-area"][style="visibility: hidden;"]').adopt(
						new Element('div[class="' + this.prefix + '-btn-add rounded-corner-5"][text="Add"]'),
						new Element('div' + 
								'[class="' + this.prefix + '-btn-cancel rounded-corner-5 clearfix"]' + 
								'[text="Cancel"]'
						).removeEvents('click').addEvent('click', function(e){
							e.stop();
							this.closeContentArea();
						}.bind(this)),
						new Element('div[class="' + this.prefix + '-lable-div rounded-corner-5"]').adopt(
								new Element('input' + 
										'[id="' + this.prefix + '-lable-input"]' + 
										'[type="text"]' + 
										'[title="Lable!"]' + 
										'[value="' + this.options.lable + '"]')
						),
						new Element('div' +
								'[id="' + this.prefix + '-completer-div"]' +
								'[class="' + this.prefix + '-completer-div clearfix"]'
						).adopt(
								new Element('ul' + 
										'[id="' + this.prefix + '-completer-ul"]' +
										'[class="' + this.prefix + '-completer-ul"]'
								).adopt(
										new Element('li').adopt(
												new Element('input[type="text"][class="visible"]'),
												new Element('span[text="MY SPANNNNN"]')
										)
								)
						),
						new Element('div[id="' + this.prefix + '-options-div"][class="' + this.prefix + '-options-div"]')						
				)
		);
		
		new OverText(this.prefix + '-lable-input');
		
		this.showContentArea();
	},

	showContentArea: function() {
		this.element.removeEvents('click').addEvent('click', function(e){
			e.stop();
			if(!Object.getFromPath(this.morphFx, 'element')) {
				this.morphFx = new Fx.Morph(this.element, {
				    onComplete: function(element){
				    	document.id(this.prefix + '-area').setStyle('visibility', 'visible');
				    	this.addInputEvents();
				    	this.element.removeEvents('click');
				    	this.constructSelectOptionArea();
				    }.bind(this)
				});
			}
			
			this.morphFx.start({
				'height': [this.elementSize.y, this.options.fxHeight],
				'width' : [this.elementSize.x, this.options.fxWidth ]
			}).chain(function(){
				document.id(this.prefix + '-area').fade('in');
				this.element.addClass('shadow');
			}.bind(this));
		}.bind(this));
	},
	
	closeContentArea: function() {
		document.id(this.prefix + '-area').fade('out');
		
		this.morphFx.start({
			'height': [this.options.fxHeight, (this.elementSize.y - 15)],
			'width' : [this.options.fxWidth , (this.elementSize.x - 15)]
		}).chain(function(){
			this.element.removeClass('shadow');
			this.showContentArea();
		}.bind(this));
		
	},
	
	addInputEvents: function() {
		//this.element.getElements('ul li span').highlight();
		
	},
	
	registerItem: function(el) {
		if(this.IsItemRegistered(el)) {
			this.selectedItems.erase(el.getProperty('key'));
		} else {
			this.selectedItems.include(el.getProperty('key'));
		}
		console.info(this.selectedItems);
	},
	
	IsItemRegistered: function(el) {
		return this.selectedItems.contains(el.getProperty('key'));
	},
	
	isElementEmpty: function(el) {
		if(el.get('text') === '') return true;
		return false;
	}	
});