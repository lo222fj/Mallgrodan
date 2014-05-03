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
        messages('Du är inloggad som '+ user.email, 'correctMessage');
        console.log('I auth: User Id: ' + user.uid + ', Provider: ' + user.provider);

    } else {
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

            console.log(userRef);
            console.log(userEmail + ' i createUser');
            console.log(userId + ' i createUser');

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
    console.log(userEmail + 'sist i login');
    console.log(userId + 'sist i login');
    resetFields();
}

function logout() {
    alert('utloggad användare ' );
}

function messages(message, messageClass) {
    loginMessage.addClass(messageClass);
    loginMessage.text(message);
}
function resetFields() {
    $('#email').val('');
    $('#password').val('');
}

function save() {
    alert("Spara");
}
