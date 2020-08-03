import Litepicker from "litepicker";

const pageContainer = document.querySelector(".page-container");
const pages = document.querySelectorAll(".page-container>.page");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav>button");
const namazCards = document.querySelectorAll(".card-namaz");
const tabLinks = document.querySelectorAll(".btn-tab");
const tabContainer = document.querySelectorAll(".tab-content");
let pageNo;

auth.onAuthStateChanged(user => {
  if (user) {
    moveToPage(1);
    pageContainer.classList.add("logged-in");
    nav.classList.remove("hide");
  } else {
    console.log('user logged out');
  }
});

// General
function moveToPage(p) {
  pageContainer.style.transform = `translateX(${p}00%)`;
}

// Page Transitions
navLinks.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    navLinks.forEach((ele) => {
      //remove all active classes
      ele.classList.remove("active");
    });

    e.currentTarget.classList.add("active");
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

// Tabs

tabLinks.forEach((ele) => {
  ele.addEventListener("click", (e) => {
    tabLinks.forEach((ele) => {
      ele.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
    const tabId = e.currentTarget.id;
    tabContainer.forEach((e, index) => {
      if (e.getAttribute("data-tab") == tabId) {
        e.classList.add("active");
      } else {
        e.classList.remove("active");
      }
    });
  });
});

// Login
const loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", (e) => {

  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user);
  });

  moveToPage(1);
  pageContainer.classList.add("logged-in");
  nav.classList.remove("hide");
});

const picker = new Litepicker({
  element: document.getElementById("litepicker"),
  startDate: new Date(),
  maxDate: new Date(),
  onSelect: dateSelected,
});
window.timestamp = new Date();

const singleDayNamaz = new Litepicker({
  element: document.getElementById("singleDayNamaz"),
  maxDate: new Date(),
  onSelect: function () {
    this.options.element.parentElement.parentElement.parentElement
      .querySelector(".placeholder")
      .remove();
    this.options.element.parentElement.parentElement.parentElement
      .querySelectorAll(".summary")
      .forEach((ele) => {
        ele.classList.remove("hide");
      });
  },
});

const multipleDayNamaz = new Litepicker({
  element: document.getElementById("multipleDayNamaz"),
  startDate: new Date(),
  maxDate: new Date(),
  singleMode: false,
  onSelect: function () {
    this.options.element.parentElement.parentElement.parentElement
      .querySelector(".placeholder")
      .remove();
    this.options.element.parentElement.parentElement.parentElement
      .querySelectorAll(".summary")
      .forEach((ele) => {
        ele.classList.remove("hide");
      });
  },
});

function dateSelected() {
  window.timestamp = this.getDate();
  // namazCards.forEach((ele) => {
  //   ele.classList.add("loading");
  //   ele.insertAdjacentHTML(
  //     "beforeend",
  //     `<div class="loader-wrap"><div class="loader"></div></div>`
  //   );
  // });

  //TODO: fetch namaz record of corresponding date
}
