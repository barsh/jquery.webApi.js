/**
* @author Michael Barshinger
* @url [https://github.com/barsh/jquery.webApi.js]
*/

(function ($) {
    $.webApi = function (settings) {

        applyDefaultsToSettings();

        if (typeof (settings.url) == "undefined") {
            throw "Invalid $.webApi call, missing value for parameter: url.";
        }

        var data = (settings.type == 'POST') ?
            JSON.stringify(settings.params):
            settings.params;

        $.ajax({
            beforeSend: function () {
                if (settings.showLoadingMessage == false) return;
                if (typeof ($.mobile) != "undefined") {
                    try {
                        $.mobile.showPageLoadingMsg();
                    } catch (e) {
                    }
                }
                else if (typeof (settings.loadingMessageSelector) != "undefined") {
                    $(settings.loadingMessageSelector).show();
                }
            },
            complete: function () {
                if (settings.showLoadingMessage == false) return;
                if (typeof ($.mobile) != "undefined") {
                    try{
                        $.mobile.hidePageLoadingMsg();
                    } catch (e) {
                    }
                }
                else if (typeof (settings.loadingMessageSelector) != "undefined") {
                    $(settings.loadingMessageSelector).hide();
                }
            },
            type: settings.type,
            url: settings.url,
            data: data,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                if (typeof (settings.success) != "undefined") settings.success.call(settings.context || this, msg);
            },
            error: function (e) {
                var message = e.status + " - " + e.statusText;
                if (e.responseText != null) {
                    try {
                        var oError = JSON.parse(e.responseText);
                        var errorDetails = (typeof (oError.ExceptionMessage) == "undefined") ? oError.Message : oError.ExceptionMessage;
                        if (message == '500 - Internal Server Error' && typeof (errorDetails) != "undefined" && errorDetails != '') {
                            message = errorDetails;
                        }
                        else {
                            message += '. ' + errorDetails;
                        }
                    }
                    catch (innerError) {
                        if (e.responseText.indexOf("<pre>") > 0) {
                            message = e.responseText.substring(e.responseText.indexOf("<pre>"));
                            message = message.substring(message.indexOf("[") + 1);
                            message = message.substring(0, message.indexOf("]"));
                        } else if (e.responseText.indexOf("\"Message\":\"") > 0) {
                            message = e.responseText.substring(e.responseText.indexOf("\"Message\":\"") + "\"Message\":\"".length, e.responseText.indexOf("\",\"Stack"));
                            message = message.replace(/\\u0027/g, "");
                        }
                    }
                }
                if (typeof (settings.error) != "undefined") settings.error.call(settings.context || this, message);
                else if (typeof (settings.errorMessageSelector) != "undefined") $(settings.errorMessageSelector).text(message);
                else if (settings.showAlertOnError) alert(message);
            },
        });

        return false;

        function applyDefaultsToSettings() {
            if (typeof (settings.showAlertOnError) == "undefined") settings.showAlertOnError = true;
            if (typeof (settings.params) == "undefined") settings.params = {};
            if (typeof (settings.preventCaching) == "undefined") settings.preventCaching = true;
            if (settings.preventCaching == true) settings.params.webApiCacheBuster = new Date().getTime();
            if (typeof (settings.type) == "undefined") settings.type = "GET";
            if (typeof (settings.showLoadingMessage) == "undefined") settings.showLoadingMessage = true;
        }

    };

    //Attribution for JSON: https://github.com/douglascrockford/JSON-js
    var JSON; if (!JSON) { JSON = {}; }
    (function () {
        "use strict"; function f(n) { return n < 10 ? '0' + n : n; }
        if (typeof Date.prototype.toJSON !== 'function') {
            Date.prototype.toJSON = function (key) {
                return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z' : null;
            }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf(); };
        }
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + string + '"'; }
        function str(key, holder) {
            var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') { value = value.toJSON(key); }
            if (typeof rep === 'function') { value = rep.call(holder, key, value); }
            switch (typeof value) {
                case 'string': return quote(value); case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null'; }
                    gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') {
                        length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null'; }
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']'; gap = mind; return v;
                    }
                    if (rep && typeof rep === 'object') { length = rep.length; for (i = 0; i < length; i += 1) { if (typeof rep[i] === 'string') { k = rep[i]; v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } } else { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v); } } } }
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}'; gap = mind; return v;
            }
        }
        if (typeof JSON.stringify !== 'function') {
            JSON.stringify = function (value, replacer, space) {
                var i; gap = ''; indent = ''; if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' '; } } else if (typeof space === 'string') { indent = space; }
                rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify'); }
                return str('', { '': value });
            };
        }
        if (typeof JSON.parse !== 'function') {
            JSON.parse = function (text, reviver) {
                var j; function walk(holder, key) {
                    var k, v, value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v; } else { delete value[k]; } } } }
                    return reviver.call(holder, key, value);
                }
                text = String(text); cx.lastIndex = 0; if (cx.test(text)) {
                    text = text.replace(cx, function (a) {
                        return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    });
                }
                if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval('(' + text + ')'); return typeof reviver === 'function' ? walk({ '': j }, '') : j; }
                throw new SyntaxError('JSON.parse');
            };
        }
    }());

})(jQuery);
