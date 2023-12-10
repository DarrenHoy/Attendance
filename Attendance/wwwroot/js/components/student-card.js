if (typeof (components) == 'undefined') { components = {}; }

(function () {
    this.StudentCard =
        function () {
            return {
                props: ["student"],
                template:
                `
                    <div>
                        <span>{{student.firstName}} {{student.surname}}</span>
                    </div>
                `
            }
        }
}).call(components);