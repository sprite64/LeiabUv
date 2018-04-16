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

        /*
        public ActionResult Update(string json)
        {
            Context ctx = new Context();
            ProductUpdate pu = JsonConvert.DeserializeObject<ProductUpdate>(json);

            Product p = ctx.Products.First(m => m.id == pu.id);
            p.deprecated = pu.deprecated;
            p.info = pu.info;

            //ctx.Products.
            ctx.SaveChanges();

            //var model = ctx.Products.ToList().Where(m => m.window == true);//.OrderBy(m => m.door);


            return Json("ok", JsonRequestBehavior.AllowGet);
            */

            /*
        [HttpGet]
        public JsonResult GetModifiedDate(int id)
        {
            Context ctx = new Context();
            Order o = ctx.Orders.First(m => m.id == id);

            //return Json(o.modified, JsonRequestBehavior.AllowGet);
            return Json(o, JsonRequestBehavior.AllowGet);
        }*/

        public ActionResult Edit(int id)
        {
            Context ctx = new Context();
            Order o = ctx.Orders.First(m => m.id == id);

            ViewBag.nrOfWindows = 1;    // Count nr of window entries
            ViewBag.nrOfDoors = 3;      // Count nr of door entries

            return View(o);
        }

        public ActionResult List()
        {
            Context ctx = new Context();

            var model = ctx.Orders.ToList();

            /*
            int id = 0;
            foreach(var m in model)
            {
                ViewBag[id].windows = 0;
                id++;
                //m.windows = 0;
                //m.doors = 0;
            }*/
            
            return View(model);
        }

        [HttpGet]
        public JsonResult Delete(string json)      // Do this through json instead
        {
            Context ctx = new Context();
            Order o = JsonConvert.DeserializeObject<Order>(json);
            
            ctx.Orders.Remove(ctx.Orders.Find(o.id));
            ctx.SaveChanges();
            
            //var model = ctx.Orders.ToList();
            //return View("List", model);
            return Json("ok", JsonRequestBehavior.AllowGet);
        }

        /*
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
            */


            //return Json("ok", JsonRequestBehavior.AllowGet);
            /*
            Context ctx = new Context();

                if (deleteTemplateId != null)               // Delete template
                {
                    try
                    {
                        ctx.Templates.Remove(ctx.Templates.Find(deleteTemplateId));
                        ctx.SaveChanges();
                    } catch
                    {

                    }

                    // SQL call
                }

                var data = new List<SelectListItem>();      // Get templates
    data = ctx.Templates.Select(d => new SelectListItem { Text = d.name, Value = d.id.ToString() }).ToList<SelectListItem>();
                ViewBag.templateList = data;
                return View();
                */
        }
}

