'use strict';

const reservationModel = (sequelize, DataTypes) => sequelize.define('reservation', {
  id: {type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true},
  date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  rideId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = reservationModel;
