import { supa, getSignedUrl } from "/js/supabase.js";

// SVG-Datei für den Standort
const standortIcon = '<img src="standort.svg">';

// SVG-Datei für Eingepflanzt
const eingepflanztIcon = '<img src="eingepflanzt.svg">';

// SVG-Datei für Pflanzenart
const pflanzenartIcon = '<img src="pflanzenart.svg">';

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
                <p id="text-meine-pflanze">${standortIcon} <b>Standort: </b> ${plant.location}</p>
                <p id="text-meine-pflanze">${eingepflanztIcon} <b>Eingepflanzt: </b> ${plant.planted}</p>
                <p id="text-meine-pflanze">${pflanzenartIcon} <b>Pflanzenart: </b> ${plant.species}</p>
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
