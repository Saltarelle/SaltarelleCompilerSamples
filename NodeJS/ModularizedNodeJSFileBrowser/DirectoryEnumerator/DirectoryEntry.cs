using System;
using System.Runtime.CompilerServices;

namespace DirectoryEnumerator {
	[Imported]
	[Serializable]
	public class DirectoryEntry {
		public string Name { get; private set; }
		public bool? IsDirectory { get; private set; }
		public int? Size {  get; private set; }
		public Error Error { get; private set; }

		public DirectoryEntry(string name, bool? isDirectory, int? size, Error error) {
		}

		public DirectoryEntry(string name, Error error) {
		}
	}
}
