
var mooCompleterAutoList = new Class({
	
	options: {
		selectOptions: false,
		data: [],
		unique: true,
		prefix: 'mc-content'
	},

	initialize: function(el,options){
		this.element = document.id(el); if (!this.element) return;
		this.setOptions(options);
		this.prefix = this.options.prefix;
	},
	
	printData: function() {
		console.info('Auto: ',this.options.data);
	}
});