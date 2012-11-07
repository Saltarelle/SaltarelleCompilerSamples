namespace OfficialSamplesScript.Contacts
{
	using System;
	using System.Collections.Generic;
	using System.Runtime.CompilerServices;
	using System.Serialization;

	using KnockoutApi;

	using jQueryApi;

	/// <summary>
	/// The view model is an abstract description of the state of the UI, but 
	/// without any knowledge of the UI technology (HTML).
	/// </summary>
	public class ContactsViewModel
	{
		public ContactsViewModel(List<Contact> contacts)
		{
			var self = this;

            self.Contacts = Knockout.ObservableArray(KnockoutUtils.ArrayMap(
                contacts,
                contact => new Contact(
                    firstName: contact.FirstName,
                    lastName: contact.LastName,
                    phones: Knockout.ObservableArray(contact.Phones.Value))
            ));
            self.AddContact = () => self.Contacts.Push(new Contact(
                firstName: "",
                lastName: "",
                phones: Knockout.ObservableArray<Phone>()));
            self.RemoveContact = contact => self.Contacts.Remove(contact);
			self.AddPhone = contact => contact.Phones.Push(new Phone(type: "", number: ""));
            self.RemovePhone = phone => jQuery.Each(self.Contacts.ToList(), (index, value) => value.Phones.Remove(phone));
            self.Save = () => {
                self.LastSavedJson.Value = Json.Stringify(Knockout.ToObject(self.Contacts), (string[])null, 2);
            };
            self.LastSavedJson = Knockout.Observable("");
		}

		public ObservableArray<Contact> Contacts;
		public Action AddContact;
		public Action<Contact> RemoveContact;
		public Action<Contact> AddPhone;
		public Action<Phone> RemovePhone;
		public Action Save;
        public Observable<string> LastSavedJson;
	}
}
