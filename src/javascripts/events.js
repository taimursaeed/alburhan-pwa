var input = document.querySelectorAll('input');
var notification = document.querySelector('.notification');
var notificationTimer;

async function mamulatFunction() {
  var _name = this.name;
  var _value = this.value;
  var date = window.timestamp;
  var id = window.timestamp.toString();

  notification.classList.remove('show');

  if (_name !== "") {
    let document = await firebase.firestore().collection("mamulat").doc(id).get();
    if (document && document.exists) {
      await document.ref.update({
        [_name]: _value
      });
      notification.classList.add('show');
      notificationTimer=setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    } else {
      await document.ref.set({
        id: id,
        [_name]: _value,
        date: date
      }, {
        merge: true
      });
      notification.classList.add('show');
      notificationTimer=setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
     }
  }
}

Array.from(input).forEach(function (element) {
  element.addEventListener('click', mamulatFunction);
});
