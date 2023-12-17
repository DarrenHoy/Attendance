if (typeof (views) == 'undefined') { views = {}; }

(function () {
    this.Module =
        function (apiService, navigationService, eventSource, localStorageService) {
            return {
                data: function () {
                    return {
                        module: {},
                        registrations: [],
                        classLists: [],
                        studentToRegister: {}
                    }
                },
                template:
                `
                    <h2>{{module.code}} | {{module.title}}</h2><br />

                    <div class="module-view-main">
                        <block-section title="Registered students">
                            <template v-slot:actions>
                                <button class="icon-button" @click="showRegisterStudentDialog">
                                    <img src="/icons/plus-circle.svg" alt="plus sign"/>
                                    <span>Add</span>
                                </button>
                            </template>

                            <template v-slot:body>
                                <div v-if="this.registrations.length > 0">
                                    <div class="list-item" v-for="registration in registrations">
                                        <router-link :to="studentUrl(registration)">
                                            {{registration.student.firstName}} {{registration.student.surname}}
                                        </router-link>
                                        <button class="icon-button" @click="beginDeregister(registration)">
                                            <img src="/icons/trash3.svg" alt="trash" />
                                        </button>
                                    </div>
                                </div>
                                <div v-else>
                                    No students registered
                                </div>
                            </template>
                        </block-section>
                    
                    
                        <block-section title="Class Lists">
                            <template v-slot:actions>
                                <button class="icon-button" @click="showRegisterStudentDialog"><img src="/icons/plus-circle.svg" alt="plus sign"/></button>
                            </template>

                            <template v-slot:body>
                                <div v-if="this.classLists.length > 0">
                                    <div class="list-item" v-for="classList in classLists">
                                        <router-link :to="classListUrl(classList)">
                                            {{classList.title}}
                                        </router-link>
                                    </div>
                                </div>
                                <div v-else>
                                    No class lists are defined for this module
                                </div>
                            </template>
                        </block-section>


                        <block-section title="Teaching Sessions">
                            <template v-slot:body>
                                <div v-if="this.classLists.length > 0">
                                <div v-for="classList in classLists">
                                    {{classList.title}}
                                </div>
                                </div>
                                <div v-else>
                                    No class lists are defined for this module
                                </div>
                            </template>
                        </block-section>
                        
                        
                    </div>

                    <modal ref="registerStudent" title="Register Student">
                        <template v-slot:body>
                            <h3>Selected Student</h3>
                            <span v-if="hasStudentToRegister">{{studentToRegister.firstName}} {{studentToRegister.surname}}</span>
                            <span v-else>No student selected</span>

                            
                            <h3>Search</h3>
                            <div style="display:flex; flex-direction:column;overflow:hidden;">
                                <active-search @search="setData" v-slot="searchResult" placeholder="Search by name or student number"
                                    @itemSelected="studentSelected">
                                    <student-card :student="searchResult.item"></student-card>
                                </active-search>
                            </div>
                        </template>
                        <template v-slot:footer>
                            <primary-button :disabled="!hasStudentToRegister" @click="confirmStudentToRegister">Confirm</primary-button>
                            <button @click="() => this.$refs.registerStudent.close()">Cancel</button>
                        </template>
                    </modal>
                `,
                computed: {
                    hasStudentToRegister() {
                        return Object.keys(this.studentToRegister).length > 0;
                    }
                },
                components: {
                    "block-section": components.BlockSection(),
                    "active-search": components.ActiveSearch(),
                    "student-card": components.StudentCard(),
                    "modal":components.Modal()
                },
                methods: {
                    studentUrl(registration) {
                        return `/students/${registration.student.id}`;
                    },
                    classListUrl(classList) {
                        return `/classlists/${classList.id}`;
                    },
                    showRegisterStudentDialog() {
                        this.studentToRegister = {};
                        var modal = this.$refs.registerStudent;
                        modal.show();
                    },
                    setData(searchModel, id) {
                        apiService.getStudents(searchModel.searchText)
                            .then(data => searchModel.setResults(data, id));
                    },
                    studentSelected(student) {
                        this.studentToRegister = student;
                    },
                    confirmStudentToRegister() {
                        console.log(this.studentToRegister);
                        apiService.registerStudentOnModule(this.module.id, this.studentToRegister.id)
                            .then(registration => {
                                this.registrations.push(registration)
                                this.$root.isLoading = false;
                                eventSource.emit("message", { state: "info", message: `Student ${registration.student.firstName} ${registration.student.surname} registered` });
                            })
                            .catch(err => {
                                eventSource.emit("message", { state: "error", message: "Failed to enrol student" });
                                this.$root.isLoading = false;
                            });
                        this.$refs.registerStudent.close();
                        this.$root.isLoading = true;
                    },
                    beginDeregister(registration) {
                        var name = registration.student.firstName + " " + registration.student.surname;
                        var deleteConfirmed = confirm(`Are you sure you want to deregister ${name}?`);
                        if (deleteConfirmed) {
                            this.confirmDeregister(registration);
                        }
                    },
                    confirmDeregister(registration) {
                        var name = registration.student.firstName + " " + registration.student.surname;
                        apiService.deregisterStudentFromModule(registration)
                            .then(r => {
                                var newRegistrations = this.registrations.filter(r => r !== registration);
                                this.registrations = newRegistrations;

                                eventSource.emit('message', {
                                    state: "info",
                                    message: `Student ${name} deregistered`
                                });
                            })
                            .catch(r => eventSource.emit('message', {
                                    state: "error",
                                    message: `Could not deregister ${name} becaue of an error`
                                })
                            );
                    }


                },
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

(function () {
    var style = document.createElement('style');
    style.textContent =
        `
        .module-view-main {
            display:flex;
            flex-direction: row;
            justify-content:space-between;
        }

        .module-view-main .block-section {
            width:33%;
        }

        .module-view-main .list-item{
            height:2rem;
            display: flex;
            align-items:center;
            justify-content:space-between;
            cursor:pointer;
        }

        .module-view-main .list-item:hover{
            box-shadow:0 0 0.2rem silver;
            width:100%;
            font-size:1.05rem;
            transition: font-size 0.1s;
        }

        .module-view-main .list-item a:hover {
            text-decoration:underline;
            
        }
    `

    document.body.appendChild(style);
}());