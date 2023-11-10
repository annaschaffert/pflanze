// Das Supa-Objekt wird aus der supabase.js-Datei importiert.
// Stellt die Verbindung zur Datenbank (Supabase) her
import { supa } from "./supabase.js";

// DOMContentLoaded-Event wird ausgelöst, wenn das HTML-Dokument vollständig geladen wurde
document.addEventListener("DOMContentLoaded", async function () {
    const registrationForm = document.getElementById("registration-form-plants");
    const locationDropdown = document.getElementById("location-hinzuefuegen");

    // Funktion populateLocations() wird zum Abrufen und Anzeigen von Standorten aufgerufen
    // Diese Funktion holt die Standorte aus der Datenbank und füllt das Dropdown-Menü mit diesen Standorten.
    async function populateLocations() {
        try {
            const { data, error } = await supa.from("Location").select("id, name");
            if (error) {
                console.error("Fehler beim Abrufen der Standorte:", error);
                return;
            }

            // Mit data.forEach((location) wird für jeden hinzugefügten Standort eine Option im Dropdown-Menu erstellt
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

    // Ruft die Standorte ab und füllt das Dropdown-Menü
    populateLocations();

    // Ein Event-Listener wird zum registrationForm hinzugefügt
    // Event = Submit -> Funktion wird ausgeführt, wenn das Formular abgeschickt wird
    registrationForm.addEventListener("submit", async function (event) {
        // Verhindern des Standardverhaltens des Formulars, um ein Neuladen der Seite zu vermeiden.
        event.preventDefault();

        // Die Werte der Formularfelder werden ausgelesen und in entsprechenden Variablen gespeichert.
        const nickname = document.getElementById("nickname-hinzuefuegen").value;
        const species = document.getElementById("species-hinzuefuegen").value;
        const planted = document.getElementById("planted-hinzuefuegen").value;
        const locationId = locationDropdown.value; // Verwende die ausgewählte Location-ID

        // Überprüfen, ob eine Datei ausgewählt wurde
        const fileInput = document.getElementById('photo-hinzuefuegen');
        if (fileInput.files.length === 0) {
            console.error('Bitte wählen Sie ein Foto aus.');
            return;
        }

        const file = fileInput.files[0];

        // Überprüfen, ob die Datei bereits hochgeladen wurde
        if (await isPhotoExists(file.name)) {
            console.error('Dieses Foto wurde bereits hochgeladen.');
            return;
        }

        const photo = `uploads/${file.name}`;
        const { error: uploadError } = await supa.storage.from('photos').upload(photo, file);
        if (uploadError) {
            console.error('Fehler beim Hochladen der Datei:', uploadError);
            return;
        }

        // Funktion fügt eine neue Pflanze in die Datenbank ein.
        // Details der Pflanze werden als Parameter übergeben
        if (await addPlantstoDatabase(nickname, species, planted, photo, locationId)) {
            console.log('Pflanze wurde erfolgreich hinzugefügt.');
            // Weiterleitung auf Bestätigungsseite
            window.location.replace("pflanze-hinzufuegen-bestaetigung.html");
        } else {
            console.error('Fehler beim Hinzufügen der Pflanze.');
        }

        // Zurücksetzen des Formulars
        registrationForm.reset();
    });

    async function isPhotoExists(fileName) {
        const { data, error } = await supa
            .from('Plant')
            .select('id')
            .eq('photo', `uploads/${fileName}`);

        return data && data.length > 0;
    }

    async function addPlantstoDatabase(nickname, species, planted, photo, location_id) {
        try {
            const user = supa.auth.user(); // Benutzerdaten abrufen
            if (!user) {
                console.error("Benutzer nicht angemeldet.");
                return false;
            }

            // Mit der Methode supa.from('Plant').insert([...])
            // wird eine Pflanze zur Datenbank hinzugefügt
            // Die eindeutige Benutzer-ID
            const user_id = user.id;
            const { data, error } = await supa.from('Plant').insert([
                {
                    nickname,
                    species,
                    planted,
                    photo,
                    user_id,
                    location_id,
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
});
