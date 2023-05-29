'use strict';

const reservationModel = (sequelize, DataTypes) => sequelize.define('reservation', {
  date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  rideId: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = reservationModel;
