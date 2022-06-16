import sofatime from './sofatime';

import jsontemplate from './template';
import './demo.css';
import './sofatime.css';
import tztemplate from './template.json';
import tzdata from './locale/en.json';

window.addEventListener('load', function () {
  console.log('sofatime.js loaded!');
  sofatime();
  //const tzselectfragment = jsontemplate(document, tztemplate.rootpattern,
  //                                      tzdata);
  //document.getElementById('template-test').appendChild(tzselectfragment);
})
