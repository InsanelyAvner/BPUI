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

    $(".product-qnty button").click(function() {
        let item = $(this).data("purchase-item")
        if (item !== "Custom Purchase") {
            let price = $(this).data("purchase-item-price")

            firebase.database().ref('users/' + user + "/items/" + item).once('value').then((snapshot) => {
                console.log(snapshot.val())
                if (snapshot.val()) {
                    Swal.fire({
                        title: "Checkout",
                        html: `<div style="margin-bottom: 10px;">Would you like to proceed to get a ${item}?</div>The ${item} will automatically activate as you can only store 1 of each item`,
                        showCancelButton: true,
                        confirmButtonText: 'Sure',
                        icon: "question",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch(`https://bp-api.avner.sg/users/${user}/deduct-points`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ "deduct": price })
                            })
                            
                            Swal.fire({
                                title: "Hooray!",
                                text: `You have succesfully redeemed a ${item}! Please show this to Avner for proof`,
                                confirmButtonText: 'Ok',
                                icon: "success",
                            })
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Checkout",
                        text: `Would you like to proceed to get a ${item}?`,
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        icon: "question",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            fetch(`https://bp-api.avner.sg/users/${user}/deduct-points`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ "deduct": price })
                            })
                            
                            Swal.fire({
                                title: "Success!",
                                text: `You have succesfully obtained a ${item}! Would you like to redeem it now?`,
                                showCancelButton: true,
                                confirmButtonText: 'Yes',
                                cancelButtonText: "Later",
                                icon: "success",
                            }).then((result2) => {
                                if (result2.isConfirmed) {
                                    Swal.fire({
                                        title: `${item} Redeemed!`,
                                        text: "Please show this to Avner for proof",
                                        icon: "success",
                                        confirmButtonText: "Close"
                                    })
                                } else {
                                    let data = {}
                                    data[item] = price
                                    firebase.database().ref('users/' + user + "/items").update(data);
                                    Swal.fire(
                                        "Info",
                                        `A ${item} item has been added to your Items List. You can redeem it anytime from there`,
                                        "info"
                                    )
                                }
                            })
                        }
                    })
                }
            })
        } else {
            // Custom Purchase
            (async () => {
                const { value: price } = await Swal.fire({
                  title: "Price",
                  input: 'text',
                  inputLabel: "Please enter the product's price in numerals",
                  inputPlaceholder: '',
                  icon: "question",
                  footer: "Note: Custom purchases are&nbsp;<strong>automatically redeemed</strong>",
                  showCancelButton: true,
                  confirmButtonText: "Proceed",
                  inputValidator: (value) => {
                    if (!value) {
                      return "Please enter the product's price"
                    }
                  }
                })
                
                if (price) {
                    fetch(`https://bp-api.avner.sg/users/${user}/deduct-points`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "deduct": price })
                    })

                    Swal.fire({
                        title: `Purchase Success!`,
                        text: `The product has successfully been redeemed for BP ${price}. Please show this to Avner for proof`,
                        icon: "success",
                        confirmButtonText: "Close"
                    })
                }
            })()
        }
    })
})