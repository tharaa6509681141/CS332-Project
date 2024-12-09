function isUserLoggedIn() {
    const token = localStorage.getItem("isAuthenticated");
    console.log("Auth Token:", token); // Debugging output
    return !!token; // Ensure this returns true only if the token exists
}

fetch("http://localhost:8080/api/allArticles")
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        const articlesContainer = document.getElementById("allArticles");

        const loggedIn = isUserLoggedIn(); // Check if the user is logged in
        console.log("User Logged In:", loggedIn); // Debugging output

        // Retrieve bookmark states from localStorage
        const bookmarkStates = JSON.parse(localStorage.getItem("bookmarkedArticles")) || {};

        data.forEach(article => {
            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");

            // Determine the bookmark state for the article
            const isBookmarked = bookmarkStates[article.article_id] || false;

            // Insert the article content
            articleCard.innerHTML = `
                <img src="${article.thumbnail_url}" class="thumbnail" alt="${article.title}">
                <div class="upper">
                    <h3 class="article-title">${article.title}</h3>
                    <img src="${isBookmarked ? "pic/bookmark-yellow.png" : "pic/bookmark.png"}"
                        alt="Bookmark"
                        class="bookmark-icon ${loggedIn ? '' : 'hidden'}">
                </div>
                <p>${article.description}</p>
            `;

            // Add click event to the thumbnail and title
            const thumbnail = articleCard.querySelector(".thumbnail");
            const title = articleCard.querySelector(".article-title");

            thumbnail.addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${article.article_id}`;
            });

            title.addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${article.article_id}`;
            });

            // Add click event to the bookmark icon
            const bookmarkIcon = articleCard.querySelector(".bookmark-icon");
            if (bookmarkIcon) {
                bookmarkIcon.addEventListener("click", (event) => {
                    event.stopPropagation(); // Prevent the card click from triggering

                    const currentState = bookmarkIcon.src.includes("bookmark-yellow.png");
                    const articleId = article.article_id;

                    // Toggle the bookmark icon image
                    if (currentState) {
                        // If already bookmarked, remove the bookmark
                        bookmarkIcon.src = "pic/bookmark.png";
                        deleteBookmark(articleId);  // Call API to remove bookmark
                        bookmarkStates[articleId] = false;
                    } else {
                        // If not bookmarked, add the bookmark
                        bookmarkIcon.src = "pic/bookmark-yellow.png";
                        addBookmark(articleId);  // Call API to add bookmark
                        bookmarkStates[articleId] = true;
                    }

                    // Update the bookmark state in localStorage
                    localStorage.setItem("bookmarkedArticles", JSON.stringify(bookmarkStates));

                    // Add animation class
                    bookmarkIcon.classList.add("animate");

                    // Remove animation class after the animation duration
                    setTimeout(() => {
                        bookmarkIcon.classList.remove("animate");
                    }, 200); // Match the animation duration in CSS
                });
            }

            // Append the article card to the articles container
            articlesContainer.appendChild(articleCard);
        });
    })
    .catch(error => {
        console.error("Error loading articles:", error);
        alert("Error loading articles. Please try again later.");
    });

function addBookmark(articleId) {
    const userId = localStorage.getItem("id"); // Retrieve user_id from localStorage

    if (!userId) {
        alert("User not authenticated. Please log in.");
        return; // Exit if the user is not authenticated
    }

    const bookmarkData = {
        user_id: Number(userId), // Convert user_id to a number
        article_id: Number(articleId), // Convert article_id to a number
    };

    // Log the JSON data to check what is being sent
    console.log("Bookmark Data:", JSON.stringify(bookmarkData));

    fetch("http://localhost:8080/api/addBookmark", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bookmarkData),
    })
    .then(response => {
        // Check if the response is not JSON
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            return response.json(); // Parse the JSON response
        } else {
            return response.text().then(text => { // Handle plain text response
                throw new Error(text); // Throw an error with the response text
            });
        }
    })
    .then(data => {
        console.log("Bookmark added:", data);
    })
    .catch(error => {
        console.error("Error adding bookmark:", error);
        alert("Failed to add bookmark. " + error.message);
    });
}



// Function to remove a bookmark (DELETE request)
function deleteBookmark(articleId) {
    fetch(`http://localhost:8080/api/delete/${articleId}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log("Bookmark removed:", data);
    })
    .catch(error => {
        console.error("Error removing bookmark:", error);
        alert("Failed to remove bookmark.");
    });
}
