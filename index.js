const express = require('express');
const app = express();
const port = 3000;

let fs = require('fs');
let mime = require('mime');

app.get('*', (request, response) => {

    let home = () => {
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.send(fs.readFileSync('./index.html'));
    }

    if (request.path === '/') {
        home();
        return;
    }

    let path = '.' + request.path;
    if (fs.existsSync(path)) {
        let m = mime.getType(path);
        response.setHeader('Content-Type', m + '; charset=utf-8');
        response.setHeader('Cache-Control', 'max-age=86400');
        response.setHeader('Expires', 86400);
        response.send(fs.readFileSync(path));
        return;
    }

    path = path.split('/');
    path = path[path.length - 1];

    if (path.split('.').length > 1) {
        response.status(404);
        response.send('404');
        return;
    }

    home();
})

/*
 A simple server using express to serve static files from any location based in request path
 */
app.listen(port, () => {
    console.log(`.htaccess or nginx conf simulation running on port: ${port}`)
})
