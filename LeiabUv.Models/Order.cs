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


    public class OrderEntry
    {
        public int Id { get; set; }

        //[MinLength(1), MaxLength(32), Required]       // Name of the Order should be enough
        //public string Name { get; set; }
        [MaxLength(320)]
        public string Info { get; set; }
        [Required]
        public int columns { get; set; }
        [Required]
        public int rows { get; set; }
        [Required]
        public double mmFrameWidth { get; set; }
        [Required]
        public double mmFrameHeight { get; set; }
        public virtual List<ProjectPane> panes { get; set; }
        public virtual List<PaneWidthArray> paneWidthArray { get; set; }
        public virtual List<PaneHeightArray> paneHeightArray { get; set; }
        [ForeignKey("OrderId")]
        public Order order { get; set; }
    }

    public class EntryPane
    {
        public int Id { get; set; }
        [Required]
        public int xIndex { get; set; }
        [Required]
        public int yIndex { get; set; }
        [Required]
        public int colSpan { get; set; }
        [Required]
        public int rowSpan { get; set; }

        public Product product { get; set; }
        public double Ug { get; set; }                      // Customizable Ug value that overrides the profile Ug value

        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order Order { get; set; }
    }

    public class PaneWidthArray
    {
        public int Id { get; set; }
        [Required]
        public double mmWidth { get; set; }

        [Required]
        public int timestamp { get; set; }

        [ForeignKey("OrderId")]
        public Order order { get; set; }
    }

    public class PaneHeightArray
    {
        public int Id { get; set; }

        [Required]
        public double mmHeight { get; set; }

        [Required]
        public int timestamp { get; set; }

        [ForeignKey("OrderId")]
        public Order order { get; set; }
    }
}

