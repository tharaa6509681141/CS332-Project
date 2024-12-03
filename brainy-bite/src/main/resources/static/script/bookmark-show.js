// Fetch user bookmarks from the backend
fetch("http://localhost:8080/api/bookmark/1")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the JSON response
    })
    .then(data => {
        const userBookmarkContainer = document.getElementById("userbookmark");

        // Clear previous content (if any)
        userBookmarkContainer.innerHTML = `
            <h2>My Bookmarks</h2>
        `;

        // Iterate through the bookmarks and display each one
        data.forEach(bookmark => {
            const bookmarkCard = document.createElement("div");
            bookmarkCard.classList.add("bookmark-card");

            bookmarkCard.innerHTML = `
                <img src="${bookmark.thumbnail_url}" alt="${bookmark.title}" width="100" height="100">
                <p>${bookmark.title}</p>
                <p>${bookmark.description}</p>
            `;

            userBookmarkContainer.appendChild(bookmarkCard);
        });
    })
    .catch(error => {
        console.error("Error loading bookmarks:", error);
        alert("Error loading bookmarks. Please try again later.");
    });