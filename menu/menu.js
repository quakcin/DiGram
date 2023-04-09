/**
 * (c) 2023/2024 Marcin Ślusarczyk, Maciej Bandura
 *     Projekt Zespołowy - DiGram 
 * 
 *     Moduł menubar'a okna aplikacji
 */

const { default: openAboutWindow } = require('about-window');
const { app, BrowserWindow, screen, Menu } = require('electron')

/**
 * Aplikuje menuBara w oknie aplikacji
 */
exports.applyMainMenu = (win) => 
{
  /**
   * Event otwarcia instrukcji
   */

  const openTutorial = function (e)
  {
    const win = new BrowserWindow
    ({
      width: 1280,
      height: 720,
      frame: true,
      autoHideMenuBar: true,
    });

    win.loadFile('./tutorial.pdf');
    win.show();
    win.center();
    win.setAlwaysOnTop(true, 'screen');
    win.setIcon("./icons/main.png");
  }

  /**
   * MenuBar ekranu aplikacji
   */
  const mainMenu = 
  [
    {
      label: 'Plik',
      submenu: 
      [
        { label: 'Nowy', wired: 'evtNew' },
        { label: 'Otwórz', wired: 'evtOpen' },
        { label: 'Zapisz', wired: 'evtSave' },
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
        { label: 'Zaznacz wszystko', wired: 'evtSelectAll' },
        { label: 'Usuń', wired: 'evtRemove' },
        { label: 'Kopiuj', wired: 'evtCopy' },
        { label: 'Wklej', wired: 'evtPaste' },
        { label: 'Wytnij', wired: 'evtCut' },
      ]
    },
    {
      label: 'Narzędzia',
      submenu: 
      [
        { label: 'Rysowanie Linii', wired: 'evtTogglePathing' },
        { label: 'Grot Strzałki', wired: 'evtTogglePeaks' },
        { label: 'Pogróbienie', wired: 'evtToggleBold' },
        { label: 'Kursywa', wired: 'evtToggleItalic' },
        { label: 'Podkreślenie', wired: 'evtToggleUnderline' },

      ]
    },
    {
      label: 'Kod',
      submenu: 
      [
        { label: 'Resetuj Błędy', wired: 'evtUnmarkErrors' },
        { label: 'Weryfikuj', wired: 'evtVeryfi' },
        { label: 'Generuj', wired: 'evtGenerate' },
      ]
    },
    {
      label: 'Pomoc',
      submenu: 
      [
        { label: 'Instrukcja', click: openTutorial},
        { label: 'O Programie', 
          click: (e) => 
          {
            openAboutWindow
            ({
              icon_path: "../../icons/main.png", 
              product_name: "DiGram",
              copyright: "(c) 2023/2024 Marcin Ślusarczyk, Maciej Bandura",
              license: "MIT",
              description: "Profesjonalny program studyjny, służący do projektowania złożonych schematów blokowych algorytmów, obejmujący funkcję konwertowania diagramów na kod w języku ANSI C.",
              show_close_button: true
            })
          } 
        }
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
