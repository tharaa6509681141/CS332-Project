// Fetch articles from the backend
fetch("http://localhost:8080/api/allArticles")
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        const articlesContainer = document.getElementById("allArticles");

        data.forEach(article => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");

            const bookmarkIcon = document.createElement("img");
            bookmarkIcon.src = "pic/bookmark.png";  // Path to the bookmark icon image
            bookmarkIcon.alt = "Bookmark";
            bookmarkIcon.classList.add("bookmark-icon");  // Add a class for styling

            // Add click event to redirect to article-detail.html with article ID
            articleCard.addEventListener('click', () => {
                window.location.href = `article-detail.html?articleId=${article.article_id}`; // Corrected URL parameter
            });

            // Insert the article content along with the bookmark icon
            articleCard.innerHTML = `
                <img src="${article.thumbnail_url}" class="thumbnail" alt="${article.title}">
                <div class=upper ><h3>${article.title}</h3>
                <img src="pic/bookmark.png" alt="Bookmark" class="bookmark-icon">
                    </div>
                <p>${article.description}</p>
            `;



            // Append the article card to the articles container
            articlesContainer.appendChild(articleCard);
        });
    })
    .catch(error => {
        console.error("Error loading articles:", error);
        alert("Error loading articles. Please try again later.");
    });
