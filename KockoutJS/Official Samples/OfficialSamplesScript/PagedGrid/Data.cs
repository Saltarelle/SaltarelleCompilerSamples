namespace OfficialSamplesScript.PagedGrid
{
	using System;
	using System.Runtime.CompilerServices;

	public class Data
	{
		public Data(string name, int sales, double price)
		{
			this.Name = name;
			this.Sales = sales;
			this.Price = price;
		}

		public string Name;
		public int Sales;
		public double Price;
	}
}