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

    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    const user = localStorage.getItem("name")
    const userProper = user.toProperCase()

    const getData = async () => {
        const response = await fetch(`http://bp-api.avner.sg/users/${user}/data`);
        const data = await response.json();
        return data;
    }

    firebase.database().ref('users/' + user + '/items').on('value', (snapshot) => {
        $("#bp-num-items").text(Object.keys(snapshot.val()).length-1)
    });

    firebase.database().ref('users/' + user + '/points').on('value', (snapshot) => {
        balanceElements = document.getElementsByClassName('bp-data-balance')

        for (const element of balanceElements) {
            element.innerText = snapshot.val();
        }
    });

    firebase.database().ref('users/' + user + '/email').on('value', (snapshot) => {
        $("#emailInput").attr("placeholder", snapshot.val());
    });

    $("#name").text(userProper)
    
    getData(user).then(data => {
        $("#membership").text(data["membership"])
    })

    $(".edit-profile .btn-primary").click(function() {
        Swal.fire({
            title: "Confirmation",
            text: `Are you sure you would like to save these changes??`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            icon: "question",
        }).then((result) => {
            if (result.isConfirmed) {
                data = {}

                let newPassword = $("#passwordInput").val()
                if (newPassword.trim().length > 0) {
                    data["password"] = newPassword
                }

                let newEmail = $("#emailInput").val()
                if (newEmail.trim().length > 0) {
                    data["email"] = newEmail
                }

                firebase.database().ref('users/' + user).update(data);
                Swal.fire(
                    "Data Saved!",
                    "Your data has successfully been saved!",
                    "success"
                )
            }
        })
    })

    $("#logout").click(function() {
        localStorage.setItem("isLoggedIn", "false")
        window.location.replace("/")
    })
})