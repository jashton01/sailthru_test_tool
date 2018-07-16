run_ajax = ( function() {

    $.ajax({
        type: "POST",
        url: "/email",
        data: { id : "templates", data : "{}" },
        success: function(data) {
            const label = "testers";
            const send_templates = [];
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
            console.log(send_templates)
            send_templates.forEach(template => {
                const template_name = template.name;
                $("#send_templates").append('<option value="'+ template_name + '">' + template_name + "</option>");
            });
        }
    });
    const retr_message = document.getElementById("retr_message");
    if (retr_message != null) {
        retr_message.parentNode.removeChild(retr_message);
        $("#send_dropdown").removeClass("dropdown");
    }
} () );

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