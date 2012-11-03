namespace OfficialSamplesScript.ShoppingCart
{
    using System;

    using KnockoutApi;

	/// <summary>
	/// this is the line items
	/// </summary>
	public class CartLineViewModel
	{
		public CartLineViewModel()
		{
			var self = this;

			self.Category = Knockout.Observable<string>();
			self.Product = Knockout.Observable<Product>();
			self.Quantity = Knockout.Observable(1);
            self.Subtotal = Knockout.Computed(
                    () => self.Product.Value != null 
                        ? self.Product.Value.Price * int.Parse("0" + self.Quantity.Value, 10)
                        : 0);
			
			// Whenever the category changes, reset the product selection
            self.Category.Subscribe(val => { self.Product.Value = null; });
		}

        public Observable<string> Category;
        public Observable<Product> Product;
        public Observable<int> Quantity;
        public DependentObservable<double> Subtotal;
	}
}