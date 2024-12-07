import { AppContext } from "../../../database/index.js"
import axios from 'axios'
import qs from 'qs'

import _ from 'lodash';

export class IntegrationMercadoLivre {
  
  static verify = async () => {

    const db = new AppContext();

    var companyIntegration = await db.CompanyIntegration.findOne({
        attributes: ['id', 'options'],
        where: [{id: '0eee427c-830f-4f68-b0a3-205bfd15082b'}]
    })

    if (!companyIntegration.options?.id) {
      throw new Error('E necessário realizar o login!');
    }

    let data = qs.stringify({
      grant_type: 'refresh_token', 
      client_id: '1928835050355270', 
      client_secret: 'HS4Bo6e3KHgQF8jpRZvGg7zXjWFv7ybi', 
      refresh_token: companyIntegration.options?.refresh_token
    })

    let config = {
      method: 'post',
      url: 'https://api.mercadolibre.com/oauth/token',
      headers: { 
        'accept': 'application/json', 
        'content-type': 'application/x-www-form-urlencoded'
      },
      data
    };

    const r = await axios.request(config);

    companyIntegration.options = {...companyIntegration.options, refresh_token: r.data.refresh_token};

    await companyIntegration.save();

    return { id: companyIntegration.mercadoLivre?.id, access_token: r.data.access_token };
 
  }

}