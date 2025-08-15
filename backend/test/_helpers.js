// backend/test/_helpers.js
const sinon = require('sinon');

function makeRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.spy();
  return res;
}

module.exports = { makeRes, sinon };