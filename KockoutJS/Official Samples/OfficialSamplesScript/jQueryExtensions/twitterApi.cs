namespace OfficialSamplesScript.Twitter
{
    using System;
    using System.Runtime.CompilerServices;

	[IgnoreNamespace]
    [ScriptName("twitterApi")]
    [Imported(IsRealType = true)]
	public class TwitterApi
	{
		public static void GetTweetsForUsers<T>(string[] usernames, Action<T> currentTweets) {}
	}
}