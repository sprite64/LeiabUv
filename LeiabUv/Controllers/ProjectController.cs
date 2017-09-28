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


        public ActionResult Create(int? id, int? window)
        {
            if (id == null)
            {
                return View("CreateSelectTemplate");            // A view with "Select Template" button that redirects to /Template/Show
            }

            ViewBag.TemplateId = id;
            ViewBag.ProjectType = window;

            //return View("CreateWindow");                              // View that implements the Project editor
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

        [HttpGet]
        public ActionResult GetTemplate(int id)     // Template Id
        {
            Context ctx = new Context();
            var template = ctx.Templates.Select(d => new TemplateViewModel
            {
                id = d.id,
                columns = d.columns,
                rows = d.rows,
                name = d.name,
                created = d.created,
                panes = d.panes.Select(f => new TemplatePaneViewModel
                {
                    id = f.id,
                    colSpan = f.colSpan,
                    rowSpan = f.rowSpan,
                    xIndex = f.xIndex,
                    yIndex = f.yIndex
                }).ToList<TemplatePaneViewModel>()

            }).FirstOrDefault(d => d.id == id);
            return Json(template, JsonRequestBehavior.AllowGet);
        }

        // Used to populate product select list
        [HttpGet]
        public ActionResult GetProducts(int window)     // Template Id
        {
            Context ctx = new Context();
            
            if(window == 1)
            {
                var products = ctx.Products.Where(m => m.window == true).Select(d => new ProductViewModel
                {
                    Id = d.id,
                    Name = d.name,

                    Tf = d.tf,
                    Uf = d.uf,
                    Yf = d.yf,

                    Tp = d.tp,
                    Up = d.up,
                    Yp = d.yp,
                    
                    Ug = d.ug,

                    Glass = d.glass,
                    Window = d.window,
                    Deprecated = d.deprecated,
                    Info = d.info
                }).ToList<ProductViewModel>();

                return Json(products, JsonRequestBehavior.AllowGet);
            } else {
                var products = ctx.Products.Where(m => m.window == false).Select(d => new ProductViewModel
                {
                    Id = d.id,
                    Name = d.name,

                    Tf = d.tf,
                    Uf = d.uf,
                    Yf = d.yf,

                    Tp = d.tp,
                    Up = d.up,
                    Yp = d.yp,
                    
                    Ug = d.ug,

                    Glass = d.glass,
                    Window = d.window
                    //info = d.info
                }).ToList<ProductViewModel>();

                return Json(products, JsonRequestBehavior.AllowGet);
            }
            
            return Json(null, JsonRequestBehavior.AllowGet);
        }
    }
}

