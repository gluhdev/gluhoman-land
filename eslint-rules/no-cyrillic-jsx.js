/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow Cyrillic literals in JSX text/attrs (use t() instead)' },
    messages: { hardcoded: 'Hardcoded Cyrillic detected: "{{text}}". Move to messages/uk.json and use t().' },
  },
  create(context) {
    const CYR = /[Ѐ-ӿ]/;
    return {
      JSXText(node) {
        if (CYR.test(node.value) && node.value.trim().length > 0) {
          context.report({
            node,
            messageId: 'hardcoded',
            data: { text: node.value.trim().slice(0, 40) },
          });
        }
      },
      Literal(node) {
        if (
          typeof node.value === 'string' &&
          CYR.test(node.value) &&
          node.parent &&
          node.parent.type === 'JSXAttribute'
        ) {
          context.report({
            node,
            messageId: 'hardcoded',
            data: { text: node.value.slice(0, 40) },
          });
        }
      },
    };
  },
};
