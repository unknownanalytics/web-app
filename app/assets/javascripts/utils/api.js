App.Api = {
    get(url, data, options) {
        // prevent null values for callback function
        options = options || {};
        //
        Rails.ajax({
            url: url,
            type: "get",
            data: data,
            dataType: 'json',
            success: options.success,
            error: options.error
        });
    }
};