
// Select the start screen container
const startScreen = document.querySelector(".start-screen");

// Select the CRUD (Create, Read, Update, Delete) section
const crudSection = document.querySelector(".crud-section");

// Select the recipe form (hidden initially)
const recipeForm = document.getElementById("hidden-add");

// ----------------------------
// Recipe List
// ----------------------------

// Select the container where all recipes will be displayed
const recipeList = document.querySelector(".recipe-list");

// ----------------------------
// Buttons
// ----------------------------

// Select Cancel button in the form
const cancelbtn = document.querySelector(".cancel");

// Select Delete button (used in event delegation)
const deletebtn = document.querySelector(".delete");

// Select Save button in the form
const savebtn = document.querySelector(".save");

// Select Add Recipe button
const showFormBtn = document.querySelector(".add");

// Select Start button
const startBtn = document.querySelector(".start-button");

// Search input
const searchInput = document.querySelector(".search");

// Filter
const categoryFilter = document.querySelector(".filter");

// ----------------------------
// Variables
// ----------------------------

// Used to track which recipe is currently being edited
let editMode = null;

// ----------------------------
// Event Listeners
// ----------------------------

// Start button click → hide start screen, show CRUD section
startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    crudSection.style.display = "block";
});

// Show form on Add Recipe button click
showFormBtn.addEventListener("click", (event) => {
    event.preventDefault();
    recipeForm.style.display = "block";
    showFormBtn.style.display = "none";
});

// Save button click → add or update recipe
savebtn.addEventListener("click", (event) => {
    event.preventDefault(); // prevent page reload

    // Get form values
    const title = document.getElementById("recipe-title").value.trim();
    const ingredients = document.getElementById("recipe-ingredients").value.trim();
    const instructions = document.getElementById("recipe-instructions").value.trim();
    const category = document.getElementById("recipe-category").value;

    // Check all fields are filled
    if(title && ingredients && instructions && category){

        // Convert newlines to <br>
        const formattedIngredients = ingredients.replace(/\n/g, "<br>");
        const formattedInstructions = instructions.replace(/\n/g, "<br>");
        
        if(editMode) {
            // ----------------------------
            // Edit existing recipe
            // ----------------------------
            editMode.querySelector(".recipe-preview h3").innerText = title;
            const paragraphs = editMode.querySelectorAll("p");
            paragraphs[0].innerHTML = `<strong>Category:</strong> ${category}`;
            paragraphs[1].innerHTML = `<strong>Ingredients:</strong> ${formattedIngredients}`;
            paragraphs[2].innerHTML = `<strong>Instructions:</strong> ${formattedInstructions}`;
            
            editMode = null;
            document.getElementById("form-title").innerText = "Add Recipe";

        } else {
            // ----------------------------
            // Add new recipe
            // ----------------------------
            const li = document.createElement("li");
            li.innerHTML = `
                <div class="recipe-preview">
                    <h3>${title}</h3>
                </div>
                <div class="recipe-details hidden">
                    <p><strong>Category:</strong> ${category}</p>
                    <p><strong>Ingredients:</strong> ${formattedIngredients}</p>
                    <p><strong>Instructions:</strong> ${formattedInstructions}</p>

                    <div class="recipe-actions">
                        <button class="edit"><i class="fas fa-edit"></i> Edit</button>
                        <button class="delete"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>    
            `;
            
            recipeList.appendChild(li);
        }

        // Reset form and hide
        clear_form();
        recipeForm.style.display = "none";
        showFormBtn.style.display = "block";

        // Update list based on current search/category
        filterRecipes();

    } else {
        alert("Please fill out all fields before saving!");
    }
}); 

// ----------------------------
// Functions
// ----------------------------

// Clears the recipe form fields
function clear_form(){
    document.getElementById("recipe-title").value = "";
    document.getElementById("recipe-ingredients").value = "";
    document.getElementById("recipe-instructions").value = "";
    document.getElementById("recipe-category").value = ""; 
}

// ----------------------------
// Cancel button → reset form
// ----------------------------
cancelbtn.addEventListener("click", () => {
    clear_form();
    recipeForm.style.display = "none";
    showFormBtn.style.display = "block";
    editMode = null; // reset edit mode
    document.getElementById("form-title").innerText = "Add Recipe";
});

// ----------------------------
// Delete recipe → using event delegation
// ----------------------------
recipeList.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".delete");
    if (deleteBtn) {
      const li = deleteBtn.closest("li");
      if (li) li.remove();
    }
});

// ----------------------------
// Edit recipe → using event delegation
// ----------------------------
recipeList.addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit");
    if (editBtn) {
        // Change form heading to "Edit Recipe"
        document.getElementById("form-title").innerText = "Edit Recipe";

        // Fill the form with existing values
        const li = editBtn.closest("li");
        const details = li.querySelector(".recipe-details");

        document.getElementById("recipe-title").value = li.querySelector(".recipe-preview h3").innerText;
        document.getElementById("recipe-category").value = details.querySelector("p:nth-of-type(1)").innerText.replace("Category:", "").trim();
        document.getElementById("recipe-ingredients").value = details.querySelector("p:nth-of-type(2)").innerText.replace("Ingredients:", "").trim();
        document.getElementById("recipe-instructions").value = details.querySelector("p:nth-of-type(3)").innerText.replace("Instructions:", "").trim();

        recipeForm.style.display = "block";
        showFormBtn.style.display = "none";
        editMode = li; // track recipe being edited
        filterRecipes();
    }
});

// ----------------------------
// Toggle recipe details on preview click
// ----------------------------
recipeList.addEventListener("click", (event) => {
    if (event.target.closest(".recipe-preview")) {
        const li = event.target.closest("li");
        const details = li.querySelector(".recipe-details");

        // Toggle display
        if (details.style.display === "block") {
            details.style.display = "none";
        } else {
            details.style.display = "block";
        }
    }
});

// ----------------------------
// Sort and search
// ----------------------------


categoryFilter.addEventListener("change", filterRecipes);
searchInput.addEventListener("input", filterRecipes);

function filterRecipes() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const allRecipes = recipeList.querySelectorAll("li");
    allRecipes.forEach(li => {
        const title = li.querySelector(".recipe-preview h3").innerText.toLowerCase();
        const ingredients = li.querySelector(".recipe-details p:nth-of-type(2)").innerText.toLowerCase();
        const category = li.querySelector(".recipe-details p:nth-of-type(1)").innerText.replace("Category:", "").trim().toLowerCase();

        const matchesSearch = title.includes(searchTerm) || ingredients.includes(searchTerm);
        const matchesCategory = selectedCategory === "All" || category === selectedCategory.toLowerCase();

        li.style.display = matchesSearch && matchesCategory ? "block" : "none";
    });
}