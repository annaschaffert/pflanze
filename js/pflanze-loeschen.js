import { supa } from "./supabase.js";

// eventlistener on delete button
document.getElementById('deletePlantButton').addEventListener('click', deletePlant);
const result = document.getElementById('result');


// Funktion zum Löschen eines Benutzers anhand seiner ID
async function deletePlant() {
  const id = document.getElementById('id').value;

  try {
    const { data, error } = await supa.from('Plant').delete().eq('id', id);

    if (error) {
      console.error('Fehler beim Löschen der Pflanze:', error);
    } else {
      console.log('Pflanze wurde erfolgreich gelöscht:', data);
        result.innerHTML = "Pflanze wurde erfolgreich gelöscht";
    }
  } catch (error) {
    console.error('Fehler beim Löschen der Pflanze:', error);
  }
}

//deletePlant();