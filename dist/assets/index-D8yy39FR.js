import{g as H,a as $,b as W}from"./read-TT2LPNUO.js";import{c as _,h as U}from"./main-DQHM2U-Z.js";import{c as F}from"./cards-Bn-sZUx-.js";async function R(s,t){var o,u;const g=localStorage.getItem("token"),r=await fetch(_.SINGLE(s),{method:"PUT",headers:U(g),body:JSON.stringify({avatar:{url:t.avatar.url,alt:t.avatar.alt},bio:t.bio})});if(!r.ok){const m=await r.json();throw new Error(((u=(o=m.errors)==null?void 0:o[0])==null?void 0:u.message)||"Failed to update profile")}return r.json()}function q(s){var t;return`
        <div id="edit-profile-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-[#F4F3EE] rounded-lg p-6 w-full max-w-xl">
                <h2 class="text-2xl font-semibold text-brand-text mb-4">Edit Profile</h2>
                <form id="edit-profile-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea id="edit-bio" rows="4"
                                class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                                placeholder="Your bio">${s.bio||""}</textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                        <input type="url" id="edit-avatar" 
                               value="${((t=s.avatar)==null?void 0:t.url)||""}"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="https://example.com/image.jpg">
                    </div>
                    
                    <div class="flex gap-3">
                        <button type="submit"
                                class="flex-1 bg-[#E0AFA0] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Update
                        </button>
                        <button type="button" id="cancel-edit"
                                class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `}const c=3;function O(s){var t;return`
        <h1 class="text-4xl text-center text-brand-text mb-8 mt-4">PROFILE</h1>
        
        <div class="bg-[#F4F3EE] rounded-lg p-8 mb-8">
            <div class="flex flex-col md:flex-row gap-8">
                <div class="w-full md:w-1/3">
                    <img src="${((t=s.avatar)==null?void 0:t.url)||"/src/assets/images/auctionpic.png"}" 
                         alt="Profile" 
                         class="w-full h-64 object-cover rounded-lg">
                </div>
                <div class="w-full md:w-2/3 space-y-4">
                    <div class="flex justify-between items-start">
                        <div>
                            <p class="text-lg"><strong>Name:</strong> ${s.name}</p>
                            <p class="text-lg"><strong>Bio:</strong> ${s.bio||"No bio yet"}</p>
                            <p class="text-lg"><strong>Credits:</strong> ${s.credits}</p>
                            <p class="text-lg"><strong>Wins:</strong> ${s._count.wins}</p>
                        </div>
                        <button id="edit-profile" 
                                class="bg-[#E0AFA0] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">My Listings</h2>
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

        <h2 class="text-xl text-center mb-3">My Bids</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center" id="bids-container"></div>
            <div class="flex justify-center items-center my-8 hidden" id="bids-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-bids" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>

        <h2 class="text-xl text-center mb-3">My Wins</h2>
        <div class="bg-[#F4F3EE] rounded-lg p-4 mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 justify-items-center" id="wins-container"></div>
            <div class="flex justify-center items-center my-8 hidden" id="wins-loader">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-text"></div>
            </div>
            <div class="flex justify-center">
                <button id="load-more-wins" class="hidden mt-4 px-6 py-2 bg-[#E0AFA0] text-white rounded-lg hover:bg-opacity-90 transition-colors">Load More</button>
            </div>
        </div>
    `}async function K(){var g,r;const s=localStorage.getItem("username");if(!s){window.location.href="/login";return}let t={listings:0,bids:0,wins:0};try{let y=function(e){t.listings=0,b.innerHTML="",v=e?x:D,I.className=e?"px-6 py-2 bg-[#E0AFA0] text-white rounded-lg":"px-6 py-2 bg-gray-300 text-gray-700 rounded-lg",M.className=e?"px-6 py-2 bg-gray-300 text-gray-700 rounded-lg":"px-6 py-2 bg-[#E0AFA0] text-white rounded-lg",v.length>0?P():(b.innerHTML=`<p class="text-gray-500">No ${e?"active":"expired"} listings</p>`,p.classList.add("hidden"))},P=function(){m.classList.remove("hidden"),p.classList.add("hidden");const e=t.listings*c,i=e+c,l=v.slice(e,i);setTimeout(()=>{l.forEach(d=>{var n;console.log("Listing data:",d);const a=F({...d,seller:{name:o.name},_count:{bids:((n=d.bids)==null?void 0:n.length)||0},bids:d.bids||[]});b.appendChild(a)}),t.listings++,m.classList.add("hidden"),i<v.length&&p.classList.remove("hidden")},500)},k=function(){T.classList.remove("hidden"),h.classList.add("hidden");const e=t.bids*c,i=e+c,l=E.slice(e,i);setTimeout(()=>{l.forEach(d=>{var n;const a=F({...d.listing,bids:[{amount:d.amount}],_count:{bids:((n=d.listing._count)==null?void 0:n.bids)||1},seller:d.listing.seller||{name:"Unknown Seller"}});j.appendChild(a)}),t.bids++,T.classList.add("hidden"),i<E.length&&h.classList.remove("hidden")},500)},S=function(){C.classList.remove("hidden"),L.classList.add("hidden");const e=t.wins*c,i=e+c,l=A.slice(e,i);setTimeout(()=>{l.forEach(d=>{var n;const a=F({...d,seller:{name:((n=d.seller)==null?void 0:n.name)||"Unknown Seller"}});N.appendChild(a)}),t.wins++,C.classList.add("hidden"),i<A.length&&L.classList.remove("hidden")},500)};const{data:o}=await H(s),u=document.querySelector("main");u.innerHTML=O(o);const m=document.getElementById("listings-loader"),b=document.getElementById("listings-container"),p=document.getElementById("load-more-listings"),I=document.getElementById("active-listings-tab"),M=document.getElementById("expired-listings-tab"),x=((g=o.listings)==null?void 0:g.filter(e=>new Date(e.endsAt)>new Date))||[],D=((r=o.listings)==null?void 0:r.filter(e=>new Date(e.endsAt)<=new Date))||[];let v=x;I.addEventListener("click",()=>y(!0)),M.addEventListener("click",()=>y(!1)),x.length>0?y(!0):b.innerHTML='<p class="text-gray-500">No active listings</p>',p.addEventListener("click",P);const T=document.getElementById("bids-loader"),j=document.getElementById("bids-container"),h=document.getElementById("load-more-bids"),{data:w}=await $(s),E=(w==null?void 0:w.filter(e=>new Date(e.listing.endsAt)>new Date).sort((e,i)=>new Date(e.listing.endsAt)-new Date(i.listing.endsAt)))||[];E.length>0?(k(),h.addEventListener("click",k)):j.innerHTML='<p class="text-gray-500">No active bids</p>';const C=document.getElementById("wins-loader"),N=document.getElementById("wins-container"),L=document.getElementById("load-more-wins"),{data:B}=await W(s),A=(B==null?void 0:B.sort((e,i)=>new Date(i.created)-new Date(e.created)))||[];A.length>0?(S(),L.addEventListener("click",S)):N.innerHTML='<p class="text-gray-500">No wins yet</p>',document.getElementById("edit-profile").addEventListener("click",()=>{document.body.insertAdjacentHTML("beforeend",q(o));const e=document.getElementById("edit-profile-modal"),i=document.getElementById("edit-profile-form");document.getElementById("cancel-edit").addEventListener("click",()=>e.remove()),i.addEventListener("submit",async d=>{d.preventDefault();const a={bio:i.querySelector("#edit-bio").value,avatar:{url:i.querySelector("#edit-avatar").value,alt:"Profile avatar"}};try{await R(s,a);const n=document.createElement("div");n.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out",n.textContent="Profile Updated!",document.body.appendChild(n),setTimeout(()=>{n.remove(),window.location.reload()},3e3),e.remove()}catch(n){const f=document.createElement("div");f.className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg",f.textContent=n.message||"Failed to update profile",document.body.appendChild(f),setTimeout(()=>f.remove(),3e3)}})})}catch(o){console.error("Error loading profile:",o)}}export{K as initProfile};
