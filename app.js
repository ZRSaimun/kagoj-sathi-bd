import {prompts, services} from './model.js';
import {readSaved, save} from './common.js';
import {isService, normalizeProgress, completionFor} from './desk-model.js';

const KEY = 'kagoj-sathi-desk-v2';
const LABELS = {passport:'ই-পাসপোর্ট',birth:'জন্ম নিবন্ধন',nid:'জাতীয় পরিচয়পত্র'};
const STEPS_BN = {
  passport:['সরকারি পোর্টাল খুলে আপনার আবেদনের ধরন বেছে নিন।','বয়স, আবেদনস্থল ও আবেদনের ধরন অনুযায়ী বর্তমান নির্দেশনা যাচাই করুন।','টাকা দেওয়ার আগে সরকারি পোর্টালে ফি ও অ্যাপয়েন্টমেন্টের নিয়ম মিলিয়ে নিন।'],
  birth:['সরকারি জন্ম নিবন্ধন পোর্টাল খুলুন।','আপনার দায়িত্বপ্রাপ্ত স্থানীয় নিবন্ধন কার্যালয় শনাক্ত করুন।','প্রযোজ্য প্রমাণ ও সংশোধন প্রক্রিয়া ওই কার্যালয়ে যাচাই করুন।'],
  nid:['সরকারি NID পোর্টাল খুলুন।','নতুন নিবন্ধন নাকি সংশোধন—প্রযোজ্য প্রক্রিয়া বেছে নিন।','নির্বাচন কমিশনের সেবা থেকে বর্তমান নির্দেশনা যাচাই করুন।']
};
const PREP_BN = ['সঠিক সেবা ও আবেদনের ধরন নির্ধারণ করেছি','বর্তমান সরকারি নির্দেশনা পড়েছি','সংশ্লিষ্ট অফিসে যা জানতে হবে, তার প্রশ্ন লিখেছি','প্রযোজ্য ফি ও সরকারি পেমেন্টের পথ যাচাই করেছি'];
const inputs = [...document.querySelectorAll('input[name="service"]')];
const guide = document.querySelector('#guide');
const checks = document.querySelector('#checks');
const progressLabel = document.querySelector('#progress');
const storageLabel = document.querySelector('#storage');
const printButton = document.querySelector('#print');
const resetButton = document.querySelector('#reset');
let selected = null;
let progress = normalizeProgress(readSaved(KEY, null));

function saveProgress() {
  storageLabel.textContent = save(KEY, progress)
    ? 'এই ডিভাইসে টিক চিহ্ন রাখা হয়েছে।'
    : 'ব্রাউজারে সংরক্ষণ সম্ভব হয়নি। এই পেজ খোলা থাকা পর্যন্ত টিক থাকবে।';
}
function showGuide(id) {
  guide.replaceChildren();
  if (!isService(id)) return;
  const data = services[id];
  const title = document.createElement('h3');
  title.textContent = LABELS[id];
  const list = document.createElement('ol');
  for (const step of STEPS_BN[id]) {
    const item = document.createElement('li'); item.textContent = step; list.append(item);
  }
  const link = document.createElement('a');
  link.href = data.url; link.textContent = 'সরকারি সেবা খুলুন · Open official website';
  link.target = '_blank'; link.rel = 'noopener noreferrer';
  guide.append(title, list, link);
  if (id === 'passport') {
    const extra = document.createElement('p'); extra.className = 'guide-extra';
    const passport = document.createElement('a'); passport.href = './passport-guide.html'; passport.textContent = 'বয়স, আবেদনস্থল ও ধরন অনুযায়ী উৎসসহ তালিকা';
    const faq = document.createElement('a'); faq.href = './assistant.html'; faq.textContent = 'উৎসসহ প্রশ্নোত্তর';
    extra.append(passport, document.createTextNode(' · '), faq); guide.append(extra);
  }
}
function showChecks() {
  checks.replaceChildren();
  if (!isService(selected)) return;
  prompts.forEach((prompt, index) => {
    const label = document.createElement('label'); label.className = 'check-row';
    const input = document.createElement('input'); input.type = 'checkbox';
    input.checked = progress[selected].includes(index);
    input.addEventListener('change', () => {
      const current = new Set(progress[selected]);
      if (input.checked) current.add(index); else current.delete(index);
      progress[selected] = [...current].sort((a,b) => a-b);
      saveProgress(); updateProgress();
    });
    const text = document.createElement('span'); text.textContent = PREP_BN[index];
    label.append(input, text); checks.append(label);
  });
  updateProgress();
}
function updateProgress() {
  const {done,total} = completionFor(selected, progress);
  progressLabel.textContent = `${done} / ${total} প্রস্তুতির কাজ চিহ্নিত। এটি সরকারি যোগ্যতা বা আবেদন সম্পন্ন হওয়ার প্রমাণ নয়।`;
}
function choose(id) {
  if (!isService(id)) return;
  selected = id;
  inputs.forEach(input => { input.checked = input.value === id; });
  printButton.disabled = false; resetButton.disabled = false;
  storageLabel.textContent = 'এই সেবার প্রস্তুতির টিকগুলো শুধু আপনার ব্রাউজারে রাখা হয়।';
  showGuide(id); showChecks();
}
inputs.forEach(input => input.addEventListener('change', () => choose(input.value)));
resetButton.addEventListener('click', () => {
  if (!isService(selected)) return;
  progress[selected] = [];
  saveProgress(); showChecks();
});
printButton.addEventListener('click', () => { if (isService(selected)) window.print(); });
