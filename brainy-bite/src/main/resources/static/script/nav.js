/*document.addEventListener("DOMContentLoaded", () => {
    const profileLink = document.getElementById("profile-link");

    profileLink.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default navigation behavior

        // Example: Fetch user ID from a global `currentUser` object or a backend API.
        // Replace with your actual implementation for getting the current user ID.
        const userId = window.currentUser?.id || localStorage.getItem("userId");

        if (!userId) {
            alert("User ID is missing or not available!");
            return;
        }

        localStorage.setItem("userId", userId); // Store user ID in localStorage
        window.location.href = "user.html"; // Redirect to user.html
    });
});

// After successful login or signup
const userId = data.userId; // Assume `data` contains the logged-in user information
localStorage.setItem("userId", userId);
window.currentUser = data; // Optional for easy access */

document.addEventListener("DOMContentLoaded", () => {
    const authButton = document.getElementById("nav-signup-signin-btn");
    const overlay = document.getElementById("overlay");
    const closeOverlay = document.getElementById("close-overlay");
    const switchAuthMode = document.getElementById("switch-auth-mode");
    const authForm = document.getElementById("auth-form");
    const modalTitle = document.getElementById("modal-title");
    const dropdownMenu = document.getElementById("dropdown-menu");
    const logoutLink = document.getElementById("logout-link");
    const emailField = document.getElementById("email");
    const confirmPasswordField = document.getElementById("confirm-password");
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
            ? "สลับไปเข้าสู่ระบบ"
            : "สลับไปลงทะเบียน";

        // ซ่อน/แสดงช่อง email และ confirm password
        emailField.classList.toggle("hidden", !isRegistering);
        confirmPasswordField.classList.toggle("hidden", !isRegistering);

        emailField.required = isRegistering;
        confirmPasswordField.required = isRegistering;

        // เปลี่ยนปุ่ม submit ให้เหมาะสม
        authForm.querySelector("button[type='submit']").textContent = isRegistering
            ? "ลงทะเบียน"
            : "เข้าสู่ระบบ";
    });

    authForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (isRegistering) {
            const confirmPassword = confirmPasswordField.value;

            // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกัน
            if (password !== confirmPassword) {
                alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!");
                return;
            }

            // ตรวจสอบว่าอีเมลถูกต้องหรือไม่ (ใช้ HTML attribute `required` หรือเพิ่มเติมการตรวจสอบแบบ regex)
            if (!email) {
                alert("กรุณากรอกอีเมลที่ถูกต้อง!");
                return;
            }
        }

        const endpoint = isRegistering
            ? "/api/auth/signup"
            : "/api/auth/signin";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    isRegistering
                        ? { username, email, password }
                        : { username, password }
                ),
                credentials: "include", // สำคัญสำหรับส่ง cookie
            });

            if (!response.ok) {
                throw new Error("Authentication failed!");
            }

            const data = await response.json(); // ข้อมูล response body
            localStorage.setItem("id", data.id); // Save user ID
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