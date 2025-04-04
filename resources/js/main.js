import { graphitejs } from "./graphitejs_v0.1.0.js";


class Main {
  #canvas = document.getElementById("canvas");

  constructor() {
    graphitejs.init()
    graphitejs.setCanvas(this.#canvas, { width: 1920, height: 1080 });

    this.init();
  }

  init() {
    this.font = new graphitejs.font.Font("FiraCode Nerd Font", 200, false, false);
    this.font.underline = true;
  }

  run() {
    let callback = () => {
      graphitejs.clearCanvas("#2576bd");

      this.font.render(graphitejs.getContext(), "Hello, World!", 10, 10);
    }

    graphitejs.startLoop(callback);
  }
}


/*
    Function to open the official Neutralino documentation in the default web browser.
*/
function openDocs() {
  Neutralino.os.open("https://neutralino.js.org/docs");
}


/*
    Function to open a tutorial video on Neutralino's official YouTube channel in the default web browser.
*/
function openTutorial() {
  Neutralino.os.open("https://www.youtube.com/c/CodeZri");
}

/*
    Function to set up a system tray menu with options specific to the window mode.
    This function checks if the application is running in window mode, and if so,
    it defines the tray menu items and sets up the tray accordingly.
*/
function setTray() {
  // Tray menu is only available in window mode
  if (NL_MODE != "window") {
    console.log("INFO: Tray menu is only available in the window mode.");
    return;
  }

  // Define tray menu items
  let tray = {
    icon: "/resources/icons/trayIcon.png",
    menuItems: [
      { id: "VERSION", text: "Get version" },
      { id: "SEP", text: "-" },
      { id: "QUIT", text: "Quit" }
    ]
  };

  // Set the tray menu
  Neutralino.os.setTray(tray);
}


/*
    Function to handle click events on the tray menu items.
    This function performs different actions based on the clicked item's ID,
    such as displaying version information or exiting the application.
*/
function onTrayMenuItemClicked(event) {
  switch (event.detail.id) {
    case "VERSION":
      // Display version information
      Neutralino.os.showMessageBox("Version information",
        `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
      break;
    case "QUIT":
      // Exit the application
      Neutralino.app.exit();
      break;
  }
}

/*
    Function to handle the window close event by gracefully exiting the Neutralino application.
*/
function onWindowClose() {
  Neutralino.app.exit();
}

// Initialize Neutralino
Neutralino.init();

// Register event listeners
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

// Conditional initialization: Set up system tray if not running on macOS
if (NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}

// Run main loop
const main = new Main();
main.run();
