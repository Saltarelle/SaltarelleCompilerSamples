namespace OfficialSamplesScript.ShoppingCart
{
	using System;
	using System.Runtime.CompilerServices;

	/// <summary>
	/// this object is used as the sending format
	/// </summary>
	public class SaveableProduct
	{
		public string ProductName;
		public double Quantity;

        public SaveableProduct(string productName, double quantity)
        {
            this.ProductName = productName;
            this.Quantity = quantity;
        }
	}
}