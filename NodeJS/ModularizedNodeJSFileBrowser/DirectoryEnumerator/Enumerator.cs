using System;
using System.Collections.Generic;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using NodeJS.FSModule;

namespace DirectoryEnumerator {
	[IgnoreNamespace]
	public class Enumerator {
		public static async Task<List<DirectoryEntry>> EnumerateDirectory(string physicalPath) {
			string[] files = await FS.ReaddirTask(physicalPath);

			Task<Stats>[] statTasks = files.Map(f => FS.StatTask(physicalPath + "\\" + f));

			try {
				await Task.WhenAll(statTasks);
			}
			catch (AggregateException) {
			}

			var result = new List<DirectoryEntry>();
			for (int i = 0; i < files.Length; i++) {
				var t = statTasks[i];
				if (t.IsFaulted) {
					result.Add(new DirectoryEntry(files[i], ((JsErrorException)t.Exception.InnerExceptions[0]).Error));
				}
				else {
					result.Add(new DirectoryEntry(files[i], t.Result.IsDirectory(), t.Result.Size, null));
				}
			}

			return result;
		}
	}
}
