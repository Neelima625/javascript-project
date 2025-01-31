import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyB-xs2jY77g5a1RigMXtXIAKxSolX91qZU",
    authDomain: "signup-39674.firebaseapp.com",
    projectId: "signup-39674",
    storageBucket: "signup-39674.appspot.com",
    messagingSenderId: "253204677214",
    appId: "1:253204677214:web:751a714f2a04bfb8ef2acf",
    measurementId: "G-14GSDRDJLX"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Signup functionality
document.getElementById("signUpBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let signUpModal = new bootstrap.Modal(document.getElementById("signUpModal"));
    signUpModal.show();

    document.getElementById("signUpSubmitBtn").addEventListener("click", async () => {
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();

        if (!name || !email || !password || !confirmPassword) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            Swal.fire("Error", "Enter a valid email address", "error");
            return;
        }

        if (password !== confirmPassword) {
            Swal.fire("Error", "Passwords do not match", "error");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Swal.fire("Success", "Registered successfully", "success").then(() => {
                document.getElementById("signupForm").reset();
                signUpModal.hide();
                let loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
                loginModal.show();
            });
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
});

// Login functionality
document.getElementById("loginBtn").addEventListener("click", (e) => {
    e.preventDefault();
    let loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();

    document.getElementById("loginSubmitBtn").addEventListener("click", async () => {
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        if (!email || !password) {
            Swal.fire("Error", "All fields are required", "error");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire("Success", "Logged in successfully", "success").then(() => {
                document.getElementById("loginForm").reset();
                location.href = "../Home page/home.html";
            });
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    });
});
