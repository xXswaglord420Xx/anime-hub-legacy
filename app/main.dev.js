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
import { app, BrowserWindow, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import Ref from "./utils/ref";
import discord from "./utils/discord-main";
import Conf from "./constants/public";
import TorrentClient from "./utils/torrent";
import {Session} from './utils/sesh';

discord(Conf.discord.clientId).catch(console.error);

const mainWindow: Ref<BrowserWindow> = new Ref(null);
let torrentClient;
// eslint-disable-next-line no-unused-vars
let sesh;
let tray = null;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  torrentClient = new TorrentClient(mainWindow);
  sesh = new Session(mainWindow);
  app.on('second-instance', () => {
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
    backgroundColor: '#455a64'
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

  tray = new Tray(`${__dirname}/32x32.png`);

  const menu = Menu.buildFromTemplate([
    {
      label: "Exit",
      click: async () => {
        try {
          await torrentClient.close();
          await torrentClient.saveTorrents();
          console.log("destroyed");
          app.quit();
          console.log("quit");
        } catch(e) {
          console.error(e);
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
