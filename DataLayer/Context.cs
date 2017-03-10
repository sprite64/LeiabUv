using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

using LeiabUv.Models;

namespace LeiabUv.DataLayer
{
    public class Context : DbContext
    {
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplatePane> TemplatePanes { get; set; }
        public DbSet<Profile> Profiles { get; set; }
    }
}


