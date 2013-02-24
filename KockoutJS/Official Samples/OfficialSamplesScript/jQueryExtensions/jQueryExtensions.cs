namespace OfficialSamplesScript.Gifts
{
	using System;
	using System.Html;
	using System.Runtime.CompilerServices;
	using KnockoutApi;

	using jQueryApi;

	[Imported]
	public static class JavaScriptExtensions
	{
		[InstanceMethodOnFirstArgument]
		public static jQueryObject Validate(this jQueryObject obj, ValidationOptions options)
		{
			return obj;
		}
	}

	[Serializable]
	[Imported]
	public class ValidationOptions
	{
		public object SubmitHandler;

		[ObjectLiteral]
		public ValidationOptions(object submitHandler = null)
		{
			this.SubmitHandler = submitHandler;
		}
	}
}

