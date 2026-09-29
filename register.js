const {r,getState,send,norm,card}=require("../lib/util");
module.exports=async(req,res)=>{
 if(req.method!="POST")return res.status(405).end();
 try{
  const {me,team}=req.body||{};
  if(!me||!me.user||!me.team)return res.status(400).json({error:"bad"});
  me.wa=norm(me.wa);if(me.wa.length<9)return res.status(400).json({error:"wa"});
  const s=await getState();
  if(s.cfg&&s.cfg.closed)return res.status(403).json({error:"closed"});
  if(s.users.some(u=>u.wa==me.wa))return res.status(409).json({error:"dup"});if(s.users.some(u=>String(u.user).toLowerCase()==String(me.user).toLowerCase()))return res.status(409).json({error:"user"});if(!me.pwh||String(me.pwh).length!=64)return res.status(400).json({error:"pw"});
  await r(["RPUSH","sls:q",JSON.stringify({me,team:team||null})]);
  await send(me.wa,card("PENDAFTARAN DITERIMA 📝","Halo *"+me.user+"*!\n🛡 Tim: *"+me.team+"*\n📌 Status: "+(team?"menunggu persetujuan admin":"terdaftar")+"\n\nKetik *.menu* untuk info turnamen."));
  await send(process.env.ADMIN_WA,card("PENDAFTAR BARU 🔔","👤 Username: *"+me.user+"*\n🛡 Tim: "+me.team+(team?" _(baru)_":"")+"\n📱 WA: "+me.wa+"\n💬 Discord: "+(me.dc||"-")));
  res.json({ok:true});
 }catch(e){res.status(500).json({error:String(e)})}};
