var isNullOrEmpty = function (x) {
    if ((x === undefined) || (x === null) || x === "") { return true; }
    else { return false; }
};

var isNullOrEmptyOrWriteSpace = function (x) {
    if ((x === undefined) || (x === null) || x === "" || x.replace(/\s/g, "").length < 1) { return true; }
    else { return false; }
};

var parseFloatVirgula = function (val) {
    if (typeof val === "string" && val.indexOf(",") > 0) {
        val = val.replaceAll(".", "");
        val = val.replace(",", ".");
    }        
    let valor = parseFloat(val);
    return isNaN(valor) ? 0 : valor;
};

Array.prototype.any = function (exp) {
    if (!exp)
        return this.length > 0;
    else if (typeof exp === "function")
        return this.filter(exp).length > 0;
    return false;
};

Array.prototype.firstOrDefault = function (filtro) {
    if (this.length === 0)
        return null;

    if (window.isNullOrEmpty(filtro))
        return this[0];

    var filtrado = this.filter(filtro);
    return filtrado.length === 0 ? null : filtrado[0];
};

Array.prototype.lastOrDefault = function (filtro) {
    if (this.length === 0)
        return null;

    if (window.isNullOrEmpty(filtro))
        return this[this.length - 1];

    var filtrado = this.filter(filtro);
    return filtrado.length === 0 ? null : filtrado[filtrado.length - 1];
};