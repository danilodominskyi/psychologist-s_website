
export default {
    async fetch(request) {

        const reply = (data, status = 200) => {
            return Response.json(data, { status });
        };

        // Приймаємо тільки POST-запити
        if (request.method !== "POST") {
            return reply({ error: "Метод не дозволений" }, 405);
        }

        // Перевірка джерела запиту
        const origin = request.headers.get("origin");

        if (origin && origin !== new URL(request.url).origin) {
            return reply({ error: "Доступ заборонено" }, 403);
        }

        if (!(request.headers.get("content-type") || "")
            .includes("application/json")) {
            return reply({ error: "Неправильний формат" }, 415);
        }

        try {
            const raw = await request.text();

            if (raw.length > 10000) {
                return reply({ error: "Завеликий запит" }, 413);
            }

            const data = JSON.parse(raw);

            if (!data || typeof data !== "object" ||
                Array.isArray(data)) {
                return reply({ error: "Неправильні дані" }, 400);
            }

            // Дані з форми
            const fullName = String(data.fullName || "").trim();
            const phone = String(data.phone || "").trim();
            const role = String(data.role || "").trim();
            const classAge = String(data.classAge || "").trim();
            const message = String(data.message || "").trim();

            // Перевірка полів
            if (
                fullName.length < 2 ||
                fullName.length > 100 ||
                message.length < 5 ||
                message.length > 3000 ||
                classAge.length > 50 ||
                !["Учень", "Батько / мама", "Педагог"].includes(role) ||
                (phone && !/^0[0-9]{9}$/.test(phone))
            ) {
                return reply({
                    error: "Перевірте правильність заповнення"
                }, 400);
            }

            // Секретні дані із .env.local
            const token = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;

            if (!token || !chatId) {
                return reply({
                    error: "Telegram-бот не налаштований"
                }, 503);
            }

            // Формуємо повідомлення
            const telegramMessage = [
                "📩 НОВЕ ЗВЕРНЕННЯ ДО ПСИХОЛОГА",
                "",
                "👤 Ім'я: " + fullName,
                "👥 Категорія: " + role,
                "📞 Телефон: " + (phone || "Не вказано"),
                "🎓 Клас або вік: " + (classAge || "Не вказано"),
                "",
                "💬 Повідомлення:",
                message
            ].join("\n");

            // Надсилаємо повідомлення в Telegram
            const response = await fetch(
                `https://api.telegram.org/bot${token}/sendMessage`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: telegramMessage
                    }),
                    signal: AbortSignal.timeout(9000)
                }
            );

            const result = await response.json();

            if (!response.ok || !result.ok) {
                return reply({
                    error: "Telegram не прийняв повідомлення"
                }, 502);
            }

            return reply({
                ok: true,
                message: "Повідомлення надіслано"
            });

        } catch (error) {
            console.error("Помилка обробки звернення:", error.name);

            return reply({
                error: "Не вдалося надіслати повідомлення"
            }, 500);
        }
    }
};
