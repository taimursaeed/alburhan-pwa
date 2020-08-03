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

  // document.querySelector(".placeholder").remove();
  // document.querySelectorAll(".summary").forEach((ele) => {
  //   ele.classList.remove("hide");
  // });

  let document = await db.collection("mamulat").where("userId", "==", _userId).where("id", "==", day).get().then(snapshot => {
    setupSingleDay(snapshot.docs);
  });
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
  </div>
    `;
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
      return "باجمات";
  }
}
