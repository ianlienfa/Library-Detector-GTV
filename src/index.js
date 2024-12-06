// import $ from 'jquery';
// window.jq = $;

// import _ from 'lodash';
// import {jq as $} from './help.js';

// console.log($.fn.jquery)

// import {dummy_obj as $} from "./help.js";
// import $ from 'jquery';
// import 'core-js/actual/array/from';
// import 'core-js/actual/set';


// function component(){
//   const element = document.createElement('div');
//   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
//   return element;
// }

// export function component(){  
//   const element = document.createElement('div');
//   element.innerHTML = $.fn.jquery;
//   return element;
// }
// document.body.appendChild(jqcomponent());
// window.$ = $;

// function component(){ // core-js/stable
//   const element = document.createElement('div');
//   // console.log(Array.from(new Set([1, 2, 3]).union(new Set([3, 4, 5]))))
//   element.innerHTML = Array.from(new Set([1, 2, 3]).union(new Set([3, 4, 5])));
//   return element;
// }

// document.body.appendChild(component());

// var $;

// async function getjq() {
//   const element = document.createElement('div');
//   const { default: jq } = await import('jquery');
//   window.$ = jq;
//   $ = jq;
//   element.innerHTML = $.fn.jquery;
//   return element;
// }

// getjq().then((component) => {
//   document.body.appendChild(component);
//   console.log('$.fn.jquery', $.fn.jquery);
// });


// async function getLodash() {
//   const element = document.createElement('div');
//   const { default: lodash } = await import('lodash');
//   return lodash;
// }

// window.getLodash = getLodash;

async function getjQuery() {
  const { default: jq } = await import('jquery');
  $ = jq;  
  return $;
}
window.getjQuery = getjQuery;

