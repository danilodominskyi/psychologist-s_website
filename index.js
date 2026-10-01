console.log("JS працює!");


function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.hidden = true;
    });

    document.getElementById(pageId).hidden = false;
}
