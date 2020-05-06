const axios = require('axios')

const production = process.NODE_ENV === 'production';
const origin = production ? process.env.origin : '*'

exports.trigger = (req, res) => {

  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method == 'OPTIONS') {
    res.status(204).send('');
  }

  const authorized = req.get('origin') === origin || !production;
  if (!authorized) {
    res.sendStatus(401);
  } else {
    if (req.query.api === undefined || req.query.keyNames === undefined) {
      res.status(422).send('Api request url or keynames missing')
    }
    let api = req.query.api
    api += addKeys(req.query.keyNames)
    axios.get(api).then((resp) => {
      res.json(resp.data)
    }).catch((err) => {
      let status = err.status || 400
      res.status(status).send(err)
    })
  }
};

function addKeys(keyNames) {
  let keys = ''
  keyNames = JSON.parse(`${keyNames}`)
  for (let arr of keyNames) { 
    let keyName = arr[0];
    let keyValue = process.env[`${arr[1]}`];
    keys += `&${keyName}=${keyValue}`
  }
  return keys
}
