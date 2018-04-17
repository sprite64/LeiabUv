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
    public class OrderController : Controller
    {
        // GET: Order
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Save(string json)
        {
            Context ctx = new Context();
            Order o = JsonConvert.DeserializeObject<Order>(json);

            o.created = System.DateTime.Now;
            o.modified = o.created;
            
            ctx.Orders.Add(o);
            ctx.SaveChanges();
            
            return Json("ok" + o.id, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult Update(string json)
        {
            Context ctx = new Context();
            Order o = JsonConvert.DeserializeObject<Order>(json);

            Order uo = ctx.Orders.First(m => m.id == o.id);

            uo.name = o.name;
            uo.info = o.info;
            uo.modified = System.DateTime.Now;
            
            ctx.SaveChanges();

            return Json("ok" + uo.modified, JsonRequestBehavior.AllowGet);
        }


        public ActionResult Edit(int? id)
        {
            if(id == null) { return Redirect("/Order/List"); }         // Redirect to list

            Context ctx = new Context();
            Order o = ctx.Orders.FirstOrDefault(m => m.id == id);

            if(o == null) { return Redirect("/Order/List"); }   // Redirect to list

            return View(o);
        }

        public ActionResult List()
        {
            Context ctx = new Context();

            var model = ctx.Orders.ToList();
            
            // Append nr of windows/doors to viewbag

            return View(model);
        }

        [HttpGet]
        public JsonResult Delete(int id)
        {
            Context ctx = new Context();

            ctx.Orders.Remove(ctx.Orders.Find(id));
            ctx.SaveChanges();

            return Json("ok", JsonRequestBehavior.AllowGet);
        }
    }
}

