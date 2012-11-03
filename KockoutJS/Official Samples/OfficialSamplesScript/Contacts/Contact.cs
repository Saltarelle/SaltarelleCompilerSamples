namespace OfficialSamplesScript.Contacts
{
	using System;
	using System.Runtime.CompilerServices;

	using KnockoutApi;

	public class Contact
	{
		public string FirstName;
		public string LastName;
		public ObservableArray<Phone> Phones;
        
		public Contact(string firstName, string lastName, ObservableArray<Phone> phones)
        {
			this.FirstName = firstName;
			this.LastName = lastName;
			this.Phones = phones;
        }
	}
}