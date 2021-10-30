const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.UMI_ENV === 'dev';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
    },
  });

  if (isDev) {
    // 启用热加载
    const reloader = require('electron-reloader');
    reloader(module);

    mainWindow.loadURL('http://localhost:8000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(`${__dirname}/index.html`);
  }

  Menu.setApplicationMenu(null);
};

ipcMain.on('openFile', (event, arg) => {
  const map = new Map([
    ['shp', 'Shpfile'],
    ['gdb', 'GeoDatabase'],
  ]);
  dialog
    .showOpenDialog({
      filters: [{ name: map.get(arg), extensions: [arg] }],
    })
    .then(({ canceled, filePaths }) => {
      if (!canceled) {
        event.sender.send('openFilePaths', filePaths);
      }
    });
});
ipcMain.on('saveFile', (event, arg) => {
  const map = new Map([
    ['shp', 'Shpfile'],
    ['gdb', 'GeoDatabase'],
  ]);
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then(({ canceled, filePaths }) => {
      if (!canceled) {
        event.sender.send('saveFilePath', filePaths);
      }
    });
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
