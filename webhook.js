const {getState,send,sendImg,card,norm}=require("../lib/util");
const MENU="Halo! Ini bot resmi *SLS Divisi 2*. Pilih perintah:\n\n📋 *.info* — info turnamen\n🛡 *.tim* — daftar tim\n📅 *.jadwal* — jadwal permainan\n🏆 *.klasemen* — klasemen\n🔥 *.top* — pemain terbaik\n👤 *.status* — cek pendaftaranmu\n📝 *.daftar* — link pendaftaran";
function stand(s){const T={};s.teams.filter(t=>t.ok).forEach(t=>T[t.name]={n:t.name,m:0,p:0,w:0});
 (s.jadwal||[]).forEach(j=>{if(j.sa===""||j.sa==null||!T[j.a]||!T[j.b])return;const a=+j.sa,b=+j.sb;T[j.a].m++;T[j.b].m++;
  if(a>b){T[j.a].p+=3;T[j.a].w++}else if(b>a){T[j.b].p+=3;T[j.b].w++}else{T[j.a].p++;T[j.b].p++}});
 return Object.values(T).sort((x,y)=>y.p-x.p||y.w-x.w)}
const medal=i=>["🥇","🥈","🥉"][i]||(i+1)+".";
module.exports=async(req,res)=>{
 try{
  const b=req.body||{},from=b.sender,m=String(b.message||"").trim().toLowerCase().replace(/^[.!\/]/,"");
  if(!from||b.member||!m)return res.status(200).end();
  const s=await getState(),c=s.cfg||{},ok=s.teams.filter(t=>t.ok),site=(process.env.SITE_URL||"").replace(/\/$/,"");let t;
  if(m=="info")t=card("INFO TURNAMEN 📋","🛡 Slot tim: *"+ok.length+"/"+(c.max||16)+"*\n🎮 Format: "+(c.format||"-")+"\n💰 Biaya: "+(c.biaya||"-")+"\n🏅 Hadiah: "+(c.hadiah||"-")+"\n🗓 Mulai: "+(c.mulai||"-")+"\n📌 Pendaftaran: *"+(c.closed?"ditutup":"dibuka")+"*");
  else if(m=="tim")t=card("TIM TERDAFTAR 🛡 ("+ok.length+")",ok.map((x,i)=>(i+1)+". *"+x.name+"*"+(x.tag?" ["+x.tag+"]":"")).join("\n")||"Belum ada tim.");
  else if(m=="jadwal")t=card("JADWAL PERMAINAN 📅",(s.jadwal||[]).slice().sort((a,b)=>(a.tgl+a.jam)<(b.tgl+b.jam)?-1:1).slice(0,15).map(j=>"🗓 "+j.tgl+"  🕒 "+j.jam+(j.rd?"  ("+j.rd+")":"")+"\n     *"+j.a+"* vs *"+j.b+"*"+(j.sa!==""&&j.sa!=null?"  ➜ "+j.sa+" : "+j.sb:"")).join("\n\n")||"Belum ada jadwal.");
  else if(m=="klasemen")t=card("KLASEMEN 🏆",stand(s).map((x,i)=>medal(i)+" *"+x.n+"* — "+x.p+" poin ("+x.m+" main)").join("\n")||"Belum ada data.");
  else if(m=="top")t=card("PEMAIN TERBAIK 🔥",(s.stat||[]).slice().sort((a,b)=>b.k-a.k).slice(0,5).map((x,i)=>medal(i)+" *"+x.n+"* ("+x.t+")\n     ☠ "+x.k+"  🤝 "+x.a+"  🎯 "+x.ac+"%  🎭 "+x.c).join("\n\n")||"Statistik belum diisi.");
  else if(m=="status"){const u=s.users.find(x=>x.wa==norm(from));t=card("STATUS PENDAFTARAN 👤",u?"Username: *"+u.user+"*\n🛡 Tim: "+u.team+"\n📌 Status: *"+((u.ok||ok.some(x=>x.name==u.team))?"Terdaftar ✅":"Menunggu persetujuan admin ⏳")+"*":"Nomor ini belum terdaftar.\nKetik *.daftar* untuk mendaftar.")}
  else if(m=="daftar")t=card("PENDAFTARAN 📝","Daftar lewat website:\n"+(site||"(isi SITE_URL di Vercel)"));
  else{await sendImg(from,card("SLS DIVISI 2 🎮",MENU),site?site+"/menu.png":"");return res.status(200).end()}
  await send(from,t);res.status(200).end();
 }catch(e){res.status(200).end()}};
