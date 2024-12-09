// Extract article ID from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('articleId'); // Make sure the parameter matches

// Check if the article ID is valid
if (articleId) {
    // Fetch the article details from the backend using the article ID
    fetch(`http://localhost:8080/api/article-detail/${articleId}`) // Corrected API endpoint
        .then(response => response.json())
        .then(data => {
            const articleDetailsContainer = document.getElementById("articleDetails");

            // Check if the response contains valid article data
            if (data) {
                // Display article details
                articleDetailsContainer.innerHTML = `
                    <h1>${data.title}</h1>
                    <img src="${data.thumbnail_url}" alt="${data.title}">
                    <embed class="pdf"
                                src="${data.article_url}"
                                width="800"
                                height="500"/>

                `;
            } else {
                articleDetailsContainer.innerHTML = '<p>Article not found.</p>';
            }
        })
        .catch(error => {
            console.error("Error fetching article details:", error);
            alert("Error loading article. Please try again later.");
        });
} else {
    alert("No article ID provided in the URL.");
}
