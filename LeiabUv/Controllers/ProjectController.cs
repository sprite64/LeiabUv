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
        

        public ActionResult Create(int? templateId)
        {
            if(templateId == null)
            {
                templateId = -1;
            }

            ViewBag.TemplateId = templateId;

            return View();
        }

        public ActionResult Edit(int projectId)
        {
            ViewBag.ProjectId = projectId;

            return View();
        }

        public ActionResult Show()
        {

            return View();
        }
    }
}