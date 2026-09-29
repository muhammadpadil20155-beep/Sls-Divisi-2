const {getState,send,card}=require("../lib/util");
module.exports=async(req,res)=>{
 if(process.env.CRON_SECRET&&req.headers.authorization!=="Bearer "+process.env.CRON_SECRET)return res.status(401).end();
 const s=await getState(),d=n=>new Date(Date.now()+7*36e5+n*864e5).toISOString().slice(0,10),today=d(0),tom=d(1);let n=0;
 for(const j of s.jadwal||[]){if(j.tgl!=today&&j.tgl!=tom)continue;if(j.sa!==""&&j.sa!=null)continue;
  for(const u of s.users.filter(u=>u.team==j.a||u.team==j.b)){await send(u.wa,card("PENGINGAT MATCH ⏰","*"+j.a+"* vs *"+j.b+"*\n📅 "+(j.tgl==today?"HARI INI":"Besok")+"  🕒 "+j.jam+"\n\nSiapkan tim, jangan sampai telat! 🔥"));n++}}
 res.json({sent:n})};
