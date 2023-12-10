if (typeof (views) == 'undefined') { views = {}; }

(function () {
    this.Module =
        function (apiService, navigationService, eventSource, localStorageService) {
            return {
                data: function () {
                    return {
                        module: {},
                        registrations: [],
                        classLists:[]
                    }
                },
                template:
                `
                    <h2>{{module.title}}</h2>
                    <h3>Registered Students</h3>
                    <div v-if="this.registrations.length > 0">
                        <div v-for="registration in registrations">
                            {{registration.student.firstName}} {{registration.student.surname}}
                        </div>
                    </div>
                    <div v-else>
                        No students registered
                    </div>

                    <h3>Class Lists</h3>
                    <div v-if="this.classLists.length > 0">
                        <div v-for="classList in classLists">
                            {{classList.title}}
                        </div>
                    </div>
                    <div v-else>
                        No class lists are defined for this module
                    </div>
                `,
                beforeRouteEnter: (to, from, next) => {
                    navigationService.navigate(to, from, next)
                        .then(() => {

                            return Promise.all([
                                apiService.getCourseModule(to.params.id),
                                apiService.getCourseModuleRegisteredStudents(to.params.id),
                                apiService.getCourseModuleClassLists(to.params.id)]);
                                
                        })
                        .then(([module, registrations, classLists]) => next(vm => {
                            vm.module = module;
                            vm.classLists = classLists;
                            vm.registrations = registrations;
                        }))
                        .catch(err => eventSource.emit('view-load-error', err))
                }
            }
        }
}).call(views);