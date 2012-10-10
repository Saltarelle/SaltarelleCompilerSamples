using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using jQueryApi;

namespace HelloWorldScript {
    public class MessageShower {
	    private readonly string _buttonId;
	    private readonly string _containerId;

	    public MessageShower(string buttonId, string containerId) {
		    _buttonId = buttonId;
		    _containerId = containerId;
	    }

	    public void Attach() {
			jQuery.Select("#" + _buttonId).Click(evt => {
				var newEl = jQuery.FromHtml("<div>Hello, world</div>");
				jQuery.Select("#" + _containerId).Append(newEl);
			});
		}
    }
}