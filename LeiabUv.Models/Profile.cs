using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LeiabUv.Models
{
    public class Profile
    {
        public int Id { get; set; }

        [MinLength(1), MaxLength(256), Required]
        public string Name { get; set; }                // Key 

        public double Tf { get; set; }                  // Frame values
        public double Uf { get; set; }
        public double Yf { get; set; }

        public double Tp { get; set; }                  // Post values
        public double Up { get; set; }
        public double Yp { get; set; }

        public double Tr { get; set; }                  // Threshold/doorstep value

        public double Ug { get; set; }                  // U value glas

        [MinLength(1), MaxLength(256)]
        public string Glass { get; set; }               // Paired key with profile Name

        //public double dim1230x1480 { get; set; }        // Window dimensions
        //public double dim985x2085 { get; set; }         // Door dimensions

        public bool door { get; set; }

        [MaxLength(256)]
        public string info { get; set; }                // Additional information
        //public int nrOfUsedInProjects { get; set; }     // 
    }
}
