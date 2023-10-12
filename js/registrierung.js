import { supa } from "../js/supabase.js";

document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registration-form");
  
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const vorname = document.getElementById("vorname").value;
      const nachname = document.getElementById("nachname").value;
      const email = document.getElementById("email").value;
      const registrierungButton = document.querySelector(".button_registrierung"); // Aktualisierte Zeile

  
      // Hier können Sie die eingegebenen Daten weiterverarbeiten, z.B. an einen Server senden.
      
      // hinzufügen der daten mit supa
        addUserToDatabase(vorname, nachname, email);

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
          
              console.log('Benutzer wurde erfolgreich hinzugefügt:', data);
              return true;
            } catch (error) {
              console.error('Fehler beim Hinzufügen des Benutzers:', error);
              return false;
            }
          }


      // Beispiel: Ausgabe der Daten in der Konsole
      console.log("Vorname: " + vorname);
      console.log("Nachname: " + nachname);
      console.log("E-Mail-Adresse: " + email);


  
      // Zurücksetzen des Formulars (optional)
      registrationForm.reset();

      // Verknüpfung des Buttons mit der nächsten Seite -> meine-pflanzen.html
      registrierungButton.addEventListener("click", function () {
        // Hier setzen Sie die URL, zu der Sie zurückkehren möchten
        window.location.href = "meine-pflanzen.html";
    });

      });
    });
