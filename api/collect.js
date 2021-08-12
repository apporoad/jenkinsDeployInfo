var configs = require('../collect.config.js')
var lisaP = require('lisa.promise')
var req = require('mini.req.js')
var moment = require('moment')
var deployInfo = require('./index')

function drawNum(str){
    var numArr = str.match(/\d+/g)
    if(numArr && numArr.length>0){
        return numArr[0]
    }
    return null
}

var getDeployLastVersion = function(node){
    var versions = deployInfo.deploy['@get']({ node : node})
    if(versions.length>1){
        return versions[1]
    }
    return null
}

module.exports = {
    "@get": async function(params){
        const LiSAP = lisaP(5)

        var nodes = configs.nodes
        if(params && params.node && params.node !='false'){
            nodes = nodes.filter(one=> { 
                if(params.node.indexOf(',') > -1){
                    var ns = params.node.split(',')
                    for(var i=0;i<ns.length;i++){
                        var n = ns[i]
                        if(n){
                            if(one.deploy.indexOf(n) > -1){
                                return true
                            }
                        }
                    }
                }else{
                    return one.deploy.indexOf(params.node) > -1 
                }
                return false
            })
        }
        if(params && params.name && params.name !='false'){
            nodes = nodes.filter(one=> { 
                if(params.name.indexOf(',') > -1){
                    var ns = params.name.split(',')
                    for(var i=0;i<ns.length;i++){
                        var n = ns[i]
                        if(n){
                            if(one.name.indexOf(n) > -1){
                                return true
                            }
                        }
                    }
                }else{
                    return one.name.indexOf(params.name) > -1 
                }
                return false
            })
        }
        if(params && params.url && params.url !='false'){
            nodes = nodes.filter(one=> { 
                if(params.url.indexOf(',') > -1){
                    var ns = params.url.split(',')
                    for(var i=0;i<ns.length;i++){
                        var n = ns[i]
                        if(n){
                            if(one.commitIdUrl.indexOf(n) > -1){
                                return true
                            }
                        }
                    }
                }else{
                    return one.commitIdUrl.indexOf(params.url) > -1 
                }
                return false
            })
        }
        
        LiSAP.assignBatch(async one => {
            var result = Object.assign({},one)

            result.commitId = await req.get(one.commitIdUrl) || null
            result.tempVersion = await req.get(one.tempVersionUrl) || null

            result.commitId = result.commitId.length < 50 ? result.commitId : 'error'
            result.tempVersion = result.tempVersion.length < 50 ? result.tempVersion : 'error'

            //添加距离时间
            var dateStr = drawNum(result.tempVersion)
            if(dateStr){
                result.fromNow = moment(dateStr, "YYYYMMDDhhmmss").fromNow()
            }else{
                result.fromNow = '-'
            }
            var lv = getDeployLastVersion(result.name)
            if(result.tempVersion && lv && result.tempVersion.indexOf(lv) > -1){
                result.lastVersion= '已是最新版本'
            }
            else{
                result.lastVersion = lv
            }
            return result
        },nodes)
        var results = await LiSAP.action()

        if(results && results.length>0){
            results.sort((a,b)=>{ return (a.order || 1) - (b.order || 1)})
            return results
        }
        
        return []
    }
}