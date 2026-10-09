document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       MOBILE NAVIGATION
    ============================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }


    /* ==============================
       CLOSE MOBILE MENU AFTER CLICK
    ============================== */

    const navigationLinks = document.querySelectorAll(".nav-links a");

    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navLinks) {
                navLinks.classList.remove("active");
            }
        });
    });


    /* ==============================
       SMOOTH SCROLL
    ============================== */

    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();

                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* ==============================
       CURRENT YEAR
    ============================== */

    const yearElements = document.querySelectorAll(".current-year");

    yearElements.forEach(function (element) {
        element.textContent = new Date().getFullYear();
    });


    /* ==============================
       SCROLL TO TOP BUTTON
    ============================== */

    const scrollTopButton = document.querySelector(".scroll-top");

    if (scrollTopButton) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 300) {
                scrollTopButton.classList.add("show");
            } else {
                scrollTopButton.classList.remove("show");
            }

        });

        scrollTopButton.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });
    }


    /* ==============================
       CLOSE ALERTS
    ============================== */

    const closeButtons = document.querySelectorAll(".close-alert");

    closeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const alertBox = this.closest(".alert-box, .alert-card");

            if (alertBox) {
                alertBox.style.display = "none";
            }

        });

    });


    /* ==============================
       LOGOUT
    ============================== */

    const logoutButtons = document.querySelectorAll(".logout-btn");

    logoutButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                localStorage.removeItem("eduSentinelLoggedIn");
                localStorage.removeItem("eduSentinelCurrentUser");

                window.location.href = "login.html";
            }

        });

    });


    /* ==============================
       PROTECT DASHBOARD PAGES
    ============================== */

    const currentPage = window.location.pathname.toLowerCase();

    const isStudentDashboard =
        currentPage.includes("student-dashboard.html");

    const isOfficerDashboard =
        currentPage.includes("officer-dashboard.html");

    if (isStudentDashboard || isOfficerDashboard) {

        const isLoggedIn =
            localStorage.getItem("eduSentinelLoggedIn");

        if (isLoggedIn !== "true") {

            alert("Please login first.");

            window.location.href = "login.html";
        }
    }


    /* ==============================
       WELCOME USER
    ============================== */

    const welcomeElements =
        document.querySelectorAll(".user-name");

    const savedUser =
        localStorage.getItem("eduSentinelCurrentUser");

    if (savedUser) {

        try {

            const user = JSON.parse(savedUser);

            welcomeElements.forEach(function (element) {

                if (user.fullName) {
                    element.textContent = user.fullName;
                }

            });

        } catch (error) {

            console.log("User data could not be loaded.");

        }
    }

});