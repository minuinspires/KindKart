// DOM Elements
const form = document.getElementById('form');
const itemName = document.getElementById('itemName');
const itemDesc = document.getElementById('itemDesc');
const locationInput = document.getElementById('location'); // ✅ Renamed
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

// 🗺️ Initialize Leaflet Map
const map = L.map('map').setView([20.5937, 78.9629], 5); // Centered on India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 🗺️ Add Marker to Map
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
    })
    .catch(err => console.error("Map error:", err));
}

// 🎉 Confetti Celebration
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  } else {
    console.warn("Confetti library not loaded.");
  }
}

// ✅ Success Message
function showSuccessMessage(text) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.style.position = 'fixed';
  msg.style.top = '20px';
  msg.style.left = '50%';
  msg.style.transform = 'translateX(-50%)';
  msg.style.background = '#4caf50';
  msg.style.color = 'white';
  msg.style.padding = '10px 20px';
  msg.style.borderRadius = '8px';
  msg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  msg.style.zIndex = '1000';
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}

// 🟢 Donation Submission
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = itemName.value.trim();
  const desc = itemDesc.value.trim();
  const loc = locationInput.value.trim(); // ✅ Updated

  if (name && desc && loc) {
    const item = { name, desc, location: loc, timestamp: new Date().toLocaleString() };
    addItemToList(item);
    form.reset();
    userActions.donations++;
    triggerConfetti();
    addMapMarker(loc, name, desc);
    showSuccessMessage("🎉 Donation added successfully!");
  }
});

// 🟢 Add Item with Animation
function addItemToList(item) {
  const li = document.createElement('li');
  li.innerHTML = `
    <strong>${item.name}</strong><br/>
    <em>${item.desc}</em><br/>
    📍 ${item.location}<br/>
    🕒 ${item.timestamp}
  `;
  li.style.opacity = '0';
  li.style.transform = 'translateY(20px)';
  itemsList.prepend(li);

  setTimeout(() => {
    li.style.transition = 'all 0.6s ease';
    li.style.opacity = '1';
    li.style.transform = 'translateY(0)';
  }, 50);

  li.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// 🧾 Certificate Export
exportBtn.addEventListener('click', () => {
  const donorName = donorNameInput.value.trim() || "Anonymous";
  const certificate = `
    Kindness Certificate

    Donor: ${donorName}
    Donations Made: ${userActions.donations}
    Date: ${new Date().toLocaleDateString()}

    Thank you for spreading kindness through KindKart!
    Signed with love,
    Minu Antony
    Founder of KindKart
  `;
  const blob = new Blob([certificate], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Kindness_Certificate.txt';
  link.click();
});

// 🖨️ Print Certificate
printBtn.addEventListener('click', () => {
  const donorName = donorNameInput.value.trim() || "Anonymous";
  const htmlContent = `
    <html>
      <head>
        <title>Kindness Certificate</title>
        <style>
          body {
            font-family: 'Quicksand', sans-serif;
            text-align: center;
            padding: 50px;
            background: #fff8dc;
          }
          h1 {
            color: #4caf50;
            font-size: 2.5rem;
          }
          p {
            font-size: 1.2rem;
            margin-top: 20px;
          }
          .box {
            border: 4px dashed #4caf50;
            padding: 40px;
            border-radius: 20px;
            background: #ffffff;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .signature {
            margin-top: 40px;
            font-style: italic;
            font-size: 1rem;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>🌟 Kindness Certificate 🌟</h1>
          <p>This certifies that <strong>${donorName}</strong> has made <strong>${userActions.donations}</strong> donation(s)</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Thank you for spreading kindness through <strong>KindKart</strong>!</p>
          <div class="signature">
            Signed with love,<br>
            <strong>Minu Antony</strong><br>
            Founder of KindKart
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
});

// 💬 Kindness Wall
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const note = noteText.value.trim();
  if (note) {
    const li = document.createElement('li');
    li.textContent = `${note} 🕒 ${new Date().toLocaleString()}`;
    notesList.prepend(li);
    noteText.value = '';
  }
});

// 🤖 Chatbot
sendBtn.addEventListener('click', () => {
  const userMsg = chatInput.value.trim();
  if (userMsg) {
    const msg = document.createElement('div');
    msg.textContent = `🗨️ You: ${userMsg}`;
    chatWindow.appendChild(msg);
    chatInput.value = '';
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
});

voiceBtn.addEventListener('click', () => {
  alert("🎤 Voice input activated (placeholder)");
});

