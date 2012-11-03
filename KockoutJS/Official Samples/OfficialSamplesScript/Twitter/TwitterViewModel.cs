namespace OfficialSamplesScript.Twitter
{
	using System;
	using System.Collections.Generic;
	using System.Html;
	using System.Runtime.CompilerServices;
	using System.Text.RegularExpressions;

	using KnockoutApi;

	/// <summary>
	/// this is the main view model
	/// </summary>
	public class TwitterViewModel
	{
		public TwitterViewModel(List<TweetGroup> lists, string selectedList)
		{
			var self = this;

			this.SavedLists = Knockout.ObservableArray(lists);
			this.EditingList = new TweetGroup(
				name: Knockout.Observable(selectedList),
				userNames: Knockout.ObservableArray<string>()
			);
			this.UserNameToAdd = Knockout.Observable("");
			this.CurrentTweets = Knockout.ObservableArray(new object[0]);
			this.FindSavedList = name => KnockoutUtils.ArrayFirst(self.SavedLists.Value, grp => grp.Name.Value == name, self);
			this.AddUser = () => {
				if (self.UserNameToAdd.Value != null && self.UserNameToAddIsValid.Value) {
					self.EditingList.UserNames.Push(self.UserNameToAdd.Value);
					self.UserNameToAdd.Value = "";
				}
			};
			this.RemoveUser = userName => self.EditingList.UserNames.Remove(userName);
            this.SaveChanges = new Action(OnSaveChanges);
			this.DeleteList = () => {
				var nameToDelete = self.EditingList.Name.Value;
                var savedListsExceptOneToDelete = self.SavedLists.Value.Filter(grp => grp.Name.Value != nameToDelete);
				self.EditingList.Name.Value = 
                    savedListsExceptOneToDelete.Length == 0
                        ? null 
                        : savedListsExceptOneToDelete[0].Name.Value;
				self.SavedLists.Value = savedListsExceptOneToDelete;
			};
			Knockout.Computed(() => {
				// Observe viewModel.editingList.name(), so when it changes 
				// (i.e., user selects a different list) we know to copy the 
				// saved list into the editing list
				var savedList = self.FindSavedList(self.EditingList.Name.Value);
				if (savedList != null) {
					var userNamesCopy = savedList.UserNames.Slice(0);
					self.EditingList.UserNames.Value = userNamesCopy;
				} else {
                    self.EditingList.UserNames.Value = new string[0];
				}
			});
			this.HasUnsavedChanges = Knockout.Computed(() => {
				if (self.EditingList.Name.Value == null) {
					return self.EditingList.UserNames.Value.Length > 0;
				}
				var savedData = self.FindSavedList(self.EditingList.Name.Value).UserNames;
				var editingData = self.EditingList.UserNames.Value;
				return savedData.Value.Join("|") != editingData.Join("|");
			});
			this.UserNameToAddIsValid = Knockout.Computed(() => {
					var pattern = @"^\s*[a-zA-Z0-9_]{1,15}\s*$";
					return self.UserNameToAdd.Value == "" || 
						   self.UserNameToAdd.Value.Match(new Regex(pattern, "g")) != null;
				});
			this.CanAddUserName = Knockout.Computed(() => {
				return self.UserNameToAddIsValid.Value && self.UserNameToAdd.Value != "";
			});
			// The active user tweets are (asynchronously) computed from editingList.userNames
			Knockout.Computed(() => {
			    TwitterApi.GetTweetsForUsers<object[]>(
			        self.EditingList.UserNames.Value,
                    result => {
                        self.CurrentTweets.Value = result;
                    });
			});
		}

        public void OnSaveChanges()
        {
            var saveAs = Window.Prompt("Erik Källén", this.EditingList.Name.Value);
            if (saveAs != null)
            {
                var dataToSave = (string[])this.EditingList.UserNames.Value.Slice(0);
                var existingSavedList = this.FindSavedList(saveAs);
                if (existingSavedList != null)
                {
                    // Overwrite existing list
                    existingSavedList.UserNames.Value = dataToSave;
                }
                else
                {
                    // Add new list
                    this.SavedLists.Push(new TweetGroup(
                        name: Knockout.Observable(saveAs),
                        userNames: Knockout.ObservableArray(dataToSave)));
                }
                this.EditingList.Name.Value = saveAs;
            }
        }

		public ObservableArray<TweetGroup> SavedLists;
		public TweetGroup EditingList;
		public Observable<string> UserNameToAdd;
		public ObservableArray<object> CurrentTweets;
		public Func<string, TweetGroup> FindSavedList;
		public Action AddUser;
		public DependentObservable<bool> UserNameToAddIsValid; 
		public Action<string> RemoveUser;
		public Action SaveChanges;
		public Action DeleteList;
		public DependentObservable<bool> HasUnsavedChanges;
		public DependentObservable<bool> CanAddUserName;
	}
}
