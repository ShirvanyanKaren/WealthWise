// Query selectors 
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");

// Adds active class to hamburger
function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Removes active class from hamburger
function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

// Event handler for submit button
const signUpLinkHandler = async (event) => {
  event.preventDefault();
  document.location.replace("/signup");
};

// Fetch request to get data from the database
const getTableData = async (path) => {
  try {
      const response = await fetch(path, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
          return response.json();
      } else {
          throw new Error(`Error fetching data. Status: ${response.status}`);
      }
  } catch (err) {
      console.error("Error:", err);
  }
};

// Event listener for hamburger menu
hamburger.addEventListener("click", mobileMenu);
navLink.forEach((n) => n.addEventListener("click", closeMenu));
