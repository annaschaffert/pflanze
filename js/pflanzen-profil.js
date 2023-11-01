import { supa, getSignedUrl } from "/js/supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    // Elemente im HTML-Dokument abrufen
    const detailPflanzenAnsicht = document.getElementById("detailPflanzenAnsicht");
    const deleteButton = document.querySelector(".button_loeschen");
    const editButton = document.querySelector(".button_bearbeiten");
    const zurueckButton = document.getElementById("zurueckButton");
    

    // Pflanzen-ID aus der URL abrufen
    const params = new URLSearchParams(window.location.search);
    const plantId = params.get("id");

    if (!plantId) {
        console.error("Plant ID is missing in the URL.");
        return;
    }

    // Pflanzendaten aus der Datenbank abrufen
    const { data: plant, error } = await supa.from("Plant").select().eq("id", plantId);

    if (error) {
        console.error("Error fetching plant details:", error);
        return;
    }

    if (plant.length === 0) {
        console.error("Plant not found with ID:", plantId);
        return;
    }

    const selectedPlant = plant[0];

    // Datumsformat von "YYYY-MM-DD" in "DD.MM.YYYY" umwandeln
    const plantedDate = new Date(selectedPlant.planted);
    const formattedPlantedDate = plantedDate.toLocaleDateString("de-DE");

    // Pflanzenfoto aus der Datenbank abrufen
    const { data: photoData, error: photoError } = await supa.from('Plant').select('photo').eq('id', plantId);

    if (photoError) {
        console.error("Error fetching plant photo:", photoError);
        return;
    }

    // Signierte URL für das Pflanzenfoto abrufen
    const signedUrl = await getSignedUrl(photoData[0].photo);

    // Standortnamen aus der Location-Tabelle abrufen
    const locationData = await getLocationName(selectedPlant.location_id);

   




    // HTML-Inhalt für die Pflanzendetails erstellen und einfügen
    detailPflanzenAnsicht.innerHTML = `
        <h2 style="margin-bottom: 15px;margin-top:40px;">${selectedPlant.nickname}</h2>
        <p id="description">Hier siehst du die Merkmale deiner Pflanze</p>
        <img src="${signedUrl}" alt="Plant Photo">
        <h4 id="merkmale">Merkmale</h4>
        <p id="merkmale_defintionen">Pflanzenart: ${selectedPlant.species}</p>
        <p id="merkmale_defintionen">Eingepflanzt: ${formattedPlantedDate}</p>
        <p id="merkmale_defintionen">Standort: ${locationData}</p>
    `;

    // Stiländerungen für das Bild und die Beschreibung vornehmen
    const imgElement = detailPflanzenAnsicht.querySelector("img");
    imgElement.style.width = "400px";
    imgElement.style.height = "200px";
    imgElement.style.display = "block";
    imgElement.style.margin = "25px auto";

    const descriptionElement = detailPflanzenAnsicht.querySelector("#description");
    descriptionElement.style.margin = "10px 0";

// Event-Listener für den "Löschen" Button hinzufügen
deleteButton.addEventListener("click", async function () {
    if (confirm("Are you sure you want to delete this plant?")) {
        // Pflanze löschen
        const { data: deletedPlant, error: deleteError } = await supa
            .from("Plant")
            .delete()
            .eq("id", plantId);

        if (deleteError) {
            console.error("Error deleting plant:", deleteError);
            return;
        }

        window.location.replace("pflanze-loeschen-bestaetigung.html");
    }
});


    // Event-Listener für den "Bearbeiten" Button hinzufügen
    editButton.addEventListener("click", function () {
        // Formular zum Bearbeiten der Pflanze anzeigen
        const formFields = `
            <h2>Pflanze bearbeiten</h2>
            <p>Hier kannst du die Eigenschaften deiner Pflanze bearbeiten.</p>
            <h4>Eigenschaften anpassen</h4>
            <form id="editPlantForm">
                <label for="nickname"> <p style="margin-right: 295px;"><b>Nickname:</b><p></label>
                <input type="text" id="nickname" name="nickname" value="${selectedPlant.nickname}" required>
                <label for="species"><p style="margin-right: 310px;"><b>Species:</b><p></label>
                <input type="text" id="species" name="species" value="${selectedPlant.species}" required>
                <label for="planted"><p style="margin-right: 310px;"><b>Planted:</b><p></label>
                <input type="text" id "planted" name="planted" value="${formattedPlantedDate}" required>
                <button type="submit" id="speichern_knopf">Speichern</button>
            </form>
        `;

        // "Bearbeiten" Button ausblenden und das Formular anzeigen
        editButton.style.display = "none";
        detailPflanzenAnsicht.innerHTML = formFields;

          // Den "Löschen" Button auf der Bearbeitungsseite ausblenden
    const deleteButtonOnEditPage = document.querySelector(".button_loeschen");
    if (deleteButtonOnEditPage) {
        deleteButtonOnEditPage.style.display = "none";
    }

        const editPlantForm = document.getElementById("editPlantForm");
        editPlantForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Aktualisierte Pflanzendaten aus dem Formular abrufen
            const updatedPlantData = {
                nickname: editPlantForm.nickname.value,
                species: editPlantForm.species.value,
                planted: editPlantForm.planted.value,
            };

            // Pflanzendaten aktualisieren
            const { data: updatedPlant, error: updateError } = await supa
                .from("Plant")
                .update(updatedPlantData)
                .eq("id", plantId);

            if (updateError) {
                console.error("Error updating plant details:", updateError);
                return;
            }

            window.location.replace("pflanze-bearbeiten-bestaetigung.html");
        });
    });

    // Event-Listener für den "Zurück" Button hinzufügen
    zurueckButton.addEventListener("click", function () {
        window.location.href = "meine-pflanzen.html";
    });

    // Funktion zum Abrufen des Standortnamens anhand der location_id
    async function getLocationName(locationId) {
        try {
            const { data: location } = await supa.from("Location").select("name").eq("id", locationId);
            return location.length > 0 ? location[0].name : "Unbekannt";
        } catch (error) {
            console.error("Error fetching location name:", error);
            return "Unbekannt";
        }
    }
});
