// Function to retrieve URL query parameter by name

function isUserLoggedIn() {
    const token = localStorage.getItem("isAuthenticated");
    console.log("Auth Token:", token); // Debugging output
    return !!token; // Ensure this returns true only if the token exists
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to fetch articles based on search term
function fetchArticles(searchTerm) {
    // Make AJAX request to fetch articles
    fetch('/api/article/' + searchTerm)
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
    //const searchResultsDiv = document.getElementById('searchResults');
   // searchResultsDiv.innerHTML = ''; // Clear previous results

    if (articles.length === 0) {
        searchResultsDiv.textContent = 'No articles found.';
    } else {
        articles.forEach(async article => {
            if (!article.id && !article.article_id) {
                console.warn("Skipping article with missing ID:", article);
                return; // Skip articles without an ID
            }

            const loggedIn = isUserLoggedIn(); // Check if the user is logged in
            console.log("User Logged In:", loggedIn);

            const userId = localStorage.getItem("id");

            const articleCard = document.createElement("div");
            articleCard.classList.add("article-card");
            const articlesContainer = document.getElementById("allArticles");

            var isBookmarked = await checkBookmarkStatus(userId, article.article_id)

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
            articleCard.querySelector(".thumbnail").addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${article.article_id}`;
            });

            articleCard.querySelector(".article-title").addEventListener("click", () => {
                window.location.href = `article-detail.html?articleId=${article.article_id}`;
            });

            const bookmarkIcon = articleCard.querySelector(".bookmark-icon");
            if (bookmarkIcon) {
                bookmarkIcon.addEventListener("click", (event) => {
                    event.stopPropagation(); // ป้องกันไม่ให้เกิด event ที่ซ้อนกัน
                    handleBookmarkClick(event, article.article_id, bookmarkIcon);
                });
            }

            /*const articleDiv = document.createElement('div');
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
            */
            articlesContainer.appendChild(articleCard);
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

async function handleBookmarkClick(event, articleId, bookmarkIcon) {
    event.stopPropagation(); // Prevent the card click from triggering

    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not authenticated. Please log in.");
        return;
    }

    try {
        const currentState = await checkBookmarkStatus(userId, articleId);

        if (currentState == true) {
            // Already bookmarked, remove it
            bookmarkIcon.src = "pic/bookmark.png";
            await deleteBookmark(articleId);
        } else if (currentState == false) {
            // Not bookmarked, add it
            await addBookmark(articleId);
            bookmarkIcon.src = "pic/bookmark-yellow.png";
        }

        // Add animation class
        bookmarkIcon.classList.add("animate");
        setTimeout(() => bookmarkIcon.classList.remove("animate"), 200);
    } catch (error) {
        console.error("Error handling bookmark click:", error);
    }
}

// Check if an article is bookmarked
async function checkBookmarkStatus(userId, articleId) {
    try {
        const response = await fetch(`/api/bookmark/${userId}/${articleId}`, { method: "GET" });
        if (!response.ok) {
            return false; // ไม่เจอข้อมูลถือว่าไม่ bookmark
        } else {
            return true;
        }

    } catch (error) {
        console.error("Error checking bookmark status", error);
        throw error;
    }
}

// Add a bookmark (POST request)
async function addBookmark(articleId) {
    const userId = localStorage.getItem("id");
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(userId), article_id: Number(articleId) }),
    };

    try {
        const response = await fetch("/api/addBookmark", requestOptions);
        if (!response.ok) {
            throw new Error(`Error adding bookmark: ${response.status}`);
        }
        console.log("Bookmark added successfully.");
    } catch (error) {
        console.error("Error adding bookmark:", error);
        throw error;
    }
}

// Remove a bookmark (DELETE request)
async function deleteBookmark(articleId) {
    const userId = localStorage.getItem("id");
    if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
    }

    try {
        // Fetch the bookmark ID first
        const response = await fetch(`/api/bookmark/${userId}/${articleId}`, { method: "GET" });
        if (!response.ok) {
            throw new Error(`Error fetching bookmark: HTTP ${response.status}`);
        }

        const data = await response.json();
        if (!data.bookmark_id) {
            throw new Error("Invalid response: bookmark_id is missing.");
        }
        const bookmarkId = data.bookmark_id;

        // Delete the bookmark
        const deleteResponse = await fetch(`/api/delete/${bookmarkId}`, { method: "DELETE" });
        if (!deleteResponse.ok) {
            throw new Error(`Error deleting bookmark: HTTP ${deleteResponse.status}`);
        }

        console.log("Bookmark deleted successfully.");
    } catch (error) {
        console.error("Error while deleting bookmark:", error);
        alert("Failed to delete bookmark. Please try again later.");
    }
}
