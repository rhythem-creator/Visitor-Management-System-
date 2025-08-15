const { expect } = require('chai');
const mongoose = require('mongoose');
const { makeRes, sinon } = require('./_helpers');

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
      user: { id: 'u1' },
    };

    // controller: isValidObjectId → true
    sinon.stub(mongoose, 'isValidObjectId').returns(true);

    // emulate Mongoose doc with save()
    const updated = { _id: id, name: 'Bob', phone: '0411111111' };
    const doc = { save: sinon.stub().resolves(updated) };

    sinon.stub(Visitor, 'findById').resolves(doc);

    const res = makeRes();

    // fake mongoose document with save()
    const fakeDoc = {
      _id: id,
      name: 'Bob',
      phone: '0411111111',
      save: sinon.stub().resolvesThis()
    };

    sinon.stub(mongoose, 'isValidObjectId').returns(false);

    const res = makeRes();
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

    sinon.stub(mongoose, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findById').resolves(null);

    const res = makeRes();
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

    sinon.stub(mongoose, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findById').throws(new Error('DB Error'));

    const res = makeRes();
    await updateVisitor(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.calledWithMatch({ message: sinon.match.string })).to.equal(true);
  });
});