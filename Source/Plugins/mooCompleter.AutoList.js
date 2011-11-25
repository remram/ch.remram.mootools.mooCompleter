
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
		this.element       = document.id(el); if (!this.element) return;
		this.prefix        = this.options.prefix;
		this.filterValue   = '';
		this.filteredArray = [];
		this.divCompleter  = {};
		this.ulCompleter   = {};
	},
	
	constructCompleterArea: function() {
		if(!document.id(this.prefix + '-completer-div')) return null;
		
		this.completerDiv = document.id(this.prefix + '-completer-div');
		
		if(this.isElementEmpty(this.completerDiv)) {
			this.completerDiv.empty().addClass('rounded-corner-5').adopt(
					new Element('ul' + 
							'[id="' + this.prefix + '-completer-ul"]' +
							'[class="' + this.prefix + '-completer-ul"]'
					).adopt(
							new Element('li').adopt(
									new Element('input' + 
											'[type="text"]' + 
											'[class="autocompleter visible"]')/*,
									new Element('span[text="MY SPANNNNN"]')*/
							)
					)
			);
		}
		
		this.addCompleterEvent();
	},
	
	addCompleterEvent: function() {
		$$('input.autocompleter').each(function(el){
			el.removeEvents('keyup').addEvent('keyup', function(e) {
				e.stop();
				this.filterValue = el.getProperty('value');
				this.createFilteredArray();
				//this.btnAdd();
				console.info(this.filteredArray);
				/*this.setItemBackground(el);
				this.registerItem(el);
				*/
			}.bind(this));
		}.bind(this));
	},
	
	createFilteredArray: function(searchKey) {
		this.filteredArray = this.options.data.filter(this.filterArray, this);
		
		if(this.filteredArray.length >= 1) {
			this.buildFilteredList();
		} else {
			this.cleanCompleterList();
		}
	},
	
	filterArray: function(element, index, array) {
		return (element[1].test(this.filterValue, 'i'));
	},
	
	buildFilteredList: function() {
		this.cleanCompleterList();
		
		this.completerDiv.adopt(
				this.ulCompleter = new Element('ul[id="' + this.prefix + '-auto-completer-ul" class="' + this.prefix + '-auto-completer-ul"]')
		);

		Array.each(this.filteredArray, function(value, index){
			this.ulCompleter.adopt(
					new Element('li' + 
							'[id="' + this.prefix + '-auto-completer-li-' + value[0] + '"]' + 
							'[key="' + value[0] + '"]' +
							'[class="' + this.prefix + '-auto-completer-li rounded-corner-top-3 shadow-border"]').adopt(
									new Element('span[text="' + value[1] + '"]')
					)
			);
		}.bind(this));
	},
	
	cleanCompleterList: function() {
		if(this.ulCompleter && !this.isElementEmpty(this.ulCompleter)) {
			this.ulCompleter.empty().destroy();
		}
	}
});