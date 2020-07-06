const FormList = artifacts.require('./FormList.sol')

contract('FormList', (accounts) => {
  before(async () => {
    this.formList = await FormList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.formList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('lists forms', async () => {
    const formCount = await this.formList.formCount()
    const form = await this.formList.forms(formCount)
    assert.equal(form.id.toNumber(), formCount.toNumber())
    assert.equal(form.content, 'Full Name | IC Number | General Insurance / Life Insurance')
    assert.equal(form.completed, false)
    assert.equal(formCount.toNumber(), 1)
  })

  it('creates forms', async () => {
    const result = await this.formList.createForm('A new form')
    const formCount = await this.formList.formCount()
    assert.equal(formCount, 2)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 2)
    assert.equal(event.content, 'A new form')
    assert.equal(event.completed, false)
  })

  it('toggles form completion', async () => {
    const result = await this.formList.toggleCompleted(1)
    const form = await this.formList.forms(1)
    assert.equal(form.completed, true)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.completed, true)
  })

})
