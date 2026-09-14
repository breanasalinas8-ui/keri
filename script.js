const posts=[
{id:1,video:"videos/jollibee.mp4",creator:"Jollibee Mukbang PH",handle:"@jollibeeph",initial:"J",caption:"JOLLIBEE MUKBANG 🍗🍝 | Keri mo ba 'to?",hash:"#Jollibee #Mukbang #FoodTokPH",likes:18200,comments:["Ang sarap!","Chickenjoy supremacy 😂"],products:[["🍗","2-pc Chickenjoy w/ Rice","2 pieces + rice",189],["🍝","Jolly Spaghetti","Sweet-style spaghetti",60],["🍦","Sundae Twirl","Classic soft-serve",50],["🍟","Regular Fries","Classic fries",55],["🥤","Regular Coke","16 oz",45]]},
{id:2,video:"videos/chick-chicken.mp4",creator:"Chick Chicken",handle:"@chickchickenph",initial:"C",caption:"Four flavors of chicken tenders. Which one?",hash:"#ChickChicken #Tenders",likes:12400,comments:["Buffalo for me!","Salted egg 🔥"],products:[["🍗","Buffalo Tenders","Glazed buffalo",220],["🌶️","Nashville Tenders","Spicy Nashville",220],["🍯","Sweet BBQ Tenders","Sweet BBQ glaze",220],["🥚","Salted Egg Tenders","Savory salted egg",230]]},
{id:3,video:"videos/kafoodtrip.mp4",creator:"KaFoodTrip",handle:"@kafoodtrip",initial:"K",caption:"One whole fried chicken + extra rice. Keri?",hash:"#KaFoodTrip #PinoyFood",likes:9800,comments:["Sulit!","Need this tonight"],products:[["🍗","Whole Fried Chicken","1 whole crispy chicken",499],["🍚","Add-on Rice","Extra steamed rice",35]]},
{id:4,video:"videos/pattie-dough.mp4",creator:"Pattie & Dough",handle:"@pattieanddough",initial:"P",caption:"Mozzarella overload! 🍔🍗",hash:"#PattieAndDough #FoodPH",likes:15100,comments:["That cheese pull!","Ordering this"],products:[["🍔","Mozzarella Pizza Burger","Signature mozzarella burger",249],["🍗","8pc Chicken Original","8 pieces original",499],["🧀","Mozzarella","Extra mozzarella",70]]}
];

const fashion={id:"fashion",video:"videos/bsco.mp4",creator:"BSCO Manila",handle:"@bscomanila",initial:"B",caption:"Which look would you wear? Local fashion, made to stand out.",hash:"#BSCOManila #FilipinoFashion",likes:128,comments:["The Jasmine dress!","Love this local brand."],products:[
["👗","Jasmine Bubble Mini Dress","₱1,049",1049,"images/jasmine-bubble-dress.jpg"],
["👗","Octavia Mesh Short Dress","₱999",999,"images/octavia-mesh-dress.jpg"],
["👗","Belle Limited Satin Dress","₱1,199",1199,"images/belle-satin-dress.jpg"],
["👗","Lavina Fleur Mini Dress","₱1,099",1099,"images/lavina-fleur-dress.jpg"],
["🧥","Elvio Set — Hoodie & Flare Pants","₱1,499",1499,"images/elvio-set.jpg"]
]};

let cart=JSON.parse(localStorage.keriCart||"[]");
let orders=JSON.parse(localStorage.keriOrders||"[]");
let following=JSON.parse(localStorage.keriFollowing||"[]");
let referrals=Number(localStorage.keriReferrals||0);
let voucherApplied=false;
let current=null;
const $=id=>document.getElementById(id);
const peso=n=>"₱"+Number(n).toLocaleString("en-PH");

function save(){
  localStorage.keriCart=JSON.stringify(cart);
  localStorage.keriOrders=JSON.stringify(orders);
  localStorage.keriFollowing=JSON.stringify(following);
  $("cartBadge").textContent=cart.reduce((sum,x)=>sum+x.qty,0);
}
function toast(text){
  $("toast").textContent=text;$("toast").classList.add("show");
  clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$("toast").classList.remove("show"),1800);
}
function burst(container){
  const h=document.createElement("div");h.className="heart-burst";h.textContent="♥";container.appendChild(h);
  requestAnimationFrame(()=>h.classList.add("pop"));setTimeout(()=>h.remove(),900);
}
function renderPost(p){
  const isFollowing=following.includes(p.creator);
  return `<article class="post" data-id="${p.id}">
    <div class="post-head"><div class="avatar">${p.initial}</div><div class="creator"><b>${p.creator}</b><small>${p.handle}</small></div><button class="follow ${isFollowing?"following":""}" data-follow>${isFollowing?"Following":"Follow"}</button></div>
    <div class="video-wrap"><video class="post-video" src="${p.video}" muted loop playsinline preload="metadata"></video><div class="paused-icon hidden">▶</div><div class="video-overlay"><div class="caption">${p.caption}</div><div class="hash">${p.hash}</div></div></div>
    <div class="actions"><button data-like>♥ <b>${p.likes.toLocaleString()}</b></button><button data-comment>💬 <b>${p.comments.length}</b></button><button data-save>🔖</button><button data-share>↗</button></div>
    <div class="shop-row"><div class="shop-icon">🛒</div><div class="shop-copy"><b>${p.products.length} items featured</b><small>${p.products.slice(0,2).map(x=>x[1]).join(" • ")}${p.products.length>2?" • more":""}</small></div><button class="order-btn" data-order>YELLOW BASKET</button></div>
  </article>`;
}
function renderHome(mode){
  setActiveTab(mode);
  if(mode==="live"){
    $("feed").innerHTML=`<div class="live-page"><div class="live-heading"><div class="live-dot">🔴</div><div><small>LIVE NOW</small><h2>Local creators are live</h2></div></div>
    ${["Tonight's Food Crawl|1.8K watching • Manila","Jollibee Mukbang Live|934 watching","Chick Chicken Kitchen Live|612 watching • Quezon City"].map(x=>{let [a,b]=x.split("|");return `<div class="live-card"><span class="live-avatar">🔴</span><div class="live-copy"><b>${a}</b><small>${b}</small></div><button class="join" data-join-live>Join</button></div>`}).join("")}</div>`;
  }else if(mode==="following"){
    const list=posts.filter(p=>following.includes(p.creator));
    $("feed").innerHTML=list.length?list.map(renderPost).join(""):`<div class="following-empty"><div class="big">♡</div><h2>Your Following feed</h2><p>Follow local creators and their videos will appear here.</p><button class="primary" data-find-creators>Find creators</button></div>`;
    wireVideos();
  }else{
    $("feed").innerHTML=posts.map(renderPost).join("");
    wireVideos();
  }
}
function setActiveTab(name){
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
}
function switchScreen(name){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(name==="feed"?"feedScreen":name==="search"?"searchScreen":name==="orders"?"ordersScreen":"profileScreen").classList.add("active");
  
  window.scrollTo(0,0);
}
function setTab(name){
  if(name==="search"){
    setActiveTab("search");switchScreen("search");$("searchInput").focus();return;
  }
  switchScreen("feed");renderHome(name);
}
function wireVideos(){
  if(window.videoObserver) window.videoObserver.disconnect();
  document.querySelectorAll(".post-video").forEach(v=>{
    const wrap=v.parentElement;
    const icon=wrap.querySelector(".paused-icon");
    let lastTap=0;

    v.addEventListener("pause",()=>icon && icon.classList.remove("hidden"));
    v.addEventListener("play",()=>icon && icon.classList.add("hidden"));

    v.addEventListener("click",e=>{
      const now=Date.now();
      if(now-lastTap<320){
        e.preventDefault();
        const post=v.closest(".post");
        const p=post ? posts.find(x=>String(x.id)===String(post.dataset.id)) : null;
        if(p && !likedPosts.includes(String(p.id))){
          p.likes++;
          likedPosts.push(String(p.id));
          save();
          const btn=post.querySelector("[data-like]");
          if(btn){
            btn.classList.add("liked");
            const n=btn.querySelector("b");
            if(n)n.textContent=p.likes.toLocaleString();
          }
          burst(wrap);
        }
        lastTap=0;
        return;
      }
      lastTap=now;
      setTimeout(()=>{
        if(Date.now()-lastTap>=300){
          if(v.paused) v.play().catch(()=>{}); else v.pause();
          lastTap=0;
        }
      },320);
    });
  });

  window.videoObserver=new IntersectionObserver(entries=>entries.forEach(en=>{
    const v=en.target;
    if(en.isIntersecting) v.play().catch(()=>{});
    else{
      v.pause();
      const icon=v.parentElement.querySelector(".paused-icon");
      if(icon)icon.classList.add("hidden");
    }
  }),{threshold:.65});
  document.querySelectorAll(".post-video").forEach(v=>window.videoObserver.observe(v));
}
function openProducts(p){
  current=p;$("sheetTitle").textContent=`Shop ${p.creator}`;
  $("productList").innerHTML=p.products.map((x,i)=>`<div class="product"><div class="prod-icon">${x[4]?`<img src="${x[4]}" alt="">`:x[0]}</div><div class="product-info"><b>${x[1]}</b><small>${x[2]}</small></div><div><b>${peso(x[3])}</b><br><button class="add-btn" data-add="${i}">ADD</button></div></div>`).join("");
  $("backdrop").classList.remove("hidden");$("productSheet").classList.remove("hidden");
}
function addItem(x,store){
  const old=cart.find(y=>y.name===x[1]&&y.store===store);
  old?old.qty++:cart.push({name:x[1],price:x[3],emoji:x[0],image:x[4]||"",qty:1,store});
  save();toast(`${x[1]} added to your basket`);
}
function openComments(p){
  current=p;$("commentList").innerHTML=p.comments.map((c,i)=>`<div class="comment"><b>${i%2?"@foodie":"@localfan"}</b> ${c}</div>`).join("");
  $("backdrop").classList.remove("hidden");$("commentsSheet").classList.remove("hidden");
}
function openBasket(){
  $("basketList").innerHTML=cart.length?cart.map((x,i)=>`<div class="product"><div class="prod-icon">${x.image?`<img src="${x.image}" alt="">`:x.emoji}</div><div class="product-info"><b>${x.name}</b><small>${x.store} • Qty ${x.qty}</small></div><div><b>${peso(x.price*x.qty)}</b><br><button class="remove-btn" data-remove="${i}">REMOVE</button></div></div>`).join("")+`<div class="cart-total"><span>Total</span><b>${peso(cart.reduce((a,x)=>a+x.price*x.qty,0))}</b></div><button class="primary" id="checkoutBtn" style="width:100%">Continue to checkout</button>`:`<div class="empty" style="padding:40px;text-align:center;color:#777">Your yellow basket is empty.</div>`;
  $("backdrop").classList.remove("hidden");$("basketSheet").classList.remove("hidden");
}
function closeAll(){
  $("backdrop").classList.add("hidden");
  document.querySelectorAll(".sheet,.modal").forEach(x=>x.classList.add("hidden"));
}
function renderCheckoutReceipt(){
const subtotal=cart.reduce((s,i)=>s+(Number(i.price)||0)*(Number(i.qty)||1),0);
const discount=voucherApplied?Math.min(100,subtotal):0;
const total=Math.max(0,subtotal-discount);
const el=document.getElementById("checkoutItems");
if(el)el.innerHTML=cart.map(i=>`<div class="receipt-item"><div><strong>${i.name}</strong><small>${i.store||""} · ${i.qty||1} × ${peso(i.price)}</small></div><strong>${peso((Number(i.price)||0)*(Number(i.qty)||1))}</strong></div>`).join("");
const s=document.getElementById("checkoutSubtotal"),d=document.getElementById("checkoutDiscount"),t=document.getElementById("checkoutTotal");
if(s)s.textContent=peso(subtotal);if(d)d.textContent=`− ${peso(discount)}`;if(t)t.textContent=peso(total);
}
function openCheckout(){
  if(!cart.length)return toast("Your yellow basket is empty");
  closeAll();$("checkoutModal").classList.remove("hidden");
  $("voucherStatus").textContent=voucherApplied?"₱100 Welcome Voucher applied":"₱100 Welcome Voucher available";
  $("voucherBtn").textContent=voucherApplied?"Applied":"Apply ₱100";
;renderCheckoutReceipt();}
function renderOrders(){
  $("ordersList").innerHTML=orders.length?orders.map(o=>`<div class="order-card"><span class="status">${o.status}</span><small>ORDER #${o.id}</small><h3>${o.items[0]?.store||"KERI"}</h3><p>${o.items.map(x=>x.qty+"× "+x.name).join(" • ")}<br>${o.address}, ${o.city}<br>${o.phone}${o.notes?"<br>Note: "+o.notes:""}</p><footer><span>${o.date}</span><b>${peso(o.total)}</b></footer>${o.status!=="Cancelled"?`<button class="cancel-order" data-cancel="${o.id}">Cancel order</button>`:""}</div>`).join(""):'<div class="order-card" style="text-align:center;color:#777;padding:45px">No orders yet.</div>';
}
function renderProfile(){
  const n=Math.min(10,referrals);$("refFill").style.width=(n*10)+"%";$("refProgress").textContent=`${n}/10 friends joined`;
  $("inviteBtn").textContent=n>=10?"Voucher unlocked":"Invite";
}

$("cartBtn").onclick=openBasket;
$("backdrop").onclick=closeAll;
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=closeAll);

document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));

$("feed").onclick=e=>{
  const post=e.target.closest(".post");
  if(!post)return;
  const p=posts.find(x=>String(x.id)===post.dataset.id);
  if(e.target.closest("[data-order]"))return openProducts(p);
  if(e.target.closest("[data-follow]")){
    if(following.includes(p.creator))following=following.filter(x=>x!==p.creator);else following.push(p.creator);
    save();renderHome("following");toast(following.includes(p.creator)?"Following creator":"Unfollowed creator");return;
  }
  if(e.target.closest("[data-comment]"))return openComments(p);
  if(e.target.closest("[data-save]"))return toast("Saved to your profile");
  if(e.target.closest("[data-share]")){navigator.clipboard?.writeText(location.href);return toast("Link copied")}
};
$("productList").onclick=e=>{const b=e.target.closest("[data-add]");if(b)addItem(current.products[+b.dataset.add],current.creator)};
$("basketList").onclick=e=>{
  const rem=e.target.closest("[data-remove]");if(rem){cart.splice(+rem.dataset.remove,1);save();openBasket();toast("Item removed from basket");return}
  if(e.target.id==="checkoutBtn")openCheckout();
};
$("commentForm").onsubmit=e=>{e.preventDefault();const t=$("commentInput").value.trim();if(!t)return;current.comments.push(t);$("commentInput").value="";openComments(current);toast("Comment posted")};

$("searchInput").oninput=()=>{
  const q=$("searchInput").value.toLowerCase().trim();$("clearSearch").classList.toggle("hidden",!q);
  if(!q){$("searchResults").innerHTML=`<div class="search-title">DISCOVER ON KERI</div><div class="search-empty">Search for food, local creators, brands, or fashion.</div>`;return}
  if(q.includes("fashion")||q.includes("bsco")||q.includes("dress"))renderFashionSearch();
  else{
    const matches=posts.filter(p=>(p.creator+" "+p.caption+" "+p.hash).toLowerCase().includes(q));
    $("searchResults").innerHTML=matches.length?matches.map(renderPost).join(""):`<div class="search-empty">No results yet for “${$("searchInput").value}”. Try one of the popular searches above.</div>`;
    wireVideos();
  }
};
$("clearSearch").onclick=()=>{$("searchInput").value="";$("searchInput").dispatchEvent(new Event("input"));$("searchInput").focus()};
document.querySelector(".search-popular").onclick=e=>{const b=e.target.closest("[data-search-chip]");if(!b)return;$("searchInput").value=b.dataset.searchChip;$("searchInput").dispatchEvent(new Event("input"))};

function renderFashionSearch(){
  setActiveTab("search");
  const f=following.includes(fashion.creator);
  $("searchResults").innerHTML=`<div class="search-title">FASHION • LOCAL BRAND</div><article class="fashion-post">
  <div class="fashion-video-wrap"><video class="fashion-video" src="${fashion.video}" muted loop playsinline autoplay preload="metadata"></video><div class="paused-icon hidden">▶</div><div class="video-overlay"><div class="caption">${fashion.caption}</div><div class="hash">${fashion.hash}</div></div></div>
  <div class="fashion-info"><div class="fashion-head"><div class="fashion-name"><b>${fashion.creator}</b><small>${fashion.handle}</small></div><button class="follow ${f?"following":""}" data-fashion-follow>${f?"Following":"Follow"}</button></div>
  <div class="fashion-caption">Shop the looks featured in this video.</div>
  <div class="fashion-actions"><button data-fashion-like>♥ <span>${fashion.likes}</span></button><button data-fashion-comment>💬 <span>${fashion.comments.length}</span></button><button data-fashion-share>↗</button></div>
  <div class="fashion-products">${fashion.products.map((x,i)=>`<div class="fashion-product"><img src="${x[4]}" alt="${x[1]}"><div><b>${x[1]}</b><small>${x[2]}</small></div><button class="fashion-add" data-fashion-add="${i}">🛒 ADD</button></div>`).join("")}</div></div></article>`;
  const v=document.querySelector(".fashion-video");
  if(v){
    const wrap=v.parentElement, icon=wrap.querySelector(".paused-icon");
    let lastTap=0;
    v.addEventListener("pause",()=>icon && icon.classList.remove("hidden"));
    v.addEventListener("play",()=>icon && icon.classList.add("hidden"));
    v.addEventListener("click",e=>{
      const now=Date.now();
      if(now-lastTap<320){
        e.preventDefault();
        if(!likedPosts.includes("fashion")){
          fashion.likes++;
          likedPosts.push("fashion");
          save();
          const btn=document.querySelector("[data-fashion-like]");
          if(btn){
            btn.classList.add("liked");
            const n=btn.querySelector("span");
            if(n)n.textContent=fashion.likes;
          }
          burst(wrap);
        }
        lastTap=0; return;
      }
      lastTap=now;
      setTimeout(()=>{
        if(Date.now()-lastTap>=300){
          if(v.paused)v.play().catch(()=>{});else v.pause();
          lastTap=0;
        }
      },320);
    });
  }
}
$("searchResults").onclick=e=>{
  const add=e.target.closest("[data-fashion-add]");if(add){addItem(fashion.products[+add.dataset.fashionAdd],fashion.creator);return}
  const like=e.target.closest("[data-fashion-like]");if(like){fashion.likes++;like.querySelector("span").textContent=fashion.likes;like.classList.add("liked");burst(document.querySelector(".fashion-video-wrap"));return}
  const comment=e.target.closest("[data-fashion-comment]");if(comment)return openComments(fashion);
  const share=e.target.closest("[data-fashion-share]");if(share){navigator.clipboard?.writeText(location.href);return toast("Link copied")}
  const follow=e.target.closest("[data-fashion-follow]");if(follow){if(following.includes(fashion.creator))following=following.filter(x=>x!==fashion.creator);else following.push(fashion.creator);save();renderFashionSearch();toast(following.includes(fashion.creator)?"Following BSCO Manila":"Unfollowed BSCO Manila")}
  const post=e.target.closest(".post");if(post&&e.target.closest("[data-like]"))return;
};

$("checkoutForm").onsubmit=e=>{
  e.preventDefault();
  const subtotal=cart.reduce((a,x)=>a+x.price*x.qty,0),discount=voucherApplied?Math.min(100,subtotal):0,total=subtotal-discount;
  const o={id:"K"+Date.now().toString().slice(-7),date:new Date().toLocaleString("en-PH",{dateStyle:"medium",timeStyle:"short"}),name:$("name").value,phone:$("phone").value,address:$("address").value,city:$("city").value,notes:$("notes").value,total,items:[...cart],status:"Preparing your order"};
  orders.unshift(o);cart=[];save();$("checkoutModal").classList.add("hidden");$("successText").textContent=`Order #${o.id} is confirmed for ${o.name}. Total: ${peso(total)}${discount?" • ₱100 voucher applied":""}.`;$("successModal").classList.remove("hidden");voucherApplied=false;
};
$("voucherBtn").onclick=()=>{if(!voucherApplied){voucherApplied=true;renderCheckoutReceipt();$("voucherStatus").textContent="₱100 Welcome Voucher applied";$("voucherBtn").textContent="Applied";toast("₱100 voucher applied")}else toast("Voucher already applied")};
$("viewOrdersBtn").onclick=()=>{$("successModal").classList.add("hidden");switchScreen("orders");setActiveTab("")};
$("inviteBtn").onclick=()=>{if(referrals<10)referrals++;localStorage.keriReferrals=referrals;navigator.clipboard?.writeText("Join KERI — Gutom ka? Keri.");renderProfile();toast(referrals>=10?"Voucher unlocked!":"Invite link copied • "+referrals+"/10")};
$("affiliateBtn").onclick=()=>toast("Affiliate application started");
$("ordersScreen").addEventListener("click",e=>{const c=e.target.closest("[data-cancel]");if(!c)return;const o=orders.find(x=>x.id===c.dataset.cancel);if(o){o.status="Cancelled";save();renderOrders();toast("Order cancelled")}});

document.addEventListener("click",e=>{if(e.target.closest("[data-join-live]"))toast("Joining LIVE…");if(e.target.closest("[data-find-creators]"))setTab("for-you")});

renderHome("for-you");renderOrders();renderProfile();save();

/* KERI guided bottom navigation handler */
document.addEventListener("click",function(e){
const b=e.target.closest("[data-bottom]");if(!b)return;
document.querySelectorAll("[data-bottom]").forEach(x=>x.classList.remove("active"));b.classList.add("active");
const k=b.dataset.bottom;
if(k==="home"){if(typeof setTab==="function")setTab("for-you");}
else if(k==="orders"){if(typeof switchScreen==="function")switchScreen("orders");if(typeof renderOrders==="function")renderOrders();}
else if(k==="profile"){if(typeof switchScreen==="function")switchScreen("profile");if(typeof renderProfile==="function")renderProfile();}
else if(k==="create"){if(typeof toast==="function")toast("Create a post on KERI");}
else if(k==="inbox"){if(typeof toast==="function")toast("Inbox is ready");}
});
