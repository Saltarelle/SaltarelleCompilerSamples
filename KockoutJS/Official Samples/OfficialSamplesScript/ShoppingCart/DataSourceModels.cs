namespace OfficialSamplesScript.ShoppingCart
{
	using System.Runtime.CompilerServices;

	// these two are for reading the data file

	public class Category
	{
		public string Name;
		public Product[] Products;
	}

	public class Product
	{
		public string Name;
		public double Price;
	}
}