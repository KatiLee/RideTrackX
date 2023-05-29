'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const rideModel = require('./ride');
const reservationModel = require('./reservation');
const userModel = require('../auth/models/users');
const Collection = require('./collection');

const DB_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DB_URL);
const rides = rideModel(sequelize, DataTypes);
const reservation = reservationModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

users.belongsToMany(rides, {through: reservation});
rides.belongsToMany(users, {through: reservation});

reservation.belongsTo(users, { foreignKey: 'userId', as: 'user' ,attributes: ['username'] });
reservation.belongsTo(rides, { foreignKey: 'rideId', as: 'ride', attributes: ['name'] });

module.exports = {
  db: sequelize,
  ride: new Collection(rides),
  reservations: new Collection(reservation),
  reservation,
  rides,
  users,
};
