function toggleAddRecipe() {
  var dataDiv = document.getElementById("hiddenAddRecipe");
  if (dataDiv.style.display === "none") {
    dataDiv.style.display = "block";
  } else {
    dataDiv.style.display = "none";
  }
}

function toggleViewRecipe() {
  var dataDiv = document.getElementById("hiddenViewRecipe");
  if (dataDiv.style.display === "none") {
    dataDiv.style.display = "block";
  } else {
    dataDiv.style.display = "none";
  }
}

// Add data function on json;
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("myForm");
  const submitButton = document.getElementById("addButton");
  const viewButton = document.getElementById("viewButton");
  const dataContainer = document.getElementById("dataContainer");

  submitButton.addEventListener("click", async function () {
    try {
      const formData = new FormData(form);
      const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });

      const response = await fetch("http://localhost:3000/recipes");
      const data = await response.json();

      const nextId =
        data.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
      formDataObject.id = nextId;

      const postResponse = await fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      });

      const postData = await postResponse.json();
      console.log("Data sent successfully:", postData);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  });

  viewButton.addEventListener("click", async function () {
    try {
      const response = await fetch("http://localhost:3000/recipes");
      const data = await response.json();
      displayData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  });

  function displayData(data) {
    dataContainer.innerHTML = "";
    data.forEach((entry) => {
      const entryContainer = document.createElement("div");
      entryContainer.innerHTML = `
  <p><strong>ID:</strong> ${entry.id}</p>
  <p><strong>Name:</strong> ${entry.itemName}</p>
  <p><strong>Description:</strong> ${entry.description}</p>
  <p><strong>Ingredients:</strong> ${entry.ingredients}</p>
  <p><strong>Recipe:</strong> ${entry.recipe}</p>
  <div class="button-group">
  <button type="button" class="btn btn-info" onclick="editEntry(${entry.id}, '${entry.itemName}', '${entry.description}', '${entry.ingredients}', '${entry.recipe}')">Edit</button>
  <button type="button" class="btn btn-danger" onclick="deleteEntry(${entry.id})">Delete</button>
  </div>
  <hr>`;
      dataContainer.appendChild(entryContainer);
    });
  }
});

async function editEntry(id, itemName, description, ingredients, recipe) {
  const newName = prompt("Enter new Item name:", itemName);
  const newDescription = prompt("Enter new description:", description);
  const newIngredients = prompt("Enter new Ingredients:", ingredients);
  const newRecipe = prompt("Enter new Recipe:", recipe);

  const updatedData = {
    id: id,
    itemName: newName,
    description: newDescription,
    ingredients: newIngredients,
    recipe: newRecipe,
  };

  try {
    const response = await fetch(`http://localhost:3000/recipes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    console.log("Data updated successfully:", data);

    viewButton.click();
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

async function deleteEntry(id) {
  if (confirm("Are you sure you want to delete this entry?")) {
    try {
      const response = await fetch(`http://localhost:3000/recipes/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log("Entry deleted successfully:", data);
      viewButton.click();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  }
}
