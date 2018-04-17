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
    public class ProductController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        
        public ActionResult CreateWindow()
        {
            return View();
        }


        public ActionResult CreateDoor()
        {
            return View();
        }


        [HttpPost]
        public ActionResult CreateWindow(Product p)
        {
            Context ctx = new Context();

            p.window = true;
            p.created = System.DateTime.Now;

            if (ModelState.IsValid)
            {
                ctx.Products.Add(p);
                ctx.SaveChanges();
            }

            return View();
        }


        [HttpPost]
        public ActionResult CreateDoor(Product p)
        {
            Context ctx = new Context();

            p.window = false;
            p.created = System.DateTime.Now;

            if (ModelState.IsValid)
            {
                ctx.Products.Add(p);
                ctx.SaveChanges();
            }

            return View();
        }


        public ActionResult ListWindow()
        {
            Context ctx = new Context();
            
            var model = ctx.Products.ToList().Where(m => m.window == true);

            return View(model);
        }
        

        public ActionResult ListDoor()
        {
            Context ctx = new Context();
            
            var model = ctx.Products.ToList().Where(m => m.window == false);

            return View(model);
        }
        
        
        public ActionResult EditWindow(int? id)
        {
            if (id == null) { return Redirect("/Product/ListWindow"); }     // Redirect to list

            Context ctx = new Context();
            Product p = ctx.Products.FirstOrDefault(m => m.id == id);

            if(p == null) { return Redirect("/Product/ListWindow"); }       // Redirect to list

            return View(p);
        }

        public ActionResult EditDoor(int? id)
        {
            if (id == null) { return Redirect("/Product/ListDoor"); }       // Redirect to list

            Context ctx = new Context();
            Product p = ctx.Products.FirstOrDefault(m => m.id == id);

            if(p == null) { return Redirect("/Product/ListDoor"); }         // Redirect to list

            return View(p);
        }


        [HttpGet]
        public JsonResult Save(string json)
        {
            Context ctx = new Context();
            Product p = JsonConvert.DeserializeObject<Product>(json);

            // This needs to be paired with glass type as well, as a combined key
            /*if (ctx.Products.Any(d => d.name == p.name))
            {
                return Json("name.already.in.use", JsonRequestBehavior.AllowGet);
            }*/

            p.created = System.DateTime.Now;

            ctx.Products.Add(p);
            ctx.SaveChanges();

            return Json("ok", JsonRequestBehavior.AllowGet);
        }


        public ActionResult Update(string json)
        {
            Context ctx = new Context();
            ProductUpdate pu = JsonConvert.DeserializeObject<ProductUpdate>(json);

            Product p = ctx.Products.First(m => m.id == pu.id);
            p.deprecated = pu.deprecated;
            p.info = pu.info;
            
            ctx.SaveChanges();
            
            return Json("ok", JsonRequestBehavior.AllowGet);
        }
    }
}

