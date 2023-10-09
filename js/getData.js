import { supa } from "/js/supabase.js";

async function showPlants() {
    console.log("showPlants");
  const ul = document.querySelector('#list');
  const { data: plants, error } = await supa.from('Plant').select();
  console.log(error);


  console.log(plants);
  plants.forEach(plant => {
    console.log(plant);
    const li = document.createElement('li');
    li.innerHTML = plant.title;
    ul.appendChild(li);
  })
}
showPlants();

async function showUsers() {
  const table = document.querySelector('#table');
  const { data: users, error } = await supa.from("User").select();
  users.forEach(user => {
    const output = `
      <tr>
        <td>${user.first_name}</td>
        <td>${user.last_name}</td>
        <td>${user.email}</td>
    
      </tr>
    `;
    table.innerHTML += output;
  })
}


showUsers();