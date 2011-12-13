/*
---
description: mooCompleter, groups your selected items!

license: MIT-style

authors:
- Ramy Hasan (http://www.solexperts.com)

requires:
- core/1.4: '*'
- more/1.4: 'Object'

provides: [mooCompleter, auto complete, select option]

...
*/

var mooCompleter = new Class({
	Implements: [Options, Events, mooCompleterAutoList, mooCompleterSelectOptions],

	options: {
		selectOptions         : true,
		data                  : [],
		selectedItems         : [],
		buttonLabel           : 'Add new item',
		label                 : '',
		labelFieldTextOver    : 'Label!',
		labelTextMaxLength    : 20,
		autoCompleterTextOver : 'Search here for an item',
		unique                : true,
		fxHeight              : 300,
		fxWidth               : 600,
		prefix                : 'mc-content',
		errors                : {
			duplicateElement  : 'Warning: Declaration for element [{element_id}] was wrong!\n It could have been added a few times!',
			dataArray         : 'Error: You put incorrect format for the data array!'
		}
	},

	initialize: function(el,options){
		this.setOptions(options);
		this.element                    = document.id(el); if (!this.element) return;
		//checks for main element
		if(!this.checkMainElement(this.element)) return;

		this.elId                       = this.element.getProperty('id');
		this.prefix                     = this.options.prefix;
		this.elementSize                = this.element.getSize();
		this.selectedItems              = this.options.selectedItems;
		this.selectedItemsInitialLength = this.selectedItems.length;
		this.morphFx                    = {};
		this.status                     = false;
		this.overlayElement             = {};
		
		if(this.options.label.test(/\w+/)) this.options.buttonLabel = this.options.label;
		this.overlayLabel               = this.options.buttonLabel;
		
		this.cleanLabelInput();
		this.constructInputArea();
	},
	
	checkMainElement: function(element) {
		if(!this.isElementEmpty(element, 'html')) {
			alert( this.options.errors.duplicateElement.substitute({element_id: element.getProperty('id')}) );
			return false;
		}
		return true;
	},
	
	cleanLabelInput: function() {
		if(!typeOf(this.overlayLabel).test('element') || !this.overlayLabel.test(/\w+/)) return;
		this.overlayLabel = this.overlayLabel.clean().stripTags().stripScripts();
		if(this.overlayLabel.length >= this.options.labelTextMaxLength) {
			this.overlayLabel = this.overlayLabel.substr(0,(this.options.labelTextMaxLength-3)) + '...';
		}
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
			this.element.set('text', this.options.errors.dataArray);
			return null;
		}
		//set some styles
		this.element.setStyle('cursor','pointer').addClass('rounded-corner-bottom');
		//clone the element
		this.overlayElement = this.cloneElement(this.element, 'after', '_overlay').set('text',this.overlayLabel).addClass('shadow');
		//switch overlay
		this.switchOverlay();
		
		this.element.adopt(
				new Element('div[id="' + this.elId + '-area"][class="' + this.prefix + '-area"][style="visibility: hidden; width: ' + this.options.fxWidth + 'px"]').adopt(
						new Element('div' + 
								'[id="' + this.elId + '-btn-add"]' +
								'[class="' + this.prefix + '-btn-add rounded-corner-bottom shadow-border clearfix"]' +
								'[text="' + this.btnAdd('get') + '"]'
						).removeEvents('click').addEvent('click', function(e){
							e.stop();
							this.cleanLabelInput();
							//destroy the auto list of auto completer
							this.destroyAutoList();
							//close area and view it as a button
							this.closeContentArea();
							//execute the onComplete event
							this.fireEvent('complete', [this.getItems(), this.element]);
						}.bind(this)),
						new Element('div' + 
								'[id="' + this.elId + '-label-div"]' +
								'[class="' + this.prefix + '-label-div rounded-corner-5 shadow-border clearfix"]').adopt(
								new Element('input' + 
										'[id="' + this.elId + '-label-input"]' + 
										'[type="text"]' + 
										'[title="' + this.options.labelFieldTextOver + '"]' + 
										'[maxlength="' + this.options.labelTextMaxLength + '"]' +
										'[value="' + this.options.label + '"]')
						),
						new Element('div' +
								'[id="' + this.elId + '-completer-div"]' +
								'[class="' + this.prefix + '-completer-div rounded-corner-5 shadow-border clearfix"]'
						).adopt(
								new Element('div'+
										'[id="' + this.elId + '-completer-input-div"]' +
										'[class="' + this.prefix + '-completer-input-div"]'
								),
								new Element('div'+
										'[id="' + this.elId + '-completer-element-container-div"]' +
										'[class="' + this.prefix + '-completer-element-container-div"]'
								)
						)
				)
		);
		
		//create select option area if [selectOptions = true]
		this.constructSelectOption();
		
		this.drawSelectedElements(true);
		
		new OverText(this.elId + '-label-input');
		
		this.showContentArea();
	},
	
	getItems: function() {
		return this.selectedItems;
	},
	
	constructSelectOption: function() {
		if(this.options.selectOptions) {
			document.id(this.elId + '-area').adopt(
					new Element('div[id="' + this.elId + '-options-div"][class="' + this.prefix + '-options-div"]')
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
		
		if(document.id(this.elId + '-btn-add'))
			document.id(this.elId + '-btn-add').empty().set('text', btnAdd);
	},

	showContentArea: function() {
		this.overlayElement.removeEvents('click').addEvent('click', function(e){
			e.stop();			
			if(!Object.getFromPath(this.morphFx, 'element')) {
				this.morphFx = new Fx.Morph(this.element, {
					onComplete: function() {
						document.id(this.elId + '-area').setStyle('visibility', 'visible');
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
				document.id(this.elId + '-area').fade('in');
				this.element.setStyle('cursor','default').addClass('shadow');				
				this.setLabel();
				//fire open event
				this.fireEvent('open', this.element);
			}.bind(this));
		}.bind(this));
	},
	
	closeContentArea: function() {		
		document.id(this.elId + '-area').fade('out');
		this.morphFx.start({
			'height': [this.options.fxHeight, (this.elementSize.y - 15)],
			'width' : [this.options.fxWidth , (this.elementSize.x - 15)]
		}).chain(function(){
			this.status = false;
			this.switchOverlay();
			this.element.setStyle('cursor','pointer').removeClass('shadow');
			this.setLabel();
			this.showContentArea();
			//fire close event
			this.fireEvent('close', this.element);
		}.bind(this));
	},
	
	addInputEvents: function() {
		document.id(this.elId + '-label-input').removeEvents('keyup').addEvent('keyup', function(e) {
			this.overlayLabel = document.id(this.elId + '-label-input').get('value') || this.options.overlayLabel;
		}.bind(this));
	},
	
	registerItem: function(el) {
		if(typeOf(el) != 'element') return null;
		if(this.IsItemRegistered(el.getProperty('refkey'))) {
			this.selectedItems.erase(el.getProperty('refkey'));
			this.destroyItem(el.getProperty('refkey'));
			//fire deselect event
			this.fireEvent('deSelect', [el, this.element]);
		} else {
			this.selectedItems.include(el.getProperty('refkey'));
			this.drawSelectedElements(false,el);
			//fire select event
			this.fireEvent('select', [el, this.element]);
		}
	},
	
	IsItemRegistered: function(key) {
		return this.selectedItems.contains(key);
	},
	
	isElementEmpty: function(el, property) {
		if(typeOf(el).test('element')){
			//workaround for ugly and unprofessional browser like ie8 and lower! 
			if(Browser.ie && Browser.version < 9) {
				if(property == 'html'){
					if(el.innerHTML) return false;
				} else {
					if(el.getAttribute(property).test(/\w+/)) return false;
				}
				return true;
			} 
			
			if(el.getProperty(property).test(/\w+/)) return false;
			return true;
		}
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
								  .addClass(this.prefix + suffix)
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
			this.element.setStyles({
				visibility: 'visible',
				zIndex: 3
			});
			this.overlayElement.setStyles({
				visibility:'hidden',
				zIndex: -1
			});
		} else {
			this.element.setStyles({
				visibility:'hidden',
				zIndex: -1
			});
			this.overlayElement.setStyles({
				visibility:'visible',
				zIndex: 1
			});
		}
	},
	
	setSelectedItemBgColor: function(el) {
		if(typeOf(el) != 'element') return null;
		if(el.hasClass('selected')) {
			el.removeClass('selected');
		} else {
			el.addClass('selected');
		}
	},
	
	contructSelectedListAtInitialization: function() {
		document.id(this.elId + '-completer-element-container-div').empty();
		document.id(this.elId + '-completer-element-container-div').adopt(
				new Element('ul' + 
						'[id="' + this.elId + '-completer-element-container-ul"]' + 
						'[class="' + this.prefix + '-completer-element-container-ul"]')
		);

		Array.each(this.options.data, function(obj, index){
			if(this.selectedItems.contains(obj.key)) {
				this.drawElement(obj);
			}
		}.bind(this));		
	},
	
	completeSelectedList: function(el) {
		if(typeOf(el) != 'element') return null;
		this.drawElement({key: el.getProperty('refkey'), value: el.getProperty('refvalue')});
	},
	
	drawElement: function(obj, initial){
		var borderStyle = 'border: 0;';
		//for IE-Browsers 8 and lower
		if(Browser.ie && Browser.version <= 8) {
			var borderStyle = 'border: 1px solid #999;';
		}
		
		document.id(this.elId + '-completer-element-container-ul').adopt(
				new Element('li' +
						'[id="' + this.elId + '-completer-element-container-li-' + obj.key + '"]' + 
						'[class="' + this.prefix + '-completer-element-container-li"]' + 
						'[style="' + borderStyle + '"]'
				).adopt(
						new Element('div[class="rounded-corner-5 shadow"]').adopt(
								new Element('div' +
										'[class="' + this.prefix + '-btn-close"]' + 
										'[text="x"]' +
										'[refkey="' + obj.key + '"]' +
										'[refvalue="' + obj.value + '"]'
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
		$$('ul#' + this.elId + '-completer-element-container-ul  div.' + this.prefix + '-btn-close').each(function(el) {
			el.removeEvents('click').addEvent('click', function(e) {
				e.stop();
				var element = new Element('li' +
						'[id="' + this.elId + '-options-li-' + el.getProperty('refkey') +'"]' +
						'[style="display: none;"]' +
						'[text="' + el.getProperty('refvalue') + '"]' +
						'[refkey="' + el.getProperty('refkey') + '"]'
				);
				
				//try to destroy the highlight of an item in the select option area
				if(this.options.selectOptions && document.id(this.elId + '-options-li-' + el.getProperty('refkey'))) {
					this.setSelectedItemBgColor(document.id(this.elId + '-options-li-' + el.getProperty('refkey')));
					element = document.id(this.elId + '-options-li-' + el.getProperty('refkey'));
				}
					
				//register an item
				this.registerItem(element);
			}.bind(this));
		}.bind(this));
	},
	
	destroyItem: function(key) {
		if(document.id(this.elId + '-completer-element-container-li-' + key)) {
			document.id(this.elId + '-completer-element-container-li-' + key).empty().destroy();
			this.setHeightForSelectOptionArea();
			this.btnAdd();
		}
	},
	
	setHeightForSelectOptionArea: function() {
		if(this.options.selectOptions) {
			var getHeight = this.options.fxHeight - 
			(document.id(this.elId + '-btn-add').getStyle('height').toInt() +
			document.id(this.elId + '-label-div').getStyle('height').toInt() +
			document.id(this.elId + '-completer-div').getStyle('height').toInt() + 70);

			document.id(this.elId + '-options-div').setStyle('height', getHeight);
		}
	}
});