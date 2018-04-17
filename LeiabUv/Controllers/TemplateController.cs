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
            Context ctx = new Context();
            Template t = JsonConvert.DeserializeObject<Template>(json);

            // Check empty name
            if (t.name == "") { return Json("Fyll i beteckning!", JsonRequestBehavior.AllowGet); }

            // Check duplicate name
            if (ctx.Templates.Any(d => d.name == t.name))
            {
                return Json("Beteckningen används redan, välj en unik beteckning.", JsonRequestBehavior.AllowGet);
            }

            t.created = System.DateTime.Now;
            
            ctx.Templates.Add(t);
            ctx.SaveChanges();
            
            return Json("ok", JsonRequestBehavior.AllowGet);
        }


        public ActionResult Display()   // Display all templates
        {
            Context ctx = new Context();

            var data = new List<SelectListItem>();
            data = ctx.Templates.Select(d => new SelectListItem { Text = d.name, Value = d.id.ToString() }).ToList<SelectListItem>();
            ViewBag.templateList = data;

            return View();
        }


        [HttpGet]
        public JsonResult Delete(int id)
        {
            Context ctx = new Context();

            ctx.Templates.Remove(ctx.Templates.Find(id));
            ctx.SaveChanges();

            return Json("ok", JsonRequestBehavior.AllowGet);
        }
        

        [HttpGet]
        public ActionResult GetTemplate(int id)
        {
            Context ctx = new Context();

            var template = ctx.Templates.Select(d=>new TemplateViewModel {
                id=d.id,
                columns=d.columns,
                rows=d.rows,
                name=d.name,
                created = d.created,
                panes=d.panes.Select(f=>new TemplatePaneViewModel {
                    id=f.id,
                    colSpan=f.colSpan,
                    rowSpan=f.rowSpan,
                    xIndex=f.xIndex,
                    yIndex=f.yIndex
                }).ToList<TemplatePaneViewModel>()

            }).FirstOrDefault(d => d.id == id);

            return Json(template,JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public ActionResult GetTemplates()
        {
            Context ctx = new Context();

            var templates = ctx.Templates.Select(d => new TemplateViewModel
            {
                id = d.id,
                columns = d.columns,
                rows = d.rows,
                name = d.name,
                created = d.created,
                panes = d.panes.Select(f => new TemplatePaneViewModel {
                    id = f.id,
                    colSpan = f.colSpan,
                    rowSpan = f.rowSpan,
                    xIndex = f.xIndex,
                    yIndex = f.yIndex,
                }).ToList<TemplatePaneViewModel>()
            }).ToList<TemplateViewModel>();

            Response.CacheControl = "no-cache";

            return Json(templates, JsonRequestBehavior.AllowGet);
        }
    }
}

