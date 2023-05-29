'use strict';

class Collection {
  constructor(model) {
    this.model = model;
  }

  // Create
  create(record) {
    return this.model.create(record);
  }


  // Read
  get(id) {
    if (id) {
      return this.model.findOne({ where: { id } });
    }
    else {
      return this.model.findAll({});
    }
  }

  // Update
  async update(id, data) {
    let result = await this.model.findOne({ where: { id } });
    let updatedData = await result.update(data);

    return updatedData;
  }

  // Delete
  delete(id) {
    return this.model.destroy({ where: { id: id } });
  }

}

module.exports = Collection;
