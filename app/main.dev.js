/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, Tray, Menu, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import {join} from "path";
import {writeFile, readFileSync} from "fs";
import MenuBuilder from './menu';
import Ref from "./utils/ref";
import discord from "./utils/discord-main";
import Conf from "./constants/public";
import TorrentClient from "./utils/torrent";
import {Session} from './utils/sesh';
import ipc from './utils/channelMain';

function readSettings() {
  const defaultSettings = {
    "init_scheme_prompt_done": false,
    "is_default_protocol_client": app.isDefaultProtocolClient('magnet'),
    "extract_subs": true,
    "verify_video_hash": true
  };
  try {
    const path = join(app.getPath("userData"), "settings.json");
    const settings = readFileSync(path, {encoding: 'utf-8'});

    return settings? JSON.parse(settings) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings() {
  return new Promise(resolve => {
    const path = join(app.getPath("userData"), "settings.json");
    writeFile(path, JSON.stringify(settings), {encoding: 'utf-8'}, () => {
      resolve();
    });
  });
}

const settings = readSettings();

ipc.addHandler('settings', ({name, value, command}) => {
  console.log(`Executing command ${command} with ${name} : ${value}`);
  if (command === "set") {
    settings[name] = value;
    switch (name) {
      case 'is_default_protocol_client':
        console.log('changing default protocol value');
        if (value) app.setAsDefaultProtocolClient('magnet');
        else app.removeAsDefaultProtocolClient('magnet');
        console.log('default protocol value set');
        break;
      default:
    }
    return true;
  }

  return settings;
});

discord(Conf.discord.clientId).catch(console.error);

const mainWindow: Ref<BrowserWindow> = new Ref(null);
let torrentClient;
// eslint-disable-next-line no-unused-vars
let sesh;
let tray = null;

async function openTorrent(torrent) {
  const path = (await dialog.showOpenDialog({properties: ["openDirectory", "createDirectory"]}))[0];
  return torrentClient.enqueueTorrent(torrent, path);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  if (!app.isDefaultProtocolClient("magnet") && settings['isDefaultProtocolClient']) {
    app.setAsDefaultProtocolClient("magnet")
  }
  torrentClient = new TorrentClient(mainWindow);
  sesh = new Session(mainWindow);
  app.on('second-instance', (_, args) => {
    console.log('Second instance of app');
    if (args[1]) {
      openTorrent(args[1]).catch(console.error);
    }
    if (mainWindow.exists()) {
      const window = mainWindow.get();
      if (window.isMinimized()) {
        window.restore();
      }
      window.focus()
    } else {
      createWindow();
    }
  })
}

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}


if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  process.on('warning', e => console.warn(e.stack));
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

function createWindow() {
  const window = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    backgroundColor: '#455a64',
    autoHideMenuBar: true
  });
  mainWindow.set(window);

  window.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  window.on('ready-to-show', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      window.minimize();
    } else {
      window.show();
      window.focus();
    }
  });

  window.on('closed', () => {
    mainWindow.set(null);
  });

  const menuBuilder = new MenuBuilder(window);
  menuBuilder.buildMenu();
}

app.on('window-all-closed', () => {

});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  app.on('open-url', (e, url) => {
    console.log(`Opening magnet ${url}`);
    openTorrent(url);
    e.preventDefault();
  });

  tray = new Tray(`${__dirname}/32x32.png`);

  const menu = Menu.buildFromTemplate([
    {
      label: "Exit",
      click: async () => {
        try {
          await torrentClient.close();
          await torrentClient.saveTorrents();
          console.log("destroyed");
          await saveSettings();
        } catch(e) {
          console.error(e);
        } finally {
          app.quit();
          console.log("quit");
        }
      }
    }
  ]);
  tray.setContextMenu(menu);
  tray.on('double-click', () => {
    if (mainWindow.exists()) {
      const window = mainWindow.get();
      if (window.isMinimized()) {
        window.restore();
      }
      window.focus()
    } else {
      createWindow();
    }
  });

  createWindow();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
