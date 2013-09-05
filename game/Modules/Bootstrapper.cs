namespace Game.Modules
{
    using Nancy;

    /// <summary>
    /// Configures Nancy.
    /// </summary>
    public class Bootstrapper : DefaultNancyBootstrapper
    {
        /// <summary>
        /// Lets Nancy know about the static files.
        /// </summary>
        /// <param name="nancyConventions">The nancy conventions.</param>
        protected override void ConfigureConventions(Nancy.Conventions.NancyConventions nancyConventions)
        {
            base.ConfigureConventions(nancyConventions);

            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddFile("/index.html", "index.html"));

            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/lib"));
            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/img"));
            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/css"));

            nancyConventions.StaticContentsConventions.Add(
                Nancy.Conventions.StaticContentConventionBuilder.AddDirectory("/src"));
        }
    }
}