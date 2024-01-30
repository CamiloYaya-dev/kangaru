const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Torre {
    constructor(x, y, color, vidaMaxima) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vida = 100;
        this.vidaMaxima = vidaMaxima;
        this.vidaMaximaLimite = 10000;
    }

    recibirDaño(daño) {
        console.log('hola');
        if(this.vida <= this.vidaMaxima){
            this.vida -= daño;
            this.vida = Math.max(0, this.vida); // Asegúrate de que la vida no sea negativa
        }
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

        // Dibuja el texto de la vida actual
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        const textoVida = this.vida + '/' + this.vidaMaxima;

        if (this.color === 'blue') {
            // Alinea el texto a la izquierda para la torre azul
            const textoX = this.x; // Comienza justo después de la barra de vida
            ctx.fillText(textoVida, textoX, yBarraVida);
        } else {
            // Alinea el texto a la derecha para la torre roja
            const textoX = this.x - anchoBarraVida + 30; // Termina justo antes de la torre
            ctx.fillText(textoVida, textoX, yBarraVida);
        }
    }

    incrementarVidaMaxima(incremento) {
        if(this.vidaMaxima < this.vidaMaximaLimite){
            this.vidaMaxima += incremento;
            this.vidaMaxima = this.vidaMaxima < this.vidaMaximaLimite ? this.vidaMaxima : 10000;
            this.vida = Math.min(this.vida + incremento, this.vidaMaxima); // Opcional: también incrementa la vida actual
        }
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
            case 'curador':
                this.vida = 1; // Vida de la tropa curadora
                this.velocidad = 0; // La tropa curadora no se moverá horizontalmente
                this.tamaño = 10; // Tamaño de la tropa curadora
                this.daño = -1; // Valor negativo para representar curación
                this.tiempoVida = 0.50 * 1000; // Duración de 3 segundos (en milisegundos)
                break;
            default:
                this.vida = 1;
                this.velocidad = 1;
                this.tamaño = 10;
        }

        if (tipo === 'curador') {
            this.movimientoVertical = 1; // Velocidad de movimiento vertical
            this.direccionVertical = 1; // 1 para subir, -1 para bajar
            this.limiteSuperior = 250; // Límite superior del movimiento vertical
            this.limiteInferior = 550; // Límite inferior del movimiento vertical
        }
    }

    mover() {
        this.x += this.velocidad;
    }

    dibujar() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.tamaño, this.tamaño);
    }

    moverVerticalmente() {
        // Cambiar la dirección si se alcanza un límite
        if (this.y <= this.limiteSuperior || this.y >= this.limiteInferior) {
            this.direccionVertical *= -1;
        }

        // Mover la tropa
        this.y += this.movimientoVertical * this.direccionVertical;
    }
}

function lanzarTropa(tipo, equipo, camino) {
    let xInicial = equipo === 'rojo' ? 730 : 50;
    let color = equipo === 'rojo' ? 'red' : 'blue';
    let velocidad = equipo === 'rojo' ? -1 : 1;

    if (tipo === 'curador') {
        const posiciones = ['arriba', 'medio', 'abajo'];
        camino = posiciones[Math.floor(Math.random() * posiciones.length)];
    }

    const nuevaTropa = new Tropa(xInicial, 0, color, tipo, camino);
    nuevaTropa.velocidad *= velocidad;
    tropas.push(nuevaTropa);
}

function incrementarVida(torreColor, incremento) {
    if (torreColor === 'roja') {
        torreRoja.incrementarVidaMaxima(incremento);
    } else if (torreColor === 'azul') {
        torreAzul.incrementarVidaMaxima(incremento);
    }
}

function aplicarDañoPorcentual(torre, porcentaje) {
    if(torre == 'roja'){
        const daño = torreRoja.vidaMaxima * (porcentaje / 100);
        console.log(daño);
        torreRoja.recibirDaño(daño);
    } else {
        const daño = torreAzul.vidaMaxima * (porcentaje / 100);
        console.log(daño);
        torreAzul.recibirDaño(daño);
    }
}

function activarPoder(torre, porcentaje) {
    aplicarDañoPorcentual(torre, porcentaje);
}



let torreRoja = new Torre(750, 250, 'red', 100); // Vida máxima de 100
let torreAzul = new Torre(0, 250, 'blue', 100); // Vida máxima de 100
let tropas = [];
let cuentaRegresiva = 30; // 30 segundos para la cuenta regresiva
let juegoTerminado = false; // Estado del juego
let victoriasRojo = 0;
let victoriasAzul = 0;

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

function mostrarContadorVictorias() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.fillText(victoriasAzul, 370, 30);
    ctx.fillText('/', 385, 30);
    ctx.fillText(victoriasRojo, 395, 30);
}

function finalizarJuego(equipoGanador) {
    if (equipoGanador === 'Rojo') {
        victoriasRojo++;
    } else if (equipoGanador === 'Azul') {
        victoriasAzul++;
    }
    juegoTerminado = true;
    mostrarMensajeVictoria(equipoGanador);
    mostrarContadorVictorias(); // Actualizar y mostrar el contador de victorias
    iniciarCuentaRegresiva();
}

function iniciarCuentaRegresiva() {
    cuentaRegresiva = 30;
    function cuentaRegresivaTick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        mostrarMensajeVictoria(juegoTerminado ? (torreRoja.vida <= 0 ? 'Azul' : 'Rojo') : '');
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Próximo juego en ' + cuentaRegresiva, canvas.width / 2 - 100, canvas.height / 2 + 50);
        
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
    mostrarContadorVictorias(); // Esto mantendrá el contador de victorias siempre visible
    
    test(50, 400, 10);

    // Dibuja el borde del escenario
    ctx.strokeStyle = 'black'; // Color del borde
    ctx.lineWidth = 3; // Grosor del borde
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2); // Dibuja un rectángulo para el borde
    

    torreRoja.dibujar();
    torreAzul.dibujar();

    // Procesa el movimiento y la detección de colisiones
    for (let i = tropas.length - 1; i >= 0; i--) {
        if (tropas[i].tipo === 'curador') {
            tropas[i].moverVerticalmente();
            // Curar la torre
            if (tropas[i].tiempoVida > 0) {
                (tropas[i].color === 'red' ? torreRoja : torreAzul).recibirDaño(tropas[i].daño);
                tropas[i].tiempoVida -= 1000 / 60; // Restar el tiempo del frame (en milisegundos)
            } else {
                // Tiempo de vida terminado, eliminar la tropa
                tropas.splice(i, 1);
                continue;
            }
        } else {
            tropas[i].mover();
        }
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