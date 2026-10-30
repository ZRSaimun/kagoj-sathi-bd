// Curated preparation prompts from the official Bangladesh e-passport portal.
// No personal data, fees, appointment availability or current rules are fetched.
export const REVIEWED_ON = '2026-10-30';
export const REVIEW_DUE = '2026-11-30';
export const SOURCES = Object.freeze({
  instructions: {label: 'Official e-passport instructions (updated 3 August 2026)', url: 'https://www.epassport.gov.bd/instructions/instructions'},
  enrollment: {label: 'Official enrolment checklist (updated 21 October 2024)', url: 'https://www.epassport.gov.bd/landing/notices/160'},
  appointment: {label: 'Official appointment FAQ (updated 24 May 2025)', url: 'https://www.epassport.gov.bd/landing/faqs/15'},
  fees: {label: 'Official fees and payment options (updated 12 July 2026)', url: 'https://epassport.gov.bd/instructions/passport-fees'},
  portal: {label: 'Official e-passport application portal', url: 'https://www.epassport.gov.bd/'},
});
export const OPTIONS = Object.freeze({
  location: ['bd', 'mission'],
  age: ['under18', '18to20', 'over20'],
  request: ['new', 'reissue', 'lost'],
});
const step = (id, text, source, note = '') => ({id, text, source, note});
const COMMON = [
  step('match', 'আবেদনের নাম, জন্মতারিখ ও অন্যান্য তথ্য NID বা ইংরেজি অনলাইন জন্মনিবন্ধনের সঙ্গে মিলিয়ে নিন।', 'instructions'),
  step('form', 'সরকারি ই-পাসপোর্ট পোর্টালে আবেদন পূরণ করুন; অনলাইনে আবেদন করলে আবেদনপত্র/সারাংশ প্রিন্টের নির্দেশনা দেখুন।', 'instructions'),
  step('office', 'বর্তমান ঠিকানার জন্য দায়িত্বপ্রাপ্ত পাসপোর্ট অফিস বা বাংলাদেশ মিশন নিশ্চিত করুন।', 'instructions'),
  step('fees', 'পাসপোর্টের ধরন ও আবেদনস্থল অনুযায়ী ফি এবং অনুমোদিত পেমেন্ট পদ্ধতি সরকারি সাইটে মিলিয়ে নিন।', 'fees'),
  step('extra', 'প্রযোজ্য হলে পেশাগত সনদ, সরকারি NOC/GO, বিবাহ/বিচ্ছেদ বা অন্যান্য বিশেষ কাগজপত্রের নির্দেশনা দেখুন।', 'instructions', 'সব আবেদনকারীর জন্য নয়।'),
  step('visit', 'এনরোলমেন্টের আগে অফিসের বর্তমান নোটিশ ও প্রয়োজনীয় মূল কাগজপত্র/কপি মিলিয়ে নিন।', 'enrollment'),
  step('appointment', 'অনলাইনে আবেদনের শেষে অ্যাপয়েন্টমেন্টের অপশন থাকলে সরকারি পোর্টাল থেকে সময় নির্বাচন করুন।', 'appointment', 'সব অফিসে সময় পাওয়া নিশ্চিত নয়।'),
];
function validateChoice(choice) {
  if (!choice || typeof choice !== 'object' || Array.isArray(choice)) throw new TypeError('সঠিক আবেদন তথ্য বেছে নিন।');
  for (const [key, allowed] of Object.entries(OPTIONS)) {
    if (!allowed.includes(choice[key])) throw new RangeError('আবেদনস্থল, বয়স ও আবেদনের ধরন নির্বাচন করুন।');
  }
}
export function checklistFor(choice) {
  validateChoice(choice);
  const rows = [...COMMON];
  if (choice.age === 'under18') {
    rows.push(step('identity-child', '১৮ বছরের নিচে ইংরেজি অনলাইন জন্মনিবন্ধন সনদ (BRC) যাচাই করুন। NID না থাকলে পিতা বা মাতার NID নম্বরের নির্দেশনা দেখুন।', 'instructions'));
    rows.push(step('minor', 'অপ্রাপ্তবয়স্কদের ৫ বছরের ৪৮-পৃষ্ঠার নিয়ম এবং ৬ বছরের কম বয়সীদের ছবির বিশেষ নিয়ম যাচাই করুন।', 'instructions', 'ছবির নিয়ম বয়সভেদে বদলায়; অফিসের বর্তমান নোটিশও দেখুন।'));
  } else if (choice.age === '18to20') {
    rows.push(step('identity-young', '১৮–২০ বছর বয়সে NID অথবা ইংরেজি অনলাইন জন্মনিবন্ধন সনদের সরকারি নিয়ম যাচাই করুন।', 'instructions'));
  } else if (choice.location === 'mission') {
    rows.push(step('identity-mission', '২০ বছরের বেশি বয়সে বিদেশস্থ বাংলাদেশ মিশনে NID অথবা ইংরেজি অনলাইন জন্মনিবন্ধন গ্রহণযোগ্য হওয়ার ব্যতিক্রম যাচাই করুন।', 'instructions', 'সংশ্লিষ্ট মিশনের নিজস্ব নির্দেশনাও মিলিয়ে নিন।'));
  } else {
    rows.push(step('identity-adult', '২০ বছরের বেশি বয়সে বাংলাদেশের ভেতর আবেদন করতে NID-এর সরকারি শর্ত যাচাই করুন।', 'instructions'));
  }
  if (choice.request === 'reissue') rows.push(step('old-passport', 'রি-ইস্যুর জন্য আগের মূল পাসপোর্ট প্রদর্শনের নির্দেশনা দেখুন।', 'instructions'));
  if (choice.request === 'lost') rows.push(step('gd', 'হারানো/চুরি হওয়া পাসপোর্টের জন্য থানায় GD, GD কপি ও আগের পাসপোর্টের ফটোকপির সরকারি নির্দেশনা দেখুন।', 'instructions', 'কোনো কাগজ না থাকলে সংশ্লিষ্ট অফিসে আগে জেনে নিন।'));
  if (choice.location === 'mission') rows.push(step('mission', 'মিশনে নতুন পাসপোর্টের আবেদন হলে স্থায়ী ঠিকানার ঘরে বাংলাদেশের যোগাযোগের ঠিকানার নির্দেশনা দেখুন।', 'instructions', 'মিশনভেদে অতিরিক্ত শর্ত থাকতে পারে।'));
  return rows;
}
export function reviewState(dateString) {
  if (typeof dateString !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateString) || Number.isNaN(Date.parse(`${dateString}T00:00:00Z`)) || new Date(`${dateString}T00:00:00Z`).toISOString().slice(0, 10) !== dateString) return 'unknown';
  return dateString > REVIEW_DUE ? 'stale' : 'reviewed';
}
export function sourcesAreOfficial() {
  return Object.values(SOURCES).every(s => { const u = new URL(s.url); return u.protocol === 'https:' && ['epassport.gov.bd', 'www.epassport.gov.bd'].includes(u.hostname); });
}
