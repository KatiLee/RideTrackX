'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const rideModule = require('./ride');
const reservationModel = require('./reservations');
const Collection = require('./collection');

const DB_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DB_URL);
const ride = rideModule(sequelize, DataTypes);
const reservation = reservationModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  ride: new Collection(ride),
  reservation: new Collection(reservation),
};