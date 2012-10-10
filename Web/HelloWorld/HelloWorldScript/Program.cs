using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using jQueryApi;

namespace HelloWorldScript {
    public class Program {
		private void Attach() {
			new MessageShower("showMessage", "messageContainer").Attach();
			new MessageFlasher("flashMessage", "messageContainer").Attach();
		}

        static void Main() {
			jQuery.OnDocumentReady(new Program().Attach);
        }
    }
}