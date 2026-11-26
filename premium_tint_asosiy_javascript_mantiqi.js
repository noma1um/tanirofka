/* ==================== XOTIRA VA BOSHLANG'ICH HOLAT ==================== */
const STORAGE_KEY = 'premium_tint_state_v1';
const ADMIN_PASS = 'admin123';
const DEFAULT_SIM_PHOTO_URL = 'https://orientrentcar.uz/wp-content/uploads/2023/11/32-es.jpg';

function handleSimulatorPhotoLoad() {
    const notice = document.getElementById('simPhotoFallbackNotice');
    if (notice) notice.classList.add('hidden');
}

function handleSimulatorPhotoError() {
    const notice = document.getElementById('simPhotoFallbackNotice');
    const titleEl = document.getElementById('simPhotoErrorTitle');
    const descEl = document.getElementById('simPhotoErrorDesc');
    if (notice) notice.classList.remove('hidden');
    if (titleEl) {
        titleEl.textContent = (typeof appState !== 'undefined' && appState.lang === 'ru')
            ? 'Не удалось загрузить фото по URL'
            : 'Rasm URL manzili yuklanmadi';
    }
    if (descEl) {
        descEl.textContent = (typeof appState !== 'undefined' && appState.lang === 'ru')
            ? 'Проверьте ссылку на изображение или выберите другой URL в списке / Админ-панели.'
            : 'Tashqi rasm havolasini tekshiring yoki ro‘yxatdan / Admin paneldan boshqa URL kiriting.';
    }
}

function getTodayISO() {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
}

function createDefaultState() {
    return {
        lang: 'uz',
        adminAuthenticated: false,
        simTint: 35,
        simCarId: 'malibu',
        simPhotoUrl: DEFAULT_SIM_PHOTO_URL,
        calcCoverage: 'rear',
        masterInfo: {
            uzName: "Ma'rufjon Kudratov",
            ruName: "Маруфжон Кудратов",
            phone: '+998 90 123 45 67',
            uzRole: '28 yoshlik mutaxassis',
            uzExp: '5+ yillik tajriba',
            ruRole: 'Специалист 28 лет',
            ruExp: '5+ лет опыта'
        },
        workshopAddress: 'Andijon sh, Jalaquduq tumani, Yorqishloq shahri',
        socials: {
            telegram: 'https://t.me/',
            instagram: 'https://instagram.com/',
            facebook: 'https://facebook.com/',
            extra: ''
        },
        lunchBreak: {
            active: false,
            resumeTime: '13:00'
        },
        telegram: {
            enabled: true,
            botToken: '',
            chatId: '',
            logs: []
        },
        cars: [
            { id: 'malibu', name: 'Chevrolet Malibu', basePrice: 1450000, type: 'sedan', photoUrl: DEFAULT_SIM_PHOTO_URL },
            { id: 'gentra', name: 'Chevrolet Gentra', basePrice: 1150000, type: 'sedan', photoUrl: DEFAULT_SIM_PHOTO_URL },
            { id: 'cobalt', name: 'Chevrolet Cobalt', basePrice: 1050000, type: 'sedan', photoUrl: DEFAULT_SIM_PHOTO_URL },
            { id: 'tracker', name: 'Chevrolet Tracker', basePrice: 1350000, type: 'suv', photoUrl: DEFAULT_SIM_PHOTO_URL }
        ],
        tintMultipliers: {
            5: 1.15,
            15: 1.05,
            35: 1.0,
            70: 1.1
        },
        coverageMultipliers: {
            rear: 1.0,
            full_side: 1.45,
            full_car: 1.85
        },
        orders: [
            {
                id: 'ORD-101',
                name: 'Sardorbek Alimov',
                phone: '+998 90 345 67 89',
                carId: 'malibu',
                carName: 'Chevrolet Malibu',
                plate: '01 A 777 AA',
                color: 'Qora',
                tint: 35,
                coverage: 'rear',
                date: getTodayISO(),
                slot: '08:00',
                price: 1450000,
                status: 'in_progress',
                startedAt: '08:05'
            },
            {
                id: 'ORD-102',
                name: 'Dilshod Tursunov',
                phone: '+998 93 512 88 11',
                carId: 'gentra',
                carName: 'Chevrolet Gentra',
                plate: '01 M 412 KA',
                color: 'Mokriy asfalt',
                tint: 15,
                coverage: 'full_side',
                date: getTodayISO(),
                slot: '09:30',
                price: 1750000,
                status: 'waiting',
                startedAt: null
            },
            {
                id: 'ORD-103',
                name: 'Nodirbek Qodirov',
                phone: '+998 97 701 22 33',
                carId: 'tracker',
                carName: 'Chevrolet Tracker',
                plate: '10 T 105 BA',
                color: 'Oq',
                tint: 35,
                coverage: 'rear',
                date: getTodayISO(),
                slot: '06:30',
                price: 1350000,
                status: 'completed',
                startedAt: '06:35'
            }
        ],
        reviews: [
            {
                id: 'REV-1',
                name: 'Nodirbek Qodirov',
                carPlate: 'Tracker • 10 T 105 BA',
                rating: 5,
                comment: 'Ertalab 06:30 da kirdim, plyonka juda tiniq va pufakchasiz tortildi. Tavsiya qilaman!',
                approved: true
            },
            {
                id: 'REV-2',
                name: 'Javohir Rustamov',
                carPlate: 'Cobalt • 01 X 509 ZB',
                rating: 5,
                comment: 'Jarayonni saytdan kuzatib bordim, vaqtida tayyor bo‘ldi.',
                approved: true
            }
        ]
    };
}

function sanitizeState(parsed) {
    const base = createDefaultState();
    if (!parsed || typeof parsed !== 'object') return base;

    const safeCars = Array.isArray(parsed.cars) && parsed.cars.length > 0
        ? parsed.cars.map((c, idx) => ({
            id: String(c?.id || `car_${idx}`),
            name: String(c?.name || 'Avtomobil'),
            basePrice: Number(c?.basePrice) > 0 ? Number(c.basePrice) : 1100000,
            type: c?.type === 'suv' ? 'suv' : 'sedan',
            photoUrl: typeof c?.photoUrl === 'string' && c.photoUrl.trim() ? c.photoUrl.trim() : DEFAULT_SIM_PHOTO_URL
        }))
        : base.cars;

    const safeOrders = Array.isArray(parsed.orders)
        ? parsed.orders.filter((o) => o && typeof o === 'object').map((o, i) => ({
            id: String(o.id || `ORD-${200 + i}`),
            name: String(o.name || 'Mijoz'),
            phone: String(o.phone || ''),
            carId: String(o.carId || safeCars[0].id),
            carName: String(o.carName || safeCars[0].name),
            plate: String(o.plate || '').toUpperCase(),
            color: String(o.color || ''),
            tint: [5, 15, 35, 70].includes(Number(o.tint)) ? Number(o.tint) : 35,
            coverage: ['rear', 'full_side', 'full_car'].includes(o.coverage) ? o.coverage : 'rear',
            date: String(o.date || getTodayISO()),
            slot: String(o.slot || '09:00'),
            price: Number(o.price) >= 0 ? Number(o.price) : 1100000,
            status: ['waiting', 'in_progress', 'completed', 'cancelled'].includes(o.status) ? o.status : 'waiting',
            startedAt: o.startedAt ? String(o.startedAt) : null
        }))
        : base.orders;

    const safeReviews = Array.isArray(parsed.reviews)
        ? parsed.reviews.filter((r) => r && typeof r === 'object').map((r, i) => ({
            id: String(r.id || `REV-${i + 1}`),
            name: String(r.name || 'Mijoz'),
            carPlate: String(r.carPlate || ''),
            rating: Math.min(5, Math.max(1, Number(r.rating) || 5)),
            comment: String(r.comment || ''),
            approved: typeof r.approved === 'boolean' ? r.approved : true
        }))
        : base.reviews;

    const safeLogs = Array.isArray(parsed.telegram?.logs)
        ? parsed.telegram.logs.filter((l) => l && typeof l === 'object').slice(0, 30)
        : [];

    const safeTintMultipliers = { ...base.tintMultipliers, ...(parsed.tintMultipliers || {}) };
    if (!Number(safeTintMultipliers[70])) {
        safeTintMultipliers[70] = 1.1;
    }

    const oldUzRole = String(parsed.masterInfo?.uzRole || '');
    const oldRuRole = String(parsed.masterInfo?.ruRole || '');

    return {
        ...base,
        lang: parsed.lang === 'ru' ? 'ru' : 'uz',
        adminAuthenticated: Boolean(parsed.adminAuthenticated),
        simTint: [5, 15, 35, 70].includes(Number(parsed.simTint)) ? Number(parsed.simTint) : 35,
        simCarId: safeCars.some((c) => c.id === parsed.simCarId) ? parsed.simCarId : safeCars[0].id,
        simPhotoUrl: typeof parsed.simPhotoUrl === 'string' && parsed.simPhotoUrl.trim() ? parsed.simPhotoUrl.trim() : DEFAULT_SIM_PHOTO_URL,
        calcCoverage: ['rear', 'full_side', 'full_car'].includes(parsed.calcCoverage) ? parsed.calcCoverage : 'rear',
        masterInfo: {
            uzName: String(parsed.masterInfo?.uzName || base.masterInfo.uzName),
            ruName: String(parsed.masterInfo?.ruName || base.masterInfo.ruName),
            phone: String(parsed.masterInfo?.phone || base.masterInfo.phone),
            uzRole: (!oldUzRole || oldUzRole === '30 yoshlik mutaxassis') ? base.masterInfo.uzRole : oldUzRole,
            uzExp: String(parsed.masterInfo?.uzExp || base.masterInfo.uzExp),
            ruRole: (!oldRuRole || oldRuRole === 'Специалист 30 лет') ? base.masterInfo.ruRole : oldRuRole,
            ruExp: String(parsed.masterInfo?.ruExp || base.masterInfo.ruExp)
        },
        workshopAddress: String(parsed.workshopAddress || base.workshopAddress),
        socials: {
            telegram: String(parsed.socials?.telegram || base.socials.telegram),
            instagram: String(parsed.socials?.instagram || base.socials.instagram),
            facebook: String(parsed.socials?.facebook || base.socials.facebook),
            extra: String(parsed.socials?.extra || '')
        },
        lunchBreak: {
            active: Boolean(parsed.lunchBreak?.active),
            resumeTime: /^\d{2}:\d{2}$/.test(String(parsed.lunchBreak?.resumeTime || '')) ? String(parsed.lunchBreak.resumeTime) : '13:00'
        },
        telegram: {
            enabled: typeof parsed.telegram?.enabled === 'boolean' ? parsed.telegram.enabled : true,
            botToken: String(parsed.telegram?.botToken || ''),
            chatId: String(parsed.telegram?.chatId || ''),
            logs: safeLogs
        },
        cars: safeCars,
        tintMultipliers: safeTintMultipliers,
        coverageMultipliers: { ...base.coverageMultipliers, ...(parsed.coverageMultipliers || {}) },
        orders: safeOrders,
        reviews: safeReviews
    };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return createDefaultState();
        return sanitizeState(JSON.parse(raw));
    } catch (e) {
        return createDefaultState();
    }
}

let appState = loadState();
let currentReviewRating = 5;

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        // Xotira cheklovida xato chiqarmaslik
    }
}

function formatUZS(amount) {
    return Number(amount || 0).toLocaleString('ru-RU').replace(/,/g, ' ') + (appState.lang === 'ru' ? ' сум' : ' so‘m');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    const borderColor = type === 'error' ? 'border-red-500/50 text-red-200 bg-red-950/95' : 'border-gold/50 text-gold-light bg-[#16161D]/95';
    el.className = `pointer-events-auto border ${borderColor} rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md transition-all`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 250);
    }, 3400);
}

/* ==================== TIL (UZ / RU) ==================== */
const i18n = {
    uz: {
        nav_home: 'Asosiy',
        nav_sim: 'Simulyator & Kalkulyator',
        nav_sim_short: 'Simulyator',
        nav_book: 'Bron qilish',
        nav_queue: 'Navbatdagi mashinalar',
        nav_queue_short: 'Navbatdagi mashinalar',
        nav_reviews: 'Sharhlar',
        cta_book_now: 'Bron qilish',
        hero_badge: "PREMIUM TINT • O'ZBEKISTON AVTO STUDIYASI",
        hero_title_1: 'PREMIUM TINT',
        hero_title_2: 'AVTOMOBIL TONIROVKA VA HIMOYA',
        hero_desc: 'Malibu, Gentra, Cobalt, Tracker va boshqa avtomobillar uchun yuqori sifatli quyoshdan himoya va tonirovka xizmati. Jarayonni jonli kuzating, narxni oldindan hisoblang va bo‘sh vaqtga yoziling.',
        hero_btn_book: 'Navbatga yozilish',
        hero_btn_queue: 'Navbatdagi mashinalar',
        work_hours_label: 'Ish vaqti',
        map_link_label: 'Xarita',
        permit_short_label: 'Ruxsatnoma va BHM',
        permit_short_desc: 'Orqa va yon oynalarga qonuniy me’yorlar asosida xizmat ko‘rsatiladi; ruxsatnoma BHM asosida rasmiylashtiriladi.',
        sim_kicker: 'Oyna Qoraytirish Simulyatori',
        sim_heading: 'Jonli ko‘rinishni sinab ko‘ring',
        tint_level_label: 'Qoraytirish darajasi (VLT / Soya):',
        calc_kicker: 'Narx Kalkulyatori',
        calc_heading: 'Xizmat narxini hisoblang',
        calc_hours_note: 'Ish vaqti: 06:00 — 22:00',
        lbl_car_model: 'Avtomobil rusumi',
        lbl_film_tier: 'Plyonka darajasi / Foiz',
        lbl_coverage: 'Qoplama qismi',
        cov_rear: 'Orqa yon + orqa oyna',
        cov_full_side: 'Barcha yon oynalar',
        cov_full_car: 'To‘liq kompleks',
        calc_est_label: 'Taxminiy xizmat narxi',
        calc_use_btn: 'Shu tanlov bilan bron qilish',
        book_kicker: 'Onlayn Navbat',
        book_heading: 'Bron qilish formasi',
        book_sub: 'Ma’lumotlarni kiriting — ariza darhol Admin panel va Telegram botga yuboriladi.',
        f_name: 'Ismingiz *',
        f_phone: 'Telefon raqami *',
        f_car: 'Mashina rusumi *',
        f_plate: 'Davlat raqami *',
        f_color: 'Mashina rangi *',
        f_tint: 'Plyonka / Foiz *',
        f_cov: 'Qoplama qismi *',
        f_date: 'Sana *',
        f_slot: 'Bo‘sh vaqt (06:00 — 22:00) *',
        btn_submit_booking: 'Buyurtma yuborish (Admin & Telegram)',
        tg_preview_desc: 'Buyurtma yuborilganda quyidagi formatda xabar shakllanadi va yuboriladi:',
        queue_kicker: 'Jonli Holat',
        queue_heading: 'Navbatdagi mashinalar',
        rev_kicker: 'Mijozlar Bahosi',
        rev_heading: 'Reyting va izohlar (1–5 yulduz)',
        rev_form_title: 'Xizmat yakunlangach baho va izoh qoldiring',
        rev_name: 'Ismingiz *',
        rev_car_plate: 'Avtomobil / Davlat raqami *',
        rev_stars: 'Reyting (1 dan 5 gacha) *',
        rev_comment: 'Izohingiz *',
        rev_submit: 'Izoh yuborish',
        footer_hours: 'Ish vaqti: 06:00 — 22:00',
        permit_full: 'Solntsezashchita (quyoshdan himoya) standarti: yorug‘lik o‘tkazish ko‘rsatkichi 70% gacha ruxsat etilgan — undan past ko‘rsatkich jarimaga sabab bo‘ladi. Orqa yon va orqa oynalar qonuniy me’yorlar asosida qoraytiriladi; ruxsatnoma BHM asosida rasmiylashtiriladi.'
    },
    ru: {
        nav_home: 'Главная',
        nav_sim: 'Симулятор и Калькулятор',
        nav_sim_short: 'Симулятор',
        nav_book: 'Бронирование',
        nav_queue: 'Машины в очереди',
        nav_queue_short: 'Машины в очереди',
        nav_reviews: 'Отзывы',
        cta_book_now: 'Записаться',
        hero_badge: 'PREMIUM TINT • АВТОСТУДИЯ УЗБЕКИСТАНА',
        hero_title_1: 'PREMIUM TINT',
        hero_title_2: 'ТОНИРОВКА И ЗАЩИТА АВТО',
        hero_desc: 'Профессиональная тонировка и защита стекол для Malibu, Gentra, Cobalt, Tracker и других авто. Следите за статусом онлайн, рассчитывайте стоимость и выбирайте свободное время.',
        hero_btn_book: 'Записаться онлайн',
        hero_btn_queue: 'Машины в очереди',
        work_hours_label: 'Время работы',
        map_link_label: 'Карта',
        permit_short_label: 'Разрешение и БРВ',
        permit_short_desc: 'Задние и боковые стекла обслуживаются по нормам; разрешение оформляется на основе БРВ.',
        sim_kicker: 'Симулятор Затемнения',
        sim_heading: 'Проверьте вид стекол вживую',
        tint_level_label: 'Уровень затемнения (VLT):',
        calc_kicker: 'Калькулятор Стоимости',
        calc_heading: 'Рассчитайте цену услуги',
        calc_hours_note: 'Время работы: 06:00 — 22:00',
        lbl_car_model: 'Модель автомобиля',
        lbl_film_tier: 'Пленка / Процент',
        lbl_coverage: 'Зона оклейки',
        cov_rear: 'Задние боковые + заднее',
        cov_full_side: 'Все боковые стекла',
        cov_full_car: 'Полный комплекс',
        calc_est_label: 'Примерная стоимость',
        calc_use_btn: 'Записаться с этим выбором',
        book_kicker: 'Онлайн Запись',
        book_heading: 'Форма бронирования',
        book_sub: 'Заполните данные — заявка сразу попадет в Админ-панель и Telegram-бот.',
        f_name: 'Ваше имя *',
        f_phone: 'Телефон *',
        f_car: 'Модель авто *',
        f_plate: 'Госномер *',
        f_color: 'Цвет авто *',
        f_tint: 'Пленка / % *',
        f_cov: 'Зона оклейки *',
        f_date: 'Дата *',
        f_slot: 'Свободное время (06:00 — 22:00) *',
        btn_submit_booking: 'Отправить заявку (Админ и Telegram)',
        tg_preview_desc: 'При отправке заявки формируется и отправляется сообщение следующего вида:',
        queue_kicker: 'Живой Статус',
        queue_heading: 'Машины в очереди',
        rev_kicker: 'Отзывы Клиентов',
        rev_heading: 'Рейтинг и отзывы (1–5 звезд)',
        rev_form_title: 'Оставьте оценку и отзыв после завершения работ',
        rev_name: 'Ваше имя *',
        rev_car_plate: 'Авто / Госномер *',
        rev_stars: 'Рейтинг (от 1 до 5) *',
        rev_comment: 'Ваш отзыв *',
        rev_submit: 'Отправить отзыв',
        footer_hours: 'Время работы: 06:00 — 22:00',
        permit_full: 'Стандарт солнцезащиты: пропускание света
