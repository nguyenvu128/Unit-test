const chai = require('chai')
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const sandbox = sinon.createSandbox();

const HttpStatus = require('http-status-codes');
const sequelize = require('sequelize');
const userController = require('../controller/user.controller');
const userModel = require('../model/user.model');

describe('User feature', () => {
    const sampleUser = {
        firstname: "Jane",
        lastname: "Smith",
        email: "jane@smith.com",
        password: "123456789",
        confirmPassword: "123456789",
        save: sandbox.stub().resolves()
        };
    const findStub = sandbox.stub(sequelize.Model, 'findOne').resolves(sampleUser);
    
    context('create user', ()=>{
        let FakeUserClass, saveStub, result;

        beforeEach(async ()=>{
            saveStub = sandbox.stub().resolves(sampleUser);
            FakeUserClass = sandbox.stub().returns({save: saveStub});

            users.__set__('User', FakeUserClass);
            result = await users.create(sampleUser);
        })

        it('should reject invalid args', async()=>{
            await expect(users.create(sampleUser)).to.eventually.be.rejectedWith('Invalid arguments');
            // await expect(users.create({name: 'foo'})).to.eventually.be.rejectedWith('Invalid arguments');
            // await expect(users.create({email: 'foo@bar.com'})).to.eventually.be.rejectedWith('Invalid arguments');
        })

        it('should call User with new', ()=>{
            expect(FakeUserClass).to.have.been.calledWithNew;
            expect(FakeUserClass).to.have.been.calledWith(sampleUser);
        })

        it('should save the user', ()=>{
            expect(saveStub).to.have.been.called;
        })

        it('should call mailer with email and name', ()=>{
            expect(mailerStub).to.have.been.calledWith(sampleUser.email, sampleUser.name);
        })

        it('should reject errors', async()=>{
            saveStub.rejects(new Error('fake'));

            await expect(users.create(sampleUser)).to.eventually.be.rejectedWith('fake');
        })
    })
});