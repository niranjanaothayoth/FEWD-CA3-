// script.js
document.addEventListener('DOMContentLoaded', () => {
  fetchRandomMeals(6); // Fetch 6 random meals

  document.getElementById('search').addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
          fetchMealsByCategory(this.value);
      }
  });
});

function fetchRandomMeals(count) {
  for (let i = 0; i < count; i++) {
      fetchRandomMeal();
  }
}

function fetchRandomMeal() {
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(response => response.json())
      .then(data => displayRandomMeal(data.meals[0]));
}

function displayRandomMeal(meal) {
  const container = document.getElementById('random-meal-container');
  const mealElement = document.createElement('div');
  mealElement.classList.add('meal');
  mealElement.setAttribute('onclick', `showMealDetails(${meal.idMeal})`);
  mealElement.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
  `;
  container.appendChild(mealElement);
}

function fetchMealsByCategory(category) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(response => response.json())
      .then(data => displayMeals(data.meals));
}

function displayMeals(meals) {
  const container = document.getElementById('meal-list');
  container.innerHTML = meals.map(meal => `
      <div class="meal" onclick="showMealDetails(${meal.idMeal})">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h3>${meal.strMeal}</h3>
      </div>
  `).join('');
  document.getElementById('search-results').style.display = 'block';
}

function showMealDetails(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(response => response.json())
      .then(data => {
          const meal = data.meals[0];
          const ingredients = [];
          for (let i = 1; i <= 20; i++) {
              if (meal[`strIngredient${i}`]) {
                  ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
              } else {
                  break;
              }
          }
          showModal(meal.strMeal, ingredients);
      });
}

function showModal(title, ingredients) {
  const modalHTML = `
      <div class="modal fade" id="mealModal" tabindex="-1" role="dialog" aria-labelledby="mealModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <h5 class="modal-title" id="mealModalLabel">${title}</h5>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                      <ul>
                          ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                      </ul>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  </div>
              </div>
          </div>
      </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  $('#mealModal').modal('show');
  $('#mealModal').on('hidden.bs.modal', function () {
      document.getElementById('mealModal').remove();
  });
}
