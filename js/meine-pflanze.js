import { supa, getSignedUrl } from "/js/supabase.js";

// SVG-Code für das Standort-Icon
const standortIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-location-icon" viewBox="0 0 16 16"><path d="M8 0a6 6 0 0 1 6 6c0 5.3-6 10-6 10s-6-4.7-6-10a6 6 0 0 1 6-6zm0 9a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3z"/></svg>';

// SVG-Code für das Eingepflanzt-Icon
const eingepflanztIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plant-icon" viewBox="0 0 16 16"><path d="M10 0a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1zM7 5a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V5zM4 7a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0V7zM3 6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/></svg>';

// SVG-Code für das Pflanzenart-Icon
const pflanzenartIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plant-icon" viewBox="0 0 16 16"><path d="M0.366461 0.00544394C0.366461 0.00544394 3.49556 -0.149655 5.12371 1.14284C6.75185 2.43533 5.91234 4.78766 5.2509 5.35636C4.58947 5.92505 2.98676 6.59715 1.25685 5.20126C-0.473053 3.80537 0.0866227 0.212242 0.0866227 0.212242C0.0866227 0.212242 0.137502 0.00544394 0.366461 0.00544394Z" fill="#323232"/><path d="M12.9728 1.41423C12.9728 1.41423 13.2493 4.58523 12.043 6.28951C10.8366 7.99378 8.49006 7.23458 7.90469 6.58575C7.31932 5.93666 6.5948 4.33604 7.89884 2.52448C9.20289 0.712669 12.7586 1.13867 12.7586 1.13867C12.7586 1.13867 12.9639 1.1821 12.9731 1.41449L12.9728 1.41423Z" fill="#323232"/><path d="M4.01481 4.21141C4.59 5.08591 5.4285 7.01121 5.70833 8.2003C5.98817 9.38939 6.01361 11.6125 6.01361 11.6125C6.01361 11.6125 5.93729 12.0002 6.26801 12.0002C6.59873 12.0002 6.58728 11.6308 6.58728 11.6308C6.57583 10.8737 6.75137 9.69959 6.75137 9.69959C6.95489 5.87381 10.6182 4.14188 10.6182 4.14188C10.8726 3.62488 10.3384 3.65073 10.3384 3.65073C7.26016 4.76227 6.31889 8.48465 6.31889 8.48465C5.93729 4.55547 3.34243 2.46164 2.85908 2.43579C2.37572 2.40994 2.50292 2.84939 2.50292 2.84939C2.50292 2.84939 3.66933 3.68666 4.01481 4.21141Z" fill="#323232"/></svg>';

async function showPlantsInGrid() {
    const gridContainer = document.querySelector('.grid-container');
    const { data: plants, error } = await supa.from("Plant").select();

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
                <p id="text-meine-pflanze">${standortIcon} <b> </b> ${plant.location}</p>
                <p id="text-meine-pflanze">${eingepflanztIcon} <b> </b> ${plant.planted}</p>
                <p id="text-meine-pflanze">${pflanzenartIcon} <b> </b> ${plant.species}</p>
                <a class="button_mehr" href="pflanzen-profil.html?id=${plantId}">bearbeiten & löschen</a>
            </div>
        `;

        gridContainer.appendChild(gridItem);
    });
}

//Button Pflanze hinzufügen
document.addEventListener("DOMContentLoaded", async function () {
    const buttonHinzufuegen = document.querySelector(".button_pflanze_hinzufuegen");

    buttonHinzufuegen.addEventListener("click", function () {
        window.location.href = "pflanze-hinzufuegen.html";
    });
});

showPlantsInGrid();
