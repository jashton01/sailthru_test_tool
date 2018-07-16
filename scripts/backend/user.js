//Initializing user API
const data_post = (data) => { 

    console.log("User API running...", data);
    
    const data_parse = JSON.parse(data);
    const api_key = data_parse.api_key;
    const api_secret = data_parse.api_secret;
    const api_params = {};
        api_params.id = data_parse.email;
        api_params.vars = data_parse.vars;
        api_params.lists = {};
            api_params.lists[data_parse.list] = 1;
        api_params.optout_email = data_parse.status;

    if (data_parse.keys) {
        api_params.keys = data_parse.keys;
    }

    //Sailthru variables
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

    sailthru.apiPost("user", 
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