/*
---
description: SelectOptions, creates a list like an select options.

license: MIT-style

authors:
- Ramy Hasan (http://www.solexperts.com)

requires:
- mooCompleter/1.0: '*'

provides: [mooCompleterSelectOptions]

...
*/

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
			this.pagenationDiv = new Element('div[id="' + this.elId + '-pagenation"][class="' + this.prefix + '-pagenation"]');
			this.pagenationHiddenInput = new Element('input[id="' + this.elId + '-pagenation-input"][type="hidden"][value="1"]');
			this.optionDiv.empty().addClass('rounded-corner-5 shadow-border').adopt(this.ul,this.pagenationDiv);
			
			this.pagenationDiv.inject(this.optionDiv,'after');
			
			//set position for previous and next buttons
			this.repositionPagenationBtn();
			
			this.createPagenationLinks(this.pagenationDiv,this.pagenationHiddenInput, this.countPages());
			
			this.buildList(0,this.options.maxItemsPerPage);
		}
	},
	
	repositionPagenationBtn: function() {
		//set position for previous and next buttons
		this.pagenationDiv.setStyles({
			'top'   : ( this.optionDiv.getCoordinates().bottom - (this.pagenationDiv.getCoordinates().height + 5) ),
			'width' : this.optionDiv.getCoordinates().width
		});
	},
	
	buildList: function(from, to) {
		var start = from || 0;
		var stop  = to   || this.options.maxItemsPerPage;
		
		var dataLength = this.options.data.length;
		if(stop > dataLength) stop = dataLength;
		
		//clean/empty ul list
		this.ul.empty();
		//try to create/build new ul list
		for(var i = start ; i < stop ; i++) {
			var obj = this.options.data[i];
			this.ul.adopt(
					new Element('li' + 
							'[id="' + this.elId + '-options-li-' + obj.key + '"]' + 
							'[refkey="' + obj.key + '"]' +
							'[refvalue="' + obj.value + '"]' +
							'[class="' + this.prefix + '-options-li rounded-corner-top-5 shadow-border"]').adopt(
									new Element('span[html="' + obj.value + '"]')
					)
			);
		}
		this.initPreSelectedItems();
		this.addOptionEvent();
	},
	
	countPages: function(filteredData) {
		var data = filteredData || this.options.data;
		var pages = 1;		
		var dataArrLength = data.length;
		
		if(this.options.maxItemsPerPage > 0) {			
			pages = Math.ceil(dataArrLength / this.options.maxItemsPerPage);
		}
		return [pages,dataArrLength];
	},
	
	createPagenationLinks: function(div, input, cntPages) {
		if(cntPages[0] > 1) {
			div.adopt(
					new Element('div[class="' + this.prefix + '-pagenation-navigation clearfix"]').adopt(
							new Element('div[id="' + this.elId + '-pagenation-previous"][class="' + this.prefix + '-pagenation-previous rounded-corner-bottom-5 shadow"][html="&laquo;&nbsp;Previous"]').
							removeEvents('click').addEvent('click', function(e) {
								e.stop();
								var inputValue = input.get('value').toInt();
								(inputValue <= 1) ? inputValue = 1 : --inputValue;
								input.set('value',inputValue);
								
								var refH = this.getMinMaxPage(inputValue, cntPages[0]);
								
								this.buildList(refH.from,refH.to);
								
							}.bind(this)),
							new Element('div[id="' + this.elId + '-pagenation-next"][class="' + this.prefix + '-pagenation-next rounded-corner-bottom-5 shadow"][html="Next&nbsp;&raquo;"]').
							removeEvents('click').addEvent('click', function(e) {
								e.stop();
								var inputValue = input.get('value').toInt();
								(inputValue >= cntPages[0]) ? inputValue = cntPages[0] : ++inputValue;
								input.set('value',inputValue);
								
								var refH = this.getMinMaxPage(inputValue, cntPages);
								
								this.buildList(refH.from,refH.to);
								
							}.bind(this))
					)
			);
		}
	},
	
	getMinMaxPage: function(inputValue, cntPages) {
		var pages = inputValue * this.options.maxItemsPerPage;
		
		var start = pages - this.options.maxItemsPerPage;
		var stop  = pages;
		
		if(stop >= cntPages[1]) {
			stop = cntPages[1];
		}
		
		var refH = new Hash({
			from : start,
			to   : stop
		});
		
		return refH;
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