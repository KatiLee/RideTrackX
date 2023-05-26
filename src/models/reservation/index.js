'use strict';

const reservationModel = (sequelize, DataTypes) => sequelize.define('reservation', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  rideId: { type: DataTypes.INTEGER, allowNull: false },
})

module.exports = reservationModel;