using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace LeiabUv.Models
{
    public class TemplateViewModel:UserEntryLog
    {
        public int Id { get; set; }

        [MinLength(1), MaxLength(32), Required]
        public string Name { get; set; }
        [Required]
        public int columns { get; set; }
        [Required]
        public int rows { get; set; }
        public  List<TemplatePaneViewModel> panes { get; set; }
    }

    public class TemplatePaneViewModel
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
    }
}
