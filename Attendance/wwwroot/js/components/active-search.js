if (typeof (components) == 'undefined') { components = {}; }

(function () {
    this.ActiveSearchResultItem =
        function () {
            return {
                props: ["item"],
                emits:["selected"],
                template: `
                    <div class="active-search-result-item"
                            tabindex="-1" ref="el"
                            @click="focus"
                            @keyup.enter="select(item)">
                        <slot></slot>
                    </div>`,
                methods: {
                    focus() {
                        let el = this.$refs.el
                        el.focus();
                    },
                    select(item) {
                        this.$emit('selected', item);
                    }
                }
            }
        }
    this.ActiveSearch =
        function () {
            return {
                components: {
                    "search-result":components.ActiveSearchResultItem()
                },
                props: ["placeholder"],
                emits:["search","item-selected"],
                data: function () {
                    return {
                        searchText:"",
                        results: [],
                        currentSearch: -1,
                        activeIndex: -1
                    }
                },
                template:
                `
                    <div class="active-search"
                        v-on:keydown.down.stop.prevent="next"
                        v-on:keydown.up.stop.prevent="previous"
                        v-on:keydown.escape.stop.prevent="clear">
                            
                        <header>
                            <input type="text" :value="searchText" @input="inputChanged" :placeholder="placeholder" />
                            <primary-button @click="search">Search</primary-button>
                        </header>
                        <div class="results" v-if="results.length > 0">
                            <div tabindex="-1"
                                ref="results"
                                v-for="result in results"
                                v-on:keydown.enter.prevent.stop="select(result)"
                                @click="select(result)">
                                <slot :item="result" ></slot>
                            </div>
                        </div>
                    </div>
                `,
                methods: {
                    inputChanged(e) {
                        this.searchText = e.target.value;
                        let currentSearch = setTimeout(() => this.$emit('search', this, currentSearch)  , 200);
                        this.currentSearch = currentSearch;
                    },
                    search() {
                        this.currentSearch = -1;
                        this.$emit('search', this, this.currentSearch)
                        
                    },
                    setResults(data, id) {
                        if (id == this.currentSearch) {
                            this.results = [...data];
                        }
                    },
                    next(e) {
                        if (this.activeIndex < (this.results.length - 1)) {
                            this.activeIndex += 1;
                            this.$refs.results[this.activeIndex].focus();
                        }
                        
                    },
                    previous(e) {
                        if (this.activeIndex > 0) {
                            this.activeIndex -= 1;
                            this.$refs.results[this.activeIndex].focus();
                        }
                    },
                    clear() {
                        this.results = [];
                        this.activeIndex = - 1;
                    },
                    select(item) {
                        this.clear();
                        this.searchText = "";
                        this.$emit('item-selected', item);
                    }

                }
            }

        }
}).call(components);

(function () {
    var styles = document.createElement('style');
    styles.textContent = 
    `
        .active-search header {
            display:flex;
            gap:1rem;
        }

        .active-search header form-input {
            flex-basis:auto;
            flex-grow:1;
        }

        .active-search header primary-button {
            
        }

        .active-search {
            --_separator-colour: color-mix(in srgb, var(--primary-colour, silver), whitesmoke);
            display:flex;
            flex-direction:column;
            overflow:hidden;
        }
        .active-search .results {
            margin-top:0.5rem;
            overflow:auto;
            height:100%;
        }

        .active-search .results > div {
            padding:0.5rem;
            border-bottom: 1px solid var(--_separator-colour);
            cursor:pointer;
        }

        .active-search .results > div:focus,
        .active-search .results div:focus-visible,
        .active-search .results div:hover {
            outline:none;
            background-color:color-mix(in srgb, var(--_separator-colour), whitesmoke 90%);
        }

        .active-search input {
                --_background-colour:var(--primary-colour, darkseagreen);
                --_border-colour:color-mix(in srgb, var(--_background-colour) 70%, black);

                padding:0.5rem;
                border-radius:0.5rem;
                border-width:2px;
                border-color:var(--_border-colour);
                border-style:solid;
                flex-grow:1;
            }

            .active-search input:focus,
            .active-search input:focus-visible {
                box-shadow: 0 0 0.5rem var(--_border-colour);
            }
    `
    document.body.appendChild(styles);
}());