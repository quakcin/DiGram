/**
 * (c) 2023/2024 Marcin Ślusarczyk, Maciej Bandura
 *     Projekt Zespołowy - DiGram 
 * 
 *     Moduł menubar'a okna aplikacji
 */

const { app, BrowserWindow, screen, Menu } = require('electron')

/**
 * MenuBar ekranu aplikacji
 */
exports.mainMenu = 
[
  {
    label: 'Plik',
    submenu: 
    [
      { role: 'quit', label: 'Wyjdź' }
    ]
  },
  {
    label: 'Edycja',
    submenu: []
  },
  {
    label: 'Narzędzia',
    submenu: []
  },
  {
    label: 'Pomoc',
    submenu: 
    [
      { role: 'about', label: 'O Programie' }
    ]
  }
];

/**
 * Aplikuje menuBara w oknie aplikacji
 */
exports.applyMainMenu = () => 
{
  const menu = Menu.buildFromTemplate(exports.mainMenu);
  Menu.setApplicationMenu(menu);
}
