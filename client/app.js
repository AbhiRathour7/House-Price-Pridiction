function getLocationNames() {
  fetch("http://127.0.0.1:5000/get_location_names")
    .then(response => response.json())
    .then(data => {
      const locations = data.locations;
      const locationDropdown = document.getElementById("location");

      locationDropdown.innerHTML = "";
      locations.forEach(loc => {
        const option = document.createElement("option");
        option.value = loc;
        option.text = loc;
        locationDropdown.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error fetching location names:", error);
    });
}

function onClickedEstimatePrice() {
  const sqft = document.getElementById("sqft").value;
  const bhk = document.getElementById("bhk").value;
  const bath = document.getElementById("bath").value;
  const location = document.getElementById("location").value;
  const resultEl = document.getElementById("result");
  const loader = document.getElementById("loader");

  resultEl.innerText = "Estimating...";
  loader.style.display = "block";

  const formData = new FormData();
  formData.append("total_sqft", sqft);
  formData.append("bhk", bhk);
  formData.append("bath", bath);
  formData.append("location", location);

  fetch("http://127.0.0.1:5000/predict_home_price", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      loader.style.display = "none";
      if (data.estimated_price) {
        const rupees = Math.round(data.estimated_price * 100000);
        const wordFormat = convertToIndianWords(rupees);
        resultEl.innerText = `Estimated Price: ₹ ${rupees.toLocaleString('en-IN')} (${wordFormat})`;
      } else {
        resultEl.innerText = "❌ Failed to fetch prediction.";
      }
    })
    .catch(error => {
      loader.style.display = "none";
      resultEl.innerText = "❌ Error estimating price.";
      console.error("Error:", error);
    });
}

function convertToIndianWords(amount) {
  if (amount < 1) return "Less than 1 Rupee";

  let crore = Math.floor(amount / 10000000);
  amount %= 10000000;

  let lakh = Math.floor(amount / 100000);
  amount %= 100000;

  let thousand = Math.floor(amount / 1000);
  amount %= 1000;

  let hundred = Math.floor(amount / 100);
  amount %= 100;

  let result = "";
  if (crore > 0) result += crore + " Crore ";
  if (lakh > 0) result += lakh + " Lakh ";
  if (thousand > 0) result += thousand + " Thousand ";
  if (hundred > 0) result += hundred + " Hundred ";
  if (amount > 0) result += amount;

  return result.trim();
}

window.onload = getLocationNames;