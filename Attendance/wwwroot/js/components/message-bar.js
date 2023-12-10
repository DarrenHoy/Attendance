if (typeof (components) == 'undefined') { components = {}; }

(function () {
    this.MessageBar = function (eventSource) {
        return {
            data: function () {
                return {
                    isVisible: false,
                    message: "",
                    state: ""
                }
            },
            template:
                `
                <div class="message-bar"
                    :class="{
                        visible: isVisible,
                        error: state == 'error',
                        info: state == 'info',
                        warning: state == 'warning'
                    }">
                    <span>{{message}}</span>
                </div>
            `,
            created() {
                eventSource.on('message', ({ state, message }) => {
                    this.message = message;
                    this.state = state;
                    this.isVisible = true;

                    setTimeout(() => {
                        this.isVisible = false;
                        this.message = "";
                        this.state = undefined;
                    }, 5000)
                });
            }
        }
    }
}).call(components);