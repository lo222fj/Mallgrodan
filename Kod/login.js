var firebase = new Firebase('https://blinding-fire-8523.firebaseio.com/');
var loginMessage = $('#loginMessage');


var auth = new FirebaseSimpleLogin(firebase, function (error, user) {
    console.log('i var auth');
    if (error) {
        switch (error.code) {
            case 'INVALID_EMAIL': messages("Felaktig mailadress", "errorMessage")
            case 'EMAIL_TAKEN': messages("Angiven mailadress är upptagen", "errorMessage")
            case 'INVALID_USER': messages("Användaren finns inte hos Mallgrodan", "errorMessage")
            case 'INVALID_PASSWORD': messages("Lösenordet stämmer inte med användaren")
        }
        console.log(error);
    } else if (user) {
        console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);

    } else {
        console.log('Nope, no logged in user.');
    }
});

function createUser() {
    console.log('i createUser');
    console.log(email.value + ' ' + password.value);
    auth.createUser(email.value, password.value, function (error, user) {

        if (!error) {
            messages('Välkommen som användare på Mallgrodan!', 'correctMessage');

            console.log('User Id: ' + user.uid + ', Email: ' + user.email);
        }
        else {
            messages('Det gick tyvärr inte att skapa en ny användare!', 'errorMessage');

            console.log(error);
        }
        $('#email').val('');
        $('#password').val('');
    });
}

function login() {
    console.log('i login()')

    auth.login("password", {
        email: email.value,
        password: password.value
    });
}

function messages(message, messageClass) {
    loginMessage.addClass(messageClass);
    loginMessage.text(message);
}

