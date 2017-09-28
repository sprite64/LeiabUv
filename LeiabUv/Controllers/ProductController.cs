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
    public class ProductController : Controller
    {
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        // Create window product
        public ActionResult CreateWindowProduct()
        {

            return View();
        }

        // Create window product
        public ActionResult CreateWindow()
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


        public ActionResult ShowWindow()
        {
            Context ctx = new Context();

            // Select window products
            var model = ctx.Products.ToList().Where(m => m.window == true);//.OrderBy(m => m.door);

            return View(model);
        }


        public ActionResult CreateDoor()
        {
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

        public ActionResult ShowDoor()
        {
            Context ctx = new Context();

            // Select window products
            var model = ctx.Products.ToList().Where(m => m.window == false);

            return View(model);
        }


        public ActionResult Show()
        {
            Context ctx = new Context();
            
            var model = ctx.Products.ToList().OrderBy(m => m.window);
            
            return View(model);
        }


        // Save product
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

        public ActionResult Edit(int id)
        {
            Context ctx = new Context();
            Product p = ctx.Products.First(m => m.id == id);

            return View(p);
        }

    }
}

