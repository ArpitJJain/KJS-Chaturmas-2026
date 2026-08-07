fetch('data/home.json').then(r=>r.json()).then(d=>{
document.getElementById('announce').innerText=d.announcement;
document.getElementById('date').innerText=d.date;
document.getElementById('family').innerText=d.todayFamily;
document.getElementById('kalash').innerText=d.kalash;
document.getElementById('location').innerText=d.location;
});