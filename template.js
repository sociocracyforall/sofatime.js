export default function jsontemplate(document, template, data) {
  const resultFragment = document.createDocumentFragment();

  processOneOrMoreRules(resultFragment, template, data);

  return resultFragment;
};

function processOneOrMoreRules(parentNode, ruleOrRules, data) {
  if (Array.isArray(ruleOrRules)) {
    ruleOrRules.map(function (rule) { processRule(parentNode, rule, data); });
  } else {
    processRule(ruleOrRules);
  }
}

function processRule(parentNode, rule, data) {
  const contents = data[rule.key];

  applyRule(parentNode, rule, contents);
}

function applyRule(parentNode, rule, contents) {
  if (Array.isArray(contents)) {
    contents.map(function (item) { applyRule(parentNode, rule, item); });
  } else {
    let node = undefined;
    if (rule.text === true) {
      node = parentNode.ownerDocument.createTextNode(contents);
    } else { // This should be an element rule, but we should specify and test
             // this....
      node = parentNode.ownerDocument.createElement(rule.element);
      if (rule.attributes !== undefined) {
        if (typeof rule.attributes === 'string') {
          node.setAttribute(rule.attributes, contents[rule.attributes]);
        } else { // rule.attributes should be a "simple" object
          Object.keys(rule.attributes).map(function (name) {
            node.setAttribute(rule.attributes[name], contents[name]);
          });
        }
      }

      if (rule.children !== undefined) {
        processOneOrMoreRules(node, rule.children, contents);
      }
    }
    
    parentNode.appendChild(node);
  }
}
