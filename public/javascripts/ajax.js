let del_button = document.querySelector('[data-id]');

if (del_button) {
    del_button.addEventListener('click', (e)=>{
        e.preventDefault();
        let data_id = del_button.getAttribute("data-id");

        var XHR = new XMLHttpRequest();
        XHR.open("DELETE", "/articles/" + data_id, true);
        XHR.onreadystatechange = function (e) {
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    console.log('[kg] DELETED: ' + XHR.responseText)
                    window.location.href='/articles';
                } else {
                    console.log("[kg] Error:", XHR.statusText);
                }
            }
        };
        XHR.send(null);


    })
}
