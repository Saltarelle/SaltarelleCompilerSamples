using System;
using System.Collections.Generic;
using System.Html;
using System.Linq;
using System.Serialization;
using System.Text;
using System.Threading.Tasks;
using InteractiveJQueryUIWeb.Models;
using jQueryApi;
using jQueryApi.UI.Widgets;

namespace InteractiveJQueryUIScript {
    public class Program {
		private void EditCustomer(Element el, jQueryEvent evt) {
			var tr = jQuery.FromElement(el).Closest("tr");
			string dataStr = tr.GetAttribute("data-customer");
			var data = !string.IsNullOrEmpty(dataStr) ? Json.Parse<CustomerViewModel>(dataStr) : new CustomerViewModel();

			jQuery.Select("#customerId").Value(data.Id.HasValue ? data.Id.ToString() : "");
			jQuery.Select("#customerName").Value(data.Name ?? "");
			jQuery.Select("#customerProfitToDate").Value(data.ProfitToDate.ToString());

			((DialogObject)jQuery.Select("#customerForm")).Open();

			evt.PreventDefault();
		}

		private void SaveCustomer(jQueryEvent evt) {
			var opts = new jQueryAjaxOptions { Url = "/Home/SaveCustomer" };
			((dynamic)opts).data = jQuery.Select("#customerForm").Serialize();
			var req = jQuery.Ajax(opts);
			req.Success(_ => {
				((DialogObject)jQuery.Select("#customerForm")).Close();
				LoadCustomers();
			});
			req.Fail(_ => Window.Alert("Save failed"));
		}

		private void LoadCustomers() {
			var table = jQuery.Select("#customersTable");
			table.Hide();
			jQuery.Select("#loadingCustomers").Show();
			var req = jQuery.Ajax(new jQueryAjaxOptions { Url = "/Home/ListCustomers", DataType = "json" });
			req.Success(data => {
				var customers = (List<CustomerViewModel>)data;
				jQuery.Select("#loadingCustomers").Hide();
				table.Empty();
				table.Append(jQuery.FromHtml("<tr><td>Name</td><td>Profit to Date</td><td>&nbsp;</td></tr>"));
				foreach (var c in customers)
					table.Append(jQuery.FromHtml("<tr data-customer=\"" + Json.Stringify(c).HtmlEncode() + "\"><td>" + c.Name + "</td><td>" + c.ProfitToDate + "</td><td><a href=\"#editCustomer\">Edit</a></td></tr>"));
				table.Append(jQuery.FromHtml("<tr><td>&nbsp;</td><td>&nbsp;</td><td><a href=\"#newCustomer\">New</a></td></tr>"));

				table.Find("a").Click(EditCustomer);
				table.Show();
			});
		}

		private void Attach() {
			jQuery.Select("#customersTable").Hide();
			jQuery.Select("#customerForm").Dialog(new DialogOptions { AutoOpen = false, Width = 400 });
			jQuery.Select("#customerSave").Click(SaveCustomer);
			jQuery.Select("#customerCancel").Click(_ => ((DialogObject)jQuery.Select("#customerForm")).Close());
			LoadCustomers();
		}

        static void Main() {
			jQuery.OnDocumentReady(new Program().Attach);
        }
    }
}