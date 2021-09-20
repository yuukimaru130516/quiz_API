#! /usr/bin/env node
'use strict';

import fetch from 'node-fetch';
import jsdom from 'jsdom';

import fs from 'fs';

const fileName = './quiz_10000.json'

const saveQuiz = () => {
  fs.writeFileSync(fileName, JSON.stringify(Quiz), 'utf-8');
}

const { JSDOM } = jsdom;

const Quiz = [];

function createDom(html) {
  return new Promise((resolve) => {
    const dom = new JSDOM(html);
    resolve(dom);
  });
}

function createDocument(Dom) {
  return new Promise((resolve) => {
    const temp = Dom.window.document;
    resolve(temp);
  })
}

// end point
const url = "https://livequiz.work/minhaya1/";

(async() => {
  const res = await fetch(url);
  if(!res.ok) {
    throw Error(res.data.message);
  }else {
    console.log('fetch ok');
  }
  const html = await res.text();
  console.log('crate html ok');

  const Dom = await createDom(html);
  console.log('dom create ok');

  const document = await createDocument(Dom);
  console.log('document create ok');

  const ques = document.querySelectorAll("#tablepress-69 .column-2");
  const ans  = document.querySelectorAll("#tablepress-69 .column-3");
  const par  = document.querySelectorAll("#tablepress-69 .column-5");
  try {
    for(let i = 1; i < ques.length; i++) {
      let Question = ques[i].textContent;
      let Answer = ans[i].textContent;
      let Correct_rate = parseInt(par[i].textContent);
      let rank;
      if(Correct_rate >= 70) {
        rank = "A"
      }else if(Correct_rate >= 50) {
        rank = "B"
      }else if(Correct_rate >= 30) {
        rank = "C"
      }else{
        rank = "D"
      }
      Quiz.push({
        "Id": i,
        "Content": {
          "Question": Question,
          "Answer": Answer
        },
        "Correct_rate": Correct_rate,
        "Rank": rank
      });
    }
  } catch (e) {
    console.log(e);
  } finally {
    saveQuiz();
    console.log('処理が終了しました');
  }

})();
