// Script.js

// 1. Fonctionnalité : Ajout dynamique de champs d'ingrédients
document.addEventListener("DOMContentLoaded", () => {
    const addIngredientButton = document.getElementById("add-ingredient");
    const ingredientField = document.getElementById("recipe-ingredients");
    const form = addIngredientButton.parentElement; // Prendre le parent direct du bouton

    addIngredientButton.addEventListener("click", () => {
        // Crée un nouveau champ d'ingrédient
        const newIngredientInput = document.createElement("input");
        newIngredientInput.type = "text";
        newIngredientInput.name = "recipe-ingredients[]";
        newIngredientInput.classList.add("add-recipe__input");
        newIngredientInput.placeholder = "Nouvel ingrédient";

        // Ajoute le champ juste avant le bouton "Ajouter un ingrédient"
        form.insertBefore(newIngredientInput, addIngredientButton);
    });

    // 2. Fonctionnalité : Affichage/Masquage du détail de la recette
    const recipeNames = document.querySelectorAll(".recipes__name");

    recipeNames.forEach((recipe) => {
        recipe.addEventListener("click", (event) => {
            // Sélectionne l'élément de détail correspondant à cette recette
            const recipeDetails = event.target.nextElementSibling.nextElementSibling;
            
            // Toggle l'affichage du détail de la recette
            if (recipeDetails.style.display === "block") {
                recipeDetails.style.display = "none";
            } else {
                recipeDetails.style.display = "block";
            }
        });
    });
});

