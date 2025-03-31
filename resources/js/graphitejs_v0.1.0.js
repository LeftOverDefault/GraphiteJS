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


//===========//
//  SURFACE  //
//===========//

/**
 * Represents a drawable surface.
 */
class Surface {
  /**
   * Creates a new Surface.
   * @param {Object} size - The width and height of the surface.
   * @param {number} size.width - The width of the surface.
   * @param {number} size.height - The height of the surface.
   */
  constructor(size = { width: 0, height: 0 }) {
    /** @type {number} The width of the surface. */
    this.width = size.width;

    /** @type {number} The height of the surface. */
    this.height = size.height;

    /** @type {string | null} The fill color of the surface (if any). */
    this.fillColor = null;
  }

  /**
   * Sets the fill color of the surface.
   * @param {string | Object | null} color - The fill color (CSS string or {r, g, b, a} object).
   */
  fill(color = null) {
    if (color === null) {
      this.fillColor = null;
    } else if (typeof color === "string") {
      this.fillColor = color; // Assume valid CSS color (e.g., "red", "#ff0000")
    } else if (typeof color === "object" && "r" in color) {
      // Convert {r, g, b, a} to CSS rgba()
      this.fillColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a ?? 1})`;
    } else {
      throw new Error("Invalid color format.");
    }
  }

  /**
   * Removes the fill color, making the surface transparent.
   */
  unfill() {
    this.fillColor = null;
  }

  /**
   * Returns a Rect object that represents this surface at a given position.
   * @param {Object} position - The positioning dictionary (e.g., { center: {x: 100, y: 100} }).
   * @returns {Rect} A Rect object with the appropriate position and size.
   */
  getRect(position) {
    let key = Object.keys(position)[0]; // e.g., "center"
    let { x, y } = position[key]; // Get coordinates

    switch (key) {
      case "topleft":
        break; // x, y are correct
      case "top":
        x -= this.width / 2;
        break;
      case "topright":
        x -= this.width;
        break;
      case "left":
        y -= this.height / 2;
        break;
      case "center":
        x -= this.width / 2;
        y -= this.height / 2;
        break;
      case "right":
        x -= this.width;
        y -= this.height / 2;
        break;
      case "bottomleft":
        y -= this.height;
        break;
      case "bottom":
        x -= this.width / 2;
        y -= this.height;
        break;
      case "bottomright":
        x -= this.width;
        y -= this.height;
        break;
      default:
        throw new Error(`Invalid position key: ${key}`);
    }

    return new Rect({ x, y }, { width: this.width, height: this.height });
  }

  /**
   * Draws the surface on the given canvas rendering context.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {Rect | Object} [rectOrPosition] - The rectangle or position object.
   */
  draw(ctx, rectOrPosition) {
    if (!ctx) throw new Error("Canvas context is required for drawing.");

    let x, y, width, height;

    if (rectOrPosition instanceof Rect) {
      ({ x, y, width, height } = rectOrPosition);
    } else if (rectOrPosition) {
      let rect = this.getRect(rectOrPosition);
      ({ x, y, width, height } = rect);
    } else {
      throw new Error("`draw` requires either a Rect or a position object.");
    }

    ctx.save();

    // Draw the filled rectangle if a color is set
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(x, y, width, height);
    }

    ctx.restore();
  }
}


class ImageSurface extends Surface {
  #image;

  constructor(imageSource) {
    super();

    this.#image = new Image();
    this.#image.src = imageSource;

    this.width = this.#image.width;
    this.height = this.#image.height;
  }
}


//========//
//  RECT  //
//========//

/**
 * Represents a rectangular shape with integer-based coordinates.
 */
class Rect {
  /**
   * Creates a new rectangle.
   * @param {Object} position - The x, y position.
   * @param {number} position.x - The x position.
   * @param {number} position.y - The y position.
   * @param {Object} size - The width and height of the Rect.
   * @param {number} size.width - The width of the Rect.
   * @param {number} size.height - The height of the Rect.
   */
  constructor(position = { x: 0, y: 0 }, size = { width: 0, height: 0 }) {
    this.x = Math.round(position.x);
    this.y = Math.round(position.y);
    this.width = Math.round(size.width);
    this.height = Math.round(size.height);
  }

  // Returns a copy of the rectangle
  copy() {
    return new Rect({ x: this.x, y: this.y }, { width: this.width, height: this.height });
  }

  /**
   * Moves the rectangle by a certain amount.
   * @param {{ x: number, y: number }} offset - The x, y offset.
   */
  move(offset = { x: 0, y: 0 }) {
    this.x += offset.x;
    this.y += offset.y;
  }

  /**
   * Moves the rectangle to an absolute position.
   * @param {{ x: number, y: number }} position - The new x, y position.
   */
  moveTo(position = { x: 0, y: 0 }) {
    this.x = position.x;
    this.y = position.y;
  }

  // Inflates size while keeping centered
  /**
   * Expands or shrinks the rectangle.
   * @param {{ width: number, height: number }} size - The change in width/height.
   */
  inflate(size = { width: 0, height: 0 }) {
    this.x -= size.width / 2;
    this.y -= size.height / 2;
    this.width += size.width;
    this.height += size.height;
  }

  // Scales by a factor
  scaleBy(factor) {
    return new Rect(
      { x: this.x - (this.width * (factor - 1)) / 2, y: this.y - (this.height * (factor - 1)) / 2 },
      { width: this.width * factor, height: this.height * factor }
    );
  }

  scaleByIP(factor) {
    this.x -= (this.width * (factor - 1)) / 2;
    this.y -= (this.height * (factor - 1)) / 2;
    this.width *= factor;
    this.height *= factor;
  }

  // Ensures this rect stays within another rect
  clamp(rect) {
    const x = Math.max(rect.x, Math.min(this.x, rect.x + rect.width - this.width));
    const y = Math.max(rect.y, Math.min(this.y, rect.y + rect.height - this.height));
    return new Rect({ x, y }, { width: this.width, height: this.height });
  }

  clampIP(rect) {
    this.x = Math.max(rect.x, Math.min(this.x, rect.x + rect.width - this.width));
    this.y = Math.max(rect.y, Math.min(this.y, rect.y + rect.height - this.height));
  }

  // Collision detection
  /**
   * Checks if a point is inside the rectangle.
   * @param {{ x: number, y: number }} point - The point to check.
   * @returns {boolean} - True if the point is inside.
   */
  collidePoint(point) {
    return point.x >= this.x && point.x <= this.x + this.width && point.y >= this.y && point.y <= this.y + this.height;
  }

  /**
   * Checks if another rectangle overlaps with this one.
   * @param {Rect} rect - The other rectangle.
   * @returns {boolean} - True if they collide.
   */
  collideRect(rect) {
    return !(
      this.x >= rect.x + rect.width ||
      this.x + this.width <= rect.x ||
      this.y >= rect.y + rect.height ||
      this.y + this.height <= rect.y
    );
  }

  collideList(rects) {
    return rects.find((rect) => this.collideRect(rect)) || null;
  }

  collideAll(rects) {
    return rects.filter((rect) => this.collideRect(rect));
  }

  // Set edges
  setEdges({ left, right, top, bottom }) {
    if (left !== undefined) this.x = left;
    if (right !== undefined) this.x = right - this.width;
    if (top !== undefined) this.y = top;
    if (bottom !== undefined) this.y = bottom - this.height;
  }

  setCenter({ x, y }) {
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
  }

  setBottom(bottom) {
    this.y = bottom - this.height;
  }

  // Get properties
  get topleft() {
    return { x: this.x, y: this.y };
  }

  get bottomright() {
    return { x: this.x + this.width, y: this.y + this.height };
  }

  get center() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }
}


/**
 * Represents a floating-point rectangle for smoother movement.
 */
class FRect extends Rect {
  constructor(position = { x: 0, y: 0 }, size = { width: 0, height: 0 }) {
    super(position, size);
    this.x = position.x;
    this.y = position.y;
    this.width = size.width;
    this.height = size.height;
  }

  move(offset) {
    return new FRect({ x: this.x + offset.x, y: this.y + offset.y }, { width: this.width, height: this.height });
  }

  moveIP(offset) {
    this.x += offset.x;
    this.y += offset.y;
  }

  inflate(size) {
    return new FRect(
      { x: this.x - size.width / 2, y: this.y - size.height / 2 },
      { width: this.width + size.width, height: this.height + size.height }
    );
  }

  inflateIP(size) {
    this.x -= size.width / 2;
    this.y -= size.height / 2;
    this.width += size.width;
    this.height += size.height;
  }

  scaleBy(factor) {
    return new FRect(
      { x: this.x - (this.width * (factor - 1)) / 2, y: this.y - (this.height * (factor - 1)) / 2 },
      { width: this.width * factor, height: this.height * factor }
    );
  }

  scaleByIP(factor) {
    this.x -= (this.width * (factor - 1)) / 2;
    this.y -= (this.height * (factor - 1)) / 2;
    this.width *= factor;
    this.height *= factor;
  }
}


//========//
//  FONT  //
//========//

/**
 * Represents a font for rendering text on the Canvas.
 */
class Font {
  constructor(family = "Arial", size = 24, bold = false, italic = false) {
    this.family = family;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
    this.underline = false;
    this.strikethrough = false;
    this.color = "black";
    this.align = "left"; // "left", "center", or "right"
  }

  getFontString() {
    return `${this.italic ? "italic " : ""}${this.bold ? "bold " : ""}${this.size}px ${this.family}`;
  }

  getSize(ctx, text) {
    ctx.font = this.getFontString();
    const metrics = ctx.measureText(text);
    return { width: metrics.width, height: this.size };
  }

  render(ctx, text, x, y) {
    ctx.save();
    ctx.font = this.getFontString();
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = "top";

    ctx.fillText(text, x, y);

    if (this.underline || this.strikethrough) {
      let { width, height } = this.getSize(ctx, text);
      let lineY = y + (this.underline ? height + 2 : height / 2);
      ctx.beginPath();
      ctx.moveTo(x, lineY);
      ctx.lineTo(x + width, lineY);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = height / 12;
      ctx.stroke();
    }

    ctx.restore();
  }
}


//=============//
//  TRANSFORM  //
//=============//


//=========//
//  MOUSE  //
//=========//

/**
 * A utility class for tracking mouse interactions on an HTML canvas.
 */
class Mouse {
  #canvas;

  /**
   * Initializes the mouse tracking system for a given canvas.
   * @param {HTMLCanvasElement} canvas - The canvas element to track mouse events on.
   */
  constructor(canvas) {
    this.x = 0; // Current x-coordinate of the mouse (relative to the canvas)
    this.y = 0; // Current y-coordinate of the mouse (relative to the canvas)

    this.buttons = { left: false, middle: false, right: false }; // Tracks the state of mouse buttons
    this.scrollDelta = 0; // Tracks the scroll direction and speed
    this.scrollTimeout = null; // Timeout to detect when scrolling stops

    this.#canvas = canvas;

    // Initialize event listeners for mouse interactions
    this.#initEventListeners();
  }

  /**
   * Sets up event listeners for mouse interactions.
   * @private
   */
  #initEventListeners() {
    this.#canvas.addEventListener("mousemove", (event) => this.#updatePosition(event));
    this.#canvas.addEventListener("mousedown", (event) => this.#setButtonState(event, true));
    this.#canvas.addEventListener("mouseup", (event) => this.#setButtonState(event, false));
    this.#canvas.addEventListener("mouseleave", () => this.#resetButtons());
    this.#canvas.addEventListener("wheel", (event) => this.#handleScroll(event), { passive: true });
  }

  /**
   * Updates the mouse position relative to the canvas.
   * @param {MouseEvent} event - The mouse event.
   * @private
   */
  #updatePosition(event) {
    const rect = this.#canvas.getBoundingClientRect();
    const scaleX = this.#canvas.width / rect.width; // Scale factor for width
    const scaleY = this.#canvas.height / rect.height; // Scale factor for height

    this.x = (event.clientX - rect.left) * scaleX;
    this.y = (event.clientY - rect.top) * scaleY;
  }

  /**
   * Updates the state of a mouse button.
   * @param {MouseEvent} event - The mouse event.
   * @param {boolean} isPressed - Whether the button is pressed (`true`) or released (`false`).
   * @private
   */
  #setButtonState(event, isPressed) {
    if (event.button === 0) this.buttons.left = isPressed;
    if (event.button === 1) this.buttons.middle = isPressed;
    if (event.button === 2) this.buttons.right = isPressed;
  }

  /**
   * Resets all mouse buttons to the released state.
   * @private
   */
  #resetButtons() {
    this.buttons.left = false;
    this.buttons.middle = false;
    this.buttons.right = false;
  }

  /**
   * Handles mouse scroll events.
   * @param {WheelEvent} event - The scroll event.
   * @private
   */
  #handleScroll(event) {
    this.scrollDelta = event.deltaY; // Positive: scroll down, Negative: scroll up

    // Reset scrollDelta after scrolling stops (after 150ms)
    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => this.resetScroll(), 150);
  }

  /**
   * Checks if a specific mouse button is currently pressed.
   * @param {string} [button="left"] - The button to check (`"left"`, `"middle"`, or `"right"`).
   * @returns {boolean} `true` if the button is pressed, otherwise `false`.
   */
  isPressed(button = "left") {
    return !!this.buttons[button];
  }

  /**
   * Checks if a specific mouse button is released.
   * @param {string} [button="left"] - The button to check (`"left"`, `"middle"`, or `"right"`).
   * @returns {boolean} `true` if the button is released, otherwise `false`.
   */
  isReleased(button = "left") {
    return !this.buttons[button];
  }

  /**
   * Gets the current mouse position relative to the canvas.
   * @returns {{x: number, y: number}} An object containing `x` and `y` coordinates.
   */
  getPosition() {
    return { x: this.x, y: this.y };
  }

  /**
   * Checks if the user is scrolling up.
   * @returns {boolean} `true` if scrolling up, otherwise `false`.
   */
  isScrollingUp() {
    return this.scrollDelta < 0;
  }

  /**
   * Checks if the user is scrolling down.
   * @returns {boolean} `true` if scrolling down, otherwise `false`.
   */
  isScrollingDown() {
    return this.scrollDelta > 0;
  }

  /**
   * Resets the scroll delta to `0`.
   * This happens automatically when scrolling stops.
   */
  resetScroll() {
    this.scrollDelta = 0;
  }
}


//============//
//  KEYBOARD  //
//============//

/**
 * A utility class for tracking keyboard interactions on an HTML canvas using key codes.
 */
class Keyboarder {
  /**
   * Initializes the keyboard tracking system for a given element.
   * @param {HTMLElement} element - The element to listen for keyboard events on.
   */
  constructor(element) {
    this._element = element;

    /** @type {Set<string>} Holds currently pressed keys. */
    this.keys = new Set();

    /** @type {Set<string>} Holds keys that were pressed in the current frame. */
    this.justPressed = new Set();

    /** @type {Set<string>} Holds keys that were released in the current frame. */
    this.justReleased = new Set();

    /** @type {Object} Tracks the state of modifier keys. */
    this.modifiers = { shift: false, ctrl: false, alt: false, meta: false };

    /** @type {boolean} Indicates whether Caps Lock is active. */
    this.capsLock = false;

    /** @type {Object.<string, number>} Tracks timestamps for key press durations. */
    this.lastKeyTime = {};

    /** @type {Set<string>} Keys that should have their default behavior prevented. */
    this.preventDefaultKeys = new Set([Keyboarder.KEYS.SPACE]); // Prevent space scrolling

    // Bind event listeners
    this.#initEventListeners();
  }

  /**
   * Sets up event listeners for keyboard interactions.
   * @private
   */
  #initEventListeners() {
    this._element.addEventListener("keydown", (event) => this.#handleKeyDown(event));
    this._element.addEventListener("keyup", (event) => this.#handleKeyUp(event));
    this._element.addEventListener("blur", () => this.#resetKeys()); // Reset keys when losing focus
  }

  /**
   * Handles key press events.
   * @param {KeyboardEvent} event - The keydown event.
   * @private
   */
  #handleKeyDown(event) {
    const key = event.key;

    // Prevent default behavior for specified keys
    if (this.preventDefaultKeys.has(key)) {
      event.preventDefault();
    }

    if (!this.keys.has(key)) {
      this.justPressed.add(key); // Mark the key as freshly pressed
      this.lastKeyTime[key] = performance.now(); // Record the press timestamp
    }

    this.keys.add(key);
    this.updateModifiers(event);
    this.checkCapsLock(event);
  }

  /**
   * Handles key release events.
   * @param {KeyboardEvent} event - The keyup event.
   * @private
   */
  #handleKeyUp(event) {
    const key = event.key;

    if (this.keys.has(key)) {
      this.justReleased.add(key);
      delete this.lastKeyTime[key]; // Remove tracking for this key
    }

    this.keys.delete(key);
    this.updateModifiers(event);
  }

  /**
   * Resets all tracked key states.
   * @private
   */
  #resetKeys() {
    this.keys.clear();
    this.justPressed.clear();
    this.justReleased.clear();
    this.lastKeyTime = {};
  }

  /**
   * Updates the state of modifier keys (Shift, Ctrl, Alt, Meta).
   * @param {KeyboardEvent} event - The keyboard event.
   */
  updateModifiers(event) {
    this.modifiers.shift = event.shiftKey;
    this.modifiers.ctrl = event.ctrlKey;
    this.modifiers.alt = event.altKey;
    this.modifiers.meta = event.metaKey;
  }

  /**
   * Checks if Caps Lock is active.
   * @param {KeyboardEvent} event - The keyboard event.
   */
  checkCapsLock(event) {
    if (event.getModifierState) {
      this.capsLock = event.getModifierState("CapsLock");
    }
  }

  /**
   * Checks if a key is currently being held down.
   * @param {string} key - The key to check (use `Keyboarder.KEYS` constants).
   * @returns {boolean} `true` if the key is pressed, otherwise `false`.
   */
  isPressed(key) {
    return this.keys.has(key);
  }

  /**
   * Checks if a key was just pressed (true for only one frame).
   * @param {string} key - The key to check (use `Keyboarder.KEYS` constants).
   * @returns {boolean} `true` if the key was just pressed, otherwise `false`.
   */
  isJustPressed(key) {
    return this.justPressed.has(key);
  }

  /**
   * Checks if a key was just released (true for only one frame).
   * @param {string} key - The key to check (use `Keyboarder.KEYS` constants).
   * @returns {boolean} `true` if the key was just released, otherwise `false`.
   */
  isJustReleased(key) {
    return this.justReleased.has(key);
  }

  /**
   * Checks if multiple keys are currently being held down.
   * @param {...string} keys - The keys to check (use `Keyboarder.KEYS` constants).
   * @returns {boolean} `true` if all specified keys are pressed, otherwise `false`.
   */
  areKeysPressed(...keys) {
    return keys.every((key) => this.keys.has(key));
  }

  /**
   * Checks if a key has been held down for a specified duration.
   * @param {string} key - The key to check (use `Keyboarder.KEYS` constants).
   * @param {number} [duration=500] - The duration in milliseconds.
   * @returns {boolean} `true` if the key has been held for at least the given duration, otherwise `false`.
   */
  isHeld(key, duration = 500) {
    if (!this.keys.has(key) || !this.lastKeyTime[key]) return false;
    return performance.now() - this.lastKeyTime[key] >= duration;
  }

  /**
   * Checks if Caps Lock is currently on.
   * @returns {boolean} `true` if Caps Lock is active, otherwise `false`.
   */
  isCapsLockOn() {
    return this.capsLock;
  }

  /**
   * Clears the "just pressed" and "just released" states.
   * This should be called at the end of every frame.
   */
  clearFrameStates() {
    this.justPressed.clear();
    this.justReleased.clear();
  }
}


//=========//
//  AUDIO  //
//=========//

/**
 * Represents an individual sound effect.
 */
class Sound {
  constructor(src) {
    this.audio = new Audio(src);
    this.audio.preload = "auto"; // Ensure the audio file is loaded
  }

  /**
   * Plays the sound.
   * @param {number} [loops=0] - Number of times to loop (-1 for infinite).
   * @returns {Sound} The sound instance.
   */
  play(loops = 0) {
    let soundInstance = this.audio.cloneNode();
    soundInstance.loop = loops === -1;
    soundInstance.play();
    return soundInstance;
  }

  /**
   * Stops the sound.
   */
  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  /**
   * Sets the volume of the sound.
   * @param {number} volume - Value between 0.0 and 1.0.
   */
  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(volume, 1));
  }
}


/**
 * Represents a dedicated audio channel.
 */
class Channel {
  constructor() {
    this.sound = null;
    this.isPlaying = false;
  }

  /**
   * Plays a sound on this channel.
   * @param {Sound} sound - The sound to play.
   * @param {number} [loops=0] - Number of loops (-1 for infinite looping).
   */
  play(sound, loops = 0) {
    if (!(sound instanceof Sound)) {
      console.warn("[ CHANNEL ][ ERR ]: Invalid Sound object.");
      return;
    }

    this.stop(); // Stop any sound already playing
    this.sound = sound.play(loops);
    this.isPlaying = true;

    this.sound.onended = () => {
      this.isPlaying = false;
    };
  }

  /**
   * Stops the currently playing sound.
   */
  stop() {
    if (this.sound) {
      this.sound.pause();
      this.sound.currentTime = 0;
    }
    this.isPlaying = false;
  }

  /**
   * Sets the volume for this channel.
   * @param {number} volume - Volume level (0.0 to 1.0).
   */
  setVolume(volume) {
    if (this.sound) {
      this.sound.volume = Math.max(0, Math.min(volume, 1));
    }
  }
}


/**
 * Handles background music playback.
 */
class Music {
  constructor() {
    this.music = null;
    this.isPlaying = false;
    this.loop = false;
  }

  /**
   * Loads a music file.
   * @param {string} src - Path to the music file.
   */
  load(src) {
    this.music = new Audio(src);
    this.music.loop = this.loop;
  }

  /**
   * Plays the loaded music.
   * @param {boolean} [loop=false] - Whether to loop the music.
   */
  play(loop = false) {
    if (!this.music) {
      console.warn("[ MUSIC ][ ERR ]: No music loaded.");
      return;
    }
    this.loop = loop;
    this.music.loop = loop;
    this.music.play();
    this.isPlaying = true;
  }

  /**
   * Stops the music.
   */
  stop() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
    this.isPlaying = false;
  }

  /**
   * Pauses the music.
   */
  pause() {
    if (this.music) {
      this.music.pause();
    }
  }

  /**
   * Resumes paused music.
   */
  resume() {
    if (this.music) {
      this.music.play();
    }
  }

  /**
   * Sets the volume of the music.
   * @param {number} volume - Value between 0.0 and 1.0.
   */
  setVolume(volume) {
    if (this.music) {
      this.music.volume = Math.max(0, Math.min(volume, 1));
    }
  }
}


/**
 * Manages sounds, channels, and music.
 */
class Mixer {
  constructor(numChannels = 8) {
    this.channels = Array.from({ length: numChannels }, () => new Channel());
    this.music = new Music();
  }

  /**
   * Creates a new sound instance.
   * @param {string} src - Path to the sound file.
   * @returns {Sound} A new Sound instance.
   */
  createSound(src) {
    return new Sound(src);
  }

  /**
   * Returns a specific channel by index.
   * @param {number} index - The channel index.
   * @returns {Channel} The requested channel.
   */
  getChannel(index) {
    return this.channels[index];
  }

  /**
   * Plays a sound on an available channel.
   * @param {Sound} sound - The sound to play.
   * @param {number} [loops=0] - Number of loops (-1 for infinite).
   */
  playSound(sound, loops = 0) {
    if (!(sound instanceof Sound)) {
      console.warn("[ MIXER ][ ERR ]: Invalid Sound object.");
      return;
    }

    const channel = this.channels.find(ch => !ch.isPlaying);
    if (channel) {
      channel.play(sound, loops);
    } else {
      console.warn("[ MIXER ][ ERR ]: No available channels.");
    }
  }

  /**
   * Stops all sounds on all channels.
   */
  stopAllSounds() {
    this.channels.forEach(channel => channel.stop());
  }

  /**
   * Loads and plays background music.
   * @param {string} src - Path to the music file.
   * @param {boolean} [loop=false] - Whether to loop the music.
   */
  playMusic(src, loop = false) {
    this.music.load(src);
    this.music.play(loop);
  }

  /**
   * Stops the currently playing music.
   */
  stopMusic() {
    this.music.stop();
  }
}


//==========//
//  NETWORK //
//==========//

/**
 * A WebSocket-based client for communicating with a server.
 */
class Socket {
  /**
   * Creates a new WebSocket connection to the specified server.
   * @param {string} url - The WebSocket server URL.
   */
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.isConnected = false;
    this.eventHandlers = {};

    this.#connect();
  }

  /**
   * Establishes a WebSocket connection with the server.
   * @private
   */
  #connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.isConnected = true;
      console.log("[ SOCKET ][ OUT ]: Connected to server.");
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleEvent(data.type, data.payload);
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      console.log("[ SOCKET ][ OUT ]: Disconnected from server.");
    };

    this.socket.onerror = (error) => {
      console.error(`[ SOCKET ][ ERR ]: ${error}`);
    };
  }

  /**
   * Sends data to the server.
   * @param {string} eventType - The type of event being sent.
   * @param {*} data - The data payload to send.
   */
  send(eventType, data) {
    if (this.isConnected) {
      this.socket.send(JSON.stringify({ type: eventType, payload: data }));
    } else {
      console.warn("[ SOCKET ][ ERR ]: Cannot send data, not connected.");
    }
  }

  /**
   * Handles incoming events by invoking the corresponding event handler.
   * @param {string} eventType - The type of event received.
   * @param {*} data - The event payload.
   */
  handleEvent(eventType, data) {
    const handler = this.eventHandlers[eventType];
    if (handler) {
      handler(data);
    }
  }

  /**
   * Registers an event listener for a specific event type.
   * @param {string} eventType - The event type to listen for.
   * @param {Function} callback - The callback function to execute when the event occurs.
   */
  on(eventType, callback) {
    this.eventHandlers[eventType] = callback;
  }

  /**
   * Closes the WebSocket connection.
   */
  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}


//==============//
//  GRAPHITEJS  //
//==============//

/**
 * GraphiteJS provides an organized structure for managing various components, 
 * including rendering, input handling, audio, and networking.
 */
class Framework {
  /**
   * Initializes the framework with default values.
   */
  constructor() {
    /** @type {HTMLCanvasElement} The canvas element used for rendering. */
    this._canvas = null;

    /** @type {CanvasRenderingContext2D} The 2D rendering context of the canvas. */
    this._context = null;

    /** @type {Object} A collection of mathematical utilities. */
    this.math = {};

    /** @type {Object} A collection of surface-related utilities. */
    this.surface = {
      Surface: Surface,
      ImageSurface: ImageSurface,
    };

    /** @type {Object} A collection of rectangle-related utilities. */
    this.rect = {
      Rect: Rect,
      FRect: FRect,
    };

    /** @type {Object} A collection of font-related utilities. */
    this.font = {
      Font: Font
    }

    /** @type {Object} A collection of transformation utilities. */
    this.transform = {};

    /** @type {Object} Mouse input handling utilities. */
    this.mouse = {
      Mouse: Mouse,
    };

    /** @type {Object} Keyboard input handling utilities. */
    this.keyboard = {
      Keyboarder: Keyboarder,
    };

    /** @type {Object} Audio management utilities. */
    this.audio = {
      Sound: Sound,
      Channel: Channel,
      Music: Music,
      Mixer: Mixer,
    };

    /** @type {Object} Networking utilities. */
    this.network = {
      Socket: Socket,
    };
  }

  /**
   * Initializes the framework and sets up the necessary components.
   */
  init() {
    /**
     * Request an animation frame for updating.
     * @param {Function} callback - The function to be executed on the next frame.
     */
    this.update = (callback) => requestAnimationFrame(callback);
  }

  /**
   * Sets the canvas for rendering and initializes its size.
   * @param {HTMLCanvasElement} canvas - The canvas element to use.
   * @param {Object} [size={ width: 1920, height: 1080 }] - The size of the canvas.
   * @param {number} size.width - The width of the canvas.
   * @param {number} size.height - The height of the canvas.
   */
  setCanvas(canvas, size = { width: 1920, height: 1080 }) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new Error("Invalid canvas element.");
    }

    this._canvas = canvas;
    this._context = this._canvas.getContext("2d");

    this._canvas.width = size.width;
    this._canvas.height = size.height;
  }

  /**
   * Retrieves the current canvas element.
   * @returns {HTMLCanvasElement} The canvas element.
   */
  getCanvas() {
    return this._canvas;
  }

  /**
   * Retrieves the current 2D rendering context.
   * @returns {CanvasRenderingContext2D} The rendering context.
   */
  getContext() {
    return this._context;
  }

  /**
   * Clears the canvas by filling it with a specified color.
   * @param {string} [color="black"] - The color to fill the canvas with.
   */
  clearCanvas(color = "black") {
    if (!this._context) {
      console.warn("Canvas context is not initialized.");
      return;
    }
    this._context.fillStyle = color;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }

  /**
   * Resizes the canvas dynamically.
   * @param {number} width - The new width of the canvas.
   * @param {number} height - The new height of the canvas.
   */
  resizeCanvas(width, height) {
    if (!this._canvas) {
      console.warn("Canvas is not initialized.");
      return;
    }
    this._canvas.width = width;
    this._canvas.height = height;
  }

  /**
   * Runs the main game loop, calling the provided callback function on each frame.
   * @param {Function} callback - The function to run each frame.
   */
  startLoop(callback) {
    const loop = () => {
      callback();
      requestAnimationFrame(loop);
    };
    loop();
  }

  /**
   * Stops all running animations or event loops.
   */
  stopLoop() {
    cancelAnimationFrame(this.update);
  }
}

// static KEYS = {
//   K_BACKSPACE: "Backspace",
//   K_TAB: "Tab",
//   K_CLEAR: "Clear",
//   K_RETURN: "Enter",
//   K_PAUSE: "Pause",
//   K_ESCAPE: "Escape",
//   K_SPACE: " ",
//   K_EXCLAIM: "!",
//   K_QUOTEDBL: '"',
//   K_HASH: "#",
//   K_DOLLAR: "$",
//   K_PERCENT: "%",
//   K_AMPERSAND: "&",
//   K_QUOTE: "'",
//   K_LEFTPAREN: "(",
//   K_RIGHTPAREN: ")",
//   K_ASTERISK: "*",
//   K_PLUS: "+",
//   K_COMMA: ",",
//   K_MINUS: "-",
//   K_PERIOD: ".",
//   K_SLASH: "/",
//   K_0: "0",
//   K_1: "1",
//   K_2: "2",
//   K_3: "3",
//   K_4: "4",
//   K_5: "5",
//   K_6: "6",
//   K_7: "7",
//   K_8: "8",
//   K_9: "9",
//   K_COLON: ":",
//   K_SEMICOLON: ";",
//   K_LESS: "<",
//   K_EQUALS: "=",
//   K_GREATER: ">",
//   K_QUESTION: "?",
//   K_AT: "@",
//   K_LEFTBRACKET: "[",
//   K_BACKSLASH: "\\",
//   K_RIGHTBRACKET: "]",
//   K_CARET: "^",
//   K_UNDERSCORE: "_",
//   K_BACKQUOTE: "`",
//   K_A: "A",
//   K_B: "B",
//   K_C: "C",
//   K_D: "D",
//   K_E: "E",
//   K_F: "F",
//   K_G: "G",
//   K_H: "H",
//   K_I: "I",
//   K_J: "J",
//   K_K: "K",
//   K_L: "L",
//   K_M: "M",
//   K_N: "N",
//   K_O: "O",
//   K_P: "P",
//   K_Q: "Q",
//   K_R: "R",
//   K_S: "S",
//   K_T: "T",
//   K_U: "U",
//   K_V: "V",
//   K_W: "W",
//   K_X: "X",
//   K_Y: "Y",
//   K_Z: "Z",
//   K_a: "a",
//   K_b: "b",
//   K_c: "c",
//   K_d: "d",
//   K_e: "e",
//   K_f: "f",
//   K_g: "g",
//   K_h: "h",
//   K_i: "i",
//   K_j: "j",
//   K_k: "k",
//   K_l: "l",
//   K_m: "m",
//   K_n: "n",
//   K_o: "o",
//   K_p: "p",
//   K_q: "q",
//   K_r: "r",
//   K_s: "s",
//   K_t: "t",
//   K_u: "u",
//   K_v: "v",
//   K_w: "w",
//   K_x: "x",
//   K_y: "y",
//   K_z: "z",
//   K_DELETE: "Delete",
//   K_KP0: "0",
//   K_KP1: "1",
//   K_KP2: "2",
//   K_KP3: "3",
//   K_KP4: "4",
//   K_KP5: "5",
//   K_KP6: "6",
//   K_KP7: "7",
//   K_KP8: "8",
//   K_KP9: "9",
//   K_KP_PERIOD: ".",
//   K_KP_DIVIDE: "/",
//   K_KP_MULTIPLY: "*",
//   K_KP_MINUS: "-",
//   K_KP_PLUS: "+",
//   K_KP_ENTER: "Enter",
//   K_KP_EQUALS: "=",
//   K_UP: "ArrowUp",
//   K_DOWN: "ArrowDown",
//   K_RIGHT: "ArrowRight",
//   K_LEFT: "ArrowLeft",
//   K_INSERT: "Insert",
//   K_HOME: "Home",
//   K_END: "End",
//   K_PAGEUP: "PageUp",
//   K_PAGEDOWN: "PageDown",
//   K_F1: "F1",
//   K_F2: "F2",
//   K_F3: "F3",
//   K_F4: "F4",
//   K_F5: "F5",
//   K_F6: "F6",
//   K_F7: "F7",
//   K_F8: "F8",
//   K_F9: "F9",
//   K_F10: "F10",
//   K_F11: "F11",
//   K_F12: "F12",
//   K_F13: "F13",
//   K_F14: "F14",
//   K_F15: "F15",
//   K_NUMLOCK: "NumLock",
//   K_CAPSLOCK: "CapsLock",
//   K_SCROLLLOCK: "ScrollLock",
//   K_RSHIFT: "Shift",
//   K_LSHIFT: "Shift",
//   K_RCTRL: "Control",
//   K_LCTRL: "Control",
//   K_RALT: "Alt",
//   K_LALT: "Alt",
//   K_RMETA: "Meta",
//   K_LMETA: "Meta",
//   K_MODE: "ModeChange",
//   K_HELP: "Help",
//   K_PRINT: "PrintScreen",
//   K_SYSREQ: "SysRq",
//   K_BREAK: "Break",
//   K_MENU: "ContextMenu",
//   K_POWER: "Power",
//   K_EURO: "€",
// };


const graphitejs = new Framework();

// module.exports = graphitejs;

export { graphitejs };
