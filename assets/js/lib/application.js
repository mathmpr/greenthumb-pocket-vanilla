class Application {

    start() {

        let component;
        let main;

        let path = window.location.pathname;

        if (window.location.href.indexOf('file://') >= 0) {
            throw new Error('you cant run the SPA app using a file protocol');
        }

        for (let i in window.routes) {
            let route = window.routes[i];
            if (i === path) {
                if (route.component) {
                    component = route.component;
                    break;
                }
            }

            if (window.location.pathname.match(/(.*?)/)) {
                if (route.component) {
                    component = route.component;
                }
            }
        }

        if (component) {
            main = new Render(component);
        }

        document.querySelector('main').innerHTML = '';

        main.render(document.querySelector('main'));

        spaAnchor(document.body);

    }

}

function spaAnchor(element) {
    if (!is_object(element)) console.error('element have to be be an object');
    if (!(element instanceof Element) && !(element instanceof ShadowRoot)) {
        console.error('element have to be an Element object');
        return null;
    }

    let preventAnchor = (event) => {
        event.preventDefault();
        if (event.target.href && event.target.href.replace(event.target.origin + '/', '') !== '#') {
            Navigate.navigate(event.target.href)
            window.app.start();
        }
    }

    let bindPreventAnchor = () => {
        element.querySelectorAll('a[href]').forEach((el) => {
            el.removeEventListener('click', preventAnchor);
            el.addEventListener('click', preventAnchor);
        });
    }

    bindPreventAnchor();

    let observer = new MutationObserver((mutations) => {
        bindPreventAnchor();
    });

    observer.observe(element, {childList: true, subtree: true});
}

class Navigate {

    static navigate = (path) => {
        if (Navigate.beforeNavigate()) {
            window.history.pushState(null, "", path);
            Navigate.afterNavigate(path);
        }
    }

    static beforeNavigate = (path) => {
        return true;
    }

    static afterNavigate = (path) => {
        return true;
    }

    static navigateRender = (path) => {
        return true;
    }

    static navigateEnd = (path) => {
        return true;
    }
}

window.child_components = {};

window.onpopstate = function () {
    Navigate.navigateRender(window.location.pathname);
    window.app.start();
    Navigate.navigateEnd(window.location.pathname);
}

window.history.onPushState = () => {
    // another way to maybe prevent push state
}

(function (history) {
    let pushState = history.pushState;
    history.pushState = function (data, title, url) {
        if (typeof history.onPushState == "function") {
            history.onPushState(arguments);
        }
        return pushState.apply(history, arguments);
    };
})(window.history);
