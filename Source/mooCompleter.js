

var mooCompleter = new Class({
	selectedItems: [],
	Implements: [Options, Events, mooCompleterAutoList, mooCompleterSelectOptions],

	plugins: [],

	options: {
		selectOptions: true,
		data: [],
		selectedItems: [],
		overlayLabel: 'Add new item',
		label: '',
		unique: true,
		fxHeight: 300,
		fxWidth: 600,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.setOptions(options);
		this.element        = document.id(el); if (!this.element) return;		
		this.prefix         = this.options.prefix;
		this.elementSize    = this.element.getSize();
		this.selectedItems  = this.options.selectedItems || this.selectedItems;
		this.morphFx        = {};
		this.status         = false;
		this.overlayElement = {};
		this.overlayLabel   = this.options.label || this.options.overlayLabel;
		
		this.constructInputArea();
		//this.convertDivToInput();
	},
	
	convertDivToInput: function() {
		this.element.set('text', this.options.data);
	},
	
	constructInputArea: function() {
		//set some styles
		this.element.setStyle('cursor','pointer').addClass('rounded-corner');
		//clone the element
		this.overlayElement = this.cloneElement(this.element, 'after', '_overlay').set('text',this.overlayLabel).addClass('shadow');
		//switch overlay
		this.switchOverlay();
		
		this.element.adopt(
				new Element('div[id="' + this.prefix + '-area"][style="visibility: hidden;"]').adopt(
						new Element('div' + 
								'[id="' + this.prefix + '-btn-add"]' +
								'[class="' + this.prefix + '-btn-add rounded-corner-5"]' +
								'[text="' + this.btnAdd('get') + '"]'
						),
						new Element('div' + 
								'[class="' + this.prefix + '-btn-cancel rounded-corner-5 clearfix"]' + 
								'[text="Cancel"]'
						).removeEvents('click').addEvent('click', function(e){
							e.stop();
							this.closeContentArea();
						}.bind(this)),
						new Element('div[class="' + this.prefix + '-label-div rounded-corner-5"]').adopt(
								new Element('input' + 
										'[id="' + this.prefix + '-label-input"]' + 
										'[type="text"]' + 
										'[title="Label!"]' + 
										'[maxlength="23"]' +
										'[value="' + this.options.label + '"]')
						),
						new Element('div' +
								'[id="' + this.prefix + '-completer-div"]' +
								'[class="' + this.prefix + '-completer-div clearfix"]'
						)
				)
		);
		
		//create select option area if [selectOptions = true]
		this.constructSelectOption();
		
		new OverText(this.prefix + '-label-input');
		
		this.showContentArea();
	},
	
	constructSelectOption: function() {
		if(this.options.selectOptions) {
			document.id(this.prefix + '-area').adopt(
					new Element('div[id="' + this.prefix + '-options-div"][class="' + this.prefix + '-options-div"]')
			);
		}
	},
	
	btnAdd: function(action) {
		action = action || 'update';
		var btnAdd = 'Add';
		if(this.selectedItems.length >= 1) btnAdd = 'Update';
		if(action === 'get') return btnAdd;
		
		if(document.id(this.prefix + '-btn-add'))
			document.id(this.prefix + '-btn-add').empty().set('text', btnAdd);
	},

	showContentArea: function() {
		this.overlayElement.removeEvents('click').addEvent('click', function(e){
			e.stop();
			if(!Object.getFromPath(this.morphFx, 'element')) {
				this.morphFx = new Fx.Morph(this.element, {
				    onComplete: function(element){
				    	document.id(this.prefix + '-area').setStyle('visibility', 'visible');
				    	this.addInputEvents();
				    	this.overlayElement.removeEvents('click');
				    	this.constructCompleterArea();
				    	this.constructSelectOptionArea();
				    }.bind(this)
				});
			}
			
			this.morphFx.start({
				'height': [this.elementSize.y, this.options.fxHeight],
				'width' : [this.elementSize.x, this.options.fxWidth ]
			}).chain(function(){
				this.status = true;
				this.switchOverlay();
				document.id(this.prefix + '-area').fade('in');
				this.element.setStyle('cursor','default').addClass('shadow');				
				this.setLabel();
			}.bind(this));
		}.bind(this));
	},
	
	closeContentArea: function() {
		document.id(this.prefix + '-area').fade('out');
		
		this.morphFx.start({
			'height': [this.options.fxHeight, (this.elementSize.y - 15)],
			'width' : [this.options.fxWidth , (this.elementSize.x - 15)]
		}).chain(function(){
			this.status = false;
			this.switchOverlay();
			this.element.setStyle('cursor','pointer').removeClass('shadow');
			this.setLabel();
			this.showContentArea();
		}.bind(this));
	},
	
	addInputEvents: function() {
		document.id(this.prefix + '-label-input').removeEvents('keyup').addEvent('keyup', function(e) {
			this.overlayLabel = document.id(this.prefix + '-label-input').get('value') || this.options.overlayLabel;
		}.bind(this));
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
		if(el && el.get('text') === '') return true;
		return false;
	},
	
	setLabel: function() {
		if(this.overlayLabel !== '') {
			this.overlayElement.set('text', this.overlayLabel);
		} else {
			this.overlayElement.empty();
		}
	},
	
	cloneElement: function(original, injection, suffix) {
		injection = injection || 'after';
		suffix    = suffix    || '_cloned';
		
		var element = original.clone()
								  .inject(original, injection)
								  .setProperty('id', original.getProperty('id') + suffix)
								  .addClass(original.getProperty('id') + suffix)
								  .setStyles({
									    top: original.getCoordinates().top,
									    right: original.getCoordinates().right - 15,
										bottom: original.getCoordinates().bottom - 15,
										left: original.getCoordinates().left,			
										width: original.getCoordinates().width - 15,
										height: original.getCoordinates().height - 15
								  });
		return element;
	},
	
	switchOverlay: function() {
		if(this.status) {
			this.element.setStyle('visibility','visible');
			this.overlayElement.setStyle('visibility','hidden');
		} else {
			this.element.setStyle('visibility','hidden');
			this.overlayElement.setStyle('visibility','visible');
		}
	},
	
	setSelectedItemBgColor: function(el) {
		if(el.hasClass('selected')) {
			el.removeClass('selected');
		} else {
			el.addClass('selected');
		}
	}
});