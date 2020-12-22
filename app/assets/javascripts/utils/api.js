App.Api = {
    get(url, data, options) {
        // prevent null values for callback function
        options = options || {};
        data = typeof (data) === typeof ("") ? data : App.Helpers.serializeObject(data);
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