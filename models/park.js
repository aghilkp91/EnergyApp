/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : park.js
 * Date: 15/07/2022
 **/
 const Energy = require("./energy");

module.exports = (sequelize, Sequelize) => {
    const Park = sequelize.define('park', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        parkName: {
            type: Sequelize.STRING,
            allowNull: false
        },
        timezone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        energyType: {
            type: Sequelize.ENUM("Wind", "Solar"),
            allowNull: false
        }
    });

    Park.associate = (models) => {
        Park.hasMany(models.energy, {foreignKey: {name: 'parkId', allowNull: false,}})
    }

    return Park;
}