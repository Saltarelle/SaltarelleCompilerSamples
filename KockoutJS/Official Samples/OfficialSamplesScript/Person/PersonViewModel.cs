using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using KnockoutApi;

namespace OfficialSamplesScript.Person
{
    public class PersonViewModel
    {
        public PersonViewModel()
        {
            var self = this;

            this.FirstName = Knockout.Observable("Matthew");
            this.LastName = Knockout.Observable("Leibowitz");

            // Note: 
            // Here are two ways to pass the correct 'this' to the function:

            // 1. using a variable:

            this.FullName = Knockout.Computed(() => self.FirstName.Value + " " + self.LastName.Value);

            // 2. or using the Delegate.ThisFix:

            //FullName = Knockout.Computed(Delegate.ThisFix((PersonViewModel correct) => {
            //	return correct.FirstName.Get() + " " + correct.LastName.Get();
            //}), this);

            // AND, there is way to perform the updates to the computed object

            //var options = new DependentObservableOptions<string>();
            //options.GetValueFunction = () => self.FirstName.Value + " " + self.LastName.Value;
            //options.SetValueFunction = s =>
            //{
            //    s = s.Trim();
            //    var index = s.IndexOf(" ");
            //    if (index == -1)
            //    {
            //        self.FirstName.Value = s;
            //        self.LastName.Value = string.Empty;
            //    }
            //    else
            //    {
            //        self.FirstName.Value = s.Substring(0, index);
            //        self.LastName.Value = s.Substring(index + 1, s.Length);
            //    }
            //};
            //this.FullName = Knockout.Computed(options);
        }

        public Observable<string> FirstName;
        public Observable<string> LastName;
        public DependentObservable<string> FullName;
    }
}
