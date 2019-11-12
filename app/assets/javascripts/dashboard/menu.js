(function () {

    const IS_OPENED = 'is-opened';

    /**
     *
     * @param elem
     */
    function attachCollapse(elem) {
        elem.addEventListener('click', function () {
            if (elem.classList.contains(IS_OPENED)) {
                elem.nextElementSibling.classList.remove(IS_OPENED);
                elem.classList.remove(IS_OPENED);
            }
            else {
                elem.nextElementSibling.classList.add(IS_OPENED);
                elem.classList.add(IS_OPENED);
            }
        })
    }

    let items = document.getElementsByClassName('collapse-button');
    let item;
    for (let i = 0; i < items.length; i++) {
        item = items.item(i);
        attachCollapse(item);
    }


    //
    App.Helpers.disableLink(document.getElementById('dashboard_stats_session_recording_path'));
})();