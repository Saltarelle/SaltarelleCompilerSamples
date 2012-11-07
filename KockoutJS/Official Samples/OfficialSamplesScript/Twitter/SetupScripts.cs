namespace OfficialSamplesScript.Twitter
{
    using System.Collections.Generic;
    using System.Html;
    using System.Runtime.CompilerServices;

	using KnockoutApi;

	using jQueryApi;

	public static class SetupScripts
	{
		public static void Setup()
		{
            var savedLists = new List<TweetGroup> {
					new TweetGroup(
						name: Knockout.Observable("Celebrities"), 
                        userNames: Knockout.ObservableArray(new[] {
                            "JohnCleese", 
                            "MCHammer", 
                            "StephenFry", 
                            "algore", 
                            "StevenSanderson"
                        })),
					new TweetGroup(
                        name: Knockout.Observable("Microsoft people"), 
                        userNames: Knockout.ObservableArray(new[] {
                            "BillGates", 
                            "shanselman", 
                            "ScottGu"
                        })),
					new TweetGroup(
						name: Knockout.Observable("Tech pundits"),
						userNames: Knockout.ObservableArray(new[] {
						    "Scobleizer", 
                            "LeoLaporte", 
                            "techcrunch",
                            "BoingBoing", 
                            "timoreilly",
                            "codinghorror"
						}))
				};
			Knockout.ApplyBindings(new TwitterViewModel(savedLists, "Tech pundits"));

			// Using jQuery for Ajax loading indicator - nothing to do with Knockout
			var loading = jQuery.Select(".loadingIndicator");
			jQueryEx.AjaxPrefilter(options => { options.Global = true; });
			jQuery.FromObject(Document.Instance).AjaxStart(() => loading.FadeIn()).AjaxStop(() => loading.FadeOut());
		}
	}
}