const precepts = [
  { jp:'不殺生' },
  { jp:'不偸盗' },
  { jp:'不邪淫' },
  { jp:'不妄語' },
  { jp:'不飲酒' },
];

const usernameInput = document.getElementById('usernameInput');
const saveName = document.getElementById('saveName');
const datesEl = document.getElementById('dates');
const currentDateEl = document.getElementById('currentDate');
const preceptsEl = document.querySelector('.precepts');
const saveDay = document.getElementById('saveDay');

// --- 新規追加部分 ---
// ヘッダーにテストデータ読み込みボタンを追加
const headerEl = document.querySelector('header');
const loadTestDataBtn = document.createElement('button');
loadTestDataBtn.textContent = 'テストデータ読み込み';
loadTestDataBtn.style.marginLeft = '0.5rem';
loadTestDataBtn.style.fontSize = '0.8rem';
loadTestDataBtn.style.padding = '0.3rem 0.5rem';
headerEl.appendChild(loadTestDataBtn);

let state = {
  username: localStorage.getItem('username') || '',
  records: JSON.parse(localStorage.getItem('records')||'{}'),
  current: new Date().toISOString().slice(0,10),
};
usernameInput.value = state.username;

function buildDates(){
  const dates = Object.keys(state.records).sort();
  datesEl.innerHTML='';
  dates.forEach(date=>{
    const rec = state.records[date];
    const btn = document.createElement('button');
    btn.textContent = date;
    btn.classList.add(rec.every(r=>r.ok)?'passed':'broken');
    btn.addEventListener('click', ()=> loadDate(date));
    datesEl.appendChild(btn);
  });
}

function loadDate(date){
  state.current = date;
  currentDateEl.textContent = state.current;
  preceptsEl.innerHTML = '';
  const rec = state.records[date];

  precepts.forEach((p,i)=>{
    const div = document.createElement('div');
    div.className = 'precept';

    const label = document.createElement('label');
    label.innerHTML = `<strong>${p.jp}</strong>`;

    let ok = rec ? rec[i].ok : true;
    const toggle = document.createElement('div');
    toggle.className = 'toggle-switch ' + (ok?'on':'off');
    const handle = document.createElement('div');
    handle.className = 'toggle-handle';
    handle.textContent = ok ? '〇' : '×';
    toggle.appendChild(handle);

    toggle.addEventListener('click', ()=>{
      ok = !ok;
      toggle.className = 'toggle-switch ' + (ok?'on':'off');
      handle.textContent = ok ? '〇' : '×';
    });

    const note = document.createElement('input');
    note.type = 'text';
    note.value = rec ? rec[i].note : '';
    note.placeholder = '備考';

    div.append(label, toggle, note);
    preceptsEl.appendChild(div);
  });
}

saveName.addEventListener('click', ()=>{
  const name = usernameInput.value.trim();
  if(!name){ alert('名前を入力してください'); return;}
  state.username = name;
  localStorage.setItem('username', name);
  alert('名前を保存しました：' + name);
});

saveDay.addEventListener('click', ()=>{
  const recs=[];
  document.querySelectorAll('.precept').forEach(el=>{
    const ok = el.querySelector('.toggle-switch').classList.contains('on');
    const note = el.querySelector('input[type=text]').value.trim();
    recs.push({ok,note});
  });
  state.records[state.current] = recs;
  localStorage.setItem('records', JSON.stringify(state.records));
  buildDates();
  alert(`${state.current} の記録を保存しました。`);
});

// --- ここから新規追加部分 ---
// テストデータ
const testRecords = {
  "2025-06-01": [
    { ok: true, note: "良い日" },
    { ok: false, note: "失敗した" },
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: true, note: "控えめに" }
  ],
  "2025-06-02": [
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: true, note: "" }
  ],
  "2025-06-03": [
    { ok: false, note: "気をつける" },
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: false, note: "嘘をついた" },
    { ok: true, note: "" }
  ],
  "2025-06-04": [
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: false, note: "飲酒した" }
  ],
  "2025-06-05": [
    { ok: true, note: "" },
    { ok: false, note: "盗みそうになった" },
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: true, note: "" }
  ],
  "2025-06-06": [
    { ok: true, note: "" },
    { ok: true, note: "" },
    { ok: false, note: "不正行為" },
    { ok: true, note: "" },
    { ok: true, note: "" }
  ],
};

loadTestDataBtn.addEventListener('click', () => {
  if(confirm('テストデータを読み込みます。既存の記録は上書きされます。よろしいですか？')){
    state.records = {...testRecords};
    localStorage.setItem('records', JSON.stringify(state.records));
    buildDates();
    loadDate(Object.keys(state.records).sort()[0]);
    alert('テストデータを読み込みました。');
  }
});

// 初回表示の構築
buildDates();
loadDate(state.current);
