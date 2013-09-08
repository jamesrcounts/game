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
    using System.Threading.Tasks;
    using Microsoft.WindowsAzure.Storage.Table;
    using Nancy;
    using Nancy.ModelBinding;

    /// <summary>
    /// Hosts the server side code.
    /// </summary>
    // ReSharper disable UnusedMember.Global
    public class DefaultModule : NancyModule

    // ReSharper restore UnusedMember.Global
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DefaultModule"/> class.
        /// </summary>
        public DefaultModule()
        {
            this.Get["/"] = _ => this.View["index"];
            this.Get["/SpecRunner"] = _ => this.View["SpecRunner"];
            this.Post["/Collect"] = delegate
                {
                    Task.Factory.StartNew(() => this.Save());
                    return HttpStatusCode.OK;
                };
        }

        /// <summary>
        /// Saves to.
        /// </summary>
        /// <returns>
        /// Status 200 if the task completes without error.
        /// </returns>
        private Response Save()
        {
            var dataPoint = this.Bind<GameEvent>();
            var operation = TableOperation.Insert(dataPoint);
            using (var r = TableReferencePool.Pool.Acquire())
            {
                r.CloudTable.Execute(operation);
            }

            return HttpStatusCode.OK;
        }
    }
}