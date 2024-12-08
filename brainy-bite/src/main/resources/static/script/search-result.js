// Function to retrieve URL query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch articles based on search term
function fetchArticles(searchTerm) {
    // Make AJAX request to fetch articles
    fetch('http://localhost:8080/api/article/' + searchTerm)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the fetched articles
            displayArticles(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Function to display articles
function displayArticles(articles) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; // Clear previous results

    if (articles.length === 0) {
        searchResultsDiv.textContent = 'No articles found.';
    } else {
        articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article'); // Add a class for styling if needed

            // Create and set up elements for the article display
            const img = document.createElement('img');
            img.src = article.thumbnail_url; // Assuming `pic` contains the URL for the article image
            img.alt = article.title;
            articleDiv.appendChild(img);

            const title = document.createElement('h2');
            title.textContent = article.title;
            articleDiv.appendChild(title);

            const detail = document.createElement('p');
            detail.textContent = article.description;
            articleDiv.appendChild(detail);

            // Add click event listener to redirect to article detail page
            articleDiv.addEventListener('click', () => {
                window.location.href = `http://localhost:8080/article-detail.html?articleId=${article.id}`;
            });

            // Append the articleDiv to the searchResultsDiv
            searchResultsDiv.appendChild(articleDiv);
        });
    }
}

// Entry point
window.onload = function() {
    // Get the search term from the URL query parameter
    const searchTerm = getQueryParam('search');
    if (searchTerm) {
        // Fetch articles based on the search term
        fetchArticles(searchTerm);
    } else {
        // No search term provided, display a message
        const searchResultsDiv = document.getElementById('searchResults');
        searchResultsDiv.textContent = 'No search term provided.';
    }
};
