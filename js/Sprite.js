Sprite = function (x, y, largura, altura) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;

    this.desenha = function (xCanvas, yCanvas) {
        context.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas, yCanvas, this.largura, this.altura);
    }
}

var background = new Sprite(0, 0, 600, 600);
var spriteBoneco = new Sprite(618, 16, 87, 87);
var perdeu = new Sprite(603, 478, 397, 358);
var jogar = new Sprite(603, 127, 395, 346);
var spriteRecorde = new Sprite(28, 882, 436, 92);
var spriteChao = new Sprite(0, 604, 600, 54);
var novo = new Sprite(66, 721, 288, 91);
