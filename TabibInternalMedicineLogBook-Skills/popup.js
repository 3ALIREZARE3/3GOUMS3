document.getElementById("fillBtn").addEventListener("click", () => {
    const selectElement = document.getElementById("skillSelect");
    const selectedSkillKey = selectElement.value;
    
    // نگاشت مقادیر انتخابی پاپ‌آپ به متن دقیق داخل لیست‌های سایت
    const skillTextMap = {
        "ascites": "TAPمایع آسیت", // متن باید دقیقاً مشابه سایت باشد
        "tr": "TR",
        "abdominal": "معاینه شکم",
        "ngt": "گذاشتن NGT",
        "thyroid": "معاینه تیروئید"
    };

    const targetSkillText = skillTextMap[selectedSkillKey];
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: fillFormInPage,
        args: [selectedSkillKey, targetSkillText]
      });
    });
});
  
// =======================================================
// کدهای زیر داخل صفحه مرورگر اجرا می‌شوند
// =======================================================
function fillFormInPage(skillKey, skillTextToSelect) {

    // --- تنظیمات داده‌های متنی (نام و توضیحات) ---
    const firstNames = ["علی", "محمد", "رضا", "حسین", "امیر", "مهدی", "حسن", "سجاد", "نیما", "کاوه", "آرش", "پویا", "سینا", "عرفان", "زهرا", "فاطمه", "مریم", "نرگس", "سارا", "الناز", "مینا", "هانیه"];
    const lastNames = ["محمدی", "حسینی", "احمدی", "کریمی", "رضایی", "موسوی", "جعفری", "صادقی", "حیدری", "کاظمی", "ابراهیمی", "مظفری", "اکبری", "زارع"];

    const skillsData = {
        "ascites": {
            description: `تپ مایع آسیت (پاراسنتز تشخیصی): پس از پرپ و درپ و بی‌حسی موضعی با لیدوکائین، در وضعیت سوپاین، نیدل آنژیوکت در ربع تحتانی چپ وارد شد. مایع شفاف خارج شد و نمونه جهت آنالیز ارسال گردید. پانسمان استریل انجام شد.`,
            diagnoses: ["سیروز کبدی (Cirrhosis)", "پریتونیت (SBP)", "بدخیمی شکمی"]
        },
        "tr": {
            description: `معاینه رکتال (DRE): بیمار در وضعیت لترال چپ قرار گرفت. با دستکش و لوبریکانت کافی، تون اسفنکتر نرمال بود. مخاط رکتوم صاف و بدون توده لمس شد. پروستات در قوام و اندازه نرمال بود. خونریزی یا ملنا روی دستکش مشاهده نشد.`,
            diagnoses: ["BPH", "سرطان پروستات", "هموروئید", "GIB"]
        },
        "abdominal": {
            description: `معاینه شکم: شکم نرم و تخت بود. تندرنس یا ریباند تندرنس نداشت. ارگانومگالی (هپاتواسپلنومگالی) لمس نشد. صداهای روده ای نرمال و سمع شد. دق شکم تیمپانیک بود.`,
            diagnoses: ["شکم حاد", "گاستریت", "آپاندیسیت", "کوله سیستیت"]
        },
        "ngt": {
            description: `تعبیه NGT: پس از توضیح به بیمار و پوزیشن نیمه نشسته، لوله معده سایز مناسب با ژل لوبریکانت از طریق بینی بدون مقاومت وارد معده شد. با سمع اپی‌گاستر و آسپیراسیون محتویات معده، محل لوله تایید و فیکس شد.`,
            diagnoses: ["انسداد روده", "مسمومیت دارویی", "خونریزی فوقانی معده"]
        },
        "thyroid": {
            description: `معاینه تیروئید: در مشاهده گردن تقارن داشت. در لمس از خلف، لوب‌های تیروئید سایز نرمال داشتند و ندول یا توده‌ای لمس نشد. در سمع بروئی شنیده نشد. غدد لنفاوی گردنی قابل لمس نبودند.`,
            diagnoses: ["گواتر ساده", "هایپوتیروئیدی", "ندول تیروئید"]
        }
    };

    // --- توابع کمکی ---
    function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    // --- 1. پر کردن فیلدهای متنی (نام، پرونده، تشخیص، شرح) ---
    const currentData = skillsData[skillKey] || skillsData["ascites"];

    // نام بیمار
    const nameInput = document.getElementsByName("column-ff065fbd-cdb5-4e04-bcbb-a72e226416e6")[0];
    if (nameInput) { nameInput.value = getRandomItem(firstNames) + " " + getRandomItem(lastNames); nameInput.dispatchEvent(new Event('change')); }

    // شماره پرونده (رندوم با شروع ۲۰ یا ۲۱)
    const fileNumInput = document.getElementsByName("column-b409550a-7031-4238-ba87-96c20d514df6")[0];
    if (fileNumInput) { 
        const prefix = Math.random() < 0.5 ? "20" : "21";
        fileNumInput.value = prefix + getRandomNumber(1000, 9999); 
        fileNumInput.dispatchEvent(new Event('change')); 
    }

    // تشخیص
    const diagInput = document.getElementsByName("column-612cb59c-0e84-4541-85ff-1c4c9b626c8f")[0];
    if (diagInput) { diagInput.value = getRandomItem(currentData.diagnoses); diagInput.dispatchEvent(new Event('change')); }

    // شرح حال
    const expInput = document.getElementsByName("column-f0cabf3b-846f-4481-b93f-230651650c3d")[0];
    if (expInput) { expInput.value = currentData.description; expInput.dispatchEvent(new Event('change')); }


    // --- 2. پر کردن تاریخ (رندوم در ماه جاری ۱۴۰۴) ---
    const dateInputVisible = document.getElementById("column304b0ad9a8dc4794bacab91fb8219954_fake");
    const dateInputHidden = document.getElementById("column304b0ad9a8dc4794bacab91fb8219954");
    
    if (dateInputVisible && dateInputHidden) {
        // فرض بر سال ۱۴۰۴ و ماه ۹ یا ۱۰ (طبق درخواست)
        // برای سادگی یک روز رندوم بین ۱ تا ۲۸ انتخاب می‌کنیم
        const day = getRandomNumber(1, 28).toString().padStart(2, '0');
        // ماه را از مقدار فعلی فیلد می‌خوانیم یا پیش‌فرض ۰۹ می‌گذاریم
        let currentVal = dateInputVisible.value || "1404/09/01";
        let parts = currentVal.split('/');
        let year = parts[0] || "1404";
        let month = parts[1] || "09";
        
        const finalDate = `${year}/${month}/${day}`;
        const finalDateWithDash = `${year}-${month}-${day}`; // فرمت احتمالی هیدن

        dateInputVisible.value = finalDate;
        dateInputHidden.value = finalDateWithDash; // معمولا فرمت میلادی میخواد ولی گاهی شمسی رو هم قبول میکنه، برای اطمینان ویژوال رو ست میکنیم
        
        // تریگر کردن ایونت‌ها برای ذخیره شدن تاریخ
        dateInputVisible.dispatchEvent(new Event('change', { bubbles: true }));
        dateInputVisible.dispatchEvent(new Event('blur', { bubbles: true }));
    }


    // --- 3. تابع جادویی برای انتخاب آیتم از لیست‌های Kendo UI ---
    // این تابع لیست را باز می‌کند، آیتم را پیدا می‌کند و روی آن کلیک می‌کند
    const selectKendoItem = (inputId, textToFind, delay) => {
        setTimeout(() => {
            const input = document.getElementById(inputId);
            if (!input) return;

            // پیدا کردن دکمه باز کردن لیست (Wrapper)
            const wrapper = input.parentElement.querySelector(".k-dropdown-wrap");
            if (wrapper) wrapper.click(); // باز کردن لیست

            // صبر کوتاه برای باز شدن انیمیشن لیست
            setTimeout(() => {
                // آیدی لیست باز شده معمولا inputId + _listbox است
                const listboxId = inputId + "_listbox";
                const listbox = document.getElementById(listboxId);
                
                if (listbox) {
                    const items = listbox.querySelectorAll("li");
                    let found = false;
                    for (let item of items) {
                        // چک کردن متن آیتم (حساسیت به فاصله رو کم میکنیم)
                        if (item.textContent.trim().includes(textToFind.trim())) {
                            item.click(); // انتخاب آیتم
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        console.log(`آیتم ${textToFind} در لیست ${inputId} پیدا نشد.`);
                        // بستن لیست اگر پیدا نشد (با کلیک دوباره)
                        if (wrapper) wrapper.click(); 
                    }
                }
            }, 300); // 300 میلی‌ثانیه صبر برای باز شدن لیست
        }, delay);
    };

    // --- 4. اجرای انتخاب لیست‌ها با فاصله زمانی (تا تداخل نکنند) ---
    
    // الف) انتخاب عنوان مهارت (از پاپ‌آپ آمده)
    selectKendoItem("column-babeae7a-2723-41a9-a46b-894e510bcaf6", skillTextToSelect, 0);

    // ب) بیمارستان: صیاد شیرازی
    selectKendoItem("column-a4c1110a-85a5-4ff5-bdcf-03af85b1eca1", "صیاد", 800);

    // ج) فیلد آموزشی: اورژانس
    selectKendoItem("column-58aab5a4-2ac8-4eca-9a95-6759fb0be174", "اورژانس", 1600);

    // د) سطح مشارکت: انجام مستقل
    selectKendoItem("PartnershipItemId", "انجام مستقل", 2400);

    // پیام نهایی با کمی تاخیر
    setTimeout(() => {
        alert("تمام فیلدها و لیست‌های کشویی پر شدند!");
    }, 3000);
}