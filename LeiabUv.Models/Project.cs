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

        public Profile windowProfile { get; set; }          // Profile for windows
        public Profile doorProfileTop { get; set; }         // Profiles for doors
        public Profile doorProfileBottom { get; set; }
        public Profile doorProfileLeft { get; set; }
        public Profile doorProfileRight { get; set; }

        public int ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }
    
    public class PaneWidthArray
    {
        public int Id { get; set; }
        [Required]
        public double mmWidth { get; set; }

        [Required]
        public int timestamp { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }

    public class PaneHeightArray
    {
        public int Id { get; set; }

        [Required]
        public double mmHeight { get; set; }

        [Required]
        public int timestamp { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }


    public class Profile
    {
        [MinLength(1), MaxLength(256), Required]
        public string Name { get; set; }
        public double Tftf { get; set; }
        public double Ufuf { get; set; }
        public double Yfyf { get; set; }
        public double Tptp { get; set; }
        public double Upup { get; set; }
        public double Ypyp { get; set; }
        public double Ugug { get; set; }
        [MinLength(1), MaxLength(256)]
        public string Glass { get; set; }
        public double dim1230x1480 { get; set; }        // Window dimensions
        public double dim985x2085 { get; set; }         // Door dimensions
        [MaxLength(256)]
        public string info { get; set; }                // Additional information
        public int nrOfUsedInProjects { get; set; }     // 
    }

    /*
    public class ProjectProfile
    {
        [MinLength(1), MaxLength(256), Required]
        public string Name { get; set; }
        [Required]
        public int Tf { get; set; }
        [Required]
        public double Uf { get; set; }
        [Required]
        public double Yf { get; set; }
        [Required]
        public double Ug { get; set; }
        [MinLength(1), MaxLength(320), Required]
        public string Glass { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }
    }*/
    

    public class Project : UserEntryLog
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
