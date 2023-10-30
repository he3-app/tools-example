import { transformTool } from '@he3-kit/utils';

const CSSToLess = function (input: string) {
  return atob(input);
};

const sampleData = `LmNvbnRhaW5lciB7CiAgd2lkdGg6IDEwMCU7CiAgbWF4LXdpZHRoOiAxMjAwcHg7CiAgbWFyZ2luOiAwIGF1dG87CiAgcGFkZGluZzogMjBweDsKICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmOwogIGJveC1zaGFkb3c6IDAgMCA1cHggcmdiYSgwLCAwLCAwLCAwLjIpOwp9CgoudGl0bGUgewogIGZvbnQtc2l6ZTogMjRweDsKICBmb250LXdlaWdodDogYm9sZDsKICBtYXJnaW4tYm90dG9tOiAxMHB4Owp9CgoudGV4dCB7CiAgZm9udC1zaXplOiAxNnB4OwogIGxpbmUtaGVpZ2h0OiAxLjU7CiAgY29sb3I6ICMzMzM7Cn0KCi5idG4gewogIGRpc3BsYXk6IGlubGluZS1ibG9jazsKICBwYWRkaW5nOiAxMHB4IDIwcHg7CiAgYm9yZGVyLXJhZGl1czogNHB4OwogIGJhY2tncm91bmQtY29sb3I6ICMwMDdiZmY7CiAgY29sb3I6ICNmZmY7CiAgdGV4dC1kZWNvcmF0aW9uOiBub25lOwogIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4zcyBlYXNlOwp9CgouYnRuOmhvdmVyIHsKICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA2OWQ5Owp9Cg==`;

export default transformTool({
  inputLang: 'CSS',
  outputLang: 'CSS',
  sampleData,
  inputHandler: CSSToLess,
});

export const toolMetaInfo = {
  name: 'Less to CSS',
  description: 'Convert Less to CSS.',
  keywords: ['less', 'css', 'conversion'],
};
