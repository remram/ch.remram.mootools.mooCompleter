
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
		this.divAutoList  = {};
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
			this.createAutoListArea(el);
			el.removeEvents(['keyup','click','blur']).addEvents({
				'keyup': function(e) {
					e.stop();
					this.filterValue = el.getProperty('value');					
					this.createFilteredArray();
				}.bind(this),
				
				'click': function(e) {
					e.stop();
					this.filterValue = el.getProperty('value');					
					this.createFilteredArray();
				}.bind(this),
				
				'blur': function(e) {
					e.stop();
					this.divAutoList.fade('out');
				}.bind(this)
			});
		}.bind(this));
	},
	
	createFilteredArray: function() {
		this.filteredArray = this.highlightFilteredArray( this.options.data.filter(this.filterArray, this) );
		
		if(this.filteredArray.length >= 1) {
			this.buildFilteredList();
		} else {
			this.cleanCompleterList();
		}
	},
	
	filterArray: function(element, index, array) {
		return (element[1].test(this.filterValue, 'i'));
	},
	
	highlightFilteredArray: function(filteredArray) {
		var highlightedArray = [];
		Array.each(filteredArray, function(value, index) {
			highlightedArray.include([
			                          value[0], this.highlightString(value[1])
			                          ]);
		}.bind(this));
		return highlightedArray;
	},
	
	highlightString: function(str) {
		var reg = new RegExp('(' + this.filterValue + ')', 'g');
		return str.replace(reg,'<b>' + this.filterValue + '</b>');
	},
	
	createAutoListArea: function(inputElement) {
		this.divAutoList = new Element('div' +
				'[id="' + this.prefix + '-auto-completer-list-area"]' + 
				'[class="' + this.prefix + '-auto-completer-list-area rounded-corner-bottom"]'
		).setStyles({
			top        : inputElement.getCoordinates().bottom,
			left       : inputElement.getCoordinates().left + 2,			
			width      : inputElement.getCoordinates().width - 10,
			visibility : 'hidden'
		}).inject(inputElement, 'after');
	},
	
	buildFilteredList: function() {
		this.cleanCompleterList();

		this.divAutoList.adopt(
				this.ulCompleter = new Element('ul[id="' + this.prefix + '-auto-completer-ul" class="' + this.prefix + '-auto-completer-ul"]')
		).setStyle('visibility', 'visible').fade(.9);

		Array.each(this.filteredArray, function(value, index){
			this.ulCompleter.adopt(
					new Element('li' + 
							'[id="' + this.prefix + '-auto-completer-li-' + value[0] + '"]' + 
							'[key="' + value[0] + '"]' +
							'[class="' + this.prefix + '-auto-completer-li"]').adopt(
									new Element('span[html="' + value[1] + '"]')
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