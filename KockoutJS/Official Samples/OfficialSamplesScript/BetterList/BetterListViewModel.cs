namespace OfficialSamplesScript.BetterList
{
	using System;
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	public class BetterListViewModel
	{
		public BetterListViewModel()
		{
			var self = this;

			ItemToAdd = Knockout.Observable("");
			// Initial items
			AllItems = Knockout.ObservableArray(new[] { "Fries", "Eggs Benedict", "Ham", "Cheese" });
			// Initial selection
			SelectedItems = Knockout.ObservableArray(new[] { "Ham" });
			AddItem = () => {
				// Prevent blanks and duplicates
				if (self.ItemToAdd.Value != "" && (self.AllItems.IndexOf(self.ItemToAdd.Value) < 0)) {
                    self.AllItems.Push(self.ItemToAdd.Value);
					// Clear the text box
                    self.ItemToAdd.Value = "";
				}
			};
			RemoveSelected = () => {
                self.AllItems.RemoveAll(self.SelectedItems.Value);
				// Clear selection
                self.SelectedItems.Value = new string[] { };
			};
			SortItems = () => self.AllItems.Sort();
		}

		public Observable<string> ItemToAdd;
		public ObservableArray<string> AllItems;
		public ObservableArray<string> SelectedItems;
		public Action AddItem;
		public Action RemoveSelected;
		public Action SortItems;
	}
}
