import { supa } from "../js/supabase.js";


document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registration-form");
    const errorMessage = document.getElementById("error-message");

    registrationForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const vorname = document.getElementById("vorname").value;
        const nachname = document.getElementById("nachname").value;
        const email = document.getElementById("email-registrierung").value;
        const registrierungButton = document.querySelector(".button_registrierung");

        // Überprüfen, ob die E-Mail bereits in der Datenbank existiert
        if (await isEmailExists(email)) {
            errorMessage.textContent = 'Die E-Mail-Adresse existiert bereits.';
            return;
        } else {
            errorMessage.textContent = ''; // Fehlermeldung löschen, wenn keine Fehler vorhanden sind
        }

        // Fügen Sie den Benutzer nur hinzu, wenn die E-Mail eindeutig ist
        const added = await addUserToDatabase(vorname, nachname, email);
        if (added) {
            console.log('Benutzer wurde erfolgreich hinzugefügt.');
            // Hier die Weiterleitung zur "meine-pflanzen" Seite
            window.location.href = "meine-pflanzen.html";
        } else {
            console.error('Fehler beim Hinzufügen des Benutzers.');
        }

        // Zurücksetzen des Formulars (optional)
        registrationForm.reset();
    });

    async function isEmailExists(email) {
        const { data, error } = await supa
            .from('User')
            .select('id')
            .eq('email', email);

        return data && data.length > 0;
    }

    async function addUserToDatabase(first_name, last_name, email) {
        try {
            const { data, error } = await supa.from('User').insert([
                {
                    first_name,
                    last_name,
                    email,
                },
            ]);
    
            if (error) {
                console.error('Fehler beim Hinzufügen des Benutzers:', error);
                return false;
            }
    
            return true;
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Benutzers:', error);
            return false;
        }
    }
});
