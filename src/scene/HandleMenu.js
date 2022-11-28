export default function initialiseMenu(webgl) {
    const menuButton = document.getElementById('menuButton');
    function showMenu() {

    }
    let isShowing = false;


    function showMenu() {
        isShowing = true;
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.classList.remove('hidden')
        const cardContainerContainer = document.getElementById('cardContainerContainer');
        cardContainerContainer.classList.remove('hidden')
        const menuButton = document.getElementById('menuButton');
        menuButton.classList.add('inMenu');
    }

    function hideMenu() {
        isShowing = false;
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.classList.add('hidden')
        const cardContainerContainer = document.getElementById('cardContainerContainer');
        cardContainerContainer.classList.add('hidden')
        const menuButton = document.getElementById('menuButton');
        menuButton.classList.remove('inMenu');
    }


    function toggleMenu() {
        if (isShowing) {
            hideMenu()
        }
        else {
            showMenu()
        }
    }

    menuButton.onclick = toggleMenu;

    webgl.canvas.addEventListener('click', hideMenu)

}