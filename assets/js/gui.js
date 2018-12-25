// automatic starting function after the document loaded
(() => {
  // further game initializiation here
})();
const Color = {
  darkGrey: '#303030',
  lightGreen: '#68b249',
  darkerGreen: '#4d8436',
  brown: '#4c4128',
  brown2: '#7a6840',
  black: '#000000',
  red: '#ff0000'
};

const CardType = {
  HEARTS: 1,
  TILES: 2,
  CLOVERS: 3,
  PIKES: 4
};

const CardValue = {
  ACE: 14,
  KING: 13,
  QUEEN: 12,
  BOY: 11,
  TEN: 10,
  NINE: 9,
  EIGHT: 8,
  SEVEN: 7,
  SIX: 6,
  FIVE: 5,
  FOUR: 4,
  THREE: 3,
  TWO: 2
};

const CardText = {
  13: "K",
  12: "Q",
  11: "B"
};

// RENDERING STUFF HERE
class PokerGameGui {
  // maybe as player json?
  constructor(players) {
    this.props = {
      canvas: {
        width: undefined, //IF NOT SET IT WILL BE THE WHOLE WINDOW
        height: undefined,
        id: 'canvas'
      },
    };

    this.players = players;
    this.setupCanvas();
    this.table = new Table(this.ctx);
    window.addEventListener("resize", () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.reset();
    });
    //this.start();
  }

  clear() {
    this.ctx.fillStyle = Color.darkGrey;
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
  }

  reset() {
    this.clear();
    this.table.draw();
    let card1 = new Card(this.canvas.width*.5, this.canvas.height*.5,this.canvas.height * .0013 * 50,45,CardType.PIKES,CardValue.TEN,true,this.ctx);
    let card2 = new Card(this.canvas.width*.5 -200, this.canvas.height*.5,this.canvas.height * .0013 * 50,-45,CardType.HEARTS,CardValue.FIVE,true,this.ctx);
    let chip1 = new Chip(500,400,10,13,10,'#ce5f5f',this.ctx);
    card1.draw();
    card2.draw();
    chip1.draw();

    this.raf = requestAnimationFrame(() => this.reset());

  }

  renderIngame() {

  }

  start() {
    this.raf = requestAnimationFrame(() => this.start());
    this.renderIngame();
  }

  stop() {
    cancelAnimationFrame(this.raf);
    this.raf = undefined;
  }

  setupCanvas() {
    let props = this.props;
    this.canvas = document.createElement("canvas");

    this.canvas.id = props.canvas.id;
    this.canvas.width = props.canvas.width ? props.canvas.width : window.innerWidth;
    this.canvas.height = props.canvas.height ? props.canvas.height : window.innerHeight;

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
  }



}

class Card {
  constructor(x, y, width,rotation, type, value, face, ctx) {
    // RENDER SPECIFIC
    this.x = x;
    this.y = y;
    this.width = width;
    this.rotation = rotation;
    this.ctx = ctx;
    this.face = face;
    // CARD SPECIFIC
    this.type = type;
    this.value = value;
  }

  draw() {
    if(this.face) {
      this.drawFace();
    } else {
      // this.drawBack();
      this.drawBack();
    }
  }

  /* Older implementation of Card backside
  drawBack_old() {
    let ctx = this.ctx,
    //scale = ctx.canvas.height * .0013 * 50,
    w = this.width,
    h = 1.3*w,
    r = .06*w,
    x = this.x,
    y = this.y;

    // CARD SHAPE

    // GLOBAL CARD ROTATION
    ctx.translate(x, y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.translate(-x, -y);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc((x-.5*w)+r,y-.5*h,r,Math.PI,Math.PI*1.5);
    ctx.arc((x+.5*w)-r,(y-.5*h),r,Math.PI*1.5,0);
    ctx.arc((x+.5*w)-r,(y+.5*h),r,0,Math.PI*.5);
    ctx.arc((x-.5*w)+r,(y+.5*h),r,Math.PI*.5,Math.PI);
    ctx.closePath();
    ctx.fill();

    // INNER CARD LINE
    w = this.width * .85;
    h = 1.35*w;
    r = .05*w;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = w*.02;

    ctx.beginPath();
    ctx.arc((x-.5*w)+r,y-.5*h,r,Math.PI,Math.PI*1.5);
    ctx.arc((x+.5*w)-r,(y-.5*h),r,Math.PI*1.5,0);
    ctx.arc((x+.5*w)-r,(y+.5*h),r,0,Math.PI*.5);
    ctx.arc((x-.5*w)+r,(y+.5*h),r,Math.PI*.5,Math.PI);
    ctx.closePath();
    ctx.stroke();

    // CARD PATTERN CLIP
    ctx.save();
    ctx.beginPath();
    ctx.rect(x-w*.45,y-h*.5,w*.9,h);
    // ctx.lineWidth = 1;
    // ctx.stroke();
    ctx.clip();

    // PATTERN
    ctx.fillStyle = "#ff0000";

    let rotation = 30;
    ctx.translate(x, y);
    ctx.rotate(-rotation * Math.PI / 180);
    ctx.translate(-x, -y);
    for(let i = 0; i++<30;) {
      ctx.fillRect(x-w*.8+(w*.07*i),y-h*.6,w*.02,h*1.4);
    }
    ctx.translate(x, y)
    ctx.rotate(rotation * 2 * Math.PI / 180);
    ctx.translate(-x, -y)
    for(let i = 0; i++<30;) {
      ctx.fillRect(x-w*.8+(w*.07*i),y-h*.6,w*.02,h*1.4);
    }
    ctx.restore();

    //GLOBAL CARD ROTATION RESET
    ctx.translate(x, y)
    ctx.rotate(-this.rotation * Math.PI / 180);
    ctx.translate(-x, -y)
  }
  */

  drawBack() {
    let ctx = this.ctx,
    scale = ctx.canvas.height * .0013,
    w = this.width,
    h = 1.3*w,
    r = .06*w,
    x = this.x,
    y = this.y;

    // CARD SHAPE

    // GLOBAL CARD ROTATION
    ctx.translate(x, y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.translate(-x, -y);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc((x-.5*w)+r,y-.5*h,r,Math.PI,Math.PI*1.5);
    ctx.arc((x+.5*w)-r,(y-.5*h),r,Math.PI*1.5,0);
    ctx.arc((x+.5*w)-r,(y+.5*h),r,0,Math.PI*.5);
    ctx.arc((x-.5*w)+r,(y+.5*h),r,Math.PI*.5,Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.clip();

    // PATTERN
    ctx.save();
    ctx.fillStyle = "#ff0000";
    let rotation = 30;
    ctx.translate(x, y);
    ctx.rotate(-rotation * Math.PI / 180);
    ctx.translate(-x, -y);
    for(let i = 0; i++<30;) {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(x-w*.8+(w*.07*i),y-h*.8,w*.02,h*1.6);
    }
    ctx.translate(x, y)
    ctx.rotate(rotation * 2 * Math.PI / 180);
    ctx.translate(-x, -y)
    for(let i = 0; i++<30;) {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(x-w*.8+(w*.07*i),y-h*.8,w*.02,h*1.6);
    }
    ctx.restore();

    //GLOBAL CARD ROTATION RESET
    ctx.translate(x, y)
    ctx.rotate(-this.rotation * Math.PI / 180);
    ctx.translate(-x, -y)


  }

  drawFace() {
    let ctx = this.ctx,
    //scale = ctx.canvas.height * .0013,
    w = this.width,
    h = 1.3*w,
    r = .06*w,
    x = this.x,
    y = this.y,
    scale = w*.2;

    // CARD SHAPE
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.translate(-x, -y);

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc((x-.5*w)+r,y-.5*h,r,Math.PI,Math.PI*1.5);
    ctx.arc((x+.5*w)-r,(y-.5*h),r,Math.PI*1.5,0);
    ctx.arc((x+.5*w)-r,(y+.5*h),r,0,Math.PI*.5);
    ctx.arc((x-.5*w)+r,(y+.5*h),r,Math.PI*.5,Math.PI);
    ctx.closePath();
    ctx.fill();

    //draw pattern here

    switch(this.value) {
      case 14:
        CardSymbol.draw({x: x, y: y},scale*2,0,this.type,ctx);
        break;
      case 13: if (this.value === 13) CardLetter.draw({x: x, y: y+h*.15},scale*3.5,this.type,13,ctx);
      case 12: if (this.value === 12) CardLetter.draw({x: x, y: y+h*.15},scale*3.5,this.type,12,ctx);
      case 11: if (this.value === 11) CardLetter.draw({x: x, y: y+h*.15},scale*3.5,this.type,11,ctx);
        CardSymbol.draw({x: x-w*.35, y: y-h*.4},scale*.6,0,this.type,ctx);
        CardSymbol.draw({x: x+w*.35, y: y+h*.4},scale*.6,0,this.type,ctx);
        break;
      case 3: CardSymbol.draw({x: x, y: y},scale,0,this.type,ctx);
      case 2:
        CardSymbol.draw({x: x, y: y-h*.3},scale,0,this.type,ctx);
        CardSymbol.draw({x: x, y: y+h*.3},scale,180,this.type,ctx);
        break;
      case 8: CardSymbol.draw({x: x, y: y+h*.15},scale,180,this.type,ctx);
      case 7: CardSymbol.draw({x: x, y: y-h*.15},scale,0,this.type,ctx);
      case 6:
        CardSymbol.draw({x: x-w*.25, y: y},scale,0,this.type,ctx);
        CardSymbol.draw({x: x+w*.25, y: y},scale,0,this.type,ctx);
      case 5:
        if(this.value === 5) CardSymbol.draw({x: x, y: y},scale,0,this.type,ctx);
      case 4:
        CardSymbol.draw({x: x-w*.25, y: y-h*.3},scale,0,this.type,ctx);
        CardSymbol.draw({x: x+w*.25, y: y-h*.3},scale,0,this.type,ctx);
        CardSymbol.draw({x: x-w*.25, y: y+h*.3},scale,180,this.type,ctx);
        CardSymbol.draw({x: x+w*.25, y: y+h*.3},scale,180,this.type,ctx);
        break;
      case 10:
        CardSymbol.draw({x: x, y: y-h*.2},scale,0,this.type,ctx);
        CardSymbol.draw({x: x, y: y+h*.2},scale,180,this.type,ctx);
      case 9:
        CardSymbol.draw({x: x-w*.25, y: y-h*.3},scale,0,this.type,ctx);
        CardSymbol.draw({x: x+w*.25, y: y-h*.3},scale,0,this.type,ctx);
        CardSymbol.draw({x: x-w*.25, y: y+h*.3},scale,180,this.type,ctx);
        CardSymbol.draw({x: x+w*.25, y: y+h*.3},scale,180,this.type,ctx);
        CardSymbol.draw({x: x-w*.25, y: y-h*.1},scale,0,this.type,ctx);
        CardSymbol.draw({x: x+w*.25, y: y-h*.1},scale,0,this.type,ctx);
        CardSymbol.draw({x: x-w*.25, y: y+h*.1},scale,180,this.type,ctx);
        CardSymbol.draw({x: x+w*.25, y: y+h*.1},scale,180,this.type,ctx);
        if(this.value === 9) CardSymbol.draw({x: x, y: y},scale,0,this.type,ctx);
        break;
    }

    ctx.translate(x, y);
    ctx.rotate(-this.rotation * Math.PI / 180);
    ctx.translate(-x, -y);

    ctx.restore();
  }
}

class Table {

  constructor(ctx) {
    this.ctx = ctx;
  }

  draw() {
    this.table();
    this.tableBorder();
  }

  table() {
    let ctx = this.ctx,
    cW = ctx.canvas.width,
    cH = ctx.canvas.height,
    h = Math.floor(.6*cH),
    w = h,
    x = cW*.5,
    y = cH*.5;

    ctx.save();
    let grd = ctx.createRadialGradient(x, y, 1, x, y, w);
    grd.addColorStop(0, Color.lightGreen);
    grd.addColorStop(1, Color.darkerGreen);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(cW*.5-.5*w,cH*.5-.5*h);
    ctx.lineTo(cW*.5+.5*w,cH*.5-.5*h);
    ctx.arc(cW*.5+.5*w,cH*.5,h*.5,Math.PI*1.5,Math.PI*.5);
    ctx.lineTo(cW*.5-.5*w,cH*.5+.5*h);
    ctx.arc(cW*.5-.5*w,cH*.5,h*.5,Math.PI*.5,Math.PI*1.5);
    ctx.closePath();
    ctx.transform(1,0,0,0.7,0,h*.25);
    ctx.fill();
    ctx.restore();
  }

  tableBorder() {
    let ctx = this.ctx,
    cW = ctx.canvas.width,
    cH = ctx.canvas.height,
    h = Math.floor(.6*cH),
    w = h;
    ctx.strokeStyle = Color.brown;
    ctx.lineWidth = h*.1;
    ctx.beginPath();
    ctx.moveTo(cW*.5-.5*w,cH*.5-.5*h);
    ctx.lineTo(cW*.5+.5*w,cH*.5-.5*h);
    ctx.arc(cW*.5+.5*w,cH*.5,h*.5,Math.PI*1.5,Math.PI*.5);
    ctx.lineTo(cW*.5-.5*w,cH*.5+.5*h);
    ctx.arc(cW*.5-.5*w,cH*.5,h*.5,Math.PI*.5,Math.PI*1.5);
    ctx.stroke();
    ctx.strokeStyle = Color.brown2;
    ctx.lineWidth = h*.02;
    ctx.beginPath();
    ctx.moveTo(cW*.5-.5*w,cH*.5-.5*h);
    ctx.lineTo(cW*.5+.5*w,cH*.5-.5*h);
    ctx.arc(cW*.5+.5*w,cH*.5,h*.5,Math.PI*1.5,Math.PI*.5);
    ctx.lineTo(cW*.5-.5*w,cH*.5+.5*h);
    ctx.arc(cW*.5-.5*w,cH*.5,h*.5,Math.PI*.5,Math.PI*1.5);
    ctx.stroke();
  }
}

class Chip {
  constructor(x,y,radius, rotation,value,color,ctx) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotation = rotation;
    this.value = value;
    this.color = color;
    this.ctx = ctx;
  }

  draw() {
    let ctx = this.ctx,
    x = this.x,
    y = this.y,
    radius = this.radius,
    rot = this.rotation; //to be controlled via scale (maybe put scale up in the table class)

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();

    ctx.clip();

    ctx.fillStyle = "#fff";
    for(let i = 0; i < 3; i++) {
      ctx.translate(x,y);
      if(i === 0) {
        ctx.rotate(rot * Math.PI / 180);
      } else {
        ctx.rotate(60 * Math.PI / 180);
      }
      ctx.translate(-x,-y);
      ctx.fillRect(x-radius*1.1,y-radius*.1,radius*2.2,radius*.2);
    }

    ctx.restore();
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = radius*.1;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(x,y,radius*.8,0,Math.PI*2);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x,y,radius*.6,0,Math.PI*2);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }
}

class CardLetter {
  static draw(pos,scale,type,value,ctx) {
    let color = type === 1 || type === 2 ? Color.red : Color.black,
    text = CardText[value],
    x = pos.x,
    y = pos.y;

    ctx.save();
    ctx.fillStyle = color;
    ctx.font = scale + 'px sans-serif';
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
    ctx.restore();

  }
}

class CardSymbol {

  static draw(pos,scale,rotation,type,ctx) {
    switch(type) {
      case 1: this.drawHearts(pos,scale,rotation,type,ctx); break;
      case 2: this.drawTiles(pos,scale,rotation,type,ctx); break;
      case 3: this.drawClovers(pos,scale,rotation,type,ctx); break;
      case 4: this.drawPikes(pos,scale,rotation,type,ctx); break;
    }
  }

  static drawHearts(pos,scale,rotation,type,ctx) {
    let x = pos.x,
    y = pos.y;

    // ctx.strokeStyle = '#fff';
    // ctx.strokeRect(x-scale*.5,y-scale*.5,scale,scale);
    ctx.save();
    ctx.fillStyle = Color.red;
    ctx.translate(x, y)
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-x, -y)
    ctx.beginPath();
    ctx.arc(x-scale*.25,y-scale*.25,scale*.25,Math.PI,Math.PI*2);
    ctx.arc(x+scale*.25,y-scale*.25,scale*.25,Math.PI,Math.PI*2);
    ctx.moveTo(x-scale*.5,y-scale*.25);
    ctx.quadraticCurveTo(x-scale*.5,y+scale*.05,x,y+scale*.5);
    ctx.quadraticCurveTo(x+scale*.5,y+scale*.05,x+scale*.5,y-scale*.25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  static drawTiles(pos,scale,rotation,type,ctx) {
    let x = pos.x,
    y = pos.y;

    // ctx.strokeStyle = '#fff';
    // ctx.strokeRect(x-scale*.5,y-scale*.5,scale,scale);

    ctx.save();
    ctx.fillStyle = Color.red;
    ctx.translate(x, y)
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-x, -y)
    ctx.beginPath();
    ctx.moveTo(x,y-scale*.5);
    ctx.lineTo(x+scale*.4,y);
    ctx.lineTo(x,y+scale*.5);
    ctx.lineTo(x-scale*.4,y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  }

  static drawClovers(pos,scale,rotation,type,ctx) {
    let x = pos.x,
    y = pos.y;

    // ctx.strokeStyle = '#fff';
    // ctx.strokeRect(x-scale*.5,y-scale*.5,scale,scale);

    ctx.save();
    ctx.fillStyle = Color.black;
    ctx.translate(x, y)
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-x, -y)
    ctx.beginPath();
    ctx.arc(x-scale*.25,y+scale*.1,scale*.23,0,Math.PI*2);
    ctx.arc(x,y-scale*.25,scale*.25,Math.PI*.5,Math.PI*2.5);
    ctx.arc(x+scale*.25,y+scale*.1,scale*.23,Math.PI,Math.PI*3);
    ctx.arc(x,y,scale*.1,0,Math.PI*2);
    ctx.moveTo(x,y-scale*.2)
    ctx.lineTo(x+scale*.1,y+scale*.5);
    ctx.lineTo(x-scale*.1,y+scale*.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  static drawPikes(pos,scale,rotation,type,ctx) {
    let x = pos.x,
    y = pos.y,
    y1 = y+scale*.1;

    // ctx.strokeStyle = '#fff';
    // ctx.strokeRect(x-scale*.5,y-scale*.5,scale,scale);

    ctx.save();
    ctx.fillStyle = Color.black;
    ctx.translate(x, y)
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-x, -y)
    ctx.beginPath();
    ctx.arc(x-scale*.25,y1,scale*.25,0,Math.PI);
    ctx.arc(x+scale*.25,y1,scale*.25,0,Math.PI);
    ctx.moveTo(x-scale*.5,y1);
    ctx.quadraticCurveTo(x-scale*.5,y-scale*.1,x,y-scale*.5);
    ctx.quadraticCurveTo(x+scale*.5,y-scale*.1,x+scale*.5,y1);
    ctx.moveTo(x+scale*.1,y+scale*.5);
    ctx.lineTo(x-scale*.1,y+scale*.5);
    ctx.lineTo(x,y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

let f = new PokerGameGui();
f.reset();
