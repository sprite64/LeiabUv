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
            if(id == null) { return Redirect("/Order/List"); }      // Redirect to list

            Context ctx = new Context();
            Order o = ctx.Orders.FirstOrDefault(m => m.id == id);

            if(o == null) { return Redirect("/Order/List"); }       // Redirect to list

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


        public ActionResult NewWindow(int? id)      // 1. New Window OrderEntry init/input form
        {
            if (id == null) { return Redirect("/Order/List"); } // Redirect to list

            Context ctx = new Context();
            Order o = ctx.Orders.FirstOrDefault(m => m.id == id);

            if (o == null) { return Redirect("/Order/List"); }   // Redirect to list
            
            return View(o);
        }

        [HttpGet]
        public JsonResult SaveWindow(string json)   // 2. Save NewWindow OrderEntry
        {
            Context ctx = new Context();
            NewWindow w = JsonConvert.DeserializeObject<NewWindow>(json);

            // Get order
            Order o = ctx.Orders.FirstOrDefault(m => m.id == w.orderId);

            // Get tempalte
            Template t = ctx.Templates.FirstOrDefault(m => m.id == w.modelId);

            // Create new OrderEntry/Window
            OrderEntry e = new OrderEntry();
            e.orderId = o.id;       // Init keys
            e.info = w.info;
            e.window = true;

            e.columns = t.columns;  // Init template data
            e.rows = t.rows;
            e.mmFrameWidth = w.width;
            e.mmFrameHeight = w.height;

            e.panes = new List<EntryPane>();            // Init panes List
            for (int i = 0; i < t.panes.Count; i++)
            {

                e.panes.Add(new EntryPane() {
                    xIndex = t.panes[i].xIndex,
                    yIndex = t.panes[i].yIndex,
                    colSpan = t.panes[i].colSpan,
                    rowSpan = t.panes[i].rowSpan,
                    product = null,
                    ug = 0.0
                    //entryId = o.id
                });
            }

            e.paneWidthArray = new List<PaneWidthArray>();
            for(int i = 0; i < t.columns; i ++)
            {
                e.paneWidthArray.Add(new PaneWidthArray()
                {
                    mmWidth = 0.0,
                    timestamp = 0
                });
            }

            e.paneHeightArray = new List<PaneHeightArray>();
            for(int i = 0; i < t.rows; i ++)
            {
                e.paneHeightArray.Add(new PaneHeightArray()
                {
                    mmHeight = 0.0,
                    timestamp = 0
                });
            }

            // Save to database
            ctx.OrderEntries.Add(e);
            ctx.SaveChanges();
            
            return Json("ok", JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetWindows(int? orderId)        // Get list of windows
        {
            Context ctx = new Context();
            
            var windows = ctx.OrderEntries.Select(d => new OrderEntryViewModel
            {
                id = d.id,
                window = d.window,
                info = d.info,
                columns = d.columns,
                rows = d.rows,
                mmFrameWidth = d.mmFrameWidth,
                mmFrameHeight = d.mmFrameHeight,
                orderId = d.orderId
            }).Where(m => m.window == true).Where(m => m.orderId == orderId);
            
            return Json(windows, JsonRequestBehavior.AllowGet);
        }
        

        public ActionResult EditWindow()            // 3. Edit window view
        {
            return View();
        }


        public ActionResult UpdateWindow()          // 4. Update window from Edit view
        {
            return View();
        }
    }
}




/*
public class OrderEntry {
    public int Id { get; set; }
    public string Info { get; set; }
    public int columns { get; set; }
    public int rows { get; set; }
    public double mmFrameWidth { get; set; }
    public double mmFrameHeight { get; set; }
    public virtual List<ProjectPane> panes { get; set; }
    public virtual List<PaneWidthArray> paneWidthArray { get; set; }
    public virtual List<PaneHeightArray> paneHeightArray { get; set; } }

public class EntryPane {
    public int Id { get; set; }
    public int xIndex { get; set; }
    public int yIndex { get; set; }
    public int colSpan { get; set; }
    public int rowSpan { get; set; }
    public Product product { get; set; }
    public double Ug { get; set; }                      // Customizable Ug value that overrides the profile Ug value

    public int OrderId { get; set; }
    public Order Order { get; set; }


public class PaneWidthArray
    public int Id { get; set; }
    public double mmWidth { get; set; }
    public int timestamp { get; set; }
    public Order order { get; set; }
 */

//Order o = JsonConvert.DeserializeObject<Order>(json);

