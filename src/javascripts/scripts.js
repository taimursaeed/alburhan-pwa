require("babel-polyfill");
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
      moveToPage(1);
      pageContainer.classList.add("logged-in");
      nav.classList.remove("hide");
    })
    .catch(() => {
      document.getElementById("loginError").classList.remove("hide");
    });
});

const picker = new Litepicker({
  element: document.getElementById("litepicker"),
  startDate: new Date(),
  maxDate: new Date(),
  onSelect: dateSelected,
});
window.timestamp = new Date();

document.getElementById("last3Days").addEventListener("click", (e) => {
  var today = new Date();
  var startDate = new Date();
  startDate.setDate(today.getDate() - 3);
  fetchMultipleDaysData(startDate, today)
});
document.getElementById("last7Days").addEventListener("click", (e) => {
  var today = new Date();
  var startDate = new Date();
  startDate.setDate(today.getDate() - 7);
  fetchMultipleDaysData(startDate, today)
});
document.getElementById("last30Days").addEventListener("click", (e) => {
  var today = new Date();
  var startDate = new Date();
  startDate.setDate(today.getDate() - 30);
  fetchMultipleDaysData(startDate, today)
});
document.getElementById("lastDay").addEventListener("click", (e) => {
  var today = new Date();
  var startDate = new Date();
  startDate.setDate(today.getDate() - 1);
  fetchMultipleDaysData(startDate, today)
});

const singleDayNamaz = new Litepicker({
  element: document.getElementById("singleDayNamaz"),
  maxDate: new Date(),
  onSelect: fetchSingleDayData
});

const multipleDayNamaz = new Litepicker({
  element: document.getElementById("multipleDayNamaz"),
  startDate: new Date(),
  maxDate: new Date(),
  singleMode: false,
  onSelect: function (start, end) {
    fetchMultipleDaysData(start, end);
  }
});

function dateSelected() {
  window.timestamp = this.getDate();
  fetchSingleDayDataForNamazScreen();
}




/////////////////////////////////// Events.js ////////////////
var input = document.querySelectorAll('input');
var notification = document.querySelector('.notification');
var notificationTimer;

async function mamulatFunction() {
  var _name = this.name;
  if (_name != undefined && _name !== "") {
    var _value = this.value;
    var date = window.timestamp;
    var id = window.timestamp.toDateString();
    var _userId = auth.currentUser.uid;
    notification.classList.remove('show');
    let document = await db.collection("mamulat").where("userId", "==", _userId).where("id", "==", id).get();
    if (document && (document.docs.length > 0) && document.docs[0].data().userId == _userId) {
      await document.docs[0].ref.update({
        [_name]: _value
      });
      notification.classList.add('show');
      notificationTimer = setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    } else {
      await db.collection("mamulat").add({
        id: id,
        [_name]: _value,
        date: date,
        userId: _userId
      });
      notification.classList.add('show');
      notificationTimer = setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }
}
Array.from(input).forEach(function (element) {
  element.addEventListener('click', mamulatFunction);
});

async function fetchSingleDayDataForNamazScreen() {
  var day = window.timestamp.toDateString();
  var _userId = auth.currentUser.uid;
  await db.collection("mamulat").where("userId", "==", _userId).where("id", "==", day).get().then(snapshot => {
    setupNamazScreen(snapshot.docs);
  });
}

async function fetchSingleDayData() {
  var day = this.getDate().toDateString();
  var _userId = auth.currentUser.uid;
  await db.collection("mamulat").where("userId", "==", _userId).where("id", "==", day).get().then(snapshot => {
    setupSingleDay(snapshot.docs);
  });
}

async function fetchMultipleDaysData(startDate, endDate) {
  var _userId = auth.currentUser.uid;
  await db.collection("mamulat").where("userId", "==", _userId).where("date", ">=", startDate).where("date", "<=", endDate).get().then(snapshot => {
    setupMultiDays(snapshot.docs);
  });
}

const setupMultiDays = (data) => {
  let html = '';
  const multiDays = document.querySelector('.multiDays');
  if (data.length == 0) {
    const noRecord = `<p class="placeholder">تاریخ کا انتخاب کریں</p>`;
    html += noRecord;
    multiDays.innerHTML = html;
  } else {
    var _jamat = 0;
    var _akelay = 0;
    var _qaza = 0;
    var _nahi = 0;
    var _totalNamazein = data.length * 5;
    data.forEach(doc => {
      const namaz = doc.data();
      if (namaz.fajar != null) {
        switch (namaz.fajar) {
          case "3":
            _jamat++;
            break;
          case "2":
            _akelay++;
            break;
          case "1":
            _qaza++;
            break;
          case "0":
            _nahi++;
            break;
          default:
            _nahi++;
            break;
        }
      } else {
        _nahi++;
      }
      if (namaz.zuhar != null) {
        switch (namaz.zuhar) {
          case "3":
            _jamat++;
            break;
          case "2":
            _akelay++;
            break;
          case "1":
            _qaza++;
            break;
          case "0":
            _nahi++;
            break;
          default:
            _nahi++;
            break;
        }
      } else {
        _nahi++;
      }
      if (namaz.asar != null) {
        switch (namaz.asar) {
          case "3":
            _jamat++;
            break;
          case "2":
            _akelay++;
            break;
          case "1":
            _qaza++;
            break;
          case "0":
            _nahi++;
            break;
          default:
            _nahi++;
            break;
        }
      } else {
        _nahi++;
      }
      if (namaz.maghrib != null) {
        switch (namaz.maghrib) {
          case "3":
            _jamat++;
            break;
          case "2":
            _akelay++;
            break;
          case "1":
            _qaza++;
            break;
          case "0":
            _nahi++;
            break;
          default:
            _nahi++;
            break;
        }
      } else {
        _nahi++;
      }
      if (namaz.isha != null) {
        switch (namaz.isha) {
          case "3":
            _jamat++;
            break;
          case "2":
            _akelay++;
            break;
          case "1":
            _qaza++;
            break;
          case "0":
            _nahi++;
            break;
          default:
            _nahi++;
            break;
        }
      } else {
        _nahi++;
      }
    });
    const multi = `<div class="summary bajamat">
  <p class="title">باجمات</p>
  <h4 class="value">${ (_jamat/_totalNamazein)*100 }%</h4>
</div>
<div class="summary akeelay">
  <p class="title">اکیلے</p>
  <h4 class="value">${ (_akelay/_totalNamazein)*100 }%</h4>
</div>
<div class="summary qaza">
  <p class="title">قضہ</p>
  <h4 class="value">${ (_qaza/_totalNamazein)*100 }%</h4>
</div>
<div class="summary nahi">
  <p class="title">نہی ادا کی</p>
  <h4 class="value">${ (_nahi/_totalNamazein)*100 }%</h4>
</div>`;
    html += multi;
    multiDays.innerHTML = html;
  }
}

const setupNamazScreen = (data) => {
  const fajarCard = document.querySelector('.card-fajar');
  const zuharCard = document.querySelector('.card-zuhar');
  const asarCard = document.querySelector('.card-asar');
  const maghribCard = document.querySelector('.card-maghrib');
  const ishaCard = document.querySelector('.card-isha');
  let html = '';
  if (data.length == 0) {

  }
  data.forEach(doc => {
    const namaz = doc.data();
    var jamat, akeelay, qaza, nahi;
    if (namaz.fajar != null) {
      switch (namaz.fajar) {
        case "3":
          jamat = "checked";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
        case "2":
          jamat = "";
          akeelay = "checked";
          qaza = "";
          nahi = "";
          break;
        case "1":
          jamat = "";
          akeelay = "";
          qaza = "checked";
          nahi = "";
          break;
        case "0":
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "checked";
          break;
        default:
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
      }
    } else {
      jamat = "";
      akeelay = "";
      qaza = "";
      nahi = "";
    }
    const fajarCardHtml = `<div class="head">
    <h3>فجر<span class="required">*</span></h3>
  </div>
  <div class="body">
    <label class="checkbox bajamat">
      <input type="radio" value="3" name="fajar" ${jamat} />
      <span class="checkbox-text">باجمات</span>
    </label>
    <label class="checkbox akeelay">
      <input type="radio" value="2" name="fajar"  ${akeelay} />
      <span class="checkbox-text">اکیلے</span>
    </label>
    <label class="checkbox qaza">
      <input type="radio" value="1" name="fajar"  ${qaza} />
      <span class="checkbox-text">قضہ</span>
    </label>
    <label class="checkbox nahi">
      <input type="radio" value="0" name="fajar" ${nahi}  />
      <span class="checkbox-text">نہی ادا کی</span>
    </label>
  </div>`;
    html += fajarCardHtml;
    if (data.length > 0) fajarCard.innerHTML = html;
    html = '';
    if (namaz.zuhar != null) {
      switch (namaz.zuhar) {
        case "3":
          jamat = "checked";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
        case "2":
          jamat = "";
          akeelay = "checked";
          qaza = "";
          nahi = "";
          break;
        case "1":
          jamat = "";
          akeelay = "";
          qaza = "checked";
          nahi = "";
          break;
        case "0":
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "checked";
          break;
        default:
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
      }
    } else {
      jamat = "";
      akeelay = "";
      qaza = "";
      nahi = "";
    }
    const zuharCardHtml = `<div class="head">
    <h3>ظہر<span class="required">*</span></h3>
  </div>
  <div class="body">
    <label class="checkbox bajamat">
      <input type="radio" value="3" name="zuhar"   ${jamat}/>
      <span class="checkbox-text">باجمات</span>
    </label>
    <label class="checkbox akeelay">
      <input type="radio" value="2" name="zuhar"   ${akeelay}/>
      <span class="checkbox-text">اکیلے</span>
    </label>
    <label class="checkbox qaza">
      <input type="radio" value="1" name="zuhar"  ${qaza} />
      <span class="checkbox-text">قضہ</span>
    </label>
    <label class="checkbox nahi">
      <input type="radio" value="0" name="zuhar"   ${nahi}/>
      <span class="checkbox-text">نہی ادا کی</span>
    </label>
  </div>`;
    html += zuharCardHtml;
    if (data.length > 0) zuharCard.innerHTML = html;
    html = '';
    if (namaz.asar != null) {
      switch (namaz.asar) {
        case "3":
          jamat = "checked";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
        case "2":
          jamat = "";
          akeelay = "checked";
          qaza = "";
          nahi = "";
          break;
        case "1":
          jamat = "";
          akeelay = "";
          qaza = "checked";
          nahi = "";
          break;
        case "0":
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "checked";
          break;
        default:
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
      }
    } else {
      jamat = "";
      akeelay = "";
      qaza = "";
      nahi = "";
    }
    const asarCardHtml = `<div class="head">
    <h3>عصر<span class="required">*</span></h3>
  </div>
  <div class="body">
    <label class="checkbox bajamat">
      <input type="radio" value="3" name="asar"  ${jamat}/>
      <span class="checkbox-text">باجمات</span>
    </label>
    <label class="checkbox akeelay">
      <input type="radio" value="2" name="asar"  ${akeelay}/>
      <span class="checkbox-text">اکیلے</span>
    </label>
    <label class="checkbox qaza">
      <input type="radio" value="1" name="asar" ${qaza} />
      <span class="checkbox-text">قضہ</span>
    </label>
    <label class="checkbox nahi">
      <input type="radio" value="0" name="asar"  ${nahi}/>
      <span class="checkbox-text">نہی ادا کی</span>
    </label>
  </div>`;
    html += asarCardHtml;
    if (data.length > 0) asarCard.innerHTML = html;

    html = '';
    if (namaz.maghrib != null) {
      switch (namaz.maghrib) {
        case "3":
          jamat = "checked";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
        case "2":
          jamat = "";
          akeelay = "checked";
          qaza = "";
          nahi = "";
          break;
        case "1":
          jamat = "";
          akeelay = "";
          qaza = "checked";
          nahi = "";
          break;
        case "0":
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "checked";
          break;
        default:
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
      }
    } else {
      jamat = "";
      akeelay = "";
      qaza = "";
      nahi = "";
    }
    const maghribCardHtml = `<div class="head">
    <h3>مغرب<span class="required">*</span></h3>
  </div>
  <div class="body">
    <label class="checkbox bajamat">
      <input type="radio" value="3" name="maghrib"  ${jamat}/>
      <span class="checkbox-text">باجمات</span>
    </label>
    <label class="checkbox akeelay">
      <input type="radio" value="2" name="maghrib"  ${akeelay}/>
      <span class="checkbox-text">اکیلے</span>
    </label>
    <label class="checkbox qaza">
      <input type="radio" value="1" name="maghrib" ${qaza} />
      <span class="checkbox-text">قضہ</span>
    </label>
    <label class="checkbox nahi">
      <input type="radio" value="0" name="maghrib"  ${nahi}/>
      <span class="checkbox-text">نہی ادا کی</span>
    </label>
  </div>`;
    html += maghribCardHtml;
    if (data.length > 0) maghribCard.innerHTML = html;

    html = '';
    if (namaz.isha != null) {
      switch (namaz.isha) {
        case "3":
          jamat = "checked";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
        case "2":
          jamat = "";
          akeelay = "checked";
          qaza = "";
          nahi = "";
          break;
        case "1":
          jamat = "";
          akeelay = "";
          qaza = "checked";
          nahi = "";
          break;
        case "0":
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "checked";
          break;
        default:
          jamat = "";
          akeelay = "";
          qaza = "";
          nahi = "";
          break;
      }
    } else {
      jamat = "";
      akeelay = "";
      qaza = "";
      nahi = "";
    }
    const ishaCardHtml = `<div class="head">
    <h3>عشاء<span class="required">*</span></h3>
  </div>
  <div class="body">
    <label class="checkbox bajamat">
      <input type="radio" value="3" name="isha"  ${jamat}/>
      <span class="checkbox-text">باجمات</span>
    </label>
    <label class="checkbox akeelay">
      <input type="radio" value="2" name="isha"  ${akeelay}/>
      <span class="checkbox-text">اکیلے</span>
    </label>
    <label class="checkbox qaza">
      <input type="radio" value="1" name="isha" ${qaza} />
      <span class="checkbox-text">قضہ</span>
    </label>
    <label class="checkbox nahi">
      <input type="radio" value="0" name="isha"  ${nahi}/>
      <span class="checkbox-text">نہی ادا کی</span>
    </label>
  </div>`;
    html += ishaCardHtml;
    if (data.length > 0) ishaCard.innerHTML = html;
  });

  // Array.from(input).forEach(function (element) {
  //   element.addEventListener('click', mamulatFunction);
  // });
}

const setupSingleDay = (data) => {
  let html = '';
  const singleDay = document.querySelector('.singleDay');
  if (data.length == 0) {
    const noRecord = `<p class="placeholder">تاریخ کا انتخاب کریں</p>`;
    html += noRecord;
  }
  data.forEach(doc => {
    const namaz = doc.data();
    const single = `
    <div class="summaries" id="singleDaySummary">
    <div class="summary ${getColor(namaz.fajar)}">
      <p class="title">فجر</p>
      <h4 class="value">${getText(namaz.fajar)}</h4>
    </div>
    <div class="summary ${getColor(namaz.zuhar)}">
      <p class="title">ظہر</p>
      <h4 class="value">${getText(namaz.zuhar)}</h4>
    </div>
    <div class="summary ${getColor(namaz.asar)}">
      <p class="title">عصر</p>
      <h4 class="value">${getText(namaz.asar)}</h4>
    </div>
    <div class="summary ${getColor(namaz.maghrib)}">
      <p class="title">مغرب</p>
      <h4 class="value">${getText(namaz.maghrib)}</h4>
    </div>
    <div class="summary ${getColor(namaz.isha)}">
      <p class="title">عشاء</p>
      <h4 class="value">${getText(namaz.isha)}</h4>
    </div>
  </div>`;
    html += single;
  });
  singleDay.innerHTML = html;
}

function getColor(namaz) {
  switch (namaz) {
    case "3":
      return "bajamat";
    case "2":
      return "akeelay";
    case "1":
      return "qaza";
    case "0":
      return "nahi";
    default:
      return "nahi";
  }
}

function getText(namaz) {
  switch (namaz) {
    case "3":
      return "باجمات";
    case "2":
      return "اکیلے";
    case "1":
      return "قضہ";
    case "0":
      return "نہی ادا کی";
    default:
      return "نہی ادا کی";
  }
}

//////////////////////////////// app.js ////////////////////////////////
async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      alert('ServiceWorker registration failed. Sorry about that.');
    }
  } else {
    document.querySelector('.alert').removeAttribute('hidden');
  }
}
window.addEventListener('load', e => {
  registerSW();
});
