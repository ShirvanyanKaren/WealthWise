// Query Selectors
const signUpForm = document.querySelector(".signup-form");


// Sign Up Function
const signup = async (event) => {
  event.preventDefault();
  const errorElement = document.querySelector("#error-message");
  const body = JSON.stringify({
    username: document.querySelector("#signup-name").value,
    email: document.querySelector("#signup-email").value,
    password: document.querySelector("#signup-password").value,
  });

  try {
    const response = await fetch("/api/user/signup", {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/");
    } else {
      const responseData = await response.json();

      if (responseData && responseData.message) {
        errorElement.textContent = responseData.message;
      } else {
        errorElement.textContent = responseData.message;
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
    errorElement.textContent = "An error occurred during sign up." ;
  }
};

// Event Listeners
signUpForm.addEventListener("submit", signup);
