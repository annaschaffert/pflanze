console.log("Initialisierung Supabase");

// Supabase Initialisierung
const supabaseUrl = 'https://ghuslyfkuvukzhimvdhf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodXNseWZrdXZ1a3poaW12ZGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4MzcyMzAsImV4cCI6MjAxMjQxMzIzMH0.hP8ekeTgxKjWGwHqZ0HkoopPEltoft238Bk0lMUBmss'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
  auth: {
      redirectTo: 'https://423521-6.web.fhgr.ch/pflanze/',  // Hier die korrekte Weiterleitungs-URL eintragen
  },
});

async function getSignedUrl(filePath) {
    const { data, error } = await supa.storage.from('photos').createSignedUrl(filePath, 300);
    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }
    return data.signedURL;
  }
  


export { supa, getSignedUrl }