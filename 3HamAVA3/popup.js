document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const choiceSelect = document.getElementById('choiceSelect');
  const commentTeacher = document.getElementById('commentTeacher');
  const commentAdmin = document.getElementById('commentAdmin');

  chrome.storage.local.get(['choice','teacherComment','adminComment'], (res) => {
    if (res.choice) choiceSelect.value = res.choice;
    if (res.teacherComment) commentTeacher.value = res.teacherComment;
    if (res.adminComment) commentAdmin.value = res.adminComment;
  });

  startBtn.onclick = () => {
    const settings = {
      type: 'START',
      choice: choiceSelect.value,
      teacherComment: commentTeacher.value || '',
      adminComment: commentAdmin.value || ''
    };

    chrome.storage.local.set({
      choice: settings.choice,
      teacherComment: settings.teacherComment,
      adminComment: settings.adminComment
    });

    chrome.runtime.sendMessage(settings);
    window.close();
  };

  stopBtn.onclick = () => {
    chrome.runtime.sendMessage({type: 'STOP'});
    window.close();
  };
});
