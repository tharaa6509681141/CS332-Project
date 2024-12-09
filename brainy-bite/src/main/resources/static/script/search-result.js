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
    console.log('Fetched Articles:', articles); // Debug: Log fetched articles
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; // Clear previous results

    if (articles.length === 0) {
        searchResultsDiv.textContent = 'No articles found.';
    } else {
        articles.forEach(article => {
            if (!article.id && !article.article_id) {
                console.warn("Skipping article with missing ID:", article);
                return; // Skip articles without an ID
            }

            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');

            const img = document.createElement('img');
            img.src = article.thumbnail_url || 'default-thumbnail.jpg'; // Fallback thumbnail
            img.alt = article.title || 'Article Image';
            articleDiv.appendChild(img);

            const title = document.createElement('h2');
            title.textContent = article.title || 'Untitled';
            articleDiv.appendChild(title);

            const detail = document.createElement('p');
            detail.textContent = article.description || 'No description available.';
            articleDiv.appendChild(detail);

            // Navigate on click
            const articleId = article.id || article.article_id;
            articleDiv.addEventListener('click', () => {
                window.location.href = `article-detail.html?articleId=${articleId}`;
            });

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
