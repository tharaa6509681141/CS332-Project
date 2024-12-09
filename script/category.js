// Function to get query parameter from URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Map category codes to category names
const categoryNames = {
    math: 'คณิตศาสตร์',
    bio: 'ชีวะวิทยา',
    chem: 'เคมี',
    phy: 'ฟิสิกส์',
    eng: 'ภาษาต่างประเทศ',
    art: 'ศิลปะ'
};

// Function to fetch articles by category
function fetchArticlesByCategory(category) {
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
            document.getElementById('allArticles').innerHTML = 'Failed to load articles.';
        });
}

// Function to display articles on the page
// Function to display articles on the page
function displayArticles(articles) {
    const articlesContainer = document.getElementById('allArticles');
    articlesContainer.innerHTML = ''; // Clear previous results

    if (!articles || articles.length === 0) {
        articlesContainer.textContent = 'No articles found in this category.';
    } else {
        articles.forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.classList.add('article');

            // Article image
            const img = document.createElement('img');
            img.src = article.thumbnail_url || 'default-thumbnail.jpg'; // Fallback for missing image
            img.alt = article.title || 'Article Image';
            articleDiv.appendChild(img);

            // Article title
            const title = document.createElement('h3');
            title.textContent = article.title || 'Untitled';
            articleDiv.appendChild(title);

            // Article description
            const description = document.createElement('p');
            description.textContent = article.description || 'No description available.';
            articleDiv.appendChild(description);

            // Add click event listener for navigation
            const articleId = article.id || article.article_id; // Adjust based on your API response
            articleDiv.addEventListener('click', () => {
                if (articleId) {
                    window.location.href = `article-detail.html?articleId=${articleId}`;
                } else {
                    console.error("Article ID is missing:", article);
                    alert("Unable to navigate: Article ID is missing.");
                }
            });

            // Append article div to the container
            articlesContainer.appendChild(articleDiv);
        });
    }
}


// Entry point for page load
window.onload = function () {
    const category = getQueryParam('category');
    const categoryTitle = document.getElementById('categoryTitle');

    if (category) {
        // Check if the category exists in the map
        if (categoryNames[category]) {
            categoryTitle.textContent = categoryNames[category];  // Display the category name
            fetchArticlesByCategory(category);
        } else {
            categoryTitle.textContent = 'Category not found.';
        }
    } else {
        categoryTitle.textContent = 'No category selected.';
    }
};
