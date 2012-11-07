namespace OfficialSamplesScript.WorkingWithCollections
{
	using System;
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	/// <summary>
	/// The view model is an abstract description of the state of the UI, but 
	/// without any knowledge of the UI technology (HTML).
	/// </summary>
	public class WorkingWithCollectionsViewModel
	{
		public Array People = new[]
			{
				new Person("Annabelle", new[] { "Arnie", "Anders", "Apple" }),
				new Person("Bertie", new[] { "Boutros-Boutros", "Brianna", "Barbie", "Bee-bop" }),
				new Person("Charles", new[] { "Cayenne", "Cleopatra" })
			};

		public Observable<bool> ShowRenderTimes = Knockout.Observable(false);
	}
}