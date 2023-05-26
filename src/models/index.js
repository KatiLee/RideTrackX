'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const rideModel = require('./ride');
const reservationModel = require('./reservation');
const userModel = require('../auth/models/users');
const Collection = require('./collection');

const DB_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DB_URL);
const ride = rideModel(sequelize, DataTypes);
const reservation = reservationModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  ride: new Collection(ride),
  reservation: new Collection(reservation),
  users,
};