import {checklistFor, OPTIONS, REVIEWED_ON, REVIEW_DUE, reviewState, SOURCES} from './passport-model.js';

// Editorially reviewed references inherited from stage-3's passport guide.
// These are navigation links, not a live feed or a government API.
export const KNOWLEDGE = Object.freeze({
  checklist: {sourceIds: ['instructions', 'enrollment'], applicable: 'Bangladesh or Bangladesh mission; age and request must be selected', reviewedOn: REVIEWED_ON, dueOn: REVIEW_DUE},
  fees: {sourceIds: ['fees'], applicable: 'Fees vary by application location and service', reviewedOn: REVIEWED_ON, dueOn: REVIEW_DUE},
  appointment: {sourceIds: ['appointment', 'portal'], applicable: 'Availability varies by office', reviewedOn: REVIEWED_ON, dueOn: REVIEW_DUE},
  identity: {sourceIds: ['instructions'], applicable: 'Identity evidence varies by age and application location', reviewedOn: REVIEWED_ON, dueOn: REVIEW_DUE},
  lost: {sourceIds: ['instructions'], applicable: 'Lost/stolen passport requests', reviewedOn: REVIEWED_ON, dueOn: REVIEW_DUE},
  reissue: {sourceIds: ['instructions'], applicable: 'Reissue requests', reviewedOn: REVIEWED_ON, dueOn: REVIEW_DUE}
});
const SOURCE_UPDATED_ON = Object.freeze({
  instructions: '2026-08-03', enrollment: '2024-10-21',
  appointment: '2025-05-24', fees: '2026-07-12', portal: null
});
// Source update dates are recorded by stage 3, not legally effective dates.
const EN_STEPS = Object.freeze({
  match: 'Compare the application details with the official identity-record instructions.',
  form: 'Review how to complete and print the official online application.',
  office: 'Check which passport office or Bangladesh mission handles your application.',
  fees: 'Verify the current fee and accepted payment method on the official portal.',
  extra: 'Check whether special supporting documents apply to your situation.',
  visit: 'Read the latest office notice before attending enrolment.',
  appointment: 'Check the official appointment process and availability.',
  'identity-child': 'Check the identity-record instructions for applicants under 18.',
  minor: 'Check the special validity and photograph rules for children.',
  'identity-young': 'Check the identity-record instructions for applicants aged 18–20.',
  'identity-mission': 'Check the overseas mission identity-record exception and the mission notice.',
  'identity-adult': 'Check the NID requirement for applicants over 20 inside Bangladesh.',
  'old-passport': 'Check the old-passport requirement for a reissue.',
  gd: 'Check the official instructions for reporting a lost or stolen passport.',
  mission: 'Check the mission-specific address instructions.'
});
const WORDS = Object.freeze({
  lost: ['lost', 'stolen', 'missing passport', 'হারানো', 'চুরি', 'জিডি', 'gd'],
  reissue: ['reissue', 'renew', 'renewal', 'রি-ইস্যু', 'নবায়ন'],
  fees: ['fee', 'cost', 'payment', 'price', 'ফি', 'টাকা', 'খরচ', 'পেমেন্ট'],
  appointment: ['appointment', 'booking', 'slot', 'অ্যাপয়েন্টমেন্ট', 'স্লট', 'সময়'],
  identity: ['age', 'birth', 'nid', 'brc', 'identity', 'বয়স', 'জন্ম', 'এনআইডি', 'পরিচয়'],
  checklist: ['document', 'paper', 'checklist', 'prepare', 'apply', 'passport', 'required', 'কাগজ', 'ডকুমেন্ট', 'তালিকা', 'প্রস্তুতি', 'পাসপোর্ট', 'আবেদন']
});
const has = (text, terms) => terms.some(term => text.includes(term));
function officialSources(ids) {
  return [...new Set(ids)].map(id => {
    const source = SOURCES[id];
    if (!source) return null;
    const url = new URL(source.url);
    if (url.protocol !== 'https:' || !['epassport.gov.bd', 'www.epassport.gov.bd'].includes(url.hostname)) return null;
    return {id, label: source.label, url: source.url, sourceUpdatedOn: SOURCE_UPDATED_ON[id] ?? null, effectiveOn: null, reviewedOn: REVIEWED_ON};
  }).filter(Boolean);
}
function response(kind, message, ids = ['instructions'], steps = [], link = null) {
  return {kind, message, sources: officialSources(ids), steps, link, reviewedOn: REVIEWED_ON, reviewDue: REVIEW_DUE};
}
// An editorial conflict or missing evidence must not be resolved by guessing.
export function evidenceState(record, today) {
  if (!record || !Array.isArray(record.sourceIds) || !record.sourceIds.length) return 'missing';
  if (record.status === 'conflict') return 'conflict';
  if (record.status && record.status !== 'reviewed') return 'missing';
  if (record.reviewedOn !== REVIEWED_ON || record.dueOn !== REVIEW_DUE) return 'missing';
  return typeof today === 'string' && today < REVIEWED_ON ? 'unknown' : reviewState(today);
}
const tr = (lang, bn, en) => lang === 'en' ? en : bn;
export function answerQuestion(query, scenario = {}, language = 'bn', today = REVIEWED_ON) {
  const lang = language === 'en' ? 'en' : 'bn';
  if (typeof query !== 'string' || !query.trim() || [...query].length > 240) {
    return response('error', tr(lang, '১–২৪০ অক্ষরের একটি প্রশ্ন লিখুন।', 'Enter a question of 1–240 characters.'));
  }
  const text = query.toLocaleLowerCase('en').trim().replace(/\s+/g, ' ');
  // Do not accept personal identifiers or instructions that attempt to change the evidence policy.
  if (/[0-9\u09e6-\u09ef]{6,}/u.test(text) || /[\w.+-]+@[\w.-]+\.[a-z]{2,}/iu.test(text) || /\b(?:otp|password|pin)\s*[:=]\s*\S+/iu.test(text)) {
    return response('error', tr(lang, 'ব্যক্তিগত নম্বর, ইমেইল বা গোপন তথ্য লিখবেন না। প্রশ্নটি সেগুলো ছাড়া আবার করুন।', 'Do not enter identity numbers, email addresses or secrets. Ask without them.'));
  }
  if (has(text, ['ignore previous', 'ignore all', 'system prompt', 'developer instruction', 'bypass', 'jailbreak', 'নিয়ম উপেক্ষা', 'নির্দেশনা উপেক্ষা'])) {
    return response('abstain', tr(lang, 'শুধু যাচাইযোগ্য সরকারি উৎসের বিষয়েই সাহায্য করতে পারি।', 'I can only help with topics covered by reviewed official sources.'));
  }
  const freshness = reviewState(today);
  if (freshness !== 'reviewed' || today < REVIEWED_ON) {
    return response('abstain', tr(lang, 'এই সহায়িকার তথ্যের পর্যালোচনার মেয়াদ শেষ বা ডিভাইসের তারিখ অনিশ্চিত। বর্তমান নিয়ম নিশ্চিত করতে পারছি না।', 'This guide is overdue for review or the device date is uncertain. I cannot verify current requirements.'), ['instructions', 'portal']);
  }
  if (has(text, ['right now', 'currently', 'today', 'live', 'latest', 'guarantee', 'এখন', 'আজ', 'সর্বশেষ', 'নিশ্চিত হবে'])) {
    return response('abstain', tr(lang, 'বর্তমান ফি, সময়, নিয়ম বা অনুমোদন এখানে লাইভ যাচাই হয় না। সরকারি পোর্টালে দেখুন।', 'I cannot verify live fees, appointment slots, rules or approval. Check the official portal.'), ['instructions', 'portal']);
  }
  const topic = Object.keys(WORDS).find(key => has(text, WORDS[key]));
  if (!topic) {
    return response('abstain', tr(lang, 'এই প্রশ্নের জন্য পর্যালোচিত তথ্য নেই। সরকারি নির্দেশনা দেখুন বা পাসপোর্ট প্রস্তুতি বিষয়ে প্রশ্ন করুন।', 'I do not have reviewed evidence for that question. Use the official instructions or ask about passport preparation.'));
  }
  if (evidenceState(KNOWLEDGE[topic], today) !== 'reviewed') {
    return response('abstain', tr(lang, 'এই বিষয়ে উৎসের তথ্য অনুপস্থিত, পুরোনো বা পরস্পরবিরোধী। নিশ্চিত করতে পারছি না।', 'The source evidence for this topic is missing, outdated or conflicting. I cannot verify it.'), ['instructions', 'portal']);
  }
  if (topic === 'fees') {
    return response('answer', tr(lang, 'ফি আবেদনস্থল, পাসপোর্ট ও সেবার ধরন অনুযায়ী আলাদা হতে পারে। এখানে কোনো অঙ্ককে বর্তমান ফি বলছি না। সরকারি ফি পেজে আপনার বিকল্প মিলিয়ে নিন।', 'Fees depend on location, passport and service choices. I cannot quote a current amount; compare your choices on the official fees page.'), KNOWLEDGE.fees.sourceIds);
  }
  if (topic === 'appointment') {
    return response('answer', tr(lang, 'অ্যাপয়েন্টমেন্টের নিয়ম ও অফিসভেদে সময় পাওয়ার তথ্য সরকারি পোর্টালে যাচাই করুন। এখানে কোনো স্লট দেখানো হয় না।', 'Check the official portal for the appointment process and office availability. No live slots are shown here.'), KNOWLEDGE.appointment.sourceIds);
  }
  const choice = {};
  for (const [key, allowed] of Object.entries(OPTIONS)) {
    if (scenario && Object.hasOwn(scenario, key) && scenario[key] !== '') {
      if (!allowed.includes(scenario[key])) return response('error', tr(lang, 'নির্বাচিত পরিস্থিতি সঠিক নয়।', 'The selected scenario is invalid.'));
      choice[key] = scenario[key];
    }
  }
  const missing = Object.keys(OPTIONS).filter(key => !choice[key]);
  if (missing.length) {
    const prompts = {
      location: tr(lang, 'বাংলাদেশে, নাকি বাংলাদেশ মিশনে?', 'Inside Bangladesh or at a Bangladesh mission?'),
      age: tr(lang, '১৮-এর নিচে, ১৮–২০, নাকি ২০-এর বেশি?', 'Under 18, 18–20, or over 20?'),
      request: tr(lang, 'নতুন, রি-ইস্যু, নাকি হারানো পাসপোর্ট?', 'New, reissue, or lost passport?')
    };
    return response('clarify', tr(lang, 'সঠিক উৎসভিত্তিক তালিকার জন্য নির্বাচন করুন: ', 'For a scenario-specific, sourced checklist, choose: ') + missing.map(key => prompts[key]).join(' '), KNOWLEDGE.checklist.sourceIds);
  }
  const rows = checklistFor(choice);
  const topicRows = topic === 'lost' ? rows.filter(r => ['gd', 'visit', 'office'].includes(r.id))
    : topic === 'reissue' ? rows.filter(r => ['old-passport', 'visit', 'office'].includes(r.id))
    : topic === 'identity' ? rows.filter(r => r.id.startsWith('identity-') || r.id === 'minor' || r.id === 'match')
    : rows;
  const steps = topicRows.map(row => ({
    id: row.id,
    text: lang === 'en' ? EN_STEPS[row.id] : row.text,
    sourceId: row.source
  }));
  return response('answer',
    tr(lang, 'নির্বাচিত পরিস্থিতির জন্য পর্যালোচিত প্রস্তুতির ধাপগুলো নিচে। এগুলো চূড়ান্ত সরকারি কাগজপত্রের তালিকা নয়; প্রতিটি উৎস যাচাই করুন।', 'These are reviewed preparation checks for your selected scenario, not a final government document list. Verify each source.'),
    topicRows.map(row => row.source), steps, './passport-guide.html');
}
