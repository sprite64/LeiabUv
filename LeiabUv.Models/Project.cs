using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LeiabUv.Models
{

    public class ProjectPane {
        public int Id { get; set; }
        [Required]
        public int xIndex {get;set;}
        [Required]
        public int yIndex { get; set; }
        [Required]
        public int colSpan { get; set; }
        [Required]
        public int rowSpan { get; set; }

        public Product product { get; set; }
        public double Ug { get; set; }                      // Customizable Ug value that overrides the profile Ug value

        /*
        public Profile windowProfile { get; set; }          // Profile for windows
        public Profile doorProfileTop { get; set; }         // Profiles for doors
        public Profile doorProfileBottom { get; set; }
        public Profile doorProfileLeft { get; set; }
        public Profile doorProfileRight { get; set; }
        */

        public int ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }
    
    public class PaneWidthArray2
    {
        public int Id { get; set; }
        [Required]
        public double mmWidth { get; set; }

        [Required]
        public int timestamp { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }

    public class PaneHeightArray2
    {
        public int Id { get; set; }

        [Required]
        public double mmHeight { get; set; }

        [Required]
        public int timestamp { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }

    
    public class Project
    {
        public int Id { get; set; }
        
        [MinLength(1), MaxLength(32), Required]
        public string Name { get; set; }
        [MaxLength(320)]
        public string Description { get; set; }
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
    }

}

