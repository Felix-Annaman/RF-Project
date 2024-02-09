let currentPage = 0;
const resultsPerPage = 10;
const appId = 'c27c39be';
const appKey = '44d7546ed0ecf1cf76b5278883d9fb69-';

function fetchRecipes(page) {
    document.getElementById('spinner').style.display = 'block';
    const ingredient = document.getElementById('ingredient-input').value;
    const diets = ['vegan', 'vegetarian']
        .filter(diet => document.getElementById(`diet-${diet}`).checked)
        .join(' ');
    fetch(`https://api.edamam.com/search?q=${ingredient}&app_id=018889a7&app_key=48f4486c930a117358842ced29ea540a -&from=${page*resultsPerPage}&to=${(page+1)*resultsPerPage}&diet=${diets}`)
        .then(response => response.json())
        .then(data => {
            const recipes = data.hits.map(hit => hit.recipe);
            document.getElementById('recipes').innerHTML = recipes.map((recipe, index) => `
                <div>
                    <h2>${recipe.label}</h2>
                    <img src="${recipe.image}" alt="${recipe.label}">
                    <p>${recipe.ingredientLines.join(', ')}</p>
                    <button class="save-btn" data-index="${index}">Save</button>
                    <button class="nutrition-btn" data-index="${index}">Get Nutrition Info</button>
                </div>
            `).join('');
            document.querySelectorAll('.save-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.dataset.index;
                    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                    favorites.push(recipes[index]);
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                });
            });
            document.querySelectorAll('.nutrition-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = this.dataset.index;
                    fetchNutritionInfo(recipes[index].label);
                });
            });
            document.getElementById('spinner').style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('spinner').style.display = 'none';
        });
}

function fetchNutritionInfo(foodName) {
    fetch(`https://api.nutritionix.com/v1_1/search/${foodName}?results=0:1&fields=item_name,brand_name,nf_calories,nf_total_fat&appId=${appId}&appKey=${appKey}`)
        .then(response => response.json())
        .then(data => {
            const item = data.hits[0].fields;
            console.log(`Item: ${item.item_name}`);
            console.log(`Brand: ${item.brand_name}`);
            console.log(`Calories: ${item.nf_calories}`);
            console.log(`Total Fat: ${item.nf_total_fat}`);
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    currentPage = 0;
    fetchRecipes(currentPage);
});

document.getElementById('prev-btn').addEventListener('click', function() {
    if (currentPage > 0) {
        currentPage--;
        fetchRecipes(currentPage);
    }
});

document.getElementById('next-btn').addEventListener('click', function() {
    currentPage++;
    fetchRecipes(currentPage);
});

window.addEventListener('load', function() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    document.getElementById('favorites').innerHTML = favorites.map(recipe => `
        <div>
            <h2>${recipe.label}</h2>
            <img src="${recipe.image}" alt="${recipe.label}">
            <p>${recipe.ingredientLines.join(', ')}</p>
        </div>
    `).join('');
});