document.addEventListener("DOMContentLoaded", function () {

    const reportForm = document.querySelector(".report-form");

    if (!reportForm) {
        return;
    }

    reportForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // =====================================================
        // GET FORM VALUES
        // =====================================================

        const fullName =
            document.querySelector("#name")?.value.trim();

        const email =
            document.querySelector("#email")?.value.trim();

        const mobile =
            document.querySelector("#phone")?.value.trim();

        const examName =
            document.querySelector("#exam")?.value.trim();

        const subject =
            document.querySelector("#subject")?.value.trim();

        const examDate =
            document.querySelector("#exam-date")?.value;

        const examLocation =
            document.querySelector("#location")?.value.trim();

        const incidentType =
            document.querySelector("#incident-type")?.value;

        const incidentDate =
            document.querySelector("#incident-date")?.value;

        const incidentTime =
            document.querySelector("#incident-time")?.value;

        const description =
            document.querySelector("#description")?.value.trim();

        const declaration =
            document.querySelector("#declaration");

        const evidenceInput =
            document.querySelector("#evidence");


        // =====================================================
        // VALIDATION
        // =====================================================

        if (
            !fullName ||
            !email ||
            !mobile ||
            !examName ||
            !subject ||
            !examDate ||
            !examLocation ||
            !incidentType ||
            !incidentDate ||
            !incidentTime ||
            !description
        ) {
            alert("Please fill all required fields.");
            return;
        }


        if (!/^[0-9]{10}$/.test(mobile)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }


        if (declaration && !declaration.checked) {
            alert(
                "Please accept the declaration before submitting."
            );
            return;
        }


        // =====================================================
        // COMPLAINT DATA
        // =====================================================

        const complaintData = {

            fullName,
            email,
            mobile,
            examName,
            subject,
            examDate,
            examLocation,
            incidentType,
            incidentDate,
            incidentTime,
            description
        };


        // =====================================================
        // SUBMIT BUTTON
        // =====================================================

        const submitButton =
            reportForm.querySelector(".submit-report-btn");

        const originalButtonText =
            submitButton
                ? submitButton.textContent
                : "";


        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent =
                "Submitting...";
        }


        try {

            // =================================================
            // STEP 1 — SUBMIT COMPLAINT
            // =================================================

            const complaintResponse =
                await fetch(
                    "http://localhost:8080/api/complaints",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(
                            complaintData
                        )
                    }
                );


            const complaintResult =
                await complaintResponse.json();


            console.log(
                "Complaint Response:",
                complaintResult
            );


            if (
                !complaintResponse.ok ||
                !complaintResult.success
            ) {

                alert(
                    "Report submission failed.\n\n" +
                    (
                        complaintResult.message ||
                        "Something went wrong."
                    )
                );

                return;
            }


            // =================================================
            // GET GENERATED COMPLAINT ID
            // =================================================

            const complaintId =
                complaintResult.complaintId;


            // =================================================
            // STEP 2 — UPLOAD EVIDENCE
            // =================================================

            const selectedFile =
                evidenceInput &&
                evidenceInput.files &&
                evidenceInput.files.length > 0
                    ? evidenceInput.files[0]
                    : null;


            if (selectedFile) {

                if (submitButton) {
                    submitButton.textContent =
                        "Uploading Evidence...";
                }


                const formData =
                    new FormData();


                formData.append(
                    "file",
                    selectedFile
                );


                formData.append(
                    "complaintId",
                    complaintId
                );


                formData.append(
                    "uploadedBy",
                    email
                );


                formData.append(
                    "description",
                    "Supporting evidence for complaint " +
                    complaintId
                );


                const evidenceResponse =
                    await fetch(
                        "http://localhost:8080/api/evidence/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const evidenceResult =
                    await evidenceResponse.json();


                console.log(
                    "Evidence Response:",
                    evidenceResult
                );


                // =============================================
                // EVIDENCE UPLOAD FAILED
                // =============================================

                if (
                    !evidenceResponse.ok ||
                    !evidenceResult.success
                ) {

                    alert(
                        "Complaint submitted successfully.\n\n" +
                        "Complaint ID: " +
                        complaintId +
                        "\n\n" +
                        "However, evidence upload failed.\n" +
                        (
                            evidenceResult.message ||
                            "Please try uploading the evidence again."
                        )
                    );

                } else {

                    console.log(
                        "Evidence uploaded successfully:",
                        evidenceResult
                    );

                }
            }


            // =================================================
            // SAVE COMPLAINT INFORMATION
            // =================================================

            localStorage.setItem(
                "eduSentinelComplaint",
                JSON.stringify(
                    complaintResult
                )
            );


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            alert(
                "Report submitted successfully!\n\n" +
                "Your Complaint ID is:\n" +
                complaintId +
                "\n\n" +
                "Please save this ID to track your complaint."
            );


            // =================================================
            // GO TO TRACK PAGE
            // =================================================

            window.location.href =
                "track-complaint.html?id=" +
                encodeURIComponent(
                    complaintId
                );

        } catch (error) {

            console.error(
                "Complaint Submission Error:",
                error
            );


            alert(
                "Unable to connect to EduSentinel server.\n\n" +
                "Please make sure the Spring Boot backend is running on port 8080."
            );

        } finally {

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent =
                    originalButtonText ||
                    "🚨 Submit Incident Report";
            }
        }
    });
});