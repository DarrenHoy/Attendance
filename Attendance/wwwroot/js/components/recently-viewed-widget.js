if (typeof (components) == 'undefined') { components = {}; }

(function () {
    this.RecentlyViewedWidget =
        function () {
            return {
                emits: ["itemSelected"],
                props:["items","title"],
                template:
                `
                    <div class="recently-viewed">
                        <h4>{{title}}</h4>
                        <div class="container">
                            <div v-for="item in items" @click="itemClicked(item)">
                                <slot :item="item"></slot>
                            </div>
                        </div>
                    </div>
                `,
                methods: {
                    itemClicked(item) {
                        this.$emit('itemSelected', item);
                    }
                }
            }
        }
}).call(components);

(function () {
    var style = document.createElement('style');
    style.textContent =
    `

        .recently-viewed {
            --_background-colour: var(--primary-colour, darkseagreen);
            --_border-colour:
                color-mix(in srgb, var(--_background-colour) 70%, black);
            border: 1px solid var(--_border-colour);
            
            border-radius:0.5rem;
            padding:0.5rem;
            background: color-mix(in srgb, var(--primary-accent-colour), white 95%);
         }

         .recently-viewed h4 {
             margin:0 0 1rem 0;
             font-weight:lighter;
         }

        .recently-viewed > .container {
            display:flex;
            flex-wrap:nowrap;
            gap: 0.2rem;
            font-size:small;
            margin-bottom:1rem;
            overflow-x:auto;
        }

        .recently-viewed > .container > div {
            
            
            border: 2px solid var(--_border-colour);
            border-radius: 0.5rem;
            padding:0.2rem;
            display:flex;
            align-content:center;
            cursor:pointer;
            flex-basis:15%;
            min-width:200px;
            margin-bottom:0.5rem;
        }

        .recently-viewed > .container > div:hover {
            background-color:color-mix(in srgb, var(--_background-colour) 60%, whitesmoke);
        }
    `;

    document.body.appendChild(style);

}());