document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // GET CURRENT LOGGED-IN USER
    // =====================================================

    const savedUser =
        localStorage.getItem("eduSentinelCurrentUser");

    let currentUser = null;

    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (error) {
            console.error(
                "Unable to read logged-in user:",
                error
            );
        }
    }


    // =====================================================
    // WELCOME USER
    // =====================================================

    const welcomeHeading =
        document.querySelector(".student-welcome h2");

    if (welcomeHeading && currentUser) {

        welcomeHeading.textContent =
            "Welcome, " +
            (currentUser.fullName || "Student") +
            " 👋";
    }


    // =====================================================
    // SLIDER
    // =====================================================

    let currentSlide = 0;

    const slides =
        document.querySelectorAll(".dashboard-slide");

    const dots =
        document.querySelectorAll(".slider-dot");


    function showSlide(index) {

        if (!slides.length) {
            return;
        }

        if (index < 0) {
            index = slides.length - 1;
        }

        if (index >= slides.length) {
            index = 0;
        }

        currentSlide = index;


        slides.forEach(function (slide, i) {

            slide.classList.toggle(
                "active",
                i === currentSlide
            );

        });


        dots.forEach(function (dot, i) {

            dot.classList.toggle(
                "active",
                i === currentSlide
            );

        });
    }


    window.showSlide = showSlide;


    window.nextSlide = function () {

        showSlide(currentSlide + 1);

    };


    window.previousSlide = function () {

        showSlide(currentSlide - 1);

    };


    window.skipSlider = function () {

        const slider =
            document.querySelector(
                ".dashboard-slider"
            );

        if (slider) {

            slider.style.display =
                "none";
        }

    };


    // Auto slider

    if (slides.length > 1) {

        setInterval(function () {

            showSlide(currentSlide + 1);

        }, 5000);

    }


    // =====================================================
    // IMPORTANT ALERT CLOSE
    // =====================================================

    window.closeImportantAlerts = function () {

        const alertCard =
            document.querySelector(".alert-card");

        if (alertCard) {

            alertCard.style.display =
                "none";
        }

    };


    // =====================================================
    // DASHBOARD ELEMENTS
    // =====================================================

    const statCards =
        document.querySelectorAll(
            ".student-stat-card"
        );


    const complaintsSection =
        document.querySelector(
            ".dashboard-card:not(.alert-card)"
        );


    // =====================================================
    // FETCH STUDENT COMPLAINTS
    // =====================================================

    async function loadStudentComplaints() {

        if (!currentUser || !currentUser.email) {

            console.warn(
                "Logged-in user information not found."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/officer/complaints"
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to fetch complaints"
                );
            }


            const complaints =
                await response.json();


            console.log(
                "All complaints from backend:",
                complaints
            );


            // =================================================
            // FILTER ONLY CURRENT STUDENT'S COMPLAINTS
            // =================================================

            const studentComplaints =
                complaints.filter(function (complaint) {

                    return (
                        complaint.email &&
                        complaint.email.toLowerCase() ===
                        currentUser.email.toLowerCase()
                    );

                });


            console.log(
                "Student complaints:",
                studentComplaints
            );


            // =================================================
            // UPDATE STATISTICS
            // =================================================

            updateStatistics(
                studentComplaints
            );


            // =================================================
            // UPDATE COMPLAINT LIST
            // =================================================

            updateComplaintList(
                studentComplaints
            );


        } catch (error) {

            console.error(
                "Dashboard complaint error:",
                error
            );

        }

    }


    // =====================================================
    // UPDATE STATISTICS
    // =====================================================

    function updateStatistics(
        complaints
    ) {

        let underReview = 0;
        let investigating = 0;
        let resolved = 0;


        complaints.forEach(
            function (complaint) {

                const status =
                    (
                        complaint.status ||
                        ""
                    ).toLowerCase();


                if (
                    status.includes("review") ||
                    status === "received"
                ) {

                    underReview++;

                } else if (
                    status.includes("investigat")
                ) {

                    investigating++;

                } else if (
                    status.includes("resolved") ||
                    status.includes("closed")
                ) {

                    resolved++;

                }

            }
        );


        if (statCards.length >= 4) {

            const totalElement =
                statCards[0].querySelector("h3");

            const reviewElement =
                statCards[1].querySelector("h3");

            const investigatingElement =
                statCards[2].querySelector("h3");

            const resolvedElement =
                statCards[3].querySelector("h3");


            if (totalElement) {

                totalElement.textContent =
                    String(
                        complaints.length
                    ).padStart(2, "0");

            }


            if (reviewElement) {

                reviewElement.textContent =
                    String(
                        underReview
                    ).padStart(2, "0");

            }


            if (investigatingElement) {

                investigatingElement.textContent =
                    String(
                        investigating
                    ).padStart(2, "0");

            }


            if (resolvedElement) {

                resolvedElement.textContent =
                    String(
                        resolved
                    ).padStart(2, "0");

            }

        }

    }


    // =====================================================
    // UPDATE COMPLAINT LIST
    // =====================================================

    function updateComplaintList(
        complaints
    ) {

        if (!complaintsSection) {
            return;
        }


        const heading =
            complaintsSection.querySelector(
                ".card-heading"
            );


        if (!heading) {
            return;
        }


        // Remove old static complaint items

        const oldItems =
            complaintsSection.querySelectorAll(
                ".complaint-item"
            );


        oldItems.forEach(function (item) {

            item.remove();

        });


        // No complaints

        if (complaints.length === 0) {

            const emptyMessage =
                document.createElement("div");

            emptyMessage.className =
                "complaint-item";


            emptyMessage.innerHTML = `
                <div>
                    <strong>No complaints found</strong>
                    <p>You have not submitted any complaint yet.</p>
                </div>
            `;


            complaintsSection.appendChild(
                emptyMessage
            );

            return;
        }


        // =================================================
        // SHOW LATEST COMPLAINTS
        // =================================================

        const latestComplaints =
            complaints
                .slice()
                .sort(function (a, b) {

                    return (
                        new Date(
                            b.submittedAt || 0
                        ) -
                        new Date(
                            a.submittedAt || 0
                        )
                    );

                })
                .slice(0, 5);


        latestComplaints.forEach(
            function (complaint) {

                const item =
                    document.createElement("div");

                item.className =
                    "complaint-item";


                const status =
                    complaint.status ||
                    "Received";


                const statusClass =
                    getStatusClass(status);


                const reportedDate =
                    formatDate(
                        complaint.submittedAt
                    );


                item.innerHTML = `

                    <div>

                        <a
                            href="incident-details.html?id=${encodeURIComponent(
                                complaint.complaintId || ""
                            )}"
                            class="complaint-id"
                        >
                            ${escapeHtml(
                                complaint.complaintId || "-"
                            )}
                        </a>

                        <p>
                            ${escapeHtml(
                                complaint.incidentType ||
                                "Examination Incident"
                            )}
                        </p>

                        <small>
                            Reported: ${reportedDate}
                        </small>

                    </div>

                    <span
                        class="complaint-status ${statusClass}"
                    >
                        ${escapeHtml(status)}
                    </span>

                `;


                complaintsSection.appendChild(
                    item
                );

            }
        );

    }


    // =====================================================
    // STATUS CLASS
    // =====================================================

    function getStatusClass(status) {

        const value =
            status.toLowerCase();


        if (
            value.includes("resolved") ||
            value.includes("closed")
        ) {

            return "resolved";

        }


        if (
            value.includes("investigat")
        ) {

            return "investigating";

        }


        return "review";

    }


    // =====================================================
    // DATE FORMAT
    // =====================================================

    function formatDate(dateValue) {

        if (!dateValue) {
            return "-";
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {
            return "-";
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    }


    // =====================================================
    // SAFE HTML TEXT
    // =====================================================

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =====================================================
    // LOAD NOTIFICATIONS
    // =====================================================

    async function loadNotifications() {

        if (!currentUser || !currentUser.email) {
            return;
        }


        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/notifications/recipient/" +
                    encodeURIComponent(
                        currentUser.email
                    )
                );


            if (!response.ok) {
                return;
            }


            const notifications =
                await response.json();


            console.log(
                "Student notifications:",
                notifications
            );


            updateNotifications(
                notifications
            );


        } catch (error) {

            console.error(
                "Notification loading error:",
                error
            );

        }

    }


    // =====================================================
    // UPDATE NOTIFICATIONS
    // =====================================================

    function updateNotifications(
        notifications
    ) {

        const alertsList =
            document.querySelector(
                ".alerts-list"
            );


        if (!alertsList) {
            return;
        }


        // No notifications

        if (
            !notifications ||
            notifications.length === 0
        ) {

            alertsList.innerHTML = `

                <div class="alert-item alert-info">

                    <div class="alert-symbol">
                        🔒
                    </div>

                    <div class="alert-content">

                        <strong>
                            No new notifications
                        </strong>

                        <p>
                            You currently have no notifications.
                        </p>

                    </div>

                </div>

            `;

            return;
        }


        // Latest 5 notifications

        const latest =
            notifications
                .slice()
                .sort(function (a, b) {

                    return (
                        new Date(
                            b.createdAt || 0
                        ) -
                        new Date(
                            a.createdAt || 0
                        )
                    );

                })
                .slice(0, 5);


        alertsList.innerHTML = "";


        latest.forEach(
            function (notification) {

                const item =
                    document.createElement("div");

                item.className =
                    "alert-item alert-update";


                item.innerHTML = `

                    <div class="alert-symbol">
                        🔔
                    </div>

                    <div class="alert-content">

                        <div class="alert-title-row">

                            <strong>
                                ${escapeHtml(
                                    notification.title ||
                                    "Notification"
                                )}
                            </strong>

                            <span class="alert-label update-label">
                                UPDATE
                            </span>

                        </div>

                        <p>
                            ${escapeHtml(
                                notification.message ||
                                ""
                            )}
                        </p>

                        <small>
                            ${formatDateTime(
                                notification.createdAt
                            )}
                        </small>

                    </div>

                `;


                alertsList.appendChild(
                    item
                );

            }
        );

    }


    // =====================================================
    // DATE + TIME
    // =====================================================

    function formatDateTime(
        dateValue
    ) {

        if (!dateValue) {
            return "-";
        }


        const date =
            new Date(dateValue);


        if (isNaN(date.getTime())) {
            return "-";
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    // =====================================================
    // LOGOUT
    // =====================================================

    const logoutLink =
        document.querySelector(
            'a[href="login.html"]'
        );


    if (logoutLink) {

        logoutLink.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "eduSentinelCurrentUser"
                );

                localStorage.removeItem(
                    "eduSentinelLoggedIn"
                );

            }
        );

    }


    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    loadStudentComplaints();

    loadNotifications();

});