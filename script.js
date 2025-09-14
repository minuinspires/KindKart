const locationInput = document.getElementById('location');
const form = document.getElementById('form');
const itemName = document.getElementById('itemName');
const itemDesc = document.getElementById('itemDesc');
const itemsList = document.getElementById('items');
const exportBtn = document.getElementById('exportBtn');
const printBtn = document.getElementById('printBtn');
const donorNameInput = document.getElementById('donorName');
const noteForm = document.getElementById('noteForm');
const noteText = document.getElementById('noteText');
const notesList = document.getElementById('notesList');
const chatWindow = document.getElementById('chatWindow');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');

let userActions = { donations: 0 };

// Map
const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function addMapMarker(location, name, desc) {
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const { lat, lon } = data[0];
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup(`<strong>${name}</strong><br>${desc}<br>${location}`)
          .openPopup();
      }
    });
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = itemName.value.trim();
  const desc = itemDesc.value.trim();
  const loc = locationInput.value.trim();

  if (name && desc && loc) {
    const item = { name, desc, location: loc, timestamp: new Date().toLocaleString() };
    addItemToList(item);
    form.reset();
    userActions.donations++;
    triggerConfetti();
    addMapMarker(loc, name, desc);
  }
});

function addItemToList(item) {
  const li = document.createElement('li');
  li.innerHTML = `<strong>${item.name}</strong><br/><em>${item.desc}</em><br/>📍 ${item.location}<br/>🕒 ${item.timestamp}`;
  itemsList.prepend(li);
}

exportBtn.addEventListener('click', () => {
  const donorName = donorNameInput.value.trim() || "Anonymous";
  const html = `
    <html>
    <head><title>Kindness Certificate</title></head>
    <body style="font-family:Quicksand;text-align:center;background:#fff8dc;padding:50px;">
      <h1 style="color:#4caf50;">🌟 Kindness Certificate 🌟</h1>
      <p>This certifies that <strong>${donorName}</strong> has made <strong>${userActions.donations}</strong> donation(s)</p>
      <p>Date: ${new Date().to