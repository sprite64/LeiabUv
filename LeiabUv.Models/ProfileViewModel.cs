using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LeiabUv.Models
{
    public class ProfileViewModel : UserEntryLog
    {
        public int Id { get; set; }

        [MinLength(1), MaxLength(256), Required]
        public string Name { get; set; }                // Key 

        [Range(0, 200)]
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
        
        public bool door { get; set; }

        [MaxLength(256)]
        public string info { get; set; }                // Additional information
    }
}
