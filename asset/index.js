function getCountryDetails(countryName) {
    return fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => data[0]);
}

window.onload = function() {
    const defaultRecipes = [
        { strMeal: 'Jollof Rice', strMealThumb: 'asset/jollof.jpg', idMeal: 'id1' },
        { strMeal: 'Ampesi', strMealThumb: 'asset/ampesi.jpg', idMeal: 'id2' },
        { strMeal: 'Fufy', strMealThumb: 'asset/fufu.jpg', idMeal: 'id3' },
    ];
    displayRecipes(defaultRecipes);
};

document.getElementById('search-button').addEventListener('click', function() {
    const ingredient = document.getElementById('ingredient-input').value;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const recipeList = document.getElementById('recipe-list');
        recipeList.innerHTML = '';
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            recipeList.innerHTML = '<div class="col-12">No meals found</div>';
        }
    })
    .catch(error => console.error('There has been a problem with your fetch operation: ', error));
});

function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipes.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML = `
            <div class="card mb-4">
                <img src="${meal.strMealThumb}" class="card-img-top recipe-image" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                </div>
            </div>
        `;
        recipeList.appendChild(div);
    });
}
