// TODO :1 : website can only work in Kenya??? skip if not sure
// minimal configure

let userMarker;

new Autocomplete("search", {
  // default selects the first item in
  // the list of results
  selectFirst: true,

  // The number of characters entered should start searching
  howManyCharacters: 2,

  // onSearch
  onSearch: ({ currentValue }) => {
    // You can also use static files
    // const api = '../static/search.json'
    const api = `https://nominatim.openstreetmap.org/search?format=geojson&limit=5&city=${encodeURI(
      currentValue,
    )}`;

    /**
     * jquery
     */
    // return $.ajax({
    //     url: api,
    //     method: 'GET',
    //   })
    //   .done(function (data) {
    //     return data
    //   })
    //   .fail(function (xhr) {
    //     console.error(xhr);
    //   });

    // OR -------------------------------

    /**
     * axios
     * If you want to use axios you have to add the
     * axios library to head html
     * https://cdnjs.com/libraries/axios
     */
    // return axios.get(api)
    //   .then((response) => {
    //     return response.data;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    // OR -------------------------------

    /**
     * Promise
     */
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.features);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },
  // nominatim GeoJSON format parse this part turns json into the list of
  // records that appears when you type.
  onResults: ({ currentValue, matches, template }) => {
    const regex = new RegExp(currentValue, "gi");

    // if the result returns 0 we
    // show the no results element
    return matches === 0
      ? template
      : matches
          .map((element) => {
            return `
          <li class="loupe">
            <p>
              ${element.properties.display_name.replace(
                regex,
                (str) => `<b>${str}</b>`,
              )}
            </p>
          </li> `;
          })
          .join("");
  },

  // we add an action to enter or click
  onSubmit: ({ object }) => {
    // remove all layers from the map
    map.eachLayer(function (layer) {
      if (!!layer.toGeoJSON) {
        map.removeLayer(layer);
      }
    });

    const { display_name } = object.properties;
    const [lng, lat] = object.geometry.coordinates;

    const marker = L.marker([lat, lng], {
      title: display_name,
    });

    marker.addTo(map).bindPopup(display_name);

    map.setView([lat, lng], 8);
  },

  // get index and data from li element after
  // hovering over li with the mouse or using
  // arrow keys ↓ | ↑
  onSelectedItem: ({ index, element, object }) => {
    console.log("onSelectedItem:", index, element, object);
  },

  // the method presents no results element
  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),
});

var map = L.map("map").setView([-1.2921, 36.8219], 11); // Replace with your desired coordinates and zoom level

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        map.setView([latitude, longitude], 15);

        if (userMarker) {
          userMarker.setLatLg([latitude, longitude]);
        } else {
          userMarker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("You are here")
            .openPopup();
        }
      },
      (error) => {
        alert(
          "Unable to retrieve your location. Please allow location access.",
        );
        console.error("Geolocation error:", error);
      },
    );
  } else {
    alert("Failed to geolocate");
  }
}

let emergencyData = {};
async function loadEmergencyData() {
  try {
    const response = await fetch("./data/emergencyContacts.json");
    emergencyData = await response.json();
  } catch (error) {
    console.error("Error loading emergency contacts:", error);
  }
}
function showContacts(category) {
  const contactsDiv = document.getElementById("contacts");

  contactsDiv.innerHTML = ""; // Clear existing contacts

  // Find contacts for the selected category
  const categoryData = emergencyData.emergencyContacts.find(
    (cat) => cat.category === category,
  );
  console.log("emergencyData : ", emergencyData);
  console.log("CategoryData", categoryData);
  if (categoryData && categoryData.contacts.length > 0) {
    categoryData.contacts.forEach((contact) => {
      const contactElement = document.createElement("div");
      contactElement.className = "contact";

      contactElement.innerHTML = `
        <strong>${contact.name}</strong> <br/>
        Phone: <a href="tel:${contact.number}">${contact.number}</a> <br/>
        ${contact.areaServed ? `Area Served: ${contact.areaServed}` : ""}
        ${contact.notes ? `<br/><em>${contact.notes}</em>` : ""}
      `;

      contactsDiv.appendChild(contactElement);
    });
  } else {
    contactsDiv.innerHTML = `<p>No contacts available for ${category}.</p>`;
  }
}
// Open feedback modal
document.getElementById("feedback-btn").addEventListener("click", () => {
  document.getElementById("feedback-modal").style.display = "flex";
});

// Close feedback modal
function closeModal() {
  document.getElementById("feedback-modal").style.display = "none";
}

// Handle feedback submission
function submitFeedback() {
  const feedback = document.getElementById("feedback-text").value;
  if (feedback) {
    alert("Thank you for your feedback! We’ll review it soon.");
    document.getElementById("feedback-text").value = ""; // Clear the feedback form
    closeModal(); // Close the modal
  } else {
    alert("Please enter some feedback.");
  }
}

loadEmergencyData();
