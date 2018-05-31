export var getQueryString = function (url, field) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var s = reg.exec(href);
    return s ? s[1] : null;
};
var escapeChars = { lt: '<', gt: '>', quot: '"', apos: '\'', amp: '&' };
export var unescapeHTML = function (str) {
    return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
        var match;
        if (entityCode in escapeChars) {
            return escapeChars[entityCode];
        }
        else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
            return String.fromCharCode(parseInt(match[1], 16));
        }
        else if (match = entityCode.match(/^#(\d+)$/)) {
            return String.fromCharCode(~~match[1]);
        }
        else {
            return entity;
        }
    });
};
export var handleError = function (msg) {
    console.error(msg);
};
//# sourceMappingURL=utils.js.map