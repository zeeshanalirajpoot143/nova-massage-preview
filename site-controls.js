(()=>{
 const sameSiteReferrer=()=>{try{return document.referrer&&new URL(document.referrer).origin===location.origin}catch(e){return false}};
 const controls=document.createElement("nav");controls.className="site-browser-controls";controls.setAttribute("aria-label","Page navigation");
 controls.innerHTML='<button type="button" data-site-back aria-label="Go back to previous page" title="Back">← Back</button><button type="button" data-site-reload aria-label="Reload this page" title="Reload">↻ Reload</button>';
 document.body.appendChild(controls);
 controls.querySelector("[data-site-back]").addEventListener("click",()=>{if(sameSiteReferrer()&&history.length>1)history.back();else if(location.pathname.endsWith("privacy_policy.html"))location.href="index.html";else if(location.pathname.endsWith("book.html"))location.href="index.html#popular";else if(location.pathname.endsWith("admin.html"))location.href="index.html";else if(location.hash)history.back();else window.scrollTo({top:0,behavior:"smooth"});});
 controls.querySelector("[data-site-reload]").addEventListener("click",()=>location.reload());
 const key="nova-cookie-choice-v1";let choice=null;try{choice=localStorage.getItem(key)}catch(e){}
 const banner=document.createElement("section");banner.className="site-cookie-banner";banner.setAttribute("role","dialog");banner.setAttribute("aria-label","Cookie preferences");banner.hidden=true;
 banner.innerHTML='<div class="site-cookie-copy"><strong>Cookies & privacy</strong>We use essential browser storage for site preferences. No advertising or analytics trackers are intentionally enabled in this version. <a href="privacy_policy.html">Privacy & Cookie Policy</a>.</div><div class="site-cookie-actions"><button type="button" data-cookie-reject>Reject optional</button><button type="button" class="primary" data-cookie-accept>Accept</button></div>';
 document.body.appendChild(banner);
 const settings=document.createElement("button");settings.type="button";settings.className="site-cookie-settings";settings.textContent="Cookie settings";settings.addEventListener("click",()=>{banner.hidden=false});document.body.appendChild(settings);
 const save=value=>{try{localStorage.setItem(key,value)}catch(e){}banner.hidden=true};
 banner.querySelector("[data-cookie-accept]").addEventListener("click",()=>save("accepted"));
 banner.querySelector("[data-cookie-reject]").addEventListener("click",()=>save("essential-only"));
 if(!choice)banner.hidden=false;
})();