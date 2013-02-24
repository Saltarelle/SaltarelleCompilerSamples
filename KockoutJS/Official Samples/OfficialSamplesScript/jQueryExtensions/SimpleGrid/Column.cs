namespace KnockoutApi.SimpleGrid
{
    using System;
    using System.Runtime.CompilerServices;

    [ScriptNamespace("ko.simpleGrid")]
    [Serializable]
    [Imported(IsRealType = true, IgnoreGenericArguments = true)]
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