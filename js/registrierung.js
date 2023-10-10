document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registration-form");
  
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const vorname = document.getElementById("first_name").value;
      const nachname = document.getElementById("last_name").value;
      const email = document.getElementById("email").value;
  
      // Hier können Sie die eingegebenen Daten weiterverarbeiten, z.B. an einen Server senden.
  
      // Beispiel: Ausgabe der Daten in der Konsole
      console.log("Vorname: " + first_name);
      console.log("Nachname: " + last_name);
      console.log("E-Mail-Adresse: " + email);
  
      // Zurücksetzen des Formulars (optional)
      registrationForm.reset();
    });
  });
  