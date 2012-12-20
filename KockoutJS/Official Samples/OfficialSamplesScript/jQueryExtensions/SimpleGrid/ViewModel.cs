namespace KnockoutApi.SimpleGrid
{
    using System.Runtime.CompilerServices;

    [Imported(IsRealType = true, IgnoreGenericArguments = true)]
    [ScriptNamespace("ko.simpleGrid")]
    [ScriptName("viewModel")]
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

        public ViewModel(Configuration<T> p)
        {
        }
    }
}