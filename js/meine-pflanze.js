import { supa, getSignedUrl } from "/js/supabase.js";

// SVG-Code für den Standort-Icon
const standortIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 25 25" fill="none" class="icon-standort">
  <path d="M12.7151 23.7145C18.5732 23.7145 23.3221 18.8725 23.3221 12.8995C23.3221 6.92661 18.5732 2.08459 12.7151 2.08459C6.85706 2.08459 2.10815 6.92661 2.10815 12.8995C2.10815 18.8725 6.85706 23.7145 12.7151 23.7145Z" fill="#F5F5F5"/>
  <path d="M8.6557 7.66978C8.6557 7.66978 7.09139 10.3242 8.6557 12.7666L12.6371 20.38L16.8552 12.5025C16.8552 12.5025 19.1539 7.98412 14.1299 5.76108C14.1305 5.76108 10.7651 4.50434 8.6557 7.66978Z" fill="#323232"/>
  <path d="M12.6351 12.6091C13.9681 12.6091 15.0486 11.5073 15.0486 10.1483C15.0486 8.78923 13.9681 7.6875 12.6351 7.6875C11.3022 7.6875 10.2217 8.78923 10.2217 10.1483C10.2217 11.5073 11.3022 12.6091 12.6351 12.6091Z" fill="#F5F5F5"/>
</svg>
`;

// SVG-Code für das Eingepflanzt-Icon
const eingepflanztIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 25 25" fill="none" class="icon-eingepflanzt">
<path d="M12.7151 23.7145C18.5732 23.7145 23.3221 18.8725 23.3221 12.8995C23.3221 6.92661 18.5732 2.08459 12.7151 2.08459C6.85706 2.08459 2.10815 6.92661 2.10815 12.8995C2.10815 18.8725 6.85706 23.7145 12.7151 23.7145Z" fill="#F5F5F5"/>
<path d="M7.16585 8.41547C7.15804 8.31498 7.23196 8.22123 7.32991 8.20836C7.32991 8.20836 14.536 7.2341 17.9693 8.23226L17.8443 10.2709C17.8383 10.372 17.7518 10.4528 17.6526 10.451L7.50599 10.4541C7.40684 10.4541 7.3191 10.3714 7.31128 10.2709L7.16585 8.41547Z" fill="#323232"/>
<path d="M9.26617 17.0203C9.2872 17.1189 9.38576 17.2035 9.48492 17.2084C9.48492 17.2084 15.283 17.4884 16.048 17.1128L17.2253 10.3524C17.2427 10.2531 17.1754 10.1716 17.0763 10.1716L7.9747 10.1796C7.87554 10.1796 7.81184 10.2605 7.83287 10.3591L9.26617 17.0203Z" fill="#323232"/>
<path d="M9.35335 18.5772C9.38881 18.6716 9.49879 18.7555 9.59794 18.7635C9.59794 18.7635 13.6118 19.0944 16.0198 18.6857L16.6076 17.0974C16.6424 17.0031 16.5901 16.9295 16.491 16.9344L16.0565 16.9565C16.0523 16.9565 16.0493 16.9602 16.0481 16.9651C16.0354 17.0202 15.6935 17.3395 9.30407 17.0515L8.9459 17.0306C8.84674 17.0251 8.79506 17.0974 8.83052 17.1918L9.35335 18.5772Z" fill="#323232"/>
</svg>
`;

// SVG-Code für das Pflanzenart-Icon
const pflanzenartIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 25 25" fill="none" class="icon-pflanzenart">
  <path d="M12.7151 23.7145C18.5732 23.7145 23.3221 18.8725 23.3221 12.8995C23.3221 6.92661 18.5732 2.08459 12.7151 2.08459C6.85706 2.08459 2.10815 6.92661 2.10815 12.8995C2.10815 18.8725 6.85706 23.7145 12.7151 23.7145Z" fill="#F5F5F5"/>
  <path d="M6.53254 7.35908C6.53254 7.35908 9.78916 7.19731 11.4833 8.54658C13.1774 9.89584 12.3042 12.353 11.6155 12.9467C10.9274 13.5405 9.25911 14.2427 7.45863 12.7849C5.65815 11.3272 6.24048 7.57476 6.24048 7.57476C6.24048 7.57476 6.29456 7.35908 6.53254 7.35908Z" fill="#323232"/>
  <path d="M19.6528 8.82971C19.6528 8.82971 19.9407 12.141 18.6853 13.921C17.4299 15.701 14.9876 14.9081 14.3782 14.2304C13.7688 13.5527 13.0152 11.8812 14.3722 9.98902C15.7292 8.09687 19.4299 8.54172 19.4299 8.54172C19.4299 8.54172 19.6432 8.58706 19.6528 8.82971Z" fill="#323232"/>
  <path d="M10.33 11.7506C10.9285 12.6636 11.8011 14.674 12.0926 15.916C12.3841 17.1581 12.4105 19.4791 12.4105 19.4791C12.4105 19.4791 12.3312 19.8842 12.6755 19.8842C13.0199 19.8842 13.0079 19.4981 13.0079 19.4981C12.9959 18.7077 13.1785 17.4816 13.1785 17.4816C13.3901 13.4865 17.2026 11.6777 17.2026 11.6777C17.4676 11.1378 16.9111 11.1648 16.9111 11.1648C13.7074 12.3253 12.7278 16.2126 12.7278 16.2126C12.3306 12.1096 9.63047 9.92276 9.12686 9.8958C8.62326 9.86884 8.75607 10.3278 8.75607 10.3278C8.75607 10.3278 9.97061 11.2028 10.33 11.7506Z" fill="#323232"/>
</svg>
`;




// ...

function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', options);
}

async function showPlantsInGrid() {
    const gridContainer = document.querySelector('.grid-container');
    const { data: plants, error } = await supa.from("Plant")
        .select(`
            *,
            location:Location(name)  // Hier wird die Verknüpfung zur "Location"-Tabelle erstellt
        `);

    if (error) {
        console.error('Fehler beim Abrufen der Pflanzendaten:', error);
        return;
    }

    plants.forEach(async plant => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        const plantId = plant.id;

        const { data: photoData, error: photoError } = await supa.from('Plant').select('photo').eq('id', plantId);

        if (photoError) {
            console.error("Error fetching photos:", photoError);
            return;
        }

        const signedUrl = await getSignedUrl(photoData[0].photo);

        gridItem.innerHTML = `
            <div class="image">
                <img src="${signedUrl}" alt="Plant Photo">
            </div>
            <div class="text-meine-pflanze">
                <p id="text-meine-pflanze-titel">${plant.nickname}</p>
                <p id="text-meine-pflanze">${standortIcon} ${plant.location.name}</p>
                <p id="text-meine-pflanze">${eingepflanztIcon} ${formatDate(plant.planted)}</p>
                <p id="text-meine-pflanze">${pflanzenartIcon} ${plant.species}</p>
                <a class="button_mehr" href="pflanzen-profil.html?id=${plantId}">bearbeiten & löschen</a>
            </div>
        `;

        gridContainer.appendChild(gridItem);
    });
}


// Button Pflanze hinzufügen
document.addEventListener("DOMContentLoaded", async function () {
    const buttonHinzufuegen = document.querySelector(".button_pflanze_hinzufuegen");

    buttonHinzufuegen.addEventListener("click", function () {
        window.location.href = "pflanze-hinzufuegen.html";
    });
});

showPlantsInGrid();
