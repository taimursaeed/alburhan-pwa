const pageContainer = document.querySelector(".page-container");
const pages = document.querySelectorAll(".page-container>.page");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav>button");
let pageNo;

// General
function moveToPage(p) {
  pageContainer.style.transform = `translateX(${p}00%)`;
}

// Page Transitions
navLinks.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    pageContainer.classList.add("page");
    const cID = e.currentTarget.id;
    pages.forEach((e, index) => {
      if (e.getAttribute("data-page") == cID) {
        pageNo = index;
      }
    });
    moveToPage(pageNo);
  });
});

// Login
const loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", (e) => {
  //TODO: api handling
  moveToPage(1);
  pageContainer.classList.add("logged-in");
  nav.classList.remove("hide");
});
