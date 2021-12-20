const { MemoryRouter } = require("react-router-dom");

import "../app/global.css";

export const parameters = {
  layout: "centered",
  backgrounds: {
    default: globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
    values: [
      {
        name: "light",
        value: "#ffffff",
      },
      {
        name: "dark",
        value: "#000000",
      },
    ],
    grid: {
      cellSize: 16,
      opacity: 0.25,
      cellAmount: 4,
      offsetX: 24,
      offsetY: 24,
    },
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
