using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;



namespace LeiabUv.Models
{
    public class Order
    {
        public int id { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime created { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime modified { get; set; }

        [MinLength(1), MaxLength(256), Required]
        public string name { get; set; }                // Key 

        [MaxLength(256)]
        public string info { get; set; }                // Additional information
    }
}
