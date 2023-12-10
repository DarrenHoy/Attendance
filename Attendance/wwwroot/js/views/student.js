if (typeof (views) == 'undefined') { views = {}; }

(function () {
    this.Student =
        function (apiService, navigationService, eventSource) {
            return {
                props: ["id"],
                data:
                    function () {
                        return {
                            student: {}
                        }
                    },
                template:
                `
                    <h2>{{student.firstName}} {{student.surname}}</h2>
                `,
                beforeRouteEnter: (to, from, next) => {
                    navigationService.navigate(to, from, next)
                        .then(() => {
                            return apiService.getStudent(to.params.id);
                        })
                        .then(student => next(vm => vm.student = student))
                        .catch(err => eventSource.emit('view-load-error', err))
                }
            }
        }
}).call(views)