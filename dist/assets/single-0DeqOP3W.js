import{A as u,h as m,u as y}from"./main-DQHM2U-Z.js";import{a as v}from"./cards-Bn-sZUx-.js";async function x(e,t){var r,l;const n=await fetch(`${u.SINGLE(e)}/bids`,{method:"POST",headers:{...m(),Authorization:`Bearer ${localStorage.getItem("token")}`},body:JSON.stringify({amount:Number(t)})});if(!n.ok){const c=await n.json();throw new Error(((l=(r=c.errors)==null?void 0:r[0])==null?void 0:l.message)||"Failed to place bid")}const o=await n.json(),a=document.createElement("div");return a.className="fixed top-4 right-4 bg-[#E0AFA0] text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300",a.textContent="Bid placed successfully!",document.body.appendChild(a),setTimeout(()=>{a.style.opacity="0",setTimeout(()=>a.remove(),300)},2700),o.credits!==void 0&&y(o.credits),o}async function w(e,t){const n=localStorage.getItem("token");if(!n)throw new Error("You need to be logged in to update a listing.");const o=await fetch(u.SINGLE(e),{method:"PUT",headers:m(n),body:JSON.stringify(t)});if(!o.ok){const a=await o.json();throw new Error(a.message)}return o.json()}async function E(e){const t=localStorage.getItem("token");if(!t)throw new Error("You need to be logged in to delete a listing.");if(!(await fetch(u.SINGLE(e),{method:"DELETE",headers:m(t)})).ok)throw new Error("Failed to delete listing");return!0}function L(e){return`
        <div id="edit-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-brand-body rounded-lg p-6 w-full max-w-xl">
                <h2 class="text-2xl font-semibold text-brand-text mb-4">Edit Listing</h2>
                <form id="edit-form" class="space-y-4">
                    <div>
                        <input type="text" id="edit-title" value="${e.title}"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="Title">
                    </div>
                    
                    <div>
                        <textarea id="edit-description" rows="4"
                                class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                                placeholder="Description">${e.description}</textarea>
                    </div>
                    
                    <div>
                        <input type="text" id="edit-tags" value="${e.tags.join(", ")}"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="Tags (separated by comma)">
                    </div>
                    
                    <div>
                        <input type="text" id="edit-media" value="${e.media.map(t=>t.url).join(", ")}"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="Image URLs (separated by comma)">
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
    `}function $(e=[]){return e.length?`
        <div class="relative w-full" data-carousel-container>
            <div class="overflow-hidden rounded-lg">
                <div class="flex transition-transform duration-300 ease-in-out" data-carousel-track>
                    ${e.map((t,n)=>`
                        <div class="w-full flex-shrink-0">
                            <img src="${t.url}" alt="${t.alt||"Listing Image"}" class="w-full h-auto rounded-lg object-cover">
                        </div>
                    `).join("")}
                </div>
            </div>
            ${e.length>1?`
                <button type="button" class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-[#E0AFA0] hover:text-white transition-colors" data-carousel-prev>←</button>
                <button type="button" class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-[#E0AFA0] hover:text-white transition-colors" data-carousel-next>→</button>
            `:""}
        </div>
    `:'<img src="/src/assets/images/noimage.png" alt="No image available" class="w-full h-auto rounded-lg object-cover">'}function S(){let e=0;const t=document.querySelector("[data-carousel-track]"),n=document.querySelector("[data-carousel-prev]"),o=document.querySelector("[data-carousel-next]");t.style.width=`${t.children.length*100}%`,Array.from(t.children).forEach(r=>{r.style.width=`${100/t.children.length}%`});function a(r){e=r==="next"?(e+1)%t.children.length:(e-1+t.children.length)%t.children.length,t.style.transform=`translateX(-${e*(100/t.children.length)}%)`}n==null||n.addEventListener("click",()=>a("prev"),!0),o==null||o.addEventListener("click",()=>a("next"),!0)}function I(e){var o,a;const n=localStorage.getItem("username")===e.seller.name;return`
        <div class="flex flex-col md:flex-row gap-8 mb-8">
            <div class="w-full md:w-1/2">
                ${$(e.media)}
            </div>
            <div class="w-full md:w-1/2 space-y-4">
                <h1 class="text-3xl font-semibold text-brand-text">${e.title}</h1>
                <p class="text-gray-600">${e.description}</p>
                <div class="flex gap-2">
                    ${e.tags.map(r=>`
                        <span class="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">${r}</span>
                    `).join("")}
                </div>
                <div class="flex items-center gap-3 mt-6">
                    <img src="${((a=(o=e.seller)==null?void 0:o.avatar)==null?void 0:a.url)||"/src/assets/images/auctionpic.png"}" 
                         alt="" 
                         class="w-12 h-12 rounded-full object-cover" />
                    <div class="flex items-center gap-3">
                        <a href="/src/pages/user/index.html?name=${e.seller.name}" 
                           class="text-brand-text hover:underline">${e.seller.name}</a>
                        ${n?`
                            <div class="flex gap-2">
                                <button id="edit-button" 
                                        class="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                                    Edit
                                </button>
                                <button id="delete-button" 
                                        class="bg-red-700 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                                    Delete
                                </button>
                            </div>
                        `:""}
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-[#F4F3EE] rounded-lg p-6 mb-24">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                <div class="space-y-2">
                    <p class="text-brand-text">Auction Created: ${new Date(e.created).toLocaleDateString()}</p>
                    <p class="text-brand-text">Auction Ends: ${v(e.endsAt)}</p>
                    <p class="text-brand-text">Current Bid: ${e._count.bids>0?`${e.bids[e.bids.length-1].amount} credits`:"No bids yet"}</p>
                    <p class="text-brand-text">Highest Bidder: ${e.bids&&e.bids.length>0?e.bids[e.bids.length-1].bidder.name:"No bidder yet"}</p>
                </div>
                <div class="space-y-3">
                    <div class="flex gap-3">
                        <input type="number" 
                               id="bid-amount" 
                               class="p-3 rounded-lg focus:outline-none focus:border-brand-text" 
                               placeholder="Enter bid amount" />
                        <button id="bid-button" 
                                class="bg-[#E0AFA0] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Bid
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `}async function B(){const t=new URLSearchParams(window.location.search).get("id"),n=document.getElementById("listingsLoader");let o;if(!t){window.location.href="/404.html";return}try{n.classList.remove("hidden");const s=await fetch(`${u.SINGLE(t)}?_seller=true&_bids=true`,{headers:m()});if(!s.ok)throw new Error("Failed to fetch listing data");const{data:d}=await s.json();o=d;const g=document.querySelector("main");g.innerHTML=I(o)}catch(s){console.error("Error loading listing:",s),document.querySelector("main").innerHTML="<p class='text-red-500 text-center'>Failed to load listing.</p>"}finally{n.classList.add("hidden")}requestAnimationFrame(()=>{S()});const a=!!localStorage.getItem("token"),r=document.getElementById("bid-button"),l=document.getElementById("bid-amount"),c=document.getElementById("edit-button"),p=document.getElementById("delete-button");a||(r.style.display="none",l.style.display="none"),r&&r.addEventListener("click",async()=>{const s=l.value;try{await x(t,s),setTimeout(()=>{window.location.reload()},3e3)}catch(d){alert(d.message)}}),c&&c.addEventListener("click",()=>{document.body.insertAdjacentHTML("beforeend",L(o));const s=document.getElementById("edit-modal"),d=document.getElementById("edit-form");document.getElementById("cancel-edit").addEventListener("click",()=>{s.remove()}),d.addEventListener("submit",async f=>{f.preventDefault();const h={title:d.querySelector("#edit-title").value,description:d.querySelector("#edit-description").value,tags:d.querySelector("#edit-tags").value.split(",").map(i=>i.trim()).filter(Boolean),media:d.querySelector("#edit-media").value.split(",").map(i=>({url:i.trim(),alt:"Listing image"})).filter(i=>i.url)};try{await w(t,h),b("Listing updated successfully!"),setTimeout(()=>{window.location.reload()},2e3)}catch(i){alert(i.message)}})}),p&&p.addEventListener("click",async()=>{if(confirm("Are you sure you want to delete this listing?"))try{await E(t),b("Listing deleted successfully!"),setTimeout(()=>{window.location.href="/"},2e3)}catch(s){alert(s.message)}})}function b(e){const t=document.createElement("div");t.className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg",t.textContent=e,document.body.appendChild(t),setTimeout(()=>{t.remove()},2e3)}export{B as initListing};
