//Das Supa-Objekt wird aus der supabase.js-Datei importiert.
//Stellt dir Verbindung zur Datenbank (Supabase) her
import { supa } from "./supabase.js";

//DOMContentLoaded-Event wird ausgelöst, wenn das HTML-Dokument vollständig geladen wurde
//Kostante für registrationForm & locationDropdown werden erstellt
//Sie verweisen auf Elemente im HTML-Dokument
document.addEventListener("DOMContentLoaded", async function () {
    const registrationForm = document.getElementById("registration-form-plants");
    const locationDropdown = document.getElementById("location-hinzuefuegen");

//Funktion populateLocations() wird zum Abrufen und Anzeigen von Standorten aufgerufen
//Diese Funktion holt die Standorte aus der Datenbank und füllt das Dropdown-Menü mit diesen Standorten.
    async function populateLocations() {
        try {
            const { data, error } = await supa.from("Location").select("id, name");
            if (error) {
                console.error("Fehler beim Abrufen der Standorte:", error);
                return;
            }
//Mit data.forEach((location) wird für jeden hinzugefügten Standort eine Option im Dropdown-Menu erstellt
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

//Ein Event-Listener wird zum registrationForm hinzugefügt
//Event = Submit -> Funktion wird ausgeführt, wenn das Formular abgeschickt wird
    registrationForm.addEventListener("submit", function (event) {

//Verhindern des Standardverhaltens des Formulars, um ein Neuladen der Seite zu vermeiden.
        event.preventDefault();
        
//Die Werte der Formularfelder werden ausgelesen und in entsprechenden Variablen gespeichert.
        const nickname = document.getElementById("nickname-hinzuefuegen").value;
        const species = document.getElementById("species-hinzuefuegen").value;
        const planted = document.getElementById("planted-hinzuefuegen").value;
        const locationId = locationDropdown.value; // Verwende die ausgewählte Location-ID
        const photo = document.getElementById("photo-hinzuefuegen").value;
        const user_id = 1;

// Funktion fügt eine neue Pflanze in die Datenbank ein. 
//Details der Pflanze werden als Parameter übergeben
        async function addPlantstoDatabase(nickname, species, planted, photo, location_id) {
            try {
                const user = supa.auth.user(); // Benutzerdaten abrufen
                if (!user) {
                    console.error("Benutzer nicht angemeldet.");
                    return false;
                }
//mit der Methode supa.from('Plant').insert([...])
//wird eine Pflanze zur Datenbank hinzugefügt
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

// uploadPhoto() Fuktion lädft ein Foto hoch und fügt dann die Pflanze in die Datenbank ein
// Mit Methode supa.storage.from('photos').upload(photo, file) wird ein Foto hochgeladen
// Mit Funktion addPlantstoDatabase(...) wird die Pflanze in die Datenbank eingefügt
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

// Weiterleitung auf Bestätigungsseite
// window.location.replace lädt eine neue Seite und ersetzt die aktuelle Seite im Browserverlauf
                window.location.replace("pflanze-hinzufuegen-bestaetigung.html");
            }
        }

//Diese Funktion wird aufgerufen, um das Foto hochzuladen, das der Benutzer ausgewählt hat. 
// Sie wird aufgerufen, wenn das Formular abgesendet wird.
        uploadPhoto();

//Ausgabe der Daten in der Konsole -> Kann für die Überprüfung der Funktionalität verwendet werden
        console.log("Nickname: " + nickname);
        console.log("Species: " + species);
        console.log("Planted: " + planted);
        console.log("Location ID: " + locationId);
        console.log("Photo: " + photo);

// Zurücksetzen des Formulars
// Alle Eingaben werden gelöscht
        registrationForm.reset();
    });
});

