/**
 * Created by Aghil
 * Project : EnergyApp
 * Filename : energy.js
 * Date: 15/07/2022
 **/

module.exports = (sequelize, Sequelize) => {
    const Energy = sequelize.define('energy', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        energyTime: {
            type: Sequelize.STRING,
            allowNull: false
        },
        energyTimeUTC: {
            type: Sequelize.DATE,
            allowNull: false
        },
        energyInMW: {
            type: Sequelize.FLOAT,
            allowNull: false
        }
    });

    Energy.associate = (models) => {
        Energy.belongsTo(models.park, {foreignKey: {name: 'parkId', allowNull: false,}, targetkey: 'id'})
    }
    return Energy;
}