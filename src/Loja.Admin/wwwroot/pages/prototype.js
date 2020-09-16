var isNullOrEmpty = function (x) {
    if ((x === undefined) || (x === null) || x === "") { return true; }
    else { return false; }
};

var isNullEmptyOrWriteSpace = function (x) {
    if ((x === undefined) || (x === null) || x === "" || x.replace(/\s/g, "").length < 1) { return true; }
    else { return false; }
};

Array.prototype.any = function (exp) {
    if (!exp)
        return this.length > 0;
    else if (typeof exp === "function")
        return this.filter(exp).length > 0;
    return false;
};