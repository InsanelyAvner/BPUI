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

    const getData = async () => {
        const response = await fetch(`http://bp-api.avner.sg/users/${user}/data`);
        const data = await response.json();
        return data;
    }

    const priceList = {
        "massage": 70,
        "story": 170,
        "dishes": 100,
        "milk": 45
    }

    function offer(price) {
        (async () => {
            const { value: password } = await Swal.fire({
                icon: 'question',
                title: 'Verification',
                text: 'Please ask Avner to enter the password',
                input: 'password',
                inputPlaceholder: 'Password',
                inputAttributes: {
                    autocapitalize: 'off'
                }
            })

            if (password == "avnerbest") {
                fetch(`https://bp-api.avner.sg/users/${user}/add-points`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "add": price })
                })

                getData(user).then((data) => {
                    firebase.database().ref('users/' + user).update({
                        "offers-completed": data["offers-completed"]+1
                    });
                })

                Swal.fire({
                    title: "Hooray!",
                    text: `BP ${price} has successfully been added to your BPoints account!`,
                    confirmButtonText: 'Yay!',
                    icon: "success",
                })
            }
        })()
    }

    function custom() {
        (async () => {
            const { value: password } = await Swal.fire({
                icon: 'question',
                title: 'Verification',
                text: 'Please ask Avner to enter the password',
                input: 'password',
                inputPlaceholder: 'Password',
                inputAttributes: {
                    autocapitalize: 'off'
                }
            })

            if (password == "avnerbest") {
                const { value: price } = await Swal.fire({
                    icon: 'question',
                    title: 'Earnings',
                    text: 'How much BPoints have to be added?',
                    input: 'text',
                    inputPlaceholder: 'Amount',
                    inputAttributes: {
                        autocapitalize: 'off'
                    }
                })

                fetch(`https://bp-api.avner.sg/users/${user}/add-points`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "add": price })
                })

                getData(user).then((data) => {
                    firebase.database().ref('users/' + user).update({
                        "offers-completed": data["offers-completed"]+1
                    });
                })

                Swal.fire({
                    title: "Hooray!",
                    text: `BP ${price} has successfully been added to your BPoints account!`,
                    confirmButtonText: 'Yay!',
                    icon: "success",
                })
            }
        })()
    }

    
    $(".product-qnty button").click(function() {
        let item = $(this).data("earn-item")

        if (item == "Massage") {
            offer(priceList["massage"])
        } else if (item == "Bedtime Story") {
            offer(priceList["story"])
        } else if (item == "Dishwashing Service") {
            offer(priceList["dishes"])
        } else if (item == "Make Milk for Avner") {
            offer(priceList["milk"])
        } else if (item == "Custom Offer") {
            custom()
        }
    })
})