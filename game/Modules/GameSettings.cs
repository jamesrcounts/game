namespace Game.Modules
{
    using System.IO;
    using System.Linq;
    using System.Runtime.Serialization.Formatters.Binary;
    using System.Security.Cryptography;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// Game settings
    /// </summary>
    public class GameSettings : TableEntity
    {
        public GameSettings()
        {
            this.PartitionKey = "1";
        }

        /// <summary>
        /// Gets or sets the board settings.
        /// </summary>
        /// <value>
        /// The board.
        /// </value>
        public Board Board { get; set; }

        /// <summary>
        /// Gets or sets the platforms settings
        /// </summary>
        /// <value>
        /// The platforms.
        /// </value>
        public Platforms Platforms { get; set; }

        /// <summary>
        /// Gets or sets the player settings.
        /// </summary>
        /// <value>
        /// The player.
        /// </value>
        public Player Player { get; set; }

        public static string GetRowKey(GameSettings gameSettings)
        {
            using (var algorithm = new SHA256Managed())
            using (var ms = new MemoryStream())
            {
                var formatter = new BinaryFormatter();
                formatter.Serialize(ms, gameSettings);
                var hash = algorithm.ComputeHash(ms.ToArray());
                return hash.Aggregate(string.Empty, (s, b) => s + b.ToString("X2"));
            }
        }
    }
}