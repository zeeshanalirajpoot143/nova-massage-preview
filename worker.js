const COOKIE="nova_admin_session";
const SESSION_SECONDS=60*60*8;
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store",...headers}});
const enc=s=>new TextEncoder().encode(s);
const b64url=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
async function sign(value,secret){const key=await crypto.subtle.importKey("raw",enc(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return b64url(await crypto.subtle.sign("HMAC",key,enc(value)))}
async function validSession(request,env){const cookie=request.headers.get("Cookie")||"";const token=cookie.split(";").map(x=>x.trim()).find(x=>x.startsWith(COOKIE+"="))?.slice(COOKIE.length+1);if(!token||!env.ADMIN_SESSION_SECRET)return false;const [payload,sig]=token.split(".");if(!payload||!sig)return false;try{const decoded=atob(payload.replace(/-/g,"+").replace(/_/g,"/"));const data=JSON.parse(decoded);if(!data.exp||data.exp<Date.now()/1000)return false;return await sign(payload,env.ADMIN_SESSION_SECRET)===sig}catch{return false}}
const cookie=(value,maxAge)=>`${COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
async function body(request){try{return await request.json()}catch{return null}}
function clean(s,max=500){return String(s??"").trim().slice(0,max)}
async function route(request,env){
 const url=new URL(request.url),path=url.pathname,method=request.method;
 if(path==="/api/health"&&method==="GET")return json({ok:true,database:!!env.DB,ai:!!env.AI});
 if(path==="/api/assistant"&&method==="POST"){
  const d=await body(request),question=clean(d?.message,600);
  if(question.length<2)return json({error:"Please enter a question."},400);
  if(!env.AI)return json({error:"NOVA AI is not online yet. Please call NOVA MASSAGE at +1 (708) 400-9333."},503);
  const system=`You are NOVA, the 24/7 AI concierge for NOVA MASSAGE. Understand the customer's intent, reason carefully, ask a brief follow-up when essential, and give clear, helpful, concise answers. Reply in the language the customer uses. Explain services, compare treatments, explain booking, answer general FAQs, and help customers prepare to book.

You are an information concierge, not an autonomous website operator or staff member. Never claim you can edit the website, change owner settings, access customer accounts, contact Nadia, or make/confirm/cancel/reschedule appointments. Square is the live booking system. Direct customers to the current Square booking page. Never claim an appointment is confirmed unless Square confirms it.

BUSINESS:
NOVA MASSAGE is an appointment-based massage and wellness studio serving Palos Heights, Illinois.
Phone: +1 (708) 400-9333. Phone calls and SMS only. This number is NOT WhatsApp. Never provide WhatsApp links or claim WhatsApp is available.
Email: thenovamassage@gmail.com.
Current booking page: https://app.squareup.com/appointments/buyer/widget/h2xbfa18g664u2/L5GA5FY28RTBX
Square is the source of truth for live availability, appointment confirmation, checkout, current prices and service options.

CURRENT SQUARE SERVICES (USD):
Facial Gua Sha Glow Massage — $150 — 1 hour.
Two Hour Bliss — $270 — 2 hours.
90 Minute Relaxation Relief with Foot Massage — $175 — 1 hour 30 minutes.
Abdominal Massage — $175 — 1 hour 15 minutes.
Brush & Lymph Flow — $175 — 1 hour 30 minutes.
Deep Tissue — $140 — 1 hour.
Facial Massage Rejuvenation — $150 — 1 hour.
Foot Reflexology — $120 — 1 hour.
Ground & Glow — $175 — 1 hour 30 minutes.
Lymphatic Lovin — $150 — 1 hour 15 minutes.
Serenity Swedish — $130 — 1 hour 15 minutes.
Spa Bliss — $330 — 2 hours 30 minutes.
Stone + Scalp Massage — $150 — 1 hour 15 minutes.
Tension Tamer Deep Tissues — $175 — 1 hour 30 minutes.
Tension Tamer + Foot Reflexology — $175 — 1 hour 15 minutes.
TMG + Upper Body Deep Tissues — $180 — 1 hour 30 minutes.
Upper Body Tension Relief — $170 — 1 hour 30 minutes.

OPTIONAL ADD-ONS:
TMJ Add-on — $50; Head Heaven Add-on — $15; Pedi Pampering Add-on — $25. All three are optional. Customers may select one, multiple, all three, or none. Square shows the final total; do not double-count add-on prices.

MOBILE BOOKINGS:
The proposed $40 mobile-booking fee and customer address collection are not yet confirmed as active. The charging rule is awaiting owner confirmation. Do not claim mobile booking, the fee, or address collection is enabled. Ask the customer to contact Nadia for confirmation.

PAYMENTS:
Square checkout is the online booking/payment route; accepted methods depend on merchant configuration. The website has mentioned Cash and Zelle, but do not promise any method without confirmation. PayPal and Venmo are not confirmed. Never request card or bank details in chat.

LOCATION AND HOURS:
The website contains conflicting street-address information. Do not give an address or directions as confirmed; ask customers to call the studio to verify before travelling. No verified opening hours are supplied; appointments are required.

WEBSITE FEATURES:
Customers can browse treatments, view details, submit a callback request, and submit a review. Reviews require owner approval before public display. A callback request asks the studio to call back when available; it is not an instant callback guarantee or an appointment booking.

SAFETY AND HONESTY:
Do not diagnose, prescribe, promise medical outcomes, or claim a massage is suitable for a medical condition. Recommend contacting the therapist about personal suitability. Never invent service details, prices, durations, availability, policies, credentials, address, opening hours, payment status, or booking confirmations. For unknown details, special exceptions, complaints, refunds, or owner approval, say Nadia must confirm and provide +1 (708) 400-9333 or thenovamassage@gmail.com. Never imply WhatsApp is available. Keep answers friendly, respectful, and focused on the next step.`;
  try{
   const result=await env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast",{messages:[{role:"system",content:system},{role:"user",content:question}],max_tokens:450});
   const reply=typeof result==="string"?result:(result?.response||result?.result?.response||"");
   if(!reply.trim())throw new Error("The AI model returned an empty reply.");
   return json({reply:reply.trim()});
  }catch(error){
   return json({error:"NOVA AI is temporarily unavailable. Please call +1 (708) 400-9333 or email thenovamassage@gmail.com.",detail:clean(error?.message,180)},503);
  }
 }
 if(path==="/api/appointment-request"&&method==="POST"){
  if(!env.DB)return json({error:"Appointment requests are temporarily unavailable. Please call +1 (708) 400-9333."},503);
  const d=await body(request);if(!d)return json({error:"Please complete the appointment form."},400);
  const name=clean(d.customer_name,100),email=clean(d.customer_email,160),phone=clean(d.customer_phone,40),service=clean(d.service_name,500),when=clean(d.appointment_at,40),notes=clean(d.notes,500);
  if(name.length<2||!/^\S+@\S+\.\S+$/.test(email)||phone.length<7||!service||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(when)||new Date(when).getTime()<=Date.now())return json({error:"Please provide valid contact details, selected service(s), and a future preferred date and time."},400);
  await env.DB.prepare("INSERT INTO appointments(customer_name,customer_email,customer_phone,service_name,appointment_at,status,notes) VALUES(?,?,?,?,?,'requested',?)").bind(name,email,phone,service,when,notes).run();
  return json({success:true,status:"requested",message:"Request received. The appointment is not confirmed until the studio confirms it."},201)
 }
 if(path==="/api/callback-request"&&method==="POST"){
  if(!env.DB)return json({error:"Callback requests are temporarily unavailable. Please call +1 (708) 400-9333."},503);
  const d=await body(request);if(!d)return json({error:"Please complete the callback form."},400);
  if(clean(d.website,120))return json({success:true},201);
  const name=clean(d.customer_name,100),phone=clean(d.customer_phone,40),email=clean(d.customer_email,160),message=clean(d.message,500);
  if(name.length<2||phone.replace(/\D/g,"").length<7||(email&&!/^\S+@\S+\.\S+$/.test(email)))return json({error:"Please provide a valid name and phone number."},400);
  await env.DB.prepare("INSERT INTO callback_requests(customer_name,customer_phone,customer_email,message,status) VALUES(?,?,?,?, 'new')").bind(name,phone,email,message).run();
  return json({success:true,message:"Your callback request has been saved."},201)
 }
 if(path.startsWith("/api/reviews")&&!env.DB)return json({error:"Reviews are temporarily unavailable while the database is being connected."},503);
 if(path==="/api/reviews"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT id, customer_name, rating, review_text, created_at FROM reviews WHERE status='approved' ORDER BY created_at DESC LIMIT 30").all();return json({reviews:results})}
 if(path==="/api/reviews"&&method==="POST"){const d=await body(request);if(!d)return json({error:"Invalid request."},400);const name=clean(d.customer_name,80),review=clean(d.review_text,1200),rating=Number(d.rating);if(name.length<2||review.length<10||!Number.isInteger(rating)||rating<1||rating>5)return json({error:"Please provide your name, a review of at least 10 characters and a 1–5 star rating."},400);await env.DB.prepare("INSERT INTO reviews(customer_name,rating,review_text,status,created_at) VALUES(?,?,?,'pending',datetime('now'))").bind(name,rating,review).run();return json({success:true,message:"Thank you. Your review has been submitted for approval."},201)}
 if(path==="/api/admin/login"&&method==="POST"){const d=await body(request);if(!env.ADMIN_PASSWORD||!env.ADMIN_SESSION_SECRET)return json({error:"Admin secrets have not been configured in Cloudflare yet."},503);if(!d||typeof d.password!=="string"||d.password!==env.ADMIN_PASSWORD)return json({error:"Incorrect password."},401);const payload=b64url(enc(JSON.stringify({exp:Math.floor(Date.now()/1000)+SESSION_SECONDS,nonce:crypto.randomUUID()})));const token=payload+"."+await sign(payload,env.ADMIN_SESSION_SECRET);return json({success:true},200,{"set-cookie":cookie(token,SESSION_SECONDS)})}
 if(path==="/api/admin/logout"&&method==="POST")return json({success:true},200,{"set-cookie":cookie("",0)});
 if(path==="/api/admin/session"&&method==="GET")return json({authenticated:await validSession(request,env)});
 if(!env.DB)return json({error:"Cloudflare D1 database is not connected yet."},503);
 if(path.startsWith("/api/admin/")){if(!await validSession(request,env))return json({error:"Please sign in again."},401);
  if(path==="/api/admin/summary"&&method==="GET"){const [a,p,u]=await Promise.all([env.DB.prepare("SELECT COUNT(*) n FROM services WHERE active=1").first(),env.DB.prepare("SELECT COUNT(*) n FROM reviews WHERE status='pending'").first(),env.DB.prepare("SELECT COUNT(*) n FROM reviews WHERE status='approved'").first()]);return json({activeServices:a.n,pendingReviews:p.n,publishedReviews:u.n})}
  if(path==="/api/admin/services"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT * FROM services ORDER BY name").all();return json({services:results})}
  if(path==="/api/admin/services"&&method==="POST"){const d=await body(request);if(!d||clean(d.name,100).length<2)return json({error:"A service name is required."},400);const r=await env.DB.prepare("INSERT INTO services(name,description,price_cents,duration_minutes,active) VALUES(?,?,?,?,?)").bind(clean(d.name,100),clean(d.description,500),Math.max(0,Math.round(Number(d.price_cents)||0)),Math.max(1,Math.round(Number(d.duration_minutes)||60)),d.active?1:0).run();return json({success:true,id:r.meta.last_row_id},201)}
  const service=path.match(/^\/api\/admin\/services\/(\d+)$/);if(service){const id=Number(service[1]);if(method==="PUT"){const d=await body(request);if(!d||clean(d.name,100).length<2)return json({error:"A service name is required."},400);await env.DB.prepare("UPDATE services SET name=?,description=?,price_cents=?,duration_minutes=?,active=? WHERE id=?").bind(clean(d.name,100),clean(d.description,500),Math.max(0,Math.round(Number(d.price_cents)||0)),Math.max(1,Math.round(Number(d.duration_minutes)||60)),d.active?1:0,id).run();return json({success:true})}if(method==="DELETE"){await env.DB.prepare("DELETE FROM services WHERE id=?").bind(id).run();return json({success:true})}}

  if(path==="/api/admin/callback-requests"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT * FROM callback_requests ORDER BY created_at DESC LIMIT 250").all();return json({requests:results})}
  const callback=path.match(/^\/api\/admin\/callback-requests\/(\d+)$/);if(callback&&method==="PATCH"){const d=await body(request);if(!["new","contacted","closed"].includes(d?.status))return json({error:"Invalid callback request status."},400);await env.DB.prepare("UPDATE callback_requests SET status=? WHERE id=?").bind(d.status,Number(callback[1])).run();return json({success:true})}
  if(path==="/api/admin/customers"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT * FROM customers ORDER BY created_at DESC LIMIT 250").all();return json({customers:results})}
  if(path==="/api/admin/customers"&&method==="POST"){const d=await body(request);if(!d||clean(d.name,100).length<2)return json({error:"Customer name is required."},400);const r=await env.DB.prepare("INSERT INTO customers(name,email,phone,notes) VALUES(?,?,?,?)").bind(clean(d.name,100),clean(d.email,160),clean(d.phone,40),clean(d.notes,500)).run();return json({success:true,id:r.meta.last_row_id},201)}
  if(path==="/api/admin/appointments"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT * FROM appointments ORDER BY appointment_at DESC LIMIT 250").all();return json({appointments:results})}
  if(path==="/api/admin/appointments"&&method==="POST"){const d=await body(request);if(!d||clean(d.customer_name,100).length<2||!clean(d.appointment_at,40))return json({error:"Customer name and appointment date/time are required."},400);const r=await env.DB.prepare("INSERT INTO appointments(customer_name,customer_email,customer_phone,service_name,appointment_at,status,notes) VALUES(?,?,?,?,?,?,?)").bind(clean(d.customer_name,100),clean(d.customer_email,160),clean(d.customer_phone,40),clean(d.service_name,100),clean(d.appointment_at,40),"requested",clean(d.notes,500)).run();return json({success:true,id:r.meta.last_row_id},201)}
  const ap=path.match(/^\/api\/admin\/appointments\/(\d+)$/);if(ap&&method==="PATCH"){const d=await body(request);if(!["requested","confirmed","completed","cancelled"].includes(d?.status))return json({error:"Invalid appointment status."},400);await env.DB.prepare("UPDATE appointments SET status=? WHERE id=?").bind(d.status,Number(ap[1])).run();return json({success:true})}
  if(path==="/api/admin/invoices"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT * FROM invoices ORDER BY created_at DESC LIMIT 250").all();return json({invoices:results})}
  if(path==="/api/admin/invoices"&&method==="POST"){const d=await body(request);if(!d||clean(d.customer_name,100).length<2||!clean(d.invoice_number,40)||!(Number(d.amount_cents)>0))return json({error:"Invoice number, customer name and a positive amount are required."},400);try{const r=await env.DB.prepare("INSERT INTO invoices(invoice_number,customer_name,customer_email,description,amount_cents,status,due_date) VALUES(?,?,?,?,?,?,?)").bind(clean(d.invoice_number,40),clean(d.customer_name,100),clean(d.customer_email,160),clean(d.description,500),Math.round(Number(d.amount_cents)),"draft",clean(d.due_date,20)).run();return json({success:true,id:r.meta.last_row_id},201)}catch{return json({error:"That invoice number already exists."},409)}}
  const inv=path.match(/^\/api\/admin\/invoices\/(\d+)$/);if(inv&&method==="PATCH"){const d=await body(request);if(!["draft","sent","paid","void"].includes(d?.status))return json({error:"Invalid invoice status."},400);await env.DB.prepare("UPDATE invoices SET status=? WHERE id=?").bind(d.status,Number(inv[1])).run();return json({success:true})}
  if(path==="/api/admin/addons"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT * FROM service_addons ORDER BY name").all();return json({addons:results})}
  if(path==="/api/admin/addons"&&method==="POST"){const d=await body(request);if(!d||clean(d.name,100).length<2)return json({error:"Add-on name is required."},400);const r=await env.DB.prepare("INSERT INTO service_addons(name,description,price_cents,duration_minutes,active) VALUES(?,?,?,?,?)").bind(clean(d.name,100),clean(d.description,500),Math.max(0,Math.round(Number(d.price_cents)||0)),Math.max(0,Math.round(Number(d.duration_minutes)||0)),d.active?1:0).run();return json({success:true,id:r.meta.last_row_id},201)}
  const ad=path.match(/^\/api\/admin\/addons\/(\d+)$/);if(ad){const id=Number(ad[1]);if(method==="PUT"){const d=await body(request);if(!d||clean(d.name,100).length<2)return json({error:"Add-on name is required."},400);await env.DB.prepare("UPDATE service_addons SET name=?,description=?,price_cents=?,duration_minutes=?,active=? WHERE id=?").bind(clean(d.name,100),clean(d.description,500),Math.max(0,Math.round(Number(d.price_cents)||0)),Math.max(0,Math.round(Number(d.duration_minutes)||0)),d.active?1:0,id).run();return json({success:true})}if(method==="DELETE"){await env.DB.prepare("DELETE FROM service_addons WHERE id=?").bind(id).run();return json({success:true})}}
  if(path==="/api/admin/settings"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT setting_key,setting_value FROM site_settings").all();return json({settings:Object.fromEntries(results.map(x=>[x.setting_key,x.setting_value]))})}
  if(path==="/api/admin/settings"&&method==="PUT"){const d=await body(request);for(const key of ["tip_presets","paypal_link","venmo_handle","zelle_instructions"]){if(d&&Object.prototype.hasOwnProperty.call(d,key))await env.DB.prepare("INSERT INTO site_settings(setting_key,setting_value) VALUES(?,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value").bind(key,clean(d[key],300)).run()}return json({success:true})}
  if(path==="/api/admin/reviews"&&method==="GET"){const {results=[]}=await env.DB.prepare("SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100").all();return json({reviews:results})}
  const review=path.match(/^\/api\/admin\/reviews\/(\d+)$/);if(review&&method==="PATCH"){const id=Number(review[1]),d=await body(request);if(d?.delete){await env.DB.prepare("DELETE FROM reviews WHERE id=?").bind(id).run();return json({success:true})}if(!["approved","pending","hidden"].includes(d?.status))return json({error:"Invalid review status."},400);await env.DB.prepare("UPDATE reviews SET status=? WHERE id=?").bind(d.status,id).run();return json({success:true})}
 }
 return json({error:"Not found."},404)
}
export default {async fetch(request,env){try{const url=new URL(request.url);if(url.pathname.startsWith("/api/"))return await route(request,env);if(url.pathname==="/"){url.pathname="/index.html";return env.ASSETS.fetch(new Request(url.toString(),request))}return env.ASSETS.fetch(request)}catch(error){return json({error:"Server error. Please try again."},500)}}};