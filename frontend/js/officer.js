document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const tableBody =
        document.getElementById("reportsTableBody");

    const searchInput =
        document.getElementById("reportSearch");

    const statusFilter =
        document.getElementById("statusFilter");

    const priorityFilter =
        document.getElementById("priorityFilter");


    // =====================================================
    // LOAD OFFICER DASHBOARD
    // =====================================================

    async function loadOfficerDashboard() {

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/officer/complaints"
                );

            if (!response.ok) {

                throw new Error(
                    "Unable to load complaints"
                );
            }


            const complaints =
                await response.json();


            console.log(
                "Officer complaints:",
                complaints
            );


            // Update dashboard statistics

            updateStatistics(
                complaints
            );


            // Update risk analysis

            updateRiskAnalysis(
                complaints
            );


            // Update critical alert

            updateCriticalAlert(
                complaints
            );


            // Display complaints

            renderComplaints(
                complaints
            );


            // Load evidence count

            loadEvidence();


        } catch (error) {

            console.error(
                "Officer Dashboard Error:",
                error
            );

            if (tableBody) {

                tableBody.innerHTML = `

                    <tr>

                        <td
                            colspan="7"
                            style="text-align:center;"
                        >
                            Unable to load complaints
                            from EduSentinel backend.
                        </td>

                    </tr>

                `;

            }

        }

    }


    // =====================================================
    // UPDATE STATISTICS
    // =====================================================

    function updateStatistics(
        complaints
    ) {

        const statCards =
            document.querySelectorAll(
                ".officer-stat-card"
            );


        let critical = 0;
        let review = 0;
        let investigating = 0;
        let resolved = 0;


        complaints.forEach(
            function (complaint) {

                const status =
                    (
                        complaint.status ||
                        ""
                    ).toLowerCase();


                const risk =
                    Number(
                        complaint.riskScore || 0
                    );


                // Critical = high risk

                if (risk >= 70) {

                    critical++;

                }


                // Received / Review

                if (
                    status === "received" ||
                    status.includes("review")
                ) {

                    review++;

                }


                // Investigation

                if (
                    status.includes("investigat")
                ) {

                    investigating++;

                }


                // Resolved

                if (
                    status.includes("resolved") ||
                    status.includes("closed")
                ) {

                    resolved++;

                }

            }
        );


        if (statCards.length >= 5) {

            const totalElement =
                statCards[0].querySelector("strong");

            const criticalElement =
                statCards[1].querySelector("strong");

            const reviewElement =
                statCards[2].querySelector("strong");

            const investigatingElement =
                statCards[3].querySelector("strong");

            const resolvedElement =
                statCards[4].querySelector("strong");


            if (totalElement) {

                totalElement.textContent =
                    complaints.length;

            }


            if (criticalElement) {

                criticalElement.textContent =
                    critical;

            }


            if (reviewElement) {

                reviewElement.textContent =
                    review;

            }


            if (investigatingElement) {

                investigatingElement.textContent =
                    investigating;

            }


            if (resolvedElement) {

                resolvedElement.textContent =
                    resolved;

            }

        }


        // Update report count

        const reportCount =
            document.querySelector(
                ".report-count"
            );


        if (reportCount) {

            reportCount.textContent =
                complaints.length +
                " Reports";

        }

    }


    // =====================================================
    // UPDATE AI RISK ANALYSIS
    // =====================================================

    function updateRiskAnalysis(
        complaints
    ) {

        if (!complaints.length) {
            return;
        }


        let highestRisk = 0;


        complaints.forEach(
            function (complaint) {

                const risk =
                    Number(
                        complaint.riskScore || 0
                    );


                if (risk > highestRisk) {

                    highestRisk = risk;

                }

            }
        );


        const riskItems =
            document.querySelectorAll(
                ".risk-item"
            );


        const riskScore =
            document.querySelector(
                ".risk-score strong"
            );


        const riskFill =
            document.querySelector(
                ".risk-fill"
            );


        if (riskScore) {

            riskScore.textContent =
                highestRisk + "%";

        }


        if (riskFill) {

            riskFill.style.width =
                Math.min(
                    highestRisk,
                    100
                ) + "%";

        }


        // Critical count

        if (riskItems.length >= 1) {

            let criticalCount = 0;

            complaints.forEach(
                function (complaint) {

                    if (
                        Number(
                            complaint.riskScore || 0
                        ) >= 70
                    ) {

                        criticalCount++;

                    }

                }
            );


            const value =
                riskItems[0].querySelector(
                    "strong"
                );


            if (value) {

                value.textContent =
                    criticalCount;

            }

        }

    }


    // =====================================================
    // UPDATE CRITICAL ALERT
    // =====================================================

    function updateCriticalAlert(
        complaints
    ) {

        if (!complaints.length) {
            return;
        }


        let highestRiskComplaint =
            complaints[0];


        complaints.forEach(
            function (complaint) {

                if (
                    Number(
                        complaint.riskScore || 0
                    ) >
                    Number(
                        highestRiskComplaint.riskScore || 0
                    )
                ) {

                    highestRiskComplaint =
                        complaint;

                }

            }
        );


        const alertHeading =
            document.querySelector(
                ".critical-content h2"
            );


        const alertDescription =
            document.querySelector(
                ".critical-content p"
            );


        const viewButton =
            document.querySelector(
                ".critical-button"
            );


        if (alertHeading) {

            alertHeading.textContent =
                "High-Risk Complaint Requires Review";

        }


        if (alertDescription) {

            alertDescription.textContent =
                "Complaint " +
                (
                    highestRiskComplaint.complaintId ||
                    "-"
                ) +
                " has a risk score of " +
                (
                    highestRiskComplaint.riskScore ||
                    0
                ) +
                "% and requires authorized review.";

        }


        if (viewButton) {

            viewButton.href =
                "incident-details.html?id=" +
                encodeURIComponent(
                    highestRiskComplaint.complaintId || ""
                );

        }

    }


    // =====================================================
    // RENDER COMPLAINT TABLE
    // =====================================================

    function renderComplaints(
        complaints
    ) {

        if (!tableBody) {
            return;
        }


        tableBody.innerHTML = "";


        if (!complaints.length) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="text-align:center;"
                    >
                        No complaints found.
                    </td>

                </tr>

            `;

            return;
        }


        complaints.forEach(
            function (complaint) {

                const row =
                    document.createElement("tr");


                const risk =
                    Number(
                        complaint.riskScore || 0
                    );


                const priority =
                    (
                        complaint.priority ||
                        "Medium"
                    ).toLowerCase();


                const status =
                    complaint.status ||
                    "Received";


                const statusClass =
                    getStatusClass(
                        status,
                        risk
                    );


                const priorityClass =
                    getPriorityClass(
                        priority
                    );


                const riskClass =
                    getRiskClass(
                        risk
                    );


                row.dataset.status =
                    statusClass;


                row.dataset.priority =
                    priorityClass;


                row.innerHTML = `

                    <td>
                        <strong>
                            ${escapeHtml(
                                complaint.complaintId || "-"
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(
                            complaint.incidentType ||
                            "Examination Incident"
                        )}
                    </td>

                    <td>
                        ${escapeHtml(
                            complaint.examName ||
                            "-"
                        )}
                    </td>

                    <td>

                        <span
                            class="priority ${priorityClass}"
                        >
                            ${escapeHtml(
                                priority.toUpperCase()
                            )}
                        </span>

                    </td>

                    <td>

                        <strong
                            class="${riskClass}"
                        >
                            ${risk}%
                        </strong>

                    </td>

                    <td>

                        <span
                            class="table-status ${statusClass}"
                        >
                            ${escapeHtml(status)}
                        </span>

                    </td>

                    <td>

                        <a
                            href="incident-details.html?id=${encodeURIComponent(
                                complaint.complaintId || ""
                            )}"
                            class="view-report-btn"
                        >
                            View
                        </a>

                    </td>

                `;


                tableBody.appendChild(
                    row
                );

            }
        );


        // Activate filtering

        setupFilters();

    }


    // =====================================================
    // STATUS CLASS
    // =====================================================

    function getStatusClass(
        status,
        risk
    ) {

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


        if (
            risk >= 70
        ) {

            return "critical";

        }


        return "review";

    }


    // =====================================================
    // PRIORITY CLASS
    // =====================================================

    function getPriorityClass(
        priority
    ) {

        const value =
            priority.toLowerCase();


        if (
            value === "high"
        ) {

            return "high";

        }


        if (
            value === "low"
        ) {

            return "low";

        }


        return "medium";

    }


    // =====================================================
    // RISK CLASS
    // =====================================================

    function getRiskClass(
        risk
    ) {

        if (risk >= 70) {

            return "risk-high";

        }


        if (risk >= 40) {

            return "risk-medium";

        }


        return "risk-low";

    }


    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    function setupFilters() {

        if (
            !searchInput ||
            !statusFilter ||
            !priorityFilter ||
            !tableBody
        ) {

            return;
        }


        function filterReports() {

            const searchValue =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const selectedStatus =
                statusFilter.value;


            const selectedPriority =
                priorityFilter.value;


            const rows =
                tableBody.querySelectorAll("tr");


            rows.forEach(
                function (row) {

                    if (
                        !row.dataset.status
                    ) {
                        return;
                    }


                    const rowText =
                        row.textContent
                            .toLowerCase();


                    const rowStatus =
                        row.dataset.status;


                    const rowPriority =
                        row.dataset.priority;


                    const matchesSearch =
                        rowText.includes(
                            searchValue
                        );


                    const matchesStatus =
                        selectedStatus === "all" ||
                        rowStatus === selectedStatus;


                    const matchesPriority =
                        selectedPriority === "all" ||
                        rowPriority === selectedPriority;


                    row.style.display =
                        (
                            matchesSearch &&
                            matchesStatus &&
                            matchesPriority
                        )
                            ? ""
                            : "none";

                }
            );

        }


        // Remove old listeners by replacing controls

        const newSearch =
            searchInput.cloneNode(true);

        searchInput.parentNode.replaceChild(
            newSearch,
            searchInput
        );


        const newStatus =
            statusFilter.cloneNode(true);

        statusFilter.parentNode.replaceChild(
            newStatus,
            statusFilter
        );


        const newPriority =
            priorityFilter.cloneNode(true);

        priorityFilter.parentNode.replaceChild(
            newPriority,
            priorityFilter
        );


        newSearch.addEventListener(
            "input",
            filterReports
        );


        newStatus.addEventListener(
            "change",
            filterReports
        );


        newPriority.addEventListener(
            "change",
            filterReports
        );

    }


    // =====================================================
    // LOAD EVIDENCE
    // =====================================================

    async function loadEvidence() {

        try {

            const response =
                await fetch(
                    "http://localhost:8080/api/evidence/pending"
                );


            if (!response.ok) {
                return;
            }


            const evidence =
                await response.json();


            console.log(
                "Pending evidence:",
                evidence
            );


            const riskItems =
                document.querySelectorAll(
                    ".risk-item"
                );


            if (riskItems.length >= 3) {

                const evidenceValue =
                    riskItems[2].querySelector(
                        "strong"
                    );


                if (evidenceValue) {

                    evidenceValue.textContent =
                        evidence.length;

                }

            }

        } catch (error) {

            console.error(
                "Evidence loading error:",
                error
            );

        }

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(
        value
    ) {

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    // =====================================================
    // START
    // =====================================================

    loadOfficerDashboard();

});