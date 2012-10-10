using System;
using System.Collections.Generic;
using DirectoryEnumerator;
using NodeJS.HttpModule;
using NodeJS.PathModule;
using NodeJS.UrlModule;

namespace ModularizedNodeJSFileBrowser {
	class Program {
		static void Main() {
			Http.CreateServer(async (req, res) => {
				try {
					var url = Url.Parse(req.Url);
					var path = url.Path;
					if (path.StartsWith("/"))
						path = path.Substr(1);
					if (path.EndsWith("/"))
						path = path.Substr(0, path.Length - 1);

					var physicalPath = "C:\\" + string.DecodeUri(Path.Normalize(path));

					List<DirectoryEntry> content;
					try {
						content = await Enumerator.EnumerateDirectory(physicalPath);
					}
					catch (Exception ex) {
						if (ex is AggregateException)
							ex = ((AggregateException)ex).InnerExceptions[0];
						res.Write("<html><body>");
						res.Write("Error reading directory:<br>");
						res.Write(ex.Message + "<br>");
						res.Write("</body></html>>");
						return;
					}

					res.Write("<html><body>");

					if (content.Count == 0) {
						res.Write("The directory is empty");
					}
					else {
						res.Write("<ul>");
						if (path != "") {
							res.Write("<li><a href=\"/" + Path.Normalize(path + Path.Sep + "..") + "\">..</a></li>");
						}

						foreach (var entry in content) {
							res.Write("<li>");
							if (entry.Error != null) {
								res.Write(entry + ": " + entry.Error.Message);
							}
							else {
								if (entry.IsDirectory.Value) {
									var newPath = "/" + (path != "" ? path + "/" : "") + entry.Name;
									res.Write("<a href=\"" + newPath + "\">" + entry.Name + "</a>");
								}
								else {
									res.Write(entry.Name + ": " + entry.Size + "B");
								}
							}
							res.Write("</li>");
						}
						res.Write("</ul>");
					}
					res.Write("</body></html>");
				}
				finally {
					res.End();
				}
			}).Listen(8000);
		}
	}
}
