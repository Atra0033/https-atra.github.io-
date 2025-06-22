const precepts = [
  { jp:'不殺生', en:'Do not kill' },
  { jp:'不偸盗', en:'Do not steal' },
  { jp:'不邪淫', en:'Do not commit sexual misconduct' },
  { jp:'不妄語', en:'Do not lie' },
  { jp:'不飲酒', en:'Do not consume intoxicants' },
];

const usernameInput = document.getElementById('usernameInput');
const saveName = document.getElementById('saveName');
const datesEl = document.getElementById('dates');
const currentDateEl = document.getElementById('currentDate');
const preceptsEl = document.querySelector('.precepts');
const saveDay = document.getElementById('saveDay');

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
    label.innerHTML = `<strong>${p.jp}</strong><br><small>${p.en}</small>`;

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

buildDates();
loadDate(state.current);

window.addYesterdayTest = function(){
  const d=new Date(); d.setDate(d.getDate()-1);
  const ds=d.toISOString().slice(0,10);
  state.records[ds] = precepts.map(_=>({ok:false,note:'テスト'}));
  localStorage.setItem('records', JSON.stringify(state.records));
  buildDates();
  alert(`昨日(${ds})のテストデータを追加しました。`);
};
