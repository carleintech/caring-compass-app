module.exports = {
  "*.{js,jsx,ts,tsx,css,scss,md,json,yaml,yml}": [
    "eslint --fix",
    "prettier --write",
  ],
  "*.{json,css,md}": ["prettier --write"],
};
