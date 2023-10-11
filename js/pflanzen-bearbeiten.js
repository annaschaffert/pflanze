import { supa } from "./supabase.js";


// HTML-Elemente
const registrationForm = document.getElementById('bearbeitung-form');
const speciesInput = document.getElementById('species');
const nicknameInput = document.getElementById('nickname');
const photoInput = document.getElementById('photo');
const plantedInput = document.getElementById('planted');
const resultMessage = document.getElementById('result-message');

// Funktion zum Bearbeiten einer Pflanze
async function editPlant(id, species, nickname, photo, planted) {
  try {
    // Aktualisieren Sie die Zeile in der Tabelle "Plant" basierend auf der ID
    const { data, error } = await supa
      .from('Plant')
      .update({ species, nickname, photo, planted })
      .eq('id', id);

    if (error) {
      throw error;
    }

    // Überprüfen, ob die Zeile erfolgreich aktualisiert wurde
    if (data) {
      resultMessage.textContent = `Pflanze mit ID ${id} wurde erfolgreich bearbeitet.`;
    } else {
      throw new Error(`Bearbeiten der Pflanze mit ID ${id} fehlgeschlagen.`);
    }
  } catch (error) {
    resultMessage.textContent = `Fehler beim Bearbeiten der Pflanze: ${error.message}`;
  }
}

// Event-Handler für das Formular
bearbeitungForm.addEventListener('submit', async (e) => {
e.preventDefault(); // Verhindern Sie das Standardverhalten des Formulars (Seitenaktualisierung)


// von copilot erstellt, da immer felhermeldung gekommen ist
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const species = speciesInput.value;
  const nickname = nicknameInput.value;
  const photo = photoInput.value; 
  // Beachten Sie, dass Sie hier das Foto verarbeiten müssen
  const planted = plantedInput.value;

  if (id) {
    await editPlant(id, species, nickname, photo, planted);
  } else {
    resultMessage.textContent = 'Bitte wählen Sie eine Pflanze aus, die bearbeitet werden soll.';
  }
});