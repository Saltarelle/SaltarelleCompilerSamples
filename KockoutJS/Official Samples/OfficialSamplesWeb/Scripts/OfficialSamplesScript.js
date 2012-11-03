////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.AnimatedTransitions.AnimatedTransitionsViewModel
var $OfficialSamplesScript_AnimatedTransitions_AnimatedTransitionsViewModel = function() {
	this.planets = null;
	this.typeToShow = null;
	this.displayAdvancedOptions = null;
	this.addPlanet = null;
	this.planetsToShow = null;
	this.showPlanetElement = null;
	this.hidePlanetElement = null;
	var self = this;
	this.planets = ko.observableArray([new $OfficialSamplesScript_AnimatedTransitions_Planet('Mercury', 'rock'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Venus', 'rock'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Earth', 'rock'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Mars', 'rock'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Jupiter', 'gasgiant'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Saturn', 'gasgiant'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Uranus', 'gasgiant'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Neptune', 'gasgiant'), new $OfficialSamplesScript_AnimatedTransitions_Planet('Pluto', 'rock')]);
	this.typeToShow = ko.observable('all');
	this.displayAdvancedOptions = ko.observable(false);
	this.addPlanet = function(type) {
		self.planets.push(new $OfficialSamplesScript_AnimatedTransitions_Planet('New planet', type));
	};
	this.planetsToShow = ko.computed(function() {
		// Represents a filtered list of planets
		// i.e., only those matching the "typeToShow" condition
		var desiredType = self.typeToShow();
		if (desiredType === 'all') {
			return self.planets();
		}
		return ko.utils.arrayFilter(self.planets(), function(planet) {
			return ss.referenceEquals(planet.type, desiredType);
		});
	});
	// Animation callbacks for the planets list
	this.showPlanetElement = function(elem) {
		if (elem.nodeType === 1) {
			$(elem).hide().slideDown();
		}
	};
	this.hidePlanetElement = function(elem1) {
		if (elem1.nodeType === 1) {
			$(elem1).slideUp('slow', function() {
				$(elem1).remove();
			});
		}
	};
	// Here's a custom Knockout binding that makes elements 
	// shown/hidden via jQuery's fadeIn()/fadeOut() methods
	//Could be stored in a separate utility library
	ko.bindingHandlers['fadeVisible'] = {
		init: function(element, valueAccessor, allBindingsAccessor, model) {
			// Initially set the element to be instantly visible/hidden
			// depending on the value
			var value = valueAccessor();
			// Use "unwrapObservable" so we can handle values that may 
			// or may not be observable
			$(element).toggle(ko.utils.unwrapObservable(value));
		},
		update: function(element1, valueAccessor1, allBindingsAccessor1, model1) {
			// Whenever the value subsequently changes, slowly fade the
			// element in or out
			var value1 = valueAccessor1();
			if (ko.utils.unwrapObservable(value1)) {
				$(element1).fadeIn();
			}
			else {
				$(element1).fadeOut();
			}
		}
	};
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.AnimatedTransitions.Planet
var $OfficialSamplesScript_AnimatedTransitions_Planet = function(name, type) {
	this.name = null;
	this.type = null;
	this.name = name;
	this.type = type;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.BetterList.BetterListViewModel
var $OfficialSamplesScript_BetterList_BetterListViewModel = function() {
	this.itemToAdd = null;
	this.allItems = null;
	this.selectedItems = null;
	this.addItem = null;
	this.removeSelected = null;
	this.sortItems = null;
	var self = this;
	this.itemToAdd = ko.observable('');
	// Initial items
	this.allItems = ko.observableArray(['Fries', 'Eggs Benedict', 'Ham', 'Cheese']);
	// Initial selection
	this.selectedItems = ko.observableArray(['Ham']);
	this.addItem = function() {
		// Prevent blanks and duplicates
		if (self.itemToAdd() !== '' && self.allItems.indexOf(self.itemToAdd()) < 0) {
			self.allItems.push(self.itemToAdd());
			// Clear the text box
			self.itemToAdd('');
		}
	};
	this.removeSelected = function() {
		self.allItems.removeAll(self.selectedItems());
		// Clear selection
		self.selectedItems([]);
	};
	this.sortItems = function() {
		self.allItems.sort();
	};
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.ClickCounter.ClickCounterViewModel
var $OfficialSamplesScript_ClickCounter_ClickCounterViewModel = function() {
	this.numberOfClicks = null;
	this.registerClick = null;
	this.resetClicks = null;
	this.hasClickedTooManyTimes = null;
	var self = this;
	this.numberOfClicks = ko.observable(0);
	this.registerClick = function() {
		self.numberOfClicks(self.numberOfClicks() + 1);
	};
	this.resetClicks = function() {
		self.numberOfClicks(0);
	};
	this.hasClickedTooManyTimes = ko.computed(function() {
		return self.numberOfClicks() >= 3;
	});
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Contacts.Contact
var $OfficialSamplesScript_Contacts_Contact = function(firstName, lastName, phones) {
	this.firstName = null;
	this.lastName = null;
	this.phones = null;
	this.firstName = firstName;
	this.lastName = lastName;
	this.phones = phones;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Contacts.ContactsViewModel
var $OfficialSamplesScript_Contacts_ContactsViewModel = function(contacts) {
	this.contacts = null;
	this.addContact = null;
	this.removeContact = null;
	this.addPhone = null;
	this.removePhone = null;
	this.save = null;
	this.lastSavedJson = null;
	var self = this;
	self.contacts = ko.observableArray(ko.utils.arrayMap(contacts, function(contact) {
		return new $OfficialSamplesScript_Contacts_Contact(contact.firstName, contact.lastName, ko.observableArray(contact.phones()));
	}));
	self.addContact = function() {
		self.contacts.push(new $OfficialSamplesScript_Contacts_Contact('', '', ko.observableArray()));
	};
	self.removeContact = function(contact1) {
		self.contacts.remove(contact1);
	};
	self.addPhone = function(contact2) {
		contact2.phones.push(new $OfficialSamplesScript_Contacts_Phone('', ''));
	};
	self.removePhone = function(phone) {
		$.each(self.contacts(), function(index, value) {
			value.phones.remove(phone);
		});
	};
	self.save = function() {
		self.lastSavedJson(JSON.stringify(ko.toJS(self.contacts), null, 2));
	};
	self.lastSavedJson = ko.observable('');
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Contacts.Phone
var $OfficialSamplesScript_Contacts_Phone = function(type, number) {
	this.type = null;
	this.number = null;
	this.type = type;
	this.number = number;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.ControlTypes.ControlTypesViewModel
var $OfficialSamplesScript_ControlTypes_ControlTypesViewModel = function() {
	this.stringValue = null;
	this.passwordValue = null;
	this.booleanValue = null;
	this.optionValues = null;
	this.selectedOptionValue = null;
	this.multipleSelectedOptionValues = null;
	this.radioSelectedOptionValue = null;
	this.stringValue = ko.observable('Hello');
	this.passwordValue = ko.observable('mypass');
	this.booleanValue = ko.observable(true);
	this.optionValues = ko.observableArray(['Alpha', 'Beta', 'Gamma']);
	this.selectedOptionValue = ko.observable('Gamma');
	this.multipleSelectedOptionValues = ko.observableArray(['Alpha']);
	this.radioSelectedOptionValue = ko.observable('Beta');
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Gifts.Gift
var $OfficialSamplesScript_Gifts_Gift = function(name, price) {
	this.name = null;
	this.price = 0;
	this.name = name;
	this.price = price;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Gifts.GiftsSetupScript
var $OfficialSamplesScript_Gifts_GiftsSetupScript = function() {
};
$OfficialSamplesScript_Gifts_GiftsSetupScript.setup = function() {
	var viewModel = new $OfficialSamplesScript_Gifts_GiftViewModel([new $OfficialSamplesScript_Gifts_Gift('Tall Hat', 39.95), new $OfficialSamplesScript_Gifts_Gift('Long Cloak', 120)]);
	ko.applyBindings(viewModel);
	// Activate jQuery Validation
	var vm = viewModel;
	$('form', window.document).validate({ submitHandler: vm.save });
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Gifts.GiftViewModel
var $OfficialSamplesScript_Gifts_GiftViewModel = function(gifts) {
	this.gifts = null;
	this.addGift = null;
	this.removeGift = null;
	this.save = null;
	var self = this;
	self.gifts = ko.observableArray(gifts);
	self.addGift = function() {
		self.gifts.push(new $OfficialSamplesScript_Gifts_Gift('', 0));
	};
	self.removeGift = function(gift) {
		self.gifts.remove(gift);
	};
	self.save = function() {
		window.alert('Could now transmit to server: ' + ko.utils.stringifyJson(self.gifts));
	};
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.PagedGrid.Data
var $OfficialSamplesScript_PagedGrid_Data = function(name, sales, price) {
	this.name = null;
	this.sales = 0;
	this.price = 0;
	this.name = name;
	this.sales = sales;
	this.price = price;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.PagedGrid.PagedGridViewModel
var $OfficialSamplesScript_PagedGrid_PagedGridViewModel = function(items) {
	this.items = null;
	this.addItem = null;
	this.sortByName = null;
	this.jumpToFirstPage = null;
	this.gridViewModel = null;
	var self = this;
	this.items = ko.observableArray(items);
	this.addItem = function() {
		self.items.push(new $OfficialSamplesScript_PagedGrid_Data('New Item', 0, 100));
	};
	this.sortByName = function() {
		self.items.sort(function(a, b) {
			return a.name.compareTo(b.name);
		});
	};
	this.jumpToFirstPage = function() {
		self.gridViewModel.currentPageIndex(0);
	};
	this.gridViewModel = new ko.simpleGrid.viewModel({ pageSize: 4, data: self.items, columns: ko.observableArray([{ headerText: 'Item Name', rowText: 'name' }, { headerText: 'Sales Count', rowText: 'sales' }, {
		headerText: 'Price',
		rowText: function(item) {
			return 'R' + item.price.toFixed(2);
		}
	}]) });
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Person.PersonViewModel
var $OfficialSamplesScript_Person_PersonViewModel = function() {
	this.firstName = null;
	this.lastName = null;
	this.fullName = null;
	this.firstName = ko.observable('Matthew');
	this.lastName = ko.observable('Leibowitz');
	this.fullName = ko.computed(Function.mkdel(this, function() {
		return this.firstName() + ' ' + this.lastName();
	}));
	// AND, there is way to perform the updates to the computed object
	//var options = new DependentObservableOptions<string>();
	//options.GetValueFunction = () => self.FirstName.Value + " " + self.LastName.Value;
	//options.SetValueFunction = s =>
	//{
	//    s = s.Trim();
	//    var index = s.IndexOf(" ");
	//    if (index == -1)
	//    {
	//        self.FirstName.Value = s;
	//        self.LastName.Value = string.Empty;
	//    }
	//    else
	//    {
	//        self.FirstName.Value = s.Substring(0, index);
	//        self.LastName.Value = s.Substring(index + 1, s.Length);
	//    }
	//};
	//this.FullName = Knockout.Computed(options);
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.ShoppingCart.CartLineViewModel
var $OfficialSamplesScript_ShoppingCart_CartLineViewModel = function() {
	this.category = null;
	this.product = null;
	this.quantity = null;
	this.subtotal = null;
	var self = this;
	self.category = ko.observable();
	self.product = ko.observable();
	self.quantity = ko.observable(1);
	self.subtotal = ko.computed(function() {
		return (ss.isValue(self.product()) ? (self.product().price * parseInt('0' + self.quantity(), 10)) : 0);
	});
	// Whenever the category changes, reset the product selection
	self.category.subscribe(function(val) {
		self.product(null);
	});
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.ShoppingCart.CartViewModel
var $OfficialSamplesScript_ShoppingCart_CartViewModel = function() {
	this.lines = null;
	this.grandTotal = null;
	this.addLine = null;
	this.removeLine = null;
	this.save = null;
	var self = this;
	var $t1 = [];
	$t1.add(new $OfficialSamplesScript_ShoppingCart_CartLineViewModel());
	self.lines = ko.observableArray($t1);
	self.grandTotal = ko.computed(function() {
		var total = 0;
		self.lines().forEach(function(item) {
			total += item.subtotal();
		});
		return total;
	});
	// Operations
	self.addLine = function() {
		self.lines.push(new $OfficialSamplesScript_ShoppingCart_CartLineViewModel());
	};
	self.removeLine = function(item1) {
		self.lines.remove(item1);
	};
	self.save = function() {
		var dataToSave = self.lines().map(function(line) {
			var product = line.product();
			return (ss.isValue(product) ? new $OfficialSamplesScript_ShoppingCart_SaveableProduct(product.name, line.quantity()) : null);
		});
		window.alert('Could now send this to server: ' + JSON.stringify(dataToSave));
	};
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.ShoppingCart.Category
var $OfficialSamplesScript_ShoppingCart_Category = function() {
	this.name = null;
	this.products = null;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.ShoppingCart.Product
var $OfficialSamplesScript_ShoppingCart_Product = function() {
	this.name = null;
	this.price = 0;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.ShoppingCart.SaveableProduct
var $OfficialSamplesScript_ShoppingCart_SaveableProduct = function(productName, quantity) {
	this.productName = null;
	this.quantity = 0;
	this.productName = productName;
	this.quantity = quantity;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.SimpleList.SimpleListViewModel
var $OfficialSamplesScript_SimpleList_SimpleListViewModel = function(items) {
	this.items = null;
	this.itemToAdd = null;
	this.addItem = null;
	this.items = ko.observableArray(items);
	this.itemToAdd = ko.observable('');
	var self = this;
	this.addItem = function() {
		if (self.itemToAdd() !== '') {
			// Adds the item. Writing to the "items" observableArray 
			// causes any associated UI to update.
			self.items.push(self.itemToAdd());
			// Clears the text box, because it's bound to the
			// "itemToAdd" observable
			self.itemToAdd('');
		}
	};
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Twitter.SetupScripts
var $OfficialSamplesScript_Twitter_SetupScripts = function() {
};
$OfficialSamplesScript_Twitter_SetupScripts.setup = function() {
	var $t1 = [];
	$t1.add(new $OfficialSamplesScript_Twitter_TweetGroup(ko.observable('Celebrities'), ko.observableArray(['JohnCleese', 'MCHammer', 'StephenFry', 'algore', 'StevenSanderson'])));
	$t1.add(new $OfficialSamplesScript_Twitter_TweetGroup(ko.observable('Microsoft people'), ko.observableArray(['BillGates', 'shanselman', 'ScottGu'])));
	$t1.add(new $OfficialSamplesScript_Twitter_TweetGroup(ko.observable('Tech pundits'), ko.observableArray(['Scobleizer', 'LeoLaporte', 'techcrunch', 'BoingBoing', 'timoreilly', 'codinghorror'])));
	var savedLists = $t1;
	ko.applyBindings(new $OfficialSamplesScript_Twitter_TwitterViewModel(savedLists, 'Tech pundits'));
	// Using jQuery for Ajax loading indicator - nothing to do with Knockout
	var loading = $('.loadingIndicator');
	$.ajaxPrefilter(function(options) {
		options.global = true;
	});
	$(document).ajaxStart(function() {
		loading.fadeIn();
	}).ajaxStop(function() {
		loading.fadeOut();
	});
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Twitter.TweetGroup
var $OfficialSamplesScript_Twitter_TweetGroup = function(name, userNames) {
	this.name = null;
	this.userNames = null;
	this.name = name;
	this.userNames = userNames;
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.Twitter.TwitterViewModel
var $OfficialSamplesScript_Twitter_TwitterViewModel = function(lists, selectedList) {
	this.savedLists = null;
	this.editingList = null;
	this.userNameToAdd = null;
	this.currentTweets = null;
	this.findSavedList = null;
	this.addUser = null;
	this.userNameToAddIsValid = null;
	this.removeUser = null;
	this.saveChanges = null;
	this.deleteList = null;
	this.hasUnsavedChanges = null;
	this.canAddUserName = null;
	var self = this;
	this.savedLists = ko.observableArray(lists);
	this.editingList = new $OfficialSamplesScript_Twitter_TweetGroup(ko.observable(selectedList), ko.observableArray());
	this.userNameToAdd = ko.observable('');
	this.currentTweets = ko.observableArray([]);
	this.findSavedList = function(name) {
		return ko.utils.arrayFirst(self.savedLists(), function(grp) {
			return ss.referenceEquals(grp.name(), name);
		}, self);
	};
	this.addUser = function() {
		if (ss.isValue(self.userNameToAdd()) && self.userNameToAddIsValid()) {
			self.editingList.userNames.push(self.userNameToAdd());
			self.userNameToAdd('');
		}
	};
	this.removeUser = function(userName) {
		self.editingList.userNames.remove(userName);
	};
	this.saveChanges = Function.mkdel(this, this.onSaveChanges);
	this.deleteList = function() {
		var nameToDelete = self.editingList.name();
		var savedListsExceptOneToDelete = self.savedLists().filter(function(grp1) {
			return !ss.referenceEquals(grp1.name(), nameToDelete);
		});
		self.editingList.name(((savedListsExceptOneToDelete.length === 0) ? null : savedListsExceptOneToDelete[0].name()));
		self.savedLists(savedListsExceptOneToDelete);
	};
	ko.computed(function() {
		// Observe viewModel.editingList.name(), so when it changes 
		// (i.e., user selects a different list) we know to copy the 
		// saved list into the editing list
		var savedList = self.findSavedList(self.editingList.name());
		if (ss.isValue(savedList)) {
			var userNamesCopy = savedList.userNames.slice(0);
			self.editingList.userNames(userNamesCopy);
		}
		else {
			self.editingList.userNames([]);
		}
	});
	this.hasUnsavedChanges = ko.computed(function() {
		if (ss.isNullOrUndefined(self.editingList.name())) {
			return self.editingList.userNames().length > 0;
		}
		var savedData = self.findSavedList(self.editingList.name()).userNames;
		var editingData = self.editingList.userNames();
		return !ss.referenceEquals(savedData().join('|'), editingData.join('|'));
	});
	this.userNameToAddIsValid = ko.computed(function() {
		var pattern = '^\\s*[a-zA-Z0-9_]{1,15}\\s*$';
		return self.userNameToAdd() === '' || ss.isValue(self.userNameToAdd().match(new RegExp(pattern, 'g')));
	});
	this.canAddUserName = ko.computed(function() {
		return self.userNameToAddIsValid() && self.userNameToAdd() !== '';
	});
	// The active user tweets are (asynchronously) computed from editingList.userNames
	ko.computed(function() {
		twitterApi.getTweetsForUsers(self.editingList.userNames(), function(result) {
			self.currentTweets(result);
		});
	});
};
$OfficialSamplesScript_Twitter_TwitterViewModel.prototype = {
	onSaveChanges: function() {
		var saveAs = window.prompt('Save User List:', this.editingList.name());
		if (ss.isValue(saveAs)) {
			var dataToSave = this.editingList.userNames().slice(0);
			var existingSavedList = this.findSavedList(saveAs);
			if (ss.isValue(existingSavedList)) {
				// Overwrite existing list
				existingSavedList.userNames(dataToSave);
			}
			else {
				// Add new list
				this.savedLists.push(new $OfficialSamplesScript_Twitter_TweetGroup(ko.observable(saveAs), ko.observableArray(dataToSave)));
			}
			this.editingList.name(saveAs);
		}
	}
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.WorkingWithCollections.Person
var $OfficialSamplesScript_WorkingWithCollections_Person = function(name, children) {
	this.name = null;
	this.children = null;
	this.addChild = null;
	this.name = ko.observable(name);
	this.children = ko.observableArray(children);
	var self = this;
	this.addChild = function() {
		self.children.push('New Child');
	};
};
////////////////////////////////////////////////////////////////////////////////
// OfficialSamplesScript.WorkingWithCollections.WorkingWithCollectionsViewModel
var $OfficialSamplesScript_WorkingWithCollections_WorkingWithCollectionsViewModel = function() {
	this.people = [new $OfficialSamplesScript_WorkingWithCollections_Person('Annabelle', ['Arnie', 'Anders', 'Apple']), new $OfficialSamplesScript_WorkingWithCollections_Person('Bertie', ['Boutros-Boutros', 'Brianna', 'Barbie', 'Bee-bop']), new $OfficialSamplesScript_WorkingWithCollections_Person('Charles', ['Cayenne', 'Cleopatra'])];
	this.showRenderTimes = ko.observable(false);
};
Type.registerClass(global, 'OfficialSamplesScript.AnimatedTransitions.AnimatedTransitionsViewModel', $OfficialSamplesScript_AnimatedTransitions_AnimatedTransitionsViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.AnimatedTransitions.Planet', $OfficialSamplesScript_AnimatedTransitions_Planet, Object);
Type.registerClass(global, 'OfficialSamplesScript.BetterList.BetterListViewModel', $OfficialSamplesScript_BetterList_BetterListViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.ClickCounter.ClickCounterViewModel', $OfficialSamplesScript_ClickCounter_ClickCounterViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.Contacts.Contact', $OfficialSamplesScript_Contacts_Contact, Object);
Type.registerClass(global, 'OfficialSamplesScript.Contacts.ContactsViewModel', $OfficialSamplesScript_Contacts_ContactsViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.Contacts.Phone', $OfficialSamplesScript_Contacts_Phone, Object);
Type.registerClass(global, 'OfficialSamplesScript.ControlTypes.ControlTypesViewModel', $OfficialSamplesScript_ControlTypes_ControlTypesViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.Gifts.Gift', $OfficialSamplesScript_Gifts_Gift, Object);
Type.registerClass(global, 'OfficialSamplesScript.Gifts.GiftsSetupScript', $OfficialSamplesScript_Gifts_GiftsSetupScript, Object);
Type.registerClass(global, 'OfficialSamplesScript.Gifts.GiftViewModel', $OfficialSamplesScript_Gifts_GiftViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.PagedGrid.Data', $OfficialSamplesScript_PagedGrid_Data, Object);
Type.registerClass(global, 'OfficialSamplesScript.PagedGrid.PagedGridViewModel', $OfficialSamplesScript_PagedGrid_PagedGridViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.Person.PersonViewModel', $OfficialSamplesScript_Person_PersonViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.ShoppingCart.CartLineViewModel', $OfficialSamplesScript_ShoppingCart_CartLineViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.ShoppingCart.CartViewModel', $OfficialSamplesScript_ShoppingCart_CartViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.ShoppingCart.Category', $OfficialSamplesScript_ShoppingCart_Category, Object);
Type.registerClass(global, 'OfficialSamplesScript.ShoppingCart.Product', $OfficialSamplesScript_ShoppingCart_Product, Object);
Type.registerClass(global, 'OfficialSamplesScript.ShoppingCart.SaveableProduct', $OfficialSamplesScript_ShoppingCart_SaveableProduct, Object);
Type.registerClass(global, 'OfficialSamplesScript.SimpleList.SimpleListViewModel', $OfficialSamplesScript_SimpleList_SimpleListViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.Twitter.SetupScripts', $OfficialSamplesScript_Twitter_SetupScripts, Object);
Type.registerClass(global, 'OfficialSamplesScript.Twitter.TweetGroup', $OfficialSamplesScript_Twitter_TweetGroup, Object);
Type.registerClass(global, 'OfficialSamplesScript.Twitter.TwitterViewModel', $OfficialSamplesScript_Twitter_TwitterViewModel, Object);
Type.registerClass(global, 'OfficialSamplesScript.WorkingWithCollections.Person', $OfficialSamplesScript_WorkingWithCollections_Person, Object);
Type.registerClass(global, 'OfficialSamplesScript.WorkingWithCollections.WorkingWithCollectionsViewModel', $OfficialSamplesScript_WorkingWithCollections_WorkingWithCollectionsViewModel, Object);
