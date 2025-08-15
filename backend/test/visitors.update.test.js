const { expect } = require('chai');
const mongoose = require('mongoose');
const { makeRes, sinon } = require('./_helpers');

const { updateVisitor } = require('../controllers/visitorController');
const Visitor = require('../models/Visitor');
const mongooseLib = require('mongoose'); // for isValidObjectId when you test 400

describe('VM-6 updateVisitor', () => {
  afterEach(() => sinon.restore());

  it('updates a visitor and returns 200 with updated doc', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = {
      params: { id },
      body: { name: 'Bob', phone: '0411111111' },
      user: { id: 'user1' }
    };
    const res = makeRes();

    // Fake mongoose document with save()
    const fakeDoc = {
      _id: id,
      name: 'Old',
      phone: '000',
      save: sinon.stub().callsFake(function () {
        this.name = req.body.name;
        this.phone = req.body.phone;
        return Promise.resolve(this);
      })
    };

    sinon.stub(Visitor, 'findById').resolves(fakeDoc);

    await updateVisitor(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ _id: id, name: 'Bob', phone: '0411111111' })).to.be.true;
  });

  it('returns 400 on invalid ObjectId', async () => {
    const req = { params: { id: 'bad' }, body: {}, user: { id: 'u1' } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(false);

    await updateVisitor(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Invalid visitor id' })).to.be.true;
  });

  it('returns 404 when visitor not found', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id }, body: { name: 'No One' }, user: { id: 'user1' } };
    const res = makeRes();

    sinon.stub(Visitor, 'findById').resolves(null);

    await updateVisitor(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Visitor not found' })).to.be.true;
  });

  it('handles errors and returns 500', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id }, body: { name: 'Err' }, user: { id: 'user1' } };
    const res = makeRes();

    sinon.stub(Visitor, 'findById').throws(new Error('DB Error'));

    await updateVisitor(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});