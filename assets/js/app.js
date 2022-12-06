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
    const user = localStorage.getItem("name")

    firebase.database().ref('users/' + user + '/items').on('value', (snapshot) => {
        $("#bp-num-items").text(Object.keys(snapshot.val()).length-1)
    });

    firebase.database().ref('users/' + user + '/points').on('value', (snapshot) => {
        balanceElements = document.getElementsByClassName('bp-data-balance')

        for (const element of balanceElements) {
            element.innerText = snapshot.val();
        }
    });

    firebase.database().ref('users/' + user + '/membership').on('value', (snapshot) => {
        membershipElements = document.getElementsByClassName('bp-data-membership')

        for (const element of membershipElements) {
            element.innerText = snapshot.val();
        }
    });

    firebase.database().ref('users/' + user + '/offers-completed').on('value', (snapshot) => {
        offersElements = document.getElementsByClassName('bp-data-offers')

        for (const element of offersElements) {
            element.innerText = snapshot.val();
        }
    });


    $("#bp-booster .btn").click(function() {
        let amount = $(this).data("purchase-amount")
        let price = $(this).data("purchase-price")
        Swal.fire({
            title: 'Checkout',
            text: `Would you like to proceed to get BP ${amount}?`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            icon: 'question'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://bp-api.avner.sg/users/${user}/add-points`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "add": amount })
                })
                Swal.fire('Success!', `BP ${amount} has successfully been added to your account!`, 'success')
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
        })
    })
})