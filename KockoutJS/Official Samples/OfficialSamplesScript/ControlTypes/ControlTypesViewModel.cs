namespace OfficialSamplesScript.ControlTypes
{
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	public class ControlTypesViewModel
	{
		public ControlTypesViewModel()
		{
			StringValue = Knockout.Observable("Hello");
			PasswordValue = Knockout.Observable("mypass");
			BooleanValue = Knockout.Observable(true);
			OptionValues = Knockout.ObservableArray(new[] { "Alpha", "Beta", "Gamma" });
			SelectedOptionValue = Knockout.Observable("Gamma");
			MultipleSelectedOptionValues = Knockout.ObservableArray(new[] { "Alpha" });
			RadioSelectedOptionValue = Knockout.Observable("Beta");
		}

		public Observable<string> StringValue;
		public Observable<string> PasswordValue;
		public Observable<bool> BooleanValue;
		public ObservableArray<string> OptionValues;
		public Observable<string> SelectedOptionValue;
		public ObservableArray<string> MultipleSelectedOptionValues;
		public Observable<string> RadioSelectedOptionValue;
	}
}


