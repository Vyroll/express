let links = document.querySelectorAll('nav ul li span');

links.forEach(link => {
    link.addEventListener('click', ()=>{
        links.forEach(link2 => {
            link2.classList.remove("active")
        });
        link.classList.add("active");
    });
});

let expand = document.getElementById("expand");

expand.addEventListener('click', ()=>{
    let navig__con = document.querySelectorAll(".navig__con");

    navig__con.forEach(con => {
        let style = con.style

        if (!style.display || style.display === "none") {
            style.display = "flex";
        } else {
            style.display = "none";
        }
    });

})

window.onresize = ()=>{
    if (window.innerWidth>=800) {
        let navig__con = document.querySelectorAll(".navig__con")
        navig__con.forEach(con => {
            con.style.display = "flex";
        });
    } else {
        let navig__con = document.querySelectorAll(".navig__con")
        navig__con.forEach(con => {
            con.style.display = "none";
        });
    }
}