// Existing code for charts and dropdown...

const yearSelect = document.getElementById('year-select');

const dataByYear = {
  2023: {
    adoption: [60, 40, 45, 25, 20],
    types: [38, 28, 17, 9, 8]
  },
  2024: {
    adoption: [65, 42, 47, 27, 22],
    types: [39, 27, 16, 10, 8]
  },
  2025: {
    adoption: [70, 45, 50, 30, 25],
    types: [40, 25, 15, 10, 10]
  }
};

const ctx1 = document.getElementById('robot-adoption-chart').getContext('2d');
const robotAdoptionChart = new Chart(ctx1, {
  type: 'bar',
  data: {
    labels: ['Manufacturing', 'Healthcare', 'Logistics', 'Agriculture', 'Retail'],
    datasets: [{
      label: '% Adoption',
      data: dataByYear[2023].adoption,
      backgroundColor: '#a5c8ff',
      borderRadius: 6,
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: val => val + '%' }
      }
    },
    plugins: { legend: { display: false } }
  }
});

const ctx2 = document.getElementById('robot-types-chart').getContext('2d');
const robotTypesChart = new Chart(ctx2, {
  type: 'doughnut',
  data: {
    labels: ['Industrial', 'Service', 'Medical', 'Military', 'Research'],
    datasets: [{
      data: dataByYear[2023].types,
      backgroundColor: [
        '#415a77', '#a5c8ff', '#627d98', '#1b263b', '#0d1b2a'
      ]
    }]
  },
  options: {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { color: '#0d1b2a' } }
    }
  }
});

yearSelect.addEventListener('change', e => {
  const year = e.target.value;

  robotAdoptionChart.data.datasets[0].data = dataByYear[year].adoption;
  robotAdoptionChart.update();

  robotTypesChart.data.datasets[0].data = dataByYear[year].types;
  robotTypesChart.update();
});

// --- Leaflet Map Initialization ---

// Initialize map
const map = L.map('robot-map').setView([20, 0], 2);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 6,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Robotics adoption data by country and year
const robotAdoptionByCountryByYear = {
  2023: {
    US: 65,
    CN: 70,
    DE: 58,
    JP: 62,
    KR: 60,
    IN: 35,
    BR: 25,
    RU: 30,
    CA: 40,
    FR: 38,
  },
  2024: {
    US: 68,
    CN: 73,
    DE: 60,
    JP: 64,
    KR: 62,
    IN: 38,
    BR: 28,
    RU: 32,
    CA: 43,
    FR: 40,
  },
  2025: {
    US: 70,
    CN: 75,
    DE: 62,
    JP: 66,
    KR: 65,
    IN: 40,
    BR: 30,
    RU: 35,
    CA: 45,
    FR: 42,
  }
};

// Country coords (same as before)
const countryCoords = {
  US: [37.0902, -95.7129],
  CN: [35.8617, 104.1954],
  DE: [51.1657, 10.4515],
  JP: [36.2048, 138.2529],
  KR: [35.9078, 127.7669],
  IN: [20.5937, 78.9629],
  BR: [-14.235, -51.9253],
  RU: [61.524, 105.3188],
  CA: [56.1304, -106.3468],
  FR: [46.2276, 2.2137],
};

// Store markers so we can update on year change
let countryMarkers = [];

// Function to update markers on the map based on year
function updateMapMarkers(year) {
  // Remove existing markers
  countryMarkers.forEach(marker => map.removeLayer(marker));
  countryMarkers = [];

  const adoptionData = robotAdoptionByCountryByYear[year];

  for (const [countryCode, adoption] of Object.entries(adoptionData)) {
    const coords = countryCoords[countryCode];
    if (coords) {
      const marker = L.circleMarker(coords, {
        radius: 12,
        fillColor: '#0d1b2a',
        color: '#a5c8ff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      marker.bindPopup(`<b>${countryCode}</b><br>Adoption: ${adoption}%`);

      countryMarkers.push(marker);
    }
  }
}

// Initialize markers for the default year on page load
updateMapMarkers(yearSelect.value);

// Also update markers when year changes (reuse yearSelect event)
yearSelect.addEventListener('change', e => {
  const year = e.target.value;
  updateMapMarkers(year);
});
