// TODO :1 : website can only work in Kenya??? skip if not sure

// TODO :2: get location via browser
//        - get permissions (if already allowed continue || add button )
//        - obtain location
//        - sanitise coordinates
//            - S turns to - and E is removed
//            - Return in order latitude, longitudew
//        - Plug new coordinates (scheduling order might be tricky but just implement for now)
//
// minimal configure
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

//TODO:2 :function permittor(){
//check location;
//if (!locationGranted) {
//show button with alert animation();add OnPress()
//locator();
//}else{
//}
//  }
//
//
//TODO: 2:
function locator() {
  //get lccator input value
  let location = document.getElementById("locationInput").value;
  alert(location);
  //if (!location) {
  //}else()
}
//
//TODO: 3:function sanitizer(params) {
//
//}
//
function showContacts(category) {
  const contactsDiv = document.getElementById("contacts");
  // Retrieve contacts from the imported data or show a default message

  const contactsData = {
    medical: `
    <ul>
        <li><strong>Hospitals:</strong> Kenyatta National Hospital - +254 20 2726300</li>
        <li><strong>Ambulance Services:</strong> St John Ambulance - 0738 395 395</li>
        <li><strong>Poison Control:</strong> +254 20 2724938</li>
    </ul>
  `,
    fire: `
    <ul>
        <li><strong>Emergency Lines:</strong> 999, 112, 911</li>
        <li><strong>Nairobi Fire Brigade:</strong> 0202222181 / 0202222182 / 0202344599</li>
        <li><strong>Emergency Hotline:</strong> 0206982999</li>
    </ul>
  `,
    police: `
    <ul>
        <li><strong>General Emergencies:</strong> 999, 112</li>
        <li><strong>Nairobi Police Headquarters:</strong> +254 20 341411</li>
        <li><strong>DCI Hotline:</strong> +254 800 722 203</li>
    </ul>
  `,
    wildlife: `
    <ul>
        <li><strong>Kenya Wildlife Service:</strong> 0800 597 000 (Toll-Free)</li>
        <li><strong>Wildlife Conservation Hotline:</strong> +254 20 2379407</li>
    </ul>
  `,
    coastGuard: `
    <ul>
        <li><strong>Kenya Coast Guard Service:</strong> +254 711 092 000</li>
    </ul>
  `,
    // Add more categories as needed
  };

  const contactsList =
    contactsData[category] || "<p>No contacts found for this category.</p>";
  contactsDiv.innerHTML = contactsList;
}
