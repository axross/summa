const postcss = require("postcss");
const plugin = require("tailwindcss/plugin");

module.exports = {
  mode: "jit",
  content: ["./app/**/*.tsx", "./app/**/*.ts"],
  // false or 'media' or 'class'
  // darkMode: false,
  theme: {
    extend: {
      animation: {
        enter: "enter 200ms ease-out",
        leave: "leave 150ms ease-in forwards",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
      },
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(({ addVariant, e }) => {
      addVariant("aria-invalid", ({ modifySelectors, separator }) =>
        modifySelectors(
          ({ className }) =>
            `[aria-invalid="true"].${e(`aria-invalid${separator}${className}`)}`
        )
      );

      addVariant("pointer-fine", ({ container, separator }) => {
        const pointerFine = postcss.atRule({
          name: "media",
          params: "(pointer: fine)",
        });
        pointerFine.append(container.nodes);
        container.append(pointerFine);
        pointerFine.walkRules((rule) => {
          rule.selector = `.${e(
            `pointer-fine${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });

      addVariant("hover-hover", ({ container, separator }) => {
        const hoverHover = postcss.atRule({
          name: "media",
          params: "(hover: hover)",
        });
        hoverHover.append(container.nodes);
        container.append(hoverHover);
        hoverHover.walkRules((rule) => {
          rule.selector = `.${e(
            `hover-hover${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    }),
  ],
};
