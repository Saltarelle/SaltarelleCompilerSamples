namespace OfficialSamplesScript.SimpleList
{
	using System;
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	public class SimpleListViewModel
	{
		public SimpleListViewModel(string[] items)
		{
			this.Items = Knockout.ObservableArray(items);
			this.ItemToAdd = Knockout.Observable("");

			var self = this;
			this.AddItem = () => {
				if (self.ItemToAdd.Value != "") {
					// Adds the item. Writing to the "items" observableArray 
					// causes any associated UI to update.
                    self.Items.Push(self.ItemToAdd.Value);
					// Clears the text box, because it's bound to the
					// "itemToAdd" observable
					self.ItemToAdd.Value = "";
				}
			};
		}

		public ObservableArray<string> Items;
		public Observable<string> ItemToAdd;
		public Action AddItem;
	}
}

