const precepts = [
  '不殺生',
  '不偸盗',
  '不邪淫',
  '不妄語',
  '不飲酒',
];

let state = {
  username: '',
  records: {}
};

function getTodayKey() {
  const today = new Date();
  return today.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
}

function saveState() {
  localStorage.setItem('username', state.username);
  localStorage.setItem('records', JSON.stringify(state.records));
}

function loadState() {
  const savedUser = localStorage.getItem('username');
  const savedRecords = localStorage.getItem('records');
  if (savedUser) state.username = savedUser;
  if (savedRecords) state.records = JSON.parse(savedRecords);
}

function renderDates() {
  const datesContainer = document.getElementById('dates');
  datesContainer.innerHTML = '';
  const dates = Object.keys(state.records).sort();
  dates.forEach(date => {
    const button = document.createElement('button');
    button.textContent = date;
    const record = state.records[date];
    const anyBroken = record.some(r => !r.checked);
    button.className = anyBroken ? 'broken' : 'passed';
    button.addEventListener('click', () => {
      currentKey = date;
      renderPrecepts();
      document.getElementById('currentDate').textContent = date;
    });
    datesContainer.appendChild(button);
  });
}

let currentKey = getTodayKey();

function renderPrecepts() {
  const container = document.querySelector('.precepts');
  container.innerHTML = '';
  if (!state.records[currentKey]) {
    state.records[currentKey] = precepts.map(text => ({ text, checked: true, note: '' }));
  }

  state.records[currentKey].forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'precept';

    const label = document.createElement('label');
    label.textContent = item.text;

    const toggle = document.createElement('div');
    toggle.className = 'toggle-switch ' + (item.checked ? 'on' : 'off');
    const handle = document.createElement('div');
    handle.className = 'toggle-handle';
    handle.textContent = item.checked ? '〇' : '×';
    toggle.appendChild(handle);
    toggle.addEventListener('click', () => {
      item.checked = !item.checked;
      renderPrecepts();
    });

    const input = document.createElement('input');
    input.type = 'text';
    input.value = item.note || '';
    input.placeholder = '備考';
    input.addEventListener('input', (e) => {
      item.note = e.target.value;
    });

    row.appendChild(label);
    row.appendChild(toggle);
    row.appendChild(input);

    container.appendChild(row);
  });
}

document.getElementById('saveName').addEventListener('click', () => {
  const name = document.getElementById('usernameInput').value.trim();
  if (name) {
    state.username = name;
    saveState();
    alert('名前を保存しました');
  }
});

document.getElementById('saveDay').addEventListener('click', () => {
  saveState();
  renderDates();
  alert('記録を保存しました');
});

function init() {
  loadState();
  if (state.username) {
    document.getElementById('usernameInput').value = state.username;
  }
  document.getElementById('currentDate').textContent = currentKey;
  renderDates();
  renderPrecepts();
}

document.addEventListener('DOMContentLoaded', init);
