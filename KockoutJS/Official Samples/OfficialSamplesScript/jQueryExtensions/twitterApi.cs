namespace OfficialSamplesScript.Twitter
{
    using System;
    using System.Runtime.CompilerServices;

	[IgnoreNamespace]
    [ScriptName("twitterApi")]
    [Imported]
	public class TwitterApi
	{
		public static void GetTweetsForUsers<T>(string[] usernames, Action<T> currentTweets) {}
	}
}