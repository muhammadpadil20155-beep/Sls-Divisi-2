const {getState,setState,send,card}=require("../lib/util");
const isOwner=req=>!!process.env.OWNER_CODE&&req.headers["x-owner-code"]===process.env.OWNER_CODE;
module.exports=async(req,res)=>{
 try{
  const s=await getState();
  if(req.method=="POST"){
   if(!isOwner(req))return res.status(401).json({error:"unauthorized"});
   const n=req.body;if(!n||!Array.isArray(n.teams)||!Array.isArray(n.users))return res.status(400).json({error:"bad"});
   for(const t of n.teams){if(!t.ok)continue;const o=s.teams.find(x=>x.name==t.name);
    if(o&&!o.ok)for(const u of n.users.filter(u=>u.team==t.name))await send(u.wa,card("TIM DISETUJUI ✅","Halo *"+u.user+"*,\nTim *"+t.name+"* resmi terdaftar di SLS Divisi 2.\nSelamat bergabung dan semoga sukses! 🔥\n\nKetik *.menu* untuk info turnamen."))}
   await setState(n);return res.json({ok:true});
  }
  if(isOwner(req))return res.json(s);
  const c=Object.assign({},s.cfg);delete c.code;
  res.json(Object.assign({},s,{cfg:c,users:s.users.map(u=>({user:u.user,team:u.team,ok:u.ok}))}));
 }catch(e){res.status(500).json({error:String(e)})}};
