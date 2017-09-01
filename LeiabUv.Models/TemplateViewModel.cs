using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace LeiabUv.Models
{

    public class TemplatePaneViewModel
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
    }


    public class TemplateViewModel
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
        public  List<TemplatePaneViewModel> Panes { get; set; }
    }
    
}

