run_ajax = ( function() {

    const status = "active";
    const user_lists = [];
    const non_master_lists = [];
    const master_lists = [];
    const master_lists_sorted = [];
    const list_convention = "Master List ";
    const list_length = list_convention.length;
    let all_lists;

    $.ajax({
        type: "POST",
        url: "/email",
        data: { id : "lists", data : "{}" },
        success: function(data) {
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
} () );

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
