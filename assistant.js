import {answerQuestion} from './assistant-model.js';
import {checklistLink} from './scenario-link.js';
const $ = selector => document.querySelector(selector);
const form=$('#question-form'), input=$('#question'), transcript=$('#transcript'), status=$('#status');
let count=0;
function networkState(){
  $('#network').textContent = navigator.onLine ? '' : 'অফলাইন / Offline: reviewed answers work locally; official links need a connection.';
}
window.addEventListener('online',networkState);
window.addEventListener('offline',networkState);
networkState();
function addText(parent,tag,text,className){
  const el=document.createElement(tag);
  if(className)el.className=className;
  el.textContent=text;
  parent.append(el);
  return el;
}
function link(parent,url,label){
  const a=document.createElement('a');
  a.href=url;a.textContent=label;a.target='_blank';a.rel='noopener noreferrer';
  parent.append(a);
}
function show(result,scenario){
  if(transcript.querySelector('.empty')) transcript.replaceChildren();
  const card=document.createElement('article');card.className='reply';
  addText(card,'p',result.kind==='answer'?'Reviewed FAQ / পর্যালোচিত উত্তর':result.kind==='clarify'?'More context needed / আরও তথ্য':result.kind==='abstain'?'Cannot verify / যাচাই সম্ভব নয়':'Please revise / আবার লিখুন','kind');
  const heading=addText(card,'h3',`উত্তর ${++count} / Answer ${count}`);
  heading.tabIndex=-1;
  addText(card,'p',result.message);
  if(result.steps.length){
    const list=document.createElement('ol');
    for(const step of result.steps){
      const item=document.createElement('li');
      addText(item,'span',step.text+' ');
      const source=result.sources.find(s=>s.id===step.sourceId);
      if(source)link(item,source.url,'[source]');
      list.append(item);
    }
    card.append(list);
  }
  if(result.sources.length){
    const sources=document.createElement('div');sources.className='sources';
    addText(sources,'strong','Official sources / সরকারি উৎস: ');
    for(const source of result.sources)link(sources,source.url,source.label);
    card.append(sources);
  }
  if(result.link)link(card,result.kind==='answer' && result.steps.length ? checklistLink(scenario) : result.link,'Open full checklist / সম্পূর্ণ তালিকা খুলুন');
  transcript.append(card);
  heading.focus();
}
function submitQuestion(question){
  if(count>=20){status.textContent='Session limit reached / এই সেশনের সীমা শেষ। Clear history to restart.';return;}
  const scenario={location:$('#location').value,age:$('#age').value,request:$('#request').value};
  const now=new Date();
  const date=Number.isFinite(now.getTime())?now.toISOString().slice(0,10):'';
  const result=answerQuestion(question,scenario,$('#language').value,date);
  // Never echo user-entered identity details into the transcript or any logs.
  show(result,scenario);
  input.value='';
  status.textContent=result.kind==='clarify'?'Select the missing scenario fields, then ask again.':result.kind==='error'?'Please edit your question.':'';
}
function selectedScenario(){return {location:$('#location').value,age:$('#age').value,request:$('#request').value};}
function updateChecklistLink(){ $('#checklist-link').href=checklistLink(selectedScenario()); }
for(const id of ['location','age','request']) $( '#' + id ).addEventListener('change',updateChecklistLink);
updateChecklistLink();
form.addEventListener('submit',event=>{event.preventDefault();submitQuestion(input.value);});
for(const button of document.querySelectorAll('[data-question]')){
  button.addEventListener('click',()=>{input.value=button.dataset.question;input.focus();});
}
$('#clear').addEventListener('click',()=>{
  transcript.replaceChildren();
  addText(transcript,'p','History cleared on this device / ইতিহাস মুছে গেছে।','empty');
  count=0;status.textContent='';input.value='';input.focus();
});
$('#language').addEventListener('change',()=>{document.documentElement.lang=$('#language').value;});
