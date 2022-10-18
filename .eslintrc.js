module.exports = {
    extends: [require.resolve('@umijs/fabric/dist/eslint')],
    globals: {
        ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
        page: true,
        REACT_APP_ENV: true,
    },
    rules: {
        "no-unused-vars": 0,
        "no-useless-escape": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/consistent-type-definitions": 0,
        "@typescript-eslint/consistent-indexed-object-style": 0,
        "@typescript-eslint/no-shadow": 0,
        "@typescript-eslint/no-unused-expressions": 0,
    }
};
