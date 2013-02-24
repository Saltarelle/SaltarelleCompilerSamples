namespace OfficialSamplesScript.PagedGrid
{
	using System;
	using KnockoutApi;
	using KnockoutApi.SimpleGrid;

	/// <summary>
	/// The view model is an abstract description of the state of the UI, but 
	/// without any knowledge of the UI technology (HTML).
	/// </summary>
	public class PagedGridViewModel
	{
		public PagedGridViewModel(Data[] items)
		{
			var self = this;

			Items = Knockout.ObservableArray(items);
			AddItem = () => self.Items.Push(new Data("New Item", 0, 100));
			SortByName = () => self.Items.Sort((a, b) => a.Name.CompareTo(b.Name));
            JumpToFirstPage = () => { self.GridViewModel.CurrentPageIndex.Value = 0; };
			GridViewModel = new ViewModel<Data>(new Configuration<Data> (
				pageSize: 4,
				data: self.Items,
				columns: Knockout.ObservableArray(new[] {
					new Column<Data>("Item Name", "name"), 
					new Column<Data>("Sales Count", "sales"), 
					new Column<Data>("Price", item => "R " + item.Price.ToFixed(2)) 
				}
			)));
		}

		public ObservableArray<Data> Items;
		public Action AddItem;
		public Action SortByName;
		public Action JumpToFirstPage;
		public ViewModel<Data> GridViewModel;
	}
}