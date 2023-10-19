import { supa, getSignedUrl } from "/js/supabase.js";

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
                <p id="text-meine-pflanze"><b>Pflanzenart: </b> ${plant.species} </p>
                <p id="text-meine-pflanze"><b>Eingepflanzt: </b> ${plant.planted}</p>
                <p id="text-meine-pflanze"><b>Standort: </b> ${plant.location}</p>
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
