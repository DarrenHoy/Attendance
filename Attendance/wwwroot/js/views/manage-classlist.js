if (typeof (views) == 'undefined') { views = {}; }

(function () {
    this.ManageClasslists =
        function (apiService, eventSource) {
            return {
                data: function () {
                    return {
                        classList: {
                            module: {},
                            members:[],
                            registered:[]
                        }
                    }
                },
                template:
                `
                    <h2>{{classList.module.code}} | {{classList.module.title}}</h2>
                    <h3>{{classList.title}}</h3>
                    <div class="manage-classlists-view-main">
                        <block-section title="Assignable students">
                            <template v-slot:actions>
                                <button class="icon-button" @click="registerSelected">
                                    Add selected
                                </button>
                            </template>
                            <template v-slot:body>
                                <div v-for="registered in assignable" class="list-item" @click="() => registered.isSelectedForAssignment = true">
                                <input type="checkbox" v-model="registered.isSelectedForAssignment" />
                                    <span style="flex-grow: 1">{{registered.student.firstName}}  {{registered.student.surname}}</span>
                                </div>
                            </template>
                        </block-section>
                        

                        <block-section title="Class list">
                            <template v-slot:body>
                                <div v-if="classList.members.length > 0" v-for="member in classList.members" class="list-item">
                                    {{member.student.firstName}}  {{member.student.surname}}
                                    <button class="icon-button" @click="beginDeassign(member)">
                                        <img src="/icons/trash3.svg" alt="trash" />
                                    </button>
                                </div>
                                <div v-else>
                                    This class list is currently empty
                                </div>
                            </template>
                        </block-section>
                    </div>
                `,
                components: {
                    "block-section": components.BlockSection(),
                },
                computed: {
                    assignable() {
                        return this.classList.registered.filter(r => !this.classList.members.some(m => m.student.id == r.student.id))
                    }
                },
                methods: {
                    registerSelected() {
                        const selected = this.classList.registered.filter(a => a.isSelectedForAssignment);
                        const jobs = selected.map(s => apiService.assignStudentToClassList(this.classList.id, s.student.id))

                        Promise.all(jobs)
                            .then(() => apiService.getClassListById(this.classList.id))
                            .then(classList => this.classList = classList)
                            .catch(err => eventSource.emit('view-load-error', err))
                    },
                    beginDeassign(member) {
                        apiService.deassignMemberFromClassList(member.id)
                            .then(() => apiService.getClassListById(this.classList.id))
                            .then(classList => this.classList = classList)
                            .catch(err => eventSource.emit('view-load-error', err))
                    }
                },
                beforeRouteEnter: (to, from, next) => {
                    navigationService.navigate(to, from, next)
                        .then(() => apiService.getClassListById(to.params.id))
                        .then(classList => next(vm => {
                            vm.classList = classList;
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
        .manage-classlists-view-main {
            display:flex;
            flex-direction: row;
            gap:1rem;
        }

        .manage-classlists-view-main .block-section {
            width:40%;
        }

        .manage-classlists-view-main .list-item{
            height:2rem;
            display: flex;
            align-items:center;
            justify-content:space-between;
            cursor:pointer;
        }

        .manage-classlists-view-main .list-item:hover{
            box-shadow:0 0 0.2rem silver;
            width:100%;
            font-size:1.05rem;
            transition: font-size 0.1s;
        }

        .manage-classlists-view-main .list-item a:hover {
            text-decoration:underline;
            
        }
    `

    document.body.appendChild(style);
}());