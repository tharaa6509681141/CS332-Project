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
                bookmarkIcon.addEventListener("click", async (event) => {
                    event.stopPropagation(); // Prevent the card click from triggering
            
                    const userId = localStorage.getItem("id");
                    const articleId = article.article_id;
            
                    let currentState;
                    try {
                        currentState = await checkBookmarkStatus(userId, articleId);
                    } catch (error) {
                        console.error("Error checking bookmark status", error);
                        return;
                    }
            
                    // Toggle the bookmark icon image
                    if (currentState === 200) {
                        // If already bookmarked, remove the bookmark
                        bookmarkIcon.src = "pic/bookmark.png";
                        try {
                            await deleteBookmark(articleId);
                        } catch (error) {
                            console.error("Error removing bookmark: ", error);
                            return;
                        }
                    } else if (currentState === 404) {
                        // If not bookmarked, add the bookmark
                        try {
                            await addBookmark(articleId);
                            bookmarkIcon.src = "pic/bookmark-yellow.png"; // Update icon to yellow
                        } catch (error) {
                            console.error("Error adding bookmark: ", error);
                            return;
                        }
                    }
            
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

async function checkBookmarkStatus(userId, articleId) {
    const response = await fetch('/api/bookmark/${userId}/${articleId}', {
        method: "GET",
    })
    if (response.ok) {
        return 200;
    } else if (response.status === 404) {
        return 404;
    } else {
        throw new Error(`Unexpected response: ${response.status}`);
    }
}

async function addBookmark(articleId) {
    const userId = localStorage.getItem("id");

    if (!userId) {
        alert("User not authenticated. Please log in.");
        return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const bookmarkData = {
        user_id: Number(userId),
        article_id: Number(articleId),
    };

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(bookmarkData), // แปลงข้อมูลเป็น JSON string
    };

    try {
        const response = await fetch('/api/addBookmark', requestOptions);

        if (!response.ok) {
            // หากสถานะคำตอบไม่อยู่ในช่วง 200-299 จะโยนข้อผิดพลาด
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.text(); // ดึงข้อมูลจากคำตอบ
        console.log(result); // แสดงผลใน console

    } catch (error) {
        console.error("Error adding bookmark:", error); // จัดการข้อผิดพลาด
    }
    //console.log("Bookmark Data:", JSON.stringify(bookmarkData));

    /*fetch("http://localhost:8080/api/addBookmark", {
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
    });*/
}



// Function to remove a bookmark (DELETE request)
async function deleteBookmark(articleId) {
    const userId = localStorage.getItem("id");

    if (!userId) {
        console.error("User ID not found in localStorage. Please log in.");
        return;
    }

    try {
        // Step 1: ค้นหา Bookmark ID
        const requestBookmark = {
            method: "GET",
            redirect: "follow",
        };

        const response = await fetch(`/api/bookmark/${userId}/${articleId}`, requestBookmark);

        if (!response.ok) {
            throw new Error(`Error fetching bookmark: HTTP ${response.status}`);
        }

        const data = await response.json();
        const bookmarkId = data.bookmar_id;

        if (!bookmarkId) {
            throw new Error("Bookmark ID not found in response data.");
        }

        // Step 2: ลบ Bookmark โดยใช้ Bookmark ID
        const requestOptions = {
            method: "DELETE",
            redirect: "follow",
        };

        const deleteResponse = await fetch(`/api/delete/${bookmarkId}`, requestOptions);

        if (!deleteResponse.ok) {
            throw new Error(`Error deleting bookmark: HTTP ${deleteResponse.status}`);
        }

        const result = await deleteResponse.text();
        console.log("Bookmark deleted successfully:", result);
    } catch (error) {
        console.error("Error while deleting bookmark:", error);
    }

    /*fetch(`http://localhost:8080/api/delete/${articleId}`, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log("Bookmark removed:", data);
    })
    .catch(error => {
        console.error("Error removing bookmark:", error);
        alert("Failed to remove bookmark.");
    });*/
}
