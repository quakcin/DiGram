

// document.getElementById('test').onclick = function (e)
// {
//   e.target.style = 'background-color: yellow'
// }


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
    name: "Przetwarzanie",
    icon: "../icons/proc.png"
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
  console.log('event');
  searchTool(e.target.value);
}

/**
 * Elements
 */

const spawnAnItem = function (itemName)
{
  /* spawn an item */

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
    size: document.getElementById('fontPickerSize').value
  }

  const ht = `
    <div class="DiagramElement ${itemName}Element" id="${itemId}" data-tag='${JSON.stringify(itemTag)}' onmousedown="moveObject('${itemId}')" onclick="selectItem('${itemId}');"> 
      <div contenteditable>
        ${itemName}
      </div>  
    </div>
  `;
  document.getElementById('viewport').innerHTML += ht;
  return itemId;
}

const updateElement = function (id)
{
    const box = document.getElementById(id);
    const tag = JSON.parse(box.dataset['tag']);
    const border = id == editor.selected
      ? '4px solid #C59624'
      : '4px solid white';

    box.style = `left: ${tag.x}px; 
                 top: ${tag.y}px; 
                 width: ${tag.width}px;
                 z-index: ${tag.z};
                 border: ${border};
                 font-family: ${tag.face};
                 font-size: ${tag.size}px
                 `;

    // console.log('updated ', id, tag);
}


/**
 * Active Editor
 */

const editor = 
{
  selectedTool: null,
  dragging: false,
  dragBox: null,
  zindexing: 0,
  selected: null,
  gridEnabled: true
};

const moveObject = function (id)
{
  editor.dragging = true;
  editor.dragBox = id;
  editor.zindexing++;
}

const pickAnItem = function (itemName)
{
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
  editor.selected = id;
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

document.body.onmouseup = function (e)
{
  if (editor.dragging)
  { /* select after moving */
    selectItem(editor.dragBox);
  }

  editor.dragging = false;
}

document.body.onmousemove = function (e)
{
  if (editor.dragging)
  {
    // console.log(e);
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


document.getElementById('btn-wider').onmousedown = function (e)
{
  if (editor.selected == null)
    return;

  const box = document.getElementById(editor.selected);
  const tag = JSON.parse(box.dataset['tag']);

  if (tag.width > 800)
    return;

  tag.width += 10;
  tag.x -= 5;

  box.dataset['tag'] = JSON.stringify(tag);
  updateElement(editor.selected);
}

document.getElementById('btn-shorter').onmousedown = function (e)
{
  if (editor.selected == null)
    return;

  const box = document.getElementById(editor.selected);
  const tag = JSON.parse(box.dataset['tag']);

  if (tag.width < 80)
    return;

  tag.width -= 10;
  tag.x += 5;
  
  box.dataset['tag'] = JSON.stringify(tag);
  updateElement(editor.selected);
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
  if (editor.selected == null)
    return;


  const box = document.getElementById(editor.selected);
  const tag = JSON.parse(box.dataset['tag']);
  
  tag.face = e.target.value;

  box.dataset['tag'] = JSON.stringify(tag);
  updateElement(editor.selected);
}

document.getElementById('fontPickerSize').onchange = function (e)
{
  if (editor.selected == null)
    return;


  const box = document.getElementById(editor.selected);
  const tag = JSON.parse(box.dataset['tag']);
  
  tag.size = parseInt(e.target.value);

  box.dataset['tag'] = JSON.stringify(tag);
  updateElement(editor.selected);
}

document.getElementById('btn-remove').onclick = function (e)
{
  console.log('removing');
  if (editor.selected == null)
    return;
  console.log('pass');

  document.getElementById(editor.selected).remove();
}

document.getElementById('viewport').onclick = function (e)
{
  if (e.target != document.getElementById('viewport'))
    return;
    
  editor.selected = null;
  updateAllElements();
}