class Color {
    constructor(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 255;
    }

    constructor(hex, a=255) {
        hex = hex.replace(/^#/, "");
        this.r = parseInt(hex.substring(0, 2), 16);
        this.g = parseInt(hex.substring(2, 4), 16);
        this.b = parseInt(hex.substring(4, 6), 16);
        this.a = a;
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    toHexA() {
        return "#" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16) + this.a.toString(16);
    }

    toHex() {
        return "#" + this.r.toString(16) + this.g.toString(16) + this.b.toString(16);
    }

    toRGBA() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }

    toRGB() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }

    toHSLA() {
        let hsl = this.toHSL();
        return "hsla(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%," + this.a + ")";
    }

    toHSL() {
        let hsl = this.toHSL();
        return "hsl(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%)";
    }

    equals(color) {
        return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
    }

    add(color) {
        this.r += color.r;
        this.g += color.g;
        this.b += color.b;
        return this;
    }

    minus(color) {
        this.r -= color.r;
        this.g -= color.g;
        this.b -= color.b;
        return this;
    }

    multiply(color) {
        this.r *= color.r;
        this.g *= color.g;
        this.b *= color.b;
        return this;
    }

    divide(color) {
        this.r /= color.r;
        this.g /= color.g;
        this.b /= color.b;
        return this;
    }

    multiply(scalar) {
        this.r *= scalar;
        this.g *= scalar;
        this.b *= scalar;
        return this;
    }

    divide(scalar) {
        this.r /= scalar;
        this.g /= scalar;
        this.b /= scalar;
        return this;
    }

}
