String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};


Date.prototype.formatISO = function() {
    return this.toISOString().replace("T", " ").replace("Z","")
};
