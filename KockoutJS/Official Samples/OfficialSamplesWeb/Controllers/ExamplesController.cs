using System.Web.Mvc;

namespace OfficialSamplesWeb.Controllers
{
	public class ExamplesController : Controller
	{
		public ActionResult Index() { return View(); }

		public ActionResult Person() { return View(); }
		public ActionResult ClickCounter() { return View(); }
		public ActionResult SimpleList() { return View(); }
		public ActionResult BetterList() { return View(); }
		public ActionResult ControlTypes() { return View(); }
		public ActionResult Collections() { return View(); }
		public ActionResult PagedGrid() { return View(); }
		public ActionResult AnimatedTransitions() { return View(); }

		public ActionResult Contacts() { return View(); }
		public ActionResult Gifts() { return View(); }
		public ActionResult ShoppingCart() { return View(); }
		public ActionResult Twitter() { return View(); }
	}
}
