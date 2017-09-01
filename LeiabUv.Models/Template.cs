using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LeiabUv.Models
{

    public class TemplatePane
    {
        public int Id { get; set; }
        [Required]
        public int XIndex { get; set; }
        [Required]
        public int YIndex { get; set; }
        [Required]
        public int ColSpan { get; set; }
        [Required]  
        public int RowSpan { get; set; }

        public int TemplateId { get; set; }

        [ForeignKey("TemplateId")]
        public  Template Template { get; set; }
    }


    public class Template
    {
        public int Id { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime Created { get; set; }

        [MinLength(1), MaxLength(32), Required]
        public string Name { get; set; }
        [Required]
        public int Columns { get; set; }
        [Required]
        public int Rows { get; set; }
        public virtual List<TemplatePane> Panes { get; set; }


        /*
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Must be at least 4 characters long.")]
        [Remote("CheckForDuplication", "Validation")]
        public string FirstName { get; set; } */

    }
}


