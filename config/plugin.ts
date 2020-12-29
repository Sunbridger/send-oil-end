
export default {
    static: true,

    blueWindyValidator: {
        enable: true,
        package: '@souche/blue-windy-validator',
    },

    sequelize: {
        enable: true,
        package: 'egg-sequelize-ts',
    },

    validate: {
        enable: true,
        package: 'egg-validate',
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },

    // onerror: {
    //     enable: false,
    // },

    // blueWindyOnerror: {
    //     enable: true,
    //     package: '@souche/blue-windy-onerror',
    // },
};
