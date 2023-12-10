class PrimaryButton extends HTMLElement {
    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: "open" });

        shadowRoot.innerHTML = 
            `
                <button><slot></slot></button>
            `

        const style = document.createElement('style');
        style.textContent =
        `
            button {
                --_background-colour:var(--primary-colour, darkseagreen);
                --_border-colour:color-mix(in srgb, var(--_background-colour) 70%, black);
                background-color:var(--_background-colour);
                padding:0.5rem;
                border-radius:0.5rem;
                border-width:2px;
                border-color:var(--_border-colour);
                border-style:solid;
                cursor:pointer;
            }

            button:hover{
                background-color:color-mix(in srgb, var(--_background-colour) 60%, whitesmoke);
            }
        `;

        shadowRoot.appendChild(style);
    }
}

class FormInput extends HTMLElement {
    #input;

    static observedAttributes = ["type","placeholder","value"];

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "closed" });
        this.#input = document.createElement('input');
        this.#input.addEventListener('input', () => this.value = this.#input.value);
        shadow.appendChild(this.#input);

        const style = document.createElement('style');
        style.textContent =
            `
            :host {
                display:flex;
            }
            input {
                --_background-colour:var(--primary-colour, darkseagreen);
                --_border-colour:color-mix(in srgb, var(--_background-colour) 70%, black);
                
                padding:0.5rem;
                border-radius:0.5rem;
                border-width:2px;
                border-color:var(--_border-colour);
                border-style:solid;
                flex-grow:1;
            }

            input:focus,
            input:focus-visible {
                box-shadow: 0 0 0.5rem var(--_border-colour);
            }
        `;

        shadow.appendChild(style);
        this.value = this.#input?.value;
    }

    focus() {
        super.focus();
        this.#input.focus();
    }
    

    attributeChangedCallback(item, from, to) {
        const setInputAtt = att => value => this.#input.setAttribute(att, value);
        const setValue = setInputAtt(item);
        if (from != to) {
            setValue(to);
        }

        
        
    }
}


customElements.define('primary-button', PrimaryButton);
customElements.define('form-input', FormInput);