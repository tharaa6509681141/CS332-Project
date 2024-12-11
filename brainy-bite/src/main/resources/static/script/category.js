// Helper function to get query parameter values
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch and display articles by category
function fetchArticlesByCategory(category) {
    const articlesContainer = document.getElementById('allArticles');
    articlesContainer.innerHTML = '<p>Loading articles...</p>'; // Placeholder while loading

    fetch(`http://localhost:8080/api/category/${encodeURIComponent(category)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayArticles(data);
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            articlesContainer.innerHTML = '<p>Failed to load articles. Please try again later.</p>';
        });
}

// Function to render articles dynamically
function displayArticles(articles) {
    const articlesContainer = document.getElementById('allArticles');
    articlesContainer.innerHTML = ''; // Clear previous content

    if (!articles || articles.length === 0) {
        articlesContainer.innerHTML = '<p>No articles found for this category.</p>';
        return;
    }

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article');

        // Add article image
        const img = document.createElement('img');
        img.src = article.thumbnail_url || 'default-thumbnail.jpg';
        img.alt = article.title || 'Article Image';
        articleDiv.appendChild(img);

        // Add article title
        const title = document.createElement('h3');
        title.textContent = article.title || 'Untitled';
        articleDiv.appendChild(title);

        // Add article description
        const description = document.createElement('p');
        description.textContent = article.description || 'No description available.';
        articleDiv.appendChild(description);

        // Add click event listener for navigation
        const articleId = article.id || article.article_id; // Adjust based on API response
        articleDiv.addEventListener('click', () => {
            if (articleId) {
                window.location.href = `article-detail.html?articleId=${articleId}`;
            } else {
                console.error('Article ID is missing:', article);
                alert('Unable to navigate: Article ID is missing.');
            }
        });

        // Append article div to the container
        articlesContainer.appendChild(articleDiv);
    });
}

// Function to update the category title
function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle) {
        categoryTitle.textContent = `${category || 'Unknown'}`;
    }
}

// Entry point on page load
window.onload = function () {
    const category = getQueryParam('category');

    if (category) {
        // Update the category title
        updateCategoryTitle(category);

        // Fetch and display articles for the selected category
        fetchArticlesByCategory(category);
    } else {
        const articlesContainer = document.getElementById('allArticles');
    }
};
