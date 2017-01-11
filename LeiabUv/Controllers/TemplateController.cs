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

            // A exception of type 'System.Data.SqlClient.SqlException' occurred in 
            //      EntityFramework.dll but was not handled in user code
            // Additional information: Login failed for user 'Sprite-PC\Sprite'.
            if (ctx.Templates.Any(d => d.Name == t.Name))
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


        public ActionResult DeleteTemplate(int templateId)
        {
            Context ctx = new Context();



            return Json("deleted", JsonRequestBehavior.AllowGet); ;
        }
        
        public ActionResult Show3()
        {
            Context ctx = new Context();

            var data = new List<Template>();

            data = ctx.Templates.Select(d => new Template {
                Name = d.Name, columns = d.columns, rows = d.rows,
                panes = d.panes.Select(f => new TemplatePane {
                    xIndex = f.xIndex, yIndex = f.yIndex,  colSpan = f.colSpan, rowSpan = f.rowSpan
                }).ToList<TemplatePane>()}).ToList<Template>();



            ViewBag.templateList = data;
            return View();
        }

        public ActionResult Show(int? deleteTemplateId)
        {
            Context ctx = new Context();

            if (deleteTemplateId != null)               // Delete template
            {
                ctx.Templates.Remove(ctx.Templates.Find(deleteTemplateId));
                ctx.SaveChanges();
                // SQL call
            }

            var data = new List<SelectListItem>();      // Get templates
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

        [HttpGet]
        public ActionResult GetTemplates()
        {
            Context ctx = new Context();

            var templates = ctx.Templates.Select(d => new TemplateViewModel
            {
                Id = d.Id,
                columns = d.columns,
                rows = d.rows,
                Name = d.Name,
                Created = d.Created,
                CreatedBy = d.CreatedBy,
                Modified = d.Modified,
                ModifiedBy = d.ModifiedBy,
                panes = d.panes.Select(f => new TemplatePaneViewModel {
                    Id = f.Id,
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

