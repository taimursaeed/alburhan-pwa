var input = document.querySelectorAll('input');

async function mamulatFunction() {
  var _name = this.name;
  var _value = this.value;
  var date = window.timestamp;
  var id = window.timestamp.toString();

  if (_name !== "") {
    let document = await firebase.firestore().collection("mamulat").doc(id).get();
    if (document && document.exists) {
      await document.ref.update({
        [_name]: _value
      });
      alert("Updated successfully!");
    } else {
      await document.ref.set({
        id: id,
        [_name]: _value,
        date: date
      }, {
        merge: true
      });
      alert("Added successfully!");
    }
  }
}

Array.from(input).forEach(function (element) {
  element.addEventListener('click', mamulatFunction);
});
