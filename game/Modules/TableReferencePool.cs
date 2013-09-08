// --------------------------------------------------------------------------------------------------------------------
// <copyright file="TableReferencePool.cs" company="Jim Counts">
//   Copyright Jim Counts 2013
// </copyright>
// <summary>
//   The table reference pool.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace Game.Modules
{
    using System;
    using System.Collections.Generic;
    using System.Configuration;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Table;

    /// <summary>
    /// The table reference pool.
    /// </summary>
    public class TableReferencePool
    {
        /// <summary>
        /// The pool instance
        /// </summary>
        private static readonly TableReferencePool Instance = new TableReferencePool();

        /// <summary>
        /// The pool storage.
        /// </summary>
        private readonly Stack<CloudTable> pool = new Stack<CloudTable>();

        /// <summary>
        /// The pool lock
        /// </summary>
        private readonly object poolLock = new object();

        /// <summary>
        /// Prevents a default instance of the <see cref="TableReferencePool"/> class from being created.
        /// </summary>
        private TableReferencePool()
        {
        }

        /// <summary>
        /// Gets the pool instance
        /// </summary>
        public static TableReferencePool Pool
        {
            get { return Instance; }
        }

        /// <summary>
        /// Acquires a <see cref="CloudTableReference"/> instance.
        /// </summary>
        /// <returns>A <see cref="CloudTableReference"/>.</returns>
        public CloudTableReference Acquire()
        {
            return this.Acquire(this.pool) ?? new CloudTableReference();
        }

        /// <summary>
        /// Acquire a <see cref="CloudTableReference"/> using the pool of specified instances.
        /// </summary>
        /// <param name="instances">The instances.</param>
        /// <returns>A <see cref="CloudTableReference"/> if any <see cref="CloudTable"/>s are available, otherwise null.</returns>
        private CloudTableReference Acquire(Stack<CloudTable> instances)
        {
            lock (this.poolLock)
            {
                if (0 < instances.Count)
                {
                    return new CloudTableReference(instances.Pop());
                }
            }

            return null;
        }

        /// <summary>
        /// Releases the specified instance to the pool.
        /// </summary>
        /// <param name="instance">The instance.</param>
        private void Release(CloudTableReference instance)
        {
            lock (this.poolLock)
            {
                this.pool.Push(instance.CloudTable);
            }
        }

        /// <summary>
        /// A reference to a <see cref="CloudTable"/> which will be returned to the pool when disposed.
        /// </summary>
        public class CloudTableReference : IDisposable
        {
            /// <summary>
            /// The connection string
            /// </summary>
            private static readonly string ConnectionString = ConfigurationManager.AppSettings["StorageConnectionString"];

            /// <summary>
            /// The cloud table.
            /// </summary>
            private CloudTable cloudTable;

            /// <summary>
            /// The disposed.
            /// </summary>
            private bool disposed;

            /// <summary>
            /// Initializes a new instance of the <see cref="CloudTableReference"/> class.
            /// </summary>
            public CloudTableReference()
            {
                var table = CloudStorageAccount.Parse(ConnectionString)
                                               .CreateCloudTableClient()
                                               .GetTableReference("GameEvents");
                table.CreateIfNotExists();
                this.cloudTable = table;
            }

            /// <summary>
            /// Initializes a new instance of the <see cref="CloudTableReference"/> class.
            /// </summary>
            /// <param name="cloudTable">The cloud table.</param>
            public CloudTableReference(CloudTable cloudTable)
            {
                this.cloudTable = cloudTable;
            }

            /// <summary>
            /// Gets the cloud table.
            /// </summary>
            /// <value>
            /// The cloud table.
            /// </value>
            /// <exception cref="System.ObjectDisposedException">CloudTableReference was already disposed.</exception>
            public CloudTable CloudTable
            {
                get
                {
                    if (this.disposed)
                    {
                        throw new ObjectDisposedException("CloudTableReference");
                    }

                    return this.cloudTable;
                }
            }

            /// <summary>
            /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
            /// </summary>
            public void Dispose()
            {
                this.Dispose(true);
                GC.SuppressFinalize(this);
            }

            /// <summary>
            /// Releases unmanaged and - optionally - managed resources.
            /// </summary>
            /// <param name="disposing"><c>true</c> to release both managed and unmanaged resources; <c>false</c> to release only unmanaged resources.</param>
            private void Dispose(bool disposing)
            {
                if (this.disposed)
                {
                    return;
                }

                if (disposing)
                {
                    if (this.cloudTable != null)
                    {
                        Pool.Release(this);
                        this.cloudTable = null;
                    }
                }

                this.disposed = true;
            }
        }
    }
}