namespace OfficialSamplesScript.WorkingWithCollections
{
	using System;
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	/// <summary>
	/// Define a "Person" class that tracks its own name and children, and has 
	/// a method to add a new child.
	/// </summary>
	public class Person
	{
		public Person(string name, string[] children)
		{
			Name = Knockout.Observable(name);
			Children = Knockout.ObservableArray(children);

			var self = this;
			AddChild = () => self.Children.Push("New Child");
		}

        public Observable<string> Name;
        public ObservableArray<string> Children;
		public Action AddChild;
	}
}