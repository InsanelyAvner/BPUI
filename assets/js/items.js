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
            element.innerText = (snapshot.val());
        }
    });
    // function redeem(item) {
    //     console.log(item)
    // }

    firebase.database().ref('users/' + user + '/items').on('value', (snapshot) => {
        $("#item-list").empty()
        let order = 0
        for (const item in snapshot.val()) {
            if (order > 0) {
                $("#item-list").append(`<tr><th scope="row">${order}</th><td>${item}</td><td>BP ${snapshot.val()[item]}</td><td><div class="button btn btn-primary" data-item='${item}'>REDEEM</div></td></tr>`)
            }
            order++
        }

        $("#item-list .btn").click(function() {
            Swal.fire({
                title: "Checkout",
                text: `Would you like to proceed to redeem a ${$(this).data("item")}?`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                icon: "question",
            }).then((result) => {
                if (result.isConfirmed) {
                    firebase.database().ref('users/' + user + '/items/' + $(this).data("item")).remove()
                    Swal.fire('Hooray!', `A ${$(this).data("item")} has successfully been redeemed! Please show this to Avner for proof`, 'success')
                }
            })
            
        })
    });
    //
})