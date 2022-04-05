const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const axios = require("axios").default
const RSVP = require('rsvp');
const moment = require('moment'); // require
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const cherangi = require("cherangi");
const quoteOptions = {
  method: 'GET',
  url: process.env.NEXT_X_RAPIDAPI_URL,
  params: {language_code: 'en'},
  headers: {
    'x-rapidapi-host': process.env.NEXT_X_RAPIDAPI_HOST,
    'x-rapidapi-key': process.env.NEXT_X_RAPIDAPI_KEY
  }
};
var dnaList = new Set();
const domain = 'http://localhost:3000/comic?';
const nftsPath='./data/NFTs/';
const snapWidth = 1200;
const snapHeight = 620;
var snapSize = 100;
var snapColumns = 1;
var snapColor = "Random";
const snapR = 128;
const snapG = 128;
const snapB = 128;
const snapA = .9;
const collection ="MIMP - My Pride My Identity";
const price="0.2";
const blockchaintech="Polygon";
const compiler="MIMP-Custom-Compiler-V1.0";
var canvas, context;

function snapMakeColor(colorNumber) {
  $variation = colorNumber * .5; //If color =200, variation is 100
  $randomness = Math.floor((Math.random() * $variation) - $variation / 2); // 0-100, -50 = -50 to 50
  colorNumber = colorNumber - $randomness; // 200 
  if (colorNumber > 240) { colorNumber = 240; }
  else if (colorNumber < 15) { colorNumber = 15; }
  return colorNumber;
}

function snapMakeSize(sizeNumber) {
  $variation = sizeNumber * .5;
  $randomness = Math.floor((Math.random() * $variation) - ($variation));
  sizeNumber = sizeNumber + $randomness;
  return sizeNumber;
}

// SET COLOR
function snapSetColor($R, $G, $B) {
  snapRed = snapMakeColor($R);
  snapGreen = snapMakeColor($G);
  snapBlue = snapMakeColor($B);
  snapColor = 'rgba(' + snapRed + ',' + snapGreen + ',' + snapBlue + ',' + snapA + ')';
}

// SET SIZE
function snapSetSize() {
  snapSize = snapWidth / 25;
  snapColumns = snapWidth / snapSize;
  snapSize = snapMakeSize(snapSize);
}

//Generate random Unique Number out of an range
function myRandomInts(quantity, max) {
  const set = new Set()
  while (set.size < quantity) {
    set.add(Math.floor(Math.random() * max) + 1)
  }
  return set
}

//Snap Rectangle based on existing parameter width & height
function snapdiffRectangle(snapX, snapY, width, height) {
  //console.log('this being called');
  context.save();
  context.fillStyle = snapColor;
  context.fillRect(snapX, snapY, width, height);
  context.restore();
}

//Snap Rectangle based on existing global width & height
function snapRectangle(snapX, snapY) {
  context.save();
  context.fillStyle = snapColor;
  context.fillRect(snapX, snapY, snapSize, snapSize * (snapHeight / snapWidth));
  context.restore();
}

const Circle = function(x, y, dx, dy, radius) {
  this.x = x
  this.y = y
  this.dx = dx
  this.dy = dy
  this.radius = radius
  this.minRadius = radius
  this.draw = function() {
    context.beginPath()
    //var circlclock=[true,false,true,false];
    //var position=myRandomInts(1,circlclock.length-1);
    context.arc(this.x, this.y, this.radius-5, 0, Math.PI * 2, true);
    context.strokeStyle = 'white'
    context.stroke()
    snapSetColor(snapR, snapG, snapB);    
    context.fillStyle = snapColor;
    context.fill()
  }
}

//Snap Pride Flag & return coordinates to draw further rectangles over that flag.
function snapPrideFlag(){
  // First draw a White background
  snapSize = snapWidth;
  snapSetColor(255, 255, 255);
  snapRectangle(0, 0);
  // draw a Red stripe
  var border = 20;
  //leaving space for border while doing minus from width
  stripeWidth = snapWidth - border;
  //leaving space for border while doing minus from height
  var stripeheight = (snapHeight - border) / 6;
  var stripeylocation = 10;
  var stripexlocation = 10;
  snapSetColor(209, 34, 41);
  snapdiffRectangle(stripexlocation, stripeylocation, stripeWidth, stripeheight);
  // draw a Orange stripe    
  stripeylocation = stripeylocation + stripeheight;
  snapSetColor(246, 138, 30);
  snapdiffRectangle(stripexlocation, stripeylocation, stripeWidth, stripeheight);
  // draw a Yellow stripe  
  stripeylocation = stripeylocation + stripeheight;
  snapSetColor(253, 224, 26);
  snapdiffRectangle(stripexlocation, stripeylocation, stripeWidth, stripeheight);

  // draw a Green stripe  
  stripeylocation = stripeylocation + stripeheight;
  snapSetColor(0, 121, 64);
  snapdiffRectangle(stripexlocation, stripeylocation, stripeWidth, stripeheight);

  // draw a Indigo stripe  
  stripeylocation = stripeylocation + stripeheight;
  snapSetColor(36, 64, 142);
  snapdiffRectangle(stripexlocation, stripeylocation, stripeWidth, stripeheight);

  // draw a Violet stripe   
  stripeylocation = stripeylocation + stripeheight;
  snapSetColor(115, 41, 130);
  snapdiffRectangle(stripexlocation, stripeylocation, stripeWidth, stripeheight);

  var coordinates = {
    yLocation: stripeylocation,
    overallBorder: border};

  return coordinates;
}

function fillFlagwithRectangles(coordinates){
  for (var i = 0; i < snapColumns; i++) {
    for (var n = 0; n < snapColumns; n++) {
      snapSetSize();
      snapSetColor(snapR, snapG, snapB);
      var x = n * (snapWidth / snapColumns);
      var y = i * ((snapWidth / snapColumns) * (snapHeight / snapWidth));
      if (i == 0) {
        y = y - (coordinates.yLocation + coordinates.overallBorder);
        //console.log("Y: ",y);
      }
      if (n == snapColumns - 1) {
        snapdiffRectangle(x, y, snapSize - 10, 10);
      }else{
        snapdiffRectangle(15 + x, y, snapSize, 10);
      }
    }
  } 
}

function fillFlagwithCircles(coordinates){
  for (var i = 0; i < snapColumns; i++) {
    for (var n = 0; n < snapColumns; n++) {
      snapSetSize();
      snapSetColor(snapR, snapG, snapB);
      const radius = Math.random() * 20 + 1
      var x = n * (snapWidth / snapColumns);
      var y = i * ((snapWidth / snapColumns) * (snapHeight / snapWidth));
      const dx = (Math.random() - 0.5) * 2
      const dy = (Math.random() - 0.5) * 2
      if (i == 0) {
        y = y - (coordinates.overallBorder+5);
      }
      var circle;    
      if (n == snapColumns - 1) {
        circle = new Circle(x, y, dx, dy, radius)
      }else{
        circle = new Circle(x-25, y, dx, dy, radius)
      }
      circle.draw()
    }
  }
}

function getUniqueDNA(){
  var newDNA=uuidv4();
  var _finalDNA;
  if(!dnaList.has(newDNA)){
    _finalDNA=newDNA;
    dnaList.add(newDNA);
  }else{
    getUniqueDNA();
  }
  return _finalDNA;
}


var getQuote =  () =>{  
  var _promiseQuote= new RSVP.Promise(function(resolve, reject){
    var quote = "";
    axios.request(quoteOptions).then((res) => {
            if (res.data.originator.name == null){ 
              quote = "Unknown: " + res.data.content;
              quote=quote.replace(/\r?\n|\r/g, " ");
            }else{
              quote = res.data.originator.name + ": " + res.data.content;
            }           
        }).then(function (){                
            resolve(quote);
        }).catch(function (err){        
            console.log('Error Fetching Quote - Step -1', err);reject(this);
        });    
  });
  return _promiseQuote;
}

var getImage =  (url) =>{
  var _promiseImage= new RSVP.Promise(function(resolve, reject){
    var myimg;
    loadImage(url).then((imgdata) => {
      myimg=imgdata;            
    }).then(function(){
      resolve(myimg);
    }).catch(err => {
      console.log('Error:', err);
      reject(this);
    });
  });
  return _promiseImage;
}



//Function returns promise for calling Quote API 
var createInitilDataforNFT = function (seq, quote) {
    var rarity = 0;
    var imagName = 'MIMP-' + (seq) + ".png";
    var filename = nftsPath +(seq) + ".png";
    var imageURL = 'ipfs://' +"QmP61gQAPa4n5ojSZ1q4p25xytnJiJ9pm3vwe59rXLjowR"+ "/"+(seq) + ".png";
    var _set = Array.from(myRandomInts(1, 10));
    rarity = _set[0];
    var InitilDataforNFT = {
        dna: getUniqueDNA(),
        name: imagName,        
        description: "**‘"+collection+ "’** <br> ",
        image: imageURL,               
        date: moment(undefined).unix().toString(),
        edition: seq,
        attributes: [
          { trait_type: "IQuote", value: quote },
          { trait_type: "Rarity", value: rarity },
          { trait_type: "FileName", value: filename },
        ],
        creativeCredits: "These characters are designed by Gramener, to read more about them please visit https://gramener.com/companystory/. Codebase used to generate these characters is available under license https://opensource.org/licenses/MIT. Character Images are available under license https://creativecommons.org/licenses/by/4.0/.",
        levels : [],
        stats : [],
        unlockable_content : [],
        explicit_and_sensitive_content : true,
        supply: "1",
        blockchain: blockchaintech,
        price: price,
        compiler: compiler
    };
    return InitilDataforNFT;
};

function collateMetaforCollection(newData){
  try{
    //replace png extension to json from file name
    var jsonfilename = newData.attributes[2].value.replace("png", "json");
    //replace NFTs folder from path with JSON folder name
    jsonfilename = jsonfilename.replace("NFTs", "JSON");
    //console.log("Filename: ",jsonfilename);
    var jsondata=JSON.stringify(newData);
    fs.writeFileSync(jsonfilename, jsondata);    
    _collectionMetadata +=jsondata+",";      
    }catch (err) {
      return err;
    }
}
//URL Characters constants
const name =['humaaans','aavatar','humaaans','aavatar'];
const mirror=['mirror','','mirror','']
const face = ['%23F2EFEE','%23FFCC99','%23FAE7DO','%23FEB186','%23FFD9B3','%23FFCC99','%23EFE6DD ','%23EBD3C5','%23D7B6A5','%239F7967','%2370361C','%23483728','%23573719','%237B4B2A','%2380664D','%23403326','%23714937','%2365371E','%23492816','%23321B0F','%23FFCD94','%23COA183','%23FFE0BD','%23EAC086','%23FFE39F','%23FFAD60','%23BF9169','%23CAA661','%23B38659','%23E6B88A','%238C644D','%23BF9973','%23593123','%23FFDBAC','%23F1C27D','%23E0AC69','%23C68642'];
const hair = ['%23FAF0BE','%23FFF5B7','%23F4ECC4','%23000000','%23282828','%23505050','%23dc95dc','%2350b4ff','%235a3214','%23838794','%23727583','%236e727a','%2363626d','%23515158','%23857051','%237a6851','%2372624a','%236f5c45','%23605240','%232d170e','%234d2d1a','%236d4730','%23a97e6d','%23cc9f88'];
function createURL(){
  let pantRight =['%23dde3e9','%235C63AB','%23BF2266','%2344BF22','%23BFBA22','%23BF2222'];
  let shirtright =['%23dde3e9','%235C63AB','%23BF2266','%2344BF22','%23BFBA22','%23BF2222'];
  
  var url = domain;
  
  //common
  var _setname = Array.from(myRandomInts(1, name.length-1));
  var _name=name[_setname[0]];
  url += 'name='+_name;
  
  var _setFace = Array.from(myRandomInts(1, face.length-1));
  url += '&face='+ face[_setFace[0]];
  
  var _setmirror = Array.from(myRandomInts(1, mirror.length-1));
  url += '&mirror='+ mirror[_setmirror[0]];  
  
  if(_name==name[0]){
    //humaaans
    let head =['afro','airy','caesar','chongo','curly','hijab-1','hijab2','long','no-hair','pony','rad','short-1','short-2','short-beard','top','turban-1','turban2','wavy'];
    let side =['sitting','standing','sitting','standing'];
    
    let pantLeft =['%23C4B289','%235DADEC','%23282B32','%23C68D94','%23D6ABB2','%23A9ABBA','%23BDC0CF','%235C1C1D','%236F2728','%23E9E5E2','%23F1F0ED','%23324476','%23DFDBC8','%23EBE5D5','%23412845','%23897485','%23CBBBDE','%23FCE485','%23FDBE57','%231F2324','%23714B3D'];
    let shirtleft =['%23C4B289','%235DADEC','%23282B32','%23C68D94','%23D6ABB2','%23A9ABBA','%23BDC0CF','%235C1C1D','%236F2728','%23E9E5E2','%23F1F0ED','%23324476','%23DFDBC8','%23EBE5D5','%23412845','%23897485','%23CBBBDE','%23FCE485','%23FDBE57','%231F2324','%23714B3D'];
  
    var _setHead = Array.from(myRandomInts(1, head.length-1));
    url += '&head='+ head[_setHead[0]];
  
    var _setSide = Array.from(myRandomInts(1, side.length-1));
    var _side = side[_setSide[0]];
    url += '&side='+ _side;
    var bottom, _setbottom;
    if(_side==side[0]){
      bottom = ['baggy-pants','skinny-jeans-1','sweat-pants','wheelchair'];
    }else{
      bottom = ['baggy-pants','jogging','shorts','skinny-jeans-walk','skinny-jeans','skirt','sprint','sweatpants'];
    }
    _setbottom = Array.from(myRandomInts(1, bottom.length-1));
    var _bottom=bottom[_setbottom[0]];
    url += '&bottom='+ _bottom;

    var body, _setBody;
    body = ['hoodie','jacket-2','jacket','lab-coat','long-sleeve','pointing-forward','pointing-up','pregnant','trench-coat','turtle-neck'];
    _setBody = Array.from(myRandomInts(1, body.length-1));
    url += '&body='+ body[_setBody[0]];
  
    var _setHair = Array.from(myRandomInts(1, hair.length-1));
    url += '&hair='+ hair[_setHair[0]];
  
    var _setpantLeft = Array.from(myRandomInts(1, pantLeft.length-1));
    url += '&pant-left='+ pantLeft[_setpantLeft[0]];
  
    var _setshirtLeft = Array.from(myRandomInts(1, shirtleft.length-1));
    url += '&shirt-left='+ shirtleft[_setshirtLeft[0]];
  
    var _setpantRight = Array.from(myRandomInts(1, pantRight.length-1));
    url += '&pant-right='+ pantRight[_setpantRight[0]];
  
    var _setshirtRight = Array.from(myRandomInts(1, shirtright.length-1));
    url += '&shirt-right='+ shirtright[_setshirtRight[0]];
  }
  else{
    //aavatar
    let gender = ['female','male','unisex'];  
    
    let facestyle =['sketchy','strokes','thinlines'];
    let emotion = ['afraid','angry','annoyed','blush','confused','cry','cryingloudly','cunning','curious','disappointed','dozing','drunk','excited','happy','hearteyes','irritated','lookingdown','lookingleft','lookingright','lookingup','mask','neutral','nevermind','ooh','rofl','rollingeyes','sad','scared','shocked','shout','smile','smirk','starstruck','surprised','tired','tongueout','whistle','wink','worried'];
    let attire = ['bodycon','casualfullsleevetee','casualtee','formal','formalsuit','fullsleeveshirt','saree','stickfigure','tuckedinshirt','uniform'];
    
  
    var _setgender = Array.from(myRandomInts(1, gender.length-1));
    var _gender=gender[_setgender[0]];
    url += '&gender='+ _gender;
    var _setcharacter,character;
    if(_gender==gender[1]){
      character =['brettbeard','egyptiangoatee','englishmoustache','fullgoatee','oldman','oldmanwithglasses','paintersmoustache','smallgoatee','spikes'];      
    }else if(_gender==gender[2]){
      character =['bald','densedreads','mediumdreads','mediumhair','mediumhairwithglasses','topknotbun','turban'];
    }
    else{
      character =['bindi','blondecurly','blondeshort','densehair','densehairwithband','hairband','highbun','messyponytail','oldladywithglasses','shorthair','wavy'];      
    }
    _setcharacter = Array.from(myRandomInts(1, character.length-1));
    url += '&character='+ character[_setcharacter[0]];
  
    var _setfacestyle = Array.from(myRandomInts(1, facestyle.length-1));
    url += '&facestyle='+ facestyle[_setfacestyle[0]];
  
    var _setemotion = Array.from(myRandomInts(1, emotion.length-1));
    url += '&emotion='+ emotion[_setemotion[0]];
  
    var _setattire = Array.from(myRandomInts(1, attire.length-1));
    var _attire=attire[_setattire[0]];
    url += '&attire='+ _attire;
    var _setpose, pose;
    if(_attire==attire[0]){
      pose = ['handonhip','handsfolded','handsonhip','holdingbag','holdinglaptop','pointingleft','shy','sittingonbeanbag','super','walk','wonderwoman'];
    }else if(_attire==attire[1]){
      pose = ['angry','handsfolded','handsinpocket','handsonhip','holdingbook','holdingcoffee','holdinglaptop','holdingmobile','holdingumbrella','pointingright','pointingup','readingpaper','ridingbicycle','ridingbike','shrug','sittingatdesk','sittingatdeskhandsspread','sittingatdeskholdingmobile','sittingonbeanbagholdinglaptop','sittingonbeanbagholdingmobile','sittingonfloorexplaining','sittingonfloorholdinglaptop','sittingonfloorshrug','super','thinking','thumbsup','yuhoo'];
    }else if(_attire==attire[2]){
      pose = ['angry','handsfolded','handsheldback','handsinpocket','handsonhip','holdingbook','holdingcoffee','holdinglaptop','holdingmobile','holdingumbrella','pointing45degree','pointingright','pointingup','readingpaper','ridingbicycle','ridingbike','shrug','sittingatdesk','sittingatdeskhandsspread','sittingatdeskholdingmobile','sittingonbeanbagholdinglaptop','sittingonbeanbagholdingmobile','sittingonthefloorexplaining','sittingonthefloorholdinglaptop','sittingonthefloorshrug','super','thinking','thumbsup','yuhoo'];
    }else if(_attire==attire[3]){
      pose = ['explaining','explaining45degreesdown','explaining45degreesup','explainingwithbothhands','handsclasped','handstouchingchin','holdingboard','holdingbook','holdingstick','normal','pointingleft'];
    }else if(_attire==attire[4]){
      pose = ['handsfolded','handsheldback','handsinpocket','handsonhip','holdingbook','holdingcoffee','holdinglaptop','holdingmobile','holdingumbrella','pointing45degree','pointingright','pointingup','readingpaper','shrug','super','thinking','thumbsup','yuhoo'];
    }else if(_attire==attire[5]){
      pose = ['angry','handsfolded','handsinpocket','handsonhip','holdingbook','holdingcoffee','holdinglaptop','holdingmobile','holdingumbrella','pointingright','pointingup','readingpaper','ridingbicycle','ridingbike','run','shrug','sittingatdesk','sittingatdeskhandsspread','sittingatdeskholdingmobile','sittingonbeanbagexplaining','sittingonbeanbagholdinglaptop','sittingonfloorexplaining','sittingonfloorholdinglaptop','sittingonthefloorshrug','super','thinking','thumbsup','yuhoo'];
    }else if(_attire==attire[6]){
      pose = ['angry','explaining','handsfolded','handsonhip','hi','holdingcoffee','normal','pointingup','readingpaper','shrug','super','thumbsup'];
    }else if(_attire==attire[7]){
      pose = ['angry','handsfolded','handsheldback','handsonhip','holdingbook','holdinglaptop','pointingright','pointingup','readingpaper','super','thinking','thumbsup','yuhoo'];
    }else if(_attire==attire[8]){
      pose = ['dance','handsclasped','handsfolded','handsinpocket','handsonhead','handsonhip','holdingbag','leaning','superman'];
    }else if(_attire==attire[9]){
      pose = ['angry','handsfolded','handsheldback','handsonhip','holdingbook','holdingcoffee','holdinglaptop','holdingmobile','holdingumbrella','pointingleft','pointingright','pointingup','readingpaper','ridingbicycle','ridingbike','shrug','sittingatdesk','sittingonbeanbagholdinglaptop','sittingonbeanbagholdingmobile','sittingonfloorexplaining','sittingonfloorholdinglaptop','sittingonfloorshrug','super','thinking','thumbsup','yuhoo'];
    }
    else{
      pose = ['angry','handsfolded','handsinpocket','handsonhip','holdingbook','holdingcoffee','holdinglaptop','holdingmobile','holdingumbrella','pointingright','pointingup','readingpaper','ridingbicycle','ridingbike','shrug','sittingatdesk','sittingatdeskhandsspread','sittingatdeskholdingmobile','sittingonbeanbagholdinglaptop','sittingonbeanbagholdingmobile','sittingonfloorexplaining','sittingonfloorholdinglaptop','sittingonfloorshrug','super','thinking','thumbsup','yuhoo'];
    }  
    var _setpose = Array.from(myRandomInts(1, pose.length-1));
    url += '&pose='+ pose[_setpose[0]];

    var _setpant = Array.from(myRandomInts(1, pantRight.length-1));
    url += '&pant='+ pantRight[_setpant[0]];
  
    var _setshirt = Array.from(myRandomInts(1, shirtright.length-1));
    url += '&shirt='+ shirtright[_setshirt[0]];
  }
  //common but in end
  url+='&ext=png';
  return url;
}

const getURLParameters = function(url) {
  var result = {};
  var searchIndex = url.indexOf("?");
  
  if (searchIndex == -1 ) return result;
      var sPageURL = url.substring(searchIndex +1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {       
          var sParameterName = sURLVariables[i].split('=');      
          result[sParameterName[0]] = sParameterName[1];
      }
      return result;
};

function enRichData(data, characterProperties){
//{ trait_type: "IQuote", value: quote }
var characterDescription='This character is of {0} type with body-color {1}. This identity wants to refer self as {2}. Here {2} {3}. {2} is wearing {4} while in the pose of {5}.';
for(var key in characterProperties){
  if(characterProperties.hasOwnProperty(key)){
    var characterType_;
    if(key=='name'){
      if(characterProperties[key]=='aavatar'){
        characterType_='Avtaar';        
      }else if(characterProperties[key]=='fxemoji'){
        characterType_='Surprise';
        characterDescription='The characters & objects are yet to be reveal, hence it is {0}. Here as of now it is representing {1}';
      }else{
        characterType_='Mannequin';
        characterDescription='This character is of {0} type with body-color {1} & hair-color {1.1}. This identity wants to refer self as {2}. Here {2} {3}. {2} is wearing {4} while in the pose of {5}.';
      }      
      characterDescription=characterDescription.replace('{0}', characterType_);
      data.attributes.push({trait_type:'CharacterType',value:characterType_});
    }else if(key=='icon'){
      var icon_;
      if(characterProperties[key]=='girlgirl'){
        icon_='lesbian couple';
      }else if(characterProperties[key]=='guyguy'){
        icon_='gay couple';
      }else if(characterProperties[key]=='heartpurple'){
        icon_='purple heart';
      }
      characterDescription=characterDescription.replace('{1}', icon_);
      data.attributes.push({trait_type:'Reflects',value:icon_});
    }else if(key=='face'){      
      data.attributes.push({trait_type:'FaceColor',value:characterProperties[key].replace('%23','#')});
      var color_=cherangi(characterProperties[key]);
      characterDescription=characterDescription.replace('{1}', color_.name);
    }else if(key=='hair'){
      data.attributes.push({trait_type:'HairColor',value:characterProperties[key].replace('%23','#')});
      var color_=cherangi(characterProperties[key]);
      characterDescription=characterDescription.replace('{1.1}', color_.name);
    }else if(key=='mirror'){
      if(characterProperties[key]==''){
      data.attributes.push({trait_type:'IsMirrored',value:false});
      }else{
        data.attributes.push({trait_type:'IsMirrored',value:true});
      }
    }else if(key=='gender'){
      var pronoune_;
      if(characterProperties[key]=='female'){
        pronoune_='xe';
      }else if(characterProperties[key]=='male'){
        pronoune_='ze';
      }else{
        pronoune_='they';
      }
      characterDescription=characterDescription.replaceAll('{2}', pronoune_);
      data.attributes.push({trait_type:'Pronouns',value:pronoune_});
    }else if(key=='emotion'){
      var emotion_;
      if(characterProperties[key]=='blush'){
        emotion_ ="is blushing";
      }else if(characterProperties[key]=='cry'){
        emotion_ ="is crying";
      }else if(characterProperties[key]=='cryingloudly'){
        emotion_ ="is crying loudly";
      }else if(characterProperties[key]=='cunning'){
        emotion_ ="is to be cunning";
      }else if(characterProperties[key]=='hearteyes'){
        emotion_ ="is being loved";
      }else if(characterProperties[key]=='lookingdown'){
        emotion_ ="is looking down";
      }else if(characterProperties[key]=='lookingleft'){
        emotion_ ="is looking left";
      }else if(characterProperties[key]=='lookingright'){
        emotion_ ="is looking right";
      }else if(characterProperties[key]=='lookingup'){
        emotion_ ="is looking up";
      }else if(characterProperties[key]=='mask'){
        emotion_ ="is superhero";
      }else if(characterProperties[key]=='ooh'){
        emotion_ ="is surprised";
      }else if(characterProperties[key]=='rofl'){
        emotion_ ="is laughing";
      }else if(characterProperties[key]=='rollingeyes'){
        emotion_ ="is wondering or ignoring";
      }else if(characterProperties[key]=='shout'){
        emotion_ ="is shouting";
      }else if(characterProperties[key]=='smile'){
        emotion_ ="is smiling";
      }else if(characterProperties[key]=='smirk'){
        emotion_ ="is smirking";
      }else if(characterProperties[key]=='tongueout'){
        emotion_ ="is teasing or requesting to excuse";
      }else if(characterProperties[key]=='whistle'){
        emotion_ ="is whistling";
      }else if(characterProperties[key]=='wink'){
        emotion_ ="is winking";
      }else{
        emotion_ = "is " + characterProperties[key];
      }
      characterDescription=characterDescription.replace('{3}', emotion_);
      data.attributes.push({trait_type:'Emotion',value:emotion_});
    }else if(key=='attire'){      
      var attire_;
      if(characterProperties[key]=='bodycon'){
        attire_ ="gown";
      }else if(characterProperties[key]=='casualtee'){
        attire_ ="casual tee";
      }else if(characterProperties[key]=='formalsuit'){
        attire_ ="formal suit";
      }else if(characterProperties[key]=='fullsleeveshirt'){
        attire_ ="full sleeves shirt";
      }else if(characterProperties[key]=='stickfigure'){
        attire_ ="stick figure";
      }else if(characterProperties[key]=='tuckedinshirt'){
        attire_ ="tucked in shirt";
      }else{
        attire_ = characterProperties[key];
      }
      characterDescription=characterDescription.replace('{4}', attire_);
      data.attributes.push({trait_type:'Attire',value:attire_});
    }
    else if(key=='pose'){
      var pose_;
      if(characterProperties[key]=='dance'){
        pose_ ="dancing";
      }else if(characterProperties[key]=='explaining45degreesdown'){
        pose_ ="explaining while bedning forward";
      }else if(characterProperties[key]=='explaining45degreesup'){
        pose_ ="explaining";
      }else if(characterProperties[key]=='explainingwithbothhands'){
        pose_ ="explaining with both hands";
      }else if(characterProperties[key]=='handonhip'){
        pose_ ="hand on hip";
      }else if(characterProperties[key]=='handsclasped'){
        pose_ ="hands clasped together";
      }else if(characterProperties[key]=='handsfolded'){
        pose_ ="hands folded";
      }else if(characterProperties[key]=='handsheldback'){
        pose_ ="hands held back";
      }else if(characterProperties[key]=='handsinpocket'){
        pose_ ="hands in pocket";
      }else if(characterProperties[key]=='handsonhead'){
        pose_ ="hands on head";
      }else if(characterProperties[key]=='handsonhip'){
        pose_ ="hands on hip";
      }else if(characterProperties[key]=='handstouchingchin'){
        pose_ ="hands touching chin";
      }else if(characterProperties[key]=='hi'){
        pose_ ="saying hi";
      }else if(characterProperties[key]=='holdingbag'){
        pose_ ="holding bag";
      }else if(characterProperties[key]=='holdingboard'){
        pose_ ="holding board";
      }else if(characterProperties[key]=='holdingbook'){
        pose_ ="holding book";
      }else if(characterProperties[key]=='holdingcoffee'){
        pose_ ="holding coffee";
      }else if(characterProperties[key]=='holdinglaptop'){
        pose_ ="holding laptop";
      }else if(characterProperties[key]=='holdingmobile'){
        pose_ ="holding mobile phone";
      }else if(characterProperties[key]=='holdingstick'){
        pose_ ="holding stick";
      }else if(characterProperties[key]=='holdingumbrella'){
        pose_ ="holding umbrella";
      }else if(characterProperties[key]=='pointing45degree' || characterProperties[key]=='pointing45dgree'){
        pose_ ="pointing somebody";
      }else if(characterProperties[key]=='pointingleft'){
        pose_ ="pointing at left";
      }else if(characterProperties[key]=='pointingright'){
        pose_ ="pointing at right";
      }else if(characterProperties[key]=='pointingup'){
        pose_ ="pointing up";
      }else if(characterProperties[key]=='readingpaper'){
        pose_ ="reading paper";
      }else if(characterProperties[key]=='ridingbicycle'){
        pose_ ="riding bicycle";
      }else if(characterProperties[key]=='ridingbike'){
        pose_ ="riding bike";
      }else if(characterProperties[key]=='run'){
        pose_ ="running";
      }else if(characterProperties[key]=='shrug'){
        pose_ ="shrugging";
      }else if(characterProperties[key]=='shy'){
        pose_ ="shying";
      }else if(characterProperties[key]=='sittingatdesk'){
        pose_ ="sitting at desk";
      }else if(characterProperties[key]=='sittingatdeskhandsspread'){
        pose_ ="sitting at desk and hands spread";
      }else if(characterProperties[key]=='sittingatdeskholdingmobile'){
        pose_ ="sitting at desk and holdin gmobile";
      }else if(characterProperties[key]=='sittingonbeanbag'){
        pose_ ="sitting on beanbag";
      }else if(characterProperties[key]=='sittingonbeanbagexplaining'){
        pose_ ="sitting on bean bag explaining";
      }else if(characterProperties[key]=='sittingonbeanbagholdinglaptop'){
        pose_ ="sitting on bean bag holding laptop";
      }else if(characterProperties[key]=='sittingonbeanbagholdingmobile'){
        pose_ ="sitting on bean bag holding mobile";
      }else if(characterProperties[key]=='sittingonfloorexplaining'){
        pose_ ="sitting on floor and explaining";
      }else if(characterProperties[key]=='sittingonfloorholdinglaptop'){
        pose_ ="sitting on floor and holding laptop";
      }else if(characterProperties[key]=='sittingonfloorshrug'){
        pose_ ="sitting on floor & shrugging";
      }else if(characterProperties[key]=='sittingonthefloorexplaining'){
        pose_ ="sitting on the floor and explaining";
      }else if(characterProperties[key]=='sittingonthefloorholdinglaptop'){
        pose_ ="shying while sitting on the floor and holding laptop";
      }else if(characterProperties[key]=='sittingonthefloorshrug'){
        pose_ ="sitting on the floor and shrugging";
      }else if(characterProperties[key]=='thumbsup'){
        pose_ ="thumbs up";
      }else if(characterProperties[key]=='walk'){
        pose_ ="walking";
      }else if(characterProperties[key]=='wonderwoman'){
        pose_ ="wonder women";
      }else if(characterProperties[key]=='yuhoo'){
        pose_ ="excited";
      }else{
        pose_ = characterProperties[key];
      }
      characterDescription=characterDescription.replace('{5}', pose_);
      data.attributes.push({trait_type:'Pose',value:pose_});
    }
  }
}
data.description += characterDescription;
return data;
}

function drawNFT(){
  canvas = createCanvas(snapWidth, snapHeight);
  context = canvas.getContext('2d');
  //Create base background Pride Flag
  var _coordinates= snapPrideFlag();
  var _setPattern = Array.from(myRandomInts(1, 2));
  var patternCount = _setPattern[0];
  if(patternCount==1){
    //draw rectangles over Pride Flag
    fillFlagwithRectangles(_coordinates);
  }else if(patternCount==2){
    //draw circles over Pride Flag
    var _setCircles = Array.from(myRandomInts(200, 400));
    circlesCount = _setCircles[0];
    fillFlagwithCircles(_coordinates);
  }
}
//Global MetaData JSON
var _collectionMetadata = "[";
// How many images are needed, pass as command line argument.
var quantity = process.argv.slice(2);
quantity=quantity[0];
const startTime = Date.now();
console.log("Starting Program");
var i = 0
var p = Promise.resolve(i)
while (i < quantity) {
  (i => {
    p = p.then(() => {
      return new Promise(function (resolve, reject) {
        //Write before timeout which you want to execute before
        setTimeout(function () {
          var json="";
          getQuote().then(function(quote){
            json = createInitilDataforNFT(i,quote);
            return json;
          }).then(function(data){
            //start drawing NFT
            drawNFT();
          //create API URL
          var url = createURL();
          //var url = "http://localhost:3000/comic?name=fxemoji&category=people&icon=heartpurple&box=&boxcolor=%23000000&boxgap=&mirror=";
          //get chracters properties from URL
          var characterProps= getURLParameters(url);
          //enrich our existing data by adding attributes
          data=enRichData(data,characterProps);
          getImage(url).then(function(img){
            // do something with image
            context.drawImage(img,20,20,img.width,img.height);
            const buffer = canvas.toBuffer('image/png');
            console.log("Creating Identity #",data.edition,"dna:",data.dna);        
            fs.writeFileSync(data.attributes[2].value, buffer);      
            console.log('✅ Done!');
            collateMetaforCollection(data);
            resolve();       
          });       
        }).catch(function (error) {      
          console.log("Error", error);reject(this);
        });          
        }, 1500)
      })
    })
  })(i)
  i++
}
p = p.then(()=>{
  console.log("printing collection metadata");
  try
    {
      var collectionMetadatafilename = "./data/_metadata.json";
      if(_collectionMetadata.length>0){
        //Removing last comma
        _collectionMetadata=_collectionMetadata.slice(0, -1);
        _collectionMetadata += "]"
        fs.writeFileSync(collectionMetadatafilename, _collectionMetadata);
      }
    }catch(err)
    {
      console.log("Error writing collection Metadata:",err);
    }
    console.log(`Total: ${(Date.now() - startTime) / 1000} seconds.`);
    console.log("Code Finishes..");
    console.log('execution ends');
});


