var input = document.querySelectorAll('input');
var notification = document.querySelector('.notification');
var notificationTimer;

async function mamulatFunction() {
  var _name = this.name;
  var _value = this.value;
  var date = window.timestamp;
  var id = window.timestamp.toDateString();
  var _userId = auth.currentUser.uid;
  notification.classList.remove('show');
  if (_name !== "") {
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
  }
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
