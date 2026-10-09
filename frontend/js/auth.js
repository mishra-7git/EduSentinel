document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // REGISTER
    // =====================================================

    const registerForm =
        document.querySelector(".register-form");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                // ===============================
                // GET REGISTER FORM VALUES
                // ===============================

                const fullName =
                    document.querySelector("#full-name")
                        ?.value.trim();

                const email =
                    document.querySelector("#email")
                        ?.value.trim();

                const mobile =
                    document.querySelector("#phone")
                        ?.value.trim();

                const institution =
                    document.querySelector("#college")
                        ?.value.trim();

                const qualification =
                    document.querySelector("#qualification")
                        ?.value;

                const level =
                    document.querySelector("#person-level")
                        ?.value;

                const accountType =
                    document.querySelector("#role")
                        ?.value;

                const password =
                    document.querySelector("#password")
                        ?.value;

                const confirmPassword =
                    document.querySelector("#confirm-password")
                        ?.value;

                const terms =
                    document.querySelector(
                        ".register-terms input[type='checkbox']"
                    );


                // ===============================
                // VALIDATION
                // ===============================

                if (
                    !fullName ||
                    !email ||
                    !mobile ||
                    !institution ||
                    !qualification ||
                    !level ||
                    !accountType ||
                    !password ||
                    !confirmPassword
                ) {
                    alert(
                        "Please fill all required fields."
                    );
                    return;
                }


                if (!/^[0-9]{10}$/.test(mobile)) {

                    alert(
                        "Please enter a valid 10-digit mobile number."
                    );

                    return;
                }


                if (password.length < 6) {

                    alert(
                        "Password must contain at least 6 characters."
                    );

                    return;
                }


                if (password !== confirmPassword) {

                    alert(
                        "Passwords do not match."
                    );

                    return;
                }


                if (terms && !terms.checked) {

                    alert(
                        "Please accept the terms and privacy policy."
                    );

                    return;
                }


                // ===============================
                // REGISTER DATA
                // ===============================

                const registerData = {

                    fullName: fullName,
                    email: email,
                    mobile: mobile,
                    institution: institution,
                    qualification: qualification,
                    level: level,
                    accountType: accountType,
                    password: password,
                    confirmPassword: confirmPassword

                };


                // ===============================
                // SUBMIT BUTTON
                // ===============================

                const registerButton =
                    registerForm.querySelector(
                        ".register-button"
                    );

                const originalButtonText =
                    registerButton
                        ? registerButton.textContent
                        : "Create Account";


                if (registerButton) {

                    registerButton.disabled = true;

                    registerButton.textContent =
                        "Creating Account...";

                }


                // ===============================
                // SEND TO BACKEND
                // ===============================

                try {

                    const response =
                        await fetch(
                            "http://localhost:8080/api/auth/register",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify(
                                    registerData
                                )
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Registration Response:",
                        data
                    );


                    // ===============================
                    // SUCCESS
                    // ===============================

                    if (
                        response.ok &&
                        data.success
                    ) {

                        alert(
                            "Registration successful!\n\n" +
                            "Welcome to EduSentinel, " +
                            fullName +
                            "!"
                        );


                        window.location.href =
                            "login.html";

                        return;
                    }


                    // ===============================
                    // BACKEND ERROR
                    // ===============================

                    alert(
                        "Registration failed.\n\n" +
                        (
                            data.message ||
                            "Something went wrong."
                        )
                    );


                } catch (error) {

                    console.error(
                        "Registration Error:",
                        error
                    );


                    alert(
                        "Unable to connect to EduSentinel server.\n\n" +
                        "Please make sure the Spring Boot backend is running on port 8080."
                    );

                } finally {

                    if (registerButton) {

                        registerButton.disabled = false;

                        registerButton.textContent =
                            originalButtonText;

                    }

                }
            }
        );
    }


    // =====================================================
    // LOGIN
    // =====================================================

    const loginForm =
        document.querySelector(".login-form");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // ===============================
                // GET LOGIN VALUES
                // ===============================

                const email =
                    document.querySelector(
                        ".login-form #email"
                    )?.value.trim();

                const password =
                    document.querySelector(
                        ".login-form #password"
                    )?.value;


                // ===============================
                // VALIDATION
                // ===============================

                if (!email || !password) {

                    alert(
                        "Please enter email and password."
                    );

                    return;
                }


                // ===============================
                // LOGIN DATA
                // ===============================

                const loginData = {

                    email: email,
                    password: password

                };


                const loginButton =
                    loginForm.querySelector(
                        ".login-button"
                    );

                const originalButtonText =
                    loginButton
                        ? loginButton.textContent
                        : "Login";


                if (loginButton) {

                    loginButton.disabled = true;

                    loginButton.textContent =
                        "Logging in...";

                }


                // ===============================
                // SEND TO BACKEND
                // ===============================

                try {

                    const response =
                        await fetch(
                            "http://localhost:8080/api/auth/login",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify(
                                    loginData
                                )
                            }
                        );


                    const data =
                        await response.json();


                    console.log(
                        "Login Response:",
                        data
                    );


                    // ===============================
                    // LOGIN SUCCESS
                    // ===============================

                    if (
                        response.ok &&
                        data.success
                    ) {

                        localStorage.setItem(
                            "eduSentinelCurrentUser",
                            JSON.stringify(data)
                        );

                        localStorage.setItem(
                            "eduSentinelLoggedIn",
                            "true"
                        );


                        alert(
                            "Login successful!\n\n" +
                            "Welcome back, " +
                            (
                                data.fullName ||
                                email
                            ) +
                            "!"
                        );


                        // ===============================
                        // DASHBOARD
                        // ===============================

                        if (
                            data.role &&
                            data.role.toUpperCase() ===
                            "OFFICER"
                        ) {

                            window.location.href =
                                "officer-dashboard.html";

                        } else {

                            window.location.href =
                                "student-dashboard.html";

                        }

                        return;
                    }


                    // ===============================
                    // LOGIN FAILED
                    // ===============================

                    alert(
                        "Login failed.\n\n" +
                        (
                            data.message ||
                            "Invalid email or password."
                        )
                    );


                } catch (error) {

                    console.error(
                        "Login Error:",
                        error
                    );


                    alert(
                        "Unable to connect to EduSentinel server.\n\n" +
                        "Please make sure the Spring Boot backend is running on port 8080."
                    );

                } finally {

                    if (loginButton) {

                        loginButton.disabled = false;

                        loginButton.textContent =
                            originalButtonText;

                    }

                }
            }
        );
    }

});