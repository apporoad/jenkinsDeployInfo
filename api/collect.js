var configs = require('../collect.config.json')
var lisaP = require('lisa.promise')
var req = require('mini.req.js')
var moment = require('moment')

function drawNum(str){
    var numArr = str.match(/\d+/g)
    if(numArr && numArr.length>0){
        return numArr[0]
    }
    return null
}

module.exports = {
    "@get": async function(params){
        const LiSAP = lisaP(2)
        LiSAP.assignBatch(async one => {
            var result = Object.assign({},one)

            result.commitId = await req.get(one.commitIdUrl) || null
            result.tempVersion = await req.get(one.tempVersionUrl) || null

            result.commitId = result.commitId.length < 50 ? result.commitId : 'error'
            result.tempVersion = result.tempVersion.length < 50 ? result.tempVersion : 'error'

            var dateStr = drawNum(result.tempVersion)
            if(dateStr){
                result.fromNow = moment(dateStr, "YYYYMMDDhhmmss").fromNow()
            }else{
                result.fromNow = '-'
            }

            
            return result
        },configs.nodes)
        var results = await LiSAP.action()

        results.sort((a,b)=>{ return (a.order || 1) - (b.order || 1)})
        return results
    }
}