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
            }
        ],
        reviews: [
            {
                id: 'REV-1',
                name: 'Nodirbek Qodirov',
                carPlate: 'Tracker • 10 T 105 BA',
                rating: 5,
                comment: 'Plyonka juda tiniq va sifatli tortildi.',
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

    return {
        ...base,
        lang: parsed.lang === 'ru' ? 'ru' : 'uz',
        adminAuthenticated: Boolean(parsed.adminAuthenticated),
        simTint: [5, 15, 35, 70].includes(Number(parsed.simTint)) ? Number(parsed.simTint) : 35,
        simCarId: typeof parsed.simCarId === 'string' && parsed.simCarId ? parsed.simCarId : base.simCarId,
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
        cars: Array.isArray(parsed.cars) && parsed.cars.length > 0 ? parsed.cars : base.cars,
        tintMultipliers: { ...base.tintMultipliers, ...(parsed.tintMultipliers || {}) },
        coverageMultipliers: { ...base.coverageMultipliers, ...(parsed.coverageMultipliers || {}) },
        orders: Array.isArray(parsed.orders) ? parsed.orders : base.orders,
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : base.reviews
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
let activeMotionStep = 0;

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        // storage error ignored
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
    }, 3200);
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
        hero_desc: 'Malibu, Gentra, Cobalt, Tracker va boshqa mashinalar uchun quyoshdan himoya va oyna qoraytirish xizmati.',
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
        f_car: 'Avtomobil rusumi *',
        f_plate: 'Davlat raqami *',
        f_tint: 'Qoraytirish / Himoya *',
        f_date: 'Sana *',
        f_slot: 'Vaqt oralig‘i (06:00 — 22:00) *',
        permit_full: 'Solntsezashchita (quyoshdan himoya) standarti: yorug‘lik o‘tkazish ko‘rsatkichi 70% gacha ruxsat etilgan — undan past ko‘rsatkich jarimaga sabab bo‘ladi.'
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
        hero_desc: 'Профессиональная тонировка и защита стекол для Malibu, Gentra, Cobalt, Tracker и других авто.',
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
        f_tint: 'Пленка / % *',
        f_date: 'Дата *',
        f_slot: 'Свободное время (06:00 — 22:00) *',
        permit_full: 'Стандарт солнцезащиты: пропускание света разрешено до 70% — показатель ниже приводит к штрафу.'
    }
};

function setLanguage(lang) {
    appState.lang = lang === 'ru' ? 'ru' : 'uz';
    saveState();

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

    const heroMasterEl = document.getElementById('heroMasterText');
    const heroExpEl = document.getElementById('heroExpText');
    const heroFullNameEl = document.getElementById('heroMasterFullName');
    const heroPhoneEl = document.getElementById('heroMasterPhone');

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

    const permitEl = document.getElementById('permitInfoText');
    if (permitEl) permitEl.textContent = i18n[appState.lang].permit_full;

    updateSimulator();
    recalculatePrice();
}

function populateCarSelects() {
    ['simCarSelect', 'calcCar', 'bCar'].forEach((id) => {
        const sel = document.getElementById(id);
        if (!sel) return;
        sel.innerHTML = '';
        appState.cars.forEach((car) => {
            const opt = document.createElement('option');
            opt.value = car.id;
            opt.textContent = car.name;
            sel.appendChild(opt);
        });
    });
    const simSel = document.getElementById('simCarSelect');
    if (simSel) simSel.value = appState.simCarId;
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
    const simSel = document.getElementById('simCarSelect');
    if (simSel) appState.simCarId = simSel.value;
    const carObj = appState.cars.find((c) => c.id === appState.simCarId) || appState.cars[0];
    const tint = appState.simTint;

    document.querySelectorAll('.sim-tint-btn').forEach((btn) => {
        const t = Number(btn.getAttribute('data-tint'));
        btn.className = t === tint
            ? 'sim-tint-btn py-2.5 rounded-xl border border-gold bg-gold text-obsidian text-xs sm:text-sm font-bold transition'
            : 'sim-tint-btn py-2.5 rounded-xl border border-white/15 bg-charcoal text-xs sm:text-sm font-bold text-gray-200 hover:border-gold transition';
    });

    const opacityMap = { 5: 0.78, 15: 0.62, 35: 0.42, 70: 0.18 };
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
    if (carLabel) carLabel.textContent = carObj ? carObj.name : 'Chevrolet Malibu';
    if (tintBadge) tintBadge.textContent = `${tint}%`;
    if (pctLabel) pctLabel.textContent = `${tint}%`;
}

function setCoverage(cov) {
    appState.calcCoverage = ['rear', 'full_side', 'full_car'].includes(cov) ? cov : 'rear';
    document.querySelectorAll('.cov-btn').forEach((btn) => {
        const active = btn.getAttribute('data-cov') === appState.calcCoverage;
        btn.className = active
            ? 'cov-btn py-3 px-4 rounded-xl border border-gold bg-gold/15 text-gold-light text-xs sm:text-sm font-semibold text-center transition'
            : 'cov-btn py-3 px-4 rounded-xl border border-white/15 bg-obsidian text-gray-300 text-xs sm:text-sm font-semibold text-center hover:border-gold/50 transition';
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

function saveAdminMasterProfile(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const uzName = (document.getElementById('admMasterNameUz')?.value || "Ma'rufjon Kudratov").trim();
    const ruName = (document.getElementById('admMasterNameRu')?.value || 'Маруфжон Кудратов').trim();
    const ageNum = Math.min(90, Math.max(18, parseInt(document.getElementById('admMasterAge')?.value, 10) || 28));
    const phone = (document.getElementById('admMasterPhone')?.value || '+998 90 123 45 67').trim();

    appState.masterInfo = {
        ...appState.masterInfo,
        uzName,
        ruName,
        phone,
        uzRole: `${ageNum} yoshlik mutaxassis`,
        ruRole: `Специалист ${ageNum} лет`
    };
    saveState();
    setLanguage(appState.lang);
    showToast('Usta ma’lumotlari saqlandi');
}

function handleBookingSubmit(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const name = document.getElementById('bName')?.value?.trim();
    const phone = document.getElementById('bPhone')?.value?.trim();
    const plate = document.getElementById('bPlate')?.value?.trim().toUpperCase();
    if (!name || !phone || !plate) {
        showToast('Majburiy maydonlarni to‘ldiring', 'error');
        return;
    }
    showToast('Buyurtma qabul qilindi!');
    event.target.reset();
}

function navigateTo(sectionId, event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setMotionZoneStep(idx) {
    activeMotionStep = Math.max(0, Math.min(3, Number(idx) || 0));
}

function cycleMotionZoneStep() {
    setMotionZoneStep((activeMotionStep + 1) % 4);
}

function replayIntroMotionSequence() {
    setMotionZoneStep(0);
    showToast('Animatsiya boshlandi');
}

function downloadSiteHtmlBundle() {
    const html = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'premium-tint.html';
    a.click();
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    populateCarSelects();
    const dateInput = document.getElementById('bDate');
    if (dateInput && !dateInput.value) dateInput.value = getTodayISO();
    setLanguage(appState.lang);
});
