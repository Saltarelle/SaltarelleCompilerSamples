namespace OfficialSamplesScript.ClickCounter
{
	using System;
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	public class ClickCounterViewModel
	{
		public ClickCounterViewModel()
		{
			var self = this;

			this.NumberOfClicks = Knockout.Observable(0);
			this.RegisterClick = () => self.NumberOfClicks.Value = self.NumberOfClicks.Value + 1;
			this.ResetClicks = () => self.NumberOfClicks.Value = 0;
			this.HasClickedTooManyTimes = Knockout.Computed(() => self.NumberOfClicks.Value >= 3);
		}

		public Observable<int> NumberOfClicks;
		public Action RegisterClick;
		public Action ResetClicks;
		public DependentObservable<bool> HasClickedTooManyTimes;
	}
}
