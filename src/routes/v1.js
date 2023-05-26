'use strict';

const express = require('express');
const dataModules = require('../models');

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

router.get('/:model', getAll);
router.get('/:model', getOne);
router.post('/:model', create);
router.put('/:model', update);
router.delete('/:model', deleteRecord);

const getAll = async (req, res, next) => {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (error) {
    console.error(error.message || error);
    next(error);
  }
}

const getOne = async (req, res, next) => {
  try {
    let id = req.param.id;
    let foundRecord = await req.model.get(id);
    res.status(200).json(foundRecord);
  } catch (error) {
    console.error(error.message || error);
    next(error);
  }
}

const create = async (req, res, next) => {
  try {
    let newRecord = await req.model.create(req.body)
    res.status(201).json(newRecord);
  } catch (error) {
    console.error(error.message || error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    let id = req.param.id;
    let updatedRecord = await req.model.update(id, req.body);
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error(error.message || error);
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  let deletedRecord = await req.model.delete(req.params.id);
  res.status(200).json(deletedRecord);
};

