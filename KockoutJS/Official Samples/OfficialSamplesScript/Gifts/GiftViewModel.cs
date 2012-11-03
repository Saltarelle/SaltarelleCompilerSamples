namespace OfficialSamplesScript.Gifts
{
	using System;
	using System.Html;
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	using jQueryApi;

	public class GiftViewModel
	{
		public GiftViewModel(Gift[] gifts)
		{
			var self = this;

			self.Gifts = Knockout.ObservableArray(gifts);
			self.AddGift = () => self.Gifts.Push(new Gift(name: "", price: 0));
			self.RemoveGift = gift => self.Gifts.Remove(gift);
			self.Save = () => Window.Alert("Could now transmit to server: " + KnockoutUtils.StringifyJson(self.Gifts));
		}

        public ObservableArray<Gift> Gifts;
		public Action AddGift;
		public Action<Gift> RemoveGift;
		public Action Save;
	}
}

