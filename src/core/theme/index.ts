import { css } from 'lit';

export const themeVars = css`
  :root {
    --color-primary: #ff6200;
    --color-primary-dark: #e55d00;
    --color-accent: #ffb366;
    --color-secondary: #003366;
    --color-bg: #ff6200; /* ING orange as main background */
    --color-bg-main: #fff;
    --color-bg-secondary: #ddd;
    --color-surface: #fff;
    --color-header: #fff;
    --color-text: #222;
    --color-text-light: #fff;
    --color-border: #e0e0e0;
    --color-danger: #ff3b30;
    --color-warning: #ffcc00;

    --font-family: 'Roboto Flex', Arial, Helvetica, sans-serif;
    --font-size-base: 14px;
    --font-size-lg: 20px;
    --font-size-sm: 14px;

    --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

export const injectTheme = () => {
  if (!document.getElementById('theme-vars')) {
    const style = document.createElement('style');
    style.id = 'theme-vars';
    style.innerHTML = themeVars.cssText;
    document.head.appendChild(style);
  }
};
