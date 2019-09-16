var $ = (function(){
    'use strict';

    var Constructor = function(selector){
        if (!selector) return;
        if(selector === document) {
            this.elems = [document];
        } else {
            this.elems = document.querySelectorAll(selector);
        }
    };

    var instantiate = function(selector){
        return new Constructor(selector);
    };

    Constructor.prototype.ready = function(callback){
        if(!callback || typeof callback !== 'function') return;
        var elements = this.elems;
        for(var i=0;i<elements.length;i++){
            elements[i].addEventListener("DOMContentLoaded", callback);
        }
    };
    Constructor.prototype.html = function(html){
        var elements = this.elems;
        for(var i=0;i<elements.length;i++){
            elements[i].innerHTML = html;
        }
    };

    Constructor.prototype.append = function(html){
        var elements = this.elems;
        for(var i=0;i<elements.length;i++){
            elements[i].innerHTML = elements[i].innerHTML + html;
        }
    };

    Constructor.prototype.click = function(callback){
        if(!event || event === "") return;
        if(!callback || typeof callback !== 'function') return;

        var elements = this.elems;
        for(var i=0;i<elements.length;i++){
            elements[i].addEventListener("click",callback);
        }   
    };

    Constructor.prototype.ajaxSync = function(object){
        if(object.method === undefined) {
            object.method = "GET";
        }
        if(object.data === undefined) {
            object.data = "";
        }
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open(object.method, object.url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send(object.data);
        });
    };

    Constructor.prototype.ajax = function(object){
        if(object.method === undefined) {
            object.method = "GET";
        }
        if(object.data === undefined) {
            object.data = "";
        }
        var xhr = new XMLHttpRequest();
        xhr.open(object.method, object.url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                if(object.success === undefined){
                    return xhr.responseText;
                } else {
                    object.success(JSON.parse(xhr.responseText));
                }
            } else {
                if(object.failure === undefined){
                    return { status: this.status, statusText: xhr.statusText };

                } else {
                    object.failure({ status: this.status, statusText: xhr.statusText});
                }
            }
        };
        xhr.onerror = function () {
            return { status: this.status, statusText: xhr.statusText };
        };
        xhr.send(object.data);
    };

    return instantiate;
})();