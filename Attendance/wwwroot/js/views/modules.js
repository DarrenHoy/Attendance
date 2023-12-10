if (typeof (views) == 'undefined') { views = {}; }

(function () {
    this.Modules = function (apiService, navigationService, eventSource, localStorageService) {
        return {
            data: function () {
                return {
                    modules: [],
                    recentlyViewed:[]
                }
            },
            template:
                `
                <h2>Modules</h2>
                <recently-viewed title="Recently viewed modules"
                                 :items="recentlyViewed"
                                 v-slot="recent"
                                 @itemSelected="moduleSelected">
                    <a :href="routeLink(recent.item.id)" @click.prevent.stop="moduleSelected(recent.item)" >
                        {{recent.item.code}} {{recent.item.title}}
                    </a>
                </recently-viewed>
                <h3>Search</h3>
                <active-search @search="setData" v-slot="searchResult" placeholder="Search by name or code"
                    @itemSelected="moduleSelected">
                    {{searchResult.item.code}} {{searchResult.item.title}}
                </active-search>`,
            methods: {
                setData(searchModel, id) {
                    apiService.getModules(searchModel.searchText)     
                        .then(data => searchModel.setResults(data, id));
                },
                moduleSelected(module) {
                    console.log("Selected");
                    localStorageService.pushModule(module);
                    this.$router.push(`/modules/${module.id}`);
                },
                routeLink(id) {
                    var url = this.$router.resolve(`/modules/${id}`).href;
                    return url;
                }

            },
            components: {
                "active-search": components.ActiveSearch(),
                /*"module-card": components.ModuleCard(),*/
                "recently-viewed":components.RecentlyViewedWidget()
            },
            beforeRouteEnter: (to, from, next) => {
                const recentlyViewed = localStorageService.getModules();

                navigationService.navigate(to, from, next)
                    .then(() => next(vm => vm.recentlyViewed = recentlyViewed))
                    .catch(err => eventSource.emit('view-load-error', err))

            }
        }
    }
}).call(views);

