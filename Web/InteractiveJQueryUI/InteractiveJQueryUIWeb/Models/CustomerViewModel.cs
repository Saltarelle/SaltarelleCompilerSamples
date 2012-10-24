using System;
using System.Runtime.CompilerServices;

namespace InteractiveJQueryUIWeb.Models {
	[Serializable]
	#if CLIENT
	[PreserveMemberCase]
	#endif
	public class CustomerViewModel {
		public int? Id { get; set; }
		public string Name { get; set; }
		public int ProfitToDate { get; set; }
	}
}