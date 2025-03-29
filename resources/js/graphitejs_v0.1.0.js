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

class Surface {
  constructor(size = { width: 0, height: 0 }) {
    width = size.width;
    height = size.height;
  }
}


//========//
//  RECT  //
//========//


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
 * Manages sounds, channels, and music, similar to Pygame's `mixer` module.
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
class Framework {

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

  constructor() {
    this._canvas = {};
    this._context = {};
  }

  init() {
    this.update = (callback) => { requestAnimationFrame(callback) };
    this.math = {}
    this.surface = {
      Surface: Surface,
    }
    this.rect = {}
    this.transform = {}
    this.mouse = {
      Mouse: Mouse,
    }
    this.keyboard = {
      Keyboarder: Keyboarder,
    }
    this.audio = {
      Sound: Sound,
      Channel: Channel,
      Music: Music,
      Mixer: Mixer,
    }
    this.network = {
      Socket: Socket,
    }
  }

  setCanvas(canvas, size = { width: 1920, height: 1080 }) {
    this._canvas = canvas;
    this._context = this._canvas.getContext("2d");

    this._canvas.width = size.width;
    this._canvas.height = size.height;
  }

  getCanvas() {
    return this._canvas;
  }

  getContext() {
    return this._context;
  }
}


const graphitejs = new Framework();

module.exports = graphitejs;

// export { graphitejs };
