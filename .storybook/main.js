/**
 * @type {import('@storybook/core-common').StorybookConfig}
 */
module.exports = {
  stories: [
    "../app/components/**/*.stories.mdx",
    "../app/components/**/*.stories.@(ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react",
  webpackFinal: async (config, options) => {
    const path = require("path");

    config.resolve.alias = {
      ...config.resolve.alias,
      "~": path.resolve(__dirname, "../app"),
    };

    return config;
  },
};
