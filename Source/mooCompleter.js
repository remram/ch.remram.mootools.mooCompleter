/*
---
description: mooCompleter, groups your selected items!

license: MIT-style

authors:
- Ramy Hasan (http://www.solexperts.com)

requires:
- core/1.4: '*'
- more/1.4: 'Object'
- more/1.4: 'Drag.Move'

provides: [mooCompleter, auto complete, select option]

...
*/

var mooCompleterCounter = 1;
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
		maxItemsPerPage       : 10,
		zIndexOn              : 100,
		zIndexOff             : -1,
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
		this.buttonSize                 = this.element.getSize();
		this.selectedItems              = this.options.selectedItems;
		this.selectedItemsInitialLength = this.selectedItems.length;
		this.morphFx                    = {};
		this.status                     = false;
		
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
		
		//create working area
		this.window = new Element('div' +
				'[id="' + this.elId + '-window"]' + 
				'[class="' + this.prefix + '-window rounded-corner-bottom"]' +
				'[style="visibility: hidden; width: ' + this.options.fxWidth + 'px"]'
		).inject(document.body); 
		
		var selectedItemAreaHeight = this.options.selectOptions ? (this.options.fxHeight - 110) / 2 : (this.options.fxHeight - 110);
		
		//clone the element
		this.element.set('text',this.overlayLabel).addClass('mc-content-btn rounded-corner-bottom shadow');
		
		//switch overlay
		this.switchOverlay();
		
		this.window.adopt(
				new Element('div[id="' + this.elId + '-area"][class="' + this.prefix + '-area"][style="width: ' + this.options.fxWidth + 'px"]').adopt(
						new Element('div' + 
								'[id="' + this.elId + '-btn-add"]' +
								'[class="' + this.prefix + '-btn-add rounded-corner-bottom shadow-border"]' +
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
								'[id="' + this.elId + '-header"]' + 
								'[class="' + this.prefix + '-header"]' +
								'[title="Move"]'
						),
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
										'[class="' + this.prefix + '-completer-element-container-div"]' +
										'[style="max-height: ' + selectedItemAreaHeight + 'px;"]'
								)
						)
				)
		);
		
		//add events on element
		this.initElementEvents();
		
		//create select option area if [selectOptions = true]
		this.constructSelectOption();
		
		this.drawSelectedElements(true);
		
		new OverText(this.elId + '-label-input');
		
		this.showContentArea();
		
		//set window centered
		this.setCenter();
	},
	
	setCenter: function() {
		var bodySize = document.body.getSize();
		this.window.setStyles({
			top  : (bodySize.y / 2) - (this.options.fxHeight / 2),
			left : (bodySize.x / 2) - (this.options.fxWidth / 2)
		});
	},
	
	initElementEvents: function() {		
		var header = document.id(this.elId + '-header');		
		new Drag.Move(this.window, {
			handle: document.id(this.elId + '-header')
		});
		
		this.window.removeEvents('mousedown').addEvent('mousedown', function(e) {
			this.window.setStyle('z-index', (this.options.zIndexOn + mooCompleterCounter));
			mooCompleterCounter++;
		}.bind(this));
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
		this.element.removeEvents('click').addEvent('click', function(e){
			e.stop();			
			if(!Object.getFromPath(this.morphFx, 'element')) {
				this.morphFx = new Fx.Morph(this.window, {
					onComplete: function() {
						document.id(this.elId + '-area').setStyle('visibility', 'visible');
				    	this.addInputEvents();
				    	this.element.removeEvents('click');
				    	this.constructCompleterArea();
				    	this.constructSelectOptionArea();
					}.bind(this)
				});
			}
			
			this.morphFx.start({
				'height': [this.buttonSize.y, this.options.fxHeight],
				'width' : [this.buttonSize.x, this.options.fxWidth ]
			}).chain(function(){
				this.status = true;
				this.switchOverlay();
				document.id(this.elId + '-area').fade('in');
				this.window.setStyle('cursor','default').addClass('shadow');				
				this.setLabel();
				//fire open event
				this.fireEvent('open', this.element);
			}.bind(this));
		}.bind(this));
	},
	
	closeContentArea: function() {		
		document.id(this.elId + '-area').fade('out');
		this.morphFx.start({
			'height': [this.options.fxHeight, (this.buttonSize.y - 15)],
			'width' : [this.options.fxWidth , (this.buttonSize.x - 15)]
		}).chain(function(){
			this.status = false;
			this.switchOverlay();
			this.window.setStyle('cursor','pointer').removeClass('shadow');
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
			this.element.set('text', this.overlayLabel);
		} else {
			this.element.empty();
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
			this.window.setStyles({
				visibility: 'visible',
				zIndex: (this.options.zIndexOn + mooCompleterCounter)
			});
			this.element.setStyles({
				visibility:'hidden',
				zIndex: this.options.zIndexOff
			});
		} else {
			this.window.setStyles({
				visibility:'hidden',
				zIndex: this.options.zIndexOff
			});
			this.element.setStyles({
				visibility:'visible',
				zIndex: 1
			});
		}
		mooCompleterCounter++;
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