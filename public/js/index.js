const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

const signUpLinkHandler = async (event) => {
  event.preventDefault();
  document.location.replace("/signup");
};

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

hamburger.addEventListener("click", mobileMenu);
navLink.forEach((n) => n.addEventListener("click", closeMenu));
