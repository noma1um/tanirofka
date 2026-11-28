const STORAGE_KEY = 'premium_tint_state_v1';
const BOOKING_DRAFT_KEY = 'premium_tint_booking_draft_v1';
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
            uzRole: '30 yoshlik mutaxassis',
            uzExp: '5+ yillik tajriba',
            ruRole: 'Специалист 30 лет',
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

    return {
        ...base,
        lang: parsed.lang === 'ru' ? 'ru' : 'uz',
        adminAuthenticated: Boolean(parsed.adminAuthenticated),
        simTint: [5, 15, 35, 70].includes(Number(parsed.simTint)) ? Number(parsed.simTint) : 35,
        simCarId: safeCars.some((c) => c.id === parsed.simCarId) ? parsed.simCarId : safeCars[0].id,
        simPhotoUrl: typeof parsed.simPhotoUrl === 'string' && parsed.simPhotoUrl.trim() ? parsed.simPhotoUrl.trim() : DEFAULT_SIM_PHOTO_URL,
        calcCoverage: ['rear', 'full_side', 'full_car'].includes(parsed.calcCoverage) ? parsed.calcCoverage : 'rear',
        masterInfo: {
            uzRole: String(parsed.masterInfo?.uzRole || base.masterInfo.uzRole),
            uzExp: String(parsed.masterInfo?.uzExp || base.masterInfo.uzExp),
            ruRole: String(parsed.masterInfo?.ruRole || base.masterInfo.ruRole),
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
        tintMultipliers: { ...base.tintMultipliers, ...(parsed.tintMultipliers || {}) },
        coverageMultipliers: { ...base.coverageMultipliers, ...(parsed.coverageMultipliers || {}) },
        orders: safeOrders,
        reviews: safeReviews
    };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            const initial = createDefaultState();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            return initial;
        }
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
        console.warn('localStorage saqlashda xatolik:', e);
    }
}

function saveBookingDraft() {
    try {
        const draft = {
            name: document.getElementById('bName')?.value || '',
            phone: document.getElementById('bPhone')?.value || '',
            carId: document.getElementById('bCar')?.value || '',
            plate: document.getElementById('bPlate')?.value || '',
            color: document.getElementById('bColor')?.value || '',
            tint: document.getElementById('bTint')?.value || '35',
            cov: document.getElementById('bCov')?.value || 'rear',
            date: document.getElementById('bDate')?.value || getTodayISO(),
            slot: document.getElementById('bSlot')?.value || ''
        };
        localStorage.setItem(BOOKING_DRAFT_KEY, JSON.stringify(draft));
    } catch (e) {
    }
}

function restoreBookingDraft() {
    try {
        const raw = localStorage.getItem(BOOKING_DRAFT_KEY);
        if (!raw) return;
        const draft = JSON.parse(raw);
        if (!draft || typeof draft !== 'object') return;

        if (draft.name) document.getElementById('bName').value = draft.name;
        if (draft.phone) document.getElementById('bPhone').value = draft.phone;
        if (draft.carId && appState.cars.some((c) => c.id === draft.carId)) {
            document.getElementById('bCar').value = draft.carId;
        }
        if (draft.plate) document.getElementById('bPlate').value = draft.plate;
        if (draft.color) document.getElementById('bColor').value = draft.color;
        if (draft.tint) document.getElementById('bTint').value = draft.tint;
        if (draft.cov) document.getElementById('bCov').value = draft.cov;
        if (draft.date) document.getElementById('bDate').value = draft.date;
        if (draft.slot) document.getElementById('bSlot').value = draft.slot;
    } catch (e) {
    }
}

function clearBookingDraft() {
    try {
        localStorage.removeItem(BOOKING_DRAFT_KEY);
    } catch (e) {
    }
}

function resetAllLocalStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(BOOKING_DRAFT_KEY);
        appState = createDefaultState();
        saveState();
        location.reload();
    } catch (e) {
        showToast('Xotirani tozalashda xatolik yuz berdi', 'error');
    }
}

function formatUZS(amount) {
    return Number(amount || 0).toLocaleString('ru-RU').replace(/,/g, ' ') + (appState.lang === 'ru' ? ' сум' : ' so‘m');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
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
        sun_rule_title: 'Sonsazashita — Standart quyoshdan himoya',
        sun_rule_desc: 'Standart quyoshdan himoyalovchi yorug‘lik o‘tkazishi 70% gacha ruxsat; undan past ko‘rsatkich jarimaga sabab bo‘ladi.',
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
        permit_full: 'Ma’lumot uchun: O‘zbekistonda tonirovka qoidalariga muvofiq orqa yon va orqa oynalar qoraytiriladi; tegishli ruxsatnomalar belgilangan BHM (Bazaviy hisoblash miqdori) stavkalari asosida rasmiylashtiriladi. Standart quyoshdan himoyalovchi yorug‘lik o‘tkazishi 70% gacha ruxsat; undan past ko‘rsatkich jarimaga sabab bo‘ladi.'
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
        sun_rule_title: 'Солнцезащита — Стандарт светопропускания',
        sun_rule_desc: 'Стандартное солнцезащитное пропускание света разрешено до 70%; показатель ниже приводит к штрафу.',
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
        permit_full: 'Справка: по правилам в Узбекистане тонируются задние боковые и заднее стекла; официальное разрешение оформляется исходя из установленного БРВ (Базовой расчетной величины). Стандартное солнцезащитное пропускание света разрешено до 70%; показатель ниже приводит к штрафу.'
    }
};

function setLanguage(lang) {
    appState.lang = lang === 'ru' ? 'ru' : 'uz';
    saveState();

    const uzBtn = document.getElementById('langUzBtn');
    const ruBtn = document.getElementById('langRuBtn');
    if (lang === 'uz') {
        uzBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition bg-gold text-obsidian';
        ruBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition text-gray-300 hover:text-white';
    } else {
        ruBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition bg-gold text-obsidian';
        uzBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition text-gray-300 hover:text-white';
    }

    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        if (i18n[lang] && i18n[lang][key]) {
            node.textContent = i18n[lang][key];
        }
    });

    const heroMasterEl = document.getElementById('heroMasterText');
    const heroExpEl = document.getElementById('heroExpText');
    if (heroMasterEl) {
        heroMasterEl.textContent = lang === 'ru'
            ? (appState.masterInfo?.ruRole || 'Специалист 30 лет')
            : (appState.masterInfo?.uzRole || '30 yoshlik mutaxassis');
    }
    if (heroExpEl) {
        heroExpEl.textContent = lang === 'ru'
            ? (appState.masterInfo?.ruExp || '5+ лет опыта')
            : (appState.masterInfo?.uzExp || '5+ yillik tajriba');
    }

    document.getElementById('permitInfoText').textContent = i18n[lang].permit_full;
    document.getElementById('queueSearchInput').placeholder = lang === 'ru' ? 'Госномер или модель...' : 'Davlat raqami yoki rusum...';
    updateSimulator();
    recalculatePrice();
    renderLiveQueue();
    renderReviews();
    updateTelegramPreview();
}

let brandTapCount = 0;
let brandTapTimer = null;

function openAdminPanelRoute() {
    try {
        window.location.hash = '#/admin';
    } catch (e) {
    }
    syncRouteView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleBrandSecretTap() {
    brandTapCount += 1;
    if (brandTapTimer) {
        clearTimeout(brandTapTimer);
    }
    if (brandTapCount >= 5) {
        const reached = brandTapCount;
        brandTapCount = 0;
        showToast(
            appState.lang === 'ru'
                ? `Открываем Админ-панель (${reached} нажатий)...`
                : `Admin panel ochilmoqda (${reached} marta bosildi)...`
        );
        openAdminPanelRoute();
        return;
    }
    brandTapTimer = setTimeout(() => {
        brandTapCount = 0;
    }, 1800);
}

function isAdminPathRequested() {
    const path = (window.location.pathname || '').replace(/\/+$/, '');
    return window.location.hash === '#/admin' || window.location.hash === '#admin' || path.endsWith('/admin');
}

function navigateTo(sectionId, event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const validSections = ['home', 'simulator', 'booking', 'queue', 'reviews'];
    const nextSection = validSections.includes(sectionId) ? sectionId : 'home';

    if (isAdminPathRequested()) {
        window.location.hash = `#/${nextSection}`;
    } else {
        window.location.hash = `#${nextSection}`;
    }

    const adminView = document.getElementById('adminView');
    const clientView = document.getElementById('clientView');
    if (adminView) adminView.classList.add('hidden');
    if (clientView) clientView.classList.remove('hidden');

    applyActiveSectionSlot(nextSection, true);
}

function applyActiveSectionSlot(sectionId, shouldScroll = false) {
    const validSections = ['home', 'simulator', 'booking', 'queue', 'reviews'];
    const activeSection = validSections.includes(sectionId) ? sectionId : 'home';
    const slotSections = ['simulator', 'booking', 'queue', 'reviews'];

    const homeEl = document.getElementById('home');
    if (homeEl) {
        homeEl.classList.remove('hidden');
    }

    slotSections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (activeSection === id) {
            el.classList.remove('hidden');
            el.classList.remove('motion-enter');
            void el.offsetWidth;
            el.classList.add('motion-enter');
        } else {
            el.classList.add('hidden');
            el.classList.remove('motion-enter');
        }
    });

    if (shouldScroll) {
        if (activeSection === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.getElementById(activeSection);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
}

function exitAdminRoute() {
    window.location.hash = '#/home';
    syncRouteView();
    applyActiveSectionSlot('home', true);
}

function syncRouteView() {
    const isAdmin = isAdminPathRequested();
    const clientView = document.getElementById('clientView');
    const adminView = document.getElementById('adminView');

    if (isAdmin) {
        clientView.classList.add('hidden');
        adminView.classList.remove('hidden');
        adminView.classList.remove('motion-enter');
        void adminView.offsetWidth;
        adminView.classList.add('motion-enter');
        updateAdminAuthUI();
    } else {
        adminView.classList.add('hidden');
        clientView.classList.remove('hidden');
        const hashClean = (window.location.hash || '').replace(/^#\/?/, '');
        applyActiveSectionSlot(hashClean || 'home', false);
    }
}

window.addEventListener('hashchange', syncRouteView);
window.addEventListener('popstate', syncRouteView);

function populateCarSelects() {
    const selects = [
        document.getElementById('simCarSelect'),
        document.getElementById('calcCar'),
        document.getElementById('bCar'),
        document.getElementById('admCar')
    ];

    selects.forEach((sel) => {
        if (!sel) return;
        const prevVal = sel.value;
        sel.innerHTML = '';
        appState.cars.forEach((car) => {
            const opt = document.createElement('option');
            opt.value = car.id;
            opt.textContent = car.name;
            sel.appendChild(opt);
        });
        if (prevVal && appState.cars.some((c) => c.id === prevVal)) {
            sel.value = prevVal;
        }
    });

    if (!appState.cars.some((c) => c.id === appState.simCarId) && appState.cars[0]) {
        appState.simCarId = appState.cars[0].id;
    }
    document.getElementById('simCarSelect').value = appState.simCarId;
}

function setSimTint(percent) {
    appState.simTint = [5, 15, 35, 70].includes(Number(percent)) ? Number(percent) : 35;
    saveState();
    updateSimulator();
}

function applySimulatorPhotoPreset(url) {
    if (!url || !url.trim()) return;
    appState.simPhotoUrl = url.trim();
    saveState();
    updateSimulator();
}

function updateSimulator() {
    const carSelect = document.getElementById('simCarSelect');
    if (carSelect && carSelect.value && appState.simCarId !== carSelect.value) {
        appState.simCarId = carSelect.value;
        saveState();
    }
    const carObj = appState.cars.find((c) => c.id === appState.simCarId) || appState.cars[0];
    const tint = appState.simTint;

    document.querySelectorAll('.sim-tint-btn').forEach((btn) => {
        const t = Number(btn.getAttribute('data-tint'));
        if (t === tint) {
            btn.className = 'sim-tint-btn py-2.5 rounded-xl border border-gold bg-gold text-obsidian text-xs sm:text-sm font-bold transition';
        } else {
            btn.className = 'sim-tint-btn py-2.5 rounded-xl border border-white/15 bg-charcoal text-xs sm:text-sm font-bold text-gray-200 hover:border-gold transition';
        }
    });

    const opacityMap = { 5: 0.78, 15: 0.62, 35: 0.42, 70: 0.18 };
    const descMapUz = {
        5: '5% — Juda qora (Limo)',
        15: '15% — Qoraytirilgan',
        35: '35% — O‘rta qoraytirish',
        70: '70% — Yengil atermal'
    };
    const descMapRu = {
        5: '5% — Глубокое (Limo)',
        15: '15% — Темное',
        35: '35% — Среднее',
        70: '70% — Легкое атермальное'
    };

    const overlayLayer = document.getElementById('tintOverlayLayer');
    if (overlayLayer) {
        overlayLayer.style.opacity = String(opacityMap[tint] ?? 0.42);
    }

    const activePhotoUrl = (appState.simPhotoUrl || carObj?.photoUrl || DEFAULT_SIM_PHOTO_URL).trim();
    const photoEl = document.getElementById('simulatorPhotoImg');
    const presetSelect = document.getElementById('simPhotoPresetSelect');
    if (presetSelect) {
        const matchOpt = Array.from(presetSelect.options).find((o) => o.value === activePhotoUrl);
        presetSelect.value = matchOpt ? matchOpt.value : '';
    }
    if (photoEl && activePhotoUrl) {
        photoEl.classList.add('motion-window-stage');
        const notice = document.getElementById('simPhotoFallbackNotice');
        if (notice) notice.classList.add('hidden');
        if (photoEl.getAttribute('src') !== activePhotoUrl) {
            photoEl.setAttribute('src', activePhotoUrl);
        } else if (photoEl.complete && photoEl.naturalWidth === 0) {
            handleSimulatorPhotoError();
        }
    }

    const roleText = appState.lang === 'ru'
        ? (appState.masterInfo?.ruRole || 'Специалист 30 лет')
        : (appState.masterInfo?.uzRole || '30 yoshlik mutaxassis');
    const expText = appState.lang === 'ru'
        ? (appState.masterInfo?.ruExp || '5+ лет опыта')
        : (appState.masterInfo?.uzExp || '5+ yillik tajriba');

    const captionEl = document.getElementById('simMasterCaption');
    if (captionEl) captionEl.textContent = `${roleText} • ${expText}`;

    const pctLabelEl = document.getElementById('simOverlayPercentLabel');
    if (pctLabelEl) pctLabelEl.textContent = `${tint}%`;

    const liveZoneBadgeEl = document.getElementById('simLiveScrollZoneBadge');
    const steps = (typeof appState !== 'undefined' && appState.lang === 'ru') ? motionWindowStepsRu : motionWindowStepsUz;
    if (liveZoneBadgeEl && steps[activeMotionStep]) {
        liveZoneBadgeEl.textContent = steps[activeMotionStep].solarText;
    }

    document.getElementById('simActiveCarLabel').textContent = carObj ? carObj.name : 'Chevrolet Malibu';
    document.getElementById('simActiveTintBadge').textContent = `${tint}%`;
    document.getElementById('simTintDescription').textContent = appState.lang === 'ru' ? descMapRu[tint] : descMapUz[tint];

    applyMotionZoneVisuals(activeMotionStep);

    const calcTintEl = document.getElementById('calcTint');
    if (calcTintEl) {
        calcTintEl.value = String(tint);
        recalculatePrice();
    }
}

const motionWindowStepsUz = [
    {
        title: '1-bosqich: Mashina umumiy ko‘rinishi',
        solarText: '10% quyosh o‘tkazish',
        desc: 'Saytga kirildi — mashina turibdi. Pastga scroll qiling: old oyna yaqinlashadi va 10% quyosh o‘tkazish ko‘rsatiladi.',
        scale: 1.0,
        tx: '0%',
        ty: '0%'
    },
    {
        title: '2-bosqich: Old oyna yaqinlashdi',
        solarText: '10% quyosh o‘tkazish',
        desc: 'Old oyna yaqinlashdi — 10% quyosh o‘tkazish. Yana pastga scroll qilsangiz, old shofyоr tarafi yaqinlashadi.',
        scale: 1.32,
        tx: '0%',
        ty: '-6%'
    },
    {
        title: '3-bosqich: Old shofyоr tarafi yaqinlashdi',
        solarText: '20% quyosh o‘tkazish',
        desc: 'Old shofyоr oynasi yaqinlashdi — 20% quyosh o‘tkazish. Davom etsangiz, orqa yon oyna va asosiy saytga o‘tadi.',
        scale: 1.48,
        tx: '-9%',
        ty: '-5%'
    },
    {
        title: '4-bosqich: Orqa yon oyna — Asosiy saytga o‘tilmoqda',
        solarText: '35% quyosh o‘tkazish',
        desc: '35% quyosh o‘tkazish ko‘rsatildi — endi asosiy sayt bo‘limiga (Simulyator va Kalkulyator) o‘tilmoqda.',
        scale: 1.38,
        tx: '8%',
        ty: '-4%'
    }
];

const motionWindowStepsRu = [
    {
        title: 'Шаг 1: Общий вид автомобиля',
        solarText: '10% пропускание солнца',
        desc: 'Вход на сайт — автомобиль на месте. Прокрутите вниз: лобовое стекло приблизится и покажет 10% пропускания солнца.',
        scale: 1.0,
        tx: '0%',
        ty: '0%'
    },
    {
        title: 'Шаг 2: Приближение лобового стекла',
        solarText: '10% пропускание солнца',
        desc: 'Лобовое стекло приближено — 10% пропускание солнца. Прокрутите дальше для фокуса на сторону водителя.',
        scale: 1.28,
        tx: '0%',
        ty: '-6%'
    },
    {
        title: 'Шаг 3: Сторона водителя',
        solarText: '20% пропускание солнца',
        desc: 'Сторона водителя приближена — 20% пропускание солнца. Далее — переход к основному разделу сайта.',
        scale: 1.42,
        tx: '-8%',
        ty: '-5%'
    },
    {
        title: 'Шаг 4: Заднее боковое — Переход на основной сайт',
        solarText: '35% пропускание солнца',
        desc: 'Показано 35% пропускания солнца — выполняется переход к основному разделу сайта.',
        scale: 1.35,
        tx: '7%',
        ty: '-4%'
    }
];

let activeMotionStep = 0;
let hasAutoEnteredMainSite = false;
let introMotionTimer = null;

function enterMainSiteAfterMotion() {
    if (hasAutoEnteredMainSite) return;
    hasAutoEnteredMainSite = true;
    const target = document.getElementById('simulator') || document.getElementById('booking');
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function replayIntroMotionSequence() {
    hasAutoEnteredMainSite = false;
    activeMotionStep = 0;
    applyMotionZoneVisuals(0);
    const homeEl = document.getElementById('home');
    if (homeEl) {
        homeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (introMotionTimer) {
        clearInterval(introMotionTimer);
    }
    let stepCounter = 0;
    introMotionTimer = setInterval(() => {
        stepCounter += 1;
        if (stepCounter < motionWindowStepsUz.length) {
            activeMotionStep = stepCounter;
            applyMotionZoneVisuals(activeMotionStep);
        } else {
            clearInterval(introMotionTimer);
            introMotionTimer = null;
            setTimeout(() => enterMainSiteAfterMotion(), 550);
        }
    }, 1050);
}

function applyMotionZoneVisuals(stepIndex) {
    const steps = (typeof appState !== 'undefined' && appState.lang === 'ru')
        ? motionWindowStepsRu
        : motionWindowStepsUz;
    const safeIdx = Math.max(0, Math.min(steps.length - 1, Number(stepIndex) || 0));
    const step = steps[safeIdx];

    const photoEl = document.getElementById('simulatorPhotoImg');
    if (photoEl) {
        photoEl.style.transformOrigin = '55% 42%';
        photoEl.style.transform = `translate3d(${step.tx}, ${step.ty}, 0) scale(${step.scale})`;
    }

    const titleEl = document.getElementById('motionZoneTitle');
    const badgeEl = document.getElementById('motionSolarPassBadge');
    const descEl = document.getElementById('motionZoneDesc');
    const nextBtn = document.getElementById('motionNextStepBtn');

    if (titleEl) {
        titleEl.textContent = step.title;
        titleEl.classList.remove('motion-step-pop');
        void titleEl.offsetWidth;
        titleEl.classList.add('motion-step-pop');
    }
    if (badgeEl) {
        badgeEl.textContent = step.solarText;
        badgeEl.classList.remove('motion-step-pop');
        void badgeEl.offsetWidth;
        badgeEl.classList.add('motion-step-pop');
    }
    const liveZoneBadgeEl = document.getElementById('simLiveScrollZoneBadge');
    if (liveZoneBadgeEl) {
        liveZoneBadgeEl.textContent = step.solarText;
    }
    if (descEl) {
        descEl.textContent = step.desc;
    }
    if (nextBtn) {
        nextBtn.textContent = (typeof appState !== 'undefined' && appState.lang === 'ru')
            ? 'Следующее окно →'
            : 'Keyingi oyna →';
    }

    document.querySelectorAll('.motion-step-pill').forEach((pill, i) => {
        if (i === safeIdx) {
            pill.className = 'motion-step-pill px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gold text-obsidian transition';
        } else {
            pill.className = 'motion-step-pill px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/10 text-gray-300 hover:text-white transition';
        }
    });
}

function setMotionZoneStep(idx) {
    activeMotionStep = idx;
    applyMotionZoneVisuals(activeMotionStep);
    if (idx >= motionWindowStepsUz.length - 1) {
        setTimeout(() => enterMainSiteAfterMotion(), 550);
    }
}

function cycleMotionZoneStep() {
    if (activeMotionStep >= motionWindowStepsUz.length - 1) {
        enterMainSiteAfterMotion();
        return;
    }
    activeMotionStep = activeMotionStep + 1;
    applyMotionZoneVisuals(activeMotionStep);
    if (activeMotionStep === motionWindowStepsUz.length - 1) {
        setTimeout(() => enterMainSiteAfterMotion(), 600);
    }
}

function handleScrollWindowMotion() {
    if (isAdminPathRequested()) return;
    const stage = document.getElementById('simulatorPhotoImg');
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const docEl = document.documentElement;
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const maxScroll = Math.max(1, (docEl.scrollHeight || 0) - vh);
    const scrollRatio = scrollTop / maxScroll;

    const sectionProgress = Math.max(0, Math.min(1, (vh * 0.78 - rect.top) / (vh * 0.9)));
    const combined = Math.max(sectionProgress, Math.min(0.99, scrollTop / 850));
    const nextStep = Math.min(3, Math.floor(combined * 4));
    if (nextStep !== activeMotionStep) {
        activeMotionStep = nextStep;
        applyMotionZoneVisuals(activeMotionStep);
    }

    if (!hasAutoEnteredMainSite && scrollTop > 260 && (nextStep === 3 || scrollRatio >= 0.85)) {
        setTimeout(() => enterMainSiteAfterMotion(), 450);
    }
}

window.addEventListener('scroll', handleScrollWindowMotion, { passive: true });

function setCoverage(cov) {
    appState.calcCoverage = cov;
    saveState();
    document.querySelectorAll('.cov-btn').forEach((btn) => {
        if (btn.getAttribute('data-cov') === cov) {
            btn.className = 'cov-btn py-3 px-4 rounded-xl border border-gold bg-gold/15 text-gold-light text-xs sm:text-sm font-semibold text-center transition';
        } else {
            btn.className = 'cov-btn py-3 px-4 rounded-xl border border-white/15 bg-obsidian text-gray-300 text-xs sm:text-sm font-semibold text-center hover:border-gold/50 transition';
        }
    });
    recalculatePrice();
}

function computeOrderPrice(carId, tint, coverage) {
    const car = appState.cars.find((c) => c.id === carId) || appState.cars[0];
    const base = car ? Number(car.basePrice || 1100000) : 1100000;
    const tMult = Number(appState.tintMultipliers[tint] || 1);
    const cMult = Number(appState.coverageMultipliers[coverage] || 1);
    return Math.round((base * tMult * cMult) / 10000) * 10000;
}

function recalculatePrice() {
    const carId = document.getElementById('calcCar').value;
    const tint = Number(document.getElementById('calcTint').value);
    const cov = appState.calcCoverage;
    const total = computeOrderPrice(carId, tint, cov);

    document.getElementById('calcPriceDisplay').textContent = formatUZS(total);
    const car = appState.cars.find((c) => c.id === carId);
    document.getElementById('calcBreakdownText').textContent =
        `${car ? car.name : ''} • ${tint}% • ${cov === 'rear' ? (appState.lang === 'ru' ? 'Задние' : 'Orqa') : cov === 'full_side' ? (appState.lang === 'ru' ? 'Боковые' : 'Yon oynalar') : (appState.lang === 'ru' ? 'Комплекс' : 'Kompleks')}`;
}

function applyCalculatorToBooking() {
    document.getElementById('bCar').value = document.getElementById('calcCar').value;
    document.getElementById('bTint').value = document.getElementById('calcTint').value;
    document.getElementById('bCov').value = appState.calcCoverage;
    renderTimeSlots();
    updateTelegramPreview();
    saveBookingDraft();
    navigateTo('booking');
}

function generateSlots06To22() {
    const slots = [];
    for (let hour = 6; hour <= 21; hour++) {
        const hh = String(hour).padStart(2, '0');
        slots.push(`${hh}:00`);
        slots.push(`${hh}:30`);
    }
    slots.push('22:00');
    return slots;
}

function isSlotBlockedByLunch(slot) {
    if (!appState.lunchBreak.active) return false;
    const resume = appState.lunchBreak.resumeTime || '13:00';
    return slot >= '12:00' && slot < resume;
}

function renderTimeSlots() {
    const dateVal = document.getElementById('bDate').value || getTodayISO();
    const grid = document.getElementById('timeSlotsGrid');
    const hiddenInput = document.getElementById('bSlot');
    const hint = document.getElementById('slotHint');
    grid.innerHTML = '';

    const bookedSet = new Set(
        appState.orders
            .filter((o) => o.date === dateVal && o.status !== 'cancelled')
            .map((o) => o.slot)
    );

    if (hiddenInput.value && (bookedSet.has(hiddenInput.value) || isSlotBlockedByLunch(hiddenInput.value))) {
        hiddenInput.value = '';
    }

    const slots = generateSlots06To22();
    hint.textContent = appState.lunchBreak.active
        ? (appState.lang === 'ru' ? `Обед с 12:00 до ${appState.lunchBreak.resumeTime}` : `Tushlik 12:00 dan ${appState.lunchBreak.resumeTime} gacha`)
        : '06:00 — 22:00';

    slots.forEach((slot) => {
        const isBooked = bookedSet.has(slot);
        const isLunch = isSlotBlockedByLunch(slot);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = slot;

        if (isBooked || isLunch) {
            btn.disabled = true;
            btn.title = isLunch ? 'Tushlik vaqti' : 'Band';
            btn.className = 'py-2 px-2 rounded-xl border border-white/5 bg-white/[0.02] text-gray-600 text-xs font-semibold line-through cursor-not-allowed';
        } else {
            const isSelected = hiddenInput.value === slot;
            btn.className = isSelected
                ? 'py-2 px-2 rounded-xl border border-gold bg-gold text-obsidian text-xs font-extrabold transition'
                : 'py-2 px-2 rounded-xl border border-white/15 bg-obsidian text-gray-200 hover:border-gold text-xs font-semibold transition';
            btn.onclick = () => {
                hiddenInput.value = slot;
                saveBookingDraft();
                renderTimeSlots();
                updateTelegramPreview();
            };
        }
        grid.appendChild(btn);
    });
}

function buildTelegramMessage(order) {
    return [
        '🚗 YANGI BUYURTMA — PREMIUM TINT',
        `👤 Mijoz: ${order.name}`,
        `📞 Telefon: ${order.phone}`,
        `🚘 Mashina: ${order.carName}`,
        `🔢 Davlat raqami: ${order.plate}`,
        `🎨 Rangi: ${order.color}`,
        `🌑 Plyonka: ${order.tint}%`,
        `🕒 Vaqt: ${order.date} | ${order.slot}`,
        `💰 Taxminiy narx: ${Number(order.price).toLocaleString('ru-RU').replace(/,/g, ' ')} so‘m`
    ].join('\n');
}

function updateTelegramPreview() {
    const sampleOrder = {
        name: document.getElementById('bName')?.value.trim() || 'Azizbek Karimov',
        phone: document.getElementById('bPhone')?.value.trim() || '+998 90 123 45 67',
        carName: (appState.cars.find((c) => c.id === document.getElementById('bCar')?.value) || appState.cars[0])?.name || 'Chevrolet Malibu',
        plate: (document.getElementById('bPlate')?.value.trim() || '01 A 777 AA').toUpperCase(),
        color: document.getElementById('bColor')?.value.trim() || 'Qora',
        tint: document.getElementById('bTint')?.value || '35',
        date: document.getElementById('bDate')?.value || getTodayISO(),
        slot: document.getElementById('bSlot')?.value || '10:00',
        price: computeOrderPrice(
            document.getElementById('bCar')?.value || appState.cars[0]?.id,
            Number(document.getElementById('bTint')?.value || 35),
            document.getElementById('bCov')?.value || 'rear'
        )
    };
    document.getElementById('tgPreviewBox').textContent = buildTelegramMessage(sampleOrder);
}

async function dispatchTelegramNotification(text) {
    const logEntry = {
        id: 'TG-' + Date.now(),
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        text,
        delivered: false
    };

    if (!appState.telegram.enabled) {
        logEntry.statusNote = 'O‘chirilgan';
        appState.telegram.logs.unshift(logEntry);
        saveState();
        return;
    }

    const token = (appState.telegram.botToken || '').trim();
    const chatId = (appState.telegram.chatId || '').trim();

    if (token && chatId) {
        try {
            const resp = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text })
            });
            const data = await resp.json();
            logEntry.delivered = Boolean(data && data.ok);
            logEntry.statusNote = logEntry.delivered ? 'Telegram API yuborildi' : 'API javob bermadi';
        } catch (err) {
            logEntry.delivered = false;
            logEntry.statusNote = 'Tarmoq/API xatosi (lokal saqlandi)';
        }
    } else {
        logEntry.delivered = true;
        logEntry.statusNote = 'Navbatga/Jurnalga tushdi (Token/Chat ID kiritilmagan)';
    }

    appState.telegram.logs = appState.telegram.logs.slice(0, 29);
    appState.telegram.logs.unshift(logEntry);
    saveState();
    renderAdminAll();
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    const slot = document.getElementById('bSlot').value;
    if (!slot) {
        showToast(appState.lang === 'ru' ? 'Пожалуйста, выберите свободное время!' : 'Iltimos, bo‘sh vaqtni tanlang!', 'error');
        return;
    }

    const carObj = appState.cars.find((c) => c.id === document.getElementById('bCar').value) || appState.cars[0];
    const tint = Number(document.getElementById('bTint').value);
    const coverage = document.getElementById('bCov').value;

    const newOrder = {
        id: 'ORD-' + Math.floor(100 + Math.random() * 900),
        name: document.getElementById('bName').value.trim(),
        phone: document.getElementById('bPhone').value.trim(),
        carId: carObj.id,
        carName: carObj.name,
        plate: document.getElementById('bPlate').value.trim().toUpperCase(),
        color: document.getElementById('bColor').value.trim(),
        tint,
        coverage,
        date: document.getElementById('bDate').value || getTodayISO(),
        slot,
        price: computeOrderPrice(carObj.id, tint, coverage),
        status: 'waiting',
        startedAt: null
    };

    appState.orders.unshift(newOrder);
    saveState();
    clearBookingDraft();

    await dispatchTelegramNotification(buildTelegramMessage(newOrder));

    document.getElementById('bookingForm').reset();
    document.getElementById('bDate').value = getTodayISO();
    document.getElementById('bSlot').value = '';
    renderTimeSlots();
    renderLiveQueue();
    renderAdminAll();
    updateTelegramPreview();

    showToast(appState.lang === 'ru' ? 'Заявка отправлена в Админ и Telegram!' : 'Buyurtma Admin panel va Telegram botga yuborildi!');
}

function renderLunchBanner() {
    const banner = document.getElementById('lunchBreakBanner');
    const titleEl = document.getElementById('lunchBannerTitle');
    const resumeEl = document.getElementById('lunchBannerResume');
    const badgeEl = document.getElementById('lunchBannerBadge');

    if (!appState.lunchBreak.active) {
        banner.classList.add('hidden');
        return;
    }

    banner.classList.remove('hidden');
    const resumeTime = appState.lunchBreak.resumeTime || '13:00';
    if (appState.lang === 'ru') {
        titleEl.textContent = 'Сейчас обеденное время';
        resumeEl.textContent = `Работа возобновится в ${resumeTime}.`;
        badgeEl.textContent = `Обед • выход в ${resumeTime}`;
    } else {
        titleEl.textContent = 'Hozir tushlik vaqti';
        resumeEl.textContent = `Ish soat ${resumeTime} da davom etadi.`;
        badgeEl.textContent = `Tushlik • ${resumeTime} da chiqish`;
    }
}

function renderLiveQueue() {
    renderLunchBanner();
    const query = (document.getElementById('queueSearchInput').value || '').trim().toLowerCase();
    const grid = document.getElementById('liveQueueGrid');
    grid.innerHTML = '';

    const activeOrders = appState.orders.filter((o) => o.status !== 'cancelled');
    const queueBadge = document.getElementById('headerQueueBadge');
    if (queueBadge) {
        queueBadge.textContent = String(activeOrders.length);
    }

    const filtered = activeOrders.filter((o) => {
        if (!query) return true;
        return (
            (o.plate || '').toLowerCase().includes(query) ||
            (o.carName || '').toLowerCase().includes(query) ||
            (o.color || '').toLowerCase().includes(query)
        );
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full gold-card rounded-2xl p-6 text-center text-sm text-gray-400">${appState.lang === 'ru' ? 'Машины не найдены' : 'Mos keluvchi mashina topilmadi'}</div>`;
        return;
    }

    filtered.forEach((order) => {
        let statusBadge = '';
        let extraInfo = '';

        if (order.status === 'in_progress') {
            statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-gold/20 text-gold-light border border-gold/40">${appState.lang === 'ru' ? 'В процессе' : 'Jarayonda'}</span>`;
            extraInfo = order.startedAt
                ? `<div class="text-xs text-gold-light mt-2">${appState.lang === 'ru' ? 'Начало работ:' : 'Ish boshlangan vaqt:'} <span class="font-mono font-bold">${order.startedAt}</span></div>`
                : '';
        } else if (order.status === 'completed') {
            statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">${appState.lang === 'ru' ? 'Готово' : 'Tayyor'}</span>`;
            extraInfo = `<div class="text-xs text-emerald-300 mt-2">${appState.lang === 'ru' ? 'Тонировка завершена' : 'Plyonka tortish yakunlangan'}</div>`;
        } else {
            statusBadge = `<span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-200 border border-white/15">${appState.lang === 'ru' ? 'В очереди' : 'Navbatda'}</span>`;
            extraInfo = `<div class="text-xs text-gray-400 mt-2">${appState.lang === 'ru' ? 'Время записи:' : 'Navbat vaqti:'} <span class="font-mono text-white">${order.slot}</span></div>`;
        }

        const card = document.createElement('div');
        card.className = 'gold-card rounded-2xl p-5 flex flex-col justify-between';
        card.innerHTML = `
            <div>
                <div class="flex items-start justify-between gap-2">
                    <div>
                        <div class="text-base font-extrabold text-white">${order.carName}</div>
                        <div class="text-xs text-gray-400 mt-0.5">${order.color} • <span class="text-gold font-semibold">${order.tint}%</span></div>
                    </div>
                    ${statusBadge}
                </div>
                <div class="mt-3 inline-block px-3 py-1 rounded-lg bg-obsidian border border-white/15 font-mono text-xs font-bold tracking-wider text-white">
                    ${order.plate}
                </div>
                ${extraInfo}
            </div>
        `;
        grid.appendChild(card);
    });
}

function setReviewRating(starVal) {
    currentReviewRating = starVal;
    document.getElementById('ratingValueLabel').textContent = `${starVal} / 5`;
    document.querySelectorAll('.star-btn').forEach((btn) => {
        const s = Number(btn.getAttribute('data-star'));
        btn.className = s <= starVal ? 'star-btn text-2xl text-gold transition' : 'star-btn text-2xl text-gray-600 transition';
    });
}

function handleReviewSubmit(event) {
    event.preventDefault();
    const rev = {
        id: 'REV-' + Date.now(),
        name: document.getElementById('rName').value.trim(),
        carPlate: document.getElementById('rCarPlate').value.trim(),
        rating: currentReviewRating,
        comment: document.getElementById('rComment').value.trim(),
        approved: true
    };
    appState.reviews.unshift(rev);
    saveState();
    document.getElementById('reviewForm').reset();
    setReviewRating(5);
    renderReviews();
    renderAdminReviews();
    showToast(appState.lang === 'ru' ? 'Спасибо за отзыв!' : 'Reyting va izohingiz qo‘shildi!');
}

function renderReviews() {
    const container = document.getElementById('reviewsList');
    const summaryEl = document.getElementById('avgRatingSummary');
    const approved = appState.reviews.filter((r) => r.approved);

    if (approved.length > 0) {
        const avg = (approved.reduce((acc, r) => acc + Number(r.rating || 5), 0) / approved.length).toFixed(1);
        summaryEl.textContent = `★ ${avg} / 5 (${approved.length})`;
    } else {
        summaryEl.textContent = '';
    }

    container.innerHTML = '';
    if (approved.length === 0) {
        container.innerHTML = `<div class="col-span-full gold-card rounded-2xl p-6 text-sm text-gray-400">${appState.lang === 'ru' ? 'Отзывов пока нет' : 'Hali izohlar yo‘q'}</div>`;
        return;
    }

    approved.forEach((r) => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const div = document.createElement('div');
        div.className = 'gold-card rounded-2xl p-5 space-y-2';
        div.innerHTML = `
            <div class="flex items-center justify-between gap-2">
                <div class="font-bold text-sm text-white">${r.name}</div>
                <div class="text-gold text-sm tracking-tight">${stars}</div>
            </div>
            <div class="text-xs text-gold-light/80">${r.carPlate}</div>
            <p class="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">${r.comment}</p>
        `;
        container.appendChild(div);
    });
}

function updateAdminAuthUI() {
    const loginBox = document.getElementById('adminLoginBox');
    const dash = document.getElementById('adminDashboard');
    if (appState.adminAuthenticated) {
        loginBox.classList.add('hidden');
        dash.classList.remove('hidden');
        renderAdminAll();
    } else {
        dash.classList.add('hidden');
        loginBox.classList.remove('hidden');
    }
}

function handleAdminLogin(event) {
    event.preventDefault();
    const pass = document.getElementById('adminPasswordInput').value;
    if (pass === ADMIN_PASS) {
        appState.adminAuthenticated = true;
        saveState();
        document.getElementById('adminPasswordInput').value = '';
        updateAdminAuthUI();
        showToast('Admin panelga xush kelibsiz!');
    } else {
        showToast('Parol noto‘g‘ri!', 'error');
    }
}

function handleAdminLogout() {
    appState.adminAuthenticated = false;
    saveState();
    updateAdminAuthUI();
}

function renderAdminAll() {
    if (!appState.adminAuthenticated) return;
    renderAdminKPIs();
    renderAdminLunchControl();
    renderAdminMasterAndMedia();
    renderAdminOrdersTable();
    renderAdminCars();
    renderAdminTelegram();
    renderAdminWorkshopAndSocials();
    renderAdminReviews();
}

function renderAdminMasterAndMedia() {
    const masterUzEl = document.getElementById('admMasterUz');
    const expUzEl = document.getElementById('admExpUz');
    const photoUrlEl = document.getElementById('admSimPhotoUrl');
    if (masterUzEl) masterUzEl.value = appState.masterInfo?.uzRole || '30 yoshlik mutaxassis';
    if (expUzEl) expUzEl.value = appState.masterInfo?.uzExp || '5+ yillik tajriba';
    if (photoUrlEl) photoUrlEl.value = appState.simPhotoUrl || '';
}

function saveMasterAndMediaSettings() {
    const masterVal = (document.getElementById('admMasterUz').value || '').trim() || '30 yoshlik mutaxassis';
    const expVal = (document.getElementById('admExpUz').value || '').trim() || '5+ yillik tajriba';
    const photoUrl = (document.getElementById('admSimPhotoUrl').value || '').trim();

    appState.masterInfo = {
        ...appState.masterInfo,
        uzRole: masterVal,
        uzExp: expVal
    };
    if (photoUrl) {
        appState.simPhotoUrl = photoUrl;
    }
    saveState();
    setLanguage(appState.lang || 'uz');
    showToast('Usta ma’lumotlari va rasm havolasi saqlandi');
}

function renderAdminKPIs() {
    const total = appState.orders.length;
    const inProg = appState.orders.filter((o) => o.status === 'in_progress').length;
    const comp = appState.orders.filter((o) => o.status === 'completed').length;
    const revenue = appState.orders
        .filter((o) => o.status === 'completed')
        .reduce((sum, o) => sum + Number(o.price || 0), 0);

    document.getElementById('kpiTotalOrders').textContent = String(total);
    document.getElementById('kpiInProgress').textContent = String(inProg);
    document.getElementById('kpiCompleted').textContent = String(comp);
    document.getElementById('kpiRevenue').textContent = formatUZS(revenue);
}

function renderAdminLunchControl() {
    document.getElementById('adminLunchResumeTime').value = appState.lunchBreak.resumeTime || '13:00';
    const btn = document.getElementById('adminLunchToggleBtn');
    if (appState.lunchBreak.active) {
        btn.textContent = 'Tushlikni yakunlash (Ishga qaytish)';
        btn.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 hover:bg-emerald-500/30';
    } else {
        btn.textContent = 'Tushlikni yoqish';
        btn.className = 'px-4 py-2.5 rounded-xl text-xs font-bold transition bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30';
    }
}

function toggleLunchBreak() {
    appState.lunchBreak.active = !appState.lunchBreak.active;
    appState.lunchBreak.resumeTime = document.getElementById('adminLunchResumeTime').value || '13:00';
    saveState();
    renderAdminLunchControl();
    renderLiveQueue();
    renderTimeSlots();
    showToast(appState.lunchBreak.active ? `Tushlik vaqti yoqildi (${appState.lunchBreak.resumeTime} da davom etadi)` : 'Tushlik vaqti yakunlandi');
}

function saveLunchSettings() {
    appState.lunchBreak.resumeTime = document.getElementById('adminLunchResumeTime').value || '13:00';
    saveState();
    renderLiveQueue();
    renderTimeSlots();
}

function resetAdminOrderForm() {
    document.getElementById('admEditId').value = '';
    document.getElementById('adminOrderForm').reset();
    document.getElementById('adminOrderFormTitle').textContent = 'Yangi buyurtma qo‘shish / Navbatga kiritish';
}

function editOrderInAdmin(orderId) {
    const ord = appState.orders.find((o) => o.id === orderId);
    if (!ord) return;
    document.getElementById('admEditId').value = ord.id;
    document.getElementById('admName').value = ord.name;
    document.getElementById('admPhone').value = ord.phone;
    document.getElementById('admCar').value = ord.carId;
    document.getElementById('admPlate').value = ord.plate;
    document.getElementById('admColor').value = ord.color;
    document.getElementById('admTint').value = String(ord.tint);
    document.getElementById('admSlot').value = ord.slot;
    document.getElementById('adminOrderFormTitle').textContent = `Buyurtmani tahrirlash (${ord.id})`;
}

async function handleAdminOrderSave(event) {
    event.preventDefault();
    const editId = document.getElementById('admEditId').value;
    const carObj = appState.cars.find((c) => c.id === document.getElementById('admCar').value) || appState.cars[0];
    const tint = Number(document.getElementById('admTint').value);
    const name = document.getElementById('admName').value.trim();
    const phone = document.getElementById('admPhone').value.trim();
    const plate = document.getElementById('admPlate').value.trim().toUpperCase();
    const color = document.getElementById('admColor').value.trim();
    const slot = document.getElementById('admSlot').value.trim();
    const price = computeOrderPrice(carObj.id, tint, 'rear');

    if (editId) {
        const idx = appState.orders.findIndex((o) => o.id === editId);
        if (idx !== -1) {
            appState.orders[idx] = {
                ...appState.orders[idx],
                name,
                phone,
                carId: carObj.id,
                carName: carObj.name,
                plate,
                color,
                tint,
                slot,
                price
            };
        }
        showToast('Buyurtma yangilandi');
    } else {
        const newOrd = {
            id: 'ORD-' + Math.floor(100 + Math.random() * 900),
            name,
            phone,
            carId: carObj.id,
            carName: carObj.name,
            plate,
            color,
            tint,
            coverage: 'rear',
            date: getTodayISO(),
            slot,
            price,
            status: 'waiting',
            startedAt: null
        };
        appState.orders.unshift(newOrd);
        await dispatchTelegramNotification(buildTelegramMessage(newOrd));
        showToast('Yangi buyurtma qo‘shildi va Telegram botga yuborildi');
    }

    saveState();
    resetAdminOrderForm();
    renderAdminAll();
    renderLiveQueue();
    renderTimeSlots();
}

async function setOrderWorkflowStatus(orderId, nextStatus) {
    const ord = appState.orders.find((o) => o.id === orderId);
    if (!ord) return;

    ord.status = nextStatus;
    if (nextStatus === 'in_progress' && !ord.startedAt) {
        ord.startedAt = new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
        await dispatchTelegramNotification(`🛠 ISH BOSHLANDI: ${ord.carName} (${ord.plate}) — ${ord.startedAt}`);
    } else if (nextStatus === 'completed') {
        await dispatchTelegramNotification(`✅ ISH YAKUNLANDI: ${ord.carName} (${ord.plate}) — Tayyor!`);
    }

    saveState();
    renderAdminAll();
    renderLiveQueue();
    renderTimeSlots();
}

function renderAdminOrdersTable() {
    const tbody = document.getElementById('adminOrdersTableBody');
    tbody.innerHTML = '';

    appState.orders.forEach((o) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-white/[0.02]';

        let stLabel = 'Navbatda';
        let stColor = 'text-gray-300 bg-white/10';
        if (o.status === 'in_progress') {
            stLabel = `Jarayonda (${o.startedAt || ''})`;
            stColor = 'text-gold-light bg-gold/15';
        } else if (o.status === 'completed') {
            stLabel = 'Tayyor';
            stColor = 'text-emerald-300 bg-emerald-500/15';
        } else if (o.status === 'cancelled') {
            stLabel = 'Bekor qilingan';
            stColor = 'text-red-300 bg-red-500/15';
        }

        tr.innerHTML = `
            <td class="py-3 pr-3">
                <div class="font-bold text-white">${o.name}</div>
                <div class="text-xs text-gray-400">${o.phone}</div>
            </td>
            <td class="py-3 px-3 font-medium text-white">${o.carName}</td>
            <td class="py-3 px-3">
                <div class="font-mono text-xs font-bold text-gold-light">${o.plate}</div>
                <div class="text-xs text-gray-400">${o.color}</div>
            </td>
            <td class="py-3 px-3 text-xs">
                <div>${o.slot}</div>
                <div class="text-gray-400">${o.tint}%</div>
            </td>
            <td class="py-3 px-3 font-semibold text-white whitespace-nowrap">${formatUZS(o.price)}</td>
            <td class="py-3 px-3">
                <span class="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${stColor}">${stLabel}</span>
            </td>
            <td class="py-3 pl-3 text-right whitespace-nowrap space-x-1.5">
                <button onclick="setOrderWorkflowStatus('${o.id}', 'in_progress')" class="px-2.5 py-1.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-gold-light text-xs font-bold">Ishni boshlash</button>
                <button onclick="setOrderWorkflowStatus('${o.id}', 'completed')" class="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold">Yakunlash</button>
                <button onclick="setOrderWorkflowStatus('${o.id}', 'cancelled')" class="px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 text-xs font-bold">Bekor</button>
                <button onclick="editOrderInAdmin('${o.id}')" class="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-semibold">Tahrir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderAdminCars() {
    const list = document.getElementById('adminCarsList');
    list.innerHTML = '';
    appState.cars.forEach((car, idx) => {
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between gap-3 bg-obsidian border border-white/10 rounded-xl px-3.5 py-2.5';
        row.innerHTML = `
            <span class="text-xs sm:text-sm font-semibold text-white">${car.name}</span>
            <div class="flex items-center gap-2">
                <input type="number" step="50000" value="${car.basePrice}" onchange="updateCarPrice(${idx}, this.value)" class="w-32 bg-charcoal border border-white/15 rounded-lg px-2.5 py-1 text-xs text-gold-light font-semibold">
                <span class="text-xs text-gray-400">so‘m</span>
            </div>
        `;
        list.appendChild(row);
    });
}

function updateCarPrice(idx, newVal) {
    appState.cars[idx].basePrice = Number(newVal || 1000000);
    saveState();
    recalculatePrice();
    showToast('Narx yangilandi');
}

function handleAddCarModel(event) {
    event.preventDefault();
    const name = document.getElementById('newCarName').value.trim();
    const price = Number(document.getElementById('newCarPrice').value);
    if (!name || !price) return;
    appState.cars.push({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Date.now().toString().slice(-3),
        name,
        basePrice: price,
        type: 'sedan',
        photoUrl: DEFAULT_SIM_PHOTO_URL
    });
    saveState();
    document.getElementById('newCarName').value = '';
    document.getElementById('newCarPrice').value = '';
    populateCarSelects();
    renderAdminCars();
    recalculatePrice();
    showToast('Yangi mashina modeli qo‘shildi');
}

function renderAdminTelegram() {
    document.getElementById('tgBotToken').value = appState.telegram.botToken || '';
    document.getElementById('tgChatId').value = appState.telegram.chatId || '';
    document.getElementById('tgEnabledCheckbox').checked = Boolean(appState.telegram.enabled);

    const logsEl = document.getElementById('tgLogsContainer');
    logsEl.innerHTML = '';
    if (!appState.telegram.logs || appState.telegram.logs.length === 0) {
        logsEl.innerHTML = `<div class="text-xs text-gray-500">Hali xabar yuborilmagan</div>`;
        return;
    }
    appState.telegram.logs.forEach((l) => {
        const item = document.createElement('div');
        item.className = 'p-2.5 rounded-xl bg-obsidian border border-white/10 text-[11px] space-y-1';
        item.innerHTML = `
            <div class="flex items-center justify-between text-gray-400">
                <span class="font-mono">${l.time}</span>
                <span class="text-gold-light font-semibold">${l.statusNote || 'Yuborildi'}</span>
            </div>
            <div class="text-gray-200 whitespace-pre-line line-clamp-3">${l.text}</div>
        `;
        logsEl.appendChild(item);
    });
}

function saveTelegramSettings() {
    appState.telegram.botToken = (document.getElementById('tgBotToken').value || '').trim();
    appState.telegram.chatId = (document.getElementById('tgChatId').value || '').trim();
    appState.telegram.enabled = Boolean(document.getElementById('tgEnabledCheckbox').checked);
    saveState();
    showToast('Telegram bot sozlamalari saqlandi');
}

async function sendTestTelegram() {
    const testMsg = [
        '🔔 TEST XABAR — PREMIUM TINT',
        `📍 Manzil: ${appState.workshopAddress}`,
        `🕒 Ish vaqti: 06:00 — 22:00`,
        '✅ Telegram integratsiya tekshiruvi muvaffaqiyatli!'
    ].join('\n');
    await dispatchTelegramNotification(testMsg);
    showToast('Test xabar yuborildi (jurnalni tekshiring)');
}

function normalizeSocialUrl(raw, platform) {
    const val = (raw || '').trim();
    if (!val) {
        if (platform === 'telegram') return 'https://t.me/';
        if (platform === 'instagram') return 'https://instagram.com/';
        if (platform === 'facebook') return 'https://facebook.com/';
        return '';
    }
    if (/^https?:\/\//i.test(val)) return val;
    const cleanHandle = val.replace(/^@/, '');
    if (platform === 'telegram') return `https://t.me/${cleanHandle}`;
    if (platform === 'instagram') return `https://instagram.com/${cleanHandle}`;
    if (platform === 'facebook') return `https://facebook.com/${cleanHandle}`;
    return `https://${val}`;
}

function applyWorkshopAndSocialDisplay() {
    const addr = appState.workshopAddress || 'Andijon sh, Jalaquduq tumani, Yorqishloq shahri';
    const encoded = encodeURIComponent(addr);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

    const heroAddr = document.getElementById('heroAddressText');
    const heroMap = document.getElementById('heroMapLink');
    const footerAddr = document.getElementById('footerAddressLink');

    if (heroAddr) heroAddr.textContent = addr;
    if (heroMap) heroMap.href = mapUrl;
    if (footerAddr) {
        footerAddr.textContent = addr;
        footerAddr.href = mapUrl;
    }

    const tgBtn = document.getElementById('socialTelegramBtn');
    const igBtn = document.getElementById('socialInstagramBtn');
    const fbBtn = document.getElementById('socialFacebookBtn');
    const exBtn = document.getElementById('socialExtraBtn');

    if (tgBtn) tgBtn.href = normalizeSocialUrl(appState.socials?.telegram, 'telegram');
    if (igBtn) igBtn.href = normalizeSocialUrl(appState.socials?.instagram, 'instagram');
    if (fbBtn) fbBtn.href = normalizeSocialUrl(appState.socials?.facebook, 'facebook');

    if (exBtn) {
        const extraRaw = (appState.socials?.extra || '').trim();
        if (extraRaw) {
            exBtn.href = normalizeSocialUrl(extraRaw, 'extra');
            exBtn.classList.remove('hidden');
        } else {
            exBtn.classList.add('hidden');
        }
    }
}

function renderAdminWorkshopAndSocials() {
    const addrInput = document.getElementById('admWorkshopAddress');
    const tgInput = document.getElementById('admSocialTelegram');
    const igInput = document.getElementById('admSocialInstagram');
    const fbInput = document.getElementById('admSocialFacebook');
    const exInput = document.getElementById('admSocialExtra');

    if (addrInput) addrInput.value = appState.workshopAddress || 'Andijon sh, Jalaquduq tumani, Yorqishloq shahri';
    if (tgInput) tgInput.value = appState.socials?.telegram || '';
    if (igInput) igInput.value = appState.socials?.instagram || '';
    if (fbInput) fbInput.value = appState.socials?.facebook || '';
    if (exInput) exInput.value = appState.socials?.extra || '';
}

function saveWorkshopAndSocialSettings() {
    appState.workshopAddress = (document.getElementById('admWorkshopAddress').value || '').trim() || 'Andijon sh, Jalaquduq tumani, Yorqishloq shahri';
    appState.socials = {
        telegram: (document.getElementById('admSocialTelegram').value || '').trim(),
        instagram: (document.getElementById('admSocialInstagram').value || '').trim(),
        facebook: (document.getElementById('admSocialFacebook').value || '').trim(),
        extra: (document.getElementById('admSocialExtra').value || '').trim()
    };
    saveState();
    applyWorkshopAndSocialDisplay();
    showToast('Manzil va ijtimoiy tarmoq havolalari saqlandi');
}

function toggleReviewApproval(reviewId) {
    const rev = appState.reviews.find((r) => r.id === reviewId);
    if (!rev) return;
    rev.approved = !rev.approved;
    saveState();
    renderAdminReviews();
    renderReviews();
}

function deleteReviewById(reviewId) {
    appState.reviews = appState.reviews.filter((r) => r.id !== reviewId);
    saveState();
    renderAdminReviews();
    renderReviews();
    showToast('Izoh o‘chirildi');
}

function renderAdminReviews() {
    const box = document.getElementById('adminReviewsList');
    box.innerHTML = '';
    appState.reviews.forEach((r) => {
        const div = document.createElement('div');
        div.className = 'p-4 rounded-2xl bg-obsidian border border-white/10 flex items-start justify-between gap-3';
        div.innerHTML = `
            <div class="space-y-1">
                <div class="text-xs font-bold text-white">${r.name} • <span class="text-gold">${'★'.repeat(r.rating)}</span></div>
                <div class="text-[11px] text-gray-400">${r.carPlate}</div>
                <p class="text-xs text-gray-300">${r.comment}</p>
            </div>
            <div class="flex flex-col gap-1.5 shrink-0">
                <button onclick="toggleReviewApproval('${r.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold ${r.approved ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-white/10 text-gray-300'}">
                    ${r.approved ? 'Chop etilgan' : 'Yashirilgan'}
                </button>
                <button onclick="deleteReviewById('${r.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25">
                    O‘chirish
                </button>
            </div>
        `;
        box.appendChild(div);
    });
}

function downloadSiteHtmlBundle() {
    try {
        const fullHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
        const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'premium-tint-index.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showToast('Sayt fayli (premium-tint-index.html) yuklab olindi!');
    } catch (e) {
        showToast('Faylni yuklab olishda xatolik yuz berdi', 'error');
    }
}

window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY && event.newValue) {
        try {
            appState = sanitizeState(JSON.parse(event.newValue));
            populateCarSelects();
            renderTimeSlots();
            renderLiveQueue();
            renderReviews();
            applyWorkshopAndSocialDisplay();
            updateTelegramPreview();
            if (appState.adminAuthenticated) {
                renderAdminAll();
            }
        } catch (e) {
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('footerYear').textContent = String(new Date().getFullYear());
    document.getElementById('bDate').value = getTodayISO();

    populateCarSelects();
    restoreBookingDraft();
    renderAdminMasterAndMedia();
    updateSimulator();
    setCoverage(appState.calcCoverage);
    renderTimeSlots();
    renderLiveQueue();
    renderReviews();
    updateTelegramPreview();
    applyWorkshopAndSocialDisplay();
    setLanguage(appState.lang || 'uz');
    syncRouteView();

    ['bName', 'bPhone', 'bCar', 'bPlate', 'bColor', 'bTint', 'bCov', 'bDate'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                saveBookingDraft();
                updateTelegramPreview();
            });
            el.addEventListener('change', () => {
                saveBookingDraft();
                updateTelegramPreview();
            });
        }
    });
});
