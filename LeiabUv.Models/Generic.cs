using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LeiabUv.Models
{
    public class UserEntryLog
    {
        public string CreatedBy { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime Created { get; set;  }
        
        public string ModifiedBy { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime Modified { get; set; }
    }
}
