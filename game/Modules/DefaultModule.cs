// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DefaultModule.cs" company="Jim Counts">
//   Copyright Jim Counts 2013
// </copyright>
// <summary>
//   Hosts the server side code.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Game.Modules
{
    using System;
    using System.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;
    using Nancy;
    using Nancy.ModelBinding;

    public class DataPoint : TableEntity
    {
        public DataPoint()
        {
            this.RowKey = Guid.NewGuid().ToString();
        }

        public string Category { get; set; }

        public DateTime CreateDate { get; set; }

        public string Label { get; set; }

        public string Value { get; set; }
    }

    /// <summary>
    /// Hosts the server side code.
    /// </summary>
    public class DefaultModule : NancyModule
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DefaultModule"/> class.
        /// </summary>
        public DefaultModule()
        {
            this.Get["/"] = _ => View["index"];
            var cs = ConfigurationManager.AppSettings["StorageConnectionString"];
            var table = CloudStorageAccount.Parse(cs)
                                           .CreateCloudTableClient()
                                           .GetTableReference("DataPoints");
            this.Get["/Collect"] = _ => this.SaveTo(table);
            this.Post["/Collect"] = _ => this.SaveTo(table);
        }

        private Response SaveTo(CloudTable table)
        {
            var dataPoint = this.Bind<DataPoint>();
            var operation = TableOperation.Insert(dataPoint);
            table.Execute(operation);

            return Response.AsJson(dataPoint);
        }
    }
}