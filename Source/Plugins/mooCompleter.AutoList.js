/*
---
description: AutoList, creates an auto completer.

license: MIT-style

authors:
- Ramy Hasan (http://www.solexperts.com)

requires:
- mooCompleter/1.0: '*'

provides: [mooCompleterAutoList]

...
*/

(function(){
	/**
	 * Many thanks to David Walsh for this smart workaround
	 * http://davidwalsh.name/mootools-focus
	 */
	Element.implement({
		setFocus: function(index) {
			if(!this || !typeOf(this).test('element')) return;
			this.setAttribute('tabIndex',index || 0);
			this.focus();
		}
	});
})();

var mooCompleterAutoList = new Class({

	initialize: function(){
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
		if(!document.id(this.elId + '-completer-input-div')) return null;
		
		this.completerDiv = document.id(this.elId + '-completer-input-div');
		
		if(this.isElementEmpty(this.completerDiv,'html')) {
			this.inputElement = new Element('input' + 
					'[id="' + this.elId + '-autocompleter-input"]' + 
					'[type="text"]' + 
					'[title="' + this.options.autoCompleterTextOver + '"]' + 
					'[class="' + this.prefix + '-autocompleter-input"]'
			);
			
			this.completerDiv.empty().addClass('rounded-corner-5').adopt(
					this.inputElement
			);
		}
		this.listCnt = 0;
		//show text over the input field if it is empty!
		this.inputOverText = new OverText(this.inputElement);
		//add completer event to input field
		this.addCompleterEvent();
	},
	
	addCompleterEvent: function() {	
		if(typeOf(this.inputElement).test('element') && !this.isElementEmpty(this.inputElement, 'html')) return;
		//this.createAutoListArea();
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
				//add blur event on input field
				this.switchBlurEventOnAutoCompleterField(true);
				this.createAutoListArea();
				this.filterValue = this.inputElement.getProperty('value');					
				this.createFilteredArray();
				this.inputOverText.hide();
				ulList = this.ulCompleter.getChildren();
			}.bind(this)			
		});
	},
	
	switchBlurEventOnAutoCompleterField: function(boolean) {
		if(boolean) {
			this.inputElement.removeEvents('blur').addEvent('blur', function(e) {
				e.stop();
				this.destroyAutoList();
			}.bind(this));
		} else {
			this.inputElement.removeEvents('blur');
		}
	},
	
	destroyAutoList: function() {		
		if(typeOf(this.inputOverText).test('object')) this.inputOverText.show();
		if(typeOf(this.divAutoList).test('element')) this.divAutoList.fade('out');
	},
	
	heighlightAutoCompleterElement: function(event){
		if(!typeOf(this.ulCompleter).test('element') || this.isElementEmpty(this.ulCompleter, 'html')) return;
		var arrayList  = this.ulCompleter.getChildren();
		var listLength = arrayList.length;
		var hasElement = false;
		//if element exists! remove highlighting class
		if(typeOf(this.selectedElement).test('element') && !this.isElementEmpty(this.selectedElement, 'html')) {
			this.selectedElement.removeClass(this.prefix + '-auto-completer-li-highlight');
		}
		
		if(listLength >= 1) {
			hasElement = true;
		}
				
		switch(event.key) {
			case 'up':
				//remove blur event on input field
				this.switchBlurEventOnAutoCompleterField(false);
				if(hasElement) {					
					if(this.listCnt <= 1) this.listCnt = listLength;
					else --this.listCnt;
					
					this.highlightElement(arrayList);
				}
			break;
			case 'down':
				//remove blur event on input field
				this.switchBlurEventOnAutoCompleterField(false);
				if(hasElement) {
					if(this.listCnt < listLength) ++this.listCnt;
					else this.listCnt = 1;
					
					this.highlightElement(arrayList);
				}
			break;
			case 'enter':
				//add blur event on input field
				this.switchBlurEventOnAutoCompleterField(true);
				document.id(this.elId + '-label-input').focus();
				document.id(this.elId + '-label-input').setFocus();
				this.divAutoList.fade('out');
				
				if(!this.isElementEmpty(this.selectedElement, 'html')) {
					this.registerItem(this.selectedElement);
					if(this.options.selectOptions)
						this.setSelectedItemBgColor(document.id(this.elId + '-options-li-' + this.selectedElement.getProperty('refkey')));
					
					this.btnAdd();
					this.selectedElement.empty().destroy();
				}
				
				//reset input field
				this.inputElement.set('value', '');				
			break;
		}
		
		this.inputElement.setFocus();
	},
	
	highlightElement: function(arrayList) {
		if(this.listCnt >= 0 && arrayList[this.listCnt-1]) {
			//construct highlighted counter id
			var cnt = 0;
			if(this.listCnt > 0) cnt = this.listCnt - 1;
			
			//set selected element
			this.selectedElement = document.id(arrayList[cnt].get('id'));
			
			if(typeOf(this.selectedElement) == 'element') {
				//workaround for ugly and unprofessional browser like ie8 and lower! 
				if(Browser.ie && Browser.version < 9) {
					this.selectedElement.focus();
				}
				this.selectedElement.setFocus(this.selectedElement.getProperty('tabIndex'));
				this.selectedElement.addClass(this.prefix + '-auto-completer-li-highlight');
			}
		}
	},
	
	createFilteredArray: function() {
		this.clonedData = [];
		var maxItemPerPage = this.options.maxItemsPerPage;
		//iterate the hole data array
		for (i=0 ; i < this.options.data.length ; i++) {
			//until reaching the max length of list
			if(i < maxItemPerPage) {
				/**
				 * if search string contains in the array AND 
				 * doesn't contains in the selectedItem array THAN
				 * include new row in clonedData array 
				 */
				if(this.options.data[i].value.test(this.filterValue, 'i') && !this.selectedItems.contains(this.options.data[i].key) ) {
					this.clonedData.include(this.options.data[i]);
				} else {
					//else resize maxItemPerPage 
					maxItemPerPage++;
				}
			} else {
				//else maxItemPerPage is reached than break the loop
				i = this.options.data.length;
			}
		}
		
		this.filteredArray = this.highlightFilteredArray(this.clonedData);
		
		this.cleanCompleterList();
		if(this.filteredArray.length >= 1) {
			this.buildFilteredList();
		}
	},
	
	highlightFilteredArray: function(filteredArray) {
		var highlightedArray = [];
		var i = 0;
		while(i < this.options.maxItemsPerPage) {
			if(i < filteredArray.length) {
				highlightedArray.include([
				                          filteredArray[i].key, filteredArray[i].value, this.highlightString(filteredArray[i].value)
				                          ]);
				i++;
			} else {
				i = this.options.maxItemsPerPage;
			}
		}
		return highlightedArray;
	},
	
	highlightString: function(str) {
		var reg = new RegExp('(' + this.filterValue + ')', 'gi');
		return str.replace(reg,'<b>' + this.filterValue + '</b>');
	},
	
	createAutoListArea: function() {
		//destroy previous element if exists!
		if(typeOf(this.divAutoList).test('element') && !this.isElementEmpty(this.divAutoList, 'html')){
			this.divAutoList.empty().destroy();
		}
		
		this.divAutoList = new Element('div' +
				'[id="' + this.elId + '-auto-completer-list-area"]' + 
				'[class="' + this.prefix + '-auto-completer-list-area rounded-corner-bottom"]'
		).setStyles({
			width      : this.inputElement.getCoordinates().width - 10,
			display : 'none'
		}).inject(this.inputElement, 'after');
	},
	
	buildFilteredList: function() {
		this.ulCompleter = new Element('ul[id="' + this.elId + '-auto-completer-ul"][class="' + this.prefix + '-auto-completer-ul"]');
		this.divAutoList.adopt(
				this.ulCompleter
		);
		
		if(typeOf(this.divAutoList).test('element') && !this.isElementEmpty(this.divAutoList, 'html')) this.divAutoList.setStyle('display', '').fade(.9);
		var maxIterate    = this.options.maxItemsPerPage;
		var filterdLength = this.filteredArray.length;
		if(maxIterate > filterdLength) maxIterate = filterdLength;
		
		for(var i = 0 ; i < maxIterate ; i++) {
			var value = this.filteredArray[i];
			this.ulCompleter.adopt(
					new Element('li' + 
							'[id="' + this.elId + '-auto-completer-li-' + value[0] + '"]' + 
							'[refkey="' + value[0] + '"]' +
							'[refvalue="' + value[1] + '"]' +
							'[class="' + this.prefix + '-auto-completer-li"]' + 
							'[tabindex="' + i + '"]'
							).adopt( new Element('span[html="' + value[2] + '"]')
					)
			);
		}
		
		this.addAutoCompleterEvents();
	},
	
	addAutoCompleterEvents: function() {
		this.inputOverText.show();
		$$('ul#' + this.ulCompleter.get('id') + ' li.' + this.prefix + '-auto-completer-li').each(function(el){
			el.removeEvents().addEvent('click', function(e) {
					e.stop();
					this.registerItem(el);
					if(this.options.selectOptions)
						this.setSelectedItemBgColor(document.id(this.elId + '-options-li-' + el.getProperty('refkey')));
					//empty or reset the auto completer input field
					this.inputElement.set('value','');
					this.btnAdd();
					this.destroyAutoList();
					//add blur event on input field
					this.switchBlurEventOnAutoCompleterField(true);
			}.bind(this));
		}.bind(this));
	},
	
	cleanCompleterList: function() {
		if(typeOf(this.ulCompleter).test('element') && !this.isElementEmpty(this.ulCompleter,'html')) {
			this.ulCompleter.empty().destroy();
		}
	}
});