document.addEventListener('DOMContentLoaded', () => {

    let move_anchor = (event) => {
        let element = event.target;
        if (element.nodeName.toLowerCase() !== 'a') {
            element = element.closest('a');
        }
        let target = element.getAttribute('data-target');
        if (target) {
            try {
                target = document.querySelector(target);
            } catch (error) {
                target = false;
            }
            if (target) {

                scroll({
                    top: getCoords(target).top,
                    behavior: "smooth"
                });

            }
        }
    };

    let attach_event = () => {
        document.querySelectorAll('a.anchor').forEach((a) => {
            a.removeEventListener('click', move_anchor);
            a.addEventListener('click', move_anchor);
        });
    }

    let observer = new MutationObserver((mutation) => {
        attach_event();
    });

    observer.observe(document.body, {childList: true, subtree: true});

    attach_event();

});
