
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
		this.filterValue    = '';
		this.filteredArray  = [];
		this.divAutoList    = {};
		this.ulCompleter    = {};
		this.keyboardEvents = {};
	},
	
	constructCompleterArea: function() {
		if(!document.id(this.prefix + '-completer-input-div')) return null;
		
		this.completerDiv = document.id(this.prefix + '-completer-input-div');
		
		if(this.isElementEmpty(this.completerDiv)) {
			this.completerDiv.empty().addClass('rounded-corner-5').adopt(
					new Element('input' + 
							'[id="' + this.prefix + '-autocompleter-input"]' + 
							'[type="text"]' + 
							'[title="Search here for an item"]' + 
							'[class="' + this.prefix + '-autocompleter-input"]'
					)
			);
		}
		//show text over the input field if it is empty!
		new OverText(this.prefix + '-autocompleter-input');
		//add completer event to input field
		this.addCompleterEvent();
	},
	
	addCompleterEvent: function() {
		var el = document.id(this.prefix + '-autocompleter-input');
		this.createAutoListArea();
		el.removeEvents(['keyup','click','blur']).addEvents({
			'keyup': function(e) {
				e.stop();					
				if(e.key !== 'up' && e.key !== 'down') {
					this.filterValue = el.getProperty('value');					
					this.createFilteredArray();
				}					
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
	},
	
	createFilteredArray: function() {
		this.filteredArray = this.highlightFilteredArray( 
									this.options.data.filter(
											function(element, index){
												return element.value.test(this.filterValue, 'i');
											}.bind(this)
									) 
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
		var inputElement = document.id(this.prefix + '-autocompleter-input');
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

		this.divAutoList.adopt(
				this.ulCompleter = new Element('ul[id="' + this.prefix + '-auto-completer-ul" class="' + this.prefix + '-auto-completer-ul"]')
		).setStyle('visibility', 'visible').fade(.9);
		
		Array.each(this.filteredArray, function(value, index){
			this.ulCompleter.adopt(
					new Element('li' + 
							'[id="' + this.prefix + '-auto-completer-li-' + value[0] + '"]' + 
							'[refkey="' + value[0] + '"]' +
							'[refvalue="' + value[1] + '"]' +
							'[class="' + this.prefix + '-auto-completer-li"]').adopt(
									new Element('span[html="' + value[2] + '"]')
					)
			);
		}.bind(this));
		
		this.addKeyboardEvents();
	},
	
	addKeyboardEvents: function() {
		$$('li.' + this.prefix + '-auto-completer-li').each(function(el){
			el.removeEvents(['keyup','click']).addEvents({
				'keyup': function(e) {
					e.stop();				
					if(e.key === 'up') {
						console.info('UP: ' + el.getProperty('text'));
					} else if(e.key === 'down'){
						console.info('DOWN: ' + el.getProperty('text'));
					}
				}.bind(this),
				
				'click': function(e) {
					e.stop();
					this.registerItem(el);
					//empty or reset the auto completer input field
					document.id(this.prefix + '-autocompleter-input').set('value','');
				}.bind(this)
			});
		}.bind(this));
	},
	
	/*itemHover: function(select) {
		var current = this.ulCompleter.getElement('li.'+this.prefix + '-auto-completer-li');

		switch (select) {
			case 'down':
				if (current && (sibling = current.getNext())) el.getProperty('text');
				else this.itemHover(this.ulCompleter, 'last');
				break;
 			case 'up':
				if (current && (sibling = current.getPrevious())) el.getProperty('text');
				else this.itemHover(this.ulCompleter, 'first');
				break;
			case 'none':
				//this.ulCompleter.getElements('li.'+this.prefix + '-auto-completer-li').removeClass(this.options.itemHoverClass);
				break;
			case 'first':
				var sibling = this.ulCompleter.getFirst();
				break;
			case 'last':
				var sibling = this.ulCompleter.getLast();
				break;
			default:
				//if (current) current.removeClass(this.options.itemHoverClass);
				var sibling = select;
				break;
		}

		if (sibling) 
			sibling.focus();
	},*/
	
	cleanCompleterList: function() {
		if(this.ulCompleter && !this.isElementEmpty(this.ulCompleter)) {
			this.ulCompleter.empty().destroy();
		}
	}
});