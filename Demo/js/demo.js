window.addEvent('domready', function() {
	var mc = new mooCompleter('moo-completer', {
		fxHeight: 500,
		fxWidth: 600,
		data: [
		       { key: 'key0' , value: 'value0' },
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
		selectedItems: ['key1','key3']
	});
});