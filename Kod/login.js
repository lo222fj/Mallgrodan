var firebase = new Firebase('https://blinding-fire-8523.firebaseio.com/');
var loginMessage = $('#loginMessage');
//var userId;
//var userEmail;
//var userRef;
var loggedInUserEmail;

//koppling till login-systemet
//efter rad 9 är auth ett FirebaseSimpleLogin-objekt
var auth = new FirebaseSimpleLogin(firebase, function (error, user) {
 console.log('i var auth');

 if (error) {
  switch (error.code) {
   case 'INVALID_EMAIL': messages("Felaktig mailadress", "errorMessage")
   case 'EMAIL_TAKEN': messages("Angiven mailadress är upptagen", "errorMessage")
   case 'INVALID_USER': messages("Användaren finns inte hos Mallgrodan", "errorMessage")
   case 'INVALID_PASSWORD': messages("Lösenordet stämmer inte med användaren", "errorMessage")
  }
  console.log(error);
 } else if (user) {
  loggedInUserEmail = user.email;
  messages('Du är inloggad som ' + user.email, 'correctMessage');
  console.log('I auth: User Id: ' + user.uid + ', Provider: ' + user.provider);
  $('#administrateTemplates').css('display', 'block');
 } else {
  loggedInUserEmail = '';
  messages('Du är inte inloggad', 'correctMessage');
  console.log('Nope, no logged in user.');
 }
 console.log(loggedInUserEmail + ' sist i var aut');
});

function createUser() {
 console.log('i createUser mupp');

 console.log(email.value + ' ' + password.value);
 auth.createUser(email.value, password.value, function (error, user) {
  console.log('user = ' + user);
  if (!error) {
   messages('Välkommen som användare på Mallgrodan!', 'correctMessage');

   var userId = user.uid;
   var userEmail = user.email;
   var userRef = firebase.child(('user/' + userEmail.toString()).replace('.', ' '));
   userRef.set('mitt användarnamn är ' + userId);

   console.log('User Id: ' + user.uid + ', Email: ' + user.email);
  }
  else {
   messages('Det gick tyvärr inte att skapa en ny användare!', 'errorMessage');
   console.log(error);
  }
  resetFields();
 });
 console.log(userEmail + 'sist i createUser');
 //console.log(userId + 'sist i createUser');
}

function login() {
 console.log('i login()')

 auth.login("password", {
  email: email.value,
  password: password.value
 });
 console.log(loggedInUserEmail + ' sist i login');
 resetFields();
}

function logout() {
 console.log('i logout');
 auth.logout();
 $('#administrateTemplates').css('display', 'block');
}

function saveCssTemplateToFirebase() {
 console.log(loggedInUserEmail);
 var name = $('#templateToAdministrate').val();

 //if (loggedInUserEmail != '') {
 if (name != '') {
  var currentUser = firebase.child(('user/' + loggedInUserEmail.toString()).replace('.', ' '));
  var css = $('#textareaCss').val();

  currentUser.child(name).set(css);

  messages('Mallen ' + name + ' har sparats', 'correctMessage');
 }
 else {
  messages('Du måste döpa mallen för att kunna spara', 'errorMessage');
 }
 $('#templateToAdministrate').val('');
}


function loadCssTemplateFromFirebase() {
 var currentUser = firebase.child(('user/' + loggedInUserEmail.toString()).replace('.', ' '));
 console.log(currentUser);
 var name = $('#templateToAdministrate').val();

 if (name == '') {
  messages('Du måste ange namnet på mallen du vill öppna', 'errorMessage');
  return;
 }


 else {
  currentUser.child(name).once('value', function (dataSnapshot) {
   var css = dataSnapshot.val();
   var exists = exist(name, currentUser);
   console.log(exists + ' i load');
   if (exists) {

    $('#html').text('');
    $('#textareaCss').val(css);
    $('#templateToAdministrate').val('');

    var codeHtml = loadHtmlDoc();
    loadResult(codeHtml, css);
   }
   else {
    messages('Det finns ingen sparad mall med namnet ' + name, 'errorMessage');
   }
  }, function (error) {
   messages('Mallen ' + name + ' kunde inte öppnas', 'errorMessage');
  });
 }
}
function viewSavedTemplates() {
 emptyLoginMessage();
 var savedTemplates = $('#savedTemplates');
 savedTemplates.empty();

 var currentUser = firebase.child(('user/' + loggedInUserEmail.toString()).replace('.', ' '));

 currentUser.once('value', function (childSnapshot) {
  var templates = childSnapshot.val();

  for (var template in templates) {
   savedTemplates.append($('<li>' + template + '</li>'));
   //console.log(template)
  }
 })
}
function removeTemplate() {
 alert('remove');
 var currentUser = firebase.child(('user/' + loggedInUserEmail.toString()).replace('.', ' '));
 var name = $('#templateToAdministrate').val();
 //var exists = exist(name, currentUser);
 currentUser.once('value', function (childSnapshot) {
  var templates = childSnapshot.val();
  var exists = false;

  for (var template in templates) {
   if (template == name) {
    exists = true;
   }
  }
  if (exists) {
   var onComplete = function (error) {
    if (error) {
     messages('Mallen ' + name + ' kunde inte tas bort', 'errorMessage');
    }
    else {
     messages('Mallen ' + name + ' har tagits bort', 'correctMessage');
    }
   }
   currentUser.child(name).remove(onComplete);
  }
  else {
   messages('Det finns ingen sparad mall med namnet ' + name, 'errorMessage');
  }
 });
 //Timer för att meddelandet ska hinna hämta namnet på mallen innan den raderas
 setTimeout(function () {
  $('#templateToAdministrate').val('');
 }, 300);
}
function exist(name, currentUser) {
 console.log(currentUser + ' i exist');
 currentUser.once('value', function (childSnapshot) {

  var templates = childSnapshot.val();

  var exists = false;

  for (var template in templates) {
   if (template == name) {
    exists = true;
   }
  }
  //console.log(exists + ' i exist');
 });
 return exists;
}

function messages(message, messageClass) {
 var existingClass = loginMessage.attr('class');
 loginMessage.removeClass(existingClass);

 loginMessage.addClass(messageClass);
 loginMessage.text(message);
}
function emptyLoginMessage() {
 $('#loginMessage').val('');
}

function resetFields() {
 $('#email').val('');
 $('#password').val('');
}
