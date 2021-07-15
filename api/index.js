var config = require('../config.json')
var fs = require('fs')
var path = require('path')

var cacheInfos = null
var lastTime = null

var getCachedFileInfos = function(){
    var now = Date.now()
    if(cacheInfos && lastTime && now - lastTime < 5000){
        return cacheInfos
    }

    var infos = []
    fs.readdirSync(config.dir).forEach((file)=>{
        var pathname=path.join(config.dir,file)
        var state = fs.statSync(pathname)
        if(!state.isDirectory()){
            infos.push({
                name : file,
                mtime : state.mtime.getTime()
            })
        }
    })
    lastTime = now
    cacheInfos = infos
    return cacheInfos
}

module.exports = {
    deploy :  { 
        "@get": function(params){
            var infos = getCachedFileInfos()
            var results = ['null']
            infos.sort((a,b)=>{
                return b.mtime - a.mtime 
            })
            infos.forEach(function(info){
                //console.log(typeof info.name)
                var name = info.name.replace('.zip','')
                if(params && params.node){
                    if(name.indexOf(params.node) == 0){
                        results.push(name.substr(params.node.length + 1))
                    }
                }
            })
            // console.log(JSON.stringify(infos))
            return results
        }
    }
}