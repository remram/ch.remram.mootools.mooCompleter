
var mooCompleterSelectOptions = new Class({
	
	Implements: Options,
	
	options: {
		selectOptions: true,
		data: [],
		unique: true,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.element = document.id(el); if (!this.element) return;
		this.setOptions(options);
		this.prefix  = this.options.prefix;
		this.ul      = {};
	},
	
	constructSelectOptionArea: function() {
		if(!document.id(this.prefix + '-options-div')) return null;
		
		this.optionDiv = document.id(this.prefix + '-options-div');
		
		if(this.isElementEmpty(this.optionDiv)) {
			this.optionDiv.empty().addClass('rounded-corner-5').adopt(
					this.ul = new Element('ul[id="' + this.prefix + '-options-ul" class="' + this.prefix + '-options-ul"]')
			);
			
			Array.each(this.options.data, function(obj, index){
				this.ul.adopt(
						new Element('li' + 
								'[id="' + this.prefix + '-options-li-' + obj.key + '"]' + 
								'[refkey="' + obj.key + '"]' +
								'[refvalue="' + obj.value + '"]' +
								'[class="' + this.prefix + '-options-li rounded-corner-top-5 shadow-border"]').adopt(
										new Element('span[text="' + obj.value + '"]')
						)
				);
			}.bind(this));
			
			this.initPreSelectedItems();
		}	
		
		this.addOptionEvent();
	},
	
	addOptionEvent: function() {
		$$('li.' + this.prefix + '-options-li').each(function(el){
			el.removeEvents('click').addEvent('click', function(e) {
				e.stop();
				this.setSelectedItemBgColor(el);
				this.registerItem(el);
				this.btnAdd();
			}.bind(this));
		}.bind(this));
	},
	
	initPreSelectedItems: function() {
		$$('li.' + this.prefix + '-options-li').each(function(el){
			if(this.IsItemRegistered(el.getProperty('refkey'))) {
				this.setSelectedItemBgColor(el);
			}
		}.bind(this));
	}
});