
(function(){

const ICONS = {
  dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="11" width="8" height="10" rx="1.5"/><rect x="3" y="14" width="8" height="7" rx="1.5"/></svg>',
  planner: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18"/><path d="M8 3v3M16 3v3"/><circle cx="8" cy="14" r="1"/><circle cx="12" cy="14" r="1"/><circle cx="16" cy="14" r="1"/></svg>',
  tasks: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4" width="6" height="6" rx="1"/><path d="M5 7l1 1 2-2"/><path d="M12 6h9"/><rect x="3.5" y="14" width="6" height="6" rx="1"/><path d="M12 17h9"/></svg>',
  subjects: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5z"/></svg>',
  goals: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/></svg>',
  reminders: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
  profile: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3.5"/><path d="M4.5 20c1.4-3.8 4.4-6 7.5-6s6.1 2.2 7.5 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  edit: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  trash: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V4.8c0-.4.4-.8.9-.8h4.2c.5 0 .9.4.9.8V7"/><path d="M6.5 7l.7 12.2c0 .5.5.8 1 .8h7.6c.5 0 .9-.3 1-.8L17.5 7"/></svg>'
};

const NAV_ITEMS = [
  {key:'dashboard', label:'Dashboard'},
  {key:'planner', label:'Planner'},
  {key:'tasks', label:'Tasks'},
  {key:'subjects', label:'Subjects'},
  {key:'goals', label:'Goals'},
  {key:'reminders', label:'Reminders'},
  {key:'profile', label:'Profile'}
];

let uidCounter = 1;
function uid(){ return 'id' + (uidCounter++); }

function pad(n){ return String(n).padStart(2,'0'); }
function toISO(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }

const today = new Date();
const todayISO = toISO(today);

function addDays(iso, n){
  const d = new Date(iso+'T00:00:00');
  d.setDate(d.getDate()+n);
  return toISO(d);
}
function fmtDate(iso, opts){
  const d = new Date(iso+'T00:00:00');
  return d.toLocaleDateString('en-US', opts || {month:'short', day:'numeric'});
}
function fmtTime24to12(hhmm){
  const [h,m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  let h12 = h % 12; if(h12===0) h12 = 12;
  return h12+':'+pad(m)+' '+period;
}
function daysBetween(fromISO, toISOd){
  const a = new Date(fromISO+'T00:00:00');
  const b = new Date(toISOd+'T00:00:00');
  return Math.round((b-a)/86400000);
}

const state = {
  student: {
    name:'Ana Cruz',
    id:'2023-04582',
    course:'BS Computer Science',
    year:'3rd year',
    initials:'AC'
  },
  subjects: [
    {id:uid(), name:'Web Development', instructor:'Prof. R. Santos', schedule:'Mon / Wed, 8:00–9:30 AM', progress:80},
    {id:uid(), name:'Database Management', instructor:'Prof. L. Tan', schedule:'Tue / Thu, 10:00–11:30 AM', progress:65},
    {id:uid(), name:'Programming', instructor:'Prof. M. Reyes', schedule:'Mon / Wed / Fri, 1:00–2:00 PM', progress:70},
    {id:uid(), name:'Data Structures', instructor:'Prof. J. Dizon', schedule:'Tue / Thu, 2:00–3:30 PM', progress:55}
  ],
  tasks: [
    {id:uid(), name:'Finish Chapter 1', subject:'Web Development', due:addDays(todayISO,2), priority:'Medium', status:'Pending'},
    {id:uid(), name:'Review Database', subject:'Database Management', due:addDays(todayISO,3), priority:'High', status:'Pending'},
    {id:uid(), name:'Submit Assignment', subject:'Programming', due:addDays(todayISO,4), priority:'High', status:'Completed'},
    {id:uid(), name:'Read Chapter 3', subject:'Data Structures', due:addDays(todayISO,5), priority:'Low', status:'Pending'},
    {id:uid(), name:'Prepare lab report', subject:'Database Management', due:addDays(todayISO,-1), priority:'Medium', status:'Completed'}
  ],
  schedule: [
    {id:uid(), date:todayISO, time:'08:00', subject:'Web Development', location:'Room 204', priority:'Medium'},
    {id:uid(), date:todayISO, time:'10:00', subject:'Database Management', location:'Library', priority:'High'},
    {id:uid(), date:todayISO, time:'13:00', subject:'Programming', location:'Room 110', priority:'Low'},
    {id:uid(), date:addDays(todayISO,1), time:'09:00', subject:'Data Structures', location:'Room 302', priority:'Medium'},
    {id:uid(), date:addDays(todayISO,1), time:'14:00', subject:'Web Development', location:'Room 204', priority:'Low'},
    {id:uid(), date:addDays(todayISO,2), time:'10:00', subject:'Database Management', location:'Library', priority:'High'},
    {id:uid(), date:addDays(todayISO,3), time:'08:00', subject:'Programming', location:'Room 110', priority:'Medium'},
    {id:uid(), date:addDays(todayISO,4), time:'13:00', subject:'Data Structures', location:'Room 302', priority:'Low'},
    {id:uid(), date:addDays(todayISO,-2), time:'09:00', subject:'Web Development', location:'Room 204', priority:'Medium'}
  ],
  exams: [
    {id:uid(), subject:'Database Management', date:addDays(todayISO,7), time:'09:00 AM', location:'Room 301'},
    {id:uid(), subject:'Web Development', date:addDays(todayISO,10), time:'01:00 PM', location:'Room 204'}
  ],
  goals: [
    {id:uid(), name:'Finish React fundamentals', target:addDays(todayISO,12), progress:60, completed:false},
    {id:uid(), name:'Complete SQL practice set', target:addDays(todayISO,-1), progress:100, completed:true},
    {id:uid(), name:'Read 3 chapters of Data Structures', target:addDays(todayISO,17), progress:30, completed:false}
  ]
};

let currentView = 'dashboard';
let plannerMode = 'day';
let plannerAnchor = todayISO;
let taskFilter = 'all';
let editingTaskId = null;
let editingScheduleId = null;
let editingGoalId = null;

function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------------- Login ---------------- */
document.getElementById('loginForm').addEventListener('submit', function(e){
  e.preventDefault();
  document.getElementById('loginScreen').style.display = 'none';
  showLanding();
});
document.getElementById('forgotBtn').addEventListener('click', function(){
  document.getElementById('forgotNote').classList.toggle('show');
});

function showLanding(){
  document.getElementById('landingScreen').classList.add('active');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('landingGreeting').textContent = `${greeting}, ${state.student.name.split(' ')[0]}`;

  const pending = state.tasks.filter(t=>t.status==='Pending').length;
  const upcomingExams = state.exams.filter(e=>daysBetween(todayISO,e.date)>=0).length;
  const avgProgress = Math.round(state.subjects.reduce((a,s)=>a+s.progress,0)/state.subjects.length);
  document.getElementById('landingStats').innerHTML = `
    <div class="stat"><div class="stat-num">${pending}</div><div class="stat-label">Tasks pending</div></div>
    <div class="stat"><div class="stat-num accent">${upcomingExams}</div><div class="stat-label">Upcoming exams</div></div>
    <div class="stat" style="border-right:none;"><div class="stat-num sage">${avgProgress}%</div><div class="stat-label">Study progress</div></div>
  `;
}

document.getElementById('landingEnterBtn').addEventListener('click', function(){
  document.getElementById('landingScreen').classList.remove('active');
  document.getElementById('app').classList.add('active');
  switchView('dashboard');
});
document.getElementById('landingLogout').addEventListener('click', function(){
  document.getElementById('landingScreen').classList.remove('active');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginForm').reset();
  showToast('Logged out');
});

/* ---------------- Nav ---------------- */
function buildNav(){
  const ul = document.getElementById('navList');
  ul.innerHTML = NAV_ITEMS.map(item => `
    <li data-view="${item.key}" class="${item.key===currentView?'active':''}">
      <button data-goto="${item.key}">${ICONS[item.key]}<span>${item.label}</span></button>
    </li>`).join('');
}
document.getElementById('navList').addEventListener('click', function(e){
  const btn = e.target.closest('button[data-goto]');
  if(btn) switchView(btn.dataset.goto);
});
document.body.addEventListener('click', function(e){
  const link = e.target.closest('[data-goto]');
  if(link && !link.closest('#navList')) switchView(link.dataset.goto);
});
document.getElementById('sidebarProfileBtn').addEventListener('click', ()=>switchView('profile'));

function switchView(name){
  currentView = name;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById('view-'+name).classList.add('active');
  document.querySelectorAll('#navList li').forEach(li=>{
    li.classList.toggle('active', li.dataset.view===name);
  });
  render();
  document.querySelector('.main').scrollTo?.(0,0);
  window.scrollTo(0,0);
}

/* ---------------- Dialog helpers ---------------- */
function openDialog(id){ document.getElementById(id).showModal(); }
function closeDialog(id){ document.getElementById(id).close(); }
document.querySelectorAll('[data-close]').forEach(btn=>{
  btn.addEventListener('click', ()=>closeDialog(btn.dataset.close));
});

function populateSubjectSelects(){
  const opts = state.subjects.map(s=>`<option value="${s.name}">${s.name}</option>`).join('');
  document.getElementById('taskSubject').innerHTML = opts;
  document.getElementById('scheduleSubject').innerHTML = opts;
}

/* ---------------- Dashboard ---------------- */
function renderDashboard(){
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = state.student.name.split(' ')[0];
  document.getElementById('welcomeMsg').textContent = `${greeting}, ${firstName}.`;
  document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric', year:'numeric'});

  const pending = state.tasks.filter(t=>t.status==='Pending').length;
  const upcomingExams = state.exams.filter(e=>daysBetween(todayISO,e.date)>=0).length;
  const avgProgress = Math.round(state.subjects.reduce((a,s)=>a+s.progress,0)/state.subjects.length);

  document.getElementById('statRow').innerHTML = `
    <div class="stat"><div class="stat-num">${pending}</div><div class="stat-label">Tasks pending</div></div>
    <div class="stat"><div class="stat-num accent">${upcomingExams}</div><div class="stat-label">Upcoming exams</div></div>
    <div class="stat"><div class="stat-num sage">${avgProgress}%</div><div class="stat-label">Study progress</div></div>
  `;

  const todayItems = state.schedule.filter(s=>s.date===todayISO).sort((a,b)=>a.time.localeCompare(b.time));
  document.getElementById('todayScheduleList').innerHTML = todayItems.length ? todayItems.map(s=>`
    <li>
      <span class="row-time">${fmtTime24to12(s.time)}</span>
      <span class="row-body">
        <span class="row-title">${s.subject}</span>
        <span class="row-sub">${s.location}</span>
      </span>
      <span class="dot ${s.priority.toLowerCase()}"></span>
    </li>`).join('') : '<div class="empty-note">No sessions scheduled for today.</div>';

  const upcomingTasks = state.tasks.filter(t=>t.status==='Pending').sort((a,b)=>a.due.localeCompare(b.due)).slice(0,4);
  document.getElementById('upcomingTasksList').innerHTML = upcomingTasks.length ? upcomingTasks.map(t=>`
    <li>
      <button class="checkbox" data-toggle-task="${t.id}">${ICONS.check}</button>
      <span class="row-body">
        <span class="row-title">${t.name}</span>
        <span class="row-sub">${t.subject}</span>
      </span>
      <span class="due-date">${fmtDate(t.due)}</span>
    </li>`).join('') : '<div class="empty-note">All caught up — no pending tasks.</div>';

  const upcomingExamsList = state.exams.filter(e=>daysBetween(todayISO,e.date)>=0).sort((a,b)=>a.date.localeCompare(b.date));
  document.getElementById('upcomingExamsList').innerHTML = upcomingExamsList.length ? upcomingExamsList.map(e=>`
    <li>
      <span class="row-time">${fmtDate(e.date)}</span>
      <span class="row-body">
        <span class="row-title">${e.subject}</span>
        <span class="row-sub">${e.time} • ${e.location}</span>
      </span>
    </li>`).join('') : '<div class="empty-note">No exams on the calendar.</div>';

  document.getElementById('progressList').innerHTML = state.subjects.map(s=>`
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:13px;">
        <span style="font-weight:600;">${s.name}</span><span style="color:var(--text-muted);">${s.progress}%</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${s.progress}%;"></div></div>
    </div>`).join('');
}

document.getElementById('qaAddTask').addEventListener('click', ()=>openTaskDialog());
document.getElementById('qaAddSchedule').addEventListener('click', ()=>openScheduleDialog());
document.getElementById('qaViewPlanner').addEventListener('click', ()=>switchView('planner'));

document.body.addEventListener('click', function(e){
  const cb = e.target.closest('[data-toggle-task]');
  if(cb){
    const t = state.tasks.find(t=>t.id===cb.dataset.toggleTask);
    if(t){ t.status = t.status==='Pending' ? 'Completed' : 'Pending'; render(); }
  }
});

/* ---------------- Planner ---------------- */
document.getElementById('plannerToggle').addEventListener('click', function(e){
  const btn = e.target.closest('button[data-mode]');
  if(!btn) return;
  plannerMode = btn.dataset.mode;
  document.querySelectorAll('#plannerToggle button').forEach(b=>b.classList.toggle('active', b===btn));
  renderPlanner();
});
document.getElementById('plannerPrev').addEventListener('click', ()=>shiftPlanner(-1));
document.getElementById('plannerNext').addEventListener('click', ()=>shiftPlanner(1));
function shiftPlanner(dir){
  const step = plannerMode==='day' ? 1 : plannerMode==='week' ? 7 : 30;
  if(plannerMode==='month'){
    const d = new Date(plannerAnchor+'T00:00:00');
    d.setMonth(d.getMonth()+dir);
    plannerAnchor = toISO(d);
  } else {
    plannerAnchor = addDays(plannerAnchor, dir*step);
  }
  renderPlanner();
}
document.getElementById('plannerAddBtn').addEventListener('click', ()=>openScheduleDialog());

function startOfWeek(iso){
  const d = new Date(iso+'T00:00:00');
  const day = d.getDay();
  d.setDate(d.getDate()-day);
  return toISO(d);
}

function renderPlanner(){
  const body = document.getElementById('plannerBody');
  const label = document.getElementById('plannerCurLabel');

  if(plannerMode==='day'){
    label.textContent = new Date(plannerAnchor+'T00:00:00').toLocaleDateString('en-US',{weekday:'long', month:'long', day:'numeric'});
    const items = state.schedule.filter(s=>s.date===plannerAnchor).sort((a,b)=>a.time.localeCompare(b.time));
    body.innerHTML = `<ul class="row-list" style="border-top:1px solid var(--paper-line);">` +
      (items.length ? items.map(s=>`
        <li>
          <span class="row-time">${fmtTime24to12(s.time)}</span>
          <span class="row-body">
            <span class="row-title">${s.subject}</span>
            <span class="row-sub">${s.location}</span>
          </span>
          <span class="priority-tag ${s.priority.toLowerCase()}"><span class="dot ${s.priority.toLowerCase()}"></span>${s.priority}</span>
          <span class="task-actions">
            <button class="btn-ghost" data-edit-schedule="${s.id}">${ICONS.edit}</button>
            <button class="btn-ghost" data-delete-schedule="${s.id}">${ICONS.trash}</button>
          </span>
        </li>`).join('') : '<div class="empty-note">No sessions on this day. Add one to get started.</div>')
      + `</ul>`;
  }

  else if(plannerMode==='week'){
    const start = startOfWeek(plannerAnchor);
    const days = Array.from({length:7}, (_,i)=>addDays(start,i));
    label.textContent = fmtDate(days[0],{month:'short',day:'numeric'}) + ' – ' + fmtDate(days[6],{month:'short',day:'numeric'});
    body.innerHTML = `<div class="week-grid">` + days.map(d=>{
      const items = state.schedule.filter(s=>s.date===d).sort((a,b)=>a.time.localeCompare(b.time));
      const dow = new Date(d+'T00:00:00').toLocaleDateString('en-US',{weekday:'short'});
      const dnum = new Date(d+'T00:00:00').getDate();
      return `<div class="week-day ${d===todayISO?'today':''}">
        <div class="week-day-label">${dow}<span class="n">${dnum}</span></div>
        ${items.map(s=>`<div class="week-item"><span class="t">${fmtTime24to12(s.time)}</span>${s.subject}</div>`).join('') || ''}
      </div>`;
    }).join('') + `</div>`;
  }

  else {
    const anchorDate = new Date(plannerAnchor+'T00:00:00');
    const year = anchorDate.getFullYear(), month = anchorDate.getMonth();
    label.textContent = anchorDate.toLocaleDateString('en-US',{month:'long', year:'numeric'});
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const dows = ['S','M','T','W','T','F','S'];
    let cells = dows.map(d=>`<div class="month-dow">${d}</div>`).join('');
    for(let i=0;i<startOffset;i++) cells += `<div class="month-cell blank"></div>`;
    for(let day=1; day<=daysInMonth; day++){
      const iso = year+'-'+pad(month+1)+'-'+pad(day);
      const items = state.schedule.filter(s=>s.date===iso);
      const cls = ['month-cell'];
      if(iso===todayISO) cls.push('today');
      if(iso===plannerAnchor && plannerMode==='month') cls.push('selected');
      cells += `<div class="${cls.join(' ')}" data-select-day="${iso}">
        <div class="month-cell-num">${day}</div>
        <div class="month-dots">${items.slice(0,4).map(s=>`<span class="dot ${s.priority.toLowerCase()}"></span>`).join('')}</div>
      </div>`;
    }
    body.innerHTML = `<div class="month-grid">${cells}</div>`;
  }
}

document.getElementById('plannerBody').addEventListener('click', function(e){
  const dayCell = e.target.closest('[data-select-day]');
  if(dayCell){
    plannerAnchor = dayCell.dataset.selectDay;
    plannerMode = 'day';
    document.querySelectorAll('#plannerToggle button').forEach(b=>b.classList.toggle('active', b.dataset.mode==='day'));
    renderPlanner();
    return;
  }
  const editBtn = e.target.closest('[data-edit-schedule]');
  if(editBtn){ openScheduleDialog(editBtn.dataset.editSchedule); return; }
  const delBtn = e.target.closest('[data-delete-schedule]');
  if(delBtn){
    if(confirm('Remove this study session?')){
      state.schedule = state.schedule.filter(s=>s.id!==delBtn.dataset.deleteSchedule);
      showToast('Schedule removed');
      render();
    }
  }
});

function openScheduleDialog(id){
  editingScheduleId = id || null;
  populateSubjectSelects();
  const dlg = document.getElementById('scheduleDialog');
  document.getElementById('scheduleDialogTitle').textContent = id ? 'Edit schedule' : 'Add schedule';
  if(id){
    const s = state.schedule.find(x=>x.id===id);
    document.getElementById('scheduleSubject').value = s.subject;
    document.getElementById('scheduleDate').value = s.date;
    document.getElementById('scheduleTime').value = s.time;
    document.getElementById('scheduleLocation').value = s.location;
    document.getElementById('schedulePriority').value = s.priority;
  } else {
    document.getElementById('scheduleForm').reset();
    document.getElementById('scheduleDate').value = plannerAnchor;
  }
  openDialog('scheduleDialog');
}
document.getElementById('scheduleForm').addEventListener('submit', function(e){
  e.preventDefault();
  const data = {
    subject: document.getElementById('scheduleSubject').value,
    date: document.getElementById('scheduleDate').value,
    time: document.getElementById('scheduleTime').value,
    location: document.getElementById('scheduleLocation').value,
    priority: document.getElementById('schedulePriority').value
  };
  if(editingScheduleId){
    Object.assign(state.schedule.find(s=>s.id===editingScheduleId), data);
    showToast('Schedule updated');
  } else {
    state.schedule.push({id:uid(), ...data});
    showToast('Schedule added');
  }
  closeDialog('scheduleDialog');
  render();
});

/* ---------------- Tasks ---------------- */
document.getElementById('tasksAddBtn').addEventListener('click', ()=>openTaskDialog());
document.getElementById('taskFilterBar').addEventListener('click', function(e){
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  taskFilter = chip.dataset.filter;
  document.querySelectorAll('.filter-chip').forEach(c=>c.classList.toggle('active', c===chip));
  renderTasks();
});

function renderTasks(){
  let list = state.tasks.slice();
  if(taskFilter==='pending') list = list.filter(t=>t.status==='Pending');
  else if(taskFilter==='completed') list = list.filter(t=>t.status==='Completed');
  else if(taskFilter==='high') list = list.filter(t=>t.priority==='High');
  list.sort((a,b)=> (a.status===b.status ? a.due.localeCompare(b.due) : (a.status==='Pending'?-1:1)) );

  document.getElementById('taskList').innerHTML = list.length ? list.map(t=>`
    <li class="task-row">
      <button class="checkbox ${t.status==='Completed'?'checked':''}" data-toggle-task="${t.id}">${ICONS.check}</button>
      <span class="row-body">
        <span class="row-title task-name ${t.status==='Completed'?'completed':''}">${t.name}</span>
      </span>
      <span class="task-meta">
        <span class="subject-chip">${t.subject}</span>
        <span class="priority-tag ${t.priority.toLowerCase()}"><span class="dot ${t.priority.toLowerCase()}"></span>${t.priority}</span>
        <span class="due-date">${fmtDate(t.due)}</span>
      </span>
      <span class="task-actions">
        <button class="btn-ghost" data-edit-task="${t.id}">${ICONS.edit}</button>
        <button class="btn-ghost" data-delete-task="${t.id}">${ICONS.trash}</button>
      </span>
    </li>`).join('') : '<div class="empty-note">No tasks match this filter.</div>';
}

document.getElementById('taskList').addEventListener('click', function(e){
  const editBtn = e.target.closest('[data-edit-task]');
  if(editBtn){ openTaskDialog(editBtn.dataset.editTask); return; }
  const delBtn = e.target.closest('[data-delete-task]');
  if(delBtn){
    if(confirm('Delete this task?')){
      state.tasks = state.tasks.filter(t=>t.id!==delBtn.dataset.deleteTask);
      showToast('Task deleted');
      render();
    }
  }
});

function openTaskDialog(id){
  editingTaskId = id || null;
  populateSubjectSelects();
  document.getElementById('taskDialogTitle').textContent = id ? 'Edit task' : 'Add task';
  if(id){
    const t = state.tasks.find(x=>x.id===id);
    document.getElementById('taskName').value = t.name;
    document.getElementById('taskSubject').value = t.subject;
    document.getElementById('taskDue').value = t.due;
    document.getElementById('taskPriority').value = t.priority;
  } else {
    document.getElementById('taskForm').reset();
    document.getElementById('taskDue').value = todayISO;
  }
  openDialog('taskDialog');
}
document.getElementById('taskForm').addEventListener('submit', function(e){
  e.preventDefault();
  const data = {
    name: document.getElementById('taskName').value.trim(),
    subject: document.getElementById('taskSubject').value,
    due: document.getElementById('taskDue').value,
    priority: document.getElementById('taskPriority').value
  };
  if(editingTaskId){
    Object.assign(state.tasks.find(t=>t.id===editingTaskId), data);
    showToast('Task updated');
  } else {
    state.tasks.push({id:uid(), status:'Pending', ...data});
    showToast('Task added');
  }
  closeDialog('taskDialog');
  render();
});

/* ---------------- Subjects ---------------- */
document.getElementById('subjectsAddBtn').addEventListener('click', ()=>openDialog('subjectDialog'));
document.getElementById('subjectForm').addEventListener('submit', function(e){
  e.preventDefault();
  state.subjects.push({
    id:uid(),
    name: document.getElementById('subjectName').value.trim(),
    instructor: document.getElementById('subjectInstructor').value.trim(),
    schedule: document.getElementById('subjectSchedule').value.trim(),
    progress: 0
  });
  document.getElementById('subjectForm').reset();
  closeDialog('subjectDialog');
  showToast('Subject added');
  render();
});

function renderSubjects(){
  document.getElementById('subjectList').innerHTML = state.subjects.map(s=>`
    <div class="subject-row">
      <div class="subject-top">
        <div>
          <div class="subject-name">${s.name}</div>
          <div class="subject-instructor">${s.instructor}</div>
          <div class="subject-schedule">${s.schedule}</div>
        </div>
        <div style="text-align:right;min-width:120px;">
          <div class="progress-track" style="width:120px;"><div class="progress-fill sage" style="width:${s.progress}%;"></div></div>
          <div class="progress-label">${s.progress}% studied</div>
        </div>
      </div>
    </div>`).join('');
}

/* ---------------- Goals ---------------- */
document.getElementById('goalsAddBtn').addEventListener('click', ()=>openGoalDialog());
function openGoalDialog(id){
  editingGoalId = id || null;
  document.getElementById('goalDialogTitle').textContent = id ? 'Edit goal' : 'Add goal';
  if(id){
    const g = state.goals.find(x=>x.id===id);
    document.getElementById('goalName').value = g.name;
    document.getElementById('goalTarget').value = g.target;
  } else {
    document.getElementById('goalForm').reset();
  }
  openDialog('goalDialog');
}
document.getElementById('goalForm').addEventListener('submit', function(e){
  e.preventDefault();
  const data = {
    name: document.getElementById('goalName').value.trim(),
    target: document.getElementById('goalTarget').value
  };
  if(editingGoalId){
    Object.assign(state.goals.find(g=>g.id===editingGoalId), data);
    showToast('Goal updated');
  } else {
    state.goals.push({id:uid(), progress:0, completed:false, ...data});
    showToast('Goal added');
  }
  closeDialog('goalDialog');
  render();
});

function renderGoals(){
  const active = state.goals.filter(g=>!g.completed);
  const done = state.goals.filter(g=>g.completed);

  document.getElementById('goalList').innerHTML = active.length ? active.map(g=>`
    <div class="goal-row">
      <div class="goal-top">
        <span class="goal-name">${g.name}</span>
        <span class="goal-target">Target: ${fmtDate(g.target)}</span>
      </div>
      <div class="progress-track"><div class="progress-fill" style="width:${g.progress}%;"></div></div>
      <div class="goal-controls">
        <button data-goal-adjust="${g.id}" data-delta="-10">−</button>
        <span style="font-size:13px;font-weight:600;min-width:36px;text-align:center;">${g.progress}%</span>
        <button data-goal-adjust="${g.id}" data-delta="10">+</button>
        <button class="btn-ghost" data-edit-goal="${g.id}" style="margin-left:6px;">${ICONS.edit}</button>
        <button class="btn-ghost" data-delete-goal="${g.id}">${ICONS.trash}</button>
      </div>
    </div>`).join('') : '<div class="empty-note">No goals in progress. Add one to start tracking.</div>';

  document.getElementById('completedGoalList').innerHTML = done.length ? done.map(g=>`
    <div class="completed-goal-item">
      <span class="checkbox checked" style="pointer-events:none;">${ICONS.check}</span>
      <span class="goal-name completed">${g.name}</span>
      <span style="margin-left:auto;color:var(--text-muted);font-size:12.5px;">${fmtDate(g.target)}</span>
    </div>`).join('') : '<div class="empty-note">No completed goals yet.</div>';
}

document.body.addEventListener('click', function(e){
  const adj = e.target.closest('[data-goal-adjust]');
  if(adj){
    const g = state.goals.find(x=>x.id===adj.dataset.goalAdjust);
    if(g){
      g.progress = Math.min(100, Math.max(0, g.progress + Number(adj.dataset.delta)));
      if(g.progress===100) g.completed = true;
      render();
    }
    return;
  }
  const editG = e.target.closest('[data-edit-goal]');
  if(editG){ openGoalDialog(editG.dataset.editGoal); return; }
  const delG = e.target.closest('[data-delete-goal]');
  if(delG){
    if(confirm('Delete this goal?')){
      state.goals = state.goals.filter(g=>g.id!==delG.dataset.deleteGoal);
      showToast('Goal deleted');
      render();
    }
  }
});

/* ---------------- Reminders ---------------- */
function renderReminders(){
  const assignmentReminders = state.tasks.filter(t=>t.status==='Pending' && daysBetween(todayISO,t.due)<=3 && daysBetween(todayISO,t.due)>=0)
    .sort((a,b)=>a.due.localeCompare(b.due));
  const examReminders = state.exams.filter(e=>daysBetween(todayISO,e.date)<=7 && daysBetween(todayISO,e.date)>=0)
    .sort((a,b)=>a.date.localeCompare(b.date));
  const sessionReminders = state.schedule.filter(s=>s.date===todayISO).sort((a,b)=>a.time.localeCompare(b.time));

  function group(title, items, renderItem){
    return `<div class="reminder-group">
      <div class="reminder-group-title">${title}</div>
      ${items.length ? items.map(renderItem).join('') : '<div class="empty-note">Nothing here right now.</div>'}
    </div>`;
  }

  document.getElementById('reminderBody').innerHTML =
    group('Assignment reminders', assignmentReminders, t => {
      const d = daysBetween(todayISO,t.due);
      return `<div class="reminder-item ${d<=1?'due-soon':''}">
        <span class="dot ${t.priority.toLowerCase()}" style="margin-top:5px;"></span>
        <div>
          <div class="reminder-text">${t.name} — ${t.subject}</div>
          <div class="reminder-when">Due ${d===0?'today':d===1?'tomorrow':'in '+d+' days'} (${fmtDate(t.due)})</div>
        </div>
      </div>`;
    }) +
    group('Exam reminders', examReminders, e => {
      const d = daysBetween(todayISO,e.date);
      return `<div class="reminder-item due-soon">
        <span class="dot high" style="margin-top:5px;"></span>
        <div>
          <div class="reminder-text">${e.subject} exam — ${e.location}</div>
          <div class="reminder-when">${d===0?'Today':d===1?'Tomorrow':'In '+d+' days'} at ${e.time}</div>
        </div>
      </div>`;
    }) +
    group('Study-session reminders', sessionReminders, s => `
      <div class="reminder-item">
        <span class="dot ${s.priority.toLowerCase()}" style="margin-top:5px;"></span>
        <div>
          <div class="reminder-text">${s.subject} — ${s.location}</div>
          <div class="reminder-when">Today at ${fmtTime24to12(s.time)}</div>
        </div>
      </div>`);
}

/* ---------------- Profile ---------------- */
let profileEditing = false;
document.getElementById('editProfileBtn').addEventListener('click', function(){
  profileEditing = !profileEditing;
  this.textContent = profileEditing ? 'Save profile' : 'Edit profile';
  if(!profileEditing) saveProfileEdits();
  renderProfile();
});
document.getElementById('logoutBtn').addEventListener('click', function(){
  document.getElementById('app').classList.remove('active');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginForm').reset();
  showToast('Logged out');
});

function saveProfileEdits(){
  const nameInput = document.getElementById('pfName');
  const idInput = document.getElementById('pfId');
  const courseInput = document.getElementById('pfCourse');
  const yearInput = document.getElementById('pfYear');
  if(nameInput) state.student.name = nameInput.value.trim() || state.student.name;
  if(idInput) state.student.id = idInput.value.trim() || state.student.id;
  if(courseInput) state.student.course = courseInput.value.trim() || state.student.course;
  if(yearInput) state.student.year = yearInput.value.trim() || state.student.year;
  state.student.initials = state.student.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
  showToast('Profile saved');
}

function renderProfile(){
  const s = state.student;
  document.getElementById('profileAvatar').textContent = s.initials;
  document.getElementById('profileName').textContent = s.name;
  document.getElementById('profileCourseLine').textContent = `${s.course} • ${s.year}`;
  document.getElementById('sidebarAvatar').textContent = s.initials;
  document.getElementById('sidebarName').textContent = s.name;
  document.getElementById('brandSub').textContent = s.course;

  const fields = [
    {label:'Student name', key:'name', id:'pfName'},
    {label:'Student ID', key:'id', id:'pfId'},
    {label:'Course', key:'course', id:'pfCourse'},
    {label:'Year', key:'year', id:'pfYear'}
  ];
  document.getElementById('profileFields').innerHTML = fields.map(f=>`
    <div class="profile-field">
      <span class="profile-field-label">${f.label}</span>
      ${profileEditing
        ? `<input id="${f.id}" type="text" value="${s[f.key]}">`
        : `<span class="profile-field-value">${s[f.key]}</span>`}
    </div>`).join('');
}

/* ---------------- Render dispatcher ---------------- */
function render(){
  populateSubjectSelects();
  if(currentView==='dashboard') renderDashboard();
  else if(currentView==='planner') renderPlanner();
  else if(currentView==='tasks') renderTasks();
  else if(currentView==='subjects') renderSubjects();
  else if(currentView==='goals') renderGoals();
  else if(currentView==='reminders') renderReminders();
  else if(currentView==='profile') renderProfile();
  buildNav();
}

buildNav();
populateSubjectSelects();

})();