/*******************************************************************************************
*
*   GraphiteJS - JavaScript Game Library
*
*   GraphiteJS is a JavaScript game development library inspired by the popular Python library Pygame.
*   It is meant as an aid for creating games in JavaScript. It makes use of pre-existing JavaScript features,
*   and is not meant as an all in one solution. Besides, the only reason you should be making games in
*   JavaScript is so you can play it on the web. This is not meant for full-scale projects.
*
*   ------------
*
*   This library is free software; you can redistribute it and/or
*   modify it under the terms of the GNU Library General Public
*   License as published by the Free Software Foundation; either
*   version 2 of the License, or (at your option) any later version.
*
*   ------------
*
*   Copyright (c) 2025 Michael Goddard (LeftOverDefault)
*
********************************************************************************************/


//========//
//  MATH  //
//========//
class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        let magnitude = this.magnitude();
        if (magnitude === 0) {
            throw new Error("Cannot normalize a Vector Zero.");
        }
        this.x /= magnitude;
        this.y /= magnitude;
    }

    dot (v) {
        return this.x * v.x + this.y * v.y;
    }

    angle(useRadians) {
		return Math.atan2(this.y, this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
	}

    rotate(angle, useRadians) {
		
		var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
		var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
	
		Vector2Const.temp.copyFrom(this);

		this.x= (Vector2Const.temp.x*cosRY)-(Vector2Const.temp.y*sinRY);
		this.y= (Vector2Const.temp.x*sinRY)+(Vector2Const.temp.y*cosRY);

		return this; 
	}

    isCloseTo (v, tolerance) {	
		if(this.equals(v)) return true;
		
		Vector2Const.temp.copyFrom(this); 
		Vector2Const.temp.minusEq(v); 
		
		return(Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
	}
	
	rotateAroundPoint(point, angle, useRadians) {
		Vector2Const.temp.copyFrom(this); 
		//trace("rotate around point "+t+" "+point+" " +angle);
		Vector2Const.temp.minusEq(point);
		//trace("after subtract "+t);
		Vector2Const.temp.rotate(angle, useRadians);
		//trace("after rotate "+t);
		Vector2Const.temp.plusEq(point);
		//trace("after add "+t);
		this.copyFrom(Vector2Const.temp);
		
	}
}


//=========//
//  COLOR  //
//=========//

class Color {
    constructor(r, g, b, a) {
        this.r = r || 0;
        this.g = g || 0;
        this.b = b || 0;
        this.a = a || 255;
    }

    fromHex(hex, a=255) {
        this.r = parseInt(hex.slice(1, 3), 16);
        this.g = parseInt(hex.slice(3, 5), 16);
        this.b = parseInt(hex.slice(5, 7), 16);
        this.a = a;
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    toHexA() {
        let r = this.r.toString(16).length == 1 ? "0" + this.r.toString(16) : this.r.toString(16);
        let g = this.g.toString(16).length == 1 ? "0" + this.g.toString(16) : this.g.toString(16);
        let b = this.b.toString(16).length == 1 ? "0" + this.b.toString(16) : this.b.toString(16);
        let a = this.a.toString(16).length == 1 ? "0" + this.a.toString(16) : this.a.toString(16);
        return "#" + r + g + b + a;
    }

    toHex() {
        let r = this.r.toString(16).length == 1 ? "0" + this.r.toString(16) : this.r.toString(16);
        let g = this.g.toString(16).length == 1 ? "0" + this.g.toString(16) : this.g.toString(16);
        let b = this.b.toString(16).length == 1 ? "0" + this.b.toString(16) : this.b.toString(16);
        return "#" + r + g + b;
    }

    toRGBA() {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    }

    toRGB() {
        return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
    }

    toHSLA() {
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;
        let a = this.a / 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate Hue
        if (delta == 0)
            h = 0;
        // Red is max
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g)
            h = (b - r) / delta + 2;
        // Blue is max
        else
            h = (r - g) / delta + 4;
    
        h = Math.round(h * 60);

        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;

        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
            
        // Multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);
        a = +(l * 100).toFixed(1);

        return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
    }

    toHSL() {
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r,g,b),
            cmax = Math.max(r,g,b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate Hue
        if (delta == 0)
            h = 0;
        // Red is max
        else if (cmax == r)
            h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax == g)
            h = (b - r) / delta + 2;
        // Blue is max
        else
            h = (r - g) / delta + 4;
    
        h = Math.round(h * 60);

        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;

        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Calculate saturation
        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
            
        // Multiply l and s by 100
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return "hsl(" + h + "," + s + "%," + l + "%)";
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


//=============//
//  TRANSFORM  //
//=============//


//===========//
//  SURFACE  //
//===========//

class Surface {
    constructor(size = { width: 0, height: 0 }) {
        this.width = size.width;
        this.height = size.height;

        this.image = new Image();
        this.image.width = this.width;
        this.image.height = this.height;

        this.angle = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.translation = { x: 0, y: 0 }
    }

    getSize() {
        return { width: this.width, height: this.height};
    }

    rotate(degrees) {
        this.angle = degrees * (Math.PI / 180);
    }

    translate(x=0, y=0) {
        this.translation = { x: x, y: y }
    }

    getRect({ ...positions }) {
        const allowedPositions = [
            "topleft", "topcenter", "topright",
            "middleleft", "center", "middleright",
            "bottomleft", "bottomcenter", "bottomright"
        ];

        const positionKeys = Object.keys(positions);
        if (positionKeys.length !== 1 || !allowedPositions.includes(positionKeys[0])) {
            throw new Error(`Invalid position. Use only one of: ${allowedPositions.join(", ")}`);
        }

        if (positionKeys.length > 1) {
            throw new Error(`Too many arguments. Use only one of: ${allowedPositions.join(", ")}`)
        }

        const key = positionKeys[0];
        const { x, y } = positions[key];

        let rectX, rectY;

        switch (key) {
            case "topleft":
                rectX = x;
                rectY = y;
                break;
            case "topcenter":
                rectX = x - (this.width / 2);
                rectY = y;
                break;
            case "topright":
                rectX = x - this.width;
                rectY = y;
                break;
            case "middleleft":
                rectX = x;
                rectY = y - (this.height / 2);
                break;
            case "center":
                rectX = x - (this.width / 2);
                rectY = y - (this.height / 2);
                break;
            case "middleright":
                rectX = x - this.width;
                rectY = y - (this.height / 2);
                break;
            case "bottomleft":
                rectX = x;
                rectY = y - this.height;
                break;
            case "bottomcenter":
                rectX = x - this.width / 2;
                rectY = y - this.height;
                break;
            case "bottomright":
                rectX = x - this.width;
                rectY = y - this.height;
                break;
        }

        return new Rect({ x: rectX, y: rectY }, { width: this.width, height: this.height });
    }

    // getAt(x, y) {
    //     const pixel = this.ctx.getImageData(x, y, 1, 1).data;
    //     return `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3] / 255})`;
    // }

    // setAt(x, y, color) {
    //     this.ctx.fillStyle = color;
    //     this.ctx.fillRect(x, y, 1, 1);
    // }

    fill(ctx, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    draw(ctx, { rect={}, position={}}) {
        ctx.save()

        let x = 0;
        let y = 0;
        let width = this.width;
        let height = this.height;

        if (rect !== null) {
            x = rect.x;
            y = rect.y;
            width = rect.width;
            height = rect.height;
        } else if (position !== null) {
            x = position.x;
            y = position.y;
        }

        // 1. Compute the center of the surface
        let cx = x + (this.width);
        let cy = y + (this.height);

        // 2. Compute distance (r) from center to a corner
        let r = Math.sqrt((this.width / 2) ** 2 + (this.height / 2) ** 2);

        // 3. Compute original angle to top-left corner
        let originalTheta = Math.atan2(-this.height / 2, -this.width / 2); // Angle to top-left
        let theta = this.angle

        // 4. Compute new top-left position using rotation
        let newX = cx + (r * Math.cos(originalTheta + theta));
        let newY = cy + (r * Math.sin(originalTheta + theta));

        // 5. Move canvas to the new top-left position and rotate
        ctx.translate(newX, newY);
        ctx.rotate(this.angle);
        ctx.translate(-this.width / 2, -this.height / 2);

        // ctx.translate(this.translation.x, this.translation.y)

        // Draw the current surface
        ctx.drawImage(this.image, x, y, width, height);

        ctx.restore();
    }
}

//========//
//  RECT  //
//========//
class Rect {
    constructor(position = { x: 0, y: 0 }, size = { width: 0, height: 0 }) {
        this.x = position.x;
        this.y = position.y;
        this.width = size.width;
        this.height = size.height;
    }

    move(distance = { dx: 0, dy: 0 }) {
        this.x += distance.dx;
        this.y += distance.dy;
    }

    inflate(size = { width: 0, height: 0 }){
        self.width += size.width
        self.height += size.height
    }

    collidePoint(pointPosition = { x: 0, y: 0 }) {
        return this.x <= pointPosition.x <= this.x + this.width && this.y <= pointPosition.y <= this.y + this.height
    }

    collide(collideRect) {
        return not (this.x + this.width <= collideRect.x ||
                    this.x >= collideRect.x + collideRect.width ||
                    this.y + this.height <= collideRect.y ||
                    this.y >= collideRect.y + collideRect.height
        );
    }

    clip(clipRect) {
        let x1 = Math.max(this.x, clipRect.x)
        let y1 = Math.max(this.y, clipRect.y)
        let x2 = Math.max(this.x + this.width, clipRect.x + clipRect.width)
        let y2 = Math.max(this.y + this.height, clipRect.y + clipRect.height)

        if (x1 < x2 && y1 < y2) {
            return new Rect(position={ x: x1, Y: y1}, size={ width: x2 - x1, height: y2 - y1})
        } else {
            return Rect()
        }
    }

    normalize() {
        if (this.width < 0) {
            this.width = 0
        }
        if (this.height < 0) {
            this.height = 0
        }
    }

    copy() {
        return new Rect({ x: this.x, y: this.y }, { width: this.width, height: this.height })
    }

    center() {
        return {
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2)
        }
    }

    size() {
        return {
            width: this.width,
            height: this.height
        }
    }

    top() {
        return this.y;
    }

    right() {
        return this.x + this.width;
    }

    bottom() {
        return this.y + this.height;
    }

    left() {
        return this.x;
    }

    draw(ctx) {

    }
}


//=========//
//  MOUSE  //
//=========//

class Mouse {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.buttons = { left: false, middle: false, right: false };
        this.scrollDelta = 0;
        this.scrollTimeout = null; // Used to detect when scrolling stops
        this.canvas = canvas;

        // Bind event listeners
        this.initEventListeners();
    }

    initEventListeners() {
        // Mouse move event
        this.canvas.addEventListener("mousemove", (event) => this.updatePosition(event));

        // Mouse down event
        this.canvas.addEventListener("mousedown", (event) => this.setButtonState(event, true));

        // Mouse up event
        this.canvas.addEventListener("mouseup", (event) => this.setButtonState(event, false));

        // Mouse leave event (reset all buttons)
        this.canvas.addEventListener("mouseleave", () => this.resetButtons());

        // Scroll event (wheel)
        this.canvas.addEventListener("wheel", (event) => this.handleScroll(event));
    }

    updatePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.x = event.clientX - rect.left;
        this.y = event.clientY - rect.top;
    }

    setButtonState(event, isPressed) {
        if (event.button === 0) this.buttons.left = isPressed;
        if (event.button === 1) this.buttons.middle = isPressed;
        if (event.button === 2) this.buttons.right = isPressed;
    }

    resetButtons() {
        this.buttons.left = false;
        this.buttons.middle = false;
        this.buttons.right = false;
    }

    handleScroll(event) {
        this.scrollDelta = event.deltaY; // Positive = scrolling down, Negative = scrolling up

        // Reset scroll value when scrolling stops (after 150ms)
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => this.resetScroll(), 150);
    }

    // Checks if a specific button is currently pressed
    isPressed(button = "left") {
        return !!this.buttons[button];
    }

    // Checks if a specific button is released
    isReleased(button = "left") {
        return !this.buttons[button];
    }

    // Returns the current mouse position
    getPosition() {
        return { x: this.x, y: this.y };
    }

    // Checks if the user is scrolling up
    isScrollingUp() {
        return this.scrollDelta < 0;
    }

    // Checks if the user is scrolling down
    isScrollingDown() {
        return this.scrollDelta > 0;
    }

    // Resets scroll delta (automatically happens after scrolling stops)
    resetScroll() {
        this.scrollDelta = 0;
    }
}


//==============//
//  KEYBOARDER  //
//==============//

class Keyboarder {
    constructor() {
        this.keys = new Set(); // Holds currently pressed keys
        this.justPressed = new Set(); // Holds keys pressed this frame
        this.justReleased = new Set(); // Holds keys released this frame
        this.modifiers = { shift: false, ctrl: false, alt: false, meta: false };
        this.capsLock = false;
        this.lastKeyTime = {}; // Tracks timestamps for key press durations

        this.preventDefaultKeys = new Set([" "]); // Example: Prevent space scrolling

        // Bind event listeners
        this.initEventListeners();
    }

    initEventListeners() {
        document.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.addEventListener("keyup", (event) => this.handleKeyUp(event));
        document.addEventListener("blur", () => this.resetKeys()); // Reset when losing focus
    }

    handleKeyDown(event) {
        const key = event.key.toLowerCase();

        // Prevent default action for specific keys
        if (this.preventDefaultKeys.has(key)) {
            event.preventDefault();
        }

        if (!this.keys.has(key)) {
            this.justPressed.add(key); // Mark as freshly pressed
            this.lastKeyTime[key] = performance.now(); // Store the press time
        }

        this.keys.add(key);
        this.updateModifiers(event);
        this.checkCapsLock(event);
    }

    handleKeyUp(event) {
        const key = event.key.toLowerCase();

        if (this.keys.has(key)) {
            this.justReleased.add(key);
            delete this.lastKeyTime[key]; // Remove press time tracking
        }

        this.keys.delete(key);
        this.updateModifiers(event);
    }

    resetKeys() {
        this.keys.clear();
        this.justPressed.clear();
        this.justReleased.clear();
        this.lastKeyTime = {};
    }

    updateModifiers(event) {
        this.modifiers.shift = event.shiftKey;
        this.modifiers.ctrl = event.ctrlKey;
        this.modifiers.alt = event.altKey;
        this.modifiers.meta = event.metaKey;
    }

    checkCapsLock(event) {
        if (event.getModifierState) {
            this.capsLock = event.getModifierState("CapsLock");
        }
    }

    // Is a key currently being held down?
    isPressed(key) {
        return this.keys.has(key.toLowerCase());
    }

    // Was a key just pressed (only true for one frame)?
    isJustPressed(key) {
        return this.justPressed.has(key.toLowerCase());
    }

    // Was a key just released (only true for one frame)?
    isJustReleased(key) {
        return this.justReleased.has(key.toLowerCase());
    }

    // Returns true if multiple keys are held down together
    areKeysPressed(...keys) {
        return keys.every((key) => this.keys.has(key.toLowerCase()));
    }

    // Returns true if a key is held down for a certain duration (in ms)
    isHeld(key, duration = 500) {
        const keyLower = key.toLowerCase();
        if (!this.keys.has(keyLower) || !this.lastKeyTime[keyLower]) return false;
        return performance.now() - this.lastKeyTime[keyLower] >= duration;
    }

    // Is caps lock currently on?
    isCapsLockOn() {
        return this.capsLock;
    }

    // Clears "just pressed" and "just released" states (should be called every frame)
    clearFrameStates() {
        this.justPressed.clear();
        this.justReleased.clear();
    }
}


//========//
//  TEXT  //
//========//

class Font {
    constructor(fontFamily, size) { 
        this.fontFamily = fontFamily
        this.size = size
    }

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily
    }

    setSize(size) {
        this.size = size
    }

    draw(ctx, text, color, position={ x: 0, y: 0 }, wraplength=0) {
        ctx.fillStyle = color.toHexA();
        ctx.font = `${this.size}px ${this.fontFamily}`;
        ctx.fillText(text, position.x, position.y);
    }
}


//========//
//  TIME  //
//========//


//=========//
//  AUDIO  //
//=========//


//===========//
//  NETWORK  //
//===========//


//==============//
//  GRAPHITEJS  //
//==============//

class Engine {
    constructor() {
        this.baseWidth = 1920;
        this.baseHeight = 1080;
        this.canvas = {};
        this.ctx = {};
        this.width = {};
        this.height = {};
    }
    
    init() {
        this.color = {
            Color: Color,
            RED: new Color(255, 0, 0),
            GREEN: new Color(0, 255, 0),
            BLUE: new Color(0, 0, 255),
            WHITE: new Color(255, 255, 255),
            BLACK: new Color(0, 0, 0),
            YELLOW: new Color(255, 255, 0),
            CYAN: new Color(0, 255, 255),
            MAGENTA: new Color(255, 0, 255),
            ORANGE: new Color(255, 165, 0),
            PINK: new Color(255, 192, 203),
            PURPLE: new Color(128, 0, 128),
            BROWN: new Color(165, 42, 42),
            GREY: new Color(128, 128, 128),
            LIGHTGREY: new Color(211, 211, 211),
            DARKGREY: new Color(169, 169, 169),
            AQUA: new Color(0, 255, 255),
            LIME: new Color(0, 255, 0),
            MAROON: new Color(128, 0, 0),
            NAVY: new Color(0, 0, 128),
            OLIVE: new Color(128, 128, 0),
            TEAL: new Color(0, 128, 128),
            SILVER: new Color(192, 192, 192),
            GOLD: new Color(255, 215, 0),
            SKYBLUE: new Color(135, 206, 235),
            VIOLET: new Color(238, 130, 238),
            randomColor: function() {
                return (new Color()).fromHex('#' + Math.floor(Math.random() * 16777215).toString(16));
            }
        }

        this.math = {
            TO_DEGREES : 180 / Math.PI,
            TO_RADIANS : Math.PI / 180,
            Vector2: Vector2,
        };
        
        this.transform = {};
        this.image = {};
        this.surface = {
            Surface: Surface
        };
        this.rect = {
            Rect: Rect
        };
        this.Mouse = Mouse;
        this.keyboard = {
            KEYS: {

            },
            Keyboarder: Keyboarder
        };
        this.text = {
            Font: Font
        };
        this.time = {};
        this.audio = {};
        this.network = {};
    }

    setCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = (9 / 16) * window.innerWidth;

        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    getCtx() {
        return this.ctx;
    }
}

window.graphite = new Engine();
