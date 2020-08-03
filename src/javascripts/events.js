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
