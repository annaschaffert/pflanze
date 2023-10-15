import { supa, getSignedUrl } from "/js/supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    const buttonMeinePflanzenHinzufuegenBestaetigung = document.querySelector(".button_hinzufuegen_bestaetigung"); // Aktualisierte Zeile

    buttonMeinePflanzenHinzufuegenBestaetigung.addEventListener("click", function () {
        // Hier setzen Sie die URL, zu der Sie zurückkehren möchten
        window.location.href = "meine-pflanzen.html";
    });
});
