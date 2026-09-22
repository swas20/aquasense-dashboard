<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>AQUASENSE IRRIGATION CONTROL - GITHUB</title>
<script src="https://unpkg.com/mqtt/dist/mqtt.min.js"></script>
<style>
:root{--bg:#070b14;--p:#101828;--c:#121d33;--b:#1e2f52;--a:#00e5b0;--bl:#3b82f6;--r:#ef4444;--y:#f59e0b;--g:#22c55e;--t:#e6edf7;--m:#8a9bb5}
*{box-sizing:border-box;margin:0;padding:0}body{background:var(--bg);color:var(--t);font-family:monospace;min-height:100vh}
header{padding:12px 16px;background:var(--p);border-bottom:1px solid var(--b);display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.logo{color:var(--a);font-weight:900;letter-spacing:2px}
.dot{width:9px;height:9px;border-radius:50%;display:inline-block}.online{background:var(--g);box-shadow:0 0 8px var(--g)}.offline{background:#555}
.badge{padding:4px 10px;border-radius:20px;font-size:.65rem;font-weight:800}.open{background:rgba(0,229,176,.15);color:var(--a);border:1px solid var(--a)}.closed{background:rgba(239,68,68,.15);color:var(--r);border:1px solid var(--r)}.onl{background:rgba(34,197,94,.2);color:var(--g);border:1px solid var(--g)}.offl{background:rgba(100,100,100,.2);color:#aaa;border:1px solid #666}
.btn{border:0;border-radius:8px;padding:10px 14px;font-weight:800;cursor:pointer;font-family:monospace}.btn-bl{background:var(--bl);color:#fff}.btn-a{background:var(--a);color:#000}.btn-r{background:transparent;color:var(--r);border:1px solid var(--r)}.btn-y{background:var(--y);color:#000}
input,select{background:var(--bg);border:1px solid var(--b);color:#fff;padding:8px 10px;border-radius:8px;width:100%}
.home{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;background:radial-gradient(circle at 20% 30%,#0f1e38,#070b14)}
.cardBox{background:var(--c);border:1.5px solid var(--b);border-radius:16px;padding:22px;width:360px;max-width:95vw;text-align:center;box-shadow:0 0 30px rgba(0,229,176,.15)}
.top{display:grid;grid-template-columns:380px 1fr;gap:12px;padding:12px;max-width:1400px;margin:auto}@media(max-width:900px){.top{grid-template-columns:1fr}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:12px;padding:12px;max-width:1400px;margin:auto}
.card{background:var(--c);border:1px solid var(--b);border-radius:14px;padding:14px}.mon{border:2px solid var(--bl)}.zone{border:1.5px solid var(--b)}.zone.active{border-color:var(--a);box-shadow:0 0 20px rgba(0,229,176,.2)}
.row{display:flex;justify-content:space-between;font-size:.75rem;margin:6px 0}
.flow{font-size:2.6rem;font-weight:900;text-align:center;margin:10px 0;color:var(--a)}
.sum{background:linear-gradient(180deg,var(--c),var(--p));border:1px solid var(--b);border-radius:12px;padding:14px}.sum-l{font-size:.55rem;color:var(--m);letter-spacing:1px}.sum-v{font-size:1.5rem;font-weight:800;margin-top:4px}
#dash{display:none}#loginBox{position:fixed;inset:0;background:#070b14f5;z-index:99;display:none;place-items:center}.box{background:var(--p);border:1px solid var(--b);border-radius:14px;padding:22px;width:400px;max-width:95vw}
</style>
</head>
<body>

<!-- HOME -->
<div id=home class=home>
  <div style="background:var(--p);border:2px solid var(--a);border-radius:16px;padding:18px 28px;margin-bottom:24px;box-shadow:0 0 40px rgba(0,229,176,.25)"><h1 style="color:var(--a);letter-spacing:3px">AQUASENSE IRRIGATION</h1><div style="font-size:.7rem;color:var(--m);text-align:center;margin-top:6px">GitHub Pages + Render + ESP32 Master LoRa - REAL DATA</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:740px;width:100%">
    <div class=cardBox style="border-color:var(--bl)"><h3 style="color:var(--bl)">ADMIN</h3><p style="font-size:.6rem;color:var(--m);margin:8px 0">Sees ALL irrigation zones + Master</p><button class="btn btn-bl" style="width:100%" onclick="openLogin('admin')">ADMIN LOGIN</button><div style="font-size:.55rem;color:var(--m);margin-top:8px">aquasense / distribution2026</div></div>
    <div class=cardBox style="border-color:var(--a)"><h3 style="color:var(--a)">FARMER / CUSTOMER</h3><p style="font-size:.6rem;color:var(--m);margin:8px 0">Sees ONLY own zone + Pay</p><button class="btn btn-a" style="width:100%" onclick="openLogin('customer')">FARMER LOGIN</button><button class="btn btn-y" style="width:100%;margin-top:8px" onclick="showReg()">REGISTER ZONE</button></div>
  </div>
  <div style="margin-top:18px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
    <input id=cfgIp placeholder="Master ESP32 IP e.g. 192.168.1.100 (optional for local)" style="width:220px">
    <input id=cfgTopic value="aquasense/moses_kaaga_9x7p2" style="width:220px">
  </div>
  <div style="font-size:.6rem;color:var(--m);margin-top:12px">Deploy: Upload to GitHub → Settings → Pages → Deploy from main branch → index.html</div>
</div>

<!-- DASHBOARD -->
<div id=dash>
<header>
  <div style="display:flex;gap:12px;align-items:center"><div class=logo>IRRIGATION CONTROL - REAL MASTER</div><span id=live style="font-size:.7rem;color:var(--y)"></span></div>
  <div style="display:flex;gap:6px"><span id=dashTitle style="font-size:.7rem;color:var(--m)"></span><button class="btn btn-bl" style="padding:6px 10px" onclick="connectAll()">CONNECT</button><button class="btn btn-r" style="padding:6px 10px" onclick="logout()">LOGOUT</button></div>
</header>
<div id=top class=top></div>
<div id=grid class=grid></div>
</div>

<!-- LOGIN -->
<div id=loginBox><div class=box><h3 id=loginTitle style="color:var(--a)">LOGIN</h3><input id=uid placeholder="ID / username" style="margin-top:10px"><input id=pwd type=password placeholder="PIN / password" style="margin-top:8px"><button onclick="doLogin()" style="width:100%;margin-top:12px;background:var(--a);color:#000;border:0;border-radius:8px;padding:10px;font-weight:800">LOGIN</button><button onclick="$('loginBox').style.display='none'" style="width:100%;margin-top:8px;background:transparent;border:1px solid var(--r);color:var(--r);border-radius:8px;padding:8px">CANCEL</button><div id=msg style="color:var(--r);font-size:.7rem;margin-top:8px"></div></div></div>

<script>
let $=s=>document.getElementById(s);
let S={nodes:[],summary:{mon:0,cust:0,diff:0,perc:0},base:'aquasense/moses_kaaga_9x7p2',cli:null,role:null,cur:null,ip:'',lastSync:0,timer:null};
let REG=JSON.parse(localStorage.getItem('AQUA_IRRI_REG')||'[]');
if(REG.length==0){ REG=[{id:'0',name:'Master Monitor',pin:'0000',registered:true},{id:'1',name:'Zone 1 - Farm A',pin:'1234',registered:true},{id:'2',name:'Zone 2 - Farm B',pin:'2345',registered:true},{id:'3',name:'Zone 3 - Farm C',pin:'3456',registered:true}]; localStorage.setItem('AQUA_IRRI_REG',JSON.stringify(REG)); }
function saveReg(){localStorage.setItem('AQUA_IRRI_REG',JSON.stringify(REG));}
function isOnline(id){let n=S.nodes.find(x=>x.id==String(id)); return n && (Date.now()-n.lastSeen<65000); }
function getNode(id){return S.nodes.find(x=>x.id==String(id));}

function mergeMaster(data){
  if(!data||!data.nodes) return;
  if(data.summary) S.summary=data.summary;
  data.nodes.forEach(o=>{
    let id=String(o.id);
    let idx=S.nodes.findIndex(x=>x.id==id);
    let obj={id:id,flow:Number(o.flow)||0,total:Number(o.total)||0,moist:Number(o.moist||o.moisture||0),valve:o.valve||"UNKNOWN",rssi:Number(o.rssi)||0,paid:Number(o.paid)||0,usedCost:Number(o.usedCost)||0,remaining:Number(o.remaining)||0,lastSeen:Date.now()};
    // Support your master that sends "moisture" as total or flow
    if(idx>=0) S.nodes[idx]={...S.nodes[idx],...obj}; else S.nodes.push(obj);
  });
  S.lastSync=Date.now();
}

function openLogin(r){S.curRole=r; $('loginBox').style.display='grid'; $('loginTitle').textContent=r=='admin'?'ADMIN - ALL ZONES':'FARMER - OWN ZONE ONLY'; $('uid').value=''; $('pwd').value=''; $('msg').textContent='';}
function showReg(){let ids=[...new Set([...REG.map(r=>r.id),...S.nodes.map(n=>n.id)])].filter(id=>id!='0').sort(); let name=prompt("Zone Name e.g. Farm A - Zone 1"); let id=prompt("Zone ID (must match LoRa ID e.g. 1,2,3):", ids.length?Math.max(...ids.map(Number))+1:1); let pin=prompt("Set PIN:","1234"); if(name&&id&&pin){REG.push({id:String(id),name, pin, registered:true}); saveReg(); alert("Registered ID "+id); render();}}

function render(){
  let mon=getNode('0'); let zones=S.nodes.filter(n=>n.id!='0');
  let monT=S.summary.mon|| (mon?mon.total:0); let custT=S.summary.cust|| zones.reduce((a,b)=>a+b.total,0);
  let diff=S.summary.diff!=null?S.summary.diff:monT-custT; let perc=S.summary.perc!=null?S.summary.perc: (monT?diff/monT*100:0);
  let online=S.nodes.filter(n=>isOnline(n.id)).length;
  $('live').innerHTML=`<span class="dot ${isOnline('0')?'online':'offline'}"></span> ${online}/${S.nodes.length} ONLINE | LAST SYNC: ${S.lastSync?new Date(S.lastSync).toLocaleTimeString():'WAITING MASTER'}`;

  if(S.role=='admin'){
    $('dashTitle').textContent=`ADMIN - ALL ZONES - REAL`;
    $('top').innerHTML=`
    <div class="card mon"><div class=row><span>MONITOR ID 0 - MASTER LORA</span><span class="badge ${isOnline('0')?'onl':'offl'}">${isOnline('0')?'ONLINE':'OFFLINE'}</span></div><div class=flow style="color:var(--bl)">${mon?mon.flow.toFixed(2):'0.00'} L/min</div><div class=row><span>Total Real:</span><b>${mon?mon.total:monT} L</b></div><div class=row><span>Valve:</span><b class="badge ${mon&&mon.valve.includes('OPEN')?'open':'closed'}">${mon?mon.valve:'UNKNOWN'}</b></div><div class=row><span>RSSI:</span><b>${mon?mon.rssi:'--'} dBm</b></div><div style="display:flex;gap:6px;margin-top:10px"><button class="btn btn-a" style="flex:1" onclick="cmd('0','open')">OPEN MAIN</button><button class="btn btn-r" style="flex:1" onclick="cmd('0','close')">CLOSE MAIN</button></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class=sum><div class=sum-l>MONITOR TOTAL</div><div class=sum-v style="color:var(--bl)">${monT} L</div></div><div class=sum><div class=sum-l>ZONES TOTAL</div><div class=sum-v style="color:var(--a)">${custT} L</div></div><div class=sum><div class=sum-l>DIFF / LEAK</div><div class=sum-v style="color:var(--r)">${diff.toFixed(1)} L</div></div><div class=sum><div class=sum-l>% LOSS</div><div class=sum-v style="color:var(--y)">${perc.toFixed(1)}%</div></div></div>`;

    let allIds=[...new Set([...REG.map(r=>r.id),...S.nodes.map(n=>n.id)])].filter(id=>id!='0').sort((a,b)=>Number(a)-Number(b));
    $('grid').innerHTML=allIds.map(id=>{
      let reg=REG.find(r=>r.id==id)||{name:'Zone '+id}; let n=getNode(id);
      if(!n) return `<div class=card style="border:1px dashed var(--y)"><b>Zone ${id} - ${reg.name}</b><div style="text-align:center;color:var(--y);padding:20px">⏳ Waiting Real LoRa<br><span style="font-size:.6rem">Master must receive "${id}:flow/total" e.g. "${id}:2.3/120"</span></div></div>`;
      return zoneCard(n,reg,false);
    }).join('');
  }
  else if(S.role=='customer'){
    let reg=REG.find(r=>r.id==S.cur); let n=getNode(S.cur);
    $('dashTitle').textContent=`FARMER ZONE ${S.cur} - REAL`;
    if(!n){
      $('top').innerHTML=`<div class="card zone active" style="grid-column:1/-1;text-align:center;padding:30px"><div style="color:var(--y)">⏳ Waiting Real Data for Your Zone ${S.cur}</div><div style="font-size:.7rem;color:var(--m);margin-top:8px">Master must receive LoRa: "${S.cur}:flow/moisture" and publish to ${S.base}/live</div></div>`;
      $('grid').innerHTML=zoneCard({id:S.cur,flow:0,total:0,moist:0,valve:'UNKNOWN',rssi:0,paid:0,remaining:0,lastSeen:0}, reg, true);
      return;
    }
    $('top').innerHTML=`
    <div class="card zone active"><div class=row><span>MY ZONE ${n.id} - ${reg.name} - REAL LIKE MONITOR</span><span class="dot ${isOnline(n.id)?'online':'offline'}"></span></div><div class=flow>${n.flow.toFixed(2)} L/min</div><div class=row><span>Soil Moist:</span><b>${n.moist||0}%</b></div><div class=row><span>Total Water:</span><b>${n.total} L</b></div><div class=row><span>Valve Real:</span><b class="badge ${n.valve.includes('OPEN')?'open':'closed'}">${n.valve}</b></div><div class=row><span>Paid/Rem:</span><b>${n.paid}/${n.remaining.toFixed(0)} Ksh</b></div><div style="display:flex;gap:6px;margin-top:10px"><button class="btn btn-a" style="flex:1" onclick="cmd('${n.id}','open')">OPEN MY ZONE</button><button class="btn btn-r" style="flex:1" onclick="cmd('${n.id}','close')">CLOSE</button></div></div>
    <div class=sum><div class=sum-l>MY ZONE STATUS</div><div class=sum-v>${n.valve}</div><div style="font-size:.7rem;margin-top:6px">Soil: ${n.moist||0}% | RSSI: ${n.rssi} dBm<br>Remaining: ${(n.remaining/0.1).toFixed(0)}L</div></div>`;
    $('grid').innerHTML=zoneCard(n,reg,true);
  }
}

function zoneCard(n,reg,isOwner){
  let online=isOnline(n.id);
  let pay = isOwner? `<div style="margin-top:10px;border-top:2px dashed var(--a);padding:10px;background:rgba(0,229,176,.07);border-radius:10px"><div style="font-size:.7rem;color:var(--a);font-weight:800">💰 PAY & AUTO IRRIGATE - FARMER ONLY</div><div style="display:flex;gap:6px;margin-top:8px"><input id=am${n.id} type=number placeholder="Ksh 100=1M³"><button class="btn btn-a" onclick="payZone('${n.id}')">PAY & OPEN</button></div><div id=mp${n.id} style="font-size:.7rem;text-align:center;margin-top:6px"></div><div style="margin-top:8px;display:flex;gap:6px"><input id=timer${n.id} type=number placeholder="Timer mins e.g. 30"><button class="btn btn-y" onclick="timerIrrigate('${n.id}')">TIMER IRRIGATE</button></div></div>`:'';
  return `<div class="card zone ${online?'active':''}"><div class=row><b>Zone ${n.id} - ${reg?reg.name:''}</b><span class="badge ${online?'onl':'offl'}">${online?'ONLINE':'OFFLINE'} ${n.rssi}dBm</span></div><div style="font-size:2rem;text-align:center;color:var(--a);margin:8px 0">${n.flow.toFixed(2)} L/min | Soil ${n.moist||0}%</div><div class=row><span>Water Used:</span><b>${n.total} L</b></div><div class=row><span>Valve:</span><b class="badge ${n.valve.includes('OPEN')?'open':'closed'}">${n.valve}</b></div><div style="display:flex;gap:6px;margin-top:8px"><button class="btn btn-a" style="flex:1" onclick="cmd('${n.id}','open')">OPEN ZONE</button><button class="btn btn-r" style="flex:1" onclick="cmd('${n.id}','close')">CLOSE</button><button class="btn btn-y" style="flex:1" onclick="cmd('${n.id}','auto')">AUTO</button></div>${pay}</div>`;
}

function cmd(id,action){
  let p=JSON.stringify({node:String(id),action:action});
  if(S.cli&&S.cli.connected) S.cli.publish(S.base+'/cmd',p);
  if(S.ip) fetch(`http://${S.ip}/valve?node=${id}&action=${action}`,{mode:'no-cors'}).catch(()=>{});
  console.log("IRRIGATION CMD:",p);
}
function payZone(id){
  let amt=Number($('am'+id).value); if(!amt) return;
  let p=JSON.stringify({node:String(id),amount:amt});
  if(S.cli&&S.cli.connected) S.cli.publish(S.base+'/cmd',p);
  if(S.ip) fetch(`http://${S.ip}/pay?node=${id}&amount=${amt}`,{mode:'no-cors'}).catch(()=>{});
  $('mp'+id).textContent='✅ '+amt+'Ksh sent - Master will open zone '+id;
}
function timerIrrigate(id){
  let mins=Number($('timer'+id).value); if(!mins) return;
  cmd(id,'open');
  $('mp'+id).textContent=`⏱ Irrigating ${mins} mins...`;
  setTimeout(()=>{cmd(id,'close'); $('mp'+id).textContent=`✅ Timer done - Zone ${id} closed`;}, mins*60*1000);
}

function connectAll(){
  S.base=$('cfgTopic').value.trim()||'aquasense/moses_kaaga_9x7p2'; S.ip=$('cfgIp').value.trim().replace(/\/$/,'');
  localStorage.setItem('AQUA_BASE',S.base); localStorage.setItem('AQUA_IP',S.ip);
  if(S.timer) clearInterval(S.timer);
  if(S.ip){
    let poll=()=>{fetch(`${S.ip}/data`,{cache:'no-store'}).then(r=>r.json()).then(d=>{console.log("REAL /data:",d); mergeMaster(d); render();}).catch(()=>{});};
    poll(); S.timer=setInterval(poll,2500);
  }
  try{
    if(S.cli) S.cli.end();
    S.cli=mqtt.connect('wss://broker.hivemq.com:8884/mqtt',{clientId:'irri_'+Math.random().toString(16).slice(2)});
    S.cli.on('connect',()=>{S.cli.subscribe(S.base+'/live'); S.cli.subscribe(S.base+'/#'); console.log("MQTT connected to",S.base+'/live');});
    S.cli.on('message',(t,m)=>{try{let d=JSON.parse(m.toString()); console.log("REAL MQTT:",d); mergeMaster(d); render();}catch(e){}});
  }catch(e){}
}

function doLogin(){
  let u=$('uid').value.trim().toLowerCase(), p=$('pwd').value.trim().toLowerCase();
  if(S.curRole=='admin' && u=='aquasense' && p=='distribution2026'){
    S.role='admin'; $('loginBox').style.display='none'; $('home').style.display='none'; $('dash').style.display='block'; S.base=$('cfgTopic').value; S.ip=$('cfgIp').value; render(); connectAll(); setInterval(()=>{if(S.role) render();},3000);
  }else if(S.curRole=='customer'){
    let f=REG.find(x=>x.id==u && x.pin==p && x.registered);
    if(f){S.role='customer'; S.cur=u; $('loginBox').style.display='none'; $('home').style.display='none'; $('dash').style.display='block'; S.base=$('cfgTopic').value; S.ip=$('cfgIp').value; render(); connectAll(); setInterval(()=>{if(S.role) render();},3000);}
    else {$('msg').textContent='Wrong ID/PIN - Register first';}
  }else {$('msg').textContent='Wrong credentials';}
}
function logout(){ $('dash').style.display='none'; $('home').style.display='flex'; S.role=null; if(S.timer) clearInterval(S.timer); if(S.cli) S.cli.end(); S.nodes=[]; S.lastSync=0; }

(function(){ $('cfgTopic').value=localStorage.getItem('AQUA_BASE')||'aquasense/moses_kaaga_9x7p2'; $('cfgIp').value=localStorage.getItem('AQUA_IP')||''; })();
</script>
</body>
</html>
