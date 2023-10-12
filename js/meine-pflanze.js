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
            <p>Species: ${plant.species}</p>
            <p>Planted: ${plant.planted}</p>
            <p>Location: ${plant.location}</p>
            <img src="${signedUrl}" class="photo_pflanze" alt="Plant Photo" width="100%">
            <a class="mehr-link" href="pflanzen-profil.html?id=${plantId}">bearbeiten & löschen</a>
        `;
        cardContainer.appendChild(card);
    });

    // Add event listeners to "Mehr" buttons
    const mehrButtons = document.querySelectorAll('.mehr-button');
    mehrButtons.forEach(button => {
        button.addEventListener('click', showPlantDetails);
    });
}

// Rest of the code, including showPlantDetails, remains the same

showPlants();