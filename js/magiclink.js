import { supa } from "/js/supabase.js";

// Funktion zum Senden eines Magic Links
async function sendMagicLink() {
    const email = document.getElementById('email').value;
    const { error } = await supa.auth.signIn({ email });
    
    if (error) {
        console.error("Fehler beim Senden des Magic Links: ", error.message);
    } else {
        console.log("Magic Link wurde an ", email, " gesendet.");
    }
}

// Funktion zur Aktualisierung des Benutzerstatus
function updateUserStatus(user) {
    const userStatusElement = document.getElementById('userStatus');
    
    if (user) {
        console.log(user);
        userStatusElement.textContent = `Angemeldet als: ${user.email}`;
    
    } else {
        userStatusElement.textContent = "Nicht angemeldet.";
    }
}

// Prüfe und zeige den anfänglichen Benutzerstatus an
const initialUser = supa.auth.user();
updateUserStatus(initialUser);

// Eventlistener für den Magic Link Button
document.getElementById('sendMagicLinkButton').addEventListener('click', sendMagicLink);

// Listener für Änderungen des Authentifizierungsstatus
// Der Benutzerstatus wird aktualisiert, wenn sich der Authentifizierungsstatus ändert
supa.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
        console.log("Benutzer angemeldet: ", session.user);
        updateUserStatus(session.user);

        // Weiterleitung zur Seite "meine-pflanzen.html"
        window.location.href = "meine-pflanzen.html";
    } else if (event === "SIGNED_OUT") {
        console.log("Benutzer abgemeldet");
        updateUserStatus(null);
    }
});
// Logout-Logik
async function logout() {
    const { error } = await supa.auth.signOut();
    if (error) {
        console.error("Fehler beim Abmelden:", error);
    } else {
        updateUserStatus(null);
        console.log("Benutzer erfolgreich abgemeldet.");
    }
}

// Skript überprüft, ob sich die Anwendung auf der Root des Servers befindet
window.addEventListener('DOMContentLoaded', (event) => {
    const rootCheckElem = document.getElementById('rootCheck');
    
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
        rootCheckElem.textContent = "Du befindest dich auf der Root des Servers.";
        rootCheckElem.style.display = "none"; // Verberge es, wenn keine Nachricht auf der Rootseite angezeigt werden soll
    } else {
        rootCheckElem.innerHTML = 'Die Authentifizierung funktioniert nur auf der Root des Servers! Du befindest dich hier, aber die Authentifizierung funktioniert <a href="https://423521-6.web.fhgr.ch">hier</a>.';
    }
});
