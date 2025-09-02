module.exports = {
    root: true,
    extends: ['@react-native', 'eslint:recommended', 'plugin:jest/recommended'],
    env: {
        jest: true
    },
    plugins: ['jest'],
    rules: {
        'react/prop-types': 0,
        'react/no-string-refs': 0,
        'react/no-did-mount-set-state': 0,
        'react/display-name': 0,
        'comma-dangle': 0,
        'jest/no-mocks-import': 0
    }
};
