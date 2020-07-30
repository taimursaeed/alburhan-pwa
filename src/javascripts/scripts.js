import Litepicker from "litepicker";

const pageContainer = document.querySelector(".page-container");
const pages = document.querySelectorAll(".page-container>.page");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav>button");
const namazCards = document.querySelectorAll(".card-namaz");
let pageNo;

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

// Login
const loginBtn = document.querySelector("#loginBtn");
loginBtn.addEventListener("click", (e) => {
  //TODO: api handling
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

<<<<<<< HEAD
=======
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

>>>>>>> 35ffb38... -remove singledaynamaz value on load
function dateSelected() {
  namazCards.forEach((ele) => {
    ele.classList.add("loading");
    ele.insertAdjacentHTML(
      "beforeend",
      `<div class="loader-wrap"><div class="loader"></div></div>`
    );
  });

  //TODO: fetch namaz record of corresponding date
}
