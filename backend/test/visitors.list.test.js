const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { getVisitors } = require('../controllers/visitorController');
const Visitor = require('../models/Visitor');

function makeRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.spy();
  return res;
}

describe('VM-5 getVisitors', () => {
  afterEach(() => sinon.restore());

  it('lists visitors successfully', async () => {
    const userId = new mongoose.Types.ObjectId();
    const req = { user: { id: userId } };
    const res = makeRes();

    const fakeVisitors = [{ name: 'Alice' }];
    sinon.stub(Visitor, 'find').returns({ sort: sinon.stub().returns(fakeVisitors) });

    await getVisitors(req, res);

    expect(res.json.calledWith(fakeVisitors)).to.be.true;
  });

  it('handles errors', async () => {
    const req = { user: { id: 'id' } };
    const res = makeRes();

    sinon.stub(Visitor, 'find').throws(new Error('DB Error'));

    await getVisitors(req, res);

    expect(res.status.calledWith(500)).to.be.true;
  });
});