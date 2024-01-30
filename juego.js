const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Torre {
    constructor(x, y, color, vidaMaxima) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vida = 100;
        this.vidaMaxima = vidaMaxima;
    }

    recibirDaño(daño) {
        this.vida -= daño;
        this.vida = Math.max(0, this.vida); // Asegúrate de que la vida no sea negativa
    }

    dibujar() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 50, 300);
        // Dibuja la barra de vida
        this.dibujarBarraDeVida();
    }

    dibujarBarraDeVida() {
        const anchoBarraVida = 50; // El mismo ancho que la torre
        const alturaBarraVida = 10; // La altura de la barra de vida
        const yBarraVida = this.y - alturaBarraVida - 5; // Posición por encima de la torre

        // Barra de vida vacía (fondo rojo)
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, yBarraVida, anchoBarraVida, alturaBarraVida);

        // Barra de vida restante (verde encima)
        ctx.fillStyle = 'green';
        const anchoVidaRestante = anchoBarraVida * (this.vida / this.vidaMaxima);
        ctx.fillRect(this.x, yBarraVida, anchoVidaRestante, alturaBarraVida);
    }
}

class Tropa {
    constructor(x, y, color, tipo, camino) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.tipo = tipo;
        this.camino = camino; // Nuevo atributo para el camino
        // Asignar la coordenada 'y' en función del camino elegido
        this.y = camino === 'arriba' ? 300 : camino === 'medio' ? 400 : 540;
        
        switch(tipo) {
            case 'soldado':
                this.vida = 1;
                this.velocidad = 1;
                this.tamaño = 10;
                this.daño = 1;
                break;
            case 'caballo':
                this.vida = 5;
                this.velocidad = 2;
                this.tamaño = 15;
                this.daño = 5;
                break;
            case 'tanque':
                this.vida = 20;
                this.velocidad = 0.5;
                this.tamaño = 20;
                this.daño = 20;
                break;
            default:
                this.vida = 1;
                this.velocidad = 1;
                this.tamaño = 10;
        }
    }

    mover() {
        this.x += this.velocidad;
    }

    dibujar() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.tamaño, this.tamaño);
    }
}

function lanzarTropa(tipo, equipo, camino) {
    let xInicial = equipo === 'rojo' ? 730 : 50;
    let color = equipo === 'rojo' ? 'red' : 'blue';
    let velocidad = equipo === 'rojo' ? -1 : 1;

    const nuevaTropa = new Tropa(xInicial, 0, color, tipo, camino);
    nuevaTropa.velocidad *= velocidad;
    tropas.push(nuevaTropa);
}

let torreRoja = new Torre(750, 250, 'red', 100); // Vida máxima de 100
let torreAzul = new Torre(0, 250, 'blue', 100); // Vida máxima de 100
let tropas = [];
let cuentaRegresiva = 30; // 30 segundos para la cuenta regresiva
let juegoTerminado = false; // Estado del juego

function colisionConTorre(tropa, torre) {
    if (tropa.color === 'red' && tropa.x - tropa.tamaño <= torre.x + 50) {
        torre.recibirDaño(tropa.daño);
        torre.vida -= tropa.daño; // La torre pierde vida igual al daño de la tropa
        return true; // Indica que ha habido colisión
    } else if (tropa.color === 'blue' && tropa.x + tropa.tamaño >= torre.x) {
        torre.recibirDaño(tropa.daño);
        torre.vida -= tropa.daño; // La torre pierde vida igual al daño de la tropa
        return true; // Indica que ha habido colisión
    }
    return false; // No ha habido colisión
}

function test(x, y, tamaño) {
    ctx.fillStyle = 'black'; // Color del cuadrado
    ctx.fillRect(x, y, tamaño, tamaño); // Dibuja el cuadrado
}

function mostrarMensajeVictoria(equipoGanador) {
    ctx.font = '48px Arial';
    ctx.fillStyle = equipoGanador === 'Rojo' ? 'red' : 'blue';
    ctx.fillText('Equipo ' + equipoGanador + ' ganador', canvas.width / 2 - 200, canvas.height / 2);
}

function finalizarJuego(equipoGanador) {
    juegoTerminado = true;
    mostrarMensajeVictoria(equipoGanador);
    iniciarCuentaRegresiva();
}

function iniciarCuentaRegresiva() {
    cuentaRegresiva = 30;
    function cuentaRegresivaTick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mostrarMensajeVictoria(juegoTerminado ? (torreRoja.vida <= 0 ? 'Azul' : 'Rojo') : '');
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Próximo juego en ' + cuentaRegresiva, canvas.width / 2 - 100, canvas.height / 2);
        
        if (cuentaRegresiva > 0) {
            setTimeout(cuentaRegresivaTick, 1000);
            cuentaRegresiva--;
        } else {
            reiniciarJuego();
        }
    }
    cuentaRegresivaTick();
}

function reiniciarJuego() {
    juegoTerminado = false;
    torreRoja.vida = torreRoja.vidaMaxima;
    torreAzul.vida = torreAzul.vidaMaxima;
    tropas = [];
    actualizarJuego();
}

function actualizarJuego() {

    if (juegoTerminado) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    test(50, 400, 10);

    // Dibuja el borde del escenario
    ctx.strokeStyle = 'black'; // Color del borde
    ctx.lineWidth = 3; // Grosor del borde
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2); // Dibuja un rectángulo para el borde
    

    torreRoja.dibujar();
    torreAzul.dibujar();

    // Procesa el movimiento y la detección de colisiones
    for (let i = tropas.length - 1; i >= 0; i--) {
        tropas[i].mover();
        // Verifica la colisión con la torre enemiga
        if (colisionConTorre(tropas[i], tropas[i].color === 'red' ? torreAzul : torreRoja)) {
            // Elimina la tropa si colisiona con la torre enemiga
            tropas.splice(i, 1);
        } else {
            // Si no hay colisión, dibuja la tropa
            tropas[i].dibujar();
        }
    }

    torreRoja.dibujar();
    torreAzul.dibujar();

    if (torreRoja.vida <= 0) {
        finalizarJuego('Azul');
        return; // Detiene el ciclo de juego
    } else if (torreAzul.vida <= 0) {
        finalizarJuego('Rojo');
        return; // Detiene el ciclo de juego
    }

    requestAnimationFrame(actualizarJuego);
}

actualizarJuego();