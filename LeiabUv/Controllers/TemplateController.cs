using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Linq;

using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Data.Common;

using LeiabUv.Models;
using LeiabUv.DataLayer;

using Newtonsoft.Json.Serialization;
using Newtonsoft.Json;

namespace LeiabUv.Controllers
{
    public class TemplateController : Controller
    {

        // GET: Template
        public ActionResult Create()
        {
            return View();
        }


        [HttpGet]
        public JsonResult Save(string json)
        {
            Context ctx = new Context();            // Create datbase context and deserialize json string
            Template t = JsonConvert.DeserializeObject<Template>(json);

            if (t.Name == "")                       // Can't store empty string or "NULL", exit saving
            {
                return Json("Fyll i beteckning!", JsonRequestBehavior.AllowGet);
            }
            
            if(ctx.Templates.Any(d => d.Name == t.Name))
            {
                return Json("Beteckningen används redan, välj en unik beteckning.", JsonRequestBehavior.AllowGet);
            }

            t.Created = System.DateTime.Now;        // Set entry log
            t.CreatedBy = "Admin";
            t.Modified = System.DateTime.Now;
            t.ModifiedBy = "Admin";
            
            ctx.Templates.Add(t);                   // Add and save databas additions/changes
            ctx.SaveChanges();
            
            return Json("ok", JsonRequestBehavior.AllowGet);
        }


        public ActionResult Show()
        {

            Context ctx = new Context();

            var data = new List<SelectListItem>();
            data = ctx.Templates.Select(d => new SelectListItem { Text = d.Name, Value = d.Id.ToString() }).ToList<SelectListItem>();
            ViewBag.templateList = data;
            return View();
        }

        [HttpGet]
        public ActionResult GetTemplate(int id)
        {
            Context ctx = new Context();
            var template = ctx.Templates.Select(d=>new TemplateViewModel {
                Id=d.Id,
                columns=d.columns,
                rows=d.rows,
                Name=d.Name,
                Created = d.Created,
                CreatedBy = d.CreatedBy,
                Modified = d.Modified,
                ModifiedBy = d.ModifiedBy,
                panes=d.panes.Select(f=>new TemplatePaneViewModel {
                    Id=f.Id,
                    colSpan=f.colSpan,
                    rowSpan=f.rowSpan,
                    xIndex=f.xIndex,
                    yIndex=f.yIndex
                }).ToList<TemplatePaneViewModel>()

            }).FirstOrDefault(d => d.Id == id);
            return Json(template,JsonRequestBehavior.AllowGet);
        }

    }
}

