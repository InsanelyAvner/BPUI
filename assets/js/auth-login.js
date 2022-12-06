$(function() {
    const firebaseConfig = {
        apiKey: "AIzaSyCIPnycnppmhjS9E5EK2kLPVQ0xqdpSH0M",
        authDomain: "bpoints-web.firebaseapp.com",
        databaseURL: "https://bpoints-web-default-rtdb.firebaseio.com",
        projectId: "bpoints-web",
        storageBucket: "bpoints-web.appspot.com",
        messagingSenderId: "292695892145",
        appId: "1:292695892145:web:cf1b3836462a03b1c28290"
    };
    
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    $("#loginButton").click(function() {
        const name = $("#name").val()
        const password = $("#password").val()
        firebase.database().ref('users/' + name).once('value').then((nameSnapshot) => {
            if (nameSnapshot.exists()) {
                firebase.database().ref('users/' + name + '/password').once('value').then((passwordSnapshot) => {
                    if (password == passwordSnapshot.val()) {
                        localStorage.setItem("isLoggedIn", true)
                        localStorage.setItem("name", name)
                        window.location.replace("/")
                    } else {
                        Swal.fire(
                            "Oops",
                            "The entered password is incorrect!",
                            "error"
                        )
                    }
                })
            } else {
                Swal.fire(
                    "Oops",
                    "The entered username is incorrect!",
                    "error"
                )
            }
        })
    })
})