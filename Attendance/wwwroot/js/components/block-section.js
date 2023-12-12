if (typeof (components) == 'undefined') { components = {}; }

(function () {
    this.BlockSection =
        function () {
            return {
                props:["title"],
                template:
                `
                    <div class="block-section">
                        <header>
                        <span class="title">{{title}}</span>
                            <slot name="actions"></slot>
                            
                        </header>
                        <div>
                            <slot name="body"></slot>
                        </div>
                        <footer>
                            <slot name="footer"></slot>
                        </footer>
                    </div>
                `
            }
        }
}).call(components);

(function () {
    var style = document.createElement('style');
    style.textContent =
    `
        .block-section {
            border: 3px solid;
            border-color: var(--border-colour);
            border-radius:0.2rem;
            padding:0.5rem;

        }

        .block-section header {
            display:flex;
            flex-direction:row;
            justify-content:space-between;
            padding-bottom:0.5rem;
            border-bottom:1px solid;
            margin-bottom:0.5rem;
        }

        .block-section header > span.title {
            font-size:large;
        }
    `

    document.body.appendChild(style);
}());