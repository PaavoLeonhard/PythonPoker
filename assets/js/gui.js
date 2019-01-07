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

const EasingFunction = {
  easeIn: t => {return t*t*t},
  easeOut: t => {return (--t)*t*t+1},
  easeInOut: t => {return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1},
  linear: t => {return t}
}

// RENDERING STUFF HERE

class MovingObject {
  constructor(x,y,rotation) {
    // OBJECTS REAL PROPERTIES
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    // ANIMATION PROPERTIES
    this.eF = EasingFunction.linear;
    this.startTime = 0;
    this.lastTime = 0;
    this.animTime = 0;
    this.animLen = 0;
    this.direction = {x:0,y:0};
    this.startPos = {x:0,y:0};
    this.endPos = {x:x,y:y};
    this.startRotation = 0;
    this.rotationLen = 0;
    this.delay = 0;
    this.init = false;
    this.running = false;
  }
  //time in milliseconds
  moveTo(pos,rotation,easing,time,delay) {
    this.startTime = 0;
    this.init = true;
    this.animTime = time;
    this.startPos.x = this.x;
    this.startPos.y = this.y;
    this.endPos.x = pos.x;
    this.endPos.y = pos.y;
    let dx = this.direction.x,
    dy = this.direction.y;
    dx = pos.x-this.x;
    dy = pos.y-this.y;
    this.animLen = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
    this.direction.x = 1 / this.animLen * dx;
    this.direction.y = 1 / this.animLen * dy;

    this.startRotation = this.rotation;
    this.rotationLen = rotation;

    this.delay = delay;

    switch(easing) {
      case 'ease-in': this.eF = EasingFunction.easeIn;break;
      case 'ease-out': this.eF = EasingFunction.easeOut;break;
      case 'ease-in-out': this.eF = EasingFunction.easeInOut;break;
      default: this.eF = EasingFunction.linear;
    }
  }

  update() {
    if(this.delay > 0) {
      let delta, now;
      if(this.lastTime === 0) {
        delta = 10;
      } else {
        now = Date.now();
        delta = now - this.lastTime;
        this.lastTime = now;
      }
      this.delay -= delta;
      if(this.delay < 0) this.delay = 0;
    }
    if(this.init && this.delay === 0) {
      this.startTime = Date.now();
      this.init = !this.init;
      this.running = true;
    }
    if(this.running) {
      let now = Date.now();
      let tia = now - this.startTime;
      let t = tia / this.animTime;
      t = t > 1 ? 1 : t;
      let fac = this.eF(t);

      this.x = this.startPos.x + this.direction.x * fac * this.animLen;
      this.y = this.startPos.y + this.direction.y * fac * this.animLen;
      this.rotation = this.startRotation + fac * this.rotationLen;

      if(this.endPos.x === this.x && this.endPos.y === this.y) {
        this.running = !this.running;
      }
    }
  }
}

class PokerGameGui {
  // maybe as player json?
  constructor(players,props) {

    this.props = {
      canvas: {
        id: props ? props.canvas.id : 'poker-canvas' ,
        width: props ? props.canvas.width : undefined ,
        height: props ? props.canvas.height : undefined
      }
    }

    this.players = players;
    this.cards = [];
    this.chips = [];
    this.setupCanvas();
    this.scale = this.canvas.height * .0017 * 50;
    this.table = new Table(this.ctx);
    window.addEventListener("resize", () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.scale = this.canvas.height * .0017 * 50;
        this.start();
    });
    //this.start();
  }

  addCard(type,value) {
    let card = new Card(this.canvas.width*.5, this.canvas.height*.5,0,type,value,this.ctx);
    card.moveTo({x:300,y:300},180,'ease-out',1000,2000);
    card.flip();
    this.cards.push(card);
  }

  addChip(value) {
    let chip = new Chip(200,200,0,value,Color.red,this.ctx);
    this.chips.push(chip);
  }

  clear() {
    this.ctx.fillStyle = Color.darkGrey;
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
  }

  reset() {
    this.clear();
    this.table.draw();

  }

  renderIngame() {
    this.reset();
    this.renderGO();
  }

  renderGO() {
    for(let card of this.cards) {card.draw()};
    for(let chip of this.chips) {chip.draw()};
  }

  updateGO() {
    for(let card of this.cards) {card.update();}
    for(let chip of this.chips) {chip.update();}
  }

  start() {
    this.updateGO();
    this.renderIngame();
    this.raf = requestAnimationFrame(() => this.start());
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

class Card extends MovingObject{
  constructor(x, y,rotation, type, value, ctx) {
    super(x,y,rotation);
    // RENDER SPECIFIC
    //this.width = width;
    this.ctx = ctx;
    this.face = false;
    // CARD SPECIFIC
    this.type = type;
    this.value = value;
  }

  draw() {
    if(this.face) {
      this.drawFace();
    } else {
      this.drawBack();
    }
  }

  flip() {
    this.face = !this.face;
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
    //w = this.width,
    w = ctx.canvas.height * .085,
    h = 1.3*w,
    r = .06*w,
    x = this.x,
    y = this.y;

    // CARD SHAPE

    // GLOBAL CARD ROTATION
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
    // RESTORE GLOBAL CARD ROTATION
    ctx.restore();
  }

  drawFace() {
    let ctx = this.ctx,
    // w = this.width,
    w = ctx.canvas.height * .085,
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
      case 13: if (this.value === 13) CardLetter.draw({x: x, y: y+h*.17},scale*3.5,this.type,13,ctx);
      case 12: if (this.value === 12) CardLetter.draw({x: x, y: y+h*.17},scale*3.5,this.type,12,ctx);
      case 11: if (this.value === 11) CardLetter.draw({x: x, y: y+h*.17},scale*3.5,this.type,11,ctx);
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

  static drawBorder(x,y,rotation,ctx) {
    let w = ctx.canvas.height * .085,
    h = 1.3*w,
    r = .06*w,
    strokeWidth = w * .05;

    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.translate(-x, -y);

    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.arc((x-.5*w)+r,y-.5*h,r,Math.PI,Math.PI*1.5);
    ctx.arc((x+.5*w)-r,(y-.5*h),r,Math.PI*1.5,0);
    ctx.arc((x+.5*w)-r,(y+.5*h),r,0,Math.PI*.5);
    ctx.arc((x-.5*w)+r,(y+.5*h),r,Math.PI*.5,Math.PI);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();

  }
}

class Table {

  constructor(ctx) {
    this.ctx = ctx;
    this.cH;
    this.cW;
    this.h;
  }

  draw() {
    this.cH = this.ctx.canvas.height;
    this.cW = this.ctx.canvas.width;
    this.h = Math.floor(.8*this.cH);
    this.table();
    this.tableBorder();
    this.cardBorders();
  }

  table() {
    let ctx = this.ctx,
    cW = this.cW,
    cH = this.cH,
    h = this.h,
    grd,
    x = cW*.5,
    y = cH*.5;

    ctx.save();
    grd = ctx.createRadialGradient(x, y, 1, x, y, h);
    grd.addColorStop(0, Color.lightGreen);
    grd.addColorStop(1, Color.darkerGreen);
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(cW*.5-.5*h,cH*.5-.5*h);
    ctx.lineTo(cW*.5+.5*h,cH*.5-.5*h);
    ctx.arc(cW*.5+.5*h,cH*.5,h*.5,Math.PI*1.5,Math.PI*.5);
    ctx.lineTo(cW*.5-.5*h,cH*.5+.5*h);
    ctx.arc(cW*.5-.5*h,cH*.5,h*.5,Math.PI*.5,Math.PI*1.5);
    ctx.closePath();
    ctx.transform(1,0,0,0.7,0,h*.25);
    ctx.fill();
    ctx.restore();
  }

  tableBorder() {
    let ctx = this.ctx,
    cW = this.cW,
    cH = this.cH,
    h = this.h;
    ctx.strokeStyle = Color.brown;
    ctx.lineWidth = h*.1;
    ctx.beginPath();
    ctx.moveTo(cW*.5-.5*h,cH*.5-.5*h);
    ctx.lineTo(cW*.5+.5*h,cH*.5-.5*h);
    ctx.arc(cW*.5+.5*h,cH*.5,h*.5,Math.PI*1.5,Math.PI*.5);
    ctx.lineTo(cW*.5-.5*h,cH*.5+.5*h);
    ctx.arc(cW*.5-.5*h,cH*.5,h*.5,Math.PI*.5,Math.PI*1.5);
    ctx.stroke();
    ctx.strokeStyle = Color.brown2;
    ctx.lineWidth = h*.02;
    ctx.beginPath();
    ctx.moveTo(cW*.5-.5*h,cH*.5-.5*h);
    ctx.lineTo(cW*.5+.5*h,cH*.5-.5*h);
    ctx.arc(cW*.5+.5*h,cH*.5,h*.5,Math.PI*1.5,Math.PI*.5);
    ctx.lineTo(cW*.5-.5*h,cH*.5+.5*h);
    ctx.arc(cW*.5-.5*h,cH*.5,h*.5,Math.PI*.5,Math.PI*1.5);
    ctx.stroke();
  }

  cardBorders() {
    let ctx = this.ctx

    for(let i = .35; i < .7; i+=.05) {
        Card.drawBorder(ctx.canvas.width * i,ctx.canvas.height * .5,0,ctx);
    }

    CardLetter.drawLetter(ctx.canvas.width * .6,
      ctx.canvas.height * .517,
      ctx.canvas.height * .05,
      "S",
      "rgba(0,0,0,0.3)",
      ctx);
    CardLetter.drawLetter(ctx.canvas.width * .65,
      ctx.canvas.height * .517,
      ctx.canvas.height * .05,
      "D",
      "rgba(0,0,0,0.3)",
      ctx);
  }
}

class Chip extends MovingObject {
  constructor(x,y, rotation,value,color,ctx) {
    super(x,y,rotation);
    //this.x = x;
    //this.y = y;
    //this.radius = radius;
    //this.rotation = rotation;
    this.value = value;
    this.color = color;
    this.ctx = ctx;
  }

  draw() {
    let ctx = this.ctx,
    x = this.x,
    y = this.y,
    radius = ctx.canvas.height * .015,
    rot = this.rotation;

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

  static drawLetter(x,y,size,text,color,ctx) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = size + 'px sans-serif';
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
f.addCard(CardType.PIKES,CardValue.KING);
f.addChip(20);
//f.addCard(CardType.HEARTS,CardValue.KING);
// f.renderIngame();
// f.updateGO();
// f.renderIngame();
f.start();

// setInterval(() => {
//   f.renderIngame();
//   f.updateGO();
// },1000);
