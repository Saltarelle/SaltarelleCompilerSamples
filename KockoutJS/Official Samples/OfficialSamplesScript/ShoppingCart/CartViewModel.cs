namespace OfficialSamplesScript.ShoppingCart
{
	using System;
	using System.Collections.Generic;
	using System.Html;
	using System.Serialization;

	using KnockoutApi;

	/// <summary>
	/// this is the main view model
	/// </summary>
	public class CartViewModel
	{
		public CartViewModel()
		{
			var self = this;

			self.Lines = Knockout.ObservableArray(new List<CartLineViewModel> { new CartLineViewModel() });
			self.GrandTotal = Knockout.Computed(() => {
				var total = 0.0;
                self.Lines.Value.ForEach(item => { total += item.Subtotal.Value; });
				return total;
			});

			// Operations
			self.AddLine = () => self.Lines.Push(new CartLineViewModel());
			self.RemoveLine = item => self.Lines.Remove(item);
			self.Save = () => {
				var dataToSave = self.Lines.Value.Map(line => {
                    var product = line.Product.Value;
					return product != null
                        ? new SaveableProduct(product.Name, line.Quantity.Value) 
						: null;
				});
				Window.Alert("Could now send this to server: " + Json.Stringify(dataToSave));
			};
		}

        public ObservableArray<CartLineViewModel> Lines;
        public DependentObservable<double> GrandTotal;
		public Action AddLine;
		public Action<CartLineViewModel> RemoveLine;
		public Action Save;
	}
}