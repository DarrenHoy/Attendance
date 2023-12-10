if (typeof (views) == 'undefined') { views = {}; }

(function () {
    this.Students = function (apiService, navigationService, eventSource, localStorageService) {
        return {
            data: function () {
                return {
                    students: [],
                    recentlyViewed:[]
                }
            },
            template:
                `
                <h2>Students</h2>
                <recently-viewed title="Recently viewed students"
                                 :items="recentlyViewed"
                                 v-slot="recent"
                                 @itemSelected="studentSelected">
                    <a :href="routeLink(recent.item.id)" @click.prevent.stop="studentSelected(recent.item)" >
                        {{recent.item.firstName}} {{recent.item.surname}} ({{recent.item.studentNumber}})
                    </a>
                </recently-viewed>
                <h3>Search</h3>
                <active-search @search="setData" v-slot="searchResult" placeholder="Search by name or student number"
                    @itemSelected="studentSelected">
                    <student-card :student="searchResult.item"></student-card>
                </active-search>`,
            methods: {
                setData(searchModel, id) {
                    apiService.getStudents(searchModel.searchText)     
                        .then(data => searchModel.setResults(data, id));
                },
                studentSelected(student) {
                    localStorageService.pushStudent(student);
                    this.$router.push(`/students/${student.id}`);
                },
                routeLink(id) {
                    var url = this.$router.resolve(`/students/${id}`).href;
                    return url;
                }
            },
            components: {
                "active-search": components.ActiveSearch(),
                "student-card": components.StudentCard(),
                "recently-viewed":components.RecentlyViewedWidget()
            },
            beforeRouteEnter: (to, from, next) => {
                const recentlyViewed = localStorageService.getStudents();

                navigationService.navigate(to, from, next)
                    .then(() => next(vm => vm.recentlyViewed = recentlyViewed))
                    .catch(err => eventSource.emit('view-load-error', err))

            }
        }
    }
}).call(views);

