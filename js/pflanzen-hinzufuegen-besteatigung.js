import { supa } from "./supabase.js";

const photosContainer = document.getElementById('photosContainer');


async function getSignedUrl(filePath) {
  const { data, error } = await supa.storage.from('photos').createSignedUrl(filePath, 300);
  if (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
  return data.signedURL;
}

async function fetchAndDisplayPhotos(plant_id) {
  const { data, error } = await supa.from('Plant').select('photo').eq('id', plant_id);

  if (error) {
    console.error("Error fetching photos:", error);
    return; 
  }
  console.log("Fetched photos:", data[0].photo);
  const signedUrl = await getSignedUrl(data[0].photo);
  
  const imgElement = document.createElement('img');
  imgElement.src = signedUrl;
  imgElement.alt = "Uploaded photo";
  imgElement.width = 200;
  photosContainer.appendChild(imgElement);
/*
  for (const photo of data) {
    const signedUrl = await getSignedUrl(photo.url);
    if (signedUrl) {
      const imgElement = document.createElement('img');
      imgElement.src = uploads_MG_1621.JPG;
      imgElement.alt = "Uploaded photo";
      imgElement.width = 200;
      photosContainer.appendChild(imgElement);
      const captionElement = document.createElement('p');
      captionElement.textContent = photo.caption;
      photosContainer.appendChild(captionElement);
    }
  }
  */
}

//Hier werden die Fotos angezeigt
//Nach dem Upload ID abfragen und hier in den Funktionsaufruf einarbeiten
//Zahl 26 ist nur ein Beispiel
fetchAndDisplayPhotos(24);
