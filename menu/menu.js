/**
 * (c) 2023/2024 Marcin Ślusarczyk, Maciej Bandura
 *     Projekt Zespołowy - DiGram 
 * 
 *     Moduł menubar'a okna aplikacji
 */

const { app, BrowserWindow, screen, Menu } = require('electron')

/**
 * Aplikuje menuBara w oknie aplikacji
 */
exports.applyMainMenu = (win) => 
{
  /**
   * MenuBar ekranu aplikacji
   */
  const mainMenu = 
  [
    {
      label: 'Plik',
      submenu: 
      [
        { label: 'Nowy' },
        { label: 'Otwórz', wired: 'evtOpen()' },
        { label: 'Zapisz', wired: 'evtSave()' },
        { 
          label: 'Exportuj', 
          submenu:
          [
            { label: 'PNG', click: (e) => win.webContents.executeJavaScript(`evtExport()`)},
            { label: 'JPEG', click: (e) => win.webContents.executeJavaScript(`evtExport('image/jpeg')`)},
          ]
        },
        { role: 'quit', label: 'Wyjdź' },
      ]
    },
    {
      label: 'Edycja',
      submenu: 
      [
        { label: 'Cofnij', wired: 'evtUndo' },
        { label: 'Przywróć', wired: 'evtRedo' },
        { label: 'Zaznacz wszystko', wired: 'evtRedo' },
        { label: 'Usuń', wired: 'evtRedo' },
        { label: 'Kopiuj', wired: 'evtRedo' },
        { label: 'Wklej', wired: 'evtRedo' },
        { label: 'Wytnij', wired: 'evtRedo' },
      ]
    },
    {
      label: 'Narzędzia',
      submenu: 
      [
        { label: 'Rysowanie Linii', wired: '' },
        { label: 'Grot Strzałki', wired: '' },
        { label: 'Pogróbienie', wired: '' },
        { label: 'Kursywa', wired: '' },
        { label: 'Podkreślenie', wired: '' },

      ]
    },
    {
      label: 'Kod',
      submenu: 
      [
        { label: 'Weryfikuj', wired: '' },
        { label: 'Generuj', wired: '' },
      ]
    },
    {
      label: 'Pomoc',
      submenu: 
      [
        { label: 'Instrukcja' },
        { role: 'about', label: 'O Programie' }
      ]
    }
  ];

  /**
   * Wireruj onclicki
   */

  for (let m of mainMenu)
    for (let sub of m.submenu)
      if (Object.keys(sub).includes('wired'))
      {
        sub['click'] = (e) => win.webContents.executeJavaScript(`${sub.wired}()`);
      }

    
  const menu = Menu.buildFromTemplate(mainMenu);
  Menu.setApplicationMenu(menu);
}
