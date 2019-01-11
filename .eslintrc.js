module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true
  },
  "extends": ["prettier", 'airbnb'],
  "plugins": ['prettier'],
  "parserOptions": {
    "browser": true,
    "node": true,
    "es6": true,
    "commonjs": true
  },
  "globals": {
    'Vue': true,
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': [2, {
      "props": false,
    }],
    "no-underscore-dangle": ["error", {
      "allow": ["__previousPage"]
    }],
    "indent": ["warn", 2, {
      "SwitchCase": 1
    }],
    "consistent-return": 0,
    'max-len': 0,
    "import/no-unresolved": 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
  },
};