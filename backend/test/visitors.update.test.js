// VM‑6 updateVisitor tests (final)
describe('VM-6 updateVisitor', () => {
  afterEach(() => sinon.restore());

  it('updates a visitor and returns 200 with updated doc', async () => {
    const id = new (require('mongoose').Types.ObjectId)().toString();
    const req = {
      params: { id },
      body: { name: 'Bob', phone: '0411111111' },
      user: { id: 'user1' },
    };
    const res = makeRes();

    // fake mongoose doc with save()
    const fakeDoc = { _id: id, name: 'Old', phone: '0200', save: sinon.stub().callsFake(function () {
      this.name = req.body.name;
      this.phone = req.body.phone;
      return Promise.resolve(this);
    })};

    sinon.stub(mongooseLib, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findById').resolves(fakeDoc);

    await updateVisitor(req, res);

    expect(res.status.calledWith(200)).to.equal(true);
    expect(res.json.calledWithMatch({ _id: id, name: 'Bob', phone: '0411111111' })).to.equal(true);
  });

  it('returns 400 on invalid ObjectId', async () => {
    const req = { params: { id: 'bad' }, body: {}, user: { id: 'u1' } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(false);

    await updateVisitor(req, res);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(res.json.calledWithMatch({ message: 'Invalid visitor id' })).to.equal(true);
  });

  it('returns 404 when visitor not found', async () => {
    const id = new (require('mongoose').Types.ObjectId)().toString();
    const req = { params: { id }, body: { name: 'No One' }, user: { id: 'user1' } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findById').resolves(null);

    await updateVisitor(req, res);

    expect(res.status.calledWith(404)).to.equal(true);
    expect(res.json.calledWithMatch({ message: 'Visitor not found' })).to.equal(true);
  });

  it('handles errors and returns 500', async () => {
    const id = new (require('mongoose').Types.ObjectId)().toString();
    const req = { params: { id }, body: { name: 'Err' }, user: { id: 'user1' } };
    const res = makeRes();

    sinon.stub(mongooseLib, 'isValidObjectId').returns(true);
    sinon.stub(Visitor, 'findById').throws(new Error('DB Error'));

    await updateVisitor(req, res);

    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.equal(true);
  });
});