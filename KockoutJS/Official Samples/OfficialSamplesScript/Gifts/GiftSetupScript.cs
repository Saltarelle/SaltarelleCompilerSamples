namespace OfficialSamplesScript.Gifts
{
    using System;
    using System.Html;
    using System.Runtime.CompilerServices;

    using jQueryApi;

    using KnockoutApi;

    public static class GiftsSetupScript
    {
        public static void Setup()
        {
            var viewModel = new GiftViewModel(new[] {
				new Gift(name: "Tall Hat", price: 39.95), 
				new Gift(name: "Long Cloak", price: 120.00)
			});
            Knockout.ApplyBindings(viewModel);

            // Activate jQuery Validation
            var vm = viewModel;
            jQuery.Select("form", Window.Document).Validate(new ValidationOptions(submitHandler: vm.Save));
        }
    }
}