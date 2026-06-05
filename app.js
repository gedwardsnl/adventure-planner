
function saveDream(){
  const text = document.getElementById('dreamText')?.value || '';
  localStorage.setItem('adventureDream', text);
  alert('Dream saved locally on this device.');
}

const tripBudget = 2100;
const spentSoFar = 1140;
const baselineForecast = 2020;
const plannedSleep = 18;
const plannedFood = 12;

const sleepOptions = [
  {name:"Waterfront campsite", type:"Camping", cost:18, rating:"★★★★☆", text:"Best budget choice. Good if rain holds off.", tags:["Shoestring","Tent pitch"]},
  {name:"Simple cabin", type:"Cabin", cost:55, rating:"★★★★☆", text:"Best weather backup. Dry gear and sleep better.", tags:["Rain backup","Still sensible"]},
  {name:"Sea-view cabin", type:"Cabin", cost:65, rating:"★★★★★", text:"Treat option. More comfort, more budget pressure.", tags:["Comfort","Sea view"]},
  {name:"Rider-friendly hotel", type:"Hotel", cost:110, rating:"★★★★☆", text:"Secure parking and breakfast, but high cost.", tags:["Secure parking","Comfort"]}
];

const foodCategories = {
  Budget:[
    {name:"Supermarket picnic + campsite cook-up", cost:8, rating:"★★★★☆", text:"Best way to recover budget.", tags:["Cheapest","Self-cater"]},
    {name:"Harbour fish snack", cost:14, rating:"★★★★☆", text:"Local and still affordable.", tags:["Local","Quick"]}
  ],
  Local:[
    {name:"Norwegian seafood cafe", cost:28, rating:"★★★★☆", text:"Best local experience if you are under budget.", tags:["Seafood","Local"]},
    {name:"Simple diner meal", cost:20, rating:"★★★★", text:"Good compromise between budget and comfort.", tags:["Easy","Filling"]}
  ],
  Pizza:[
    {name:"Town pizzeria", cost:19, rating:"★★★★☆", text:"Good tired-rider option.", tags:["Easy","Filling"]},
    {name:"Takeaway pizza", cost:15, rating:"★★★★", text:"Cheaper comfort food.", tags:["Budget","Takeaway"]}
  ],
  Indian:[
    {name:"Top-rated Indian nearby", cost:25, rating:"★★★★☆", text:"Nice treat if weather has made the day harder.", tags:["Treat","Spicy"]},
    {name:"Budget curry takeaway", cost:17, rating:"★★★★", text:"Better for budget control.", tags:["Budget","Takeaway"]}
  ],
  Thai:[
    {name:"Thai restaurant", cost:24, rating:"★★★★☆", text:"Good comfort meal option.", tags:["Treat","Restaurant"]},
    {name:"Thai takeaway", cost:16, rating:"★★★★", text:"Cheaper option if available.", tags:["Takeaway","Budget"]}
  ]
};

let selectedSleep = sleepOptions[0];
let selectedFood = foodCategories.Budget[0];
let selectedCategory = "Budget";

function renderSleep(){
  const el = document.getElementById("sleepOptions");
  if(!el) return;
  el.innerHTML = "";
  sleepOptions.forEach(o=>{
    const div = document.createElement("div");
    div.className = "option " + (selectedSleep.name===o.name ? "selected " : "") + (o.cost>70 ? "warn" : o.cost<=20 ? "good" : "");
    div.onclick = ()=>{ selectedSleep=o; updateAll(); };
    div.innerHTML = `<div class="top"><h3>${o.type}: ${o.name}</h3><span class="price">£${o.cost}</span></div>
      <p>${o.rating} · ${o.text}</p>${o.tags.map(t=>`<span class="tag">${t}</span>`).join("")}`;
    el.appendChild(div);
  });
}

function renderFoodTabs(){
  const el = document.getElementById("foodTabs");
  if(!el) return;
  el.innerHTML = "";
  Object.keys(foodCategories).forEach(cat=>{
    const tab = document.createElement("span");
    tab.className = "tab " + (cat===selectedCategory ? "active" : "");
    tab.textContent = cat;
    tab.onclick = ()=>{ selectedCategory=cat; selectedFood=foodCategories[cat][0]; updateAll(); };
    el.appendChild(tab);
  });
}

function renderFood(){
  const el = document.getElementById("foodOptions");
  if(!el) return;
  el.innerHTML = "";
  foodCategories[selectedCategory].forEach(o=>{
    const div = document.createElement("div");
    div.className = "option " + (selectedFood.name===o.name ? "selected " : "") + (o.cost<=10 ? "good" : o.cost>=24 ? "warn" : "");
    div.onclick = ()=>{ selectedFood=o; updateAll(); };
    div.innerHTML = `<div class="top"><h3>${o.name}</h3><span class="price">£${o.cost}</span></div>
      <p>${o.rating} · ${o.text}</p>${o.tags.map(t=>`<span class="tag">${t}</span>`).join("")}`;
    el.appendChild(div);
  });
}

function updateBudget(){
  if(!document.getElementById("todaySpend")) return;
  const today = selectedSleep.cost + selectedFood.cost + 20;
  const delta = (selectedSleep.cost - plannedSleep) + (selectedFood.cost - plannedFood);
  const forecast = baselineForecast + delta;
  const margin = tripBudget - forecast;
  const percent = Math.min(100, Math.max(0, (forecast/tripBudget)*100));
  document.getElementById("todaySpend").textContent = today;
  document.getElementById("forecast").textContent = forecast;
  document.getElementById("budgetBar").style.width = percent + "%";
  const status = document.getElementById("budgetStatus");
  const advice = document.getElementById("budgetAdvice");
  const panel = document.getElementById("budgetDecision");
  const panelTitle = document.getElementById("budgetDecisionTitle");
  const panelText = document.getElementById("budgetDecisionText");
  if(margin >= 50){
    status.className = "status green";
    status.textContent = `🟢 On track — forecast £${margin} under budget.`;
    advice.className = "status green";
    advice.innerHTML = `<b>Decision:</b> This choice is affordable. You still have room for occasional cabins or restaurant meals.`;
    if(panel){panel.className="decision-panel"; panelTitle.textContent=`🟢 £${margin} under budget`; panelText.textContent="This is a comfortable choice. The adventure fund remains healthy.";}
  } else if(margin >= 0){
    status.className = "status amber";
    status.textContent = `🟠 Tight but okay — forecast £${margin} under budget.`;
    advice.className = "status amber";
    advice.innerHTML = `<b>Decision:</b> Allowed, but future spending becomes more rigid. Favour camping and budget food for the next few days.`;
    if(panel){panel.className="decision-panel tight"; panelTitle.textContent=`🟠 Only £${margin} margin left`; panelText.textContent="You can choose this, but the next few days should be more disciplined.";}
  } else {
    const over = Math.abs(margin);
    status.className = "status red";
    status.textContent = `🔴 Over plan — forecast £${over} over budget.`;
    const campNights = Math.ceil(over / 40);
    const foodSave = Math.ceil(over / 9);
    advice.className = "status red";
    advice.innerHTML = `<b>Recovery options:</b><br>• Camp ${campNights} future night(s) instead of cabins<br>• Reduce food spend by about £${foodSave}/day for the next 9 days<br>• Accept a revised trip budget of £${forecast}`;
    if(panel){panel.className="decision-panel over"; panelTitle.textContent=`🔴 £${over} over plan`; panelText.textContent="The app will not stop the adventure. It flags the impact and suggests recovery choices.";}
  }
}

function updateAll(){
  renderSleep();
  renderFoodTabs();
  renderFood();
  updateBudget();
}
document.addEventListener("DOMContentLoaded", updateAll);
