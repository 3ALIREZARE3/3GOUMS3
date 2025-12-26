(function() {
    // --- تنظیمات داده‌ها ---

    // لیست نام‌ها و نام‌خانوادگی‌های رندوم
    const firstNames = ["علی", "محمد", "رضا", "حسین", "زهرا", "فاطمه", "مریم", "نرگس", "سارا", "امید", "نیما", "کاوه"];
    const lastNames = ["محمدی", "علوی", "حسینی", "رضایی", "کریمی", "احمدی", "موسوی", "جعفری", "صادقی", "کاظمی"];

    // لیست بیماری‌ها (تشخیص)
    const diagnoses = ["ملنا", "GIB", "انسداد گوارشی", "خونریزی گوارشی فوقانی", "زخم پپتیک", "گاستریت حاد"];

    // متن طولانی تجربه مهارت
    const experienceText = "معاینه توش رکتال (DRE) یک روش تشخیصی است که طی آن پزشک با استفاده از یک انگشت چرب شده و پوشیده شده با دستکش، به آرامی مقعد و قسمت انتهایی راست روده را لمس و ارزیابی می‌کند. این معاینه معمولاً با توضیح مراحل آغاز شده و بیمار در وضعیت خوابیده به پهلوی چپ با زانوهای خم شده به سمت قفسه سینه یا وضعیت ایستاده و خم شده به جلو قرار می‌گیرد. پس از معاینه بصری ناحیه، پزشک با انگشت نشانه خود که به ژل لوبریکانت آغشته شده، به آرامی اسفنکتر مقعد را لمس و سپس وارد راست روده می‌کند تا قوام، اندازه و شکل ساختارهای داخلی مانند پروستات در مردان، تون عضلانی اسفنکتر، وجود توده‌های غیرعادی، نواحی حساس یا دردناک و احتمال وجود خون در انتهای انگشت را بررسی نماید. این فرآیند معمولاً سریع و با حداقل ناراحتی انجام می‌شود و اطلاعات ارزشمندی در مورد سلامت پروستات، روده و اندام‌های مجاور ارائه می‌دهد.";

    // --- توابع کمکی ---

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generatePatientName() {
        return getRandomItem(firstNames) + " " + getRandomItem(lastNames);
    }

    function generateFileNumber() {
        // شروع با 20 یا 21
        const prefix = Math.random() < 0.5 ? "20" : "21";
        // 4 رقم تصادفی
        const suffix = getRandomNumber(1000, 9999).toString();
        return prefix + suffix;
    }

    // --- پر کردن فیلدها ---

    // 1. نام بیمار
    const nameInput = document.getElementsByName("column-ff065fbd-cdb5-4e04-bcbb-a72e226416e6")[0];
    if (nameInput) {
        nameInput.value = generatePatientName();
        nameInput.dispatchEvent(new Event('change', { bubbles: true })); // برای اطمینان از ذخیره
    }

    // 2. شماره پرونده
    const fileNumInput = document.getElementsByName("column-b409550a-7031-4238-ba87-96c20d514df6")[0];
    if (fileNumInput) {
        fileNumInput.value = generateFileNumber();
        fileNumInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 3. تشخیص بیماری
    const diagInput = document.getElementsByName("column-612cb59c-0e84-4541-85ff-1c4c9b626c8f")[0];
    if (diagInput) {
        diagInput.value = getRandomItem(diagnoses);
        diagInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // 4. شرح تجربه مهارت
    const expInput = document.getElementsByName("column-f0cabf3b-846f-4481-b93f-230651650c3d")[0];
    if (expInput) {
        expInput.value = experienceText;
        expInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    alert("فرم با موفقیت پر شد!");

})();