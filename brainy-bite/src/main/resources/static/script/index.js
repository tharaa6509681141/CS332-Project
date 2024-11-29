// Fetch articles from the backend
fetch("http://localhost:8080/api/allArticles")
    .then(response => response.json())  // Parse the JSON response
    .then(data => {
        const articlesContainer = document.getElementById("allArticles");

        data.forEach(article => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");

            articleCard.innerHTML = `
                <img src="${article.thumbnail_url}" alt="${article.title}">
                <h3>${article.title}</h3>
                <p>${article.description}</p>
            `;

            articlesContainer.appendChild(articleCard);
        });
    })
    .catch(error => {
        console.error("Error loading articles:", error);
        alert("Error loading articles. Please try again later.");
    });
