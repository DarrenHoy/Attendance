if (typeof (components) == 'undefined') { components = {}; }



(function () {
    this.NavItem = function () {
        return {
            props: ["url"],
            emits: ["navigate"],
            template:
            `
                <a :href="url" @click.prevent="$emit('navigate', url);"><slot></slot></a>
            `
        }
    };
}).call(components);


(function () {
    this.AppNav = function () {
        return {
            data: function () {
                return {}
            },
            template:
                `
                <nav>
                    <slot></slot>
                </nav>
            `
        }
    };
}).call(components);