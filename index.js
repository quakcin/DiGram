
/**
 * (c) 2023/2024 Marcin Ślusarczyk, Maciej Bandura
 *     Projekt Zespołowy - DiGram 
 * 
 *     Skrypt startowy aplikacji
 */

const { app, BrowserWindow, screen, Menu } = require('electron')
const { mainMenu, applyMainMenu } = require('./menu/menu.js')

require('./menu/menu.js');

app.whenReady().then(() => 
{
  const {width, height} = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow
  ({
    width: 700,
    height: 400,
    frame: true
  });

  applyMainMenu(win);

  win.loadFile('./window/window.html');
  win.show();
  win.maximize();

  win.webContents.openDevTools()


})