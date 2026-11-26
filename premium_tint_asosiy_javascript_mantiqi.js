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

window.handleSimulatorPhotoLoad = handleSimulatorPhotoLoad;
window.handleSimulatorPhotoError = handleSimulatorPhotoError;

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
            ruName: 'Маруфжон Кудратов',
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
                tint: '35%',
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
                tint: '15%',
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
                tint: '70% Solntsezashchita',
                coverage: 'rear',
                date: getTodayISO(),
                slot: '06:30',
                price: 1485000,
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

    const oldUzRole = String(parsed.masterInfo?.uzRole || '');
    const oldRuRole = String(parsed.masterInfo?.ruRole || '');

    const safeCars = Array.isArray(parsed.cars) && parsed.cars.length > 0
        ? parsed.cars
            .filter((c) => c && typeof c === 'object' && String(c.name || '').trim())
            .map((c, idx) => ({
                id: String(c.id || `car_${idx}_${Date.now()}`),
                name: String(c.name).trim(),
                basePrice: Number(c.basePrice) > 0 ? Number(c.basePrice) : 1100000,
                type: c.type === 'suv' ? 'suv' : 'sedan',
                photoUrl: typeof c.photoUrl === 'string' && c.photoUrl.trim() ? c.photoUrl.trim() : DEFAULT_SIM_PHOTO_URL
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
            tint: String(o.tint || '35%'),
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
            uzName: String(parsed.masterInfo?.uzName ?? base.masterInfo.uzName).trim() || base.masterInfo.uzName,
            ruName: String(parsed.masterInfo?.ruName ?? base.masterInfo.ruName).trim() || base.masterInfo.ruName,
            phone: String(parsed.masterInfo?.phone ?? base.masterInfo.phone).trim() || base.masterInfo.phone,
            uzRole: (!oldUzRole || oldUzRole === '30 yoshlik mutaxassis') ? base.masterInfo.uzRole : oldUzRole,
            uzExp: String(parsed.masterInfo?.uzExp ?? base.masterInfo.uzExp).trim() || base.masterInfo.uzExp,
            ruRole: (!oldRuRole || oldRuRole === 'Специалист 30 лет') ? base.masterInfo.ruRole : oldRuRole,
            ruExp: String(parsed.masterInfo?.ruExp ?? base.masterInfo.ruExp).trim() || base.masterInfo.ruExp
        },
        workshopAddress: String(parsed.workshopAddress ?? base.workshopAddress).trim() || base.workshopAddress,
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
let activeAdminTab = 'all';

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        return true;
    } catch (e) {
        return false;
    }
}

function commitState(mutatorFn) {
    if (typeof mutatorFn === 'function') {
        mutatorFn(appState);
    }
    appState = sanitizeState(appState);
    saveState();
}

function formatUZS(amount) {
    return Number(amount || 0).toLocaleString('ru-RU').replace(/,/g, ' ') + (appState.lang === 'ru' ? ' сум' : ' so‘m');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    const borderColor = type === 'error'
        ? 'border-red-500/50 text-red-200 bg-red-950/95'
        : 'border-gold/50 text-gold-light bg-[#16161D]/95';
    el.className = `pointer-events-auto border ${borderColor} rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold shadow-2xl backdrop-blur-md transition-all`;
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 250);
    }, 3400);
}

/* ==================== PAROL OYNASI VA 5 MARTA BOSISH ==================== */
let brandTapCount = 0;
let brandTapTimer = null;

function openAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    const input = document.getElementById('adminPassInput');
    const err = document.getElementById('adminLoginError');
    if (err) err.classList.add('hidden');
    if (modal) modal.classList.remove('hidden');
    if (input) {
        input.value = '';
        input.type = 'password';
        const toggleBtn = document.getElementById('togglePassBtn');
        if (toggleBtn) toggleBtn.textContent = appState.lang === 'ru' ? 'Показать' : 'Ko‘rsatish';
        setTimeout(() => input.focus(), 60);
    }
}

function closeAdminLoginModal() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) modal.classList.add('hidden');
}

function setAdminTab(tabName) {
    const allowed = ['all', 'profile', 'cars', 'orders', 'reviews'];
    activeAdminTab = allowed.includes(tabName) ? tabName : 'all';

    document.querySelectorAll('.adm-tab-btn').forEach((btn) => {
        const isSelected = btn.getAttribute('data-adm-tab') === activeAdminTab;
        btn.className = isSelected
            ? 'adm-tab-btn px-4 py-2.5 min-h-[40px] rounded-xl bg-gold text-obsidian whitespace-nowrap shrink-0 transition'
            : 'adm-tab-btn px-4 py-2.5 min-h-[40px] rounded-xl bg-charcoal border border-white/15 text-gray-200 hover:text-white whitespace-nowrap shrink-0 transition';
    });

    const map = {
        profile: 'adminSectionProfile',
        cars: 'adminSectionCars',
        orders: 'adminSectionOrders',
        reviews: 'adminSectionReviews'
    };

    document.querySelectorAll('.admin-panel-section').forEach((sec) => {
        if (activeAdminTab === 'all') {
            sec.classList.remove('hidden');
        } else {
            sec.classList.toggle('hidden', sec.id !== map[activeAdminTab]);
        }
    });
}

function revealAdminPanelSection() {
    const adminView = document.getElementById('adminView');
    if (!adminView) return;
    adminView.classList.remove('hidden');
    adminView.classList.remove('motion-enter');
    void adminView.offsetWidth;
    adminView.classList.add('motion-enter');
    syncAdminInputsFromState();
    renderAdminDashboard();
    setAdminTab(activeAdminTab);
    adminView.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitAdminLogin(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }
    const input = document.getElementById('adminPassInput');
    const err = document.getElementById('adminLoginError');
    const entered = String(input?.value || '').trim();

    if (entered === ADMIN_PASS) {
        commitState((st) => {
            st.adminAuthenticated = true;
        });
        if (err) err.classList.add('hidden');
        closeAdminLoginModal();
        revealAdminPanelSection();
        showToast(appState.lang === 'ru' ? 'Вход в Админ-панель выполнен' : 'Admin panelga muvaffaqiyatli kirildi');
    } else {
        if (err) err.classList.remove('hidden');
        showToast(appState.lang === 'ru' ? 'Неверный пароль!' : 'Parol noto‘g‘ri!', 'error');
    }
}

function logoutAdminPanel() {
    commitState((st) => {
        st.adminAuthenticated = false;
    });
    const adminView = document.getElementById('adminView');
    if (adminView) adminView.classList.add('hidden');
    showToast(appState.lang === 'ru' ? 'Админ-панель закрыта' : 'Admin panel yopildi');
}

function resetDemoState() {
    appState = createDefaultState();
    saveState();
    populateCarSelects();
    setLanguage(appState.lang);
    renderLiveQueue();
    renderReviews();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Данные сброшены к стандарту' : 'Ma’lumotlar standart holatga qaytarildi');
}

function handleBrandSecretTap() {
    brandTapCount += 1;
    if (brandTapTimer) {
        clearTimeout(brandTapTimer);
    }
    if (brandTapCount >= 5) {
        brandTapCount = 0;
        if (appState.adminAuthenticated) {
            revealAdminPanelSection();
            showToast(appState.lang === 'ru' ? 'Открываем Админ-панель...' : 'Admin panel ochilmoqda...');
        } else {
            openAdminLoginModal();
        }
        return;
    }
    brandTapTimer = setTimeout(() => {
        brandTapCount = 0;
    }, 1800);
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
        hero_desc: 'Malibu, Gentra, Cobalt, Tracker va boshqa mashinalar uchun quyoshdan himoya va oyna qoraytirish xizmati. 70% gacha Solntsezashchita standarti va shaffof navbat.',
        master_role_label: 'Usta / Mutaxassis',
        master_exp_label: 'Tajriba',
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
        book_sub: 'Ma’lumotlarni kiriting — ariza darhol Admin panel va navbat ro‘yxatiga qo‘shiladi.',
        f_name: 'Ismingiz *',
        f_phone: 'Telefon raqami *',
        f_car: 'Avtomobil rusumi *',
        f_plate: 'Davlat raqami *',
        f_tint: 'Qoraytirish / Himoya *',
        f_date: 'Sana *',
        f_slot: 'Vaqt oralig‘i (06:00 — 22:00) *',
        permit_full: 'Solntsezashchita (quyoshdan himoya) standarti: yorug‘lik o‘tkazish ko‘rsatkichi 70% gacha ruxsat etilgan — undan past ko‘rsatkich jarimaga sabab bo‘ladi. Orqa yon va orqa oynalar qonuniy me’yorlar asosida qoraytiriladi, ruxsatnoma BHM asosida rasmiylashtiriladi.'
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
        hero_desc: 'Солнцезащита и тонировка для Malibu, Gentra, Cobalt, Tracker и других авто. Стандарт солнцезащиты до 70% и прозрачная очередь.',
        master_role_label: 'Мастер / Специалист',
        master_exp_label: 'Опыт',
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
        book_sub: 'Заполните данные — заявка сразу попадет в Админ-панель и очередь.',
        f_name: 'Ваше имя *',
        f_phone: 'Телефон *',
        f_car: 'Модель авто *',
        f_plate: 'Госномер *',
        f_tint: 'Пленка / % *',
        f_date: 'Дата *',
        f_slot: 'Свободное время (06:00 — 22:00) *',
        permit_full: 'Стандарт солнцезащиты: пропускание света разрешено до 70% — показатель ниже приводит к штрафу. Задние боковые и заднее стекла обслуживаются по нормам, разрешение оформляется на основе БРВ.'
    }
};

function setLanguage(lang) {
    commitState((st) => {
        st.lang = lang === 'ru' ? 'ru' : 'uz';
    });

    const uzBtn = document.getElementById('langUzBtn');
    const ruBtn = document.getElementById('langRuBtn');
    if (uzBtn && ruBtn) {
        if (appState.lang === 'uz') {
            uzBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition bg-gold text-obsidian';
            ruBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition text-gray-300 hover:text-white';
        } else {
            ruBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition bg-gold text-obsidian';
            uzBtn.className = 'px-2.5 py-2 min-h-[36px] rounded-[10px] transition text-gray-300 hover:text-white';
        }
    }

    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.getAttribute('data-i18n');
        if (i18n[appState.lang] && i18n[appState.lang][key]) {
            node.textContent = i18n[appState.lang][key];
        }
    });

    const heroFullNameEl = document.getElementById('heroMasterFullName');
    const heroPhoneEl = document.getElementById('heroMasterPhone');
    const heroMasterEl = document.getElementById('heroMasterText');
    const heroExpEl = document.getElementById('heroExpText');
    const heroAddrEl = document.getElementById('heroAddressText');
    const heroMapEl = document.getElementById('heroMapLink');

    if (heroFullNameEl) {
        heroFullNameEl.textContent = appState.lang === 'ru'
            ? (appState.masterInfo?.ruName || 'Маруфжон Кудратов')
            : (appState.masterInfo?.uzName || "Ma'rufjon Kudratov");
    }
    if (heroPhoneEl && appState.masterInfo?.phone) {
        heroPhoneEl.textContent = appState.masterInfo.phone;
        heroPhoneEl.href = 'tel:' + appState.masterInfo.phone.replace(/\s+/g, '');
    }
    if (heroMasterEl) {
        heroMasterEl.textContent = appState.lang === 'ru'
            ? (appState.masterInfo?.ruRole || 'Специалист 28 лет')
            : (appState.masterInfo?.uzRole || '28 yoshlik mutaxassis');
    }
    if (heroExpEl) {
        heroExpEl.textContent = appState.lang === 'ru'
            ? (appState.masterInfo?.ruExp || '5+ лет опыта')
            : (appState.masterInfo?.uzExp || '5+ yillik tajriba');
    }
    if (heroAddrEl && appState.workshopAddress) {
        heroAddrEl.textContent = appState.workshopAddress;
    }
    if (heroMapEl && appState.workshopAddress) {
        heroMapEl.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(appState.workshopAddress);
    }

    const permitEl = document.getElementById('permitInfoText');
    if (permitEl) permitEl.textContent = i18n[appState.lang].permit_full;

    updateQueueBadge();
    populateTimeSlots();
    updateSimulator();
    recalculatePrice();
    renderLiveQueue();
    renderReviews();
}

/* ==================== MOTION ZOOM (1-4 BOSQICH) ==================== */
const motionWindowStepsUz = [
    {
        title: '1-bosqich: Mashina umumiy ko‘rinishi',
        solarText: '10% quyosh o‘tkazish',
        desc: 'Mashina umumiy ko‘rinishi. Pastga bosing yoki scroll qiling: old oyna yaqinlashadi va 10% quyosh o‘tkazish ko‘rsatiladi.',
        scale: 1.0,
        tx: '0%',
        ty: '0%'
    },
    {
        title: '2-bosqich: Old oyna yaqinlashdi',
        solarText: '10% quyosh o‘tkazish',
        desc: 'Old oyna yaqinlashdi — 10% quyosh o‘tkazish. Yana bosing: old shofyоr tomoni yaqinlashib 20% quyosh o‘tkazish ko‘rsatiladi.',
        scale: 1.28,
        tx: '0%',
        ty: '-6%'
    },
    {
        title: '3-bosqich: Old shofyоr tarafi yaqinlashdi',
        solarText: '20% quyosh o‘tkazish',
        desc: 'Old shofyоr oynasi yaqinlashdi — 20% quyosh o‘tkazish. Keyingi bosqichda orqa yon oyna va 35% ko‘rsatkich ko‘rinadi.',
        scale: 1.42,
        tx: '-8%',
        ty: '-5%'
    },
    {
        title: '4-bosqich: Orqa yon oyna — 35% quyosh o‘tkazish',
        solarText: '35% quyosh o‘tkazish',
        desc: 'Orqa yon oyna va 35% quyosh o‘tkazish ko‘rsatildi. 70% gacha Solntsezashchita esa qonuniy quyoshdan himoya standartidir.',
        scale: 1.35,
        tx: '7%',
        ty: '-4%'
    }
];

const motionWindowStepsRu = [
    {
        title: 'Шаг 1: Общий вид автомобиля',
        solarText: '10% пропускание солнца',
        desc: 'Общий вид автомобиля. Нажмите или прокрутите: лобовое стекло приблизится и покажет 10% пропускания солнца.',
        scale: 1.0,
        tx: '0%',
        ty: '0%'
    },
    {
        title: 'Шаг 2: Приближение лобового стекла',
        solarText: '10% пропускание солнца',
        desc: 'Лобовое стекло приближено — 10% пропускание солнца. Далее — сторона водителя и 20% пропускания солнца.',
        scale: 1.28,
        tx: '0%',
        ty: '-6%'
    },
    {
        title: 'Шаг 3: Сторона водителя',
        solarText: '20% пропускание солнца',
        desc: 'Сторона водителя приближена — 20% пропускание солнца. Далее — заднее боковое стекло и 35%.',
        scale: 1.42,
        tx: '-8%',
        ty: '-5%'
    },
    {
        title: 'Шаг 4: Заднее боковое — 35% пропускание солнца',
        solarText: '35% пропускание солнца',
        desc: 'Показано 35% пропускания солнца. Стандарт солнцезащиты разрешен до 70%.',
        scale: 1.35,
        tx: '7%',
        ty: '-4%'
    }
];

let activeMotionStep = 0;
let introMotionTimer = null;

function applyMotionZoneVisuals(stepIndex) {
    const safeIdx = Math.max(0, Math.min(3, Number(stepIndex) || 0));
    activeMotionStep = safeIdx;
    const steps = appState.lang === 'ru' ? motionWindowStepsRu : motionWindowStepsUz;
    const step = steps[safeIdx];

    const titleEl = document.getElementById('motionZoneTitle');
    const badgeEl = document.getElementById('motionSolarPassBadge');
    const liveBadgeEl = document.getElementById('simLiveScrollZoneBadge');
    const descEl = document.getElementById('motionZoneDesc');
    const imgEl = document.getElementById('simulatorPhotoImg');

    if (titleEl) titleEl.textContent = step.title;
    if (badgeEl) badgeEl.textContent = step.solarText;
    if (liveBadgeEl) liveBadgeEl.textContent = step.solarText;
    if (descEl) descEl.textContent = step.desc;

    if (imgEl) {
        imgEl.style.transform = `scale(${step.scale}) translate(${step.tx}, ${step.ty})`;
    }

    document.querySelectorAll('.motion-step-pill').forEach((pill, i) => {
        pill.className = i === safeIdx
            ? 'motion-step-pill px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold bg-gold text-obsidian transition'
            : 'motion-step-pill px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold bg-white/10 text-gray-300 hover:text-white transition';
    });
}

function setMotionZoneStep(idx) {
    applyMotionZoneVisuals(idx);
}

function cycleMotionZoneStep() {
    applyMotionZoneVisuals((activeMotionStep + 1) % 4);
}

function replayIntroMotionSequence() {
    if (introMotionTimer) clearInterval(introMotionTimer);
    applyMotionZoneVisuals(0);
    let idx = 0;
    introMotionTimer = setInterval(() => {
        idx += 1;
        if (idx < 4) {
            applyMotionZoneVisuals(idx);
        } else {
            clearInterval(introMotionTimer);
            introMotionTimer = null;
        }
    }, 950);
    showToast(appState.lang === 'ru' ? 'Анимация запущена' : 'Animatsiya boshlandi');
}

/* ==================== SIMULYATOR VA KALKULYATOR ==================== */
function populateCarSelects() {
    ['simCarSelect', 'calcCar', 'bCar'].forEach((id) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        const prevVal = sel.value;
        sel.innerHTML = '';
        appState.cars.forEach((car) => {
            const opt = document.createElement('option');
            opt.value = car.id;
            opt.textContent = `${car.name} — ${formatUZS(car.basePrice)}`;
            sel.appendChild(opt);
        });
        if (id === 'simCarSelect') {
            sel.value = appState.cars.some((c) => c.id === appState.simCarId) ? appState.simCarId : appState.cars[0].id;
        } else if (prevVal && appState.cars.some((c) => c.id === prevVal)) {
            sel.value = prevVal;
        }
    });
}

function populateTimeSlots() {
    const slotSel = document.getElementById('bSlot');
    if (!slotSel) return;
    const prev = slotSel.value;
    slotSel.innerHTML = '';
    for (let h = 6; h <= 21; h++) {
        ['00', '30'].forEach((m) => {
            const val = `${String(h).padStart(2, '0')}:${m}`;
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            slotSel.appendChild(opt);
        });
    }
    if (prev) slotSel.value = prev;
}

function setSimTint(percent) {
    commitState((st) => {
        st.simTint = [5, 15, 35, 70].includes(Number(percent)) ? Number(percent) : 35;
    });
    updateSimulator();
}

function applySimulatorPhotoPreset(url) {
    if (!url || !url.trim()) return;
    commitState((st) => {
        st.simPhotoUrl = url.trim();
    });
    updateSimulator();
}

function updateSimulator() {
    const simSel = document.getElementById('simCarSelect');
    const selectedId = simSel ? simSel.value : appState.simCarId;
    if (selectedId && selectedId !== appState.simCarId) {
        commitState((st) => {
            st.simCarId = selectedId;
        });
    }

    const carObj = appState.cars.find((c) => c.id === appState.simCarId) || appState.cars[0];
    const tint = appState.simTint;

    document.querySelectorAll('.sim-tint-btn').forEach((btn) => {
        const t = Number(btn.getAttribute('data-tint'));
        btn.className = t === tint
            ? 'sim-tint-btn py-2.5 min-h-[42px] rounded-xl border border-gold bg-gold text-obsidian text-xs sm:text-sm font-bold transition'
            : 'sim-tint-btn py-2.5 min-h-[42px] rounded-xl border border-white/15 bg-charcoal text-xs sm:text-sm font-bold text-gray-200 hover:border-gold transition';
    });

    const opacityMap = { 5: 0.78, 15: 0.62, 35: 0.42, 70: 0.18 };
    const descMapUz = {
        5: '5% — Juda qora (Limo)',
        15: '15% — Qoraytirilgan',
        35: '35% — O‘rta qoraytirish',
        70: '70% — Solntsezashchita (Quyoshdan himoya standarti)'
    };
    const descMapRu = {
        5: '5% — Глубокое (Limo)',
        15: '15% — Темное',
        35: '35% — Среднее',
        70: '70% — Солнцезащита (Стандарт до 70%)'
    };

    const overlay = document.getElementById('tintOverlayLayer');
    if (overlay) overlay.style.opacity = String(opacityMap[tint] ?? 0.42);

    const activePhotoUrl = (appState.simPhotoUrl || carObj?.photoUrl || DEFAULT_SIM_PHOTO_URL).trim();
    const img = document.getElementById('simulatorPhotoImg');
    if (img && img.getAttribute('src') !== activePhotoUrl) {
        img.setAttribute('src', activePhotoUrl);
    }

    const masterFullName = appState.lang === 'ru'
        ? (appState.masterInfo?.ruName || 'Маруфжон Кудратов')
        : (appState.masterInfo?.uzName || "Ma'rufjon Kudratov");
    const roleText = appState.lang === 'ru'
        ? (appState.masterInfo?.ruRole || 'Специалист 28 лет')
        : (appState.masterInfo?.uzRole || '28 yoshlik mutaxassis');
    const expText = appState.lang === 'ru'
        ? (appState.masterInfo?.ruExp || '5+ лет опыта')
        : (appState.masterInfo?.uzExp || '5+ yillik tajriba');

    const cap = document.getElementById('simMasterCaption');
    if (cap) cap.textContent = `${masterFullName} • ${roleText} • ${expText}`;

    const carLabel = document.getElementById('simActiveCarLabel');
    const tintBadge = document.getElementById('simActiveTintBadge');
    const pctLabel = document.getElementById('simOverlayPercentLabel');
    const tintDescEl = document.getElementById('simTintDescription');

    if (carLabel) carLabel.textContent = carObj ? carObj.name : 'Chevrolet Malibu';
    if (tintBadge) tintBadge.textContent = `${tint}%`;
    if (pctLabel) pctLabel.textContent = `${tint}%`;
    if (tintDescEl) {
        tintDescEl.textContent = appState.lang === 'ru' ? descMapRu[tint] : descMapUz[tint];
    }

    applyMotionZoneVisuals(activeMotionStep);
}

function setCoverage(cov) {
    commitState((st) => {
        st.calcCoverage = ['rear', 'full_side', 'full_car'].includes(cov) ? cov : 'rear';
    });
    document.querySelectorAll('.cov-btn').forEach((btn) => {
        const active = btn.getAttribute('data-cov') === appState.calcCoverage;
        btn.className = active
            ? 'cov-btn py-3 px-4 min-h-[44px] rounded-xl border border-gold bg-gold/15 text-gold-light text-xs sm:text-sm font-semibold text-center transition'
            : 'cov-btn py-3 px-4 min-h-[44px] rounded-xl border border-white/15 bg-obsidian text-gray-300 text-xs sm:text-sm font-semibold text-center hover:border-gold/50 transition';
    });
    recalculatePrice();
}

function recalculatePrice() {
    const carId = document.getElementById('calcCar')?.value || appState.simCarId;
    const tintKey = Number(document.getElementById('calcTint')?.value || appState.simTint || 35);
    const car = appState.cars.find((c) => c.id === carId) || appState.cars[0];
    const tMult = Number(appState.tintMultipliers[tintKey] || 1.0);
    const cMult = Number(appState.coverageMultipliers[appState.calcCoverage] || 1.0);
    const total = Math.round(((car?.basePrice || 1100000) * tMult * cMult) / 1000) * 1000;

    const priceEl = document.getElementById('calcPriceDisplay');
    if (priceEl) priceEl.textContent = formatUZS(total);

    const breakdownEl = document.getElementById('calcBreakdownText');
    if (breakdownEl && car) {
        const tintNote = tintKey === 70 ? '70% Solntsezashchita' : `${tintKey}%`;
        breakdownEl.textContent = `${car.name} • ${tintNote} • ×${(tMult * cMult).toFixed(2)}`;
    }
    return total;
}

function applyCalculatorToBooking() {
    const carId = document.getElementById('calcCar')?.value;
    const tintVal = document.getElementById('calcTint')?.value;
    const bCar = document.getElementById('bCar');
    const bTint = document.getElementById('bTint');
    if (bCar && carId) bCar.value = carId;
    if (bTint && tintVal) {
        bTint.value = tintVal === '70' ? '70% Solntsezashchita' : `${tintVal}%`;
    }
    navigateTo('booking');
}

/* ==================== BUYURTMA, NAVBAT VA SHARHLAR ==================== */
function updateQueueBadge() {
    const badge = document.getElementById('headerQueueBadge');
    if (!badge) return;
    const activeCount = appState.orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;
    badge.textContent = String(activeCount);
}

function handleBookingSubmit(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const name = document.getElementById('bName')?.value?.trim();
    const phone = document.getElementById('bPhone')?.value?.trim();
    const carId = document.getElementById('bCar')?.value || appState.cars[0]?.id || 'malibu';
    const plate = document.getElementById('bPlate')?.value?.trim().toUpperCase();
    const tintRaw = document.getElementById('bTint')?.value || '35%';
    const date = document.getElementById('bDate')?.value || getTodayISO();
    const slot = document.getElementById('bSlot')?.value || '09:00';

    if (!name || !phone || !plate) {
        showToast(appState.lang === 'ru' ? 'Заполните обязательные поля' : 'Majburiy maydonlarni to‘ldiring', 'error');
        return;
    }

    const car = appState.cars.find((c) => c.id === carId) || appState.cars[0];
    const tintNum = parseInt(String(tintRaw), 10) || 35;
    const tMult = Number(appState.tintMultipliers[tintNum] || 1.0);
    const cMult = Number(appState.coverageMultipliers[appState.calcCoverage] || 1.0);
    const price = Math.round(((car?.basePrice || 1100000) * tMult * cMult) / 1000) * 1000;

    commitState((st) => {
        st.orders.unshift({
            id: 'ORD-' + Date.now().toString().slice(-5),
            name,
            phone,
            carId: car?.id || carId,
            carName: car?.name || carId,
            plate,
            color: '',
            tint: tintRaw,
            coverage: st.calcCoverage,
            date,
            slot,
            price,
            status: 'waiting',
            startedAt: null
        });
    });

    updateQueueBadge();
    renderLiveQueue();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Заявка добавлена в очередь!' : 'Buyurtma saqlandi va navbatga qo‘shildi!');
    event.target.reset();
    const dateInput = document.getElementById('bDate');
    if (dateInput) dateInput.value = getTodayISO();
}

function renderLiveQueue() {
    const container = document.getElementById('queueListContainer');
    const banner = document.getElementById('lunchBreakBanner');
    if (banner) {
        banner.classList.toggle('hidden', !appState.lunchBreak?.active);
        if (appState.lunchBreak?.active) {
            banner.textContent = appState.lang === 'ru'
                ? `Обеденный перерыв • Возврат: ${appState.lunchBreak.resumeTime || '13:00'}`
                : `Tushlik tanaffusi • Ishga qaytish: ${appState.lunchBreak.resumeTime || '13:00'}`;
        }
    }
    if (!container) return;

    const activeOrders = appState.orders.filter((o) => o.status !== 'cancelled');
    if (activeOrders.length === 0) {
        container.innerHTML = `<div class="gold-card rounded-2xl p-5 text-xs text-gray-400">${appState.lang === 'ru' ? 'В очереди пока нет машин.' : 'Hozircha navbatda mashina yo‘q.'}</div>`;
        return;
    }

    const statusLabelUz = {
        waiting: 'Navbatda kutmoqda',
        in_progress: 'Jarayonda',
        completed: 'Yakunlangan'
    };
    const statusLabelRu = {
        waiting: 'В очереди',
        in_progress: 'В работе',
        completed: 'Завершено'
    };

    container.innerHTML = activeOrders.map((ord) => {
        const sText = appState.lang === 'ru' ? (statusLabelRu[ord.status] || ord.status) : (statusLabelUz[ord.status] || ord.status);
        return `
            <div class="gold-card rounded-2xl p-4 space-y-2 min-w-0">
                <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-extrabold text-gold">${ord.plate}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-gray-200">${sText}</span>
                </div>
                <div class="text-sm font-bold text-white truncate">${ord.carName} • ${ord.tint}</div>
                <div class="text-xs text-gray-400">${ord.name} • ${ord.date} (${ord.slot})</div>
                <div class="text-xs font-semibold text-gold-light pt-1">${formatUZS(ord.price)}</div>
            </div>
        `;
    }).join('');
}

function handleReviewSubmit(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const name = document.getElementById('revName')?.value?.trim();
    const carPlate = document.getElementById('revCarPlate')?.value?.trim();
    const rating = Number(document.getElementById('revRating')?.value || 5);
    const comment = document.getElementById('revComment')?.value?.trim();
    if (!name || !carPlate || !comment) return;

    commitState((st) => {
        st.reviews.unshift({
            id: 'REV-' + Date.now().toString().slice(-4),
            name,
            carPlate,
            rating,
            comment,
            approved: true
        });
    });

    renderReviews();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Отзыв добавлен!' : 'Sharh qo‘shildi!');
    event.target.reset();
}

function renderReviews() {
    const container = document.getElementById('reviewsListContainer');
    if (!container) return;
    const list = appState.reviews.filter((r) => r.approved !== false);
    if (list.length === 0) {
        container.innerHTML = `<div class="gold-card rounded-2xl p-5 text-xs text-gray-400">${appState.lang === 'ru' ? 'Отзывов пока нет.' : 'Hozircha sharhlar yo‘q.'}</div>`;
        return;
    }

    container.innerHTML = list.map((rev) => `
        <div class="gold-card rounded-2xl p-4 space-y-2 min-w-0">
            <div class="flex items-center justify-between gap-2">
                <span class="text-sm font-bold text-white truncate">${rev.name}</span>
                <span class="text-xs text-gold shrink-0">${'★'.repeat(Number(rev.rating) || 5)}</span>
            </div>
            <div class="text-[11px] text-gray-400">${rev.carPlate}</div>
            <p class="text-xs text-gray-200 leading-relaxed break-words">${rev.comment}</p>
        </div>
    `).join('');
}

/* ==================== ADMIN BOSHQARUV FUNKSIYALARI ==================== */
function syncAdminInputsFromState() {
    const uzNameEl = document.getElementById('admMasterNameUz');
    const ruNameEl = document.getElementById('admMasterNameRu');
    const ageEl = document.getElementById('admMasterAge');
    const phoneEl = document.getElementById('admMasterPhone');
    const expUzEl = document.getElementById('admMasterExpUz');
    const expRuEl = document.getElementById('admMasterExpRu');
    const addrEl = document.getElementById('admWorkshopAddress');
    const lunchActiveEl = document.getElementById('admLunchActive');
    const lunchResumeEl = document.getElementById('admLunchResume');
    const tgChatEl = document.getElementById('admTgChatId');
    const tgTokenEl = document.getElementById('admTgToken');

    if (uzNameEl) uzNameEl.value = appState.masterInfo?.uzName || "Ma'rufjon Kudratov";
    if (ruNameEl) ruNameEl.value = appState.masterInfo?.ruName || 'Маруфжон Кудратов';
    if (phoneEl) phoneEl.value = appState.masterInfo?.phone || '+998 90 123 45 67';
    if (expUzEl) expUzEl.value = appState.masterInfo?.uzExp || '5+ yillik tajriba';
    if (expRuEl) expRuEl.value = appState.masterInfo?.ruExp || '5+ лет опыта';
    if (addrEl) addrEl.value = appState.workshopAddress || '';

    if (ageEl) {
        const match = String(appState.masterInfo?.uzRole || '').match(/(\d+)/);
        ageEl.value = match ? Number(match[1]) : 28;
    }

    if (lunchActiveEl) lunchActiveEl.checked = Boolean(appState.lunchBreak?.active);
    if (lunchResumeEl) lunchResumeEl.value = appState.lunchBreak?.resumeTime || '13:00';
    if (tgChatEl) tgChatEl.value = appState.telegram?.chatId || '';
    if (tgTokenEl) tgTokenEl.value = appState.telegram?.botToken || '';
}

function saveAdminMasterProfile(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const uzName = (document.getElementById('admMasterNameUz')?.value || "Ma'rufjon Kudratov").trim();
    const ruName = (document.getElementById('admMasterNameRu')?.value || 'Маруфжон Кудратов').trim();
    const ageNum = Math.min(90, Math.max(18, parseInt(document.getElementById('admMasterAge')?.value, 10) || 28));
    const phone = (document.getElementById('admMasterPhone')?.value || '+998 90 123 45 67').trim();
    const uzExp = (document.getElementById('admMasterExpUz')?.value || '5+ yillik tajriba').trim();
    const ruExp = (document.getElementById('admMasterExpRu')?.value || '5+ лет опыта').trim();
    const addrInput = document.getElementById('admWorkshopAddress')?.value?.trim();

    commitState((st) => {
        st.masterInfo = {
            ...st.masterInfo,
            uzName,
            ruName,
            phone,
            uzExp,
            ruExp,
            uzRole: `${ageNum} yoshlik mutaxassis`,
            ruRole: `Специалист ${ageNum} лет`
        };
        if (addrInput) st.workshopAddress = addrInput;
    });

    setLanguage(appState.lang);
    showToast(appState.lang === 'ru' ? 'Профиль сохранен' : 'Usta va studiya ma’lumotlari saqlandi');
}

function saveAdminLunchAndTg(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const active = Boolean(document.getElementById('admLunchActive')?.checked);
    const resumeTime = (document.getElementById('admLunchResume')?.value || '13:00').trim() || '13:00';
    const chatId = (document.getElementById('admTgChatId')?.value || '').trim();
    const botToken = (document.getElementById('admTgToken')?.value || '').trim();

    commitState((st) => {
        st.lunchBreak = { active, resumeTime };
        st.telegram = { ...st.telegram, chatId, botToken };
    });

    renderLiveQueue();
    showToast(appState.lang === 'ru' ? 'Настройки сохранены' : 'Tushlik va Telegram sozlamalari saqlandi');
}

function handleAdminAddCar(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const name = document.getElementById('admCarName')?.value?.trim();
    const basePrice = Number(document.getElementById('admCarPrice')?.value || 0);
    const type = document.getElementById('admCarType')?.value === 'suv' ? 'suv' : 'sedan';
    if (!name || basePrice < 50000) {
        showToast(appState.lang === 'ru' ? 'Проверьте название и цену' : 'Mashina nomi va narxini to‘g‘ri kiriting', 'error');
        return;
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Date.now().toString().slice(-4);
    commitState((st) => {
        st.cars.push({ id, name, basePrice, type, photoUrl: DEFAULT_SIM_PHOTO_URL });
    });

    populateCarSelects();
    updateSimulator();
    recalculatePrice();
    renderAdminDashboard();
    event.target.reset();
    showToast(appState.lang === 'ru' ? 'Автомобиль добавлен' : 'Yangi mashina saqlandi');
}

function updateAdminCarPrice(carId) {
    const inputEl = document.getElementById(`admCarPriceEdit_${carId}`);
    const nextPrice = Number(inputEl?.value || 0);
    if (!nextPrice || nextPrice < 50000) {
        showToast(appState.lang === 'ru' ? 'Введите корректную цену' : 'Narxni to‘g‘ri kiriting', 'error');
        return;
    }

    commitState((st) => {
        const target = st.cars.find((c) => c.id === carId);
        if (target) target.basePrice = nextPrice;
    });

    populateCarSelects();
    recalculatePrice();
    renderLiveQueue();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Цена обновлена' : 'Mashina narxi saqlandi');
}

function deleteAdminCar(carId) {
    if (appState.cars.length <= 1) {
        showToast(appState.lang === 'ru' ? 'Должна остаться хотя бы 1 машина' : 'Kamida 1 ta mashina qolishi kerak', 'error');
        return;
    }
    commitState((st) => {
        st.cars = st.cars.filter((c) => c.id !== carId);
        if (st.simCarId === carId) st.simCarId = st.cars[0].id;
    });
    populateCarSelects();
    updateSimulator();
    recalculatePrice();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Автомобиль удален' : 'Mashina o‘chirildi');
}

function updateAdminOrderStatus(orderId, status) {
    commitState((st) => {
        const ord = st.orders.find((o) => o.id === orderId);
        if (ord) ord.status = status;
    });
    updateQueueBadge();
    renderLiveQueue();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Статус обновлен' : 'Buyurtma holati yangilandi');
}

function deleteAdminOrder(orderId) {
    commitState((st) => {
        st.orders = st.orders.filter((o) => o.id !== orderId);
    });
    updateQueueBadge();
    renderLiveQueue();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Заявка удалена' : 'Buyurtma o‘chirildi');
}

function toggleAdminReviewApproval(revId) {
    commitState((st) => {
        const rev = st.reviews.find((r) => r.id === revId);
        if (rev) rev.approved = !rev.approved;
    });
    renderReviews();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Статус отзыва изменен' : 'Sharh holati o‘zgardi');
}

function deleteAdminReview(revId) {
    commitState((st) => {
        st.reviews = st.reviews.filter((r) => r.id !== revId);
    });
    renderReviews();
    renderAdminDashboard();
    showToast(appState.lang === 'ru' ? 'Отзыв удален' : 'Sharh o‘chirildi');
}

function renderAdminStats() {
    const totalEl = document.getElementById('statTotalOrders');
    const activeEl = document.getElementById('statActiveOrders');
    const doneEl = document.getElementById('statCompletedOrders');
    const carsEl = document.getElementById('statCarsCount');

    const total = appState.orders.length;
    const active = appState.orders.filter((o) => o.status === 'waiting' || o.status === 'in_progress').length;
    const completed = appState.orders.filter((o) => o.status === 'completed').length;
    const carsCount = appState.cars.length;

    if (totalEl) totalEl.textContent = String(total);
    if (activeEl) activeEl.textContent = String(active);
    if (doneEl) doneEl.textContent = String(completed);
    if (carsEl) carsEl.textContent = String(carsCount);
}

function renderAdminDashboard() {
    renderAdminStats();

    const carsEl = document.getElementById('adminCarsList');
    if (carsEl) {
        carsEl.innerHTML = appState.cars.map((car) => `
            <div class="p-3.5 rounded-2xl bg-obsidian border border-white/10 space-y-2.5 min-w-0">
                <div class="flex items-center justify-between gap-2">
                    <div class="text-xs font-bold text-white truncate">${car.name}</div>
                    <button type="button" onclick="deleteAdminCar('${car.id}')"
                        class="px-2.5 py-1 min-h-[32px] rounded-lg bg-red-950/70 border border-red-500/30 text-[11px] font-bold text-red-200 shrink-0">
                        O‘chirish
                    </button>
                </div>
                <div class="flex items-center gap-2">
                    <input id="admCarPriceEdit_${car.id}" type="number" min="50000" step="10000" value="${car.basePrice}"
                        class="w-full min-w-0 bg-charcoal border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white">
                    <button type="button" onclick="updateAdminCarPrice('${car.id}')"
                        class="px-3 py-1.5 min-h-[34px] rounded-lg gold-btn text-[11px] font-extrabold shrink-0">
                        Saqlash
                    </button>
                </div>
            </div>
        `).join('');
    }

    const ordersEl = document.getElementById('adminOrdersList');
    if (ordersEl) {
        ordersEl.innerHTML = appState.orders.length === 0
            ? `<div class="text-xs text-gray-400">Buyurtmalar yo‘q.</div>`
            : appState.orders.map((ord) => `
                <div class="p-3.5 rounded-2xl bg-obsidian border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="text-xs space-y-0.5 min-w-0">
                        <div class="font-bold text-white">${ord.plate} • ${ord.carName} (${ord.tint})</div>
                        <div class="text-gray-400">${ord.name} — ${ord.phone} • ${ord.date} ${ord.slot} • ${formatUZS(ord.price)}</div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <select onchange="updateAdminOrderStatus('${ord.id}', this.value)"
                            class="flex-1 sm:flex-initial bg-charcoal border border-white/15 rounded-lg px-2.5 py-2 min-h-[38px] text-xs text-white">
                            <option value="waiting" ${ord.status === 'waiting' ? 'selected' : ''}>Kutmoqda</option>
                            <option value="in_progress" ${ord.status === 'in_progress' ? 'selected' : ''}>Jarayonda</option>
                            <option value="completed" ${ord.status === 'completed' ? 'selected' : ''}>Yakunlangan</option>
                        </select>
                        <button type="button" onclick="deleteAdminOrder('${ord.id}')"
                            class="px-3 py-2 min-h-[38px] rounded-lg bg-red-950/70 border border-red-500/30 text-xs font-bold text-red-200">
                            ✕
                        </button>
                    </div>
                </div>
            `).join('');
    }

    const revsEl = document.getElementById('adminReviewsList');
    if (revsEl) {
        revsEl.innerHTML = appState.reviews.length === 0
            ? `<div class="text-xs text-gray-400">Sharhlar yo‘q.</div>`
            : appState.reviews.map((rev) => `
                <div class="p-3.5 rounded-2xl bg-obsidian border border-white/10 space-y-2 min-w-0">
                    <div class="flex items-center justify-between gap-2 text-xs">
                        <span class="font-bold text-white truncate">${rev.name} (${rev.carPlate})</span>
                        <span class="text-gold shrink-0">${'★'.repeat(Number(rev.rating) || 5)}</span>
                    </div>
                    <p class="text-xs text-gray-300 break-words">${rev.comment}</p>
                    <div class="flex items-center gap-2 pt-1">
                        <button type="button" onclick="toggleAdminReviewApproval('${rev.id}')"
                            class="px-3 py-1.5 min-h-[34px] rounded-lg bg-charcoal border border-white/15 text-[11px] font-bold text-gold-light">
                            ${rev.approved !== false ? 'Yashirish' : 'Tasdiqlash'}
                        </button>
                        <button type="button" onclick="deleteAdminReview('${rev.id}')"
                            class="px-3 py-1.5 min-h-[34px] rounded-lg bg-red-950/70 border border-red-500/30 text-[11px] font-bold text-red-200">
                            O‘chirish
                        </button>
                    </div>
                </div>
            `).join('');
    }
}

/* ==================== NAVIGATSIYA VA ISHGA TUSHIRISH ==================== */
function navigateTo(sectionId, event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    appState = loadState();
    populateCarSelects();
    populateTimeSlots();
    const dateInput = document.getElementById('bDate');
    if (dateInput && !dateInput.value) dateInput.value = getTodayISO();
    setLanguage(appState.lang);

    if (appState.adminAuthenticated) {
        revealAdminPanelSection();
    }
});
