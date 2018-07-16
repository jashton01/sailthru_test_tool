$(".purchase_submit").on("click", function submit_form() {

    const id = "purchase";
        console.log(id + ".js script initiated.");
    const email = $("#" + id + "_email").val();
    const url = $("#" + id + "_url").val();
    const title = $("#" + id + "_title").val();
    const tags = $("#" + id + "_tags").val();
    const image = $("#" + id + "_image").val();
    const qty = $("#" + id + "_qty").val();
    const price = $("#" + id + "_price").val();
    const purchase_var = $("#" + id + "_var").val();
    const purchase_val = $("#" + id + "_val").val();
    const messageid = $("#" + id + "_messageid").val();
    const ordervar = $("#" + id + "_ordervar").val();
    const orderval = $("#" + id + "_orderval").val();

    const adjustment_length = document.getElementsByClassName("purchase_adjustments");
    const adjustments = document.querySelectorAll(".purchase_adjustments");
    console.log("Adjustments length", adjustment_length);

    const tag_name = [];
    tag_name.push("academy-days");

    let incomplete;
    let returned;
    let cart_empty;

    if (this.id == "incomplete_purchase" || this.id == "clear_purchase") {
        incomplete = 1;
    }
    else {
        incomplete = 0;
    }

    if (this.id == "clear_purchase") {
        cart_empty = true;
    }
    else {
        cart_empty = false;
    }

    if (this.id == "return_purchase") {
        returned = true;
    }
    else {
        returned = false;
    }

    if (email == "") {
        alert("Please enter an email address.");
        return false;
    }
    else if (email.indexOf("@") == -1) {
        alert(email + " is not a valid email address.");
        return false;
    }

    if (!url && this.id != "clear_purchase") {
        alert("Please enter a URL.");
        return false;
    }

    if (!title && this.id != "clear_purchase") {
        alert("Please enter a title.");
        return false;
    }

    if (!qty > 0 && this.id != "clear_purchase") {
        alert("Please enter a quantity greater than 0.");
        return false;
    }

    if (!price > 0 && this.id != "clear_purchase") {
        alert("Please enter a price greater than 0.");
        return false;
    }

    else {
        const data = {};
        data.email = email;
        data.url = url;
        data.title = title;
        data.qty = qty;
        data.price = price;
        data.incomplete = incomplete;
        data.cart_empty = cart_empty;
        data.returned = returned;

        if (tags) {
            data.tags = tags.split(",").concat(tag_name);
        }
        else {
            data.tags = tag_name;
        }

        if (ordervar && orderval) {
            data.ordervar = ordervar;
            data.orderval = orderval;
        }

        if (messageid) {
            data.messageid = messageid;
        }

        if (purchase_var && purchase_val) {
            data.var_name = purchase_var;
            data.var_val = purchase_val;
        }

        if (image) {
            data.image = image;
        }

        if (purchase_var && !purchase_val && returned == false) {
            alert("Please enter a value for Purchase Value.");
            return false
        }

        if (!purchase_var && purchase_val && returned == false) {
            alert("Please enter a value for Purchase Var.");
            return false
        }


        if (ordervar && !orderval && returned == false) {
            alert("Please enter a value for Order Value.");
            return false
        }

        if (!ordervar && orderval && returned == false) {
            alert("Please enter a value for Order Var.");
            return false
        }

        if (adjustment_length.length > 0) {
            data.adjustments = [];
            adjustments.forEach(adjustment => {
                if (adjustment.name == "tax" && !(adjustment.value > 0) && (adjustment.value != "") && returned == false) {
                    alert("Tax must be a positive number.");
                    return false;
                }
                else if (adjustment.name == "tax" && (adjustment.value != "")) {
                    data.adjustments.push({name: "tax", "price" : adjustment.value});
                }

                if (adjustment.name == "discount" && !(adjustment.value < 0) && (adjustment.value != "") && returned == false) {
                    alert("Discount must be a negative number.");
                    return false;
                }
                else if (adjustment.name == "discount" && (adjustment.value != "")) {
                    data.adjustments.push({name: "discount", "price" : adjustment.value});
                }
            }); 
            console.log("Adjustments", data.adjustments);
        }


        if (this.id == "incomplete_purchase") {
            alert(title + " has been added to your cart!");
        }
        else if (this.id == "return_purchase") {
            alert(title + " has been returned!");
        }
        else if (this.id == "clear_purchase") {
            alert("Your cart has been emptied!");
        }
        else {
            alert(title + " has been purchased!");
        }

        const data_string = JSON.stringify(data);

        console.log("Purchase API running...", data);
        
        $.ajax({
            type: "POST",
            url: "/email",
            data: { id : id, data : data_string }
        });
    }
});
