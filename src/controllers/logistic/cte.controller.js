import { AppContext } from "../../database/index.js"
import { Authorization } from "../authorization.js"
import { formidable } from 'formidable'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { fileURLToPath } from 'url'
import xml2js from 'xml2js'
import dayjs from "dayjs"
import Sequelize from "sequelize"
//import axios from 'axios'

export class LogisticCteController {

  ctes = async (req, res) => {
    //await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        const limit = req.body.limit || 50
        const offset = req.body.offset || 0
        const search = req.body.search

        const where = []

        if (search?.input) {

          if (search?.picker == 'nCT') {
            where.push({nCT: search.input.match(/\d+/g)})
          }
  
          if (search?.picker == 'sender') {
            where.push({'$shippiment.sender.RazaoSocial$': {[Sequelize.Op.like]: `%${search.input.replace(' ', "%")}%`}})
          }

          if (search?.picker == 'chaveCt') {
            where.push({chaveCT: search.input.match(/\d+/g)})
          }

        }
        
        where.push({cStat: 100})

        const ctes = await db.Cte.findAndCountAll({
          attributes: ['id', 'dhEmi', 'nCT', 'serieCT', 'chaveCT', 'cStat', 'baseCalculo'],
          include: [
            {model: db.Partner, as: 'recipient', attributes: ['id', 'surname']},
            {model: db.Shippiment, as: 'shippiment', attributes: ['id'], include: [
              {model: db.Partner, as: 'sender', attributes: ['id', 'surname']}
            ]},
            {model: db.CteNfe, as: 'cteNfes', attributes: ['id', 'nfeId'], include: [
              {model: db.Nfe, as: 'nfe', attributes: ['id', 'chaveNf']},
            ]},
          ],
          limit: limit,
          offset: offset * limit,
          order: [['dhEmi', 'desc']],
          where,
          subQuery: false
        })

        res.status(200).json({
          request: {
            limit, offset
          },
          response: {
            rows: ctes.rows, count: ctes.count
          }
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  async detail(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        const { id } = req.body

        const db = new AppContext()

        await db.transaction(async (transaction) => {
            
          const cte = await db.Cte.findOne({
            attributes: ['id', 'nCT', 'serieCT', 'chaveCt'],
            include: [
              {model: db.Partner, as: 'taker', attributes: ['id', 'name', 'surname']},
              {model: db.Partner, as: 'recipient', attributes: ['id', 'name', 'surname']},
              {model: db.City, as: 'origin', attributes: ['id', 'name']},
              {model: db.City, as: 'destiny', attributes: ['id', 'name']}
            ],
            where: [{id: id}],
            transaction
          })

          res.status(200).json(cte)
          
        })

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  submit = async (req, res) => {
    //await Authorization.verify(req, res).then(async () => {
      try {

        let cte = {
          id: req.body.id,
          takerId: req.body.taker?.id || null,
          recipientId: req.body.recipient?.id || null,
          originId: req.body.origin?.id || null,
          destinyId: req.body.destiny?.id || null,
        }

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          if (_.isEmpty(cte.id)) {
            cte = await db.Cte.create(cte, {transaction})
          } else {
            await db.Cte.update(cte, {where: [{ID: cte.id}], transaction})
          }

        })

        res.status(200).json(cte)

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  upload = async (req, res) => {
    //await Authorization.verify(req, res).then(async ({company}) => {
      try {

        const db = new AppContext()

        

        const form = formidable({});

        const archives = await form.parse(req)

        for (const file of archives[1].files) {

          await db.transaction(async (transaction) => {

            const xml = fs.readFileSync(file.filepath, 'utf8')

            const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });

            const json = await parser.parseStringPromise(xml)

            let cte = await db.Cte.findOne({attributes: ['id'], where: [{chaveCT: json.cteProc.protCTe.infProt.chCTe}]})

            if (cte) {
              return
            }

            const sender = await db.Partner.findOne({attributes: ['id', 'diasPrazoPagamento'], where: [{cpfCnpj: json.cteProc.CTe.infCte.rem.CNPJ || json.cteProc.CTe.infCte.rem.CPF}], transaction})

            if (!sender) {
              throw new Error('Remetente não está cadastrado!')
            }

            let recipient = await db.Partner.findOne({where: {cpfCnpj: json.cteProc.CTe.infCte.dest.CNPJ || json.cteProc.CTe.infCte.dest.CPF}, transaction})

            if (!recipient) {

              const partner = {cpfCnpj: json.cteProc.CTe.infCte.dest.CNPJ || json.cteProc.CTe.infCte.dest.CPF, name: json.cteProc.CTe.infCte.dest.xNome, surname: json.cteProc.CTe.infCte.dest.xNome, ISDestinatario: 1, ativo: 1}

              console.log(partner)

              recipient = await db.Partner.create(partner, {transaction})

              //throw new Error('Destinatário não está cadastrado!')
            }

            cte = {

              nCT: json.cteProc.CTe.infCte.ide.nCT,
              cCT: json.cteProc.CTe.infCte.ide.cCT,
              serieCT: json.cteProc.CTe.infCte.ide.serie,
              chaveCT: json.cteProc.protCTe.infProt.chCTe,
              tpCTe: json.cteProc.CTe.infCte.ide.tpCTe,
              dhEmi: dayjs(json.cteProc.CTe.infCte.ide.dhEmi).format('YYYY-MM-DD HH:mm:ss'),
              CFOP: json.cteProc.CTe.infCte.ide.CFOP,

              cStat: json.cteProc.protCTe.infProt.cStat,
              xMotivo: json.cteProc.protCTe.infProt.xMotivo,
              nProt: json.cteProc.protCTe.infProt.nProt,
              dhRecbto: dayjs(json.cteProc.protCTe.infProt.dhRecbto).format('YYYY-MM-DD HH:mm:ss'),

              codigoUnidade: 1,
              vTPrest: json.cteProc.CTe.infCte.vPrest.vTPrest,
              valorAReceber: json.cteProc.CTe.infCte.vPrest.vRec,

              recipientId: recipient.id,

              xml

            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS00) {
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS00.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS00.CST
            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS20) {
              cte.pRedBC = json.cteProc.CTe.infCte.imp.ICMS.ICMS20.pRedBC
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS20.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS20.CST
            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS45) {
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS45.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS45.CST
            }

            if (json.cteProc.CTe.infCte.imp.ICMS.ICMS60) {
              cte.pICMS = json.cteProc.CTe.infCte.imp.ICMS.ICMS60.pICMSSTRet
              cte.baseCalculo = json.cteProc.CTe.infCte.imp.ICMS.ICMS60.vBC
              cte.CST = json.cteProc.CTe.infCte.imp.ICMS.ICMS60.CST
            }

            const receivement = await db.Receivement.create({
              companyId: 1,
              payerId: sender.id,
              documentNumber: cte.nCT,
              description: `Recebimento do CT-e ${cte.nCT}`,
              total: cte.valorAReceber,
              releaseDate: cte.dhEmi,
              issueDate: cte.dhEmi,
              categorieId: 1766,
              createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }, {transaction})

            await db.ReceivementInstallment.create({
              receivementId: receivement.id,
              description: receivement.description,
              installment: 1,
              dueDate: dayjs(cte.dhEmi).add(sender?.diasPrazoPagamento || 0, 'day').format('YYYY-MM-DD'),
              amount: cte.valorAReceber,
              createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            }, {transaction})

            cte.receivementId = receivement.id

            await db.Cte.create(cte, {transaction})

          })

        }


        res.status(200).json({})

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  async addNfe(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          const nfe = await db.Nfe.findOne({attributes: ['id'], where: [{chaveNf: req.body.chaveNf}], transaction})

          let cteNfe

          if (nfe) {

            cteNfe = await db.CteNfe.findOne({attributes: ['id'], where: [{IDCte: req.body.cteId, IDNota: nfe.id}], transaction})

            if (cteNfe) {
              res.status(201).json({message: 'Nota fiscal já está incluída!'})
              return
            }

          }

          const file = `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`

          const xml = `<distDFeInt xmlns=\"http://www.portalfiscal.inf.br/nfe\" versao=\"1.01\"><tpAmb>1</tpAmb><cUFAutor>52</cUFAutor><CNPJ>04058687000177</CNPJ><consChNFe><chNFe>${req.body.chaveNf}</chNFe></consChNFe></distDFeInt>`

          if (!nfe) {
            //const r = await axios.post('http://localhost:5290/dfe/distribuicao', {certificate: {file, password: '040586'}, tpAmb: '1', xml})
            //console.log(r)
          }

          cteNfe = await db.CteNfe.create({cteId: req.body.cteId, nfeId: nfe.id})
          
          res.status(200).json({cteNfe})

        })


      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

  async deleteNfe(req, res) {
    //await Authorization.verify(req, res).then(async () => {
      try {

        const db = new AppContext();

        await db.transaction(async (transaction) => {

          await db.CteNfe.destroy({where: [{id: req.body.id}], transaction})

        })

        res.status(200).json({})

      } catch (error) {
        res.status(500).json({message: error.message})
      }
    //}).catch((error) => {
    //  res.status(400).json({message: error.message})
    //})
  }

}