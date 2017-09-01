using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LeiabUv.Controllers
{
    public class OrderController : Controller
    {
        // GET: Order
        public ActionResult Index()
        {
            return View();
        }

        
    }
}


//<li>@Html.ActionLink("Skapa order", "Create", "Order")</li>
//<li>@Html.ActionLink("Visa ordrar", "Show", "Order")</li>