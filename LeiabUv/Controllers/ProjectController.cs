using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Data.Common;

using LeiabUv.Models;
using LeiabUv.DataLayer;

using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;


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

            if(templateId == -1)
            {
                return View("CreateSelectTemplate");
            }

            return View("Create");
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

        [HttpGet]
        public ActionResult GetTemplate(int id)     // Template Id
        {
            Context ctx = new Context();
            var template = ctx.Templates.Select(d => new TemplateViewModel
            {
                Id = d.Id,
                columns = d.columns,
                rows = d.rows,
                Name = d.Name,
                Created = d.Created,
                CreatedBy = d.CreatedBy,
                Modified = d.Modified,
                ModifiedBy = d.ModifiedBy,
                panes = d.panes.Select(f => new TemplatePaneViewModel
                {
                    Id = f.Id,
                    colSpan = f.colSpan,
                    rowSpan = f.rowSpan,
                    xIndex = f.xIndex,
                    yIndex = f.yIndex
                }).ToList<TemplatePaneViewModel>()

            }).FirstOrDefault(d => d.Id == id);
            return Json(template, JsonRequestBehavior.AllowGet);
        }
    }
}