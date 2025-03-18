//===============================================================================================================//
//
//   GraphiteJS - JavaScript Game Library
//
//   GraphiteJS is a JavaScript game development library inspired by the popular Python library Pygame.
//   It is meant as an aid for creating games in JavaScript. It makes use of pre-existing JavaScript features,
//   and is not meant as an all in one solution. Besides, the only reason you should be making games in
//   JavaScript is so you can play it on the web. This is not meant for full-scale projects.
//
//   ------------
//
//   This library is free software; you can redistribute it and/or
//   modify it under the terms of the GNU Library General Public
//   License as published by the Free Software Foundation; either
//   version 2 of the License, or (at your option) any later version.
//
//   ------------
//
//   Copyright (c) 2025 Michael Goddard (LeftOverDefault)
//
//===============================================================================================================//


//========//
//  MATH  //
//========//

function pythagoras(a, b) {
    return ((a ** 2) + (b ** 2)) ** 0.5;
}

function pythagoras(a, c) {
    return ((c ** 2) - (a ** 2)) ** 0.5;
}


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

    dot(v) {
        return this.x * v.x + this.y * v.y;
    }

    angle(useRadians) {
        return Math.atan2(this.y, this.x) * (useRadians ? 1 : Vector2Const.TO_DEGREES);
    }

    rotate(angle, useRadians) {

        var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
        var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));

        Vector2Const.temp.copyFrom(this);

        this.x = (Vector2Const.temp.x * cosRY) - (Vector2Const.temp.y * sinRY);
        this.y = (Vector2Const.temp.x * sinRY) + (Vector2Const.temp.y * cosRY);

        return this;
    }

    isCloseTo(v, tolerance) {
        if (this.equals(v)) return true;

        Vector2Const.temp.copyFrom(this);
        Vector2Const.temp.minusEq(v);

        return (Vector2Const.temp.magnitudeSquared() < tolerance * tolerance);
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


class Vector3 {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    clone() {
        return new Vectorz(this.x, this.y, this.z);
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        let magnitude = this.magnitude();
        if (magnitude === 0) {
            throw new Error("Cannot normalize a Vector Zero.");
        }
        this.x /= magnitude;
        this.y /= magnitude;
        this.z /= magnitude;
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    // angle(useRadians) {
    // 	return Math.atan2(this.y, this.x) * (useRadians ? 1 : Vector3Const.TO_DEGREES);
    // }

    // rotate(angle, useRadians) {

    // 	var cosRY = Math.cos(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));
    // 	var sinRY = Math.sin(angle * (useRadians ? 1 : Vector2Const.TO_RADIANS));

    // 	Vector2Const.temp.copyFrom(this); 

    // 	this.x= (Vector2Const.temp.x*cosRY)-(Vector2Const.temp.y*sinRY);
    // 	this.y= (Vector2Const.temp.x*sinRY)+(Vector2Const.temp.y*cosRY);

    // 	return this; 
    // }

    // isCloseTo (v, tolerance) {
    // 	if(this.equals(v)) return true;

    // 	Vector2Const.temp.copyFrom(this); 
    // 	Vector2Const.temp.minusEq(v); 

    // 	return(Vector2Const.temp.magnitudeSquared() < tolerance*tolerance);
    // }

    // rotateAroundPoint(point, angle, useRadians) {
    // 	Vector2Const.temp.copyFrom(this); 
    // 	//trace("rotate around point "+t+" "+point+" " +angle);
    // 	Vector2Const.temp.minusEq(point);
    // 	//trace("after subtract "+t);
    // 	Vector2Const.temp.rotate(angle, useRadians);
    // 	//trace("after rotate "+t);
    // 	Vector2Const.temp.plusEq(point);
    // 	//trace("after add "+t);
    // 	this.copyFrom(Vector2Const.temp);

    // }
}


//=========//
//  COLOR  //
//=========//

class Color {
    constructor(r = 0, g = 0, b = 0, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    toHexA() {
        let code = "#" + this._toHex(this.r) + this._toHex(this.g) + this._toHex(this.b) + this._toHex(this.a);
        return code
    }

    _toHex(n) {
        var hex = n.toString(16);
        while (hex.length < 2) { hex = "0" + hex; }
        return hex;
    }

    toHex() {
        return "#" + this._toHex(this.r) + this._toHex(this.g) + this._toHex(this.b);
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


//=============//
//  TRANSFORM  //
//=============//

/** Scale a surface object.
 * @param {Surface} surface - The surface object.
 * @param {object} size - The new size (in pixels) for the surface: `{ width: {number}, height: {number} }`.
 */
function surfaceScale(surface, size = { width: 0, height: 0 }) {
    surface.width = size.width;
    surface.height = size.height;
}

function surfaceScaleBy(surface, scaleFactor) {
    surface.width = surface.width * scaleFactor;
    surface.height = surface.height * scaleFactor;
}

function surfaceFlip(surface, flipX, flipY) {
    // let newSurface = new Surface();
    // if (flipX)
}

function rectScale(rect, size = { x: 0, y: 0 }) {
    rect.width = size.x;
    rect.height = size.y;
}

function rectScaleBy(rect, scaleFactor) {
    rect.width = rect.width * scaleFactor;
    rect.height = rect.height * scaleFactor;
}


//===========//
//  SURFACE  //
//===========//

class Surface {
    constructor(size = { width: 0, height: 0 }) {
        this.width = size.width;
        this.height = size.height;

        this.fillColor = new Color();
    }

    fill(color = Color() || { r: 0, g: 0, b: 0, a: 255 } || null) {
        if (color === null) {
            this.fillColor = null;
        } else {
            this.fillColor = new Color(color.r, color.g, color.b, color.a);
        }
    }

    unfill() {
        this.fillColor = null;
    }

    getRect(position) {
        let point = Object.keys(position)[0];
        let coordinate = position[point];

        let x = coordinate.x;
        let y = coordinate.y;

        switch (point) {
            case "topleft":
                x = coordinate.x;
                y = coordinate.y;
                break;
            case "top":
                x = coordinate.x - (this.width / 2);
                y = coordinate.y;
                break;
            case "topright":
                x = coordinate.x - (this.width);
                y = coordinate.y;
                break;
            case "left":
                x = coordinate.x;
                y = coordinate.y - (this.height / 2);
                break;
            case "center":
                x = coordinate.x - (this.width / 2);
                y = coordinate.y - (this.height / 2);
                break;
            case "right":
                x = coordinate.x - (this.width);
                y = coordinate.y - (this.height / 2);
                break;
            case "bottomleft":
                x = coordinate.x;
                y = coordinate.y - (this.height);
                break;
            case "bottom":
                x = coordinate.x - (this.width / 2);
                y = coordinate.y - (this.height);
                break;
            case "bottomright":
                x = coordinate.x - (this.width);
                y = coordinate.y - (this.height);
                break;
        }

        return new Rect({ x: x, y: y }, { width: this.width, height: this.height });
    }

    draw(ctx, rect = null, position = null) {
        ctx.save();

        if (rect === null && position === null) {
            throw new Error("`<Surface> -> <draw>` must contain either {rect} or {position}.");
        }

        if (rect !== null && position !== null) {
            throw new Error("`<Surface> -> <draw>` cannot contain both {rect} and {position}.");
        }

        let x = rect.x || position.x;
        let y = rect.y || position.y;
        let width = rect.width || this.width;
        let height = rect.height || this.height;

        // Other drawing stuff ...

        if (this.fillColor !== null) {
            ctx.fillStyle = this.fillColor.toHexA();
            ctx.fillRect(x, y, width, height);
        }

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

    move(position = { x: 0, y: 0 }) {
        this.x += position.x;
        this.y += position.y;
    }

    moveTo(position = { x: 0, y: 0 }) {
        this.x = position.x;
        this.y = position.y;
    }

    inflate(size = { width: 0, height: 0 }) {
        this.width -= size.width;
        this.height -= size.height;

        this.x = this.x - (size.width / 2);
        this.y = this.y - (size.height / 2);
    }

    collidePoint(point = { x, y }) {
        return (
            point.x >= this.x &&
            point.x <= this.x + this.width &&
            point.y >= this.y &&
            point.y <= this.y + this.height
        );
    }

    collideRect(rect) {
        return not(
            this.x >= rect.x + rect.width ||
            this.x + this.width <= rect.x ||
            this.y >= rect.y + rect.height ||
            this.y + this.height <= rect.y
        );
    }
}


//=========//
//  IMAGE  //
//=========//

class SurfaceImage extends Surface {
    constructor(imageSource) {
        super();

        this.image = new Image();
        this.image.src = imageSource;

        this.fillColor = null;

        this.width = this.image.width;
        this.height = this.image.height;
    }

    draw(ctx, rect = null, position = null) {
        ctx.save();

        if (rect === null && position === null) {
            throw new Error("`<Image> -> <draw>` must contain either {rect} or {position}.");
        }

        if (rect !== null && position !== null) {
            throw new Error("`<Image> -> <draw>` cannot contain both {rect} and {position}.");
        }

        let x = rect.x || position.x;
        let y = rect.y || position.y;
        let width = rect.width || this.image.width;
        let height = rect.height || this.image.height;

        ctx.drawImage(this.image, x, y);

        if (this.fillColor !== null) {
            ctx.fillStyle = this.fillColor.toHexA();
            ctx.fillRect(x, y, width, height);
        }

        ctx.restore();
    }
}


//=========//
//  MOUSE  //
//=========//

class Mouse {
    #canvas;

    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.buttons = { left: false, middle: false, right: false };
        this.scrollDelta = 0;
        this.scrollTimeout = null; // Used to detect when scrolling stops

        this.#canvas = canvas;

        // Bind event listeners
        this.#initEventListeners();
    }

    #initEventListeners() {
        // Mouse move event
        this.#canvas.addEventListener("mousemove", (event) => this.#updatePosition(event));

        // Mouse down event
        this.#canvas.addEventListener("mousedown", (event) => this.#setButtonState(event, true));

        // Mouse up event
        this.#canvas.addEventListener("mouseup", (event) => this.#setButtonState(event, false));

        // Mouse leave event (reset all buttons)
        this.#canvas.addEventListener("mouseleave", () => this.#resetButtons());

        // Scroll event (wheel)
        this.#canvas.addEventListener("wheel", (event) => this.#handleScroll(event), { passive: true });
    }

    #updatePosition(event) {
        const rect = this.#canvas.getBoundingClientRect();
        const scaleX = this.#canvas.width / rect.width; // Account for horizontal scaling
        const scaleY = this.#canvas.height / rect.height; // Account for vertical scaling

        this.x = (event.clientX - rect.left) * scaleX;
        this.y = (event.clientY - rect.top) * scaleY;
    }

    #setButtonState(event, isPressed) {
        if (event.button === 0) this.buttons.left = isPressed;
        if (event.button === 1) this.buttons.middle = isPressed;
        if (event.button === 2) this.buttons.right = isPressed;
    }

    #resetButtons() {
        this.buttons.left = false;
        this.buttons.middle = false;
        this.buttons.right = false;
    }

    #handleScroll(event) {
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
    constructor(canvas) {
        this._canvas = canvas
        this.keys = new Set(); // Holds currently pressed keys
        this.justPressed = new Set(); // Holds keys pressed this frame
        this.justReleased = new Set(); // Holds keys released this frame
        this.modifiers = { shift: false, ctrl: false, alt: false, meta: false };
        this.capsLock = false;
        this.lastKeyTime = {}; // Tracks timestamps for key press durations

        this.preventDefaultKeys = new Set([" "]); // Example: Prevent space scrolling

        // Bind event listeners
        this.#initEventListeners();
    }

    #initEventListeners() {
        this._canvas.addEventListener("keydown", (event) => this.#handleKeyDown(event));
        this._canvas.addEventListener("keyup", (event) => this.#handleKeyUp(event));
        this._canvas.addEventListener("blur", () => this.#resetKeys()); // Reset when losing focus
    }

    #handleKeyDown(event) {
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

    #handleKeyUp(event) {
        const key = event.key.toLowerCase();

        if (this.keys.has(key)) {
            this.justReleased.add(key);
            delete this.lastKeyTime[key]; // Remove press time tracking
        }

        this.keys.delete(key);
        this.updateModifiers(event);
    }

    #resetKeys() {
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
//  TIME  //
//========//

class Clock {
    constructor() {
        this.lastTime = performance.now();
        this.deltaTime = 0;
        this.fps = 60;
        this.timeScale = 1;  // For controlling time speed
    }

    // Sets the max frame rate (similar to PyGame's tick method)
    tick(fps = 60) {
        this.fps = fps;
        const now = performance.now();
        this.deltaTime = (now - this.lastTime) * (this.timeScale);
        this.lastTime = now;

        const frameDelay = 1000 / this.fps;
        const delay = Math.max(0, frameDelay - this.deltaTime);
        return delay;
    }

    // Returns the time passed since the last frame in milliseconds
    getDeltaTime() {
        return this.deltaTime;
    }

    // Returns the current time in milliseconds
    getTicks() {
        return performance.now();
    }

    // Adds an artificial delay (similar to pygame.time.delay)
    delay(milliseconds) {
        const start = performance.now();
        while (performance.now() - start < milliseconds);
    }

    // Set the time scale (for slow-motion or speed-up effects)
    setTimeScale(scale) {
        this.timeScale = scale;
    }

    // Reset the clock
    reset() {
        this.lastTime = performance.now();
        this.deltaTime = 0;
    }
}


//=========//
//  AUDIO  //
//=========//

class Music {
    static instance = null;

    constructor(source, loop = true, volume = 1.0) {

        if (Music.instance) {
            Music.instance.stop();
        }

        this.audio = new Audio(source);
        this.audio.loop = loop; // Loop by default
        this.audio.volume = volume;

        this.#playOnUserInteraction();

        Music.instance = this; // Singleton pattern
    }

    #playOnUserInteraction() {
        const playAudio = () => {
            this.audio.play();
            // Remove the event listener after first interaction
            document.removeEventListener('click', playAudio);
            document.removeEventListener('keydown', playAudio);
        };

        // Add event listeners to wait for user interaction
        document.addEventListener('click', playAudio);
        document.addEventListener('keydown', playAudio);
    }

    play() {
        this.audio.play().catch((error) => {
            console.warn(`Audio autoplay blocked. Waiting for user interaction. (${error})`);
        });
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.pause();
        this.audio.currentTime = 0;
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }

    fadeOut(duration = 1000) {
        const step = 0.01; // Decrease volume by 0.01 each frame
        const interval = setInterval(() => {
            if (this.audio.volume > 0) {
                this.audio.volume = Math.max(this.audio.volume - step, 0);
            } else {
                clearInterval(interval);
                this.stop(); // Stop music when fully faded out
            }
        }, duration / (1 / step));
    }
}


class Sound {
    constructor(source, volume = 1.0) {
        this.audio = new Audio(source);
        this.audio.preload = "auto";
        this.audio.volume = volume;

        this.#allowPlayOnUserInteraction();
    }

    #allowPlayOnUserInteraction() {
        const playAudio = () => {
            this.audio.play();
            // Remove the event listener after first interaction
            document.removeEventListener('click', playAudio);
            document.removeEventListener('keydown', playAudio);
        };

        // Add event listeners to wait for user interaction
        document.addEventListener('click', playAudio);
        document.addEventListener('keydown', playAudio);
    }

    play() {
        const clone = this.audio.cloneNode(); // Allows overlapping sounds
        clone.play().catch((error) => {
            console.warn(`Audio autoplay blocked. Waiting for user interaction. (${error})`);
        });;
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.pause();
        this.audio.currentTime = 0;
    }

    setVolume(volume) {
        this.audio.volume = volume;
    }
}


//===========//
//  NETWORK  //
//===========//

/**
 * Socket object for communicating with a server.
 * @constructor
 * @param {string} url - The URL of the server to connect to.
 */
class Socket {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.isConnected = false;
        this.eventHandlers = {};

        this.#connect();
    }

    /**
     * @connect
     * 
     * Connects the Network to the Server using a WebSocket.
     */
    #connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            this.isConnected = true;
            console.log("[ NETWORK ][ OUT ]: Connected to Server.");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleEvent(data.type, data.payload);
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            console.log("[ NETWORK ][ OUT ]: Disconnected from Server.");
        };

        this.socket.onerror = (error) => {
            console.error("[ NETWORK ][ ERR ]:", error);
        };
    }

    send(eventType, data) {
        if (this.isConnected) {
            this.socket.send(JSON.stringify({
                type: eventType,
                payload: data
            }));
        } else {
            console.warn("[ NETWORK ][ ERR ]: Cannot send data, not connected.");
        }
    }

    handleEvent(eventType, data) {
        const handler = this.eventHandlers[eventType];
        if (handler) {
            handler(data);
        }
    }

    // Add event listener for a specific message type
    on(eventType, callback) {
        this.eventHandlers[eventType] = callback;
    }

    // Disconnect from server
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}


//==============//
//  GRAPHITEJS  //
//==============//

class Framework {
    constructor() {
        this.canvas = {};
        this.context = {};
    }

    globals() {
        // this.module = module;
    }

    init() {
        this.math = {
            Vector2: Vector2,
        }
        this.color = {
            Color: Color
        }
        this.transformation = {
            surface: {
                scale: surfaceScale,
                scaleBy: surfaceScaleBy
            },
            rect: {
                scale: rectScale,
                scaleBy: rectScaleBy
            }
        }
        this.surface = {
            Surface: Surface,
        }
        this.rect = {
            Rect: Rect,
        }
        // this.frect = {}
        this.image = {
            Image: SurfaceImage,
        }
        this.mouse = {
            Mouse: Mouse,
        }
        this.keyboard = {
            Keyboarder: Keyboarder,
        }
        this.time = {
            Clock: Clock,
        }
        this.audio = {
            Music: Music,
            Sound: Sound,
        }
        this.network = {
            Socket: Socket,
        }
    }

    setCanvas(canvas, size = { width: 1920, height: 1080 }) {
        this.canvas = canvas
        this.context = this.canvas.getContext("2d");

        // this.canvas.width = window.innerWidth;
        // this.canvas.height = (9 / 16) * window.innerWidth;
        this.canvas.width = size.width;
        this.canvas.height = size.height;
    }
}

let framework = new Framework()

window.graphitejs = framework;
