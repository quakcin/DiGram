
/**
 * (c) 2023/2024 Marcin Ślusarczyk, Maciej Bandura
 *     Projekt Zespołowy - DiGram 
 * 
 *     Skrypt i logika biznesowa aplikacji 
 */


const toolSet = [];

const initToolSet = function ()
{
  toolSet.push
  ({
    name: "Początek",
    icon: "../icons/start.png"
  });
  toolSet.push
  ({
    name: "IO",
    icon: "../icons/ioctl.png"
  });
  toolSet.push
  ({
    name: "Przetwarzanie",
    icon: "../icons/proc.png"
  });
  toolSet.push
  ({
    name: "Funkcja",
    icon: "../icons/funct.png"
  });
  toolSet.push
  ({
    name: "Warunek",
    icon: "../icons/rhm.png"
  });
  toolSet.push
  ({
    name: "Koniec",
    icon: "../icons/stop.png"
  });
  // toolSet.push /* brak syntaktycznego sensu, jeżeli połowa kodu jest pisana w czystym natywnym języku a jeden wyjątek w swoim własnym */
  // ({
  //   name: "Biblioteki",
  //   icon: "../icons/libs.png"
  // });
  toolSet.push
  ({
    name: "Tekst",
    icon: "../icons/text.png"
  });
}

const searchTool = function (name)
{
  const tools = toolSet.filter(
    (n) => n.name.toLowerCase().includes(name.toLowerCase()));

  let ht = '';
  for (let tool of tools)
    ht += `
      <div class="tool" title="Blok ${tool.name}" onmousedown="pickAnItem('${tool.name}')">
        <div class="icon">
          <!-- img src="${tool.icon}" -->
          <div style="width: 180px; height: 70px; background-image: url('${tool.icon}'); background-size: 100%; background-repeat: no-repeat;"></div>
        </div>
        <div class="name">
          ${tool.name}
        </div>
      </div>
    `;

  document.getElementById('toolbox').innerHTML = ht;
}

document.getElementById('search-box').onkeyup = function (e)
{
  searchTool(e.target.value);
}

/**
 * Elements
 */

const spawnAnItem = function (itemName)
{
  /* spawn an item */

  if (fontPickerFamily.value == 'None')
  {
    fontPickerFamily.value = 'Calibri';
  }

  if (fontPickerSize.value == 'None')
  {
    fontPickerSize.value = '12';
  }

  const itemId = crypto.randomUUID();
  const itemTag =
  {
    id: itemId,
    type: itemName,
    width: 150,
    height: 30,
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2,
    z: editor.zindexing,
    face: document.getElementById('fontPickerFamily').value,
    size: document.getElementById('fontPickerSize').value,
    isBold: editor.utils.bold,
    isItalic: editor.utils.italic,
    isUnderlined: editor.utils.underline,
    error: false
  }

  const ht = `
    <div 
      class="DiagramElement ${itemName}Element" 
      id="${itemId}" 
      data-tag='${JSON.stringify(itemTag)}' 
      onmousedown="moveObject(this.id, event)" 
      onclick="selectItem(this.id);"
    > 
      <div ondblclick="__block_edit_event(event)">
        ${itemName}
      </div>  
    </div>
  `;
  document.getElementById('viewport').innerHTML += ht;
  // historyRecord();
  return itemId;
}

const __block_edit_event = function (e)
{
  const elem = e.target;
  elem.contentEditable = true;
  elem.focus();
  selectTextElement(elem)
  editor.isUserTyping = true;
}

const spawnAnArrow = function (x, y, w, h, dir)
{
  /**
   * Arrows are complex, so first calculate mid point offset
   * for correct rendering, then correct size
   *    NOTE: Remember which point sticks to output and which sticks to input
   *          so that code scrapper will be able to properly function
   */


  const dirs = [];

  dirs['up'] = `
      <div style="
        position: absolute; 
        right: -9px;
        top: -10px;
        width: 0px; 
        height: 0px; 
        border-right: 10px solid transparent;
        border-left: 10px solid transparent; 
        border-bottom: 10px solid black;
      "></div>
  `;
  dirs['down'] = `
      <div style="
        position: absolute; 
        right: -9px;
        bottom: -10px;
        width: 0px; 
        height: 0px; 
        border-right: 10px solid transparent;
        border-left: 10px solid transparent; 
        border-top: 10px solid black;
      "></div>
  `;
  dirs['left'] = `
      <div style="
        position: absolute; 
        left: -10px;
        top: -9px;
        width: 0px; 
        height: 0px; 
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent; 
        border-right: 10px solid black;
      "></div>
  `;
  dirs['right'] = `
      <div style="
        position: absolute; 
        right: -10px;
        top: -9px;
        width: 0px; 
        height: 0px; 
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent; 
        border-left: 10px solid black;
      "></div>
  `;

  const itemId = crypto.randomUUID();
  const itemTag =
  {
    id: itemId,
    type: 'Arrow',
    width: w,
    height: h,
    x: x, 
    y: y,
    z: editor.zindexing,
    face: 'None',
    size: 'None',
    dir: dir,
    isBold: false,
    isItalic: false,
    isUnderlined: false,
    error: false,
    arrow: 
    {
      head: editor.usePeak
    },
  }

  const ht = `
    <div 
      class="DiagramElement ArrowElement" 
      id="${itemId}" 
      data-tag='${JSON.stringify(itemTag)}' 
      onmousedown="moveObject('${itemId}', event)" 
      onclick="selectItem('${itemId}');"
    >
      <div>${dirs[dir]}</div>
    </div>
  `;
  document.getElementById('viewport').innerHTML += ht;

  return itemId;
}

const updateElement = function (id)
{
    const box = document.getElementById(id);
    const tag = JSON.parse(box.dataset['tag']);
    const isSelected = editor.selected.includes(id) ? '#C59624' : 'transparent';

    const borderColor = tag.error ? 'red' : isSelected;
    const borderSize = tag.type == 'Arrow' ? '1px' : '4px';
    const weight = tag.isBold ? 'bold' : 'normal';
    const italic = tag.isItalic ? 'italic' : 'normal';
    const underline = tag.isUnderlined ? 'underline' : 'none';

    box.style = `left: ${tag.x}px; 
                 top: ${tag.y}px; 
                 width: ${tag.width}px;
                 z-index: ${tag.z};
                 border: ${borderSize} solid ${borderColor};
                 font-family: ${tag.face};
                 font-size: ${tag.size}px;
                 height: ${tag.type == 'Arrow' ? tag.height + 'px' : 'auto'};
                 font-style: ${italic};
                 font-weight: ${weight};
                 text-decoration: ${underline};
                 `;

    if (tag.type == 'Arrow')
      box.children[0].style = `display: ${tag.arrow.head ? 'block' : 'none'}`;

}

/**
 * Active Editor
 */

const editor = 
{
  pathing: false,
  usePeak: true,
  selectedTool: null,
  dragging: false,
  dragBox: null,
  zindexing: 0,
  selected: [], /*all selected items*/
  gridEnabled: false,
  groupselect: false,
  areaselect:
  {
    enabled: false,
    x: 0, y: 0
  },
  dragset:
  {
    x: 0, y: 0,
    tmp: []
  },
  utils:
  {
    bold: false,
    italic: false,
    underline: false
  },
  isUserTyping: false
};

const moveObject = function (id, e = null)
{
  if (editor.pathing)
    return;

  editor.dragging = true;
  editor.dragBox = id;
  editor.zindexing++;

  if (e != null && editor.selected.length > 1)
  {
    editor.dragset.x = e.clientX;
    editor.dragset.y = e.clientY;
    editor.dragset.tmp = [];
    eachSelected((id, box, tag) => 
    {
      editor.dragset.tmp.push(tag);
      return tag;
    })
  }
}

const moveSelectedObjects = function (vx, vy)
{
  eachSelected((id, box, tag) => 
  {
    tag.x += vx;
    tag.y += vy;
    return tag;
  })
}

const pickAnItem = function (itemName)
{
  /**
   * WARN: TODO: Move this to a separate function
   *             perhaps built controller or sth
   */
  editor.pathing = false;
  document.getElementById('btn-path').classList.remove('active');

  const id = spawnAnItem(itemName);
  moveObject(id);
}

const updateAllElements = function ()
{
  const elements = document.getElementsByClassName('DiagramElement');
  for (let ele of elements)
    updateElement(ele.id);

  historyRecord(); /* WARN: Might explode */
}

const selectItem = function (id)
{
  if (editor.selected.includes(id) == false)
  editor.selected.push(id);
  updateAllElements();
}

/**
 * 
 * @param {'*'} fn (id, box, tag) -> new tag
 */
const eachSelected = function (fn, update = true)
{
  for (let s of editor.selected)
  {
    const box = document.getElementById(s);
    const tag = JSON.parse(box.dataset['tag']);
    const newTag = fn(s, box, tag);
    box.dataset['tag'] = JSON.stringify(newTag);
  }

  if (update)
    updateAllElements();
}

/**
 * Fonts
 */

const initFonts = function ()
{
  const fontList = [];

  fontList.push({ name: 'Calibri', face: 'Calibri', default: 'selected' });
  fontList.push({ name: 'Monaco', face: 'Monaco' });
  fontList.push({ name: 'Source Code Pro', face: 'SourceCode' });
  fontList.push({ name: 'Arial', face: 'Arial' });
  fontList.push({ name: 'Lora', face: 'Lora' });
  fontList.push({ name: 'Cascadia Code', face: 'Cascadia' });
  fontList.push({ name: 'Times New Roman', face: 'Times New Roman' });
  fontList.push({ name: 'Segoe UI', face: 'Segoe' });
  fontList.push({ name: 'Verdana', face: 'Verdana' });
  fontList.push({ name: 'Helvetica', face: 'Helvetica' });
  fontList.push({ name: 'Courier New', face: 'Courier New' });

  fontList.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));

  fontList.forEach((n) => {
    fontPickerFamily.innerHTML += `
      <option value="${n.face}" style="font-family: ${n.face}" ${n.default ?? ''}>${n.name}</option>
    `
  })

  for (let i = 8; i < 72; i += 4)
    fontPickerSize.innerHTML += `
      <option value="${i}" ${i == 12 ? 'selected' : ''}>${i}</option>
    `;
}

/**
 * Events
 */

const selectTextElement = function (element)
{
  if (element.textContent.trim() == '')
    return;

  const range = document.createRange();
  range.selectNodeContents(element);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
}

const isFarViewport = function (node)
{
  for (let i = 0; i < 4; i++)
  {
    if (node.id == 'viewport')
      return true;
    node = node.parentNode;
  }
  return false;
}

const initBackIcons = function ()
{
  setInterval(() => 
  {
    const state = editor.selected.length > 0
      ? '1.0'
      : '0.2';

    document.getElementById('btn-copy').style = `opacity: ${state}`;
    document.getElementById('btn-cut').style = `opacity: ${state}`;
    document.getElementById('btn-remove').style = `opacity: ${state}`;

  }, 1000 / 5);
}

document.body.onload = function ()
{
  initToolSet();
  initFonts();
  initEvents();
  initHistory();
  initBackIcons();
  searchTool('');
  historyRecord(); /* first possible state */
}

document.body.onmousedown = function (e)
{
  editor.isUserTyping = false;

  if (editor.pathing && isFarViewport(e.target))
  {
    if (editor.areaselect.enabled == false)
    { /* 1st anchor */
      editor.areaselect.enabled = true;
      editor.areaselect.x = e.clientX;
      editor.areaselect.y = e.clientY;
    }
    return;
  }

  if (e.target.id != 'viewport')
    return;

  /**
   * Remove all contentEditables regardless function
   */

  const all = document.getElementsByClassName('DiagramElement');
  for (let ele of all)
    if (ele.children.length > 0)
      ele.children[0].contentEditable = false;

  /* area selection tool */
  editor.areaselect.enabled = true;
  editor.areaselect.x = e.clientX;
  editor.areaselect.y = e.clientY;
}

document.body.onmouseup = function (e)
{
  if (editor.pathing)
  {
    // editor.utils.bold = !tag.bold;
    // editor.utils.italic = !tag.italic;
    
    
    if (editor.areaselect.enabled)
    { /* 2nd anchor */
      const dx = editor.areaselect.x - e.clientX;
      const dy = editor.areaselect.y - e.clientY;
      let dir = null;
      let w = 0; let h = 0;
      let x = 0; let y = 0;

      if (Math.abs(dx) >= Math.abs(dy))
      { /* horizontall arrow */
        w = Math.abs(dx);
        h = 1;
        
        if (dx < 0)
        {
          x = editor.areaselect.x;
          rot = 'right';
        }
        else
        {
          x = editor.areaselect.x - w;
          rot = 'left';
        }

        y = editor.areaselect.y;
      }
      else
      { /* verticall arrow */

        h = Math.abs(dy);
        w = 1;
        
        if (dy < 0)
        {
          y = editor.areaselect.y;
          rot = 'down';
        }
        else
        {
          y = editor.areaselect.y - h;
          rot = 'up';
        }

        x = editor.areaselect.x;
      }

      // NOW: Pain
      spawnAnArrow(x, y, w, h, rot);
      updateAllElements();

      /* reset path mode */
      editor.areaselect.enabled = false;
    }
  }
  else if (editor.areaselect.enabled)
  {
    /**
     * WARN: e.button := 0 (LEFT  MOUSE)
     *                := 2 (RIGHT MOUSE)
     */
    /* disable and hide area */
    editor.areaselect.enabled = false;
    document.getElementById('select-area').style = 'top: -1000px; left: -1000px';

    /* then, select items */
    let bounds = [editor.areaselect.x, editor.areaselect.y, e.clientX, e.clientY];

    if (e.button == 2)
    { /* RIGHT_MOUSE_BUTTON */
      /* move all objects by this vector, then update */
      const vx = bounds[2] - bounds[0];
      const vy = bounds[3] - bounds[1];

      const allElements = document.getElementsByClassName('DiagramElement');
      for (let ele of allElements)
      {
        const tag = JSON.parse(ele.dataset['tag']);
        tag.x += vx * -1;
        tag.y += vy * -1;
        ele.dataset['tag'] = JSON.stringify(tag);
      }
      updateAllElements();

      return;
    }

    if (e.clientX < editor.areaselect.x && e.clientY < editor.areaselect.y)
      bounds = [e.clientX, e.clientY, editor.areaselect.x, editor.areaselect.y]
    else if (e.clientX < editor.areaselect.x)
      bounds = [e.clientX, editor.areaselect.y, editor.areaselect.x, e.clientY]
    else if (e.clientY < editor.areaselect.y)
      bounds = [editor.areaselect.x, e.clientY, e.clientX, editor.areaselect.y];


    const all = document.getElementById('viewport').children;
    editor.selected = [];
    updateAllElements();

    const inRange = [];
    for (let ele of all)
    {
      const tag = JSON.parse(ele.dataset['tag']);
      if (tag.x > bounds[0] && tag.x < bounds[2] && tag.y > bounds[1] && tag.y < bounds[3])
      {
        selectItem(ele.id);
        inRange.push(tag);
      }
    }

    /**
     * Update active controlls in top-nav-menu-bar thing
     * also, handle arrows
     */
    if (inRange.length > 0)
    {
      let sameFace = true;
      let sameSize = true;
      let allPeaksDisabled = true;
      let allPeaksEnabled = true;
      let hasArrow = false;

      let allBold = true;
      let allItalic = true;
      let allUnderline = true;

      for (let t of inRange)
      {
        if (t.type != 'Arrow')
        {
          if (t.face != inRange[0].face)
            sameFace = false;

          if (t.size != inRange[0].size)
            sameSize = false;

          if (!t.isBold)
            allBold = false;

          if (!t.isItalic)
            allItalic = false;

          if (!t.isUnderlined)
            allUnderline = false;
        }
        else
        {
          hasArrow = true;

          if (t.arrow.head)
            allPeaksDisabled = false;
          if (t.arrow.head == false)
            allPeaksEnabled = false;
        }
      }

      if (sameFace)
        fontPickerFamily.value = inRange[0].face;
      else
        fontPickerFamily.value = 'None';

      if (sameSize)
        fontPickerSize.value = inRange[0].size;
      else
        fontPickerSize.value = 'None';

      document.getElementById('btn-bold').classList[allBold ? 'add' : 'remove']('active');
      document.getElementById('btn-italic').classList[allItalic ? 'add' : 'remove']('active');
      document.getElementById('btn-underline').classList[allUnderline ? 'add' : 'remove']('active');

      if (hasArrow)
      {
        if (allPeaksDisabled)
          document.getElementById('btn-peak').classList.add('active'); 

        if (allPeaksEnabled)
          document.getElementById('btn-peak').classList.remove('active'); 
      }
      
    }
  }
  else if (editor.dragging)
  { /* select after moving */
    if (editor.groupselect == false)
      editor.selected = [];
    selectItem(editor.dragBox);
    const box = document.getElementById(editor.dragBox);
    const tag = JSON.parse(box.dataset['tag']);
    fontPickerFamily.value = tag.face;
    fontPickerSize.value = tag.size;

    /**
     * Set all util buttons
     * HACK: Negate editor values and then click all of 'em
     */

    editor.utils.bold = !tag.isBold;
    editor.utils.italic = !tag.isItalic;
    editor.utils.underline = !tag.isUnderlined;

    document.getElementById('btn-bold').click();
    document.getElementById('btn-italic').click();
    document.getElementById('btn-underline').click();

    /**
     * Handle arrows
     */

    if (tag.type == 'Arrow' && tag.arrow.head)
    {
      editor.usePeak = true;
      document.getElementById('btn-peak').classList.remove('active');
    }
    else if (tag.type == 'Arrow')
    {
      editor.usePeak = false;
      document.getElementById('btn-peak').classList.add('active');
    }
  }

  editor.dragging = false;
}

document.body.onmousemove = function (e)
{
  if (editor.pathing)
  { /* god prop */
  }
  else if (editor.areaselect.enabled)
  {
    const w = Math.abs(e.clientX - editor.areaselect.x);
    const h = Math.abs(e.clientY - editor.areaselect.y);
    const x = editor.areaselect.x;
    const y = editor.areaselect.y;
    
    const area = document.getElementById('select-area');

    if (e.clientX < x && e.clientY < y)
      area.style = `left: ${x - w}px; top: ${y - h}px; width: ${w}px; height: ${h}px`;
    else if (e.clientX < x)
      area.style = `left: ${x - w}px; top: ${y}px; width: ${w}px; height: ${h}px`;
    else if (e.clientY < y)
      area.style = `left: ${x}px; top: ${y - h}px; width: ${w}px; height: ${h}px`;
    else
      area.style = `width: ${w}px; height: ${h}px; left: ${x}px; top: ${y}px`;
  }
  else if (editor.dragging)
  {
    if (editor.selected.length > 1)
    {
      /* move lots of elements, TODO: swap equation sides */
      const vx = e.clientX - editor.dragset.x;
      const vy = e.clientY - editor.dragset.y;
      // moveSelectedObjects(vx, vy);
      /**
       * WARN: moveSelectedObjects() requires unit vector
       *       and can be used only once!
       *       instead, perform custom move regarding
       *       original position perhaps maybe?
       */
      eachSelected((id, box, tag) =>
      {
        for (let t of editor.dragset.tmp)
          if (t.id == id)
          {
            tag.x = t.x + vx;
            tag.y = t.y + vy;
            return tag;
          }
      })

      return;
    }

    const box = document.getElementById(editor.dragBox);
    const tag = JSON.parse(box.dataset['tag']);
    if (editor.gridEnabled)
    {
      tag.x = parseInt((e.clientX - parseInt(tag.width / 2)) / 50) * 50;
      tag.y = parseInt((e.clientY - parseInt(tag.height / 2)) / 50) * 50;
    }
    else
    {
      tag.x = e.clientX - parseInt(tag.width / 2);
      tag.y = e.clientY - parseInt(tag.height / 2);
    }
    tag.z = editor.zindexing;
    box.dataset['tag'] = JSON.stringify(tag);
    updateElement(editor.dragBox, true);
  }
}

document.body.onkeydown = function (e)
{
  /**
   * Supress if user is typing
   */
  if (editor.isUserTyping)
    return;

  /**
   * Handle keyboardEventTable
   */

  console.log(e);
  const keyCode = `${e.ctrlKey ? 'CT' : ''}_${e.key}`;
  if (Object.keys(keyboardEventTable).includes(keyCode))
    keyboardEventTable[keyCode](e);

  /**
   * Handle rest
   */
  if (e.key == 'Shift')
  {
    editor.groupselect = true;
  }

  if (e.key == 'ArrowUp') 
    moveSelectedObjects(0, -10);

  if (e.key == 'ArrowDown') 
    moveSelectedObjects(0, 10);

  if (e.key == 'ArrowLeft') 
    moveSelectedObjects(-10, 0);

  if (e.key == 'ArrowRight') 
    moveSelectedObjects(10, 0);
}

document.body.onkeyup = function (e)
{
  if (e.key == 'Shift')
  {
    editor.groupselect = false;
  }
}

document.getElementById('fontPickerFamily').onchange = function (e)
{
  eachSelected((id, box, tag) => 
  {
    tag.face = e.target.value;
    return tag;
  });
}

document.getElementById('fontPickerSize').onchange = function (e)
{
  eachSelected((id, box, tag) => 
  {
    tag.size = parseInt(e.target.value);
    return tag;
  });
}


document.getElementById('viewport').onclick = function (e)
{
  if (e.target != document.getElementById('viewport'))
    return;
    
  editor.selected = []; /* TODO */
  updateAllElements();
}


/**
 * Big Refactor Upcomming
 */

const evtTogglePathing = function (e)
{
  editor.pathing = !editor.pathing;
  const pathBtn = document.getElementById('btn-path');

  if (editor.pathing)
  {
    pathBtn.classList.add('active');
    editor.areaselect.enabled = false;
  }
  else
  {
    pathBtn.classList.remove('active');
  }
}


const evtToggleBold = function (e)
{  
  // 1st - toggle
  editor.utils.bold = !editor.utils.bold;
  document.getElementById('btn-bold').classList[editor.utils.bold ? 'add' : 'remove']('active');

  // 2nd - apply
  eachSelected((id, box, tag) => 
  {
    tag.isBold = editor.utils.bold;
    return tag;
})
}

const evtToggleItalic = function (e)
{
  // 1st - toggle
  editor.utils.italic = !editor.utils.italic;
  document.getElementById('btn-italic').classList[editor.utils.italic ? 'add' : 'remove']('active');

  // 2nd - apply
  eachSelected((id, box, tag) => 
  {
    tag.isItalic = editor.utils.italic;
    return tag;
  })
}

const evtToggleUnderline = function (e)
{
  // 1st - toggle
  editor.utils.underline = !editor.utils.underline;
  document.getElementById('btn-underline').classList[editor.utils.underline ? 'add' : 'remove']('active');

  // 2nd - apply
  eachSelected((id, box, tag) => 
  {
    tag.isUnderlined = editor.utils.underline;
    return tag;
  })
}

const evtRemove = function (e)
{
  for (let id of editor.selected)
    document.getElementById(id).remove();
  editor.selected = [];
}

const evtTogglePeaks = function (e)
{
  const peakBtn = document.getElementById('btn-peak');
  editor.usePeak = !editor.usePeak;
  peakBtn.classList[editor.usePeak ? 'remove' : 'add']('active');
    
  eachSelected((id, box, tag) => 
  {
    if (tag.type != 'Arrow')
      return tag;

    tag.arrow.head = editor.usePeak;
    return tag;
  })
}

const evtWidener = function (e)
{
  eachSelected((id, box, tag) => 
  {
    if (tag.type == 'Arrow')
      return tag;

    if (tag.width < 580)
    {
      tag.width += 10;
      tag.x -= 5;
    }
    return tag;
  });
}

const evtShortener = function (e)
{
  eachSelected((id, box, tag) => 
  {
    if (tag.type == 'Arrow')
      return tag;

    if (tag.width > 80)
    {
      tag.width -= 10;
      tag.x += 5;
    }
    return tag;
  });
}

const evtToggleGrid = function (e)
{
  editor.gridEnabled = !editor.gridEnabled;
  document.getElementById('btn-grid').classList[editor.gridEnabled ? 'add' : 'remove']('active');
}

const evtSelectAll = function (e)
{
  const elements = document.getElementsByClassName('DiagramElement');
  editor.selected = [];
  for (let element of elements)
    editor.selected.push(element.id);
  updateAllElements();
}

const evtUndo = function (e)
{
  historyUndo();
}

const evtRedo = function (e)
{
  historyRedo();
}

const evtCopy = function (e)
{
  let htmlcontents = '';
  for (let sel of editor.selected)
  {
    const ele = document.getElementById(sel);
    htmlcontents += ele.outerHTML;
  }

  const pastableObject =
  {
    isPastable: true,
    htmcontents: htmlcontents
  }
  navigator.clipboard.writeText(JSON.stringify(pastableObject));
}

const evtCut = function (e)
{
  evtCopy(e);
  evtRemove(e);
}

const evtPaste = function (e)
{
  navigator.clipboard.readText().then((text) => 
  {
    try
    {
      const pobj = JSON.parse(text);

      if (pobj.isPastable != true)
        return;

      const DOMP = document.createElement('div');
      DOMP.innerHTML = pobj.htmcontents;
      editor.selected = [];

      for (let ele of DOMP.children)
      { /* rebound to new random id */
        const tag = JSON.parse(ele.dataset['tag']);
        tag.id = crypto.randomUUID();
        tag.x += 25; tag.y += 25;
        tag.z = editor.zindexing;
        editor.zindexing++;
        ele.dataset['tag'] = JSON.stringify(tag);
        ele.id = tag.id;
        // move to viewport
        document.getElementById('viewport').innerHTML += ele.outerHTML;
        editor.selected.push(tag.id);
      }

      DOMP.remove();
      updateAllElements();
      evtCopy(e);
    }
    catch (e)
    {
      console.log(e);
      ; // dont care
    }
  })
}

const evtExport = function (type = 'image/png')
{
  /* Find image bounds */

  const allUnsorted = document.getElementsByClassName('DiagramElement');
  const allBounded = [];

  for (let elem of allUnsorted)
    allBounded.push(elem);

  console.log(allBounded);

  const all = allBounded.sort((a, b) => JSON.parse(a.dataset['tag']).z - JSON.parse(b.dataset['tag']).z);

  let [lx, ly, hx, hy] = [0xFFFFF, 0xFFFFF, -0xFFFFF, -0xFFFFF];

  for (let elem of all)
  {
    const tag = JSON.parse(elem.dataset['tag']);
    const style = getComputedStyle(elem);
    const ehei = parseInt(style.height.slice(0, -2));

    lx = Math.min(lx, tag.x - 25);
    hx = Math.max(hx, tag.x + tag.width + 25);

    ly = Math.min(ly, tag.y - 25);
    hy = Math.max(hy, tag.y + ehei + 25);
  }

  const [w, h] = [hx - lx, hy - ly];

  /* Create fitting canvas */
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  // canvas.style="position: fixed; left: 400px; top: 100px; z-index:21372137";

  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, w, h);

  /* imprint things on canvas */

  const sprites = {};

  for (let t of toolSet)
  {
    const img = document.createElement('img');
    img.src = t.icon;
    sprites[t.name] = img;
  }

  for (let elem of all)
  {
    const tag = JSON.parse(elem.dataset['tag']);
    tag.x -= lx; tag.y -= ly;

    if (tag.type == 'Arrow')
    {
      ctx.fillStyle = 'black';
      ctx.fillRect(tag.x - 2, tag.y - 2, tag.width + 3, tag.height + 3);

      if (tag.arrow.head == false)
        continue;  

      const _a = 20;
      const _h = (_a * Math.sqrt(3)) / 3;
      ctx.beginPath();
        if (tag.dir == 'down')
        {
          ctx.moveTo(tag.x, tag.y + tag.height + _h);
          ctx.lineTo(tag.x - _a/2, tag.height + tag.y);
          ctx.lineTo(tag.x + _a/2, tag.height + tag.y);
        }
        else if (tag.dir == 'up')
        {
          ctx.moveTo(tag.x, tag.y - _h);
          ctx.lineTo(tag.x - _a/2, tag.y);
          ctx.lineTo(tag.x + _a/2, tag.y);
        }
        else if (tag.dir == 'left')
        {
          ctx.moveTo(tag.x - _h, tag.y);
          ctx.lineTo(tag.x, tag.y - _a/2);
          ctx.lineTo(tag.x, tag.y + _a/2);
        }
        else if (tag.dir == 'right')
        {
          ctx.moveTo(tag.x + tag.width + _h, tag.y);
          ctx.lineTo(tag.x + tag.width, tag.y - _a/2);
          ctx.lineTo(tag.x + tag.width , tag.y + _a/2);
        }

      ctx.fill();

      continue;
    }

    const style = getComputedStyle(elem);
    const ehei = style.getPropertyValue('height').slice(0, -2);
    const ewid = style.getPropertyValue('width').slice(0, -2);

    ctx.fillStyle = 'black';
    if (tag.type != 'Tekst')
      ctx.drawImage(sprites[tag.type], tag.x, tag.y, ewid, ehei);

    /* write text */
    ctx.font = `${tag.size}px ${tag.face}`;
    ctx.fillStyle = tag.type != 'Tekst' ? 'white' : 'black';
    ctx.textBaseline="middle"

    const str = elem.textContent.trim();

    if (tag.type == 'Przetwarzanie')
    {
      ctx.textAlign = 'start';
      ctx.fillText(str, tag.x + 5, tag.y + ehei / 2);
    }
    else
    {
      ctx.textAlign = 'center';
      ctx.fillText(str, tag.x + ewid / 2, tag.y + ehei / 2);
    }
  }

  /**
   * Force Save
   */

  const imageUrl = canvas
    .toDataURL(type)
    .replace(type, "image/octet-stream");  

  // window.location.href = imageUrl;
  const hwhandle = document.createElement('a');
  hwhandle.href = imageUrl;
  hwhandle.download = `diagram.${type.split('/').at(-1)}`;
  document.body.appendChild(hwhandle);
  hwhandle.click();
  hwhandle.remove();
  canvas.remove();

}

const evtSave = function (e)
{
  const proj = btoa(encodeURI(document.getElementById('viewport').innerHTML));
  const blob = new Blob([proj], { type: 'text/plain' });
  const hwhandle = document.createElement('a');
  hwhandle.href = URL.createObjectURL(blob);
  hwhandle.download = "project.diag";
  document.body.appendChild(hwhandle);
  hwhandle.click();
  URL.revokeObjectURL(hwhandle.href);
  hwhandle.remove();
}


const evtOpen = function (e)
{
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.diag';
  input.onchange = (e) => 
  {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (m) => 
    {
      const contents = reader.result;
      document.getElementById('viewport').innerHTML = decodeURI(atob(contents));
    }
    reader.readAsText(file);
  }
  input.click();
}

const evtNew = function (e)
{
  if (confirm("Czy aby na pewno chcesz utworzyć nowy projekt?") == false)
    return;

  const all = document.getElementsByClassName('DiagramElement');
  for (let i = all.length - 1; i >= 0; i--)
    all[i].remove();
}



/**
 * Find all std::libs for given code
 * @param {*} code 
 */
const libLinker = function (code)
{ 
  const libs = [];

  libs.push
  ({
    name: 'stdlib.h',
    funs: ['atof', 'atoi', 'int', 'strtod', 'int', 'long', 'calloc', 'free', 'malloc', 'realloc', 'abort', 'atexit', 'exit', 'getenv', 'system', 'bsearch', 'qsort', 'abs', 'div', 'int', 'ldiv', 'rand', 'srand', 'mblen', 'mbstowcs', 'mbtowc', 'wcstombs']
  });

  libs.push
  ({
    name: 'stdio.h',
    funs: ['fclose', 'clearerr', 'feof', 'ferror', 'fflush', 'fgetpos', 'fopen', 'fread', 'freopen', 'fseek', 'fsetpos', 'int', 'fwrite', 'remove', 'rename', 'rewind', 'setbuf', 'setvbuf', 'tmpfile', 'tmpnam', 'fprintf', 'printf', 'sprintf', 'vfprintf', 'vprintf', 'vsprintf', 'fscanf', 'scanf', 'sscanf', 'fgetc', 'fgets', 'fputc', 'fputs', 'getc', 'getchar', 'gets', 'putc', 'putchar', 'puts', 'ungetc', 'perror']
  });

  libs.push
  ({
    name: 'string.h',
    funs: ['memchr', 'memcmp', 'memcpy', 'memmove', 'memset', 'strcat', 'strncat', 'strchr', 'strcmp', 'strncmp', 'strcoll', 'strcpy', 'strncpy', 'strcspn', 'strerror', 'strlen', 'strpbrk', 'strrchr', 'strspn', 'strstr', 'strtok']
  });

  libs.push
  ({
    name: 'math.h',
    funs: ['acos', 'asin', 'atan', 'atan2', 'cos', 'cosh', 'sin', 'sinh', 'tanh', 'exp', 'frexp', 'ldexp', 'log', 'log10', 'modf', 'pow', 'sqrt', 'ceil', 'fabs', 'floor']
  });


  libs.push
  ({
    name: 'time.h',
    funs: ['asctime', 'clock', 'ctime', 'difftime', 'tm', 'tm', 'mktime', 'strftime', 'time']
  });

  libs.push
  ({
    name: 'ctypes.h',
    funs: ['isalnum', 'isalpha', 'iscntrl', 'isdigit', 'isgraph', 'islower', 'isprint', 'ispunct', 'isspace', 'isupper']
  });

  libs.push
  ({
    name: 'stdbool.h',
    funs: ['true', 'false', 'bool']
  });
  
  const foundLibs = [];

  for (let l of libs)
  {
    for (let f of l.funs)
      if (code.includes(f))
      {
        foundLibs.push(l.name);
        break;
      }
  }

  return foundLibs;
}
  
const markError = function (tagSet, errorState = true)
{
  const elem = document.getElementById(tagSet.id);
  const tag = JSON.parse(elem.dataset['tag']);
  tag.error = errorState;
  elem.dataset['tag'] = JSON.stringify(tag);
}

const evtVeryfi = function (e)
{
  evtUnmarkErrors()
  __generator(true);
  updateAllElements();
}

const evtUnmarkErrors = function (e)
{
  const all = document.getElementsByClassName('DiagramElement');
  for (let a of all)
  {
    markError({id: a.id}, false);
  }
  updateAllElements();
}

const evtGenerate = function (e)
{
  evtUnmarkErrors();
  __generator();
  updateAllElements();
}

const __generator = function ( doNotSave = false )
{
  /**
   * Heap all stuff
   */

  const all = [];
  const entries = [];
  const arrows = [];


  let labelidx = 0;
  for (let elem of document.getElementsByClassName('DiagramElement'))
  { /* precomute css sizes */

    const style = getComputedStyle(elem);
    const tag = JSON.parse(elem.dataset['tag']);

    // if (tag.type == 'Biblioteki')
    //   continue; /* DO NOT COPY OVER */

    if (tag.type != 'Arrow')
    {
      const wid = parseInt(style.width.slice(0, -2));
      const hei = parseInt(style.height.slice(0, -2));
      tag.width = wid;
      tag.height = hei;
      tag.label = `_label_${labelidx++}`;
      tag.content = elem.textContent.trim();
    } 
    else
    {
      let ax = tag.x;
      let ay = tag.y;
      let ex = tag.x;
      let ey = tag.y;

      if (tag.dir == 'up')
        ay += tag.height;
      else if (tag.dir == 'left')
        ax += tag.width;
      else if (tag.dir == 'down')
        ey += tag.height;
      else if (tag.dir == 'right')
        ex += tag.width;

      tag.ax = ax;
      tag.ay = ay;
      tag.ex = ex;
      tag.ey = ey;

      arrows.push(tag);
    }

    tag.seen = false;

    all.push(tag);

    if (tag.type == 'Początek')
      entries.push(tag);
  }

  /**
   * Important utils
   */
  const joinedBlock = function (cx, cy)
  {
    for (let block of all)
    {
      if (block.type == 'Arrow' || block.type == 'Tekst')
        continue;
        
      const x = block.x - 40;
      const y = block.y - 40;
      const dx = block.x + block.width + 40;
      const dy = block.y + block.height + 40;

      if (cx > x && cx < dx && cy > y && cy < dy)
        return block;
    }

    return null;
  }

  const joinedArrow = function (cx, cy)
  {

    /**
     * TODO:
     * Check for multiple bindings
     */
    for (let arr of arrows)
    {
      const x = arr.ax - 30;
      const y = arr.ay - 30;
      const dx = arr.ax + 30;
      const dy = arr.ay + 30;

      if (cx > x && cx < dx && cy > y && cy < dy)
        return arr;
    }
    return null;
  }

  const allOutingArrows = function (fromTag)
  {
    const x = fromTag.x - 30;
    const y = fromTag.y - 30;
    const dx = fromTag.x + fromTag.width + 30;
    const dy = fromTag.y + fromTag.height + 30;
    const outs = [];

    for (let arrow of arrows)
      if (arrow.ax > x && arrow.ax < dx && arrow.ay > y && arrow.ay < dy)
        outs.push(arrow);

    return outs;
  }

  const nearestText = function (cx, cy)
  {
    console.log('looking for nearest text to ', cx, cy);
    let best = null;

    for (let text of all)
    {
      if (text.type != 'Tekst')
        continue;

      const ix = text.x + text.width / 2;
      const iy = text.y + text.height / 2;
      const dist = Math.sqrt(Math.pow(ix - cx, 2) + Math.pow(iy - cy, 2));
      text.dist = dist;

      console.log('compeling dist', dist, ix, iy, best, text);

      if (best == null)
      {
        best = text;
        continue;
      }


      if (best.dist > text.dist)
      {
        best = text;
      }
    }

    return best;
  }

  const traversePath = function (arrow)
  {
    let currentArrow = arrow;

    while (true)
    {
      currentArrow.seen = true;

      const jb = joinedBlock(currentArrow.ex, currentArrow.ey);

      if (jb != null)
      {
        return jb;
      }
      else
      { /* look for joined arrows */
        currentArrow = joinedArrow(currentArrow.ex, currentArrow.ey);
        if (currentArrow == null)
        {
          return null;
        }
      }
    }
  }

  /**
   * Generate separate code for each entry
   */

  let __codes = "";
  let __predefs = ``;
  const jumps = []; /* label sanitizer */

  for (let entry of entries)
  {
    let __code = "";
    /* fun begins */
    const blocks = [];
    const seen = [];
    blocks.push(entry);
    let next = null;

    while (blocks.length > 0)
    {
      const block = blocks[0];
      block.seen = true;
      let loopBack = null;

      if (block.type != 'Początek')
      {
        /* code gen */
        __code += `${block.label}: ;\n`;
      }
      else
      {
        __predefs += `${block.content};\n`;
      }

      if (block.type == 'Warunek')
      { /* magia */

        const outs = allOutingArrows(block);

        if (outs.length == 0)
        {
          markError(block);
          alert("Blok warunkowy bez żadnych opcji");
          return;
        }

        for (let o of outs)
        {
          const dest = traversePath(o);

          if (dest == null)
          {
            console.log(o);
            markError(o);
            alert("Ścieżka po warunku jest przerwana lub niepołączona!");
            return;
          }

          const nearest = nearestText(o.ax, o.ay);
          if (nearest == null)
          {
            markError(o);
            alert("Ścieżka bez ustalenia warunku");
            return; 
          }

          const quanta = nearest.content;
          __code += `\tif (${block.content} ${quanta})\n\t\tgoto ${dest.label};\n\n`;
          jumps.push(dest.label);

          if (seen.includes(dest.label) == false)
          {
            dest.seen = true;
            blocks.push(dest);
          }
        }

      }
      else if (block.type != 'Koniec')
      {
        /* find nearest outing node */
        const outting = allOutingArrows(block);

        if (outting.length == 0)
        {
          markError(block);
          alert("Blok na skraju diagramu bez dalszych połączeń!");
          return;
        }
          
        if (outting.length > 1)
        {
          markError(block);
          alert("Więcej niż jedno połączenie wychodzi z bloku");
          return;
        }

        const nextBlock = traversePath(outting[0]);
      
        if (nextBlock == null)
        {
          markError(outting[0]);
          alert("Ścieżka nie jest przyłączona do żadnego bloku");
          return;
        }

        /* next block to traverse, unless allready seen */
        if (seen.includes(nextBlock.label) == false)
          next = nextBlock;
        else
          loopBack = nextBlock.label;

      }

      if (block.type != 'Warunek')
      {
        /* code gen */
        if (block.type == 'Początek')
          __code += `${block.content}\n{\n`;
        else
          __code += `\t${block.content}\n\n`;

        if (loopBack != null)
        {
          __code += `\tgoto ${loopBack};\n\n`;
          jumps.push(loopBack);
        }
      }

      /* we've seen that one */
      seen.push(blocks[0].label);
      if (next == null)
        blocks.splice(0, 1);
      else
        blocks[0] = next;
      next = null;
    }

    __code += `}\n\n`;
    __codes += __code;

  }

  /* check if all blocks were seen */
  let hasMissingElements = false;

  for (let tag of all)
  {
    if (tag.type == 'Tekst')
      continue;

    if (tag.seen == false)
    {
      markError(tag);
      hasMissingElements = true;
    }
  }

  if (hasMissingElements)
  {
    alert("Element znajduje się poza diagramem");
    return; 
  }

  /* sanitize labels */

  for (let tag of all)
  {
    if (jumps.includes(tag.label) == false)
    {
      __codes = __codes.replaceAll(tag.label + ": ;\n", "");
    }
  }

  /* in case only error checking */
  if (doNotSave)
  {
    alert("Diagram jest prawidłowy");
    return;
  }

  /* link libs */
  let __libs = "";
  const libs = libLinker(__codes);

  const __auth = `/**\n *  Kod wygenerowano przy użyciu narzędzia DiGram\n *  (c) 2023 Marcin Ślusarczyk, Maciej Bandura\n */\n`;

  for (let lib of libs)
    __libs += `#include <${lib}>\n`;

  const final = __auth + '\n' + __libs + '\n' + __predefs + '\n' + __codes;

  /* spew out code */
  const blob = new Blob([final], { type: 'text/plain' });
  const hwhandle = document.createElement('a');
  hwhandle.href = URL.createObjectURL(blob);
  hwhandle.download = "source.c";
  document.body.appendChild(hwhandle);
  hwhandle.click();
  URL.revokeObjectURL(hwhandle.href);
  hwhandle.remove();


}

/**
 * Simple eventManager
 */

const keyboardEventTable = [];

const eventHookUp = function (funct, id, key = null, ctrl = false)
{
  if (id != null)
    document.getElementById(id).onclick = funct;

  if (key != null)
    keyboardEventTable[`${ctrl ? 'CT' : ''}_${key}`] = funct;
}

const initEvents = function ()
{
  eventHookUp(evtRemove, 'btn-remove', 'Delete');
  eventHookUp(evtTogglePeaks, 'btn-peak', ' ');
  eventHookUp(evtTogglePathing, 'btn-path', 'Enter');
  eventHookUp(evtToggleGrid, 'btn-grid', 'g', true);

  eventHookUp(evtToggleBold, 'btn-bold', 'b', true);
  eventHookUp(evtToggleItalic, 'btn-italic', 'i', true);
  eventHookUp(evtToggleUnderline, 'btn-underline', 'u', true);


  eventHookUp(evtShortener, 'btn-shorter', '-', true);
  eventHookUp(evtWidener, 'btn-wider', '=', true);

  eventHookUp(evtSelectAll, null, 'a', true);

  eventHookUp(evtUndo, 'btn-undo', 'z', true);
  eventHookUp(evtRedo, 'btn-redo', 'y', true);

  eventHookUp(evtCopy, 'btn-copy', 'c', true);
  eventHookUp(evtCut, 'btn-cut', 'x', true);
  eventHookUp(evtPaste, 'btn-paste', 'v', true);

  eventHookUp(evtSave, null, 's', true);
  eventHookUp(evtOpen, null, 'o', true);
  eventHookUp(evtNew, null, 'n', true);
}

/**
 * History Storage Manager Module
 */

const __max_history_size = 0xFF;
let history = []; 
let redo = []; /* uncontrolled might overflow or leak */

const initHistory = function ()
{
  for (let i = 0; i < __max_history_size; i++)
    history.push(null);
}

const historyRecord = function ()
{
  if (history.filter(e => e != null).length > 1)
    document.getElementById('btn-undo').style = "opacity: 1.0"

  if (editor.selected.length > 1 && editor.dragging)
    return;

  if (document.getElementById('viewport').innerHTML == history[0])
    return;

  /* clear redo scope */
  redo = [];
  document.getElementById('btn-redo').style = 'opacity: 0.2';

  /* move entries */
  for (let i = __max_history_size - 1; i > 0; i--)
    history[i] = history[i - 1];

  /* remember */
  history[0] = document.getElementById('viewport').innerHTML;

  console.log(history);
}

const historyUndo = function ()
{  
  if (history.filter(e => e != null).length < 2)
    return;

  /* buffer up redo */
  redo.push(history[0]);
  document.getElementById('btn-redo').style = "opacity: 1.0"

  /* shift back history */
  for (let i = 0; i < __max_history_size - 1; i++)
    history[i] = history[i + 1];

  /* restore state */
  if (history[0] != null)
    document.getElementById('viewport').innerHTML = history[0];

  /* last place gets forgotten */
  history[__max_history_size - 1] = null;

  if (history.filter(e => e != null).length < 2)
    document.getElementById('btn-undo').style = "opacity: 0.2";
}

const historyRedo = function ()
{
  if (redo.length <= 0)
    return; // impossible

  const lastRedoState = redo.pop();

  /* move entries */
  for (let i = __max_history_size - 1; i > 0; i--)
    history[i] = history[i - 1];

  history[0] = lastRedoState;
  if (lastRedoState != null)
    document.getElementById('viewport').innerHTML = lastRedoState;

  /* handle button visuals */
  if (redo.length <= 0)
    document.getElementById('btn-redo').style = 'opacity: 0.2';
}