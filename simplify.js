/*global $, $$, $A, Element, JSON, Persist */

var MAX_WIDTH = 3;

// utility function
function make_clickable(element, click_func) {
	element.addEvent('mouseover', function() { element.addClass('highlight'); });
	element.addEvent('mouseout', function() { element.removeClass('highlight'); });
	element.addEvent('click', function() { click_func(); });
}

var simplify = {
	
	container : null,
	store : null,

	last_category : null,

	categories : [],

	init : function(store) {
		this.container = $('list_container');

		this.store = store;

		 $$('#expanded_details .content').each(function(box) {
			box.setStyle('display', 'none');
		 });

		store.get('things', function(ok, val) {
			if(ok) {
				this.categories = JSON.decode(val) || [];
			} else {
				alert("ERROR");
			}
			this.initialize_events();
			this.initialize_list_display();

			if(this.categories.length === 0) {
				$('empty_explanation').set('text',
					"You don't need as much stuff as you might think. Record your things, and see how low you can get your number.");
			}

		}.bind(this));
	},

	initialize_events : function() {
		var pick_details_box = function(target) {
			$$('#expanded_details .content').each(function(box) {
				if(box.id === target) {
					box.setStyle('display', 'block');
				} else {
					box.setStyle('display', 'none');
				}
			});
		};

		$$('#linkbar a').each(function(link) {
			$(link).addEvent('click', function(e) {
				pick_details_box(link.href.replace(/^.*#/, ''));
				e.stop();
			});
		});
	},

	initialize_list_display : function() {
		this.container.set('text','');

		var btn = this.make_add_category_button();
		this.container.appendChild(btn);
		
		var list_frag = document.createDocumentFragment();

		$A(this.categories).each(function(category) {
			var cat = this.make_category_element(category);

			list_frag.appendChild(cat);

		}.bind(this));
		this.container.appendChild(list_frag);

		this.update_numbers();

		this.resize_categories();
	},

	make_category_element : function(category) {
		var box = new Element('div', { 'class' : 'category_box' });

		category.title = new Element('h5', {'html' : "<span> " + category.name + "</span>"});
		category.title.addClass('category');
		category.title.addClass('add');

		make_clickable(category.title, function(e) { this.start_new_item(category); }.bind(this));

		box.appendChild(category.title);

		var list = new Element('ul');
		$A(category.items).each(function(item) {
			var el = this.make_item_element(item);
			list.appendChild(el);
		}.bind(this));

		category.list = list;
		category.box = box;
		box.appendChild(list);

		return box;
	},

	make_item_element : function(item) {
		item.element = new Element('li', {'text' : item.name});
		make_clickable(item.element, function(e) { this.remove_item(item); }.bind(this));

		return item.element;
	},

	start_new_item : function(parent_category) {
		var li = new Element('li');
		var inp = new Element('input', {
			'class' : 'item_entry',
			'placeholder' : 'What item do you have?' // ah webkit, how I love thee
		});
		inp.addEvent('blur', function(e) {
			if(inp.value === '') {
				inp.parentNode.removeChild(inp);
				if(parent_category.items.length === 0) {
					this.remove_category(parent_category);
				}
			}
		}.bind(this));
		inp.addEvent('keydown', function(e) {
			if(e.key === 'enter') {
				this.add_new_item(inp.value, parent_category);	
				li.parentNode.removeChild(li);
			} else if(e.key === 'esc') {
				li.parentNode.removeChild(li);
			}
		}.bind(this));
		li.appendChild(inp);
		parent_category.list.appendChild(li);
		inp.focus();
	},

	add_new_item : function(item_desc, category) {
		var new_item = {name: item_desc};
		new_item.element = this.make_item_element(new_item);
		category.items.push(new_item);	
		category.list.appendChild(new_item.element);
		this.update_numbers();

		this.save();

		// start another one
		this.start_new_item(category);
	},

	start_new_category : function() {
		var cat = new Element('h5');
		cat.addClass('category');

		var inp = new Element('input', {
			'class' : 'category_entry',
			'placeholder' : 'What kind of items?' // ah webkit, how I love thee
		});
		inp.addEvent('blur', function(e) {
			if(inp.value === '') {
				cat.parentNode.removeChild(cat);
			}
		});
		inp.addEvent('keydown', function(e) {
			if(e.key === 'enter') {
				this.add_new_category(inp.value);	
				cat.parentNode.removeChild(cat);
			} else if(e.key === 'esc') {
				cat.parentNode.removeChild(cat);
			}
		}.bind(this));
		cat.appendChild(inp);
		//cat.inject($('add_category_button'), 'before');
		cat.inject($('add_category_button'), 'after');
		inp.focus();
	},

	add_new_category : function(category_desc) {
		var new_category = {name:  category_desc, items: []};
		new_category.title = this.make_category_element(new_category);
		this.categories.push(new_category);

		this.container.appendChild(new_category.title);
		// a little swaperooo
		//$('add_category_button').inject(this.container);

		this.resize_categories();

		this.save();

		// they probably want to add an item to it
		this.start_new_item(new_category);
	},

	update_numbers : function() {
		this.recount();
		this.renumber();
	},

	remove_item : function(item_to_remove) {
		this.categories.each(function(category) {
			category.items = category.items.filter(function(item) {
				return (item.name !== item_to_remove.name);
			});
			if(category.items.length === 0) {
				this.remove_category(category);
			}
		}.bind(this));
		item_to_remove.element.parentNode.removeChild(item_to_remove.element);
		this.update_numbers();

		this.save();
	},

	remove_category : function(cat_to_remove) {
		this.categories = this.categories.filter(function(cat) {
			return (cat.name !== cat_to_remove.name);
		});
		cat_to_remove.title.parentNode.removeChild(cat_to_remove.title);
		cat_to_remove.list.parentNode.removeChild(cat_to_remove.list);

		if(this.last_category && this.last_category.name === cat_to_remove.name) {
			this.last_category = null;
		}

		this.resize_categories();

		this.save();
	},

	resize_categories : function() {
		var width = Math.max(400, Math.min(100 + this.categories.length * 300, MAX_WIDTH*300+100));
		$(document.body).setStyle('width', width + 'px');

		var columns = Math.max(1, Math.min(MAX_WIDTH, this.categories.length));
		this.categories.each(function(cat) {
			cat.box.setStyle('width', Math.round(100 / columns) + '%');
		});
	},

	recount : function() {
		var all_items = this.get_item_array();
		var total_affected = all_items.length;

		var plural = 'Things';
		if(total_affected === 1) {
			plural = 'Thing';
		}
		var html = '<span>' + total_affected + ' ' + plural + '</span>';
		$$('.thing_count').each(function(el) {
			el.set('html', html);
		});

	},

	renumber : function() {
		var all_items = this.get_item_array();

		all_items.each(function(item, idx) {
			var current_html = item.element.get('html');
			var just_text = current_html.replace(/^<span>.+<\/span>/, '');
			item.element.set('html', just_text);

			/*
			if(idx % 2) {
				item.removeClass('even');
				item.addClass('odd');
			} else {
				item.removeClass('odd');
				item.addClass('even');
			}
			*/

			var new_span = new Element('span', {'text' : (idx + 1) + ' - '});
			new_span.inject(item.element, 'top');
		});

		return all_items.length;
	},

	get_item_array : function() {
		return this.categories.map(function(category) {
			return category.items;
		}).flatten();
	},

	make_add_category_button : function() {
		var btn = new Element('span', {
			'class' : 'addbutton',
			'id' : 'add_category_button',
			'html' : '<span>New Category</span>'
		});
		btn.addClass('add');
		make_clickable(btn, function(e) { this.start_new_category(); }.bind(this));

		return btn;
	},

	// strip the dom elements from our categories data structure and turn it to JSON
	get_json_version : function() {
		var simple_arr = [];
		this.categories.each(function(cat) {
			var simple_items = [];
			cat.items.each(function(item) {
				simple_items.push({name: item.name});
			});

			var category = {
				name: cat.name,
				items: simple_items
			};
			simple_arr.push(category);
		});
		return JSON.encode(simple_arr);
	},

	save : function() {
		var json_list = this.get_json_version();

		try {
		  // check size of data
		  	if (Persist.size !== -1 && Persist.size < json_list.length) {
				throw new Error('Your list is too long for your browser to store.  Try a browser like Chrome or Safari, or download Google Gears.');
			}

		  	// try and save data
		  	this.store.set('things', json_list);
		} catch (err) {
		  	// display save error
			if(err.toString().match(/QUOTA_EXCEEDED_ERR/)) {
		  		alert("There was an error saving your list.  If you have private browsing on, please turn it off and reload the page before continuing.");
			} else {
		  		alert("Couldn't save data: " + err);
			}
		}
	}
};

