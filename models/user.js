/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : user.js
 * Date: 15/07/2022
 **/

const bcrypt = require("bcrypt");


module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        companyName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        lastLoggedInTime:{
            type: Sequelize.DATE
        },
        accessMode: {
            type: Sequelize.STRING
        }
    });


    return User;
}