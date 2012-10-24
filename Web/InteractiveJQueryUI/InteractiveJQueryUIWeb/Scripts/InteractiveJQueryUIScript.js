////////////////////////////////////////////////////////////////////////////////
// InteractiveJQueryUIScript.Program
var $InteractiveJQueryUIScript_Program = function() {
};
$InteractiveJQueryUIScript_Program.prototype = {
	$editCustomer: function(el, evt) {
		var tr = $(el).closest('tr');
		var dataStr = tr.attr('data-customer');
		var data = (!String.isNullOrEmpty(dataStr) ? JSON.parse(dataStr) : $InteractiveJQueryUIWeb_Models_CustomerViewModel.$ctor());
		$('#customerId').val((ss.isValue(data.Id) ? data.Id.toString() : ''));
		$('#customerName').val(ss.coalesce(data.Name, ''));
		$('#customerProfitToDate').val(data.ProfitToDate.toString());
		$('#customerForm').dialog('open');
		evt.preventDefault();
	},
	$saveCustomer: function(evt) {
		var opts = { url: '/Home/SaveCustomer' };
		opts.data = $('#customerForm').serialize();
		var req = $.ajax(opts);
		req.success(Function.mkdel(this, function(_) {
			$('#customerForm').dialog('close');
			this.$loadCustomers();
		}));
		req.fail(function(_1) {
			window.alert('Save failed');
		});
	},
	$loadCustomers: function() {
		var table = $('#customersTable');
		table.hide();
		$('#loadingCustomers').show();
		var req = $.ajax({ url: '/Home/ListCustomers', dataType: 'json' });
		req.success(Function.mkdel(this, function(data) {
			var customers = Type.cast(data, Array);
			$('#loadingCustomers').hide();
			table.empty();
			table.append($('<tr><td>Name</td><td>Profit to Date</td><td>&nbsp;</td></tr>'));
			for (var $t1 = 0; $t1 < customers.length; $t1++) {
				var c = customers[$t1];
				table.append($('<tr data-customer="' + JSON.stringify(c).htmlEncode() + '"><td>' + c.Name + '</td><td>' + c.ProfitToDate + '</td><td><a href="#editCustomer">Edit</a></td></tr>'));
			}
			table.append($('<tr><td>&nbsp;</td><td>&nbsp;</td><td><a href="#newCustomer">New</a></td></tr>'));
			table.find('a').click(Function.thisFix(Function.mkdel(this, this.$editCustomer)));
			table.show();
		}));
	},
	$attach: function() {
		$('#customersTable').hide();
		$('#customerForm').dialog({ autoOpen: false, width: 400 });
		$('#customerSave').click(Function.mkdel(this, this.$saveCustomer));
		$('#customerCancel').click(function(_) {
			$('#customerForm').dialog('close');
		});
		this.$loadCustomers();
	}
};
$InteractiveJQueryUIScript_Program.$main = function() {
	var $t1 = new $InteractiveJQueryUIScript_Program();
	$(Function.mkdel($t1, $t1.$attach));
};
////////////////////////////////////////////////////////////////////////////////
// InteractiveJQueryUIWeb.Models.CustomerViewModel
var $InteractiveJQueryUIWeb_Models_CustomerViewModel = function() {
};
$InteractiveJQueryUIWeb_Models_CustomerViewModel.createInstance = function() {
	return $InteractiveJQueryUIWeb_Models_CustomerViewModel.$ctor();
};
$InteractiveJQueryUIWeb_Models_CustomerViewModel.$ctor = function() {
	var $this = {};
	$this.Id = null;
	$this.Name = null;
	$this.ProfitToDate = 0;
	return $this;
};
Type.registerClass(global, 'InteractiveJQueryUIScript.Program', $InteractiveJQueryUIScript_Program, Object);
Type.registerClass(global, 'InteractiveJQueryUIWeb.Models.CustomerViewModel', $InteractiveJQueryUIWeb_Models_CustomerViewModel, Object);
$InteractiveJQueryUIScript_Program.$main();
