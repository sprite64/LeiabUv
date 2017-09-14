using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LeiabUv.Models
{

    public class TemplatePane
    {
        public int id { get; set; }
        [Required]
        public int xIndex { get; set; }
        [Required]
        public int yIndex { get; set; }
        [Required]
        public int colSpan { get; set; }
        [Required]  
        public int rowSpan { get; set; }

        public int templateId { get; set; }

        [ForeignKey("templateId")]
        public  Template template { get; set; }
    }


    public class Template
    {
        public int id { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime created { get; set; }

        [MinLength(1), MaxLength(32), Required]
        public string name { get; set; }
        [Required]
        public int columns { get; set; }
        [Required]
        public int rows { get; set; }
        public virtual List<TemplatePane> panes { get; set; }


        /*
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Must be at least 4 characters long.")]
        [Remote("CheckForDuplication", "Validation")]
        public string FirstName { get; set; } */

    }
}


