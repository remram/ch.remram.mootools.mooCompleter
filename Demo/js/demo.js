window.addEvent('domready', function() {
	/**
	 * Example 1:
	 * 
	 */
	var mc1 = new mooCompleter('moo-completer-1', {
		selectOptions: true,
		unique: true,
		fxHeight: 400,
		fxWidth: 900,
		overlayLabel: 'Test',
		data: [
		       { key: 'key0' , value: 'value0 value0 value0' },
		       { key: 'key1' , value: 'value1' },
		       { key: 'key2' , value: 'value2' },
		       { key: 'key3' , value: 'value3' },
		       { key: 'key4' , value: 'value4' },
		       { key: 'key5' , value: 'value5' },
		       { key: 'key6' , value: 'value6' },
		       { key: 'key7' , value: 'value7' },
		       { key: 'key8' , value: 'value8' },
		       { key: 'key9' , value: 'value9' },
		       { key: 'key10' , value: 'value10' }
		],
		selectedItems: ['key1','key3'],
		onComplete: function(items, element) {
			new Element('div[style="clear: both;"][html="<b>Selected Array:</b> ' + element.getProperty('id') + ' -> ' + items + '"]').inject(document.id('log-area'));
		},
		onSelect: function(item, element) {
			new Element('div[style="clear: both;"][html="<b>Selected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'));
		},
		onDeSelect: function(item, element) {
			new Element('div[style="clear: both;"][html="<b>DeSelected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'));
		}
	});
	
	var mc2 = new mooCompleter('moo-completer-2', {
		selectOptions: true,
		fxHeight: 300,
		fxWidth: 250,
		overlayLabel: 'Group',
		data: [
		       { key: 'key0' , value: 'value0 value0 value0' },
		       { key: 'key1' , value: 'value1' },
		       { key: 'key2' , value: 'value2' },
		       { key: 'key3' , value: 'value3' },
		       { key: 'key4' , value: 'value4' },
		       { key: 'key5' , value: 'value5' },
		       { key: 'key6' , value: 'value6' },
		       { key: 'key7' , value: 'value7' },
		       { key: 'key8' , value: 'value8' },
		       { key: 'key9' , value: 'value9' },
		       { key: 'key10' , value: 'value10' }
		],
		onComplete: function(items, element) {
			new Element('div[style="clear: both;"][html="<b>Selected Array:</b> ' + element.getProperty('id') + ' -> ' + items + '"]').inject(document.id('log-area'));
		},
		onSelect: function(item, element) {
			new Element('div[style="clear: both;"][html="<b>Selected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'));
		},
		onDeSelect: function(item, element) {
			new Element('div[style="clear: both;"][html="<b>DeSelected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'));
		}
	});
	

	
	var mc3 = new mooCompleter('moo-completer-3', {
		overlayLabel: 'Yeeeeeeeeeea',
		data: [
		       { key: 'key0' , value: 'value0 value0 value0' },
		       { key: 'key1' , value: 'value1' },
		       { key: 'key2' , value: 'value2' },
		       { key: 'key3' , value: 'value3' },
		       { key: 'key4' , value: 'value4' },
		       { key: 'key5' , value: 'value5' },
		       { key: 'key6' , value: 'value6' },
		       { key: 'key7' , value: 'value7' },
		       { key: 'key8' , value: 'value8' },
		       { key: 'key9' , value: 'value9' },
		       { key: 'key10' , value: 'value10' }
		],
		onComplete: function(items, element) {
			new Element('div[style="clear: both;"][html="<b>Selected Array:</b> ' + element.getProperty('id') + ' -> ' + items + '"]').inject(document.id('log-area'));
		},
		onSelect: function(item, element) {
			new Element('div[style="clear: both;"][html="<b>Selected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'));
		},
		onDeSelect: function(item, element) {
			new Element('div[style="clear: both;"][html="<b>DeSelected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'));
		}
	});
});