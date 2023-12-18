if (typeof (services) == 'undefined') { services = {}; }

(function () {
    this.ApiService =
        function () {
            return {
                getStudents(searchText) {
                    var filter = (searchText ?? "").toLowerCase();
                    if (filter == "") {
                        return fetch('/api/students')
                            .then(res => res.json());
                    }
                    else {
                        return fetch(`/api/students/find/${searchText}`)
                            .then(res => res.json());
                    }

                },
                getStudent(id) {
                    return fetch(`/api/students/${id}`)
                        .then(res => res.json())
                },
                getModules() {
                    return fetch(`/api/coursemodules`)
                        .then(res => res.json())
                },
                getCourseModule(id) {
                    return fetch(`/api/coursemodules/${id}`)
                        .then(res => res.json());
                },
                getCourseModuleRegisteredStudents(id) {
                    return fetch(`/api/coursemodules/${id}/registered`)
                        .then(res => res.json());
                },

                getCourseModuleClassLists(id) {
                    return fetch(`/api/coursemodules/${id}/classlists`)
                        .then(res => res.json());
                },
                getClassListById(id) {
                    return fetch(`/api/ClassLists/${id}`)
                        .then(res => res.json())
                        .then(classList => {
                            var { module, members } = classList.links;
                            return Promise.all([fetch(module).then(res => res.json()), fetch(members).then(res => res.json())])
                                .then(([module, { members }]) => ({ ...classList, module, members }))
                                .then(data =>
                                    fetch(data.module.links.registered)
                                        .then(res => res.json())
                                        .then(registered => ({...data, registered})))
                        });
                },
                createClassList(moduleId, title) {
                    var body = JSON.stringify({ title });
                    return fetch(`/api/CourseModules/${moduleId}/ClassLists`,
                        {
                            method: "POST",
                            body,
                            headers: {
                                "content-type":"application/json"
                            }
                        }).then(res => res.json())
                },
                registerStudentOnModule(moduleId, studentId) {
                    var body = JSON.stringify({ studentId });
                    return fetch(`/api/coursemodules/${moduleId}/register`,
                        {
                            method: "post",
                            headers: {
                                "content-type": "application/json"
                            },
                            body
                        }).then(res => res.ok ? res.json() : res.json().then(r => Promise.reject(r)));
                },
                deregisterStudentFromModule(registration) {
                    var url = `/api/moduleregistrations/${registration.id}`;
                    return fetch(url, { method: "DELETE" }).then(res => res.ok ? Promise.resolve(registration) : Promise.reject(res));
                },
                assignStudentToClassList(classListId, studentId) {
                    var body = JSON.stringify({ studentId });
                    return fetch(`/api/ClassLists/${classListId}/members`, {
                        method: "POST",
                        headers: {
                            "content-type": "application/json"
                        },
                        body
                    });
                },
                deassignMemberFromClassList(id) {
                    return fetch(`/api/ClassListMembers/${id}`, { method: "DELETE" });
                }
            }
        }
}).call(services);