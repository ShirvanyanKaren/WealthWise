// Query selectors
const loginForm = document.querySelector(".login-form");

// Login form handler
const loginFormHandler = async (event) => {
  event.preventDefault();

  const user = document.querySelector("#user-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();
  const errorElement = document.querySelector("#error-message");

  
  try {
    if (user && password) {
      const response = await fetch("/api/user/login", {
        method: "POST",
        body: JSON.stringify({ user, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.replace("/");
      } else {
        let errorMessage = "";

        switch (response.status) {
          case 404:
            errorMessage = "Invalid username or email.";
            break;
          case 401:
            errorMessage = "Invalid password.";
            break;
          case 500:
            errorMessage = "Server error.";
            break;
          default:
            errorMessage = "Unknown error.";
            break;
        }
        errorElement.textContent = errorMessage;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// Event listener for login form
loginForm.addEventListener("submit", loginFormHandler);

