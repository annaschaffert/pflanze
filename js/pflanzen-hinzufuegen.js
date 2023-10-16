import { supa } from "./supabase.js";

document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registration-form-plants");
  
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const nickname = document.getElementById("nickname").value;
      const species = document.getElementById("species").value;
      const planted = document.getElementById("planted").value;
      //const location = document.getElementById("location").value;
      const photo = document.getElementById("photo").value;
      const user_id = 1;
      const location_id = 1;
      
  
      // Hier können Sie die eingegebenen Daten weiterverarbeiten, z.B. an einen Server senden.
      
      
      
      // hinzufügen der daten mit supa
        

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
  const fileInput = document.getElementById('photo');
  //const captionInput = document.getElementById('captionInput');
  
  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const photo = `uploads/${file.name}`;
      console.log(file, photo);
      const { error: uploadError } = await supa.storage.from('photos').upload(photo, file);
      
      if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return;
      }

      addPlantstoDatabase(nickname, species, planted, photo, user_id, location_id);
      //redirect with replace
      window.location.replace("pflanze-hinzufuegen-bestaetigung.html");
}

}




uploadPhoto();

// showupload PHOTO




      // Beispiel: Ausgabe der Daten in der Konsole
      console.log("nickname: " + nickname);
      console.log("species: " + species);
      console.log("planted: " + planted);
      console.log("location: " + location);
      console.log("photo: " + photo);
      

  
      // Zurücksetzen des Formulars (optional)
      registrationForm.reset();
    });


  });


  