namespace Game.Modules
{
    /// <summary>
    /// Platform settings
    /// </summary>
    public class Platforms
    {
        /// <summary>
        /// Gets or sets the bounce.
        /// </summary>
        /// <value>
        /// The bounce.
        /// </value>
        public int Bounce { get; set; }

        /// <summary>
        /// Gets or sets the count.
        /// </summary>
        /// <value>
        /// The count.
        /// </value>
        public int Count { get; set; }

        /// <summary>
        /// Gets or sets the grouping.
        /// </summary>
        /// <value>
        /// The grouping.
        /// </value>
        public string Grouping { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the platforms can move.
        /// </summary>
        /// <value>
        ///   <c>true</c> if they can move; otherwise, <c>false</c>.
        /// </value>
        public bool Move { get; set; }
    }
}