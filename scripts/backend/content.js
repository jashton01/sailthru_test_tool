//Initializing Content API
const data_post = (data) => { 

    console.log("Content API running...", data);

    const data_parse = JSON.parse(data);   
    const api_key = data_parse.api_key;
    const api_secret = data_parse.api_secret;
    const content_type = data_parse.content_type;
    const api_params = {};
        api_params.id = data_parse.url;

    if (content_type == "publish") {
        api_params.title = data_parse.title;
        api_params.keys = {};
            api_params.keys.sku = "SKU" + Math.random().toString(36).substr(2,9);
            
        if (data_parse.var_name) {
            api_params.vars = {};
                api_params.vars[data_parse.var_name] = data_parse.var_val;
        }

        if (data_parse.tags) {
            api_params.tags = data_parse.tags;
        }

        if (data_parse.publish_date) {
            api_params.date = data_parse.publish_date;
        }

        if (data_parse.expire_date) {
            api_params.expire_date = data_parse.expire_date;
        }

        if (data_parse.price) {
            api_params.price = data_parse.price;
        }

        if (data_parse.site) {
            api_params.site_name = data_parse.site;
        }

        if (data_parse.author) {
            api_params.author = data_parse.author;
        }

        if (data_parse.location) {
            api_params.location = data_parse.location;
        }

        if (data_parse.image) {
            api_params.images = {};
                api_params.images.thumb = {};
                    api_params.images.thumb.url = data_parse.image;
        }
    }

    else if (content_type == "respider") {
        api_params.spider = 1;
    }

    //Sailthru variables
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);

    sailthru.apiPost("content", 
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