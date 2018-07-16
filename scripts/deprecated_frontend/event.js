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
