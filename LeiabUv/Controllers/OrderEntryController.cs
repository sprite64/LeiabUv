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
    public class OrderEntryController : Controller
    {
        // GET: OrderEntry
        public ActionResult Index()
        {
            return View();
        }

        /*
        public ActionResult Edit(int? id)
        {
            ViewBag.ProjectId = id;

            return View();
        }*/

        // This is the basis of getting "project" working in orderentry

        public ActionResult Edit(int? id)
        {
            if (id == null) { return Redirect("/Order/List"); }      // Redirect to list

            Context ctx = new Context();
            OrderEntry o = ctx.OrderEntries.FirstOrDefault(m => m.id == id);

            if (o == null) { return Redirect("/Order/List"); }       // Redirect to list

            return View(o);
        }
    }
}

