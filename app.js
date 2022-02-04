// main SPA app file

window.app = new Application();
window.app.start();

// we can stop navigate or do anything before
// required a boolean true return for continue with navigation
Navigate.beforeNavigate = (path) => {
    return true;
}
