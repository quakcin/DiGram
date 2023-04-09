
/**
 * (c) 2023/2024 Marcin Ślusarczyk, Maciej Bandura
 *     Projekt Zespołowy - DiGram 
 * 
 *     Skrypt startowy aplikacji
 */

const { app, BrowserWindow, screen, Menu } = require('electron')
const { mainMenu, applyMainMenu } = require('./menu/menu.js')
const { dialog } = require('electron');


require('./menu/menu.js');

app.whenReady().then(() => 
{
  const {width, height} = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow
  ({
    width: 1280,
    height: 720,
    frame: true
  });

  applyMainMenu(win);

  win.loadFile('./window/window.html');
  win.show();
  win.maximize();
  win.setIcon("./icons/main.png");

  win.webContents.openDevTools()

  win.on('close', function (e) 
  {
    const response = dialog.showMessageBoxSync
    (
      this, 
      {
        type: 'question',
        buttons: ['Tak', 'Nie'],
        title: 'Zamykanie aplikacji',
        message: 'Czy aby na pewno chcesz wyjść?'
      }
    );

    if(response == 1) 
      e.preventDefault();
});
})