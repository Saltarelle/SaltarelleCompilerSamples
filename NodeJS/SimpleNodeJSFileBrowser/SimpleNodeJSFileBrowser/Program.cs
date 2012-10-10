using System;
using System.Threading.Tasks;
using NodeJS.FSModule;
using NodeJS.HttpModule;
using NodeJS.PathModule;
using NodeJS.UrlModule;

namespace SimpleNodeJSFileBrowser {
    public class Program {
        public static void Main() {
            var server = Http.CreateServer(async (req, res) => {
                try {
                    var url = Url.Parse(req.Url);
                    var path = url.Path;
                    if (path.StartsWith("/"))
                        path = path.Substr(1);
                    if (path.EndsWith("/"))
                        path = path.Substr(0, path.Length - 1);
                    
                    var physicalPath = "C:\\" + string.DecodeUri(Path.Normalize(path.Replace("/", Path.Sep)));
                    
                    res.Write("<html><body>");
                    
                    string[] files;
                    try {
                        files = await FS.ReaddirTask(physicalPath);
                    }
                    catch (AggregateException ex) {
                        res.Write("Error reading directory:<br>");
                        foreach (var m in ex.InnerExceptions) {
                            res.Write(m.Message + "<br>");
                        }
                        res.Write("</body></html>");
                        return;
                    }
                    
                    Task<Stats>[] statTasks = files.Map(f => FS.StatTask(physicalPath + "\\" + f));
                    
                    if (files.Length == 0) {
                        res.Write("The directory is empty");
                        res.Write("</body></html>>");
                        return;
                    }
                    
                    try {
                        await Task.WhenAll(statTasks);
                    }
                    catch (AggregateException) {
                    }
                    
                    res.Write("<ul>");
                    
                    if (path != "") {
                        res.Write("<li><a href=\"/" + Path.Normalize(path + Path.Sep + "..") + "\">..</a></li>");
                    }
                    
                    for (int i = 0; i < files.Length; i++) {
                        res.Write("<li>");
                        if (statTasks[i].IsFaulted) {
                            res.Write(files[i] + ": Error retrieving stats: " + statTasks[i].Exception.InnerExceptions[0].Message);
                        }
                        else {
                            var stats = statTasks[i].Result;
                            if (stats.IsDirectory()) {
                                var newPath = "/" + (path != "" ? path + "/" : "") + files[i];
                                res.Write("<a href=\"" + newPath + "\">" + files[i] + "</a>");
                            }
                            else {
                                res.Write(files[i] + ": " + statTasks[i].Result.Size + "B");
                            }
                        }
                        res.Write("</li>");
                    }
                    
                    res.Write("</ul></body></html>");
                }
                finally {
                    res.End();
                }
            });
			server.Listen(8000);
        }
    }
}
