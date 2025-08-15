// backend/test/visitors.update.test.js
const { expect } = require('chai');
const mongoose = require('mongoose');
const { makeRes, sinon } = require('./_helpers');

const { updateVisitor } = require('../controllers/visitorController');
const Visitor = require('../models/Visitor');

describe('VM-6 updateVisitor', () => {
  afterEach(() => sinon.restore());

  it('updates a visitor and returns updated doc (payload)', async () => {
    const id = new mongoose.Types.ObjectId().toString();
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
    await updateVisitor(req, res);

    // controller may or may not call res.status(200); we assert on payload
    expect(res.json.calledWithMatch(updated)).to.equal(true);
  });

  it('returns 400 on invalid ObjectId', async () => {
    const req = {
      params: { id: 'not-an-id' },
      body: { name: 'X' },
      user: { id: 'u1' },
    };

    sinon.stub(mongoose, 'isValidObjectId').returns(false);

    const res = makeRes();
    await updateVisitor(req, res);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(res.json.calledWithMatch({ message: 'Invalid visitor id' })).to.equal(true);
  });

  it('returns 404 when visitor not found', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = {
      params: { id },
      body: { name: 'Z' },
      user: { id: 'u1' },
    };

    sinon.stub(mongoose, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findById').resolves(null);

    const res = makeRes();
    await updateVisitor(req, res);

    expect(res.status.calledWith(404)).to.equal(true);
    expect(res.json.calledWithMatch({ message: 'Visitor not found' })).to.equal(true);
  });

  it('handles errors and returns 500', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = {
      params: { id },
      body: { name: 'Err' },
      user: { id: 'u1' },
    };

    sinon.stub(mongoose, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findById').throws(new Error('DB Error'));

    const res = makeRes();
    await updateVisitor(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.calledWithMatch({ message: sinon.match.string })).to.equal(true);
  });
});