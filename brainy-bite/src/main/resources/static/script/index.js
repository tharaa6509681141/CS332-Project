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

//
document.addEventListener("DOMContentLoaded", () => {
    const authButton = document.getElementById("nav-signup-signin-btn");
    const overlay = document.getElementById("overlay");
    const closeOverlay = document.getElementById("close-overlay");
    const switchAuthMode = document.getElementById("switch-auth-mode");
    const authForm = document.getElementById("auth-form");
    const modalTitle = document.getElementById("modal-title");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const logoutLink = document.getElementById("logout-link");
    const profileLink = document.getElementById("profile-link");

    let isRegistering = false;
    let isAuthenticated = false;

    const toggleOverlay = () => overlay.classList.toggle("overlay");

    authButton.addEventListener("click", () => {
        if (isAuthenticated) {
            dropdownMenu.classList.toggle("hidden");
        } else {
            toggleOverlay();
        }
    });

    closeOverlay.addEventListener("click", toggleOverlay);

    switchAuthMode.addEventListener("click", () => {
        isRegistering = !isRegistering;
        modalTitle.textContent = isRegistering ? "Register" : "Login";
        switchAuthMode.textContent = isRegistering
            ? "Switch to Login"
            : "Switch to Register";
    });

    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const endpoint = isRegistering
            ? "/api/auth/signup"
            : "/api/auth/signin";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // สำคัญสำหรับส่ง cookie
            });

            if (!response.ok) {
                throw new Error("Authentication failed!");
            }

            const data = await response.json(); // ข้อมูล response body
            isAuthenticated = true;

            // อัปเดต UI ด้วย username
            authButton.textContent = data.username;

            // ปิด overlay
            toggleOverlay();
        } catch (error) {
            alert(error.message);
        }
    });

    logoutLink.addEventListener("click", () => {
        // Reset ค่า UI
        isAuthenticated = false;
        authButton.textContent = "เข้าสู่ระบบ/ลงทะเบียน";
        dropdownMenu.classList.add("hidden");

        // ลบ cookie โดยส่งคำขอไปยัง server
        fetch("/api/auth/signout", {
            method: "POST",
            credentials: "include", // ส่ง cookie ไปด้วย
        }).catch(() => alert("Logout failed!"));
    });
});
