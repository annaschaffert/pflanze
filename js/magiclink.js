import { supa } from "/js/supabase.js";

// Funktion, um Magic Link zu senden
async function sendMagicLink() {
    const email = document.getElementById('email').value;
    const { error } = await supa.auth.signIn({ email });
    
    if (error) {
        console.error("Error sending magic link: ", error.message);
    } else {
        console.log("Magic link sent to ", email);
    }
}

// Funktion, um User Status zu aktualisieren
function updateUserStatus(user) {
    const userStatusElement = document.getElementById('userStatus');
    
    if (user) {
        userStatusElement.textContent = `Authenticated as: ${user.email}`;
        window.location.href = "/meine-pflanzen.html";
    } else {
        userStatusElement.textContent = "Not authenticated.";
        
    }
}

// Prüfe und zeige den initialen User Status an
const initialUser = supa.auth.user();
updateUserStatus(initialUser);

// Eventlistener für Magic Link Button
document.getElementById('sendMagicLinkButton').addEventListener('click', sendMagicLink);

// Listener, für Änderungen des Auth Status
// UserStatus wird aktualisiert, wenn sich der Auth Status ändert
supa.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN") {
        console.log("User signed in: ", session.user);
        updateUserStatus(session.user);
    } else if (event === "SIGNED_OUT") {
        console.log("User signed out");
        updateUserStatus(null);
    }
});

// 3. Logout Logik
async function logout() {
    const { error } = await supa.auth.signOut();
    if (error) {
        console.error("Error during logout:", error);
    } else {
        updateUserStatus(null);
        console.log("User logged out successfully.");
    }
}

// Script prüft, ob wir uns auf der Root des Servers befinden
window.addEventListener('DOMContentLoaded', (event) => {
    const rootCheckElem = document.getElementById('rootCheck');
    
    if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
        rootCheckElem.textContent = "You are on the root of the server.";
        rootCheckElem.style.display = "none"; // Hide it if you don't want any message on the root
    } else {
        rootCheckElem.innerHTML = 'Authentication funktioniert nur auf der Root des Servers! Das ist nicht hier, sondern <a href="https://423521-6.web.fhgr.ch"> da </a>';
    }
});
