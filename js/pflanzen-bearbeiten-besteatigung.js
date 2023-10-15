import { supa, getSignedUrl } from "/js/supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    const buttonMeinePflanzen = document.querySelector(".button_meine_pflanzen"); // Aktualisierte Zeile

    buttonMeinePflanzen.addEventListener("click", function () {
        // Hier setzen Sie die URL, zu der Sie zurückkehren möchten
        window.location.href = "meine-pflanzen.html";
    });
});
