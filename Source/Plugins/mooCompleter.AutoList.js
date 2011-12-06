(function(){
	Element.implement({
		setFocus: function(index) {
			this.setAttribute('tabIndex',index || 0);
			this.focus();
		}
	});
})();

var mooCompleterAutoList = new Class({
	Implements: Options,
	options: {
		selectOptions: false,
		data: [],
		unique: true,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.setOptions(options);
		this.element        = document.id(el); if (!this.element) return;
		this.prefix         = this.options.prefix;
		this.inputElement   = {};
		this.inputOverText  = {};
		this.clonedData     = [];
		this.filterValue    = '';
		this.filteredArray  = [];
		this.divAutoList    = {};
		this.ulCompleter    = {};
		this.keyboardEvents = {};
		this.selectedElement= {};
		this.listCnt        = 0;
	},
	
	constructCompleterArea: function() {
		if(!document.id(this.prefix + '-completer-input-div')) return null;
		
		this.completerDiv = document.id(this.prefix + '-completer-input-div');
		
		if(this.isElementEmpty(this.completerDiv,'html')) {
			this.completerDiv.empty().addClass('rounded-corner-5').adopt(
					new Element('input' + 
							'[id="' + this.prefix + '-autocompleter-input"]' + 
							'[type="text"]' + 
							'[title="' + this.options.autoCompleterTextOver + '"]' + 
							'[class="' + this.prefix + '-autocompleter-input"]'
					)
			);
		}
		this.listCnt = 0;
		//show text over the input field if it is empty!
		this.inputOverText = new OverText(this.prefix + '-autocompleter-input');
		//add completer event to input field
		this.addCompleterEvent();
	},
	
	addCompleterEvent: function() {
		this.inputElement = document.id(this.prefix + '-autocompleter-input');
		
		this.createAutoListArea();
		var ulList = {};
		
		this.inputElement.removeEvents().addEvents({
			'keyup': function(e) {
				e.stop();
				this.inputOverText.hide();
				if(e.key !== 'up' && e.key !== 'down' && e.key !== 'enter') {
					this.filterValue = this.inputElement.getProperty('value');					
					this.createFilteredArray();
				} else {
					this.heighlightAutoCompleterElement(e);
				}
			}.bind(this),
			
			'click': function(e) {
				e.stop();
				this.filterValue = this.inputElement.getProperty('value');					
				this.createFilteredArray();
				this.inputOverText.hide();
				ulList = this.ulCompleter.getChildren();
			}.bind(this)			
		});
		//add blur event on input field
		this.switchBlurEventOnAutoCompleterField(true);
	},
	
	switchBlurEventOnAutoCompleterField: function(boolean) {
		if(boolean) {
			this.inputElement.removeEvents('blur').addEvent('blur', function(e) {
				e.stop();
				this.inputOverText.show();
				this.divAutoList.fade('out');
			}.bind(this));
		} else {
			this.inputElement.removeEvents('blur');
		}
	},
	
	heighlightAutoCompleterElement: function(event){
		var arrayList  = this.ulCompleter.getChildren();
		var hasElement = false;
		//if element exists! remove highlighting class
		if(typeOf(this.selectedElement) == 'element' ) {
			this.selectedElement.removeClass(this.prefix + '-auto-completer-li-highlight');
			hasElement = true;
		}
		
		switch(event.key) {
			case 'up':
				//remove blur event on input field
				this.switchBlurEventOnAutoCompleterField(false);
				if(hasElement) {					
					if(this.listCnt <= 0) this.listCnt = arrayList.length - 1;
					else --this.listCnt;
					this.highlightElement(arrayList);
				}
			break;
			case 'down':
				//remove blur event on input field
				this.switchBlurEventOnAutoCompleterField(false);
				if(hasElement) {
					if(this.listCnt >= arrayList.length - 1) this.listCnt = 0;
					else ++this.listCnt;
					this.highlightElement(arrayList);
				}
			break;
			case 'enter':
				if(hasElement) {
					console.info('1. hasElement? ', hasElement);
					//add blur event on input field
					this.switchBlurEventOnAutoCompleterField(true);
					document.id(this.prefix + '-label-input').focus();
					document.id(this.prefix + '-label-input').setFocus();
					this.divAutoList.fade('out');
					
					this.registerItem(this.selectedElement);
					if(this.options.selectOptions)
						this.setSelectedItemBgColor(document.id(this.prefix + '-options-li-' + this.selectedElement.getProperty('refkey')));
					
					this.btnAdd();
					this.selectedElement.empty().destroy();
					
					
					
				} else {
					console.info('2. hasElement? ', hasElement);
					this.listCnt = -1;
				}
				
				//reset input field
				this.inputElement.set('value', '');
				//arrayList = this.ulCompleter.getChildren();
				
				/*if(!this.isElementEmpty(this.inputElement, 'value') && 
						!this.isElementEmpty(this.selectedElement, 'html')) {
					this.registerItem(this.selectedElement);
					if(this.options.selectOptions)
						this.setSelectedItemBgColor(document.id(this.prefix + '-options-li-' + this.selectedElement.getProperty('refkey')));
					
					this.btnAdd();
					this.selectedElement.empty().destroy();
				}*/
				
				
				//hasElement = false;
				
			break;
		}
		
		
		this.inputElement.setFocus();
	},
	
	highlightElement: function(arrayList) {
		if(this.listCnt >= 0 && arrayList[this.listCnt]) {
			console.warn('enter IF:');
			this.selectedElement = document.id(arrayList[this.listCnt].get('id'));		
			if(typeOf(this.selectedElement) == 'element') {
				this.selectedElement.setFocus(this.selectedElement.getAttribute('tabIndex'));
				this.selectedElement.addClass(this.prefix + '-auto-completer-li-highlight');
			}
		}
	},
	
	destroyDuplicateEntries: function() {
		var tempArray = [];
		Array.each(this.options.data, function(obj, index){
			if(!this.selectedItems.contains(obj.key)) {
				tempArray.include(obj);
			}
		}.bind(this));
		
		this.clonedData = Array.clone(tempArray);
	},
	
	createFilteredArray: function() {		
		if(this.options.unique) {
			this.destroyDuplicateEntries();
		} else {
			this.clonedData = Array.clone(this.options.data);
		}
		
		this.filteredArray = this.highlightFilteredArray( 
									this.clonedData.filter(
											function(element, index){
												return element.value.test(this.filterValue, 'i');
											}.bind(this)) 
							);
		
		this.cleanCompleterList();
		if(this.filteredArray.length >= 1) {
			this.buildFilteredList();
		}
	},
	
	highlightFilteredArray: function(filteredArray) {
		var highlightedArray = [];
		Array.each(filteredArray, function(obj, index) {
			highlightedArray.include([
			                          obj.key, obj.value, this.highlightString(obj.value)
			                          ]);
		}.bind(this));
		return highlightedArray;
	},
	
	highlightString: function(str) {
		var reg = new RegExp('(' + this.filterValue + ')', 'g');
		return str.replace(reg,'<b>' + this.filterValue + '</b>');
	},
	
	createAutoListArea: function() {
		this.divAutoList = new Element('div' +
				'[id="' + this.prefix + '-auto-completer-list-area"]' + 
				'[class="' + this.prefix + '-auto-completer-list-area rounded-corner-bottom"]'
		).setStyles({
			top        : this.inputElement.getCoordinates().bottom,
			left       : this.inputElement.getCoordinates().left + 2,			
			width      : this.inputElement.getCoordinates().width - 10,
			visibility : 'hidden'
		}).inject(this.inputElement, 'after');
	},
	
	buildFilteredList: function() {

		this.divAutoList.adopt(
				this.ulCompleter = new Element('ul[id="' + this.prefix + '-auto-completer-ul" class="' + this.prefix + '-auto-completer-ul"]')
		).setStyle('visibility', 'visible').fade(.9);
		
		Array.each(this.filteredArray, function(value, index){
			this.ulCompleter.adopt(
					new Element('li' + 
							'[id="' + this.prefix + '-auto-completer-li-' + value[0] + '"]' + 
							'[refkey="' + value[0] + '"]' +
							'[refvalue="' + value[1] + '"]' +
							'[class="' + this.prefix + '-auto-completer-li"]' + 
							'[tabindex="' + index + '"]'
							).adopt( new Element('span[html="' + value[2] + '"]')
					)
			);
		}.bind(this));
		
		this.addAutoCompleterEvents();
	},
	
	addAutoCompleterEvents: function() {
		this.inputOverText.show();
		$$('li.' + this.prefix + '-auto-completer-li').each(function(el){
			el.removeEvents().addEvent('click', function(e) {
					e.stop();					
					this.registerItem(el);
					if(this.options.selectOptions)
						this.setSelectedItemBgColor(document.id(this.prefix + '-options-li-' + el.getProperty('refkey')));
					//empty or reset the auto completer input field
					this.inputElement.set('value','');
					this.btnAdd();
					//add blur event on input field
					this.switchBlurEventOnAutoCompleterField(true);
			}.bind(this));
		}.bind(this));
	},
	
	cleanCompleterList: function() {
		if(this.ulCompleter && !this.isElementEmpty(this.ulCompleter,'html')) {
			this.ulCompleter.empty().destroy();
		}
	}
});