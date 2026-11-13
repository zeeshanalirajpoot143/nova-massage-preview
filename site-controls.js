(()=>{
 const KEY="nova-cookie-preferences-v2";
 let saved={necessary:true,analytics:false,advertising:false,decided:false};
 try{const raw=localStorage.getItem(KEY);if(raw){const parsed=JSON.parse(raw);saved={...saved,...parsed,necessary:true,decided:true}}}catch(e){}
 const style=document.createElement("style");
 style.textContent=`
 .nova-cookie-overlay{position:fixed;inset:0;z-index:10050;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,9,8,.66);backdrop-filter:blur(7px)}
 .nova-cookie-dialog{width:min(560px,100%);padding:30px;border:1px solid rgba(201,169,119,.42);border-radius:18px;background:linear-gradient(145deg,#211d17,#12110e);color:#f5eee2;box-shadow:0 28px 90px rgba(0,0,0,.48);font-family:inherit}
 .nova-cookie-eyebrow{margin:0 0 10px;color:#c9a977;font-size:9px;letter-spacing:.24em;text-transform:uppercase}
 .nova-cookie-dialog h2{margin:0 0 12px;color:#ead9b8;font:400 30px/1.15 Georgia,serif}
 .nova-cookie-copy{margin:0;color:#d0c5b4;font-size:12px;line-height:1.8}
 .nova-cookie-copy a,.nova-cookie-dialog a{color:#ead9b8;text-decoration:underline;text-underline-offset:3px}
 .nova-cookie-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:22px}
 .nova-cookie-actions button{flex:1;min-width:125px;min-height:44px;padding:10px 14px;border:1px solid rgba(201,169,119,.7);border-radius:999px;background:transparent;color:#ead9b8;font:700 9px/1.3 inherit;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:transform .22s,background .22s}
 .nova-cookie-actions button:hover{transform:translateY(-2px);background:rgba(201,169,119,.12)}
 .nova-cookie-actions button.primary{background:linear-gradient(120deg,#ead9b8,#c9a977);color:#17130d}
 .nova-cookie-preferences{margin-top:18px;padding-top:17px;border-top:1px solid rgba(201,169,119,.2)}
 .nova-cookie-pref{display:flex;justify-content:space-between;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(201,169,119,.12);font-size:11px;color:#e5dac8}
 .nova-cookie-pref small{display:block;margin-top:3px;color:#b9ad9c;font-size:10px;line-height:1.5}
 .nova-cookie-pref input{accent-color:#c9a977;width:17px;height:17px}
 .nova-cookie-close{float:right;border:0;background:none;color:#ead9b8;font-size:21px;cursor:pointer}
 .nova-cookie-footer-link{display:inline-block;margin:8px 12px 8px 0;border:0;background:none;color:inherit;font:inherit;font-size:10px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;opacity:.8}
 body[data-theme="light"] .nova-cookie-dialog{background:linear-gradient(145deg,#fffdf8,#f2eadb);color:#28231a}
 body[data-theme="light"] .nova-cookie-dialog h2,body[data-theme="light"] .nova-cookie-pref{color:#554127}
 body[data-theme="light"] .nova-cookie-copy,body[data-theme="light"] .nova-cookie-pref small{color:#655b4d}
 @media(max-width:560px){.nova-cookie-dialog{padding:23px 19px;border-radius:15px}.nova-cookie-dialog h2{font-size:26px}.nova-cookie-actions{display:grid;grid-template-columns:1fr}.nova-cookie-actions button{width:100%}}
 @media(prefers-reduced-motion:reduce){.nova-cookie-actions button{transition:none}}
 `;
 document.head.appendChild(style);
 const overlay=document.createElement("div");overlay.className="nova-cookie-overlay";overlay.hidden=true;overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-labelledby","novaCookieTitle");
 overlay.innerHTML='<section class="nova-cookie-dialog"><button class="nova-cookie-close" type="button" aria-label="Close cookie settings" data-cookie-close>×</button><p class="nova-cookie-eyebrow">NOVA MASSAGE · YOUR PRIVACY</p><h2 id="novaCookieTitle">Your Cookie Preferences</h2><p class="nova-cookie-copy">We use essential browser storage to keep this website working and remember your preferences. Optional cookies are only enabled with your permission. Read our <a href="privacy_policy.html">Privacy & Cookie Policy</a>.</p><div class="nova-cookie-preferences" data-cookie-prefs hidden><div class="nova-cookie-pref"><span><strong>Necessary</strong><small>Required for core website functions and cannot be switched off.</small></span><input type="checkbox" checked disabled aria-label="Necessary cookies always enabled"></div><div class="nova-cookie-pref"><span><strong>Analytics</strong><small>Help understand how visitors use the website.</small></span><input type="checkbox" data-pref="analytics" aria-label="Allow analytics cookies"></div><div class="nova-cookie-pref"><span><strong>Advertising</strong><small>Would allow advertising and marketing measurement cookies if added.</small></span><input type="checkbox" data-pref="advertising" aria-label="Allow advertising cookies"></div></div><div class="nova-cookie-actions"><button type="button" data-cookie-reject>Reject Optional</button><button type="button" data-cookie-settings>Cookie Settings</button><button type="button" class="primary" data-cookie-accept>Accept All</button></div><div class="nova-cookie-actions" data-cookie-save hidden><button type="button" data-cookie-back>Back</button><button type="button" class="primary" data-cookie-save-choice>Save My Preferences</button></div></section>';
 document.body.appendChild(overlay);
 const footer=document.querySelector("footer")||document.body;
 const reopen=document.createElement("button");reopen.type="button";reopen.className="nova-cookie-footer-link";reopen.textContent="Cookie Settings";reopen.addEventListener("click",()=>show(true));footer.appendChild(reopen);
 const prefs=overlay.querySelector("[data-cookie-prefs]"),actions=overlay.querySelector(".nova-cookie-actions"),saveActions=overlay.querySelector("[data-cookie-save]");
 function show(settings){overlay.hidden=false;prefs.hidden=!settings;actions.hidden=!!settings;saveActions.hidden=!settings;overlay.querySelector('[data-pref="analytics"]').checked=!!saved.analytics;overlay.querySelector('[data-pref="advertising"]').checked=!!saved.advertising;}
 function hide(){overlay.hidden=true}
 function persist(value){saved={necessary:true,analytics:!!value.analytics,advertising:!!value.advertising,decided:true};try{localStorage.setItem(KEY,JSON.stringify(saved))}catch(e){}hide()}
 overlay.querySelector("[data-cookie-accept]").addEventListener("click",()=>persist({analytics:true,advertising:true}));
 overlay.querySelector("[data-cookie-reject]").addEventListener("click",()=>persist({analytics:false,advertising:false}));
 overlay.querySelector("[data-cookie-settings]").addEventListener("click",()=>show(true));
 overlay.querySelector("[data-cookie-back]").addEventListener("click",()=>show(false));
 overlay.querySelector("[data-cookie-save-choice]").addEventListener("click",()=>persist({analytics:overlay.querySelector('[data-pref="analytics"]').checked,advertising:overlay.querySelector('[data-pref="advertising"]').checked}));
 overlay.querySelector("[data-cookie-close]").addEventListener("click",hide);
 if(!saved.decided)show(false);
})();