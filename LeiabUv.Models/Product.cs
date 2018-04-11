using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LeiabUv.Models
{
    public class Product
    {
        public int id { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime created { get; set; }

        [MinLength(1), MaxLength(256), Required]
        public string name { get; set; }                // Key 

        [Range(0, 200)]
        public double tf { get; set; }                  // Frame values
        public double uf { get; set; }
        public double yf { get; set; }

        public double tp { get; set; }                  // Post values
        public double up { get; set; }
        public double yp { get; set; }

        public double ug { get; set; }                  // U value glas

        [MinLength(1), MaxLength(256)]
        public string glass { get; set; }               // Paired key with profile Name

        //public double dim1230x1480 { get; set; }        // Window dimensions
        //public double dim985x2085 { get; set; }         // Door dimensions

        public bool window { get; set; }
        public bool deprecated { get; set; }

        [MaxLength(256)]
        public string info { get; set; }                // Additional information
        //public int nrOfUsedInProjects { get; set; }     // 
    }

    // Only used for updating a product in the DB
    public class ProductUpdate
    {
        public int id { get; set; }
        
        public bool deprecated { get; set; }

        [MaxLength(256)]
        public string info { get; set; }                // Additional information
        //public int nrOfUsedInProjects { get; set; }     // 
    }
}
