

var mooCompleter = new Class({
	Implements: [Options, Events, mooCompleterAutoList, mooCompleterSelectOptions],

	options: {
		selectOptions: true,
		data: [],
		selectedItems: [],
		overlayLabel: 'Add new item',
		label: '',
		labelFieldTextOver: 'Label!',
		autoCompleterTextOver: 'Search here for an item',
		unique: true,
		fxHeight: 300,
		fxWidth: 600,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.setOptions(options);
		this.element                    = document.id(el); if (!this.element) return;		
		this.prefix                     = this.options.prefix;
		this.elementSize                = this.element.getSize();
		this.selectedItems              = this.options.selectedItems;
		this.selectedItemsInitialLength = this.selectedItems.length;
		this.morphFx                    = {};
		this.status                     = false;
		this.overlayElement             = {};
		this.overlayLabel               = this.options.label || this.options.overlayLabel;
		
		this.constructInputArea();
	},
	
	checkDataArray: function() {
		var boolean = true;
		Array.each(this.options.data, function(value, index){
			if(Object.getLength(value) != 2) {
				boolean = false;
			}
		});
		return boolean;
	},
	
	constructInputArea: function() {
		if(!this.checkDataArray()) {
			this.element.set('text', 'Error: You put incorrect format for the data array!');
			return null;
		}
		//set some styles
		this.element.setStyle('cursor','pointer').addClass('rounded-corner-bottom');
		//clone the element
		this.overlayElement = this.cloneElement(this.element, 'after', '_overlay').set('text',this.overlayLabel).addClass('shadow');
		//switch overlay
		this.switchOverlay();
		
		this.element.adopt(
				new Element('div[id="' + this.prefix + '-area"][style="visibility: hidden;"]').adopt(
						new Element('div' + 
								'[id="' + this.prefix + '-btn-add"]' +
								'[class="' + this.prefix + '-btn-add rounded-corner-bottom"]' +
								'[text="' + this.btnAdd('get') + '"]'
						).removeEvents('click').addEvent('click', function(e){
							e.stop();
							this.closeContentArea();
							this.fireEvent('complete', [this.getItems(), this.element]);
						}.bind(this)),
						new Element('div' + 
								'[class="' + this.prefix + '-btn-cancel rounded-corner-bottom clearfix"]' + 
								'[text="Cancel"]'
						).removeEvents('click').addEvent('click', function(e){
							e.stop();
							this.closeContentArea();
						}.bind(this)),
						new Element('div' + 
								'[id="' + this.prefix + '-label-div"]' +
								'[class="' + this.prefix + '-label-div rounded-corner-5 shadow-border"]').adopt(
								new Element('input' + 
										'[id="' + this.prefix + '-label-input"]' + 
										'[type="text"]' + 
										'[title="' + this.options.labelFieldTextOver + '"]' + 
										'[maxlength="23"]' +
										'[value="' + this.options.label + '"]')
						),
						new Element('div' +
								'[id="' + this.prefix + '-completer-div"]' +
								'[class="' + this.prefix + '-completer-div rounded-corner-5 shadow-border clearfix"]'
						).adopt(
								new Element('div'+
										'[id="' + this.prefix + '-completer-input-div"]' +
										'[class="' + this.prefix + '-completer-input-div"]'
								),
								new Element('div'+
										'[id="' + this.prefix + '-completer-element-container-div"]' +
										'[class="' + this.prefix + '-completer-element-container-div"]'
								)
						)
				)
		);
		
		//create select option area if [selectOptions = true]
		this.constructSelectOption();
		
		this.drawSelectedElements(true);
		
		new OverText(this.prefix + '-label-input');
		
		this.showContentArea();
	},
	
	getItems: function() {
		return this.selectedItems;
	},
	
	constructSelectOption: function() {
		if(this.options.selectOptions) {
			document.id(this.prefix + '-area').adopt(
					new Element('div[id="' + this.prefix + '-options-div"][class="' + this.prefix + '-options-div"]')
			);
		}
	},
	
	drawSelectedElements: function(initialization,el) {
		if(initialization) {
			this.contructSelectedListAtInitialization();
		} else {
			this.completeSelectedList(el);
		}
	},
	
	btnAdd: function(action) {
		action = action || 'update';
		var btnAdd = 'Add';
		if(this.selectedItemsInitialLength >= 1) btnAdd = 'Update';
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
	},
	
	registerItem: function(el) {
		if(this.IsItemRegistered(el.getProperty('refkey'))) {
			this.selectedItems.erase(el.getProperty('refkey'));
			this.destroyItem(el.getProperty('refkey'));
		} else {
			this.selectedItems.include(el.getProperty('refkey'));
			this.drawSelectedElements(false,el);
			//this.decorateLists();
		}	
	},
	
	IsItemRegistered: function(key) {
		return this.selectedItems.contains(key);
	},
	
	isElementEmpty: function(el) {
		if(typeOf(el) == 'element' && el.getProperty('text') == '') return true;
		return false;
	},
	
	decorateLists: function() {
		
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
	},
	
	contructSelectedListAtInitialization: function() {
		document.id(this.prefix + '-completer-element-container-div').empty();
		document.id(this.prefix + '-completer-element-container-div').adopt(
				new Element('ul' + 
						'[id="' + this.prefix + '-completer-element-container-ul"]' + 
						'[class="' + this.prefix + '-completer-element-container-ul"]')
		);
		Array.each(this.options.data, function(obj, index){
			if(this.selectedItems.contains(obj.key)) {
				this.drawElement(obj);
			}
		}.bind(this));		
	},
	
	completeSelectedList: function(el) {
		this.drawElement({key: el.getProperty('refkey'), value: el.getProperty('refvalue')});
	},
	
	drawElement: function(obj, initial){
		var borderStyle = 'border: 0;';
		//for IE-Browsers 8 and lower
		if(Browser.ie && Browser.version <= 8) {
			var borderStyle = 'border: 1px solid #999;';
		}
		
		document.id(this.prefix + '-completer-element-container-ul').adopt(
				new Element('li' +
						'[id="' + this.prefix + '-completer-element-container-li-' + obj.key + '"]' + 
						'[class="' + this.prefix + '-completer-element-container-li"]' + 
						'[style="' + borderStyle + '"]'
				).adopt(
						new Element('div[class="rounded-corner-5 shadow"]').adopt(
								new Element('div' +
										'[refkey=' + obj.key + ']' +
										'[class="' + this.prefix + '-btn-close"]' + 
										'[text="x"]'
								),
								new Element('div' +
										'[class="' + this.prefix + '-selected-element-value"]' + 
										'[key="' + obj.key + '"]' +
										'[text="' + obj.value + '"]'
								)
						)
				)
		);
		
		this.initDestroyItemEvent();
		this.constructCompleterArea();
		this.setHeightForSelectOptionArea();
	},
	
	initDestroyItemEvent: function() {
		$$('div.' + this.prefix + '-btn-close').each(function(el) {
			el.removeEvents('click').addEvent('click', function(e) {
				e.stop();
				//try to destroy the highlight of an item in the select option area
				if(this.options.selectOptions && document.id(this.prefix + '-options-li-' + el.getProperty('refkey')))
					this.setSelectedItemBgColor(document.id(this.prefix + '-options-li-' + el.getProperty('refkey')));
				//register an item
				this.registerItem(el);
			}.bind(this));
		}.bind(this));
	},
	
	destroyItem: function(key) {
		if(document.id(this.prefix + '-completer-element-container-li-' + key)) {
			document.id(this.prefix + '-completer-element-container-li-' + key).empty().destroy();
			this.setHeightForSelectOptionArea();
			this.btnAdd();
		}
	},
	
	setHeightForSelectOptionArea: function() {
		if(this.options.selectOptions) {
			var getHeight = this.options.fxHeight - 
			(document.id(this.prefix + '-btn-add').getStyle('height').toInt() +
			document.id(this.prefix + '-label-div').getStyle('height').toInt() +
			document.id(this.prefix + '-completer-div').getStyle('height').toInt() + 70);

			document.id(this.prefix + '-options-div').setStyle('height', getHeight);
		}
	}
});