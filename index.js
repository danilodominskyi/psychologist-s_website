console.log("JS працює!");


function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.hidden = true;
    });

    document.getElementById(pageId).hidden = false;
}


function openArticle() {
    document.getElementById("articleModal").style.display = "flex";
}

function closeArticle() {
    document.getElementById("articleModal").style.display = "none";
}


let window_advice_cards = [ ];

let window_advice_card = {
    whom: '',
}


const articles = [
    {
        id: 1,

        category: "Учням",
        categoryClass: "student",

        title: "Як справлятися зі стресом у підлітковому віці",

        description: "Прості способи знизити напруження та краще впоратися з переживаннями.",

        readingTime: "5 хв читання",

        quote: "Стрес — це нормально. Головне — вчасно помічати його та дбати про себе.",

        sections: [
            {
                title: "Що таке стрес?",
                text: "Стрес — це природна реакція нашого організму на складні або незвичні ситуації."
            },

            {
                title: "Як зрозуміти, що ви відчуваєте стрес?",
                text: "Стрес може проявлятися по-різному: втомою, проблемами зі сном або складністю зосередитися."
            },

            {
                title: "Що може допомогти?",
                text: "Відпочинок, фізична активність та спілкування можуть допомогти знизити рівень напруження."
            }
        ]
    },
    {
        id: 2,

        category: "Батькам",
        categoryClass: "parents",

        title: "Поради для батьків: як підтримати дитину",

        description: "Як бути поруч у складні моменти та зберігати довіру у спілкуванні.",

        readingTime: "6 хв читання",

        quote: "Стрес — це нормально. Головне — вчасно помічати його та дбати про себе.",

        sections: [
            {
                title: "Що таке стрес?",
                text: "Стрес — це природна реакція нашого організму на складні або незвичні ситуації."
            },

            {
                title: "Як зрозуміти, що ви відчуваєте стрес?",
                text: "Стрес може проявлятися по-різному: втомою, проблемами зі сном або складністю зосередитися."
            },

            {
                title: "Що може допомогти?",
                text: "Відпочинок, фізична активність та спілкування можуть допомогти знизити рівень напруження."
            }
        ]
    },
    {
        id: 3,

        category: "Педагогам",
        categoryClass: "teachers",

        title: "Поради для вчителів: як зрозуміти дитину",

        description: "прості стособи повпливати на дитину",

        readingTime: "6 хв читання",

        quote: "Стрес — це нормально. Головне — вчасно помічати його та дбати про себе.",

        sections: [
            {
                title: "Що таке стрес?",
                text: "Стрес — це природна реакція нашого організму на складні або незвичні ситуації."
            },

            {
                title: "Як зрозуміти, що ви відчуваєте стрес?",
                text: "Стрес може проявлятися по-різному: втомою, проблемами зі сном або складністю зосередитися."
            },

            {
                title: "Що може допомогти?",
                text: "Відпочинок, фізична активність та спілкування можуть допомогти знизити рівень напруження."
            }
        ]
    },
    {
        id: 4,

        category: "Учням",
        categoryClass: "student",

        title: "як справитись зі стресом перед контрольною",

        description: "легкі способи правильниї підготовки",

        readingTime: " хв читання",

        quote: "Стрес — це нормально. Головне — вчасно помічати його та дбати про себе.",

        sections: [
            {
                title: "Що таке стрес?",
                text: "Стрес — це природна реакція нашого організму на складні або незвичні ситуації."
            },

            {
                title: "Як зрозуміти, що ви відчуваєте стрес?",
                text: "Стрес може проявлятися по-різному: втомою, проблемами зі сном або складністю зосередитися."
            },

            {
                title: "Що може допомогти?",
                text: "Відпочинок, фізична активність та спілкування можуть допомогти знизити рівень напруження."
            }
        ]
    },
];

const articlesContainer = document.getElementById("articlesContainer");

function showArticles(articlesToShow) {

    // Спочатку очищаємо всі картки
    articlesContainer.innerHTML = "";

    // Створюємо тільки ті, які передали у функцію
    articlesToShow.forEach(function(article) {

        articlesContainer.innerHTML += `
            <div class="window_advice_card">

                <div class="window_advice_card-img"></div>

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