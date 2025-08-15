// backend/test/visitors.update.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const { updateVisitor } = require('../controllers/visitorController');
const Visitor = require('../models/Visitor');

function makeRes() {
  return { status: sinon.stub().returnsThis(), json: sinon.spy() };
}

describe('VM-6 updateVisitor', () => {
  afterEach(() => sinon.restore());

  it('updates a visitor and returns 200 with updated doc', async () => {
    const id = new mongoose.Types.ObjectId();
    const req = {
      params: { id },
      body: { name: 'Bob', phone: '0411111111' },
      user: { id: 'user1' }
    };
    const res = makeRes();

    // fake mongoose document with save()
    const fakeDoc = {
      _id: id,
      name: 'Bob',
      phone: '0411111111',
      save: sinon.stub().resolvesThis()
    };

    sinon.stub(Visitor, 'findById').resolves(fakeDoc);

    await updateVisitor(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ _id: id })).to.be.true;
  });

  it('returns 404 when visitor not found', async () => {
    const id = new mongoose.Types.ObjectId();
    const req = {
      params: { id },
      body: { name: 'No One' },
      user: { id: 'user1' }
    };
    const res = makeRes();

    sinon.stub(Visitor, 'findById').resolves(null);

    await updateVisitor(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
  });

  it('handles errors and returns 500', async () => {
    const id = new mongoose.Types.ObjectId();
    const req = {
      params: { id },
      body: { name: 'Err' },
      user: { id: 'user1' }
    };
    const res = makeRes();

    sinon.stub(Visitor, 'findById').throws(new Error('DB Error'));

    await updateVisitor(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});