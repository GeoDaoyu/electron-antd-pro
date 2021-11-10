const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const isDev = process.env.UMI_ENV === 'dev';

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
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

const startServer = () => {
  const cwd = isDev ? path.resolve(__dirname, '../public') : path.resolve(__dirname, './');
  exec('run.bat', { cwd }, (error, stdout, stderr) => {
    console.log(error, stdout, stderr);
  });
};

ipcMain.on('openFile', (event, type) => {
  if (type === 'shp') {
    dialog
      .showOpenDialog({
        properties: ['multiSelections'],
        filters: [{ name: 'Shpfile', extensions: [type] }],
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          event.sender.send('openFilePaths', filePaths);
        }
      });
  } else {
    dialog
      .showOpenDialog({
        properties: ['openDirectory'],
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) {
          event.sender.send('openFilePaths', filePaths[0]);
        }
      });
  }
});
ipcMain.on('saveFile', (event) => {
  dialog
    .showOpenDialog({
      properties: ['openDirectory'],
    })
    .then(({ canceled, filePaths }) => {
      if (!canceled) {
        event.sender.send('saveFilePath', filePaths[0]);
      }
    });
});
ipcMain.on('showItemInFolder', (event, arg) => {
  shell.showItemInFolder(arg);
});

app.whenReady().then(() => {
  startServer();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
