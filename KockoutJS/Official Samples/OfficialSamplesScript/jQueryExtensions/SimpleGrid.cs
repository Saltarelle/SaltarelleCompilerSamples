namespace KnockoutApi.SimpleGrid
{
	using System;
	using System.Runtime.CompilerServices;

	[ScriptNamespace("ko.simpleGrid")]
	[IgnoreGenericArguments]
	[ScriptName("viewModelConfiguration")]
	[Serializable]
	[Imported(IsRealType = true)]
	public class ViewModelConfiguration<T>
	{
		[ObjectLiteral]
		public ViewModelConfiguration(ObservableArray<T> data, ObservableArray<Column<T>> columns)
		{
			this.Data = data;
			this.Columns = columns;
		}

		[ObjectLiteral]
		public ViewModelConfiguration(ObservableArray<T> data, ObservableArray<Column<T>> columns, int pageSize)
		{
			this.PageSize = pageSize;
			this.Data = data;
			this.Columns = columns;
		}

		[ObjectLiteral]
		public ViewModelConfiguration(ObservableArray<T> data, ObservableArray<Column<T>> columns, int pageSize, int currentPageIndex)
		{
			this.CurrentPageIndex = currentPageIndex;
			this.PageSize = pageSize;
			this.Data = data;
			this.Columns = columns;
		}

		[IntrinsicProperty]
		public int CurrentPageIndex { get; set; }
		[IntrinsicProperty]
		public int PageSize { get; set; }
		[IntrinsicProperty]
		public ObservableArray<T> Data { get; set; }
		[IntrinsicProperty]
		public ObservableArray<Column<T>> Columns { get; set; }
	}

	[Imported(IsRealType = true)]
	[ScriptNamespace("ko.simpleGrid")]
	[ScriptName("viewModel")]
	[IgnoreGenericArguments]
	public class ViewModel<T>
	{
		[IntrinsicProperty]
		public Observable<int> CurrentPageIndex { get; set; }
		[IntrinsicProperty]
        public Observable<int> PageSize { get; set; }
		[IntrinsicProperty]
        public ObservableArray<T> Data { get; set; }
		[IntrinsicProperty]
        public ObservableArray<Column<T>> Columns { get; set; }

		public ViewModel(ViewModelConfiguration<T> p)
		{
		}
	}

	[ScriptNamespace("ko.simpleGrid")]
	[ScriptName("viewModelColumn")]
	[IgnoreGenericArguments]
	[Serializable]
	[Imported(IsRealType = true)]
	public class Column<T>
	{
		[ObjectLiteral]
		public Column(string headerText, object rowText)
		{
			this.HeaderText = headerText;
			this.RowText = rowText;
		}

		[ObjectLiteral]
		public Column(string headerText, Func<T, object> rowFunc)
		{
			this.HeaderText = headerText;
			this.RowFunc = rowFunc;
		}

		[IntrinsicProperty]
		public string HeaderText { get; set; }

		[IntrinsicProperty]
		public object RowText { get; set; }

		[ScriptName("rowText")]
		[IntrinsicProperty]
		public Func<T, object> RowFunc { get; set; }
	}
}