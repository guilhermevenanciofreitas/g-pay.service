import { Exception } from "../../utils/exception.js";

import _ from 'lodash';

import { AppContext } from "../../database/index.js";
import { Sequelize, Op } from "sequelize";

import dayjs from 'dayjs';
import { Authorization } from "../authorization.js";

export class RegisterProductController {

  async findAll(req, res) {
    await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const filter = req.body.filter || { situation: ['active'] }

        const where = [{[Op.not]: {situation: 'deleted'}}]

        if (filter['situation']) where.push({situation: filter['situation']})

        const orders = await db.Product.findAndCountAll({
          attributes: ['id', 'name'],
          limit: limit,
          offset: offset * limit,
          order: [['name', 'asc']],
          where
        });

        res.status(200).json({
          request: {
            filter, limit, offset
          },
          response: {
            rows: orders.rows, count: orders.count
          }
        });

      } catch (error) {
        res.status(500).json({message: error.message});
      }
    }).catch((error) => {
        res.status(400).json({message: error.message});
    });
  }

  async findOne(req, res) {
    await Auth.verify(req, res).then(async({options}) => {
      try {

        const db = new AppContext(options);

        const businessOrder = await db.BusinessOrder.findOne({
          attributes: ['id'],
          include: [
            {model: db.Partner, as: 'partner', attributes: ['id', 'surname']},
            {model: db.BusinessOrderService, as: 'services', attributes: ['id', 'description'], include: [
              {model: db.Vehicle, as: 'vehicle', attributes: ['id', 'identity']},
              {model: db.Partner, as: 'employee', attributes: ['id', 'surname']},
              {model: db.Service, as: 'service', attributes: ['id', 'description']},
              {model: db.BusinessOrderServiceStatus, as: 'status', attributes: ['id', 'description']}
            ]},
          ],
          where: [{id: req.body.id}]
        });

        res.status(200).json(businessOrder);

      } catch (error) {
        Exception.error(res, error);
      }
    }).catch((error) => {
      Exception.unauthorized(res, error);
    });
  }

  async save(req, res) {
    await Auth.verify(req, res).then(async({options}) => {
      try {

        const db = new AppContext(options);

        const transaction = await db.transaction();

        const businessOrder = req.body;

        if (_.isEmpty(businessOrder.id)) {
          console.log('create');
          await db.BusinessOrder.create(businessOrder, {transaction});
        } else {
          console.log('update');
          await db.BusinessOrder.update(businessOrder, {where: [{id: businessOrder.id}], transaction});
        }
        
        await transaction.commit();

        res.status(200).json(businessOrder);

      } catch (error) {
        Exception.error(res, error);
      }
    }).catch((error) => {
      Exception.unauthorized(res, error);
    });
  }

  async changeStatus(req, res) {
    await Auth.verify(req, res).then(async({options}) => {
      try {

      } catch (error) {
        Exception.error(res, error);
      }
    }).catch((error) => {
      Exception.unauthorized(res, error);
    });
  }

  async addDriver(req, res) {
    await Auth.verify(req, res).then(async({options}) => {
      try {

        res.status(200).json({});

      } catch (error) {
        Exception.error(res, error);
      }
    }).catch((error) => {
      Exception.unauthorized(res, error);
    });
  }

  async addNfe(req, res) {
    await Auth.verify(req, res).then(async({options}) => {
      try {

        res.status(200).json({});
        
      } catch (error) {
        Exception.error(res, error);
      }
    }).catch((error) => {
      Exception.unauthorized(res, error);
    });
  }

}