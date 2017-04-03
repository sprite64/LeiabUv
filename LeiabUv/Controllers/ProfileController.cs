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
    public class ProfileController : Controller
    {
        // GET: Profile
        public ActionResult Index()
        {
            return View();
        }

        // Create window profile
        public ActionResult CreateWindow()
        {
            return View();
        }

        [HttpPost]
        public ActionResult CreateWindow(Profile p)
        {
            Context ctx = new Context();
            
            p.door = false;

            p.CreatedBy = "Admin";
            p.Created = System.DateTime.Now;

            p.ModifiedBy = "Admin";
            p.Modified = System.DateTime.Now;

            if (ModelState.IsValid)
            {
                ctx.Profiles.Add(p);
                ctx.SaveChanges();
            }

            return View();
        }


        public ActionResult ShowWindow()
        {
            Context ctx = new Context();

            // Select window profiles
            var model = ctx.Profiles.ToList().Where(m => m.door == false);//.OrderBy(m => m.door);

            return View(model);
        }

        
        public ActionResult CreateDoor()
        {
            return View();
        }

        [HttpPost]
        public ActionResult CreateDoor(Profile p)
        {
            Context ctx = new Context();

            p.door = true;
            
            p.CreatedBy = "Admin";
            p.Created = System.DateTime.Now;

            p.ModifiedBy = "Admin";
            p.Modified = System.DateTime.Now;

            if (ModelState.IsValid)
            {
                ctx.Profiles.Add(p);
                ctx.SaveChanges();
            }

            return View();
        }

        public ActionResult ShowDoor()
        {
            Context ctx = new Context();

            // Select window profiles
            var model = ctx.Profiles.ToList().Where(m => m.door == true);

            return View(model);
        }

        /*
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(Profile p)
        {
            Context ctx = new Context();

            p.CreatedBy = "Admin";
            p.Created = System.DateTime.Now;

            p.ModifiedBy = "Admin";
            p.Modified = System.DateTime.Now;

            if (ModelState.IsValid) {
                ctx.Profiles.Add(p);
                ctx.SaveChanges();
            }


            return View();
        }
        */

        public ActionResult Show()
        {
            Context ctx = new Context();

            var model = ctx.Profiles.ToList().OrderBy(m => m.door);

            //model.OrderBy(m => m.door)

            return View(model);
        }
        

        // Not currently in use
        [HttpGet]
        public JsonResult Save(string json)
        {
            Context ctx = new Context();
            Profile p = JsonConvert.DeserializeObject<Profile>(json);

            if (ctx.Profiles.Any(d => d.Name == p.Name))
            {
                return Json("Namnet används redan, välj ett unikt namn.", JsonRequestBehavior.AllowGet);
            }
            
            ctx.Profiles.Add(p);
            ctx.SaveChanges();

            return Json("ok", JsonRequestBehavior.AllowGet);
        }

    }
}

