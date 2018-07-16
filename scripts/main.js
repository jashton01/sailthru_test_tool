$( document ).ready(function() {
    const user_lists = [];
    const non_master_lists = [];
    const master_lists = [];
    const master_lists_sorted = [];
    const send_templates = [];
    let all_lists = []

clear_array = function() {
    user_lists.length = 0;
    non_master_lists.length = 0;
    master_lists.length = 0;
    master_lists_sorted.length = 0;
    send_templates.length = 0;
    all_lists.length = 0;
}

get_data = ( function() {
    // clear_array();
    $.ajax({
        type: "POST",
        url: "/email",
        data: { id : "lists", data : "{}" },
        success: function(data) {
            
            const status = "active";
            const list_convention = "Master List ";
            const list_length = list_convention.length;    
            const data_lists = data.lists;
            data_lists.forEach(list => {
                if (list.vars && list.vars.status == status) {
                    user_lists.push({"name": list.name});
                }
            });
            user_lists.sort(function(a, b) {
                const text_a = a.name.toUpperCase();
                const text_b = b.name.toUpperCase();
                return (text_a < text_b) ? -1 : (text_a > text_b) ? 1 : 0;
            });

            user_lists.forEach(list => {
                const list_name = list.name;
                if (list_name.indexOf(list_convention) == -1) {
                    non_master_lists.push(list_name);
                }
                else {
                    const master_list = parseInt(list_name.substr(list_name.indexOf(list_convention)+list_length));
                    master_lists.push(master_list);
                }
            });

            master_lists.sort(function(a, b) {
                return a - b
            });
            
            master_lists.forEach(list_num => {
                master_lists_sorted.push(`${list_convention} ${list_num}`);
            });

            all_lists = non_master_lists.concat(master_lists_sorted);

            const lists_list = document.getElementById("user_lists");
            console.log(all_lists);
            if (!lists_list.length > 0) {
                all_lists.forEach(list => {
                    $("#user_lists").append('<option value="'+ list + '">' + list + "</option>");
                });
            }

            const retr_message = document.getElementById("retr_message");
            if (retr_message != null) {
                retr_message.parentNode.removeChild(retr_message);
                $("#user_dropdown").removeClass("dropdown");
            }
        }
    });
    
    $.ajax({
        type: "POST",
        url: "/email",
        data: { id : "templates", data : "{}" },
        success: function(data) {
            const label = "testers";
            const all_templates = data.templates;
            all_templates.forEach(template => {
                if (template.labels && template.labels.includes(label)) {
                    send_templates.push({"name": template.name});
                }
            });

            send_templates.sort(function(a, b) {
                const text_a = a.name.toUpperCase();
                const text_b = b.name.toUpperCase();
                return (text_a < text_b) ? -1 : (text_a > text_b) ? 1 : 0;
            });
            console.log(send_templates);
            const template_list =  document.getElementById("send_templates");
            if (!template_list.length > 0) {
                send_templates.forEach(template => {
                    const template_name = template.name;
                    $("#send_templates").append('<option value="'+ template_name + '">' + template_name + "</option>");
                });
            }
        }
    });
    const retr_message = document.getElementById("retr_message");
    if (retr_message != null) {
        retr_message.parentNode.removeChild(retr_message);
        $("#send_dropdown").removeClass("dropdown");
    }
} () );


const content_blocks = document.querySelectorAll(".content_block");

$(content_blocks).hide();

    $(".select_button").on("click", function get_content() {
        content_blocks.forEach(content => {
            if (content.id == this.id + "_post") {
                $(content).show();
            }
            else {
                $(content).hide();
            }
        }); 
    });
    
    $("#send_submit").on("click", function submit_form() {
    
        const id = "send";
            console.log(id + ".js script initiated.");
        let email = $("#" + id + "_email").val();
        const template = $("#" + id + "_templates").val();
        const send_var = $("#" + id + "_var").val();
        const send_val = $("#" + id + "_val").val();
        const send_cc = $("#" + id + "_cc").val();
        const send_bcc = $("#" + id + "_bcc").val();
        const send_replyto = $("#" + id + "_replyto").val();
        const send_behalfof = $("#" + id + "_behalfof").val();
    
        if (email == "s") {
            email = "steve@sailthru.com";
        }
        
        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
    
        else if (template == "") {
            alert("Please select a template.");
            return false;
        }
    
        else {
            const data = {};
            data.email = email;
            data.template = template;
    
            if (send_var && send_val) {
                data.var_name = send_var;
                data.var_val = send_val;
            }
            if (send_var && !send_val) {
                alert("Please enter a value for " + send_var + ".");
                return false;
            }
            
            if (!send_var && send_val) {
                alert("Please enter a value for " + send_val + ".");
                return false;
            }
    
            if (send_cc.length > 0 && send_cc.indexOf("@") == -1) {
                alert(send_cc + " is not a valid email address for CC Email.");
                return false;
            }
            else if (send_cc.length > 0) {
                data.cc_val = send_cc;
            }
    
            if (send_bcc.length > 0 && send_bcc.indexOf("@") == -1) {
                alert(send_bcc + " is not a valid email address for BCC Email.");
                return false;
            }
            else if (send_bcc.length > 0) {
                data.bcc_val = send_bcc;
            }
    
            if (send_replyto.length > 0 && send_replyto.indexOf("@") == -1) {
                alert(send_replyto + " is not a valid email address for Reply-To Email.");
                return false;
            }
            else if (send_replyto.length > 0) {
                data.replyto_val = send_replyto;
            }
    
            if (send_behalfof.length > 0 && send_behalfof.indexOf("@") == -1) {
                alert(send_behalfof + " is not a valid email address for Behalf Of Email.");
                return false;
            }
            else if (send_behalfof.length > 0) {
                data.behalfof_val = send_behalfof;
            }
    
        const data_string = JSON.stringify(data);
    
        alert(email + " has been sent " + template);
    
        console.log("Send API running...", data);
    
        $.ajax({
            type: "POST",
            url: "/email",
            data: { id : id, data : data_string }
            });
        }
    });

    $("#user_submit").on("click", function submit_form() {
        
        const id = "user";
            console.log(id + ".js script initiated.");
        const email = $("#" + id + "_email").val();
        const list = $("#" + id + "_lists").val();
        const user_var = $("#" + id + "_var").val();
        const user_val = $("#" + id + "_val").val();
        const user_status = $("#" + id + "_status").val();
    
        const keys_length = document.getElementsByClassName("user_keys");
        const keys = document.querySelectorAll(".user_keys");
    
        let locale = window.navigator.language;
            locale = locale.replace("-","_");
    
        //Easter Ann info
        const img_url = "https://media.sailthru.com/3p0/1k2/6/u/5b37e7eb28e02.png";
        const params = { height: "20em" };
    
        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
    
        else if (list == "") {
            alert("Please enter a list.");
            return false;
        }
    
        else {
            alert(email + " has been added to " + list);
            const data = {};
            data.email = email;
            data.list = list;
            data.status = user_status;
            data.vars = {};
            data.vars.locale = locale;
    
            if (user_var && user_val) {
                data.vars[user_var] = user_val;
            }
            if (user_var && !user_val) {
                alert("Please enter a value for " + user_var + ".");
                return false;
            }
            if (!user_var && user_val) {
                alert("Please enter a value for " + user_val + ".");
                return false;
            }
    
            if (user_var.toLowerCase() == "old" && user_val.toLowerCase() == "school") {
                $("#logo").attr("src", img_url).animate(params);
            }
    
            if (keys_length.length > 0) {
                data.keys = {};
                keys.forEach(key => {
                    if (key.value != "") {
                        if (key.name == "sms") {
                            let phone_code;
                                phone_code = "+" + key.value;
                            data.keys[key.name] = phone_code;
                        }
                        else {
                            data.keys[key.name] = key.value;
                        }
                    }
                }); 
            }
    
            const data_string = JSON.stringify(data);
            
            console.log("User API running...", data);
            
            $.ajax({
                type: "POST",
                url: "/email",
                data: { id : id, data : data_string }
            });
        }
    });
    
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
    
    $("#event_submit").on("click", function submit_form() {

        const id = "event";
            console.log(id + ".js script initiated.");
        const email = $("#" + id + "_email").val();
        const event = $("#" + id + "_name").val();
        const event_var = $("#" + id + "_var").val();
        const event_val = $("#" + id + "_val").val();
    
        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
        if (!event) {
            alert("Please enter an event name.");
            return false;
        }
        else {
            const data = {};
            data.email = email;
            data.event = event;
    
            if (event_var && event_val) {
                data.var_name = event_var;
                data.var_val = event_val;
            }
            if (event_var && !event_val) {
                alert("Please enter a value for " + event_var + ".");
                return false;
            }
            if (!event_var && event_val) {
                alert("Please enter a value for " + event_val + ".");
                return false;
            }
        const data_string = JSON.stringify(data);
    
        alert(email + " has been triggered event: " + event);
    
        console.log("Event API running...", data);
    
        $.ajax({
            type: "POST",
            url: "/email",
            data: { id : id, data : data_string }
            });
        }
    });

    $(".content_submit").on("click", function submit_form() {

        const id = "content";
            console.log(id + ".js script initiated.");
        const url = $("#" + id + "_url").val();
        const title = $("#" + id + "_title").val();
        const tags = $("#" + id + "_tags").val();
        const image = $("#" + id + "_image").val();
        const publish_date = $("#" + id + "_date").val();
        const expire_date = $("#" + id + "_expire").val();
        const price = $("#" + id + "_price").val();
        const site = $("#" + id + "_site").val();
        const location = $("#" + id + "_location").val();
        const author = $("#" + id + "_author").val();
        const content_var = $("#" + id + "_var").val();
        const content_val = $("#" + id + "_val").val();
        const tag_name = [];
        tag_name.push("academy-days");
    
        if (!url) {
            alert("Please enter a URL.");
            return false;
        }
    
        if (this.id == "publish_submit" && !title) {
            alert("Please enter a title.");
            return false;
        }
    
        else {
            const data = {};
            data.url = url;
            data.title = title;
    
            if (content_var && content_val) {
                data.var_name = content_var;
                data.var_val = content_val;
            }
    
            if (image) {
                data.image = image;
            }
    
            if (publish_date) {
                data.publish_date = publish_date;
            }
    
            if (expire_date) {
                data.expire_date = expire_date;
            }
    
            if (price) {
                data.price = price;
            }
    
            if (site) {
                data.site = site;
            }
    
            if (author) {
                data.author = author;
            }
    
            if (location) {
                data.location = location.split(",");
            }
    
            if (this.id == "publish_submit" && content_var && !content_val) {
                alert("Please enter a value for " + content_var + ".");
                return false;
            }
    
            if (this.id == "publish_submit" && !content_var && content_val) {
                alert("Please enter a value for " + content_val + ".");
                return false;
            }
    
            if (this.id == "publish_submit")  {
                alert(url + " has been published!");
                data.content_type = "publish";
            }
            else if (this.id == "respider_submit") {
                alert(url + " has been respidered!");
                data.content_type = "respider";
            }
    
            if (tags) {
                data.tags = tags.split(",").concat(tag_name);
            }
            else {
                data.tags = tag_name;
            }
    
    
            const data_string = JSON.stringify(data);
    
            console.log("Content API running...", data);
            
            $.ajax({
                type: "POST",
                url: "/email",
                data: { id : id, data : data_string }
            });
        }
    });

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
    
    $("#browse_submit").on("click", function submit_form() {
        const id = "browse";
            console.log(id + ".js script initiated.");
        const base_url = "http://links.stevedoesitall.com/join/";
        const email = $("#" + id + "_email").val();
        const new_window = base_url + id;
    
        if (email == "") {
            alert("Please enter an email address.");
            return false;
        }
        else if (email.indexOf("@") == -1) {
            alert(email + " is not a valid email address.");
            return false;
        }
    
        else {
            alert(email + " has browse abandoned!");
            const data = {};
            data.email = email;
    
            const data_string = JSON.stringify(data);
            
            console.log("Browse Abandon running...", data);
            
            $.ajax({
                type: "POST",
                url: "/email",
                data: { id : id, data : data_string },
                success: function(data) { 
                    const user_cookie = data.keys.cookie;
                    window.open(new_window + "?cookie=" + user_cookie, "_blank");
                }
            });
        }
    });    

});