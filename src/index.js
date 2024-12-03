import _ from 'lodash';
function component(){
  const element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}


async function dyn_jq() {
  try {
      // Dynamically import d3
      const { default: $ } = await import('jquery');      
      return $;
} catch (error) {
      console.error('An error occurred while loading jquery:', error);
  }
}

window.dyn_jq = dyn_jq; 

document.body.appendChild(component());
