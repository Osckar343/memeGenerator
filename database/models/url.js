const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channel = sequelize.define("url", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    url: {
        type: Sequelize.STRING,
        allowNull: true,
    },
},{
    timestamps: false,
    createdAt: false,
    updatedAt: false,
});

module.exports = channel;