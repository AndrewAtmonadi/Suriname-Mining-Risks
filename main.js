// Initialize the map
var map = L.map('map').setView([4.0, -56.0], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load mining sites data from JSON file
fetch('mining_sites.json')
  .then(response => response.json())
  .then(data => {
    createMapMarkers(data);
    populateLocationList(data);
  })
  .catch(err => {
    console.error('Error loading mining sites:', err);
    // Fallback to sample data if JSON fails
    const sampleData = [
      {
        id: 1,
        name: "Brownsberg Mine",
        lat: 5.0,
        lng: -55.167,
        type: "legal",
        address: "Brownsberg Nature Park",
        district: "Brokopondo",
        contact: "595456",
        hours: "Mon-Fri 08:00 - 16:00",
        riskLevel: "High",
        mercuryLevel: 0.8,
        pollutionIndex: 4
      },
      {
        id: 2,
        name: "Lawa Illegal Mine",
        lat: 4.4,
        lng: -54.0,
        type: "illegal",
        address: "Lawa River Area",
        district: "Sipaliwini",
        contact: "N/A",
        hours: "N/A",
        riskLevel: "Very High",
        mercuryLevel: 1.2,
        pollutionIndex: 5
      }
    ];
    createMapMarkers(sampleData);
    populateLocationList(sampleData);
  });

// Create markers on the map
function createMapMarkers(locations) {
  locations.forEach(location => {
    const markerColor = location.type === 'legal' ? 'green' : 'red';
    const marker = L.circleMarker([location.lat, location.lng], {
      radius: 8,
      color: markerColor,
      fillColor: markerColor,
      fillOpacity: 0.8
    }).addTo(map);
    
    marker.bindPopup(`<b>${location.name}</b><br>Type: ${location.type === 'legal' ? 'Legal' : 'Illegal'}`);
    
    marker.on('click', () => {
      showLocationDetails(location);
      highlightLocationInList(location.id);
    });
  });
}

// Populate the left panel with locations
function populateLocationList(locations) {
  const locationsList = document.getElementById('locations-list');
  locationsList.innerHTML = '';
  
  locations.forEach(location => {
    const listItem = document.createElement('div');
    listItem.className = 'location-item';
    listItem.dataset.id = location.id;
    listItem.innerHTML = `
      <h4>${location.name}</h4>
      <p>${location.district} District • <span class="risk-level ${location.type}">${location.riskLevel}</span></p>
    `;
    
    listItem.addEventListener('click', () => {
      showLocationDetails(location);
      map.setView([location.lat, location.lng], 12);
      highlightLocationInList(location.id);
    });
    
    locationsList.appendChild(listItem);
  });
}

// Show location details in right panel
function showLocationDetails(location) {
  const detailsPanel = document.getElementById('location-details');
  detailsPanel.innerHTML = `
    <h3>${location.name}</h3>
    <p><strong>Address:</strong> ${location.address}</p>
    <p><strong>District:</strong> ${location.district}</p>
    <p><strong>Contact:</strong> ${location.contact}</p>
    <p><strong>Hours:</strong> ${location.hours}</p>
    <p><strong>Type:</strong> <span class="${location.type}">${location.type === 'legal' ? 'Legal Operation' : 'Illegal Operation'}</span></p>
    <p><strong>Risk Level:</strong> <span class="risk-level ${location.type}">${location.riskLevel}</span></p>
    <p><strong>Mercury Level:</strong> ${location.mercuryLevel} ppm</p>
    <p><strong>Pollution Index:</strong> ${'★'.repeat(location.pollutionIndex)}</p>
    <a href="#" class="view-map-btn" data-lat="${location.lat}" data-lng="${location.lng}">VIEW ON MAP</a>
  `;
  
  // Add click event to view on map button
  detailsPanel.querySelector('.view-map-btn').addEventListener('click', (e) => {
    e.preventDefault();
    map.setView([location.lat, location.lng], 12);
  });
}

// Highlight location in list
function highlightLocationInList(id) {
  document.querySelectorAll('.location-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.id === id.toString()) {
      item.classList.add('active');
    }
  });
}

// Search functionality
document.getElementById('search-input')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll('.location-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'block' : 'none';
  });
});

// Contact form handling
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const responseDiv = document.getElementById('formResponse');
  responseDiv.textContent = 'Thank you for your message! I will get back to you soon.';
  responseDiv.style.display = 'block';
  this.reset();
  
  setTimeout(() => {
    responseDiv.style.display = 'none';
  }, 5000);
});

// Create pollution gradient squares
function createPollutionSquares() {
  const centers = [
    {lat:5.0, lng:-55.167}, {lat:5.077, lng:-55.157}, 
    {lat:4.592, lng:-54.404}, {lat:4.9, lng:-56.5}
  ];
  
  centers.forEach(center => {
    [5, 10, 15, 20].forEach((r, i) => {
      const colors = ['#800000','#cc3300','#ff6600','#ff9933'];
      createRiskSquare(center.lat, center.lng, r, colors[i], 0.4 - (i * 0.1));
    });
  });
}

function createRiskSquare(lat, lng, sizeKm, color, opacity) {
  const latOffset = sizeKm / 111;
  const lngOffset = sizeKm / (111 * Math.cos(lat * Math.PI / 180));
  const bounds = [
    [lat - latOffset, lng - lngOffset],
    [lat + latOffset, lng + lngOffset]
  ];
  L.rectangle(bounds, {color, weight:1, fillColor:color, fillOpacity:opacity}).addTo(map);
}

// Initialize pollution squares
createPollutionSquares();
