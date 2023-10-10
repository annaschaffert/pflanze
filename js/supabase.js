console.log("Initialisierung Supabase");

// Supabase Initialisierung
const supabaseUrl = 'https://ghuslyfkuvukzhimvdhf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodXNseWZrdXZ1a3poaW12ZGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4MzcyMzAsImV4cCI6MjAxMjQxMzIzMH0.hP8ekeTgxKjWGwHqZ0HkoopPEltoft238Bk0lMUBmss'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        redirectTo: window.location.origin,  // This will redirect back to the page where the request originated from
    },
});

export { supa }

// Funktion zum Hinzufügen eines neuen Benutzers zur Datenbank
async function addUserToDatabase(first_name, last_name, email) {
    try {
      const { data, error } = await supabase.from('user').insert([
        {
          first_name,
          last_name,
          email,
        },
      ]);
  
      if (error) {
        console.error('Fehler beim Hinzufügen des Benutzers:', error);
        return false;
      }
  
      console.log('Benutzer wurde erfolgreich hinzugefügt:', data);
      return true;
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Benutzers:', error);
      return false;
    }
  }
  
  // Beispielaufruf der Funktion zum Hinzufügen eines Benutzers
  addUserToDatabase('Max', 'Mustermann', 'max@example.com');