/* main.js */

console.log("[DEBUG] main.js loaded");

const STORAGE_KEY = 'litterBoxesData';
let litterBoxes = [];

// Initialize default litter boxes (6 boxes)
function initLitterBoxes() {
  console.log("[DEBUG] Initializing litter boxes...");
  litterBoxes = [];
  for (let i = 1; i <= 6; i++) {
    litterBoxes.push({
      id: i,
      name: 'Litter Box ' + i,
      maintenance: {} // keys: date (YYYY-MM-DD); values: "scooped", "cleaned", or "scoopedAuto"
    });
  }
}

// Load from localStorage or initialize if none exists
function loadData() {
  console.log("[DEBUG] Loading data from localStorage...");
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      litterBoxes = JSON.parse(data);
      console.log("[DEBUG] Data loaded:", litterBoxes);
    } catch (e) {
      console.error("[ERROR] Failed to parse localStorage data:", e);
      initLitterBoxes();
    }
  } else {
    console.log("[DEBUG] No existing data; initializing default litter boxes.");
    initLitterBoxes();
    saveData();
  }
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(litterBoxes));
    console.log("[DEBUG] Data saved to localStorage.");
  } catch (e) {
    console.error("[ERROR] Failed to save data:", e);
  }
}

// Format Date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Generate array of dates (14 days before today to 28 days after = 42 days)
function generateCalendarDates() {
  const dates = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 14);
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(d);
  }
  console.log("[DEBUG] Generated calendar dates:", dates.map(d => formatDate(d)));
  return dates;
}

// Render all litter boxes and their calendars
function renderLitterBoxes() {
  console.log("[DEBUG] Rendering litter boxes...");
  const container = document.getElementById('litterBoxesContainer');
  if (!container) {
    console.error("[ERROR] Container with ID 'litterBoxesContainer' not found.");
    return;
  }
  container.innerHTML = '';

  litterBoxes.forEach(box => {
    const boxDiv = document.createElement('div');
    boxDiv.className = 'litter-box';
    boxDiv.dataset.id = box.id;

    // Header with name and edit icon
    const header = document.createElement('div');
    header.className = 'box-header';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'box-name';
    nameSpan.textContent = box.name;
    header.appendChild(nameSpan);
    
    const pencil = document.createElement('span');
    pencil.className = 'edit-icon';
    pencil.textContent = ' ✏️';
    pencil.style.cursor = 'pointer';
    pencil.addEventListener('click', () => {
      editBoxName(box.id, nameSpan);
    });
    header.appendChild(pencil);
    
    boxDiv.appendChild(header);

    // Calendar grid
    const calendarDiv = document.createElement('div');
    calendarDiv.className = 'calendar-grid';
    const dates = generateCalendarDates();
    dates.forEach(date => {
      const dateStr = formatDate(date);
      const cell = document.createElement('div');
      cell.className = 'calendar-cell';
      cell.dataset.date = dateStr;
      cell.textContent = date.getDate();

      // Highlight current day
      if (dateStr === formatDate(new Date())) {
        cell.classList.add('today');
      }

      // Apply status styling if exists
      if (box.maintenance[dateStr]) {
        cell.classList.add(box.maintenance[dateStr]);
      }

      // Toggle status on click
      cell.addEventListener('click', () => {
        toggleCellStatus(box.id, dateStr);
      });

      calendarDiv.appendChild(cell);
    });
    boxDiv.appendChild(calendarDiv);
    container.appendChild(boxDiv);
  });
  console.log("[DEBUG] Rendering complete.");
}

// Inline edit for box name
function editBoxName(boxId, nameSpan) {
  const box = litterBoxes.find(b => b.id === boxId);
  if (!box) {
    console.error("[ERROR] Box with ID", boxId, "not found for editing.");
    return;
  }
  const input = document.createElement('input');
  input.type = 'text';
  input.value = box.name;
  input.className = 'name-input';
  nameSpan.replaceWith(input);
  input.focus();

  input.addEventListener('blur', () => {
    box.name = input.value.trim() || box.name;
    saveData();
    renderLitterBoxes();
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      input.blur();
    }
  });
}

// Toggle cell status: '' -> "scooped" -> "cleaned" -> reset to ''
function toggleCellStatus(boxId, dateStr) {
  const box = litterBoxes.find(b => b.id === boxId);
  if (!box) {
    console.error("[ERROR] Box with ID", boxId, "not found when toggling cell status.");
    return;
  }
  let currentStatus = box.maintenance[dateStr] || '';
  console.log(`[DEBUG] Current status for box ${boxId} on ${dateStr}:`, currentStatus);
  if (currentStatus === '') {
    box.maintenance[dateStr] = 'scooped';
  } else if (currentStatus === 'scooped') {
    box.maintenance[dateStr] = 'cleaned';
    // Automatically mark next two days as "scoopedAuto"
    const d = new Date(dateStr);
    for (let offset = 1; offset <= 2; offset++) {
      const nextDate = new Date(d);
      nextDate.setDate(d.getDate() + offset);
      const nextDateStr = formatDate(nextDate);
