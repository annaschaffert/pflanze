import { supa, getSignedUrl } from "/js/supabase.js";

document.addEventListener("DOMContentLoaded", async function () {
    const detailPflanzenAnsicht = document.getElementById("detailPflanzenAnsicht");
    const deleteButton = document.querySelector(".button_loeschen");
    const editButton = document.querySelector(".button_bearbeiten");

    // Get the plant ID from the URL
    const params = new URLSearchParams(window.location.search);
    const plantId = params.get("id");

    if (!plantId) {
        // Handle the case where the plant ID is missing in the URL
        console.error("Plant ID is missing in the URL.");
        return;
    }

    // Fetch the plant details using the ID
    const { data: plant, error } = await supa.from("Plant").select().eq("id", plantId);

    if (error) {
        console.error("Error fetching plant details:", error);
        return;
    }

    // Ensure that there's a plant with the given ID
    if (plant.length === 0) {
        console.error("Plant not found with ID:", plantId);
        return;
    }

    const selectedPlant = plant[0];

    // Fetch the signed URL for the plant's photo
    const { data: photoData, error: photoError } = await supa.from('Plant').select('photo').eq('id', plantId);

    if (photoError) {
        console.error("Error fetching plant photo:", photoError);
        return;
    }

    const signedUrl = await getSignedUrl(photoData[0].photo);

    // Display plant details
    detailPflanzenAnsicht.innerHTML = `
        <h2>${selectedPlant.nickname}</h2>
        <img src="${signedUrl}" alt="Plant Photo">
        <p>Species: ${selectedPlant.species}</p>
        <p>Planted: ${selectedPlant.planted}</p>
        <p>Location: ${selectedPlant.location}</p>
        <p>Photo: ${selectedPlant.photo}</p>
    `;

    // Add event listeners to delete and edit buttons
    deleteButton.addEventListener("click", () => {
        // Implement your delete logic here
        // You can use plantId to delete the specific plant.
        // Example: send a DELETE request to your API.

        // ab hier code von deletebutton

          // Event listener for "Löschen" (Delete) button click
    deleteButton.addEventListener("click", async function () {
        if (confirm("Are you sure you want to delete this plant?")) {
            // If the user confirms the deletion
            // Delete the plant from the database
            const { data: deletedPlant, error: deleteError } = await supa
                .from("Plant")
                .delete()
                .eq("id", plantId);

            if (deleteError) {
                console.error("Error deleting plant:", deleteError);
                return;
            }

            // Redirect to a page or display a message to indicate success
            alert("Plant deleted successfully.");
            // Optionally, redirect to another page after deletion
            window.location.href = "some-other-page.html";
        }
    });
});

    editButton.addEventListener("click", () => {
        // Implement your edit logic here
        // You can navigate to an edit page or open a modal for editing.

         // Event listener for "Edit" button click

         //ab hier code von editbutton 
         
    editButton.addEventListener("click", function () {
        const formFields = `
            <h2>Edit Plant Details</h2>
            <form id="editPlantForm">
                <label for="nickname">Nickname:</label>
                <input type="text" id="nickname" name="nickname" value="${selectedPlant.nickname}" required>
                <label for="species">Species:</label>
                <input type="text" id="species" name="species" value="${selectedPlant.species}" required>
                <label for="planted">Planted:</label>
                <input type="date" id="planted" name="planted" value="${selectedPlant.planted}" required>
                <label for="location">Location:</label>
                <input type="text" id="location" name="location" value="${selectedPlant.location}" required>
                <label for="photo">Foto:</label>
                <input type="file" id="photo" name="phozo" value="${selectedPlant.photo}" required>
                <button type="submit">Update</button>
            </form>
        `;

        detailPflanzenAnsicht.innerHTML = formFields;

        // Add event listener to the form for updating the plant details
        const editPlantForm = document.getElementById("editPlantForm");
        editPlantForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const updatedPlantData = {
                nickname: editPlantForm.nickname.value,
                species: editPlantForm.species.value,
                planted: editPlantForm.planted.value,
                location: editPlantForm.location.value,
                photo: editPlantForm.photo.value,
            };

            // Update the plant details in the database
            const { data: updatedPlant, error: updateError } = await supa
                .from("Plant")
                .update(updatedPlantData)
                .eq("id", plantId);

            if (updateError) {
                console.error("Error updating plant details:", updateError);
                return;
            }

            // Display the updated plant details
            displayPlantDetails();
        });
    });
});
});      
