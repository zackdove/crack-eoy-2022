export default function initialiseMenu(webgl) {


    const cardContainer = document.getElementById('cardContainer');

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
        webgl.canvas.addEventListener('pointerdown', hideMenu)
        cardContainer.addEventListener('pointerdown', hideMenu)
    }

    function hideMenu() {
        isShowing = false;
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.classList.add('hidden')
        const cardContainerContainer = document.getElementById('cardContainerContainer');
        cardContainerContainer.classList.add('hidden')
        const menuButton = document.getElementById('menuButton');
        menuButton.classList.remove('inMenu');
        webgl.canvas.removeEventListener('pointerdown', hideMenu)
        cardContainer.removeEventListener('pointerdown', hideMenu)
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

    webgl.toggleMenu = toggleMenu;

    const cardSources = [
        "/assets/images/cards/pink.svg",
        "/assets/images/cards/purple.svg",
        "/assets/images/cards/green.svg",
        "/assets/images/cards/yellow.svg",
        "/assets/images/cards/red.svg",
        "/assets/images/cards/grey.svg",
    ]


    for (let i = 0; i < gridConfig.projects.length; i++) {
        const card = document.createElement('div');
        card.classList.add('card');

       
       
        
        if (!gridConfig.projects[i].enabled) card.classList.add('disabled');
      
        card.onclick = () => {
            window.location.href = gridConfig.projects[i].link
        }
        cardContainer.appendChild(card)
       

        cardInner = document.createElement('div');
        card.appendChild(cardInner);
        cardInner.classList.add('cardInner')
        cardInner.innerHTML = gridConfig.projects[i].title;

        const cardBg = document.createElement('img');
        cardBg.src = cardSources[i %cardSources.length ]
        cardBg.classList.add('cardBg')
        cardInner.appendChild(cardBg)
    }

    const topBanner = document.querySelector('#topBanner>.bannerInner');
    const bottomBanner = document.querySelector('#bottomBanner>.bannerInner');
    const topBannerWhite = document.querySelector('#topBannerWhite>.bannerInner');
    const bottomBannerWhite = document.querySelector('#bottomBannerWhite>.bannerInner');
    let x = 0;

    webgl.onUpdate((dt, time) => {
        // console.log('kyubey')
        x += dt * 4;
        if (x > 50) x = 0;
        topBanner.style.transform = 'translateX(' + -x + '%)';
        topBannerWhite.style.transform = 'translateX(' + -x + '%)';
        bottomBanner.style.transform = 'translateX(' + (x - 50) + '%)';
        bottomBannerWhite.style.transform = 'translateX(' + (x - 50) + '%)';
    })


}