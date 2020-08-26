"use strict";

import { app, session, shell, protocol, BrowserWindow, ipcMain, globalShortcut } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import * as path from 'path';
import * as fs from 'fs-extra';
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
log.transports.console.level = false;
log.transports.console.level = 'silly'
const isDevelopment = process.env.NODE_ENV !== "production";
autoUpdater.logger = log
autoUpdater.checkForUpdatesAndNotify()


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let loginWin;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.

  win = new BrowserWindow({
    frame: false,
    minWidth: 1352,
    width: 1352,
    minHeight: 760,
    height: 760,
    show: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      additionalArguments: ['main-window'],
      enableRemoteModule: true,
      plugins: false
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

function createLoginWindow() {
  // Create the browser window.

  loginWin = new BrowserWindow({
    frame: false,
    width: 868,
    height: 528,
    resizable: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      additionalArguments: ['login-window'],
      enableRemoteModule: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    loginWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    // if (!process.env.IS_TEST) loginWin.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    loginWin.loadURL("app://./index.html");
  }

  loginWin.on("closed", () => {
    loginWin = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  app.quit();
  // }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  console.log('is ready');
  globalShortcut.register('CommandOrControl+Shift+J', () => {
    if (win && win.isVisible()) {
      win.webContents.openDevTools()
    } else if (loginWin) {
      loginWin.webContents.openDevTools()
    }
  })
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

// 主进程监听
ipcMain.handle('channel', (event, { type, data }) => {
  let modal;
  console.log("主进程监听，type：%s， data: %o", type, data)
  switch (type) {
    case 'init':
      if (data.isLogin) {
        win.show()
      } else {
        createLoginWindow();
      }
      return { code: 1 }
    case 'minimize':
      if (win && !win.isMinimized()) {
        win.minimize();
      }
      return { code: 1 }
    case 'maximize':
      if (win && !win.isMaximized()) {
        win.maximize();
      } else {
        win.unmaximize();
      }
      return { code: 1 }
    case 'quit':
      if (loginWin && loginWin.closable) {
        loginWin.close()
      }
      if (win && win.closable) {
        win.close()
      }
      return { code: 1 }
    case 'login':
      // 关闭当前窗口，打开主窗口
      if (loginWin) {
        loginWin.close()
      }
      if (win) {
        win.reload()
        win.show()
      }
      return { code: 1 }
    case 'logout':
      if (win) {
        win.hide()
      }
      createLoginWindow();
      return { code: 1 }
    case 'preview':
      if (data.url.endsWith('.pdf')) {
        modal = new BrowserWindow({
          fullscreen: true,
          resizable: false,
          alwaysOnTop: true,
          parent: win,
        });
      } else if (data.url.endsWith('.ppt') || data.url.endsWith('.pptx') || data.url.endsWith('.pps') || data.url.endsWith('.ppsx')) {
        modal = new BrowserWindow({
          show: false,
          webPreferences: {
            session: session.fromPartition('ppt')
          }
        });
        modal.webContents.session.on('will-download', async (event, item) => {
          console.log('开始下载文件')
          const fileName = item.getFilename();
          const url = item.getURL();
          const startTime = item.getStartTime();
          const initialState = item.getState();
          const downloadPath = app.getPath('downloads');

          let fileNum = 0;
          let savePath = path.join(downloadPath, fileName);

          // savePath基础信息
          const ext = path.extname(savePath);
          const name = path.basename(savePath, ext);
          const dir = path.dirname(savePath);

          // 文件名自增逻辑
          while (fs.pathExistsSync(savePath)) {
            fileNum += 1;
            savePath = path.format({
              dir,
              ext,
              name: `${name}(${fileNum})`,
            });
          }

          // 设置下载目录，阻止系统dialog的出现
          item.setSavePath(savePath);

          // 下载任务完成
          item.on('done', (e, state) => { // eslint-disable-line
            shell.openPath(savePath)
          });

        })
      }
      modal.loadURL(data.url)
      return { code: 1 }
    case 'download':
      win.webContents.downloadURL(data.url)
      return { code: 1 }
    default:
      console.log('未知操作：', type)
      break;
  }
})

