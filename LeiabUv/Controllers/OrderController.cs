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
    }
}