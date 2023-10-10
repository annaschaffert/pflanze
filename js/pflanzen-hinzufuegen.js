import { supa } from "./supabase.js";

document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registration-form-plants");
  
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const nickname = document.getElementById("nickname").value;
      const species = document.getElementById("species").value;
      const planted = document.getElementById("planted").value;
      const location = document.getElementById("location").value;
      const photo = document.getElementById("photo").value;
      const user_id = 1;
      const location_id = 1;
      
  
      // Hier können Sie die eingegebenen Daten weiterverarbeiten, z.B. an einen Server senden.
      
      // hinzufügen der daten mit supa
        addUserToDatabase(nickname, species, planted, location, photo, user_id, location_id);

        async function addUserToDatabase(nickname, species, planted, location, photo, user_id, location_id) {
            try {
              const { data, error } = await supa.from('Plant').insert([
                {
                  nickname,
                  species,
                  planted,
                  location,
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
  const fileInput = document.getElementById('photoInput');
  const captionInput = document.getElementById('captionInput');
  
  if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const filePath = `uploads/${file.name}`;
      const { error: uploadError } = await supa.storage.from('photos').upload(filePath, file);
      
      if (uploadError) {
          console.error('Error uploading file:', uploadError);
          return;
      }
      
      const { data, error } = await supa.from('Photos').insert([
          {
              url: filePath,
              caption: captionInput.value
          }
      ]);
      
      if (error) {
          console.error('Error saving to Photos table:', error);
      } else {
          console.log('Uploaded and saved successfully:', data);
          alert('Photo uploaded successfully!');
      }

  } else {
      console.log('No file selected.');
  }
}

// showupload PHOTO

async function fetchAndDisplayPhotos() {
  const { data, error } = await supa.from("Photos").select("url, caption");
  if (error) {
      console.error("Error fetching photos:", error);
      return;
  }
  const photosContainer = document.getElementById('photosContainer');
  for (const photo of data) {
      const signedUrl = await getSignedUrl(photo.url);
      if (signedUrl) {
          const imgElement = document.createElement('img');
          imgElement.src = signedUrl;
          imgElement.alt = "Uploaded photo";
          imgElement.width = 200;
          photosContainer.appendChild(imgElement);
          const captionElement = document.createElement('p');
          captionElement.textContent = photo.caption;
          photosContainer.appendChild(captionElement);
      }
  }
}

fetchAndDisplayPhotos();


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


  