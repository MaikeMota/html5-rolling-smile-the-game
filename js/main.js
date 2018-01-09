//Variáveis do Jogo

var canvas;
var context;
var ALTURA;
var LARGURA;
var maxPulos = 3;
var velocidade = 6;
var estadoAtual;
var record;
var img;

var estados = {
    JOGAR: 0,
    JOGANDO: 1,
    PERDEU: 2
};

var chao = {
    y: 550,
    x: 0,
    altura: 50,

    atualiza: function () {
        this.x -= velocidade;
        if (this.x <= -30) {
            this.x = 0;
        }
    },
    desenha: function () {
        spriteChao.desenha(this.x, this.y);
        spriteChao.desenha(this.x + spriteChao.largura, this.y);
    }
};

var bloco = {
    x: 50,
    y: 0,
    altura: spriteBoneco.altura,
    largura: spriteBoneco.largura,
    gravidade: 1.6,
    velocidade: 0,
    forcaDoPulo: 25,
    quantidadePulos: 0,
    score: 0,
    rotacao: 0,

    pula: function () {
        if (this.quantidadePulos < maxPulos) {
            this.velocidade = -this.forcaDoPulo;
            this.quantidadePulos++;
        }
    },
    atualiza: function () {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;
        this.rotacao += Math.PI / 180 * velocidade;

        if (this.y > (chao.y - this.altura) && estadoAtual != estados.PERDEU) {
            this.y = (chao.y - this.altura);
            this.quantidadePulos = 0;
            this.velocidade = 0;
        }

    },
    desenha: function () {
        context.save();
        context.translate(this.x + this.largura / 2, this.y + this.altura / 2);
        context.rotate(this.rotacao);
        spriteBoneco.desenha((-this.largura) / 2, (-this.altura) / 2);
        context.restore();
    },
    reset: function () {
        this.y = 0;
        this.velocidade = 0;
        if (this.score > record) {
            localStorage.setItem('RECORD', this.score);
            record = this.score;
        }
        this.score = 0;
    }
};

var obstaculos = {
    obs: [],
    cores: ['#ffbc1c', '#ff1c1c', '#ff85e1', '##52a7ff', '#78ff5d'],
    tempoInsercao: 0,

    insere: function () {
        this.obs.push({
            x: LARGURA,
            //largura: 30 + Math.floor(20 * Math.random()),
            largura: 50,
            altura: 30 + Math.floor(120 * Math.random()),
            cor: obstaculos.cores[Math.floor(Math.random() * 5)]
        });

        this.tempoInsercao = 30 + Math.floor(20 * Math.random());
    },
    atualiza: function () {
        if (this.tempoInsercao == 0) {
            this.insere();
        } else {
            this.tempoInsercao--;
        }

        for (var i = 0, tam = this.obs.length; i < tam; i++) {
            var obs = this.obs[i];

            obs.x -= velocidade;

            if ((bloco.x < (obs.x + obs.largura)) && ((bloco.x + bloco.largura) >= obs.x) && ((bloco.y + bloco.altura) >= (chao.y - obs.altura))) {
                estadoAtual = estados.PERDEU;
            } else if (obs.x == 0) {
                bloco.score++;

            } else if (obs.x <= (-obs.largura)) {
                this.obs.splice(i, 1);
                i--;
                tam--;
            }
        }
    },
    desenha: function () {
        this.obs.forEach(function (obs) {
            context.fillStyle = obs.cor;
            context.fillRect(obs.x, (chao.y - obs.altura), obs.largura, obs.altura);
        });
    },
    limpa: function () {
        this.obs = [];
        this.tempoInsercao = 0;
    }
}

function clique(event) {
    if (estadoAtual == estados.JOGANDO) {
        bloco.pula();
    } else if (estadoAtual == estados.JOGAR) {
        estadoAtual = estados.JOGANDO;
    } else if (estadoAtual == estados.PERDEU && bloco.y >= (ALTURA * 2)) {
        estadoAtual = estados.JOGAR;
        obstaculos.limpa();
        bloco.reset();
    }
}

function main() {
    ALTURA = window.innerHeight;
    LARGURA = window.innerWidth;

    if (LARGURA >= 500) {
        ALTURA = 600;
        LARGURA = 600;
    }

    canvas = document.createElement('canvas');
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    canvas.style.border = "1px solid #000";
    context = canvas.getContext('2d');
    document.body.appendChild(canvas);
    document.addEventListener('mousedown', clique);

    estadoAtual = estados.JOGAR;
    record = localStorage.getItem('RECORD') || 0;

    img = new Image();
    img.src = 'imagens/sheet.png';

    roda();

}

function roda() {

    atualiza();
    desenha();
    window.requestAnimationFrame(roda);

}

function atualiza() {
    if (estadoAtual == estados.JOGANDO) {
        obstaculos.atualiza();
    }
    chao.atualiza();
    bloco.atualiza();
}

function desenha() {

    background.desenha(0, 0);

    context.fillStyle = "#fff";
    context.font = "50px Arial";
    context.fillText(bloco.score, 30, 68);

    chao.desenha();
    bloco.desenha();

    if (estadoAtual == estados.JOGANDO) {
        obstaculos.desenha();
    } else if (estadoAtual == estados.JOGAR) {
        jogar.desenha((LARGURA / 2) - (jogar.largura / 2), (ALTURA / 2) - (jogar.altura / 2));
    } else if (estadoAtual == estados.PERDEU) {

        perdeu.desenha((LARGURA / 2) - (perdeu.largura / 2), (ALTURA / 2) - (perdeu.altura / 2) - (spriteRecorde.altura / 2));
        spriteRecorde.desenha((LARGURA / 2) - (spriteRecorde.largura / 2), (ALTURA / 2) + (perdeu.altura / 2) - (spriteRecorde.altura / 2) - 19);

        context.fillStyle = "#fff";
        context.fillText(bloco.score, 375, 390);

        if (bloco.score > record) {
            novo.desenha((LARGURA / 2) - 180, (ALTURA / 2) + 30);
            context.fillText(bloco.score, 420, 480);
        } else {
            context.fillText(record, 415, 480);
        }
    }


}



main();
