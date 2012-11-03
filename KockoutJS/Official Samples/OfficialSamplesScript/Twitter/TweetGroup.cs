namespace OfficialSamplesScript.Twitter
{
	using System;
	using System.Runtime.CompilerServices;

	using KnockoutApi;

	public class TweetGroup
	{
		public TweetGroup(Observable<string> name, ObservableArray<string> userNames)
		{
			this.Name = name;
			this.UserNames = userNames;
		}

        public Observable<string> Name;
        public ObservableArray<string> UserNames;
	}
}