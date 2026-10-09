document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("trackForm");
    const input = document.getElementById("complaintId");
    const result = document.getElementById("trackResult");

    const displayId =
        document.getElementById("displayId");

    const displayIncidentType =
        document.getElementById("displayIncidentType");

    const displayExam =
        document.getElementById("displayExam");

    const displayReportedOn =
        document.getElementById("displayReportedOn");


    if (!form || !input || !result) {

        console.error(
            "Track complaint elements not found."
        );

        return;
    }


    async function trackComplaint(complaintId) {

        try {

            const response = await fetch(
                "http://localhost:8080/api/complaints/" +
                encodeURIComponent(complaintId)
            );


            const data = await response.json();

            console.log(
                "Tracking response:",
                data
            );


            if (!response.ok || !data.success) {

                alert(
                    data.message ||
                    "Complaint not found."
                );

                result.style.display = "none";

                return;
            }


            /* Complaint ID */

            if (displayId) {

                displayId.textContent =
                    data.complaintId || "-";
            }


            /* Incident Type */

            if (displayIncidentType) {

                displayIncidentType.textContent =
                    data.incidentType || "-";
            }


            /* Exam */

            if (displayExam) {

                displayExam.textContent =
                    data.examName || "-";
            }


            /* Reported On */

            if (displayReportedOn) {

                if (data.submittedAt) {

                    const date =
                        new Date(data.submittedAt);

                    displayReportedOn.textContent =
                        date.toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        });

                } else {

                    displayReportedOn.textContent =
                        "-";
                }
            }


            /* Status */

            const statusBadge =
                result.querySelector(".status-badge");


            if (statusBadge) {

                statusBadge.textContent =
                    data.status || "Received";
            }


            /* Show result */

            result.style.display = "block";


            result.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


        } catch (error) {

            console.error(
                "Tracking Error:",
                error
            );


            alert(
                "Unable to connect to EduSentinel backend.\n\n" +
                "Please make sure Spring Boot is running on port 8080."
            );
        }
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const complaintId =
                input.value.trim();


            if (!complaintId) {

                alert(
                    "Please enter your Complaint ID."
                );

                return;
            }


            trackComplaint(complaintId);
        }
    );


    /* Auto-track complaint ID from URL */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );


    const complaintIdFromUrl =
        urlParams.get("id");


    if (complaintIdFromUrl) {

        input.value =
            complaintIdFromUrl;

        trackComplaint(
            complaintIdFromUrl
        );
    }

});