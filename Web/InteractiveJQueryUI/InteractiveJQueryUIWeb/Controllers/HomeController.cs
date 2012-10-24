using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using InteractiveJQueryUIWeb.Models;

namespace InteractiveJQueryUIWeb.Controllers {
	public class HomeController : Controller {
		private static List<CustomerViewModel> _customers = new List<CustomerViewModel>();

		public ActionResult Index() {
			return View();
		}

		public ActionResult ListCustomers() {
			Thread.Sleep(2000);
			return JavaScript(new JavaScriptSerializer().Serialize(_customers));
		}

		public ActionResult SaveCustomer(CustomerViewModel c) {
			if (string.IsNullOrEmpty(c.Name))
				throw new ArgumentException("Invalid name");

			if (c.Id == null) {
				c.Id = _customers.Count == 0 ? 1 : _customers.Max(x => x.Id) + 1;
				_customers.Add(c);
			}
			else {
				var idx = _customers.FindIndex(x => x.Id == c.Id);
				_customers[idx] = c;
			}

			return Content("OK");
		}
	}
}
