export const dynamic = 'force-dynamic';
let store = global.store || { monitor: null, customers: {}, lastUpdate: 0, pendingCmd: "" };
global.store = store;
export async function GET(req){
  const url=new URL(req.url); const path=url.pathname.replace('/api/','');
  if(path.startsWith('telemetry')){
    let sum=0; Object.values(store.customers).forEach(c=>sum+=c.used||0);
    let leak=store.monitor?store.monitor.total-sum:0;
    let percent=store.monitor&&store.monitor.total>0?(leak/store.monitor.total*100):0;
    const online=Date.now()-store.lastUpdate<15000;
    return Response.json({monitor:store.monitor, customers:Object.values(store.customers).filter(c=>Date.now()-c.lastSeen<20000), leakage:{sum,total:leak,percent}, online});
  }
  if(path.startsWith('cmd/set')){ const c=url.searchParams.get("c")||""; store.pendingCmd=c; return Response.json({ok:true}); }
  if(path.startsWith('cmd/clear')){ store.pendingCmd=""; return Response.json({ok:true}); }
  if(path.startsWith('cmd')){ return new Response(store.pendingCmd||"",{status:200}); }
  return Response.json({ok:true});
}
export async function POST(req){
  const path=new URL(req.url).pathname.replace('/api/','');
  if(path.startsWith('telemetry')){
    const body=await req.json(); const nodes=body.nodes||[]; store.lastUpdate=Date.now();
    nodes.forEach(n=>{
      if(n.id===0){store.monitor={...n,lastSeen:Date.now()};}
      else{let c=store.customers[n.id]||{id:n.id,paid:500,used:0,flow:0,valve:"CLOSED",remaining:500,lastSeen:Date.now()}; c.flow=n.flow; c.used=n.total; c.valve=n.valve; c.lastSeen=Date.now(); c.remaining=c.paid-c.used; if(c.remaining<=0&&c.valve==="OPEN") store.pendingCmd=`CLOSE_${n.id}`; store.customers[n.id]=c;}
    }); return Response.json({ok:true});
  }
  if(path.startsWith('login')){const {user,pass}=await req.json(); if(user==="admin"&&pass==="admin123") return Response.json({ok:true}); return Response.json({ok:false},{status:401});}
  if(path.startsWith('payment')){const {id,amount}=await req.json(); let c=store.customers[id]; if(!c) return Response.json({error:"not found"},{status:404}); c.paid+=Number(amount); c.remaining=c.paid-c.used; store.pendingCmd=`OPEN_${id}`; return Response.json({ok:true});}
  return Response.json({ok:true});
}
