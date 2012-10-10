using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using jQueryApi;

namespace HelloWorldScript {
    public class MessageFlasher {
	    private readonly string _buttonId;
	    private readonly string _containerId;

	    public MessageFlasher(string buttonId, string containerId) {
		    _buttonId = buttonId;
		    _containerId = containerId;
	    }

	    public void Attach() {
			jQuery.Select("#" + _buttonId).Click(async evt => {
				var newEl = jQuery.FromHtml("<div>Hello, world</div>");
				newEl.Hide();
				jQuery.Select("#" + _containerId).Append(newEl);
				await newEl.FadeInTask(500);
				await newEl.FadeOutTask(500);
			});
		}
    }
}