window.XHR = function (url, body, method, headers) {
    url = url || false;
    body = body || false;
    method = method || false;
    headers = headers || false;

    let xhr = new XMLHttpRequest();

    this._url = url;
    this._body = body;
    this._method = method;
    this._headers = headers;
    this._success = null;
    this._error = null;

    this.post = () => {
        this.method = 'POST';
        return this;
    }

    this.get = () => {
        this.method = 'GET';
        return this;
    }

    this.delete = () => {
        this.method = 'DELETE';
        return this;
    }

    this.put = () => {
        this.method = 'PUT';
        return this;
    }

    this.options = () => {
        this.method = 'OPTIONS';
        return this;
    }

    this.head = () => {
        this.method = 'HEAD';
        return this;
    }

    this.setHeaders = (headers) => {
        if (is_array(headers)) this.headers = headers;
    }

    this.success = (callback) => {
        this._success = callback;
        return this;
    }

    this.error = (callback) => {
        this._error = callback;
        return this;
    }

    this.setBody = (body, type) => {
        this._body = body;
        let types = {
            json: "Content-Type: application/json;charset=UTF-8",
            urlencoded: "Content-type: application/x-www-form-urlencoded"
        }
        if (types[type]) {
            if (!is_array(this.headers)) this.headers = [];
            this.setHeaders(this.headers.concat([types[type]]));
        }
    }

    this.setUrl = (url) => {
        if (empty(url)) throw Error('url can\'t be empty');
    }

    this.send = (url, body, method, headers) => {
        url = url || this._url;
        body = body || this._body;
        method = method || this._method;
        headers = headers || this._headers;
        if (!empty(url) && !empty(method) && this[method.toLowerCase()]) {

            xhr.open(method.toUpperCase(), url, true);

            if (is_array(headers)) {
                headers.forEach((header) => {
                    header = header.split(':');
                    if (header.length > 1) {
                        let key = headers.splice(0, 1);
                        xhr.setRequestHeader(key[0].trim(), headers.join(':').trim());
                    }
                });
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status < 400) {
                    if (is_callable(this._success)) this._success(xhr.responseText, xhr.status, xhr);
                } else if (xhr.readyState === XMLHttpRequest.DONE && xhr.status >= 400) {
                    if (is_callable(this._error)) this._error(xhr.responseText, xhr.status, xhr);
                }
            }

            xhr.send(body)
        }
    }

    return this;
}
