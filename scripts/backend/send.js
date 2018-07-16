//Initializing send API
const data_post = (data) => { 

    console.log("Send API running...", data);

    const data_parse = JSON.parse(data);
    const api_key = data_parse.api_key;
    const api_secret = data_parse.api_secret;
    const api_params = {};
        api_params.options = {};
            api_params.options.headers = {};
        api_params.email = data_parse.email;
        api_params.template = data_parse.template;

    if (data_parse.var_name) {
        api_params.vars = {};
            api_params.vars[data_parse.var_name] = data_parse.var_val;
    }

    if (data_parse.cc_val) {
        api_params.options.headers.Cc = data_parse.cc_val;
    }

    if (data_parse.bcc_val) {
        api_params.options.headers.Bcc = data_parse.bcc_val;
    }

    if (data_parse.replyto_val) {
        api_params.options.replyto = data_parse.replyto_val;
    }

    if (data_parse.behalfof_val) {
        api_params.options.behalf_email = data_parse.behalfof_val;
    }

    //Sailthru variables
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

    sailthru.apiPost("send", 
        api_params, 
        function(err,response) {
            if (err) {
                console.log(err);
            }
            else if (response) {
                console.log(response);
            }
        }
    );
}

module.exports = {
    data_post
};
