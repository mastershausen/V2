module.exports = {
  '*.{js,jsx,ts,tsx}': filenames => [
    `eslint --fix ${filenames.join(' ')}`
  ],
  '*.{json,md}': [
    'prettier --write'
  ],
}; 