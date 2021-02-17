const expect = require('chai').expect;
const authmiddleware = require('../middleware/is-auth');

describe('auth middleware',function(){
    it("should thorow error if no authenticate header is present",function(){
        const req = {
            get:function(headername){
                return null
            }
        }
        expect(authmiddleware.bind(this,req,{},()=>{})).to.throw('Not Authenticated')
    })
    
    
    it("authenticate header is only",function(){
        const req = {
            get:function(headername){
                return 'xyz'
            }
        }
        expect(authmiddleware.bind(this,req,{},()=>{})).to.throw()
    })
})

