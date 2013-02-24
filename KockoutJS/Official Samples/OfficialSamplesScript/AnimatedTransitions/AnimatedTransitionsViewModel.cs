namespace OfficialSamplesScript.AnimatedTransitions
{
	using System;
	using System.Html;
	using System.Runtime.CompilerServices;
	using KnockoutApi;
	using KnockoutApi.SimpleGrid;

	using jQueryApi;

	/// <summary>
	/// The view model is an abstract description of the state of the UI, but 
	/// without any knowledge of the UI technology (HTML).
	/// </summary>
	public class AnimatedTransitionsViewModel
	{
		public AnimatedTransitionsViewModel()
		{
			var self = this;

			Planets = Knockout.ObservableArray(new[]{
				new Planet( name: "Mercury", type: "rock"),
				new Planet( name: "Venus", type: "rock"),
				new Planet( name: "Earth", type: "rock"),
				new Planet( name: "Mars", type: "rock"),
				new Planet( name: "Jupiter", type: "gasgiant"),
				new Planet( name: "Saturn", type: "gasgiant"),
				new Planet( name: "Uranus", type: "gasgiant"),
				new Planet( name: "Neptune", type: "gasgiant"),
				new Planet( name: "Pluto", type: "rock")
			});

			TypeToShow = Knockout.Observable("all");
			DisplayAdvancedOptions = Knockout.Observable(false);
			AddPlanet = type => self.Planets.Push(new Planet("New planet", type));

			PlanetsToShow = Knockout.Computed(() =>
				{
					// Represents a filtered list of planets
					// i.e., only those matching the "typeToShow" condition
				    var desiredType = self.TypeToShow.Value;

					if (desiredType == "all") return self.Planets.Value;
					return KnockoutUtils.ArrayFilter(self.Planets.Value, planet => planet.Type == desiredType);
				});

			// Animation callbacks for the planets list
			ShowPlanetElement = elem => {
				if (elem.NodeType == ElementType.Element) 
					jQuery.FromElement(elem).Hide().SlideDown();
			};
			HidePlanetElement = elem => {
				if (elem.NodeType == ElementType.Element) 
					jQuery.FromElement(elem).SlideUp(EffectDuration.Slow, () => jQuery.FromElement(elem).Remove());
			};

			// Here's a custom Knockout binding that makes elements 
			// shown/hidden via jQuery's fadeIn()/fadeOut() methods
			//Could be stored in a separate utility library
            Knockout.BindingHandlers["fadeVisible"] = new InlineBindingHandler<Observable<bool>>(
				init: (element, valueAccessor, allBindingsAccessor, model) => {
					// Initially set the element to be instantly visible/hidden
					// depending on the value
                    var value = valueAccessor.Invoke();

					// Use "unwrapObservable" so we can handle values that may 
					// or may not be observable
					jQuery.FromElement(element).Toggle(KnockoutUtils.UnwrapObservable(value)); 
				},
				update: (element, valueAccessor, allBindingsAccessor, model) => {
					// Whenever the value subsequently changes, slowly fade the
					// element in or out
                    var value = valueAccessor.Invoke();
					if (KnockoutUtils.UnwrapObservable(value)) jQuery.FromElement(element).FadeIn();
					else jQuery.FromElement(element).FadeOut();
				}
			);
		}

        public ObservableArray<Planet> Planets;
        public Observable<string> TypeToShow;
		public Observable<bool> DisplayAdvancedOptions;
		public Action<string> AddPlanet;
		public ComputedObservable<Planet[]> PlanetsToShow;

		public Action<Element> ShowPlanetElement;
		public Action<Element> HidePlanetElement;
	}
}
