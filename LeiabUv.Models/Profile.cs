using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LeiabUv.Models
{
    public class Profile
    {
        public int Id { get; set; }

        [MinLength(1), MaxLength(256), Required]
        public string Name { get; set; }

        public double Tf { get; set; }
        public double Uf { get; set; }
        public double Yf { get; set; }

        public double Tp { get; set; }
        public double Up { get; set; }
        public double Yp { get; set; }

        public double Ug { get; set; }

        [MinLength(1), MaxLength(256)]
        public string Glass { get; set; }

        public double dim1230x1480 { get; set; }        // Window dimensions
        public double dim985x2085 { get; set; }         // Door dimensions

        [MaxLength(256)]
        public string info { get; set; }                // Additional information
        public int nrOfUsedInProjects { get; set; }     // 
    }
}
