const { expect } = require('chai');
const mongoose = require('mongoose');
const { makeRes, sinon } = require('./_helpers');

const { deleteVisitor } = require('../controllers/visitorController');
const Visitor = require('../models/Visitor');
const mongooseLib = require('mongoose');

describe('VM-7 deleteVisitor', () => {
  afterEach(() => sinon.restore());

  it('deletes a visitor and returns confirmation', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id }, user: { id: new mongoose.Types.ObjectId() } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findOneAndDelete').resolves({ _id: id });

    await deleteVisitor(req, res);

    expect(res.json.calledWithMatch({ message: 'Visitor deleted', id })).to.be.true;
  });

  it('returns 400 on invalid ObjectId', async () => {
    const req = { params: { id: 'bad' }, user: { id: 'u1' } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(false);

    await deleteVisitor(req, res);

    expect(res.status.calledWith(400)).to.be.true;
  });

  it('returns 404 when visitor not found', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id }, user: { id: 'u1' } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findOneAndDelete').resolves(null);

    await deleteVisitor(req, res);

    expect(res.status.calledWith(404)).to.be.true;
  });

  it('handles errors and returns 500', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const req = { params: { id }, user: { id: 'u1' } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findOneAndDelete').throws(new Error('DB Error'));

    await deleteVisitor(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });
});