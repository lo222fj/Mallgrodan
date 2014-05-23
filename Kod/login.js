var firebase = new Firebase('https://blinding-fire-8523.firebaseio.com/');
var loginMessage = $('#loginMessage');
var loggedInUserEmail;
var templateMessage = $('#templateMessage');
var loginDiv = $('#loginDiv');
var loginLinks = $('#loginLinks');

//koppling till login-systemet
//efter rad 9 är auth ett FirebaseSimpleLogin-objekt
var auth = new FirebaseSimpleLogin(firebase, function (error, user) {
 console.log('i var auth');

 if (error) {
  switch (error.code) {
   case 'INVALID_EMAIL': messages(loginMessage, "Felaktig mailadress", "errorMessage")
   case 'EMAIL_TAKEN': messages(loginMessage, "Angiven mailadress är upptagen", "errorMessage")
   case 'INVALID_USER': messages(loginMessage, "Användaren finns inte hos Mallgrodan", "errorMessage")
   case 'INVALID_PASSWORD': messages(loginMessage, "Lösenordet stämmer inte med användaren", "errorMessage")
  }
  console.log(error);
 } else if (user) {
  loggedInUserEmail = user.email;
  messages(loginMessage, 'Du är inloggad som ' + user.email, 'correctMessage');
  console.log('I auth: User Id: ' + user.uid + ', Provider: ' + user.provider);
  $('#administrateTemplates').css('display', 'block');

  //Knappar
  $('#loginMessage').before($('<input id="logoutButton" type="button" value="Logga ut" />'));
  $('#logoutButton').on('click', function () {
   logout();
  });
  $('#loginButton').remove();
  //$('#password').remove();
  //$('#email').remove();

 }
 else {
  loggedInUserEmail = '';
  messages(loginMessage, 'Du är inte inloggad', 'correctMessage');

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
   messages(loginMessage, 'Välkommen som användare på Mallgrodan!', 'correctMessage');

   var userId = user.uid;
   var userEmail = user.email;
   var userRef = firebase.child(('user/' + userEmail.toString()).replace('.', ' '));
   userRef.set('mitt användarnamn är ' + userId);

   console.log('User Id: ' + user.uid + ', Email: ' + user.email);

   //$('#createUser').remove();
   //$('#password').remove();
   //$('#email').remove();

  }
  else {
   messages(loginMessage, 'Det gick tyvärr inte att skapa en ny användare!', 'errorMessage');
   console.log(error);
  }
  resetFields();
 });

 //console.log(userId + 'sist i createUser');
}

function prepareLogin() {
 loginDiv.prepend($('<input id="createUser" type="button" value="Skapa användare" />'));
 $('#createUser').on('click', function () {
  createUser();
 });
 //lägger in fält och kopplar klickfunktion
 loginDiv.prepend($('<input id="loginButton" type="button" value="Logga in" />'));
 $('#loginButton').on('click', function () {
  login();
 });

 loginDiv.prepend($('<input id="password" type="password" placeholder="Lösenord" />'));
 loginDiv.prepend($('<input id="email" placeholder="email" />'));

 //$('#password').css('display', 'block');
}

function login() {
 console.log('i login()')

 auth.login("password", {
  email: email.value,
  password: password.value
 });

 ////Knappar
 //loginDiv.prepend($('<input id="logoutButton" type="button" value="Logga ut" />'));
 //$('#logoutButton').on('click', function() {
 //     logout(); 
 // });
 //$('#loginButton').remove();
 //$('#password').remove();
 //$('#email').remove();

 console.log(loggedInUserEmail + ' sist i login');
 resetFields();
}

function logout() {
 console.log('i logout');
 auth.logout();
 $('#administrateTemplates').css('display', 'none');

 $('#logoutButton').remove();
 $('#loginMessage').before($('<input id="loginButton" type="button" value="Logga in" />'));
 $('#loginButton').on('click', function () {
  login();
 });

 //$('#loginLinks').append($('<a id="loginLink" href="#">Logga in</a>'));
 //$('#loginLinks').append($('<a id="newUserLink" href="#">Ny användare</a>'));
}

function saveCssTemplateToFirebase() {
 console.log(loggedInUserEmail);
 var name = $('#templateToAdministrate').val();

 //if (loggedInUserEmail != '') {
 if (name != '') {
  var currentUser = firebase.child(('user/' + loggedInUserEmail.toString()).replace('.', ' '));
  var css = $('#textareaCss').val();

  currentUser.child(name).set(css);

  messages(templateMessage, 'Mallen ' + name + ' har sparats', 'correctMessage');
 }
 else {
  messages(templateMessage, 'Du måste döpa mallen för att kunna spara', 'errorMessage');
 }
 $('#templateToAdministrate').val('');
}


function loadCssTemplateFromFirebase() {
 var currentUser = firebase.child(('user/' + loggedInUserEmail.toString()).replace('.', ' '));
 console.log(currentUser);
 var name = $('#templateToAdministrate').val();
 var exists;

 if (name == '') {
  messages(templateMessage, 'Du måste ange namnet på mallen du vill öppna', 'errorMessage');
  return;
 }
 currentUser.once('value', function (childSnapshot) {
  var templates = childSnapshot.val();
  exists = false;

  for (var template in templates) {
   if (template == name) {
    exists = true;
   }
  }
  var css = childSnapshot.child(name).val();
  console.log(css);

  if (exists) {
   $('#html').text('');
   $('#textareaCss').val(css);
   $('#templateToAdministrate').val('');

   var codeHtml = loadHtmlDoc();
   loadResult(codeHtml, css);
   emptyTemplateMessage();
  }
  else {
   messages(templateMessage, 'Det finns ingen sparad mall med namnet ' + name, 'errorMessage');
  }
 }, function (error) {
  messages(templateMessage, 'Mallen ' + name + ' kunde inte öppnas', 'errorMessage');
 });
}
function viewSavedTemplates() {
 emptyTemplateMessage();
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
     messages(templateMessage, 'Mallen ' + name + ' kunde inte tas bort', 'errorMessage');
    }
    else {
     messages(templateMessage, 'Mallen ' + name + ' har tagits bort', 'correctMessage');
    }
   }
   currentUser.child(name).remove(onComplete);
  }
  else {
   messages(templateMessage, 'Det finns ingen sparad mall med namnet ' + name, 'errorMessage');
  }
 });
 //Timer för att meddelandet ska hinna hämta namnet på mallen innan den raderas
 setTimeout(function () {
  $('#templateToAdministrate').val('');
 }, 300);
}
function messages(messageType, message, messageClass) {
 var existingClass = messageType.attr('class');
 messageType.removeClass(existingClass);

 messageType.addClass(messageClass);
 messageType.text(message);
}
function emptyTemplateMessage() {
 templateMessage.text('');
}

function resetFields() {
 $('#email').val('');
 $('#password').val('');
}
