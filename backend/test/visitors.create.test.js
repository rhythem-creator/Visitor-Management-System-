const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

// Match the controller export and the real file paths
const { addVisitor } = require('../controllers/visitorController');
const Visitor = require('../models/Visitor');

// helpers to fake res
function makeRes() {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.spy();
  return res;
}

describe('VM-4 createVisitor (addVisitor)', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('creates a visitor and returns 201 with payload', async () => {
    // arrange
    const userId = new mongoose.Types.ObjectId();
    const req = {
      user: { id: userId },
      body: {
        name: 'Alice',
        phone: '0412345678',
        purpose: 'Meeting',
        host: 'Bob',
        checkIn: '2025-08-14T10:00:00.000Z',
        status: 'In',
      },
    };
    const res = makeRes();

    const created = { _id: new mongoose.Types.ObjectId(), ...req.body, userId };
    const createStub = sinon.stub(Visitor, 'create').resolves(created);

    // act
    await addVisitor(req, res);

    // assert
    expect(createStub.calledOnce).to.be.true;
    expect(createStub.firstCall.args[0]).to.include({
      userId,
      name: 'Alice',
      phone: '0412345678',
      purpose: 'Meeting',
      host: 'Bob',
      status: 'In',
    });

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(created)).to.be.true;
  });

  it('handles errors and returns 500', async () => {
    // arrange
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name: 'Bad' },
    };
    const res = makeRes();

    sinon.stub(Visitor, 'create').rejects(new Error('DB Error'));

    // act
    await addVisitor(req, res);

    // assert
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: sinon.match.string })).to.be.true;
  });
});