'use strict';

const express = require('express');
const dataModules = require('../models');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;

  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

let reservation = dataModules.reservation;

router.get('/:model', bearerAuth, handleGetAll);
router.get('/:model/:id', bearerAuth, handleGetOne);
router.post('/:model', bearerAuth, handleCreate);
router.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleCreate(req, res, next) {
  if (req.user.dataValues.role === 'machineOperator' && (req.params.model === 'ride' || req.params.model === 'reservation')) {
    res.status(401).send(`Unauthorized Access to "${req.params.model}". Please see Park Manager for assitance.`);
    next();
  }

  if (req.user.dataValues.role === 'parkGuest' && (req.params.model === 'ride')) {
    res.status(401).send(`You are signed in as a Park Guest. You are not authorized to create new "${req.params.model}" record.`);
    next();
  }

  if (req.user.dataValues.role === 'parkGuest' && req.params.model === 'reservation') {
    let obj = {
      userId: req.user.dataValues.id,
      rideId: req.body.rideId,
    };
    let newRecord = await reservation.create(obj);
    res.status(201).json(newRecord);
  } else {
    try {
      let obj = req.body;
      let newRecord = await req.model.create(obj);
      res.status(201).json(newRecord);
    } catch (error) {
      next(error.message || error);
    }
  }
}

async function handleGetAll(req, res, next) {


  let allRecords;

  if (req.params.model === 'reservation' && req.user.dataValues.role === 'parkGuest') {
    let id = req.user.dataValues.id;

    try {
      allRecords = await reservation.findAll({
        where: { userId: id },

        include: {
          model: dataModules.ride.model,
          as: 'ride',
          attributes: ['name', 'waitTimes'],
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (req.params.model === 'reservation' && req.user.dataValues.role !== 'parkGuest') {
    try {
      allRecords = await reservation.findAll({
        include: [
          {
            model: dataModules.users,
            as: 'user',
            attributes: ['username']
          },
          {
            model: dataModules.ride.model,
            as: 'ride',
            attributes: ['name', 'waitTimes']
          },
        ],
      });

    } catch (error) {
      console.error(error);
    }
  };

  if (req.params.model !== 'reservation') {
    allRecords = await req.model.get();
  };

  res.status(200).json(allRecords);
}



async function handleGetOne(req, res, next) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id);
    res.status(200).json(theRecord);
  } catch (e) {
    next(e.message || e);
  }
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;

  let updatedRecord;

  if (req.params.model === 'reservation') {
    let record = await dataModules.reservation.findOne({ where: { id: id } });
    updatedRecord = await record.update(obj);
  } else {
    updatedRecord = await req.model.update(id, obj);
  }

  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;

  if (req.params.model === 'reservation') {
    await reservation.destroy({ where: { id: id } });
    let updatedRecords = await dataModules.reservation.findAll({
      include: [
        { model: dataModules.users, as: 'user', attributes: ['username'] },
        { model: dataModules.ride.model, as: 'ride', attributes: ['name'] },
      ],
    });
    res.status(200).json(updatedRecords);
  } else {
    await req.model.delete(id);
    let updatedRecords = await req.model.get();
    res.status(200).json(updatedRecords);
  }
}

module.exports = router;
