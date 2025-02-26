import{g as U}from"./read-MB-BRnXe.js";import{A as N,a as j,h as k}from"./404-Dy6-cS9p.js";import{c as M}from"./cards-Bn-sZUx-.js";function R(n){var u;return`
        <h1 class="text-4xl text-center text-brand-text mb-8">PROFILE</h1>
        
        <div class="bg-[#F4F3EE] rounded-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full md:w-1/3">
                    <img src="${((u=n.avatar)==null?void 0:u.url)||"/src/assets/images/auctionpic.png"}" 
                         alt="Profile" 
                         class="w-full h-64 object-cover rounded-lg">
                </div>
                <div class="w-full md:w-2/3 space-y-4">
                    <div class="w-full text-left">
                        <p class="text-lg"><strong>Name:</strong> ${n.name}</p>
                        <p class="text-lg"><strong>Bio:</strong> ${n.bio||"No bio yet"}</p>
                        <p class="text-lg"><strong>Wins:</strong> ${n._count.wins}</p>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">Listings</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="flex justify-center gap-4 mb-4">
                <button id="active-listings-tab" class="px-6 py-2 bg-[#E0AFA0] text-white rounded-lg">Active</button>
                <button id="expired-listings-tab" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg">Expired</button>
            </div>
            <div id="listings-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center"></div>
            <div class="flex justify-center items-center my-8 hidden" id="listings-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-listings" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">Item Wins</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center" id="wins-container"></div>
            <div class="flex justify-center items-center my-8 hidden" id="wins-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-wins" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>
    `}async function q(){if(!localStorage.getItem("token")){const t=encodeURIComponent(window.location.href);window.location.href=`/src/pages/login/index.html?returnTo=${t}`;return}const d=new URLSearchParams(window.location.search).get("name");if(!d){window.location.href="/";return}const a=3;let p=0,L=0,h=[],o=[];try{let b=function(e){p=0,r.innerHTML="",c=e?v:C,I.className=e?"px-6 py-2 bg-[#E0AFA0] text-white rounded-lg":"px-6 py-2 bg-gray-300 text-gray-700 rounded-lg",A.className=e?"px-6 py-2 bg-gray-300 text-gray-700 rounded-lg":"px-6 py-2 bg-[#E0AFA0] text-white rounded-lg",c.length>0?F():(r.innerHTML=`<p class="text-gray-500">No ${e?"active":"expired"} listings</p>`,l.classList.add("hidden"))},F=function(){x.classList.remove("hidden"),l.classList.add("hidden");const e=p*a,i=e+a,m=c.slice(e,i);setTimeout(()=>{m.forEach(w=>{const s=M({...w,seller:{name:t.name}});r.appendChild(s)}),p++,x.classList.add("hidden"),i<c.length&&l.classList.remove("hidden")},500)},S=function(){g.classList.remove("hidden"),f.classList.add("hidden");const e=o.sort((s,y)=>new Date(y.created)-new Date(s.created)),i=L*a,m=i+a,w=e.slice(i,m);setTimeout(()=>{w.forEach(s=>{var P;const y=M({...s,seller:{name:((P=s.seller)==null?void 0:P.name)||"Unknown Seller"}});T.appendChild(y)}),L++,g.classList.add("hidden"),m<o.length&&f.classList.remove("hidden")},500)};const{data:t}=await U(d),W=document.querySelector("main");W.innerHTML=R(t);const E=localStorage.getItem("token"),x=document.getElementById("listings-loader"),r=document.getElementById("listings-container"),l=document.getElementById("load-more-listings"),I=document.getElementById("active-listings-tab"),A=document.getElementById("expired-listings-tab");x.classList.remove("hidden");const $=await fetch(`${N.LISTINGS(d)}?${j.LISTINGS}`,{headers:k(E)}),{data:B}=await $.json();h=B||[];const v=h.filter(e=>new Date(e.endsAt)>new Date),C=h.filter(e=>new Date(e.endsAt)<=new Date);let c=v;I.addEventListener("click",()=>b(!0)),A.addEventListener("click",()=>b(!1)),v.length>0?b(!0):r.innerHTML='<p class="text-gray-500">No active listings</p>',l.addEventListener("click",F);const g=document.getElementById("wins-loader"),T=document.getElementById("wins-container"),f=document.getElementById("load-more-wins");g.classList.remove("hidden");const D=await fetch(`${N.WINS(d)}?${j.WINS}`,{headers:k(E)}),{data:H}=await D.json();o=H||[],o.length>0?(S(),f.addEventListener("click",S)):(g.classList.add("hidden"),T.innerHTML='<p class="text-gray-500">No wins yet</p>')}catch(t){console.error("Error loading user profile:",t)}}export{q as initUser};
