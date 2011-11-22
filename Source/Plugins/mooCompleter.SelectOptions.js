
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
		this.prefix = this.options.prefix;
		this.ul = {};
		
		this.constructSelectOptionArea();
	},
	
	initDivArea: function() {
		if(document.id(this.prefix + '-options-div')) {
			return document.id(this.prefix + '-options-div');
		} 
		return this.element;
	},
	
	constructSelectOptionArea: function() {
		this.optionDiv = this.initDivArea();
		
		if(document.id(this.prefix + '-options-ul')) {
			this.ul = document.id(this.prefix + '-options-ul');
		} else {
			this.optionDiv.adopt(
					new Element('ul[id="' + this.prefix + '-options-ul" class="' + this.prefix + '-options-ul"]')
			);
			this.ul = document.id(this.prefix + '-options-ul');
		}
		
		
		console.info(this.optionDiv,this.ul);
		console.info('Options: ',this.options.data);
	}
});