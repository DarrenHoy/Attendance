if (typeof (components) == 'undefined') { components = {}; }

(function () {
    this.Modal =
        function () {
            return {
                props: ["title"],
                template:
                `
                    <dialog class="modal" ref="root">
                        <header>
                            {{title}}
                            <slot name="header">
                            </slot>
                            <img src="/icons/x-circle.svg" alt="icon to close the dialog" @click="close" />
                        </header>
                        <div class="body">

                            <slot name="body">
                            </slot>
                        </div>
                        <footer>
                            <slot name="footer">
                            </slot>
                        </footer>
                    </dialog>
                `,
                methods:{
                    show() {
                        this.$refs.root.showModal();
                    },
                    close() {
                        this.$refs.root.close();
                    }
                }
            }
        }
}).call(components);

(function () {
    var style = document.createElement('style');
    style.textContent =
        `
            dialog.modal[open] {
                display:flex;
                flex-direction:column;
                border-radius:0.5rem;
                border-color: var(--border-colour);
                box-shadow: 0 0 0.5rem var(--border-colour);
            }

            dialog.modal > header {
                font-size:large;
                color:var(--primary-accent-colour);
                padding-bottom:0.5rem;
                border-bottom: 1px solid;
                border-color: var(--primary-accent-colour);
                display:flex;
                flex-direction:row;
                justify-content:space-between;
                align-items:center;
            }

                dialog.modal > header img {
                    height:1.5rem;
                    cursor:pointer;
                }

            dialog.modal > div.body {
                flex-basis:auto;
                flex-grow: 1;
                overflow:hidden;
                display:flex;
                flex-direction:column;
                padding-bottom: 0.8rem;
            }

            dialog.modal > div.body > h3 {
                margin-top:0.5rem;
                margin-bottom:0.2rem;
            }

            dialog.modal > footer {
                height: auto;
            }
        `

    document.body.appendChild(style);
}());