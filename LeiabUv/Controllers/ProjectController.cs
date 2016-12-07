using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LeiabUv.Controllers
{
    public class ProjectController : Controller
    {
        // GET: Project
        public ActionResult Index()
        {
            return View();
        }
        

        public ActionResult Create(int id)
        {

            ViewBag.TemplateId = id;

            return View();
        }

        public ActionResult Show()
        {

            return View();
        }
    }
}