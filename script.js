document.addEventListener("DOMContentLoaded", function () {
  // 🌍 Initialize Leaflet Map
  const map = L.map('map').setView([20.5937, 78.9629], 5);
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
      });
  }

  // DOM Elements
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

  // 🎉 Confetti Celebration
  function triggerConfetti() {
    if (typeof confetti === 'function') {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }

  // 🟢 Donation Submission
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

  // 🟢 Add Item with Animation
  function addItemToList(item) {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.name}</strong><br/><em>${item.desc}</em><br/>📍 ${item.location}<br/>🕒 ${item.timestamp}`;
    itemsList.prepend(li);
  }

  // 🧾 Certificate Export
  exportBtn.addEventListener('click', () => {
    const donorName = donorNameInput.value.trim() || "Anonymous";
    const html = `
      <html>
      <head><title>Kindness Certificate</title></head>
      <body style="font-family:Quicksand;text-align:center;background:#fff8dc;padding:50px;">
        <h1 style="color:#4caf50;">🌟 Kindness Certificate 🌟</h1>
        <p>This certifies that <strong>${donorName}</strong> has made <strong>${userActions.donations}</strong> donation(s)</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <p>Thank you for spreading kindness through <strong>KindKart</strong>!</p>
        <div style="margin-top:40px;font-style:italic;color:#555;">
          Signed with love,<br><strong>Minu Antony</strong><br>Founder of KindKart
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Kindness_Certificate.html';
    link.click();
  });

  // 🖨️ Print Certificate
  printBtn.addEventListener('click', () => {
    const donorName = donorNameInput.value.trim() || "Anonymous";
    const htmlContent = `
      <html>
        <head><title>Kindness Certificate</title></head>
        <body style="font-family:Quicksand;text-align:center;background:#fff8dc;padding:50px;">
          <h1 style="color:#4caf50;">🌟 Kindness Certificate 🌟</h1>
          <p>This certifies that <strong>${donorName}</strong> has made <strong>${userActions.donations}</strong> donation(s)</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
          <p>Thank you for spreading kindness through <strong>KindKart</strong>!</p>
          <div style="margin-top:40px;font-style:italic;color:#555;">
            Signed with love,<br><strong>Minu Antony</strong><br>Founder of KindKart
          </div>
          <script>window.onload = function() { window.print(); }</script>
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

  // 🤖 Chatbot Logic
  function getBotReply(message) {
    const msg = message.toLowerCase();
    if (msg.includes("kindkart")) {
      return "KindKart is a platform that turns forgotten items into acts of kindness!";
    } else if (msg.includes("how does it work")) {
      return "Just list an item, and KindKart helps connect it to someone who needs it.";
    } else if (msg.includes("who made this")) {
      return "KindKart was created by Minu Antony, an 18-year-old BTech student passionate about kindness and tech!";
    } else {
      return "Thanks for your message! KindKart is here to help.";
    }
  }

  sendBtn.addEventListener('click', () => {
    const userMsg = chatInput.value.trim();
    if (userMsg) {
      const userDiv = document.createElement('div');
      userDiv.textContent = `🗨️ You: ${userMsg}`;
      chatWindow.appendChild(userDiv);

      const botReply = getBotReply(userMsg);
      const botDiv = document.createElement('div');
      botDiv.textContent = `🤖 KindKart: ${botReply}`;
      chatWindow.appendChild(botDiv);

      chatInput.value = '';
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  });

  voiceBtn.addEventListener('click', () => {
    alert("🎤 Voice input activated (placeholder)");
  });
});
