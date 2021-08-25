const Sequelize = require('sequelize');
const sequelize = require('../database.js');

const channelTopic = sequelize.define("category_topics", {
    /*Many to Many table relation*/
    /*The relation is made in the table relations file, and as result we have next fields: */

    //categoryId
    //topicId

    },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }
);

module.exports = channelTopic;