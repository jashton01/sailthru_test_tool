$("#cart_submit").on("click", function submit_form() {
    const id = "cart";
        console.log(id + ".js script initiated.");
    const base_url = "http://links.stevedoesitall.com/join/";
    const email = $("#" + id + "_email").val();
    const new_window = base_url + id;

    if (email == "") {
        alert("Please enter an email address.");
        return false
    }
    else if (email.indexOf("@") == -1) {
        alert(email + " is not a valid email address.");
        return false
    }

    else {
        const data = {};
        data.email = email;

        const data_string = JSON.stringify(data);
        
        console.log("Cart Abandon running...", data);
        
        $.ajax({
            type: "POST",
            url: "/email",
            data: { id : id, data : data_string },
            success: function(data) { 
                const user_cookie = data.keys.cookie;
                window.open(new_window + "?cookie=" + user_cookie, "_blank");
            }
        });
        
        setTimeout(function() {
            alert(email + " has cart abandoned!");
        }, 2000);
    }
});

