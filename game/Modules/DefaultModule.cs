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
    using Nancy;

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
        }
    }
}