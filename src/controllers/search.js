import { Authorization } from "./authorization.js";
import { AppContext } from '../database/index.js'
import Sequelize from "sequelize"
import _ from "lodash"

export class SearchController {

    async company(req, res) {
        Authorization.verify(req, res).then(async ({user}) => {
            try {

                const db = new AppContext()

                const companies = await db.CompanyUser.findAll({
                    attributes: ['id'],
                    include: [
                        {model: db.Company, as: 'company', attributes: ['id', 'name', 'surname']}
                    ],
                    where: [{
                        '$userId$': user.id,
                        '$company.surname$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                    }],
                    order: [
                        ['company', 'surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(_.map(companies, (companyUser) => companyUser.company.dataValues));

            } catch (error) {
                //Exception.error(res, error);
            }
        }).catch((error) => {
            //Exception.unauthorized(res, error);
        });
    }

    async partner(req, res) {
        Authorization.verify(req, res).then(async ({company}) => {
            try {

                const db = new AppContext()

                const partners = await db.Partner.findAll({
                    attributes: ['id', 'name', 'surname'],
                    where: [{
                        '$companyId$': company.id,
                        '$surname$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                    }],
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(partners);

            } catch (error) {
                //Exception.error(res, error);
            }
        }).catch((error) => {
            //Exception.unauthorized(res, error);
        });
    }

    async city(req, res) {
        //Authorization.verify(req, res).then(async ({company}) => {
            try {

                const db = new AppContext()

                const city = await db.City.findAll({
                    attributes: ['id', 'name'],
                    where: [{
                        nome_municipio: {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`},
                    }],
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(city);

            } catch (error) {
                res.status(500).json({message: error.message});
            }
        //}).catch((error) => {
        //    //Exception.unauthorized(res, error);
        //});
    }

    async sender(req, res) {
        //Authorization.verify(req, res).then(async ({company}) => {
            try {

                const db = new AppContext()

                const sender = await db.Partner.findAll({
                    attributes: ['id', 'name', 'surname'],
                    where: [{
                        '$RazaoSocial$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`},
                        ISRemetente: 1
                    }],
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(sender);

            } catch (error) {
                res.status(500).json({message: error.message});
            }
        //}).catch((error) => {
        //    //Exception.unauthorized(res, error);
        //});
    }

    async recipient(req, res) {
        //Authorization.verify(req, res).then(async ({company}) => {
            try {

                const db = new AppContext()

                const recipient = await db.Partner.findAll({
                    attributes: ['id', 'name', 'surname'],
                    where: [{
                        '$RazaoSocial$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`},
                        ISDestinatario: 1
                    }],
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(recipient);

            } catch (error) {
                res.status(500).json({message: error.message});
            }
        //}).catch((error) => {
        //    //Exception.unauthorized(res, error);
        //});
    }

    async employee(req, res) {
        Authorization.verify(req, res).then(async ({options}) => {
            try {

                const db = new AppContext(options)

                const partners = await db.Partner.findAll({
                    attributes: ['id', 'name', 'surname'],
                    where: [{
                        '$surname$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`}
                    }],
                    order: [
                        ['surname', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(partners);

            } catch (error) {
                //Exception.error(res, error);
            }
        }).catch((error) => {
            //Exception.unauthorized(res, error);
        });
    }

    async bankAccount(req, res) {
        Authorization.verify(req, res).then(async ({options}) => {
            try {

                const db = new AppContext(options)

                const bankAccounts = await db.BankAccount.findAll({
                    attributes: ['id', 'name', 'agency', 'agencyDigit', 'account', 'accountDigit'],
                    include: [
                        {model: db.Bank, as: 'bank', attributes: ['id', 'name', 'image']}
                    ],
                    where: [{
                        [Op.or]: {
                            '$bank.name$': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'agency': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'agencyDigit': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'account': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                            'accountDigit': {[Sequelize.Op.like]: `%${req.body?.search.replace(' ', "%")}%`},
                        }
                    }],
                    order: [
                        ['bank', 'name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(bankAccounts);

            } catch (error) {
                //Exception.error(res, error);
            }
        }).catch((error) => {
            //Exception.unauthorized(res, error);
        });
    }

    async contabilityCategorie(req, res) {
        Authorization.verify(req, res).then(async ({company}) => {
            try {

                const db = new AppContext()

                const contabilityCategories = await db.ContabilityCategorie.findAll({
                    attributes: ['id', 'name'],
                    where: [{
                        '$companyId$': company.id,
                    }],
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(contabilityCategories);

            } catch (error) {
                //Exception.error(res, error);
            }
        }).catch((error) => {
            //Exception.unauthorized(res, error);
        });
    }

    async receivementMethod(req, res) {
        Authorization.verify(req, res).then(async ({company}) => {
            try {

                const db = new AppContext()

                const receivementMethods = await db.ReceivementMethod.findAll({
                    attributes: ['id'],
                    include: [
                        {model: db.CurrencyMethod, as: 'currencyMethod', attributes: ['id', 'name']}
                    ],
                    where: [{
                        '$companyId$': company.id,
                        '$currencyMethod.name$': {[Op.like]: `%${req.body?.search.replace(' ', "%").toUpperCase()}%`}
                    }],
                    order: [
                        ['currencyMethod', 'name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(_.map(receivementMethods, (receivementMethod) => Object.create(receivementMethod.currencyMethod)));

            } catch (error) {
                //Exception.error(res, error);
            }
        }).catch((error) => {
            //Exception.unauthorized(res, error);
        });
    }

    async taskMethod(req, res) {
        Authorization.verify(req, res).then(async ({user}) => {
            try {

                const db = new AppContext()

                const taskMethods = await db.TaskMethod.findAll({
                    attributes: ['id', 'name'],
                    order: [
                        ['name', 'asc']
                    ],
                    limit: 20
                });

                res.status(200).json(taskMethods);

            } catch (error) {
                //Exception.error(res, error);
            }
        }).catch((error) => {
            //Exception.unauthorized(res, error);
        });
    }

    /*
    async service(req, res) {
        Auth.verify(req, res).then(async ({options}) => {
            try {

                const db = new AppContext(options)

                const services = await db.Service.findAll({
                    attributes: ["id", "description"],
                    where: {'description': {[Op.like]: `%${req.body?.search.replace(' ', "%")}%`}},
                    order: [["description", "asc"]],
                    limit: 20
                });

                res.status(200).json(services);

            } catch (error) {
                Exception.error(res, error);
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }
    */

    /*
    async vehicle(req, res) {
        Auth.verify(req, res).then(async ({options}) => {
            try {

                const db = new AppContext(options)

                const vehicles = await db.Vehicle.findAll({
                    attributes: ["id", "identity"],
                    where: {identity: {[Op.like]: `%${req.body?.search.replace(' ', "%")}%`}},
                    order: [["identity", "asc"]],
                    limit: 20
                });

                res.status(200).json(vehicles);

            } catch (error) {
                Exception.error(res, error);
            }
        }).catch((error) => {
            Exception.unauthorized(res, error);
        });
    }
    */
          
}