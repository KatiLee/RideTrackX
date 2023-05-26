'use strict';

const rideModule = (sequelize, DataTypes) => sequelize.define('ride', {
  name: { type: DataTypes.STRING, allowNull: false },
  heightRequirement: { type: DataTypes.ENUM('Short', 'Medium', 'Tall') },
  waitTimes: { type: DataTypes.ENUM('None', '< 60 mins', '60+ mins') },
})

module.exports = rideModule;