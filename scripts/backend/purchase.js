//Initializing Purchase API
const data_post = (data) => { 

    console.log("Purchase API running...", data);

    const data_parse = JSON.parse(data);
    const api_key = data_parse.api_key;
    const api_secret = data_parse.api_secret;
    const returned = data_parse.returned;
    const api_params = {};
        if (data_parse.cart_empty == true) {
            api_params.email = data_parse.email;
            api_params.items = [];
            api_params.incomplete = 1;
        }
        else {
            api_params.email = data_parse.email;
            api_params.items = [];
            api_params.vars = {};
            api_params.purchase_keys = {};
                api_params.purchase_keys.extid = "ORD" + Math.random().toString(36).substr(2,9);
            api_params.incomplete = parseInt(data_parse.incomplete);
            api_params.items.push({"url" : data_parse.url, "title": data_parse.title, "qty" : parseInt(data_parse.qty), "price" : parseInt(data_parse.price), "id" : "SKU" + Math.random().toString(36).substr(2,9) })

            api_params.vars["st_cost"] = (parseInt(data_parse.qty) * parseInt(data_parse.price));

            if (data_parse.var_name) {
                api_params.items[0].vars = {};
                    api_params.items[0].vars[data_parse.var_name] = data_parse.var_val;
            }

            if (data_parse.tags) {
                api_params.items[0].tags = data_parse.tags;
            }

            if (data_parse.image) {
                api_params.items[0].images = {};
                    api_params.items[0].images.thumb = {};
                        api_params.items[0].images.thumb.url = data_parse.image;
            }

            if (data_parse.adjustments) {
                const adjustments_array = data_parse.adjustments;
                api_params.adjustments = [];
                adjustments_array.forEach(adjustment => {
                    api_params.adjustments.push({title: adjustment.name, price: parseInt(adjustment.price)});
                    api_params.vars["st_cost"] = api_params.vars["st_cost"] + parseInt(adjustment.price);
                });
            }

            if (data_parse.ordervar) {
                api_params.vars[data_parse.ordervar] = data_parse.orderval;
            }

            if (data_parse.messageid) {
                api_params.message_id = data_parse.messageid;
            }
        }

    //Sailthru variables
    const sailthru = require("sailthru-client").createSailthruClient(api_key, api_secret);
    
    if (returned == false) {
        sailthru.apiPost("purchase", 
            api_params, 
            function(err,response) {
                if (err) {
                    console.log(err);
                }
                else if (response) {
                    console.log(response);
                }
            });
        }
    else {
        sailthru.apiPost("return", 
            api_params, 
            function(err,response) {
                if (err) {
                    console.log(err);
                }
                else if (response) {
                    console.log(response);
                }
            });
        }
    }
    


module.exports = {
    data_post
};