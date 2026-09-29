const {getState}=require("../lib/util");
module.exports=async(req,res)=>{
 try{const {user,pwh}=req.body||{},s=await getState();
  const u=s.users.find(x=>String(x.user).toLowerCase()==String(user||"").toLowerCase()&&x.pwh&&x.pwh===pwh);
  if(!u)return res.status(404).json({});
  res.json(Object.assign({},u,{ok:u.ok||s.teams.some(t=>t.name==u.team&&t.ok)}));
 }catch(e){res.status(500).json({})}};
