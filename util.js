const U=process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL,T=process.env.UPSTASH_REDIS_REST_TOKEN||process.env.KV_REST_API_TOKEN;
async function r(cmd){const x=await fetch(U,{method:"POST",headers:{Authorization:"Bearer "+T},body:JSON.stringify(cmd)});return (await x.json()).result}
const norm=w=>String(w||"").replace(/\D/g,"").replace(/^0/,"62");
async function send(target,message){if(!process.env.FONNTE_TOKEN||!target)return;try{await fetch("https://api.fonnte.com/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:process.env.FONNTE_TOKEN},body:JSON.stringify({target,message})})}catch(e){}}
async function getState(){let s=await r(["GET","sls:state"]);s=s?JSON.parse(s):{teams:[],users:[],jadwal:[],stat:[],news:[],cfg:{}};
 const q=(await r(["LRANGE","sls:q",0,-1]))||[];
 if(q.length){for(const i of q){const d=JSON.parse(i);if(d.team&&!s.teams.some(t=>t.name.toLowerCase()==d.team.name.toLowerCase()))s.teams.push(d.team);if(!s.users.some(u=>u.wa==d.me.wa))s.users.push(d.me)}
  await r(["SET","sls:state",JSON.stringify(s)]);await r(["LTRIM","sls:q",q.length,-1])}
 return s}
const setState=s=>r(["SET","sls:state",JSON.stringify(s)]);
const card=(t,b)=>"━━━━━━━━━━━━━━━\n*"+t+"*\n━━━━━━━━━━━━━━━\n"+b+"\n\n_SLS • Sea League Series Divisi 2_";
async function sendImg(target,message,url){if(!process.env.FONNTE_TOKEN||!target)return;
 try{if(url){const x=await fetch("https://api.fonnte.com/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:process.env.FONNTE_TOKEN},body:JSON.stringify({target,message,url})});const j=await x.json();if(j&&j.status)return}}catch(e){}
 return send(target,message)}
module.exports={r,norm,send,sendImg,card,getState,setState};
