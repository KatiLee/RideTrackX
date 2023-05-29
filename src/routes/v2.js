'use strict';

const express = require('express');
const dataModules = require('../models');
const {reservation, rides, users} = require('../models');
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

router.get('/:model', bearerAuth, handleGetAll);
router.get('/:model/:id', bearerAuth, handleGetOne);
router.post('/:model', bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id', bearerAuth, permissions('update'), handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'), handleDelete);

async function handleCreate(req, res, next) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    next( error.message || error);
  }
}

async function handleGetAll(req, res) {

  console.log('req.user.dataValues>>>', req.user.dataValues);


  let allRecords;

  if (req.params.model === 'reservation' && req.user.dataValues.role === 'parkGuest'){
    let id = req.user.dataValues.id;

    try {
      allRecords = await reservation.findAll({
        where: {userId: id},
        include: [
          {model: rides, as: 'ride', attributes: ['name']},
        ],
      });

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.params.model === 'reservation' !== 'parkGuest' ) {
    try {
      allRecords = await reservation.findAll({
        include: [
          {model: users, as: 'user', attributes: ['username']},
          {model: rides, as: 'ride', attributes: ['name']},
        ],
      });

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    allRecords = await req.model.get();
  }

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

  if (req.params.model === 'reservation'){
    let record = await reservation.findOne({where: {id: id}});
    updatedRecord = await record.update(obj);
  } else {
    updatedRecord = await req.model.update(id, obj);
  }

  res.status(200).json(updatedRecord);
}

async function handleDelete(req, res) {
  console.log(req.params);
  let id = req.params.id;

  if (req.params.model === 'reservation'){
    await reservation.destroy({where: {id: id}});
    let updatedRecords =  await reservation.findAll({
      include: [
        {model: users, as: 'user', attributes: ['username']},
        {model: rides, as: 'ride', attributes: ['name']},
      ],
    });
    res.status(200).json(updatedRecords);
  } else{
    await req.model.delete(id);
    let updatedRecords = await req.model.get();
    res.status(200).json(updatedRecords);
  }
}

module.exports = router;
