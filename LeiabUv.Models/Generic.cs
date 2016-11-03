using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeiabUv.Models
{
    public class UserEntryLog
    {
        public string CreatedBy { get; set; }
        public DateTime Created { get; set;  }

        public string ModifiedBy { get; set; }
        public DateTime Modified { get; set; }
    }
}
