// TODO :1 : website can only work in Kenya??? skip if not sure

// TODO :2: get location via browser
//        - get permissions (if already allowed continue || add button )
//        - obtain location
//        - sanitise coordinates
//            - S turns to - and E is removed
//            - Return in order latitude, longitudew
//        - Plug new coordinates (scheduling order might be tricky but just implement for now)

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
//TODO: 2:function locator() {
//wait for buttonpress; Onpress on button
//google this;
//if (!location) {
//}else()
//  }
//
//
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
