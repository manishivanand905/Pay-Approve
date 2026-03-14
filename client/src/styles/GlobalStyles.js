import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── Links ── */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* ── Buttons ── */
  button {
    font-family: ${({ theme }) => theme.fonts.main};
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }

  /* ── Inputs ── */
  input, textarea, select {
    font-family: ${({ theme }) => theme.fonts.main};
    outline: none;
    border: none;
    background: none;
  }

  /* ── Lists ── */
  ul, ol {
    list-style: none;
  }

  /* ── Images ── */
  img, svg {
    display: block;
    max-width: 100%;
  }

  /* ── Headings ── */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.main};
    font-weight: 600;
    line-height: 1.3;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgPrimary};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.textMuted};
  }

  /* ── Selection ── */
  ::selection {
    background: ${({ theme }) => theme.colors.accent}33;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  /* ── Focus visible (accessibility) ── */
  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* ── Transitions ── */
  * {
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }
`;

export default GlobalStyles;
