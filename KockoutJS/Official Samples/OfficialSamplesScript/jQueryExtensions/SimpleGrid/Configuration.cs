namespace KnockoutApi.SimpleGrid
{
	using System;
	using System.Runtime.CompilerServices;

	[ScriptNamespace("ko.simpleGrid")]
	[Serializable]
	[Imported(IsRealType = true, IgnoreGenericArguments = true)]
	public class Configuration<T>
	{
		[ObjectLiteral]
		public Configuration(ObservableArray<T> data, ObservableArray<Column<T>> columns)
		{
			this.Data = data;
			this.Columns = columns;
		}

		[ObjectLiteral]
		public Configuration(ObservableArray<T> data, ObservableArray<Column<T>> columns, int pageSize)
		{
			this.PageSize = pageSize;
			this.Data = data;
			this.Columns = columns;
		}

		[IntrinsicProperty]
		public int PageSize { get; set; }

		[IntrinsicProperty]
		public ObservableArray<T> Data { get; set; }

		[IntrinsicProperty]
		public ObservableArray<Column<T>> Columns { get; set; }
	}
}