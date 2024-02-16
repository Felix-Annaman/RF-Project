
function getCountryDetails(countryName) {
    return fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => response.json())
        .then(data => data[0]);
}


window.onload = function() {
    const defaultRecipes = [
        { strMeal: 'Jollof Rice', strMealThumb: 'asset/jollof.jpg', idMeal: 'id1' },
        { strMeal: 'Ampesi', strMealThumb: 'asset/ampesi.jpg', idMeal: 'id2' },
        { strMeal: 'Fufu', strMealThumb: 'asset/fufu.jpg', idMeal: 'id3' },
    ];
    displayRecipes(defaultRecipes);
};


document.getElementById('search-button').addEventListener('click', function() {
    const ingredient = document.getElementById('ingredient-input').value;
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then(response => response.json())
    .then(data => {
        if (data.meals) {
            displayRecipes(data.meals);
        } else {
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = '<div class="col-12">No meals found</div>';
        }
    })
    .catch(error => console.error('There has been a problem with your fetch operation: ', error));
});


function displayRecipes(recipes) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';
    recipes.forEach(meal => {
        const div = document.createElement('div');
        div.classList.add('col-md-4');
        div.innerHTML = `
            <div class="card mb-4">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <button class="btn btn-primary">View Recipe</button>
                </div>
            </div>
        `;
        div.querySelector('button').addEventListener('click', function() {
            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals[0];
                return getCountryDetails(meal.strArea)
                    .then(country => ({meal, country}));
            })
            .then(({meal, country}) => {
                document.getElementById('recipe-image').src = meal.strMealThumb;
                document.getElementById('recipe-image').alt = meal.strMeal;
                document.getElementById('recipe-title').textContent = `${meal.strMeal} (${meal.strArea})`;
                document.getElementById('recipe-instructions').textContent = meal.strInstructions;
                document.getElementById('recipe-country-details').innerHTML = `
                    <p>Population: ${country.population}</p>
                    <p>Region: ${country.region}</p>
                    <p>Subregion: ${country.subregion}</p>
                `;
                document.getElementById('recipe-details').style.display = 'block';
            })
            .catch(error => console.error('There has been a problem with your fetch operation: ', error));
        });
        recipeList.appendChild(div);
    });
}
