window.addEvent('domready', function() {
	var mc = new mooCompleter('moo-completer', {
		fxHeight: 500,
		fxWidth: 600,
		data: [
		       ['key0', 'value0'],
		       ['key1', 'value1'],
		       ['key2', 'value2'],
		       ['key3', 'value3'],
		       ['key4', 'value4'],
		       ['key5', 'value5'],
		       ['key6', 'value6'],
		       ['key7', 'value7'],
		       ['key8', 'value8'],
		       ['key9', 'value9'],
		       ['key10', 'value10']
		],
		selectedItems: ['key1','key3']
	});
});