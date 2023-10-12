import { supa, getSignedUrl } from "/js/supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    const detailPflanzenAnsicht = document.getElementById("detailPflanzenAnsicht");
    const deleteButton = document.querySelector(".button_loeschen");
    const editButton = document.querySelector(".button_bearbeiten");
    const zurueckButton = document.querySelector(".button_zurueck_profil"); // Aktualisierte Zeile

    // Get the plant ID from the URL
    const params = new URLSearchParams(window.location.search);
    const plantId = params.get("id");

    if (!plantId) {
        // Handle the case where the plant ID is missing in the URL
        console.error("Plant ID is missing in the URL.");
        return;
    }

    // Fetch the plant details using the ID
    const { data: plant, error } = await supa.from("Plant").select().eq("id", plantId);

    if (error) {
        console.error("Error fetching plant details:", error);
        return;
    }

    // Ensure that there's a plant with the given ID
    if (plant.length === 0) {
        console.error("Plant not found with ID:", plantId);
        return;
    }

    const selectedPlant = plant[0];

    // Fetch the signed URL for the plant's photo
    const { data: photoData, error: photoError } = await supa.from('Plant').select('photo').eq('id', plantId);

    if (photoError) {
        console.error("Error fetching plant photo:", photoError);
        return;
    }

    const signedUrl = await getSignedUrl(photoData[0].photo);

    // Display plant details
        detailPflanzenAnsicht.innerHTML = `
        <h2 style="margin-bottom: 15px;margin-top:40px;">${selectedPlant.nickname}</h2>
        <p id="description">Hier siehst du die Merkmale deiner Pflanze</p>
        <img src="${signedUrl}" alt="Plant Photo">
        <h4 id="merkmale">Merkmale</h4>
        <p id="merkmale_defintionen">Pflanzenart:  ${selectedPlant.species}</p>
        <p id="merkmale_defintionen">Eingepflanzt:  ${selectedPlant.planted}</p>
        <p id="merkmale_defintionen">Standort:  ${selectedPlant.location}</p>
    `;

    // Style the image
    const imgElement = detailPflanzenAnsicht.querySelector("img");
    imgElement.style.width = "400px";
    imgElement.style.height = "200px";
    imgElement.style.display = "block";
    imgElement.style.margin = "25px auto";

    // Style the vom P tag -> description
    const descriptionElement = detailPflanzenAnsicht.querySelector("#description");
    descriptionElement.style.margin = "10px 0";

    // Style the vom h4 tag -> merkmale
    const merkmaleElement = detailPflanzenAnsicht.querySelector("#merkmale");
   
    // Style the vom hp tag -> merkmale_defintionen
    const merkmale_defintionenElement = detailPflanzenAnsicht.querySelector("#merkmale_defintionen");

    // Add event listeners to delete and edit buttons
    zurueckButton.addEventListener("click", function () {
        // Hier setzen Sie die URL, zu der Sie zurückkehren möchten
        window.location.href = "meine-pflanzen.html";
    });

    deleteButton.addEventListener("click", async function () {
        if (confirm("Are you sure you want to delete this plant?")) {
            // If the user confirms the deletion
            // Delete the plant from the database
            const { data: deletedPlant, error: deleteError } = await supa
                .from("Plant")
                .delete()
                .eq("id", plantId);

            if (deleteError) {
                console.error("Error deleting plant:", deleteError);
                return;
            }

            // Optionally, redirect to another page after deletion
            window.location.replace("pflanze-loeschen-bestaetigung.html");
        }
    });

    editButton.addEventListener("click", function () {
        const formFields = `
            <h2>Pflanze bearbeiten</h2>
            <p>Hier kannst du die Eingschaften deiner Pflanze bearbeiten.</p>
            <h4>Eigenschaften anpassen</h4>
            <form id="editPlantForm">
                <label for="nickname"> <p><b>Nickname:</b><p></label>
                <input type="text" id="nickname" name="nickname" value="${selectedPlant.nickname}" required>
                <label for="species"><p><b>Species:</b><p></label>
                <input type="text" id="species" name "species" value="${selectedPlant.species}" required>
                <label for="planted"><p><b>Planted:</b><p></label>
                <input type="date" id="planted" name="planted" value="${selectedPlant.planted}" required>
                <button type="submit" id="speichern_knopf">Speichern</button>
            </form>
        `;
        editButton.style.display = "none";

        detailPflanzenAnsicht.innerHTML = formFields;

        // Add event listener to the form for updating the plant details
        const editPlantForm = document.getElementById("editPlantForm");
        editPlantForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const updatedPlantData = {
                nickname: editPlantForm.nickname.value,
                species: editPlantForm.species.value,
                planted: editPlantForm.planted.value,
            };

            // Update the plant details in the database
            const { data: updatedPlant, error: updateError } = await supa
                .from("Plant")
                .update(updatedPlantData)
                .eq("id", plantId);

            if (updateError) {
                console.error("Error updating plant details:", updateError);
                return;
            }

            //reload site
            window.location.replace("pflanze-bearbeiten-bestaetigung.html");
        });
    });
});
