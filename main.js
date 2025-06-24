// Initialize map with scroll wheel disabled by default
var map = L.map('map', {
  scrollWheelZoom: false,
  zoomControl: false
}).setView([4.0, -56.0], 7);

// Add zoom control with specific position
L.control.zoom({
  position: 'topright'
}).addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Disable map zoom when scrolling page
map.scrollWheelZoom.disable();

// Legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML = `
  <strong>Map Legend</strong><br/>
  <span style="color:green">●</span> Legal mine<br/>
  <span style="color:red">●</span> Illegal mine<br/>
  <span style="color:#800000">■</span> High pollution<br/>
  <span style="color:#ff9933">■</span> Low pollution<br/>
  <span style="color:red">Heat</span> = Mercury zones
  `;
  return div;
};
legend.addTo(map);

// Load mining sites data
fetch('mining_sites.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(site => {
      var markerColor = site.type === 'legal' ? 'green' : 'red';
      var marker = L.circleMarker([site.lat, site.lng], {
        radius: 8,
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.8
      }).addTo(map);
      marker.bindPopup(`<strong>${site.name}</strong><br>Type: ${site.type}`);
    });
  })
  .catch(err => console.error('Error loading mining sites:', err));

// Gradient pollution zones around key sites (squares fading out)
function createRiskSquare(lat, lng, sizeKm, color, opacity) {
  const latOffset = sizeKm / 111;
  const lngOffset = sizeKm / (111 * Math.cos(lat * Math.PI / 180));
  const bounds = [
    [lat - latOffset, lng - lngOffset],
    [lat + latOffset, lng + lngOffset]
  ];
  L.rectangle(bounds, { color, weight: 1, fillColor: color, fillOpacity: opacity }).addTo(map);
}

// Example for Brownsberg & Lawa
[ {lat:5.0, lng:-55.167}, {lat: 5.077, lng: -55.157}, {lat: 4.592, lng: -54.404}, {lat: 4.900, lng: -56.500}, {lat: 5.000, lng: -55.367}, {lat: 4.800, lng: -56.000}, {lat: 5.000, lng: -54.600} ].forEach(center => {
  [5, 10, 15, 20].forEach((r, i) => {
    const colors = ['#800000','#cc3300','#ff6600','#ff9933'];
    createRiskSquare(center.lat, center.lng, r, colors[i], 0.4 - (i * 0.1));
  });
});

// Heatmap layer using estimated mercury data
const heatPoints = [
  [5.0, -55.167, 0.9], // Brownsberg high contamination
  [4.4, -54.0, 1.0],   // Lawa illegal dredging hotspot
  [5.077, -55.157, 0.4], // Rosebel industrial
];
L.heatLayer(heatPoints, {
  radius: 30,
  blur: 20,
  gradient: {0.2:'yellow',0.5:'orange',1:'red'},
  maxZoom: 12
}).addTo(map);

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value
  };
  
  console.log('Form submitted:', formData);
  
  const responseDiv = document.getElementById('formResponse');
  responseDiv.textContent = 'Thank you for your message! I will get back to you soon.';
  responseDiv.style.display = 'block';
  
  this.reset();
  
  setTimeout(() => {
    responseDiv.style.display = 'none';
  }, 5000);
});

// Make sure map doesn't interfere with page scrolling
document.getElementById('map').addEventListener('wheel', function(e) {
  if (!map.scrollWheelZoom.enabled()) {
    e.stopPropagation();
  }
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
    to: 'andrewisjeatmo@gmail.com',
    subject: 'Message from Suriname Mining Map'
  };
  
  // In a real application, you would send this to a server
  // Here's a simulated version that would work with a server:
  console.log('Email would be sent to:', formData.to);
  console.log('Subject:', formData.subject);
  console.log('From:', formData.email);
  console.log('Message:', formData.message);
  
  // Show success message
  const responseDiv = document.getElementById('formResponse');
  responseDiv.textContent = 'Thank you for your message! I will get back to you soon.';
  responseDiv.style.display = 'block';
  responseDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
  responseDiv.style.borderLeft = '4px solid #4CAF50';
  
  // Reset form
  this.reset();
  
  // Hide message after 5 seconds
  setTimeout(() => {
    responseDiv.style.display = 'none';
  }, 5000);
});