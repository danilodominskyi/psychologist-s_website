console.log("JS працює!");







function showPage(pageId) {

    const targetPage = document.getElementById(pageId);

    if (!targetPage) {
        console.warn("Сторінку не знайдено:", pageId);
        return;
    }

    // 1. Приховуємо всі сторінки
    document.querySelectorAll(".page").forEach(page => {
        page.hidden = true;
    });

    // 2. Показуємо потрібну сторінку
    targetPage.hidden = false;

    // 3. Оновлюємо підсвічування меню
    document.querySelectorAll(".psy-menu button").forEach(button => {

        const isActive =
            button.getAttribute("onclick") === `showPage('${pageId}')`;

        button.classList.toggle("psy-active", isActive);

        if (isActive) {
            button.setAttribute("aria-current", "page");
        } else {
            button.removeAttribute("aria-current");
        }

    });

    // 4. Прокручуємо сторінку догори
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });
}



let articleTrigger = null;
let articlePreviousOverflow = "";



function openArticle(articleId) {
    const article = articles.find(item => item.id === Number(articleId));
    if (!article) return;

    const modal = document.getElementById("articleModal");
    if (!modal) return;

    if (modal.style.display !== "flex") {
        articleTrigger = document.activeElement;
        articlePreviousOverflow = document.body.style.overflow;
    }

    document.getElementById("articleModalCategory").textContent =
        article.category || "Поради";

    document.getElementById("articleModalTitle").textContent =
        article.title || "";

    document.getElementById("articleModalReadingTime").textContent =
        article.readingTime || "";

    document.getElementById("articleModalDescription").textContent =
        article.subtitle || article.description || "";

    const header = modal.querySelector(".article-header");

    if (header) {
        header.style.removeProperty("background-image");
    }

    const sectionsContainer =
        document.getElementById("articleModalSections");

    sectionsContainer.replaceChildren();

    const sections = Array.isArray(article.sections)
        ? article.sections
        : [];

    const defaultIcons = ["☕", "♡", "🌱", "☀️", "🌿", "✨"];

    sections.forEach((section, index) => {
        const block = document.createElement("section");
        block.className = "article-section";

        const icon = document.createElement("span");
        icon.className = "article-section-icon";
        icon.textContent =
            section.icon || defaultIcons[index % defaultIcons.length];
        icon.setAttribute("aria-hidden", "true");

        const content = document.createElement("div");

        const headingRow = document.createElement("div");
        headingRow.className = "article-section-heading";

        const number = document.createElement("span");
        number.className = "article-section-number";
        number.textContent = index + 1;
        number.setAttribute("aria-hidden", "true");

        const heading = document.createElement("h3");
        const title = String(section.title || "").trim();

        // Якщо title = "1", "2", "3", не повторюємо цифру
        heading.textContent = /^\d+$/.test(title)
            ? ""
            : title;

        if (!heading.textContent) {
            heading.style.display = "none";
        }

        headingRow.append(number, heading);

        const paragraph = document.createElement("p");
        paragraph.textContent = section.text || "";

        content.append(headingRow, paragraph);
        block.append(icon, content);
        sectionsContainer.appendChild(block);
    });

    // Правий блок завжди присутній
    const stepsContainer = document.getElementById("articleModalSteps");
    stepsContainer.replaceChildren();

    const fallbackSteps = [
        "Зробіть невеликий крок",
        "Знайдіть час для себе",
        "Зверніться по підтримку за потреби"
    ];

    const steps = Array.isArray(article.steps) && article.steps.length
        ? article.steps
        : fallbackSteps;

    steps.forEach(step => {
        const item = document.createElement("li");
        item.textContent = step;
        stepsContainer.appendChild(item);
    });

    const side = modal.querySelector(".article-side");
    side.hidden = false;

    const quote = document.getElementById("articleModalQuote");
    quote.textContent = article.quote || "";
    quote.hidden = !article.quote;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    const dialog = modal.querySelector(".article-modal");
    dialog.scrollTop = 0;
    dialog.focus({ preventScroll: true });
}



function closeArticle() {
    const modal = document.getElementById("articleModal");

    if (modal.style.display !== "flex") return;

    modal.style.display = "none";
    document.body.style.overflow = articlePreviousOverflow;

    if (articleTrigger instanceof HTMLElement) {
        articleTrigger.focus({ preventScroll: true });
    }
}

// Додай ці обробники лише один раз.
document.getElementById("articleModal").addEventListener("click", event => {
    if (event.target.id === "articleModal") {
        closeArticle();
    }
});

document.getElementById("articleModal").addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeArticle();
        return;
    }

    if (event.key !== "Tab") return;

    const buttons = [
        ...event.currentTarget.querySelectorAll("button:not([disabled])")
    ];

    const first = buttons[0];
    const last = buttons[buttons.length - 1];

    if (event.shiftKey && (
        document.activeElement === first ||
        document.activeElement === event.currentTarget.querySelector(".article-modal")
    )) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});


let window_advice_cards = [ ];

let window_advice_card = {
    whom: '',
}


const articles = [
    // {
    //     id: 1,

    //     category: "Учням",
    //     categoryClass: "student",

    //     title: "Як справлятися зі стресом у підлітковому віці",

    //     description: "Прості способи знизити напруження та краще впоратися з переживаннями.",

    //     readingTime: "5 хв читання",

    //     quote: "Стрес — це нормально. Головне — вчасно помічати його та дбати про себе.",

        
    //     steps: [
    //         "Зробіть невелику перерву",
    //         "Поговоріть про свої переживання",
    //         "Знайдіть час для відпочинку"
    //     ],


    //     sections: [
    //         {
    //             title: "Що таке стрес?",
    //             text: "Стрес — це природна реакція нашого організму на складні або незвичні ситуації."
    //         },

    //         {
    //             title: "Як зрозуміти, що ви відчуваєте стрес?",
    //             text: "Стрес може проявлятися по-різному: втомою, проблемами зі сном або складністю зосередитися."
    //         },

    //         {
    //             title: "Що може допомогти?",
    //             text: "Відпочинок, фізична активність та спілкування можуть допомогти знизити рівень напруження."
    //         }
    //     ]
    // },
    {
        id: 2,

        category: "Батькам",
        categoryClass: "parents",

        title: "Дбайте про себе",

        description:
            "Турбота про власний стан допомагає батькам бути уважнішими до потреб дитини.",

        subtitle:
            "Ваш спокій — важлива частина підтримки дитини.",

        readingTime: "2 хв читання",

        quote:
            "Не потрібно бути ідеальними. Важливо бути уважними й готовими змінюватися.",

        steps: [
            "Зробіть паузу",
            "Попросіть підтримки",
            "Знайдіть час для себе"
        ],

        sections: [
            {
                icon: "☕",
                title: "1",
                text: "Не вимагайте від себе бездоганності. Якщо ви помилилися, визнайте це, за потреби перепросіть дитину та подумайте, що наступного разу можна зробити інакше."
            },
            {
                icon: "♡",
                title: "2",
                text:
                    "Не вимагайте від себе бездоганності. Визнайте помилку, перепросіть дитину за потреби й подумайте, що наступного разу можна зробити інакше."
            },
            {
                icon: "🌱",
                title: "3",
                text:
                    "Підтримуйте інтереси дитини, залишаючи їй простір для власного вибору. Ваші мрії та очікування важливі, але дитина має право на свій шлях."
            }
        ],

        image: "img/card-2.png",
    },
    // {
    //     id: 3,

    //     category: "Педагогам",
    //     categoryClass: "teachers",

    //     title: "Поради для вчителів: як зрозуміти дитину",

    //     description: "прості стособи повпливати на дитину",

    //     readingTime: "6 хв читання",

    //     quote: "Стрес — це нормально. Головне — вчасно помічати його та дбати про себе.",

        
    //     steps: [
    //         "Уважно вислухайте дитину",
    //         "Підтримайте її без осуду",
    //         "Створюйте атмосферу довіри"
    //     ],


    //     sections: [
    //         {
    //             title: "Що таке стрес?",
    //             text: "Стрес — це природна реакція нашого організму на складні або незвичні ситуації."
    //         },

    //         {
    //             title: "Як зрозуміти, що ви відчуваєте стрес?",
    //             text: "Стрес може проявлятися по-різному: втомою, проблемами зі сном або складністю зосередитися."
    //         },

    //         {
    //             title: "Що може допомогти?",
    //             text: "Відпочинок, фізична активність та спілкування можуть допомогти знизити рівень напруження."
    //         }
    //     ]
    // },
    // {
    //     id: 4,

    //     category: "Учням",
    //     categoryClass: "student",

    //     title: "як справитись зі стресом перед контрольною",

    //     description: "легкі способи правильниї підготовки",

    //     readingTime: "2 хв читання",

    //     quote: "Стрес — це нормально. Головне — вчасно помічати його та дбати про себе.",

        
    //     steps: [
    //         "Повторіть основні теми",
    //         "Зробіть перерву перед контрольною",
    //         "Подбайте про повноцінний сон"
    //     ],


    //     sections: [
    //         {
    //             title: "Що таке стрес?",
    //             text: "Стрес — це природна реакція нашого організму на складні або незвичні ситуації."
    //         },

    //         {
    //             title: "Як зрозуміти, що ви відчуваєте стрес?",
    //             text: "Стрес може проявлятися по-різному: втомою, проблемами зі сном або складністю зосередитися."
    //         },

    //         {
    //             title: "Що може допомогти?",
    //             text: "Відпочинок, фізична активність та спілкування можуть допомогти знизити рівень напруження."
    //         }
    //     ]
    // },
];

const articlesContainer = document.getElementById("articlesContainer");

function showArticles(articlesToShow) {

    // Спочатку очищаємо всі картки
    articlesContainer.innerHTML = "";

    // Створюємо тільки ті, які передали у функцію
    articlesToShow.forEach(function(article) {

        articlesContainer.innerHTML += `
            <div class="window_advice_card">

                <div class="window_advice_card-img"
                    style="${article.image
                        ? `background-image: url('${article.image}');`
                        : ''}">
                </div>

                <div class="window_advice_card-info">

                    <p class="window_advice_card-category ${article.categoryClass}">
                        ${article.category}
                    </p>

                    <h3>
                        ${article.title}
                    </h3>

                    <p class="window_advice_card-description">
                        ${article.description}
                    </p>

                    <div class="window_advice_card-bottom">

                        <p>${article.readingTime}</p>

                        <button onclick="openArticle(${article.id})">
                            Читати →
                        </button>

                    </div>

                </div>

            </div>
        `;
    });
}


// При першому запуску показуємо ВСІ
showArticles(articles);



const filterButtons = document.querySelectorAll(
    ".window_advice_filter-button"
);

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        // Забираємо active у всіх
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Додаємо active натиснутій
        this.classList.add("active");


        // Беремо назву натиснутої кнопки
        const selectedCategory = this.textContent.trim();


        // Якщо натиснули "Усі"
        if (selectedCategory === "Усі") {

            showArticles(articles);

        } else {

            // Фільтруємо масив
            const filteredArticles = articles.filter(function(article) {

                return article.category === selectedCategory;

            });

            // Показуємо тільки відфільтровані
            showArticles(filteredArticles);
        }

    });

});



// МАСИВ ПОДІЙ

const events = [
    {
        id: 1,

        category: "Учні",
        categoryClass: "student",

        date: "24 вересня 2026",

        title: "Тренінг для учнів 8 класу «Впевненість у собі»",

        description: "Учні взяли участь у тренінгу, присвяченому розвитку впевненості в собі та вмінню висловлювати власну думку.",

        fullDescription: "Під час тренінгу учні 8 класу дізналися, що таке впевненість у собі та як її розвивати.\n\nУчасники виконували цікаві вправи, працювали в командах і ділилися власними думками.\n\nЗахід пройшов у дружній атмосфері.",

        image: "",

        photos: []
    },

    {
        id: 2,

        category: "Батьки",
        categoryClass: "parents",

        date: "15 вересня 2026",

        title: "Зустріч з батьками «Як порозумітися з підлітком»",

        description: "Обговорення важливих питань спілкування між батьками та підлітками.",

        fullDescription: "Відбулася зустріч із батьками, присвячена особливостям підліткового віку.\n\nОбговорили способи побудови довірливих стосунків, вирішення конфліктів та емоційної підтримки дітей.",

        image: "",

        photos: []
    },

    {
        id: 3,

        category: "Педагоги",
        categoryClass: "teachers",

        date: "5 вересня 2026",

        title: "Семінар для педагогів «Психологічний клімат класу»",

        description: "Практичні рекомендації щодо створення комфортної атмосфери в класі.",

        fullDescription: "Для педагогів проведено семінар, присвячений психологічному клімату в класному колективі.\n\nУчасники обговорили методи підтримки учнів, профілактики конфліктів та формування позитивної атмосфери.",

        image: "",

        photos: []
    }
];


// КОНТЕЙНЕР КАРТОК

const eventsContainer = document.getElementById("eventsContainer");


// ПОКАЗ КАРТОК

function showEvents(eventsToShow) {

    eventsContainer.innerHTML = "";

    eventsToShow.forEach(function(event) {

        const card = document.createElement("div");
        card.className = "window_events_card";

        const image = document.createElement("div");
        image.className = "window_events_card-img";

        if (event.image) {
            const img = document.createElement("img");
            img.src = event.image;
            img.alt = event.title;
            image.appendChild(img);
        }

        const info = document.createElement("div");
        info.className = "window_events_card-info";

        const date = document.createElement("p");
        date.className = "window_events_card-date";
        date.textContent = event.date;

        const title = document.createElement("h3");
        title.textContent = event.title;

        const description = document.createElement("p");
        description.className = "window_events_card-description";
        description.textContent = event.description;

        const bottom = document.createElement("div");
        bottom.className = "window_events_card-bottom";

        const category = document.createElement("span");
        category.className = "window_events_card-category " + event.categoryClass;
        category.textContent = event.category;

        const button = document.createElement("button");
        button.textContent = "Детальніше →";

        button.addEventListener("click", function() {
            openEvent(event.id);
        });

        bottom.appendChild(category);
        bottom.appendChild(button);

        info.appendChild(date);
        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(bottom);

        card.appendChild(image);
        card.appendChild(info);

        card.addEventListener("click", function(e) {
            if (e.target !== button) {
                openEvent(event.id);
            }
        });

        eventsContainer.appendChild(card);
    });
}


// ПРИ ЗАПУСКУ ПОКАЗУЄМО ВСІ ПОДІЇ

showEvents(events);


// ФІЛЬТРИ

const eventFilterButtons = document.querySelectorAll(
    ".window_events_filter-button"
);

eventFilterButtons.forEach(button => {

    button.addEventListener("click", function() {

        eventFilterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        const selectedCategory = this.textContent.trim();

        if (selectedCategory === "Усі") {

            showEvents(events);

        } else {

            const filteredEvents = events.filter(function(event) {
                return event.category === selectedCategory;
            });

            showEvents(filteredEvents);
        }

    });

});


// ВІДКРИТТЯ МОДАЛЬНОГО ВІКНА

function openEvent(eventId) {

    const selectedEvent = events.find(function(event) {
        return event.id === eventId;
    });

    if (!selectedEvent) {
        return;
    }

    document.getElementById("eventModalDate").textContent =
        selectedEvent.date;

    document.getElementById("eventModalTitle").textContent =
        selectedEvent.title;

    document.getElementById("eventModalDescription").textContent =
        selectedEvent.fullDescription;


    // ГОЛОВНА ФОТОГРАФІЯ

    const modalImg = document.getElementById("eventModalImg");

    modalImg.innerHTML = "";

    if (selectedEvent.image) {

        const img = document.createElement("img");
        img.src = selectedEvent.image;
        img.alt = selectedEvent.title;

        modalImg.appendChild(img);
    }


    // ГАЛЕРЕЯ

    const gallery = document.getElementById("eventModalGallery");

    gallery.innerHTML = "";

    selectedEvent.photos.forEach(function(photo) {

        const img = document.createElement("img");

        img.src = photo;
        img.alt = "Фото з події";

        gallery.appendChild(img);
    });

    const galleryTitle = gallery.previousElementSibling;

    galleryTitle.hidden = selectedEvent.photos.length === 0;

    document.getElementById("eventModal").style.display = "flex";

    document.body.style.overflow = "hidden";
}


// ЗАКРИТТЯ МОДАЛЬНОГО ВІКНА

function closeEvent() {

    document.getElementById("eventModal").style.display = "none";

    document.body.style.overflow = "";
}


// ЗАКРИТТЯ ПРИ НАТИСКАННІ НА ФОН

document.getElementById("eventModal").addEventListener("click", function(event) {

    if (event.target === this) {
        closeEvent();
    }

});


// ЗАКРИТТЯ ЧЕРЕЗ ESC

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeEvent();
    }

});








const messages = [];

const form = document.getElementById("psychologistForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const classAge = document.getElementById("classAge").value;
    const message = document.getElementById("message").value;

    const role = document.querySelector(
        'input[name="role"]:checked'
    ).value;

    const newMessage = {
        id: Date.now(),
        fullName: fullName,
        role: role,
        classAge: classAge,
        message: message,
        createdAt: new Date().toLocaleString()
    };

    // ДОДАЄМО ОБ'ЄКТ У МАСИВ
    messages.push(newMessage);
    form.reset();
    console.log(messages);

});




// АНІМАЦІЯ МОДАЛЬНОГО ВІКНА ПОРАД

const adviceModal = document.getElementById("articleModal");

if (adviceModal) {

    // Відстежуємо відкриття та закриття твоєї модалки
    const adviceModalObserver = new MutationObserver(function() {

        if (adviceModal.style.display === "flex") {

            requestAnimationFrame(function() {
                adviceModal.classList.add("active");
            });

            document.body.style.overflow = "hidden";

        } else {

            adviceModal.classList.remove("active");

            document.body.style.overflow = "";

        }

    });

    adviceModalObserver.observe(adviceModal, {
        attributes: true,
        attributeFilter: ["style"]
    });

}




function openWorkModal() {

    document.getElementById("workModal").style.display = "flex";

}


function closeWorkModal() {

    document.getElementById("workModal").style.display = "none";

}



function openCertificatesModal() {

    document.getElementById("certificatesModal").style.display = "flex";

}


function closeCertificatesModal() {

    document.getElementById("certificatesModal").style.display = "none";

}













// ==========================================
// ЕФЕКТИ САЙТУ
// Старі функції залишаємо без змін
// ==========================================

(function () {

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // Елементи, які будуть плавно з'являтися

    const effectSelectors = [
        ".choice_window_card1",
        ".choice_window_card2",
        ".choice_window_card3",
        ".choice_window_box",
        ".popular_materials_blok",
        ".our_events_blok",
        ".content_topic-card",
        ".content_info-block",
        ".window_advice_card",
        ".window_events_card"
    ].join(", ");

    // Спостерігаємо за появою елементів

    const effectObserver = reducedMotion ? null :
        new IntersectionObserver(function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "effect-visible"
                    );

                    effectObserver.unobserve(
                        entry.target
                    );

                }

            });

        }, {
            threshold: 0.08,
            rootMargin: "0px 0px -20px 0px"
        });


    // Додаємо ефекти до нових елементів

    function prepareEffects() {

        document.querySelectorAll(
            ".page:not(#contact)"
        ).forEach(function (page) {

            const elements = page.querySelectorAll(
                effectSelectors
            );

            elements.forEach(function (element, index) {

                if (element.classList.contains(
                    "effect-reveal"
                )) {
                    return;
                }

                if (reducedMotion) {
                    return;
                }

                element.classList.add(
                    "effect-reveal"
                );

                element.style.setProperty(
                    "--effect-delay",
                    (index % 4) * 65 + "ms"
                );

                effectObserver.observe(element);

            });

        });

    }


    // Підсвічування активного пункту меню

    function updateActiveMenu() {

        const activePage = document.querySelector(
            ".page:not([hidden])"
        );

        document.querySelectorAll(
            ".menu button"
        ).forEach(function (button) {

            button.classList.remove(
                "effect-active"
            );

            if (!activePage) {
                return;
            }

            const onclick = button.getAttribute(
                "onclick"
            );

            if (
                onclick &&
                onclick.includes(
                    "'" + activePage.id + "'"
                )
            ) {

                button.classList.add(
                    "effect-active"
                );

            }

        });

    }


    // Коли перемикаємо сторінки,
    // оновлюємо анімації та меню

    const pages = document.querySelectorAll(".page");

    const pageObserver = new MutationObserver(
        function () {

            prepareEffects();
            updateActiveMenu();

        }
    );

    pages.forEach(function (page) {

        pageObserver.observe(page, {
            attributes: true,
            attributeFilter: ["hidden"]
        });

    });


    // Відстежуємо додавання карток
    // після натискання на фільтри

    const dynamicContainers = [
        "articlesContainer",
        "eventsContainer"
    ];

    const cardObserver = new MutationObserver(
        function () {

            prepareEffects();

        }
    );

    dynamicContainers.forEach(function (id) {

        const container = document.getElementById(id);

        if (container) {

            cardObserver.observe(container, {
                childList: true,
                subtree: true
            });

        }

    });


    // Запуск

    prepareEffects();
    updateActiveMenu();

})();



const pageArticles = {
    students: [12, 1, 2, 2, 1],
    parents: [2, 9, 2, 1, 2],
    teachers: [3, 13, 3, 1, 3]
};

function renderPageArticles(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    const ids = pageArticles[pageId];

    const blocks = page.querySelectorAll(
        ".content_info-blocks-full > .content_info-block-full, " +
        ".content_info-blocks-full > .content_info-block-full-invers"
    );

    blocks.forEach((block, index) => {
        const article = articles.find(
            item => String(item.id) === String(ids[index])
        );

        if (!article) {
            block.style.display = "none";
            return;
        }

        block.style.display = "";

        const number = block.querySelector(".content_info-badge-number");
        const category = block.querySelector(".content_info-badge-text");
        const title = block.querySelector(".content_info-block-title h5");
        const description = block.querySelector(".content_info-block-text p");
        const tips = block.querySelector(".content_info-tips-box");
        const button = block.querySelector(".content_info-button-left");
        const image = block.querySelector(".content_info-block-right");

        if (number) {
            number.textContent = String(index + 1).padStart(2, "0");
        }

        if (category) category.textContent = article.category || "Поради";
        if (title) title.textContent = article.title || "";
        if (description) description.textContent = article.description || "";

        if (button) {
            button.onclick = () => openArticle(article.id);
        }

        if (tips) {
            tips.replaceChildren();

            const heading = document.createElement("h6");
            heading.textContent = "Що допоможе?";
            tips.appendChild(heading);

            const steps = Array.isArray(article.steps)
                ? article.steps
                : [];

            steps.forEach(step => {
                const p = document.createElement("p");
                p.textContent = "● " + step;
                tips.appendChild(p);
            });

            tips.hidden = steps.length === 0;
        }

        if (image) {
            image.style.backgroundImage = article.image
                ? `url(${JSON.stringify(article.image)})`
                : "";
            image.style.backgroundSize = "cover";
            image.style.backgroundPosition = "center";
        }
    });
}

Object.keys(pageArticles).forEach(renderPageArticles);


const bullyingModal = document.getElementById("bullyingModal");
const bullyingModalCloseButton = bullyingModal.querySelector(
    ".bullying-modal-close"
);

let previousFocus = null;

function openBullyingModal() {
    previousFocus = document.activeElement;

    bullyingModal.classList.add("active");
    bullyingModal.setAttribute("role", "dialog");
    bullyingModal.setAttribute("aria-modal", "true");
    bullyingModal.setAttribute(
        "aria-label",
        "Документ щодо протидії булінгу"
    );

    document.body.style.overflow = "hidden";
    bullyingModalCloseButton.focus();
}

function closeBullyingModal() {
    bullyingModal.classList.remove("active");
    document.body.style.overflow = "";

    if (previousFocus) {
        previousFocus.focus();
    }
}

// Закриття при натисканні на фон
bullyingModal.addEventListener("click", function (event) {
    if (event.target === bullyingModal) {
        closeBullyingModal();
    }
});

// Закриття через Escape
document.addEventListener("keydown", function (event) {
    if (!bullyingModal.classList.contains("active")) return;

    if (event.key === "Escape") {
        closeBullyingModal();
    }

    // Утримуємо фокус усередині модального вікна
    if (event.key === "Tab") {
        const focusable = Array.from(
            bullyingModal.querySelectorAll(
                'button, a[href], iframe, [tabindex]:not([tabindex="-1"])'
            )
        );

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const viewer = document.getElementById("certificateViewer");
    const viewerImage = document.getElementById("certificateViewerImage");
    const closeButton = viewer?.querySelector(".certificate-viewer-close");

    if (!viewer || !viewerImage || !closeButton) {
        console.error("Не знайдено елементи модалки сертифікатів");
        return;
    }

    let previousFocus = null;

    function openCertificate(img) {
        previousFocus = document.activeElement;

        viewerImage.src = img.currentSrc || img.src;
        viewerImage.alt = img.alt || "Сертифікат";

        document.body.appendChild(viewer);
        viewer.classList.add("active");
        viewer.setAttribute("aria-hidden", "false");

        closeButton.focus();
    }

    function closeCertificate() {
        viewer.classList.remove("active");
        viewer.setAttribute("aria-hidden", "true");
        viewerImage.removeAttribute("src");

        if (previousFocus instanceof HTMLElement) {
            previousFocus.focus();
        }
    }

    // Працює навіть із сертифікатами,
    // які додаються на сторінку динамічно
    document.addEventListener("click", (event) => {
        const img = event.target.closest(".about_certificate_img img");

        if (img) {
            openCertificate(img);
        }
    });

    closeButton.addEventListener("click", closeCertificate);

    viewer.addEventListener("click", (event) => {
        if (event.target === viewer) {
            closeCertificate();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (!viewer.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeCertificate();
        }
    });

    console.log("Модалка сертифікатів готова!");
});

// ПОПУЛЯРНІ МАТЕРІАЛИ НА 4 СТОРІНКАХ
// Тут вибираєш ID статей та їх порядок окремо для кожної сторінки.
// ID беруться з масиву `articles` у твоєму index.js.
// Наприклад [4, 1, 2, 3] = 4 картки у такому порядку.
const popularArticlesByPage = {
    home:     [2, 5, 9, 13],  // Головна
    students: [6, 7, 8, 9],  // Учням
    parents:  [2, 14, 10, 12],  // Батькам
    teachers: [16, 11, 10, 6]   // Педагогам
};

function renderPopularArticles() {
    if (typeof articles === "undefined" || !Array.isArray(articles)) {
        console.warn("Популярні матеріали: масив articles не знайдений. Перевір, що index.js підключено перед popular_materials.js.");
        return;
    }

    for (const [pageId, articleIds] of Object.entries(popularArticlesByPage)) {
        const page = document.getElementById(pageId);
        if (!page) {
            console.warn(`Популярні матеріали: сторінку #${pageId} не знайдено`);
            continue;
        }

        // У твоєму HTML такий контейнер уже є на кожній із чотирьох сторінок.
        const container = page.querySelector(".popular_materials_bloks");
        if (!container) {
            console.warn(`Популярні матеріали: контейнер на сторінці #${pageId} не знайдено`);
            continue;
        }

        container.replaceChildren(); // прибираємо старі статичні картки тільки з цього блоку

        for (const id of articleIds) {
            const article = articles.find(item => String(item.id) === String(id));
            if (!article) {
                console.warn(`Популярні матеріали: статтю ID ${id} для #${pageId} не знайдено`);
                continue;
            }

            const card = document.createElement("button");
            card.type = "button";
            card.className = "popular_materials_blok";
            card.setAttribute("aria-label", `Відкрити статтю: ${article.title || "Без назви"}`);
            card.addEventListener("click", () => openArticle(article.id));

            const photo = document.createElement("span");
            photo.className = "popular_materials_blok_up";

            if (article.image) {

                photo.style.setProperty(
                    "--popular-bg",
                    `url(${JSON.stringify(article.image)})`
                );

                const img = document.createElement("img");

                img.src = article.image;
                img.alt = "";
                img.loading = "lazy";

                img.addEventListener("error", () => img.remove());

                photo.appendChild(img);
            }

            const info = document.createElement("span");
            info.className = "popular_materials_blok_down";

            const category = document.createElement("span");
            const allowed = ["student", "parents", "teachers"];
            const categoryClass = allowed.includes(article.categoryClass)
                ? article.categoryClass
                : "other";
            category.className = `popular_materials_blok-category ${categoryClass}`;
            category.textContent = article.category || "Поради";

            const title = document.createElement("span");
            title.className = "popular_materials_blok-title";
            title.textContent = article.title || "Без назви";

            info.append(category, title);
            card.append(photo, info);
            container.appendChild(card);
        }

        // Кнопка «Усі матеріали» працює на кожній сторінці.
        const allMaterialsButton = page.querySelector(".popular_materials-text > button");
        if (allMaterialsButton) {
            allMaterialsButton.onclick = () => showPage("advice");
        }
    }
}

// Скрипт підключено після index.js наприкінці body.
renderPopularArticles();








/* Одну висоту залишаємо кожному фото, а ширину картки рахуємо
   з оригінальних пропорцій фото. Підключити ПІСЛЯ інших JS. */
(() => {
  const tracked = new WeakSet();

  function updateImage(img) {
    const card = img.closest('.popular_materials_blok');
    const frame = img.closest('.popular_materials_blok_up');
    if (!card || !frame || !img.naturalWidth || !img.naturalHeight) return;

    const frameHeight = frame.getBoundingClientRect().height || 210;
    const ratio = img.naturalWidth / img.naturalHeight;

    // Мінімальна ширина потрібна, щоб заголовки читалися.
    const minimum = window.innerWidth <= 500 ? 190 : 215;
    const width = Math.max(minimum, Math.ceil(frameHeight * ratio) + 2);
    card.style.setProperty('--natural-card-width', `${width}px`);
  }

  function refreshCards() {
    document.querySelectorAll('.popular_materials_full .popular_materials_blok_up img')
      .forEach(img => {
        if (!tracked.has(img)) {
          tracked.add(img);
          img.addEventListener('load', () => updateImage(img));
        }
        if (img.complete) updateImage(img);
      });
  }

  function init() {
    refreshCards();
    // Підхоплює картки, які renderPopularArticles() створює повторно.
    document.querySelectorAll('.popular_materials_full .popular_materials_bloks')
      .forEach(container => {
        const observer = new MutationObserver(refreshCards);
        observer.observe(container, { childList: true, subtree: true });
      });
    let resizeFrame = null;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(refreshCards);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
/*
 * Популярні матеріали — такі самі картки, як у «Психологічних порадах».
 * Підключити ПІСЛЯ index.js і new_advice.js.
 * Не змінює масив articles та популярні ID для кожної сторінки.
 */
(function () {
  "use strict";

  function renderPopularLikeAdvice() {
    if (typeof articles === "undefined" || !Array.isArray(articles)) {
      console.warn("Популярні матеріали: масив articles не знайдено");
      return;
    }
    if (typeof popularArticlesByPage === "undefined") {
      console.warn("Популярні матеріали: popularArticlesByPage не знайдено");
      return;
    }

    for (const [pageId, articleIds] of Object.entries(popularArticlesByPage)) {
      const page = document.getElementById(pageId);
      const container = page?.querySelector(".popular_materials_bloks");
      if (!container) continue;

      container.replaceChildren();

      for (const id of articleIds) {
        const article = articles.find(item => String(item.id) === String(id));
        if (!article) continue;

        // Така сама структура й CSS-класи, як у showArticles().
        const card = document.createElement("article");
        card.className = "window_advice_card";

        const photo = document.createElement("div");
        photo.className = "window_advice_card-img";
        if (article.image) {
          photo.style.backgroundImage = `url(${JSON.stringify(article.image)})`;
          photo.setAttribute("role", "img");
          photo.setAttribute("aria-label", `Зображення до статті «${article.title || ""}»`);
        }

        const info = document.createElement("div");
        info.className = "window_advice_card-info";

        const category = document.createElement("p");
        category.className = "window_advice_card-category";
        const allowed = ["student", "parents", "teachers", "all"];
        category.classList.add(allowed.includes(article.categoryClass) ? article.categoryClass : "all");
        category.textContent = article.category || "Поради";

        const title = document.createElement("h3");
        title.textContent = article.title || "Без назви";

        const description = document.createElement("p");
        description.className = "window_advice_card-description";
        description.textContent = article.description || "";

        const bottom = document.createElement("div");
        bottom.className = "window_advice_card-bottom";

        const time = document.createElement("p");
        time.textContent = article.readingTime || "";

        const readButton = document.createElement("button");
        readButton.type = "button";
        readButton.textContent = "Читати →";
        readButton.setAttribute("aria-label", `Читати: ${article.title || "статтю"}`);
        readButton.addEventListener("click", () => openArticle(article.id));

        bottom.append(time, readButton);
        info.append(category, title, description, bottom);
        card.append(photo, info);
        container.appendChild(card);
      }

      const allButton = page.querySelector(".popular_materials-text > button");
      if (allButton) allButton.onclick = () => showPage("advice");
    }
  }

  // Замінюємо тільки спосіб відображення популярних карток.
  // Це також дозволяє new_advice.js оновлювати їх у майбутньому.
  window.renderPopularArticles = renderPopularLikeAdvice;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderPopularLikeAdvice, { once: true });
  } else {
    renderPopularLikeAdvice();
  }
})();

/* МОБІЛЬНЕ БУРГЕР-МЕНЮ */
(function () {

    const burger = document.getElementById("psyBurgerBtn");
    const menu = document.getElementById("psyMainMenu");

    if (!burger || !menu) return;

    function setMenuOpen(isOpen) {

        burger.classList.toggle("is-open", isOpen);
        menu.classList.toggle("is-open", isOpen);

        burger.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        burger.setAttribute(
            "aria-label",
            isOpen ? "Закрити меню" : "Відкрити меню"
        );
    }

    // Натискання на бургер
    burger.addEventListener("click", function () {

        const isOpen = menu.classList.contains("is-open");

        setMenuOpen(!isOpen);
    });

    // Закриття після вибору сторінки
    menu.addEventListener("click", function (event) {

        if (event.target.closest("button")) {
            setMenuOpen(false);
        }
    });

    // Закриття при натисканні поза меню
    document.addEventListener("click", function (event) {

        if (
            !menu.contains(event.target) &&
            !burger.contains(event.target)
        ) {
            setMenuOpen(false);
        }
    });

    // Закриття клавішею Escape
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            menu.classList.contains("is-open")
        ) {
            setMenuOpen(false);
            burger.focus();
        }
    });

    // При переході на комп'ютерну ширину
    window.addEventListener("resize", function () {

        if (window.innerWidth > 1100) {
            setMenuOpen(false);
        }
    });

})();
