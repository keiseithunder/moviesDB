const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/javDB',{useNewUrlParser:true});

const avSchema = mongoose.Schema({
    fileName:String
});

const AV = mongoose.model('AdultMovie',avSchema);

app.get('/',function(req,res){
    res.render('index');
});

app.post('/',function(req,res){
    let allAv = req.body.avName;
    allAv = allAv.replaceAll("\n", " ");
    allAv = allAv.replaceAll("\r", "");
    let avArray = allAv.split(' ');
    for (let i = avArray.length;i>=0;i--) {
        if(avArray[i]==''){
            avArray.splice(i,1);
        }
    }
    let avObj = [];
    avArray.forEach(avStr => {
        item = {
            fileName : avStr
        }
        avObj.push(item);
    });
    AV.insertMany(avObj,function(err){
        if(!err){
            res.redirect('/');
        }
    })
});

app.get('/search',function(req,res){
    res.render('search',{found:false});
})

app.post('/search',function(req,res){
    let query = req.body.avCode;
    // query = "/"+query+"/";
    let found = false;
    let qReg =  new RegExp("^"+query+".*", "i");
    console.log(qReg);
    AV.findOne({fileName:qReg},function(err,result){
        console.log(result);
        if(!err){
            if(result){
                console.log(result+"1");
                found = true;
            }
        }
        res.render('search',{found:found});
    });
});

let port = process.env.PORT;
if(port== null||port ==""){
    port=3000;
}
app.listen(port,function(){
    console.log("app running at http://localhost:"+port);
})

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};