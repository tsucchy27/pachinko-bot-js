/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  env: { node: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["tsconfig.json"],
  },
  plugins: ["@typescript-eslint"],
  rules: {
    eqeqeq: "warn",
    "no-warning-comments": "warn",
    "object-shorthand": "warn",
    "@typescript-eslint/consistent-type-definitions": "off",
  },
};
