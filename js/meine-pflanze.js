import { supa, getSignedUrl } from "/js/supabase.js";

async function showPlants() {
    const cardContainer = document.querySelector('#card-container');
    const { data: plants, error } = await supa.from("Plant").select();

    if (error) {
        console.error('Fehler beim Abrufen der Pflanzendaten:', error);
        return;
    }

    plants.forEach(async plant => {
        const card = document.createElement('div');
        card.classList.add('plant-card');
        const plantId = plant.id; // Store the plant ID for later use


        // Fetch the signed URL for the plant's photo
        const { data: photoData, error: photoError } = await supa.from('Plant').select('photo').eq('id', plantId);

        if (photoError) {
            console.error("Error fetching photos:", photoError);
            return;
        }

        const signedUrl = await getSignedUrl(photoData[0].photo);

        card.innerHTML = `
            <h3>${plant.nickname}</h3>
            <p id="merkmale_pflanzen">Pflanzenart: ${plant.species}</p>
            <p id="merkmale_pflanzen">Eingepflanzt: ${plant.planted}</p>
            <p id="merkmale_pflanzen">Standort: ${plant.location}</p>
            <img src="${signedUrl}" class="photo_pflanze" alt="Plant Photo" width="100%">
            <a class="button_mehr" href="pflanzen-profil.html?id=${plantId}">bearbeiten & löschen</a>
        `;
        cardContainer.appendChild(card);
    });


    

    // Add event listeners to "Mehr" buttons -> den "Mehr" Button haben wir auf bearebiten & löschen geändert, aber hier drin heisst er noch mehr-button, deshalb müssen wir hier noch mehr-button schreiben, sonst funktioniert es nicht
    const mehrButtons = document.querySelectorAll('.button_mehr');
    mehrButtons.forEach(button => {
        button.addEventListener('click', showPlantDetails);
    });
}

// Rest of the code, including showPlantDetails, remains the same

//Button Pflanze hinzufpügen
document.addEventListener("DOMContentLoaded", async function () {
    const buttonHinzufuegen = document.querySelector(".button_pflanze_hinzufuegen"); // Aktualisierte Zeile

    buttonHinzufuegen.addEventListener("click", function () {
        // Hier setzen Sie die URL, zu der Sie zurückkehren möchten
        window.location.href = "pflanze-hinzufuegen.html";
    });
});


showPlants();