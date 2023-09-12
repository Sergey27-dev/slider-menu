class SwiperMenu
{
    #element;
    #rootListElement;
    #triggerElement;
    #backElement;
    #backElementText;

    #options = {
        trigger: '>',
        back: '<-'
    }


    constructor(element, options) {
        this.#element = element;
        this.init();
    }

    init() {
        this.#rootListElement = this.findFirstList();
        this.setRootClasses();
        this.initTriggerELement();
        this.initBackElement();
        this.findListItem(this.#rootListElement);
        this.initListElementEvents();
    }

    findList(listElement) {
        return listElement.getElementsByTagName('ul')[0];
    }

    findListItem(wrapper) {
        const elements = Array.from(wrapper.children)
            .filter((element) => element.nodeName.toLowerCase() === 'li');

        elements.forEach(element => {
            element.classList.add('swiper-menu-element');
            const list = this.findList(element);
            if(list) {
                element.classList.add('swiper-menu-has-children');
                list.classList.add('swiper-menu-submenu', 'swiper-menu-slide')
                element.append(this.#triggerElement.cloneNode(true));
                this.findListItem(list);
            }
        })
    }

    initListElementEvents() {
        const listElements = Array.from(this.#element.getElementsByClassName('swiper-menu-trigger'));
        listElements.forEach((element) => {
            element.addEventListener('click', (event) => {
                const trigger = event.target;
                trigger.parentElement.parentElement.classList.add('open');
                const title = Array.from(element.parentElement.children)
                    .filter(element => ['span', 'a'].includes(element.nodeName.toLowerCase()))
                    .shift()
                    .textContent;
                this.#backElementText.textContent = title;
            })

        })

        Array.from(this.#rootListElement.children)
            .filter(element => element.nodeName.toLowerCase() === 'li')
            .forEach(element => {
                element.addEventListener('click', event => {
                    this.#backElement.classList.add('show');
                })
            })

        this.#backElement.addEventListener('click', (event) => {
            const listElements = Array.from(this.#element.querySelectorAll('.swiper-menu-slide.open'));
            if(listElements.length === 1) {
                this.#backElement.classList.remove('show');
            }
            const lastElement = listElements.pop();
            console.log(lastElement)
            this.#backElementText.textContent = lastElement.previousElementSibling.textContent;
            lastElement.classList.remove('open');
        })
    }

    initTriggerELement() {
        const trigger = document.createElement('div');
        trigger.classList.add('swiper-menu-trigger');
        trigger.innerHTML = this.#options.trigger;
        this.#triggerElement = trigger;
    }

    initBackElement() {
        const back = document.createElement('div');
        back.classList.add('swiper-menu-back');
        const backIcon = document.createElement('span');
        backIcon.innerHTML = this.#options.back;
        const backText = document.createElement('div');
        backText.classList.add('swiper-menu-back-text');
        back.append(backIcon);
        back.append(backText);
        this.#backElementText = backText;
        this.#backElement = back;
        this.#element.prepend(back);
    }

    findFirstList() {
        return this.#element.getElementsByTagName('ul')[0];
    }

    setRootClasses() {
        this.#rootListElement.classList.add('swiper-menu-root', 'swiper-menu-slide')
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const element = document.getElementById('menu');
    const menu = new SwiperMenu(element)

});

