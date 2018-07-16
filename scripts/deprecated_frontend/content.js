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