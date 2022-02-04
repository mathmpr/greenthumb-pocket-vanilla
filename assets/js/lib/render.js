class Render {

    component = null;
    options = {};

    constructor(component = false, options = {}) {
        this.component = component;
        this.options = options;
    }

    static setupOriginalState(component, component_id) {

        if (!component.querySelectorAll) return;

        let reverse = (el) => {
            if (!el) return;
            if (el.parentNode && !el.parentNode.classList.contains(component_id)) {
                let parent = el.parentNode;
                if (!parent.unique_id) {
                    parent.unique_id = '_' + makeid();
                    if (parent.classList) parent.classList.add(parent.unique_id);
                    parent.self = parent.cloneNode(true);
                    parent.self.unique_id = parent.unique_id;
                    parent.ownerComponent = component;
                }
                reverse(parent);
            }
        };

        component.querySelectorAll('*').forEach((el) => {
            if (el.querySelectorAll('*').length === 0) {
                if (el.childNodes.length > 0) {
                    el.childNodes.forEach((textNode) => {
                        // create unique id in each DOM element
                        textNode.unique_id = '_' + makeid();
                        if (textNode.classList) textNode.classList.add(textNode.unique_id);
                        textNode.self = textNode.cloneNode(true);
                        textNode.self.unique_id = textNode.unique_id;
                        textNode.ownerComponent = component;
                        reverse(textNode);
                    });
                }
            }
        });

        component.childNodes.forEach((e) => {
            if (!e.unique_id) {
                e.unique_id = '_' + makeid();
                if (e.classList) e.classList.add(e.unique_id);
                e.self = e.cloneNode(true);
                e.ownerComponent = component;
                e.self.unique_id = e.unique_id;
            }
        });
    }

    // get property dynamic
    static getProperty(object, key) {
        key = key.split('.');
        let change = false;
        let prop = null;

        let firstKey = key.splice(0, 1)[0];

        if (firstKey in object) {
            prop = object[firstKey];
            if (is_object(object[firstKey])) prop = clone(object[firstKey]);
        }

        let broken = false;

        if (is_object(prop)) {
            key.forEach((k) => {
                if (k in prop) {
                    prop = prop[k];
                    change = true;
                } else {
                    prop = null;
                    broken = true;
                }
            })
        }

        if (!is_object(prop) && key.length > 0 && broken) {
            return null;
        }

        return prop;
    }

    render(element) {

        if (element) {
            if (!is_object(element)) console.error('element have to be be an object');
            if (!(element instanceof Element)) {
                console.error('element have to be an Element object');
                return null;
            }
        }

        let componentName = this.component.prototype.constructor.name.toLowerCase() + '-component'
        let component = document.createElement(componentName);

        component.add_template();

        let component_id = '_' + makeid();
        component.classList.add(component_id);
        component.unique_id = component_id;

        Render.setupOriginalState(component, component_id);

        if (this.options.parent && this.options.parent instanceof Element) {

            component.parentComponent = this.options.parent;

            if (!this.options.parent.childComponents) this.options.parent.childComponents = [];
            this.options.parent.childComponents.push(component);

            let no_reflect_attributes = ['class'];

            for (let i = 0; i < this.options.parent.attributes.length; i++) {
                let attr = this.options.parent.attributes.item(i);
                // prevent not allowed attributes
                if (no_reflect_attributes.indexOf(attr.nodeName) < 0) {
                    component.setAttribute(attr.nodeName, attr.nodeValue);
                }
            }

            // check for parent element of a component and reflect attribute to the component
            // when component receive the attributes, component trigger changes
            new MutationObserver(() => {
                for (let i = 0; i < this.options.parent.attributes.length; i++) {
                    let attr = this.options.parent.attributes.item(i);
                    // prevent not allowed attributes
                    if (no_reflect_attributes.indexOf(attr.nodeName) < 0) {
                        component.setAttribute(attr.nodeName, attr.nodeValue);
                    }
                }
            }).observe(this.options.parent, {attributes: true});

        }

        // when component receive the attributes, component trigger changes
        new MutationObserver(() => {
            component.changes();
        }).observe(component, {attributes: true});

        let finalRender = (element) => {

            if (element.attributes) {
                for (let i = 0; i < element.attributes.length; i++) {
                    let attr = element.attributes.item(i);
                    let match = (attr.nodeValue.match(/{{\s*[\w\.]+\s*}}/g));
                    if (match) {
                        let renderers = match
                            .map(function (x) {
                                return x.match(/[\w\.]+/)[0];
                            });
                        if (is_array(renderers) && !empty(renderers)) {

                            renderers.forEach((render) => {
                                element.classList.add('observe-attr-' + render);
                                if (!element.key_value_attr) element.key_value_attr = {};
                                element.key_value_attr[attr.nodeName] = render;
                                let val = Render.getProperty(component, render);
                                if (val) {
                                    if (is_object(val)) {
                                        val = JSON.stringify(val);
                                    }
                                    attr.nodeValue = val;
                                }
                            });
                        }
                    }
                }
            }

            element.childNodes.forEach((child) => {

                finalRender(child);

                if (child.childNodes.length > 0) {
                    Render.renderSingleElement(component, child);
                }
            });
        }

        finalRender(component);

        component.querySelectorAll('script').forEach((script) => {
            // prevent doubled script in main DOM
            if (document.querySelectorAll('*[src="' + script.src + '"]').length === 0) {
                let _s = document.createElement('script');
                _s.classList.add('component');
                _s.src = script.src;
                document.querySelector('body').appendChild(_s);
            }
            script.parentNode.removeChild(script);
        });

        spaAnchor(component);

        component.loaded();

        if (!element) {
            return component;
        } else {
            element.appendChild(component);
        }
        return component;
    }

    static renderSingleElement(component, el) {

        if (!el.self) return;

        if (window.definedComponents.indexOf(eval(el.constructor.name)) >= 0) return;

        // for each child node
        el.childNodes.forEach((e) => {

            if (!e.self) return;

            // just if node is a text
            if (e.nodeName === '#text') {

                let unique_id = e.unique_id;
                let self = e.self;

                e.parentNode.insertBefore(self, e);
                e.parentNode.removeChild(e);
                e = self;
                e.ownerComponent = component;
                e.unique_id = unique_id;
                e.self = self.cloneNode(true);
                if (e.linked_components) {
                    e.self.linked_components = e.linked_components;
                }

                e.nodeValue = e.nodeValue.split('{{ ').join('{{').split(' }}').join('}}');
                let text = e.nodeValue;
                let match = (e.nodeValue.match(/{{\s*[\w\.]+\s*}}/g));
                if (!empty(text) && match) {
                    let renderers = match
                        .map(function (x) {
                            return x.match(/[\w\.]+/)[0];
                        });
                    // each text node can contains one or more mustache
                    if (is_array(renderers) && !empty(renderers)) {

                        let textResult = text;
                        let rendered = false;
                        let success_renders = [];

                        // for each one mustache founded

                        renderers.forEach((render) => {

                            let _render = render.split('.');

                            // if mustache word begin with render. then wee get after word
                            // this word have to be a valid declared component
                            let isRender = ((_render.splice(0, 1) + '') === 'render');
                            if (isRender) {

                                rendered = true;
                                let path = _render.join('/');
                                let toComponent = eval(path);

                                let memoryComponent;

                                if (window.child_components[unique_id]) {
                                    memoryComponent = window.child_components[unique_id];
                                }

                                if (!memoryComponent) {
                                    let r = new Render(toComponent, {
                                        parent: el
                                    });
                                    memoryComponent = r.render(null);
                                    memoryComponent.parentComponent = el.ownerComponent;
                                    window.child_components[unique_id] = memoryComponent;
                                }

                                // @todo possible order bug, render is insert ever before text node
                                // @todo but it doesn't take into account the text order and other mustaches inside the text

                                // remove mustache word from original text
                                e.nodeValue = e.nodeValue.replace('{{' + render + '}}', '');
                                // insert component before the current node called here as var "e"
                                e.parentNode.insertBefore(memoryComponent, e);

                            } else {

                                if (window.child_components[unique_id]) {
                                    delete window.child_components[unique_id];
                                }

                                // check if attribute exists in component declaration @input
                                let attr = component.getAttribute(render);
                                if (attr) {
                                    textResult = textResult.replace('{{' + render + '}}', attr);
                                    el.classList.add('observe-text-' + render);
                                }

                                let value = Render.getProperty(component, render);

                                if (value && is_object(value) && value instanceof Element) {
                                    let exists = false;
                                    el.childNodes.forEach((el) => {
                                        if (el === component[render]) exists = true;
                                    });
                                    if (!exists && component[render]) {

                                        if (e.linked_components && e.linked_components[render]) {
                                            try {
                                                e.parentNode.removeChild(e.linked_components[render]);
                                            } catch (error) {
                                            }
                                        }

                                        let exp = e.nodeValue.split('{{' + render + '}}');
                                        let new_childes = [];

                                        exp.forEach(_text => {
                                            if (_text !== '') {
                                                let txt = document.createTextNode(_text);
                                                new_childes.push(txt);
                                            }

                                            new_childes.push(component[render]);
                                        });
                                        new_childes.splice(new_childes.length - 1, 1);

                                        new_childes.forEach((node) => {
                                            e.parentNode.insertBefore(node, e);
                                            if (!e.self.linked_components) {
                                                e.self.linked_components = {};
                                            }
                                            e.self.linked_components[render] = node;
                                            if (!e.linked_components) {
                                                e.linked_components = {};
                                            }
                                            e.linked_components[render] = node;
                                        });
                                        e.nodeValue = e.nodeValue.replace('{{' + render + '}}', '');
                                    }
                                } else if (value) {
                                    if (e.linked_components && e.linked_components[render]) {
                                        try {
                                            e.parentNode.removeChild(e.linked_components[render]);
                                        } catch (error) {
                                        }
                                    }
                                    success_renders.push(render);
                                    e.nodeValue = e.nodeValue.replace('{{' + render + '}}', value);
                                    el.classList.add('observe-text-' + render);
                                } else {
                                    if (e.linked_components && e.linked_components[render]) {
                                        try {
                                            e.parentNode.removeChild(e.linked_components[render]);
                                        } catch (error) {
                                        }
                                    }
                                    el.classList.add('observe-text-' + render);
                                }
                            }

                        });

                        renderers.forEach((render) => {
                            if (success_renders.indexOf(render) < 0) {
                                e.nodeValue = e.nodeValue.replace('{{' + render + '}}', '');
                            }
                        });

                    }
                }
            }
        });
    }
}

function defineComponent(component) {
    if (!window.definedComponents) window.definedComponents = [];
    if (window.definedComponents.indexOf(component) < 0) {
        window.definedComponents.push(component);
        window.customElements.define(component.prototype.constructor.name.toLowerCase() + '-component', component);
    }
}
