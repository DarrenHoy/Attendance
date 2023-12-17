// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

const eventSource = mitt();

const navigationService = {
    navigate(to, from, next) {
        eventSource.emit('navigation-out');

        const navigate = (resolve) => {
            eventSource.emit('navigate', { url: to, next });
            resolve();
        }

        return new Promise((resolve, reject) => {
            setTimeout(navigate.bind(null, resolve), 200);
        });
        
    }
};

const apiService = services.ApiService();

const localStorageService = (function () {

    const take = n => list => {
        let trimmedList = [];
        for (i = 0; i < n; i++) {
            if (list[i]) {
                trimmedList.push(list[i]);
            }
        }
        return trimmedList;
    }

    const trim = take(10);

    const sortedList = list => Object.entries(list).sort(([_a, a], [_b, b]) => b.accessed - a.accessed)

    const updateRecentlyViewed = (item,identifier) => recentlyViewed => {
        let list = JSON.parse(recentlyViewed);
        const id = identifier(item);
        list[id] = { accessed: Date.now(), item };
        return trim(sortedList(list));
    }

    const sortByLastViewedTime = list => {
        let sortedList = Object.values(list)
            .sort((a, b) => b.accessed - a.accessed)
            .map(a => a.item);
        return sortedList;
    }

    const pushRecentlyViewed = (collection,identifier) => item => {
        const recentlyViewed = localStorage.getItem(collection) ?? "{}";
        const updateRecentlyViewedStudents = updateRecentlyViewed(item,identifier);
        const trimmedList = updateRecentlyViewedStudents(recentlyViewed);
        localStorage.setItem(collection, JSON.stringify(Object.fromEntries(trimmedList)));
    }

    const getRecentlyViewed = collection => () => {
        let recentlyViewed = JSON.parse(localStorage.getItem(collection) ?? "{}");
        return sortByLastViewedTime(recentlyViewed);
    }

    return {
        pushStudent: pushRecentlyViewed("recently-viewed-students", s => s.id),
        getStudents: getRecentlyViewed("recently-viewed-students"),
        pushModule: pushRecentlyViewed("recently-viewed-modules", m => m.id),
        getModules: getRecentlyViewed("recently-viewed-modules")
    }

}());

const routes = [
    {
        path: "/students",
        component: views.Students(apiService, navigationService, eventSource, localStorageService)
    },
    {
        path: "/students/:id",
        component: views.Student(apiService, navigationService, eventSource)
    },
    {
        path: "/modules",
        component: views.Modules(apiService, navigationService, eventSource, localStorageService)
    },
    {
        path: "/modules/:id",
        component: views.Module(apiService, navigationService, eventSource, localStorageService)
    },
    {
        path: "/classlists/:id",
        component: views.ManageClasslists(apiService, eventSource)
    },
    { path: "/", component: { template: "<div><h2>Home page</h2></div>" } }
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
});

router.afterEach(() => {
    eventSource.emit('view-loaded');
});

var nav = Vue.createApp({
    components: {
        "app-nav": components.AppNav(),
        "nav-item": components.NavItem()
    }
});

nav.use(router);

var model = nav.mount('#nav');


var app = Vue.createApp({
    data: function () {
        return {
            isViewOut: false,
            isLoading: true
        }
    },
    created() {
        //Used to ensure the fade out transition completes before the new view begins loading
        eventSource.on('navigation-out', () => {
            this.isViewOut = true;
        });

        //The start of the actual view load
        eventSource.on('navigate', () => {
            this.isViewOut = false;
            this.isLoading = true;
        });

        // Raised when the view completes
        eventSource.on('view-loaded', () => this.isLoading = false);

        // Raised on view load error
        eventSource.on('view-load-error', (err) => {
            this.isLoading = false;
            eventSource.emit('message', { message: err, state: "error" })
        });


    },
    components: {
        "message-bar":components.MessageBar(eventSource)
    }
});

app.use(router);
app.mount('#main');



