﻿using System.Web.Mvc;

namespace OfficialSamplesWeb.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index() { return View(); } 

		public ActionResult About() { return View(); }
	}
}
