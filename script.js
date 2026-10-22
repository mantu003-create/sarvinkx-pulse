const $ = (s) => document.querySelector(s);
const starterApps = [
  {id:"chatgpt",name:"ChatGPT",icon:"✳",type:"AI assistant",url:"https://chatgpt.com",color:"green"},
  {id:"gemini",name:"Gemini",icon:"✦",type:"AI assistant",url:"https://gemini.google.com",color:"blue"},
  {id:"youtube",name:"YouTube",icon:"▶",type:"Video",url:"https://youtube.com",color:"orange"},
  {id:"github",name:"GitHub",icon:"⌘",type:"Code & projects",url:"https://github.com",color:"purple"},
  {id:"vscode",name:"VS Code",icon:"〈/〉",type:"Code editor",url:"",color:"blue"},
  {id:"n8n",name:"n8n",icon:"⌘",type:"Automation",url:"https://n8n.io",color:"pink"},
  {id:"canva",name:"Canva",icon:"◉",type:"Design",url:"https://canva.com",color:"purple"},
  {id:"notion",name:"Notion",icon:"N",type:"Workspace",url:"https://notion.so",color:"cyan"},
  {id:"antigravity",name:"Antigravity",icon:"✧",type:"AI coding",url:"",color:"pink"}
];
const read = (key, fallback) => { try { const x=localStorage.getItem(key); return x===null?fallback:JSON.parse(x); } catch { return fallback; } };
let apps = read("pulse.apps", starterApps);
let tasks = read("pulse.tasks", [
  {id:1,text:"Learn one useful AI tool",done:false},
  {id:2,text:"Build a small project feature",done:false},
  {id:3,text:"Spend 25 minutes on freelancing",done:false}
]);
function save(key,value){localStorage.setItem(key,JSON.stringify(value));}
function updateClock(){
  const now=new Date();
  $("#clock").innerHTML=now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit",hour12:true}).replace(/\\s?(AM|PM)/, "<span>$1</span>");
  $("#date").textContent=now.toLocaleDateString([], {weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const h=now.getHours(); $("#greeting").textContent=(h<12?"Good morning":h<18?"Good afternoon":"Good evening")+", Mantu.";
  $("#year").textContent=now.getFullYear();
}
function renderApps(){
  const grid=$("#appGrid"); grid.innerHTML="";
  apps.forEach(app=>{
    const tile=document.createElement("div"); tile.className="app-tile"; tile.dataset.color=app.color||"blue"; tile.tabIndex=0; tile.setAttribute("role","link");
    tile.innerHTML=`<button class="remove-app" title="Remove shortcut" aria-label="Remove ${escapeHtml(app.name)}">×</button><div class="app-icon">${escapeHtml(app.icon||"✦")}</div><strong>${escapeHtml(app.name)}</strong><div class="app-type">${escapeHtml(app.type|| (app.url?"Website":"Local app"))}</div>`;
    const open=()=>{if(app.url){window.open(app.url,"_blank","noopener,noreferrer");}else{alert(`${app.name} is a local Windows app. This browser version cannot launch local programs yet. The desktop version needs a secure native launcher integration.`)}};
    tile.addEventListener("click",e=>{if(e.target.closest(".remove-app"))return;open()});
    tile.addEventListener("keydown",e=>{if(e.key==="Enter")open()});
    tile.querySelector(".remove-app").addEventListener("click",e=>{e.stopPropagation();apps=apps.filter(a=>a.id!==app.id);save("pulse.apps",apps);renderApps()});
    grid.appendChild(tile);
  });
  const add=document.createElement("button");add.className="app-tile add-tile";add.innerHTML='<div class="app-icon">＋</div><strong>Add app</strong><div class="app-type">Customize shortcuts</div>';add.onclick=()=>$("#appDialog").showModal();grid.appendChild(add);
}
function renderTasks(){
  const list=$("#taskList");list.innerHTML="";
  tasks.forEach(task=>{
    const li=document.createElement("li");li.className="task-row"+(task.done?" done":"");
    li.innerHTML=`<input type="checkbox" ${task.done?"checked":""} aria-label="Complete task"><span>${escapeHtml(task.text)}</span><button class="delete-task" aria-label="Delete task">×</button>`;
    li.querySelector("input").onchange=e=>{task.done=e.target.checked;save("pulse.tasks",tasks);renderTasks()};
    li.querySelector(".delete-task").onclick=()=>{tasks=tasks.filter(t=>t.id!==task.id);save("pulse.tasks",tasks);renderTasks()};
    list.appendChild(li);
  });
  const done=tasks.filter(t=>t.done).length;$("#taskCount").textContent=tasks.length;$("#progressLabel").textContent=`${done} of ${tasks.length} tasks complete`;$("#progressBar").style.width=(tasks.length?done/tasks.length*100:0)+"%";
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("#taskForm").addEventListener("submit",e=>{e.preventDefault();const text=$("#taskInput").value.trim();if(!text)return;tasks.push({id:Date.now(),text,done:false});save("pulse.tasks",tasks);$("#taskInput").value="";renderTasks()});
$("#quickNote").value=read("pulse.note","");
$("#quickNote").addEventListener("input",()=>{save("pulse.note",$("#quickNote").value);$("#saveStatus").textContent="Saving locally…";clearTimeout(window.noteSaveTimer);window.noteSaveTimer=setTimeout(()=>$("#saveStatus").textContent="Saved on this device",350)});
$("#appForm").addEventListener("submit",e=>{e.preventDefault();const name=$("#appName").value.trim();if(!name)return;const url=$("#appUrl").value.trim();apps.push({id:"app-"+Date.now(),name,icon:$("#appIcon").value.trim()||"✦",type:url?"Website":"Local app",url,color:$("#appColor").value});save("pulse.apps",apps);renderApps();$("#appDialog").close();$("#appForm").reset();$("#appIcon").value="✦"});
$("#closeDialog").onclick=()=>$("#appDialog").close();$("#cancelDialog").onclick=()=>$("#appDialog").close();
$("#themeBtn").onclick=()=>document.body.classList.toggle("glow-off");
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>{const view=b.dataset.goto;if(view==="apps")$("#appGrid").scrollIntoView({behavior:"smooth",block:"center"});else if(view==="tasks")$("#taskForm").scrollIntoView({behavior:"smooth",block:"center"})}));
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");const v=b.dataset.view;if(v==="apps")$("#appGrid").scrollIntoView({behavior:"smooth"});else if(v==="tasks")$("#taskForm").scrollIntoView({behavior:"smooth"});else if(v==="news")$("#newsList").scrollIntoView({behavior:"smooth"});else window.scrollTo({top:0,behavior:"smooth"})}));
const demoNews=[["AI","News feed not connected","Add a trusted RSS/API source to show real, dated AI headlines.","Setup"],["TOOLS","Tool discovery","Track new coding agents, research tools and open-source releases.","Demo"],["OPEN SOURCE","GitHub releases","Connect release feeds for projects you follow.","Demo"]];
function renderDemoNews(){const list=$("#newsList");list.innerHTML="";demoNews.forEach(item=>{const el=document.createElement("div");el.className="news-item";el.innerHTML=`<span class="news-icon">${item[0]}</span><div><strong>${item[1]}</strong><p>${item[2]}</p></div><span class="news-time">${item[3]}</span>`;list.appendChild(el)})}
$("#refreshNews").onclick=()=>{renderDemoNews();$("#refreshNews").textContent="Checked ✓";setTimeout(()=>$("#refreshNews").textContent="Refresh ↻",1400)};
updateClock();setInterval(updateClock,1000);renderApps();renderTasks();renderDemoNews();