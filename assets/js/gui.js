// automatic starting function after the document loaded
(() => {
  // further game initializiation here
})();
const Color = {
  darkGrey: '#303030',
  lightGreen: '#68b249',
  darkerGreen: '#4d8436',
  brown: '#4c4128',
  brown2: '#7a6840'
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
    let card1 = new Card(this.canvas.width*.5, this.canvas.height*.5,45,'ace',true,this.ctx);
    let card2 = new Card(this.canvas.width*.5 -200, this.canvas.height*.5,-45,'ace',false,this.ctx);
    let chip1 = new Chip(500,400,0,10,this.ctx);
    let s = [card1,card2];
    s.forEach(e => e.draw());
    chip1.draw();
    // card1.draw();
    // card2.draw();
    // chip1.draw();
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
  constructor(x, y, rotation, value, face, ctx) {
    // RENDER SPECIFIC
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.ctx = ctx;
    this.face = face;
    // CARD SPECIFIC
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

  drawBack() {
    let ctx = this.ctx,
    scale = ctx.canvas.height * .0013,
    w = 50*scale,
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
    w = 50 * scale * .85;
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

  drawBack2() {
    let ctx = this.ctx,
    scale = ctx.canvas.height * .0013,
    w = 50*scale,
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
    scale = ctx.canvas.height * .0013,
    w = 50*scale,
    h = 1.3*w,
    r = .06*w,
    x = this.x,
    y = this.y;

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

    ctx.translate(x, y);
    ctx.rotate(-this.rotation * Math.PI / 180);
    ctx.translate(-x, -y);

    ctx.restore();
  }

  set value(value) {
    // EXAMPLE
    switch(value) {
      case 'king': this._value = 1; break;
      default: this._value = 0; break;
    }
  }

  get value() {
    return this._value;
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
  constructor(x,y,rotation,value,ctx) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.value = value;
    this.ctx = ctx;

  }

  draw() {
    let ctx = this.ctx,
    x = this.x,
    y = this.y,
    radius = 10; //to be controlled via scale (maybe put scale up in the table class)

    ctx.fillStyle = '#ce5f5f';
    ctx.save();
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2);
    ctx.fill();

    ctx.clip();

    ctx.fillStyle = "#fff";
    for(let i = 0; i < 3; i++) {
      ctx.translate(x,y);
      ctx.rotate(60 * Math.PI / 180)
      ctx.translate(-x,-y);
      ctx.fillRect(x-radius*1.1,y-radius*.1,radius*2.2,radius*.2);
    }

    ctx.restore();
    ctx.strokeStyle = '#fff';

    ctx.beginPath();
    ctx.arc(x,y,radius*.8,0,Math.PI*2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x,y,radius*.6,0,Math.PI*2);
    ctx.stroke();



  }
}

let f = new PokerGameGui();
f.reset();
