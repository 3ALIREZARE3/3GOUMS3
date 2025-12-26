// content.js – FINAL FIXED VERSION
(function(){
  let running = false;
  let stopRequested = false;
  let settings = { choice: "0", teacherComment: "", adminComment: "" };
  let panel;

  function injectPanel() {
    if (panel) return;
    panel = document.createElement('div');
    panel.style = `
      position:fixed; bottom:16px; left:16px; z-index:999999;
      background:#fff; border:1px solid #ccc; padding:10px; width:220px;
      font-family:sans-serif; direction:rtl; box-shadow:0 2px 8px rgba(0,0,0,0.3);
    `;
    panel.innerHTML = `
      <div style="font-weight:bold;">Hamava Auto</div>
      <div id="hamava-status" style="margin-top:6px;">آماده</div>
      <button id="hamava-start" style="margin-top:8px;width:100%;">شروع</button>
      <button id="hamava-stop" style="margin-top:5px;width:100%;">توقف</button>
      <div id="hamava-progress" style="margin-top:6px;font-size:12px;"></div>
    `;
    document.body.appendChild(panel);

    document.getElementById("hamava-start").onclick = () => {
      chrome.storage.local.get(
        ['choice','teacherComment','adminComment'], 
        res => {
          settings.choice = res.choice || "0";
          settings.teacherComment = res.teacherComment || "";
          settings.adminComment = res.adminComment || "";
          startBot();
        }
      );
    };

    document.getElementById("hamava-stop").onclick = stop;
  }

  function setStatus(text) {
    const status = document.getElementById("hamava-status");
    if (status) status.innerText = text;
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "START") {
      settings = msg;
      startBot();
    } else if (msg.type === "STOP") {
      stop();
    }
  });

  function getEvalButtons() {
    return [...document.querySelectorAll(".EvaluationBtn")]
      .filter(btn => {
        const row = btn.closest("tr");
        if (!row) return true;
        return !row.querySelector("span.text-success");
      });
  }

  // ------------------------------------------
  // FIXED RADIO LOGIC
  // ------------------------------------------

  function pickIndexForRow(radios, choice) {
    if (choice === "random") {
      return Math.floor(Math.random() * radios.length);
    }
    const i = parseInt(choice, 10);
    if (isNaN(i)) return 0;
    return Math.min(Math.max(i, 0), radios.length - 1);
  }

  async function fillModal(choiceSetting, teacherComment, adminComment) {
    const form = document.querySelector("#common-dialog-content form");
    if (!form) throw new Error("form not found");

    await new Promise(r => setTimeout(r, 200));

    const rows = [...form.querySelectorAll(".q-table tbody tr")];

    for (const row of rows) {
      const radios = [...row.querySelectorAll("input.answer-type-choice[type=radio]")];
      if (!radios.length) continue;

      const idx = pickIndexForRow(radios, choiceSetting);
      const radio = radios[idx];

      radio.checked = true;
      radio.click();
      radio.dispatchEvent(new Event("change", { bubbles: true }));
      radio.dispatchEvent(new Event("input", { bubbles: true }));
    }

    const tc = form.querySelector("#studentComment");
    const ac = form.querySelector("#StudentCommentForAdmin");

    if (tc) {
      tc.value = teacherComment;
      tc.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (ac) {
      ac.value = adminComment;
      ac.dispatchEvent(new Event("input", { bubbles: true }));
    }

    await new Promise(r => setTimeout(r, 200));

    const submit = form.querySelector("#submit");
    submit.click();

    await waitClose();
  }

  function waitOpen(timeout = 8000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function check() {
        const modal = document.getElementById("common-dialog");
        const content = document.getElementById("common-dialog-content");
        if (modal && $(modal).is(":visible") && content.innerHTML.length > 50) {
          resolve();
        } else if (Date.now() - t0 > timeout) {
          reject("modal open timeout");
        } else {
          setTimeout(check, 150);
        }
      })();
    });
  }

  function waitClose(timeout = 10000) {
    return new Promise((resolve, reject) => {
      const t0 = Date.now();
      (function check() {
        const modal = document.getElementById("common-dialog");
        if (!modal || !$(modal).is(":visible")) {
          resolve();
        } else if (Date.now() - t0 > timeout) {
          resolve(); // force continue
        } else {
          setTimeout(check, 200);
        }
      })();
    });
  }

  async function startBot() {
    if (running) return;
    running = true;
    stopRequested = false;
    setStatus("در حال اجرا...");
    injectPanel();

    const buttons = getEvalButtons();
    const total = buttons.length;
    let done = 0;

    if (!total) {
      setStatus("فرمی باقی نمانده");
      running = false;
      return;
    }

    for (let i = 0; i < buttons.length; i++) {
      if (stopRequested) break;

      const btn = buttons[i];
      const progress = document.getElementById("hamava-progress");
      if (progress) progress.innerText = `(${i+1}/${total})`;

      btn.click();
      await waitOpen().catch(()=>{});

      await fillModal(settings.choice, settings.teacherComment, settings.adminComment)
        .catch(()=>{});

      await new Promise(r => setTimeout(r, 700));

      done++;
    }

    setStatus(`تمام شد (${done}/${total})`);
    running = false;
  }

  function stop() {
    stopRequested = true;
    running = false;
    setStatus("متوقف شد");
  }

  function init() {
    injectPanel();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
