import { supa } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    const registrationForm = document.getElementById("registration-form-plants");
    const locationDropdown = document.getElementById("location-hinzuefuegen");


    // Funktion zum Abrufen und Anzeigen von Standorten
    async function populateLocations() {
        try {
            const { data, error } = await supa.from("Location").select("id, name");
            if (error) {
                console.error("Fehler beim Abrufen der Standorte:", error);
                return;
            }

            // Iteriere durch die Standorte und füge sie dem Dropdown-Menü hinzu
            data.forEach((location) => {
                const option = document.createElement("option");
                option.value = location.id;
                option.textContent = location.name;
                locationDropdown.appendChild(option);
            });
        } catch (error) {
            console.error("Fehler beim Abrufen der Standorte:", error);
        }
    }

    // Rufe die Standorte ab und fülle das Dropdown-Menü
    populateLocations();

    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const nickname = document.getElementById("nickname-hinzuefuegen").value;
        const species = document.getElementById("species-hinzuefuegen").value;
        const planted = document.getElementById("planted-hinzuefuegen").value;
        const locationId = locationDropdown.value; // Verwende die ausgewählte Location-ID
        const photo = document.getElementById("photo-hinzuefuegen").value;
        const user_id = 1;

        // Hier können Sie die eingegebenen Daten weiterverarbeiten, z.B. an einen Server senden.
        // Fügen Sie die Daten mit Supabase hinzu

        async function addPlantstoDatabase(nickname, species, planted, photo, user_id, location_id) {
            try {
                const { data, error } = await supa.from('Plant').insert([
                    {
                        nickname,
                        species,
                        planted,
                        photo,
                        user_id,
                        location_id
                    },
                ]);
                if (error) {
                    console.error('Fehler beim Hinzufügen der Pflanze:', error);
                    return false;
                }
                console.log('Pflanze wurde erfolgreich hinzugefügt:', data);
                return true;
            } catch (error) {
                console.error('Fehler beim Hinzufügen der Pflanze:', error);
                return false;
            }
        }
        // fileupload PHOTO
        async function uploadPhoto() {
            const fileInput = document.getElementById('photo-hinzuefuegen');

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const photo = `uploads/${file.name}`;
                const { error: uploadError } = await supa.storage.from('photos').upload(photo, file);
                if (uploadError) {
                    console.error('Fehler beim Hochladen der Datei:', uploadError);
                    return;
                }
                addPlantstoDatabase(nickname, species, planted, photo, user_id, locationId);
                // Weiterleitung mit Ersetzen
                window.location.replace("pflanze-hinzufuegen-bestaetigung.html");
            }
        }
        uploadPhoto();
        // Beispiel: Ausgabe der Daten in der Konsole
        console.log("Nickname: " + nickname);
        console.log("Species: " + species);
        console.log("Planted: " + planted);
        console.log("Location ID: " + locationId);
        console.log("Photo: " + photo);
        // Zurücksetzen des Formulars (optional)
        registrationForm.reset();
    });
});
