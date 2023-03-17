
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
  console.log('setting', ht);

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
    isBold: false,
    isItalic: false,
    isUnderlined: false
  }

  const ht = `
    <div 
      class="DiagramElement ${itemName}Element" 
      id="${itemId}" 
      data-tag='${JSON.stringify(itemTag)}' 
      onmousedown="moveObject('${itemId}', event)" 
      onclick="selectItem('${itemId}');"
    > 
      <div ondblclick="this.contentEditable = true;">
        ${itemName}
      </div>  
    </div>
  `;
  document.getElementById('viewport').innerHTML += ht;
  return itemId;
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
    z: 0,
    face: 'None',
    size: 'None',
    dir: dir,
    isBold: false,
    isItalic: false,
    isUnderlined: false
  }

  const ht = `
    <div 
      class="DiagramElement ArrowElement" 
      id="${itemId}" 
      data-tag='${JSON.stringify(itemTag)}' 
      onmousedown="moveObject('${itemId}', event)" 
      onclick="selectItem('${itemId}');"
    >
      ${dirs[dir]}
    </div>
  `;
  document.getElementById('viewport').innerHTML += ht;
  return itemId;
}

const updateElement = function (id)
{
    const box = document.getElementById(id);
    const tag = JSON.parse(box.dataset['tag']);
    const isSelected = editor.selected.includes(id);

    const border = isSelected
      ? '4px solid #C59624'
      : '4px solid white';

    const weight = tag.isBold ? 'bold' : 'normal';
    const italic = tag.isItalic ? 'italic' : 'normal';
    const underline = tag.isUnderlined ? 'underline' : 'none';

    box.style = `left: ${tag.x}px; 
                 top: ${tag.y}px; 
                 width: ${tag.width}px;
                 z-index: ${tag.z};
                 border: ${border};
                 font-family: ${tag.face};
                 font-size: ${tag.size}px;
                 height: ${tag.type == 'Arrow' ? tag.height + 'px' : 'auto'};
                 font-style: ${italic};
                 font-weight: ${weight};
                 text-decoration: ${underline};
                 `;

    // console.log('updated ', id, tag);
}


/**
 * Active Editor
 */

const editor = 
{
  pathing: false,
  selectedTool: null,
  dragging: false,
  dragBox: null,
  zindexing: 0,
  selected: [], /*all selected items*/
  gridEnabled: true,
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
  editor.pathing = false;
  const id = spawnAnItem(itemName);
  moveObject(id);
}

const updateAllElements = function ()
{
  const elements = document.getElementsByClassName('DiagramElement');
  for (let ele of elements)
    updateElement(ele.id);
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
    console.log(s, box, box.dataset['tag']);
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

document.body.onload = function ()
{
  initToolSet();
  initFonts();
  searchTool('');
}

document.body.onmousedown = function (e)
{

  if (editor.pathing)
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
  console.log(e);
  editor.areaselect.enabled = true;
  editor.areaselect.x = e.clientX;
  editor.areaselect.y = e.clientY;
}

document.body.onmouseup = function (e)
{
  if (editor.pathing)
  {
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
    /* disable and hide area */
    editor.areaselect.enabled = false;
    document.getElementById('select-area').style = 'top: -1000px; left: -1000px';

    /* then, select items */
    let bounds = [editor.areaselect.x, editor.areaselect.y, e.clientX, e.clientY];

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

    if (inRange.length > 0)
    {
      let sameFace = true;
      let sameSize = true;

      for (let t of inRange)
      {
        if (t.face != inRange[0].face)
          sameFace = false;

        if (t.size != inRange[0].size)
          sameSize = false;
      }

      if (sameFace)
        fontPickerFamily.value = inRange[0].face;
      else
        fontPickerFamily.value = 'None';

      if (sameSize)
        fontPickerSize.value = inRange[0].size;
      else
        fontPickerSize.value = 'None';
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
  }

  editor.dragging = false;
}

document.body.onmousemove = function (e)
{
  if (editor.pathing)
  { /* god prop */
    // console.log(e);


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

document.getElementById('btn-wider').onmousedown = function (e)
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

document.getElementById('btn-shorter').onmousedown = function (e)
{
  eachSelected((id, box, tag) => 
  {
    if (tag.type == 'Arrow')
      return tag;

    console.log('b', id, tag);
    if (tag.width > 80)
    {
      console.log('shrunker');
      tag.width -= 10;
      tag.x += 5;
    }
    console.log('a', id, tag);
    return tag;
  });
}

document.getElementById('btn-grid').onclick = function (e)
{
  editor.gridEnabled = !editor.gridEnabled;

  if (editor.gridEnabled)
    document.getElementById('btn-grid').style = 'opacity: 1.0';
  else
    document.getElementById('btn-grid').style = 'opacity: 0.2';
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

document.getElementById('btn-remove').onclick = function (e)
{
  for (let id of editor.selected)
    document.getElementById(id).remove();
}

document.getElementById('viewport').onclick = function (e)
{
  if (e.target != document.getElementById('viewport'))
    return;
    
  editor.selected = []; /* TODO */
  updateAllElements();
}

document.getElementById('btn-path').onclick = function (e)
{
  editor.pathing = !editor.pathing;

  if (editor.pathing)
    document.getElementById('btn-path').style = 'opacity: 1.0';
  else
    document.getElementById('btn-path').style = 'opacity: 0.2';

  if (editor.pathing)
    editor.areaselect.enabled = false;
}


document.getElementById('btn-bold').onclick = function (e)
{
  eachSelected((id, box, tag) => 
  {
    tag.isBold = !tag.isBold;
    return tag;
  })
}

document.getElementById('btn-italic').onclick = function (e)
{
  eachSelected((id, box, tag) => 
  {
    tag.isItalic = !tag.isItalic;
    return tag;
  })
}

document.getElementById('btn-underline').onclick = function (e)
{
  eachSelected((id, box, tag) => 
  {
    tag.isUnderlined = !tag.isUnderlined;
    return tag;
  })
}
