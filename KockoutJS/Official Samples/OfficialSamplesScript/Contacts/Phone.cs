namespace OfficialSamplesScript.Contacts
{
	using System;
	using System.Runtime.CompilerServices;

	public class Phone
	{
		public string Type;
		public string Number;

		public Phone(string type, string number)
		{
			this.Type = type;
			this.Number = number;
		}
	}
}