'use strict';

const express = require('express');
const dataModules = require('../models');
const bearerAuth = require('../auth/middleware/bearer');
const permissions = require('../auth/middleware/acl');
const reservationModel = require('../models/reservation');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  console.log('modelName>>>', modelName);

  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});


router.get('/reservation', bearerAuth, permissions('read'), getReservation);
router.get('/:model', bearerAuth, handleGetAll);
router.get('/:model/:id', bearerAuth, handleGetOne);
router.post('/:model', bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function getReservation(req, res) {
  let allRecords = await reservationModel.get({
    include:[
      { model: dataModules.users, as: 'user', attributes: ['name'] },
      { model: dataModules.ride, as: 'ride', attributes: ['name'] },
    ],
  });
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
  let updatedRecord = await req.model.update(id, obj);
  res.status(200).json(updatedRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}


async function handleDelete(req, res) {
  let id = req.params.id;
  await req.model.delete(id);
  let updatedRecords = await req.model.get();
  res.status(200).json(updatedRecords);
}

module.exports = router;
