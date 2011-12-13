mooCompleter
============

This class integrates both AutoCompleter function and select option list. The selected elements are grouped. Take a look and have fun.

![Screenshot](http://www.baghdad.ch/images/mootools/moocompleter/mc00.png)


Options
-------

	options: {
		selectOptions         : true,
		data                  : [],
		selectedItems         : [],
		buttonLabel           : 'Add new item',
		label                 : '',
		labelFieldTextOver    : 'Label!',
		labelTextMaxLength    : 20,
		autoCompleterTextOver : 'Search here for an item',
		unique                : true,
		fxHeight              : 300,
		fxWidth               : 600,
		prefix                : 'mc-content',
		errors                : {
			duplicateElement  : 'Warning: Declaration for element [{element_id}] was wrong!\n It could have been added a few times!',
			dataArray         : 'Error: You put incorrect format for the data array!'
		}
	}
	
Events
------

- onOpen
- onClose
- onSelect
- onDeSelect
- onComplete

Demo
----

[http://jsfiddle.net/remram/HrbeW/](http://jsfiddle.net/remram/HrbeW/)


Screenshots
-----------

![Screenshot 1](http://www.baghdad.ch/images/mootools/moocompleter/mc01.png)
![Screenshot 2](http://www.baghdad.ch/images/mootools/moocompleter/mc02.png)
![Screenshot 3](http://www.baghdad.ch/images/mootools/moocompleter/mc03.png)


How to Use
----------

Import the plugin

    <script type="text/javascript" src="{yourSourcePath}/Plugins/mooCompleter.AutoList.js"></script>
    <script type="text/javascript" src="{yourSourcePath}/Plugins/mooCompleter.SelectOptions.js"></script>
    <script type="text/javascript" src="{yourSourcePath}/mooCompleter.js"></script>
    
Import css file

	<link rel="stylesheet" type="text/css" href="{yourSourcePath}/mooCompleter.css" />
    
Insert empty `div` in the html

	<!-- 1. example -->
    <div id="moo-completer-1" class="mc-content"></div>
    <!-- 2. example -->
	<div id="moo-completer-2" class="mc-content"></div>
	<!-- 3. example -->
	<div id="moo-completer-3" class="mc-content"></div>
	<!-- 4. example -->
	<div id="moo-completer-4" class="mc-content"></div>
	<!-- follow the log -->
	<div id="log-area"></div>
    

Run the plugin

	window.addEvent('domready', function() {
		
		//Example 1
		var mc1 = new mooCompleter('moo-completer-1', {
			selectOptions: true,
			unique: true,
			fxHeight: 400,
			fxWidth: 900,
			buttonLabel: 'Test',
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
				new Element('div[style="clear: both;"][html="<b>Selected Array:</b> ' + element.getProperty('id') + ' -> ' + items + '"]').inject(document.id('log-area'), 'top');
			},
			onSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>Selected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			},
			onDeSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>DeSelected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			}
		});
	
		//Example 2 
		var mc2 = new mooCompleter('moo-completer-2', {
			selectOptions: true,
			fxHeight: 300,
			fxWidth: 250,
			buttonLabel: 'Group',
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
				new Element('div[style="clear: both;"][html="<b>Selected Array:</b> ' + element.getProperty('id') + ' -> ' + items + '"]').inject(document.id('log-area'), 'top');
			},
			onSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>Selected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			},
			onDeSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>DeSelected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			}
		});
		
		//Example 3 
		var mc3 = new mooCompleter('moo-completer-3', {
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
				new Element('div[style="clear: both;"][html="<b>Selected Array:</b> ' + element.getProperty('id') + ' -> ' + items + '"]').inject(document.id('log-area'), 'top');
			},
			onSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>Selected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			},
			onDeSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>DeSelected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			}
		});
		
		//Example 4 
		var mc4 = new mooCompleter('moo-completer-4', {
			selectOptions         : false,
			label                 : 'MY LABEL',
			labelFieldTextOver    : 'Type something',
			labelTextMaxLength    : 10,
			autoCompleterTextOver : 'Loooooooooooook for an item',
			unique                : false,
			fxHeight              : 250,
			fxWidth               : 300,
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
				new Element('div[style="clear: both;"][html="<b>Selected Array:</b> ' + element.getProperty('id') + ' -> ' + items + '"]').inject(document.id('log-area'), 'top');
			},
			onSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>Selected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			},
			onDeSelect: function(item, element) {
				new Element('div[style="clear: both;"][html="<b>DeSelected Item:</b> ' + element.getProperty('id') + ' -> ' + item.get('text') + '"]').inject(document.id('log-area'), 'top');
			},
			onOpen: function(element) {
				new Element('div[style="clear: both;"][html="<b>Open Area:</b> ' + element.getProperty('id') + ' -> open it!"]').inject(document.id('log-area'), 'top');
			},
			onClose: function(element) {
				new Element('div[style="clear: both;"][html="<b>Close Area:</b> ' + element.getProperty('id') + ' -> close it!"]').inject(document.id('log-area'), 'top');
			}
		});
	});
