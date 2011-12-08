
var mooCompleterSelectOptions = new Class({
	initialize: function(){
		this.ul      = {};
	},
	
	constructSelectOptionArea: function() {		
		if(!document.id(this.elId + '-options-div')) return null;
		
		this.optionDiv = document.id(this.elId + '-options-div');
		this.setHeightForSelectOptionArea();
		
		if(this.isElementEmpty(this.optionDiv, 'html')) {
			this.ul = new Element('ul[id="' + this.elId + '-options-ul"][class="' + this.prefix + '-options-ul"]');
			this.optionDiv.empty().addClass('rounded-corner-5 shadow-border').adopt(this.ul);
			
			Array.each(this.options.data, function(obj, index){
				this.ul.adopt(
						new Element('li' + 
								'[id="' + this.elId + '-options-li-' + obj.key + '"]' + 
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
		$$('ul#' + this.ul.get('id') + ' li.' + this.prefix + '-options-li').each(function(el){
			el.removeEvents('click').addEvent('click', function(e) {
				e.stop();
				this.setSelectedItemBgColor(el);
				this.registerItem(el);
				this.btnAdd();
			}.bind(this));
		}.bind(this));
	},
	
	initPreSelectedItems: function() {
		$$('ul#' + this.ul.get('id') + ' li.' + this.prefix + '-options-li').each(function(el){
			if(this.IsItemRegistered(el.getProperty('refkey'))) {
				this.setSelectedItemBgColor(el);
			}
		}.bind(this));
	}
});