class XElement extends HTMLElement {

    constructor() {
        super();

        this.init();

        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                this.change({
                    type: 'mutation',
                    mutation
                });
            })
        });
        observer.observe(this, {subtree: true, childList: true, attributes: true})
        observer.observe(this, {subtree: true, childList: true, attributes: true});

        // we need to update variables in component through a proxy to trigger changes
        // is the only way that I found to trigger changes without call function manually every time that I update a property value
        this.proxy = new Proxy(this, {
            set(target, p, value, receiver) {
                target[p] = value;
                target.changes();
                target.change({
                    type: 'set',
                    key: p,
                    value
                });
                return Reflect.set(target, p, value, receiver);
            }
        });

    }

    add_template() {
        this.style.display = 'block';
        let template = document.createElement('template');
        template.innerHTML = this.render();
        template.content.childNodes.forEach((el) => {
            this.appendChild(el.cloneNode(true));
        });
    }

    changes() {

        // observe general changes in father component or attrs
        this.querySelectorAll('*[class*="observe-attr-"]').forEach((el) => {
            el.classList.forEach((cl) => {
                if (cl.indexOf('observe-attr-') >= 0) {
                    let prop = cl.replace('observe-attr-', '');
                    if (el.key_value_attr) {
                        for (let attrName in el.key_value_attr) {
                            if (el.key_value_attr[attrName] === prop) {
                                let value = Render.getProperty(this, prop);
                                el.setAttribute(attrName, value);
                            }
                        }
                    }
                }
            });
        });

        // observe innerText changes, each element have textNodes treated separately
        let passed = [];
        this.querySelectorAll('*[class*="observe-text-"]').forEach((el) => {
            if (passed.indexOf(el) < 0) {
                passed.push(el);
                Render.renderSingleElement(this, el);
            }
        });
    }

    select(selector) {
        return this.querySelector(selector);
    }

    selects(selector) {
        return this.querySelectorAll(selector);
    }

    attr() {
        if (arguments.length > 1) {
            this.setAttribute(arguments[0], arguments[1]);
        } else {
            return this.getAttribute(arguments[0]);
        }
    }

    render() {
        return '';
    }

    init() {
    }

    loaded() {
    }

    change(change) {
    }
}
