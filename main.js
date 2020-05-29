const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const opn = require('opn');

const path = require('path');
const url = require('url');
let Menu = electron.Menu;

require('./electron-context-menu-master/index.js')({
    prepend: (params, browserWindow) => [{
        visible: params.mediaType === 'input',
    }]
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// close previous and open second instance with sep-7 modal (for windows)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, argv) => {
        // Someone tried to run a second instance, we should focus our window.
        event.preventDefault();
        link = argv[2];
        if (app.isReady() && mainWindow) {
            mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true,
                hash: link,
            }));
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }
            mainWindow.show();
        }
    });
}



function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: false,
        },
        width: 1080,
        minWidth: 1080,
        height: 800,
        minHeight: 600
    });

    mainWindow.maximize();
    mainWindow.show();

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        // process.argv url for launch app with sep-7 modal for windows
        hash: link || process.argv[1],
    }));


    mainWindow.webContents.on('will-navigate', function (event, url) {
        event.preventDefault();
        opn(url);
    });

    let template = [{
        label: "Application",
        submenu: [
            {
                label: "StellarTerm.com", click: function () {
                    opn('https://stellarterm.com/');
                }
            },
            {type: "separator"},
            {
                label: "Quit", accelerator: "Command+Q", click: function () {
                    app.quit();
                }
            }
        ]
    }, {
        label: "Edit",
        submenu: [
            {label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:"},
            {label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:"},
            {type: "separator"},
            {label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:"},
            {label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:"},
            {label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:"},
            {label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:"}
        ]
    }
    ];

    // This menu isn't actually used. However, the hotkeys get used. This is how
    // hotkeys for copy and paste are implemented.
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding elem.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// set protocol
app.setAsDefaultProtocolClient('web+stellar');

let link;

// handler sep-7 url for macOS
app.on('open-url', (event, data) => {
    event.preventDefault();
    link = data;
    if (mainWindow === null) {
        createWindow();
    }
    if (app.isReady() && mainWindow) {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
            hash: link,
        }));
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }
        mainWindow.show();
    }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
