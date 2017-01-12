using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LeiabUv.Models
{

    public class TemplatePane
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

        public int TemplateId { get; set; }

        [ForeignKey("TemplateId")]
        public  Template Template { get; set; }
    }


    public class Template : UserEntryLog
    {
        public int Id { get; set; }
        
        [MinLength(1), MaxLength(32), Required]
        public string Name { get; set; }
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


