// Все данные — примерные (прототип).
const U = id => `https://images.unsplash.com/${id}?w=600&h=750&fit=crop&q=70`;
const MASTERS = [
  {id:'elena',name:'Елена Соколова',spec:'Классический и лечебный массаж',exp:12,rating:4.9,reviews:184,from:2500,phone:'+7 (900) 000-00-01',img:U('photo-1544005313-94ddf0286df2'),featured:true},
  {id:'dmitry',name:'Дмитрий Орлов',spec:'Спортивный массаж',exp:9,rating:4.9,reviews:132,from:3000,phone:'+7 (900) 000-00-02',img:U('photo-1500648767791-00dcc994a43e')},
  {id:'anna',name:'Анна Белова',spec:'Релакс и аромамассаж',exp:7,rating:4.8,reviews:96,from:2800,phone:'+7 (900) 000-00-03',img:U('photo-1494790108377-be9c29b29330')},
  {id:'sergey',name:'Сергей Ветров',spec:'Массаж спины и шейно-воротниковой зоны',exp:15,rating:5.0,reviews:211,from:2200,phone:'+7 (900) 000-00-04',img:U('photo-1507003211169-0a1dd7228f2d')},
  {id:'olga',name:'Ольга Миронова',spec:'Антицеллюлитный и лимфодренажный',exp:8,rating:4.8,reviews:77,from:3200,phone:'+7 (900) 000-00-05',img:U('photo-1438761681033-6461ffad8d80')},
  {id:'maria',name:'Мария Лебедева',spec:'Массаж лица и стоун-терапия',exp:6,rating:4.9,reviews:64,from:2700,phone:'+7 (900) 000-00-06',img:U('photo-1534528741775-53994a69daeb')},
];
const SERVICES = [
  ['Классический массаж','60 минут, всё тело',3500],
  ['Массаж спины','40 минут',2200],
  ['Шейно-воротниковая зона','30 минут',1800],
  ['Спортивный массаж','60 минут',3800],
  ['Релакс-массаж с маслами','90 минут',4500],
  ['Лимфодренажный массаж','60 минут',3600],
  ['Стоун-терапия','75 минут',4800],
  ['Массаж лица','40 минут',2700],
];
const ROMAN=['I','II','III','IV','V','VI','VII','VIII','IX','X'];
const SLOTS=['10:00','11:30','13:00','14:30','16:00','17:30','19:00'];
const tel = p => 'tel:+'+p.replace(/\D/g,'');
const rub = n => n.toLocaleString('ru-RU')+' ₽';
const $ = s => document.querySelector(s);

$('#masterGrid').innerHTML = MASTERS.map(m=>`
<article class="card master corners reveal">
  ${m.featured?'<div class="seal" title="Мастер года">Мастер<br>года</div>':''}
  <div class="arch"><img src="${m.img}" alt="Массажист ${m.name}" loading="lazy" width="600" height="750"></div>
  <p class="spec">${m.spec}</p>
  <h3>${m.name}</h3>
  <ul class="meta"><li>Стаж ${m.exp} лет</li><li><span class="stars" aria-hidden="true">★</span> ${m.rating.toFixed(1).replace('.',',')} <span>(${m.reviews} отзывов)</span></li></ul>
  <p class="price"><small>от</small> ${rub(m.from)}</p>
  <a class="phone" href="${tel(m.phone)}" aria-label="Позвонить: ${m.phone}">${m.phone}</a>
  <div class="actions"><button class="btn btn-brass" data-master="${m.id}">Записаться</button></div>
</article>`).join('');

$('#priceList').innerHTML = SERVICES.map((s,i)=>`<li class="reveal"><span class="num">${ROMAN[i]}.</span><span><span class="n">${s[0]}</span><span class="d">${s[1]}</span></span><span class="dots"></span><span class="p">${rub(s[2])}</span></li>`).join('');

// form options
$('#fService').innerHTML = SERVICES.map(s=>`<option>${s[0]} — ${rub(s[2])}</option>`).join('');
$('#fMaster').innerHTML = '<option value="">Любой свободный мастер</option>'+MASTERS.map(m=>`<option value="${m.id}">${m.name}</option>`).join('');
const d=$('#fDate'), today=new Date(); const iso=x=>x.toISOString().slice(0,10);
d.min=iso(today); d.value=iso(new Date(today.getTime()+864e5));
let slot=null;
function renderSlots(){ // пример «занятых» слотов — в бою брать из API/YCLIENTS
  const seed=(d.value+$('#fMaster').value).split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  slot=null;
  $('#slotBox').innerHTML=SLOTS.map((t,i)=>`<button type="button" class="slot" aria-pressed="false" ${(seed+i)%4===0?'disabled':''}>${t}</button>`).join('');
}
$('#slotBox').addEventListener('click',e=>{const b=e.target.closest('.slot');if(!b||b.disabled)return;
  document.querySelectorAll('.slot').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');slot=b.textContent;});
d.addEventListener('change',renderSlots);$('#fMaster').addEventListener('change',renderSlots);renderSlots();

$('#bookForm').addEventListener('submit',async e=>{
  e.preventDefault();const f=e.target,data=Object.fromEntries(new FormData(f));const err=$('#formErr');
  if(!slot) return err.textContent='Выберите время приёма.';
  if(!data.name.trim()) return err.textContent='Укажите имя.';
  if(data.phone.replace(/\D/g,'').length<10) return err.textContent='Проверьте номер телефона.';
  err.textContent='';data.time=slot;
  // TODO: подключить отправку заявки. Варианты:
  //  1) Telegram: fetch(`https://api.telegram.org/bot<TOKEN>/sendMessage`, {method:'POST', ...}) —
  //     токен НЕ хранить во фронтенде, проксировать через свой серверлесс (Cloudflare Worker / Vercel Function).
  //  2) Email: Formspree / EmailJS / свой PHP-скрипт.
  //  3) CRM/онлайн-запись: YCLIENTS API.
  // await fetch('/api/booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const m=MASTERS.find(x=>x.id===data.master);
  const date=new Date(data.date).toLocaleDateString('ru-RU',{day:'numeric',month:'long',weekday:'long'});
  $('#doneText').textContent=`${data.name}, вы записаны на «${data.service.split(' — ')[0]}» ${m?'к мастеру '+m.name:''} — ${date}, ${slot}. Администратор перезвонит на ${data.phone} для подтверждения.`;
  f.hidden=true;$('#bookDone').hidden=false;$('#bookDone').focus();
});
$('#again').onclick=()=>{$('#bookForm').reset();d.value=iso(new Date(today.getTime()+864e5));renderSlots();$('#bookForm').hidden=false;$('#bookDone').hidden=true;};

// modal per master
const modal=$('#modal');let lastFocus;
document.addEventListener('click',e=>{const b=e.target.closest('[data-master]');if(!b)return;
  const m=MASTERS.find(x=>x.id===b.dataset.master);lastFocus=b;
  $('#mTitle').textContent=m.name;$('#mText').textContent=`${m.spec}. Стаж ${m.exp} лет, приём от ${rub(m.from)}. Выберите время онлайн или позвоните напрямую.`;
  $('#mTel').href=tel(m.phone);$('#mTel').textContent=m.phone;$('#fMaster').value=m.id;renderSlots();
  modal.hidden=false;modal.querySelector('.close').focus();});
const closeM=()=>{modal.hidden=true;lastFocus&&lastFocus.focus();};
modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('.close'))closeM();});
$('#mGo').addEventListener('click',()=>{modal.hidden=true;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeM();});

// burger
const burger=$('.burger'),menu=$('#menu');
burger.onclick=()=>{const o=burger.getAttribute('aria-expanded')!=='true';burger.setAttribute('aria-expanded',o);menu.classList.toggle('open',o);burger.setAttribute('aria-label',o?'Закрыть меню':'Открыть меню');};
menu.addEventListener('click',e=>{if(e.target.closest('a')){burger.setAttribute('aria-expanded','false');menu.classList.remove('open');}});

// reveal
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
