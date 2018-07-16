//Initializing event API
const data_post = (data) => { 

    console.log("Event API running...", data);

    const data_parse = JSON.parse(data);
    const api_key = data_parse.api_key;
    const api_secret = data_parse.api_secret;
    const api_params = {};
        api_params.id = data_parse.email;
        api_params.event = data_parse.event;

    if (data_parse.var_name) {
        api_params.vars = {};
            api_params.vars[data_parse.var_name] = data_parse.var_val;
    }

    //Sailthru variables
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

    sailthru.apiPost("event", 
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