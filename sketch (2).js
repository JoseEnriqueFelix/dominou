let WIDTH;
let HEIGHT;
function setup() {
    WIDTH = displayWidth - 400;
    HEIGHT = displayHeight
    createCanvas(WIDTH, HEIGHT);
    background(200)

    let totalVecesJugar = 3;
    const vecesInput = createInput(totalVecesJugar);
    vecesInput.position(10, 10);
    vecesInput.size(100);
    vecesInput.input((event) => {
        totalVecesJugar = parseInt(event.target.value)
    });

    let timeToWait = 1000
    const timeInput = createInput(timeToWait);
    timeInput.position(10, 35);
    timeInput.size(100);
    timeInput.input((event) => {
        timeToWait = parseInt(event.target.value)
    });

    const button = createButton('Empezar simulación');
    button.position(10, 60);
    button.mousePressed(() => main(totalVecesJugar, timeToWait));
}

const main = async (totalVecesJugar, timeToWait) => {
    const data = [0, 0, 0, 0];
    mostrarGrafica(data)
    for (let i = 0; i < totalVecesJugar; i++) {
        background(200)
        let fichasAsignadas = new Set();
        let { fichasJugadores, fichasJuego } = dibujarFichasJugadores(fichasAsignadas);

        let jugadorIndex = obtenerPrimerOrden(fichasJugadores)
        tratarDeTirarFicha(fichasJugadores, fichasJuego, jugadorIndex, true);

        while (true) {
            jugadorIndex = (jugadorIndex + 1) % 4;
            tratarDeTirarFicha(fichasJugadores, fichasJuego, jugadorIndex, false);

            textSize(16);
            if (fichasJugadores[jugadorIndex].length == 0) {
                text(`Ganó el jugador ${jugadorIndex + 1}`, 530, 650);
                data[jugadorIndex] = data[jugadorIndex] + 1;
                mostrarGrafica(data)
                break;
            }

            if (numberOfSkips !== 4) continue;
            const puntosJugadores = fichasJugadores.map(
                (fichasJugador) => {
                    const data = fichasJugador.map((ficha) => {
                        if (ficha.ladoA == 0 && ficha.ladoB == 0) return 50;
                        return ficha.ladoA + ficha.ladoB;
                    });
                    return data.reduce((a, b) => a + b, 0);
                }
            )

            let MIN_POINTS = 0;
            const winnerPlayersIndexes = [];
            for (let i = 0; i < puntosJugadores.length; i++) {
                const puntosJugador = puntosJugadores[i];
                if (puntosJugador > MIN_POINTS) {
                    MIN_POINTS = puntosJugador;
                }
            }

            for (let i = 0; i < puntosJugadores.length; i++) {
                const puntosJugador = puntosJugadores[i];
                if (puntosJugador == MIN_POINTS) {
                    winnerPlayersIndexes.push(i);
                }
            }


            let message = `Ganó el jugador ${winnerPlayersIndexes[0] + 1}`
            data[winnerPlayersIndexes[0]] = data[winnerPlayersIndexes[0]] + 1;
            mostrarGrafica(data)
            text(message, 530, 650);
            break;
        }

        dibujarTablero()

        await wait(timeToWait);
        numberOfSkips = 0;
        tablero = [6, 6];

        ladoIzquierdo = [];
        ladoDerecho = []
        text(`El jugador 2 ganó ${data[1]} veces`, 505, 680);
    }
};

const dibujarTablero = () => {
    const y = HEIGHT * 0.4;
    dibujarFicha({ x: WIDTH / 2, y, ladoA: 6, ladoB: 6, ejeX: false,escalado: 0.8});

    let ultimaX = WIDTH / 2;
    ladoDerecho.forEach((ficha, index) => {
        const esEjeX = ficha.ladoA !== ficha.ladoB;
        let x = esEjeX ? ultimaX + 50 : ultimaX + 37;
        if (ultimaX == WIDTH / 2) {
            x = (WIDTH / 2) + 36;
        }

        // voltear ficha
        if (ultimaX !== WIDTH / 2) {
            const antiguaFicha = ladoDerecho[index - 1];
            let fichaB = ficha.ladoB;
            if (antiguaFicha.ladoB == fichaB) {
                ficha.ladoB = ficha.ladoA;
                ficha.ladoA = fichaB;
            }
        } else {
            let fichaB = ficha.ladoB;
            if (ficha.ladoB == 6) {
                ficha.ladoB = ficha.ladoA;
                ficha.ladoA = fichaB;
            }
        }

        dibujarFicha({ x, y, ladoA: ficha.ladoA, ladoB: ficha.ladoB, ejeX: esEjeX, escalado: 0.8 })
        if (!esEjeX) {
            x = x  -12;
        }
        ultimaX = x;
    });

    ultimaX = WIDTH / 2;
    ladoIzquierdo.forEach((ficha, index) => {
        const esEjeX = ficha.ladoA !== ficha.ladoB;
        let x = esEjeX ? ultimaX - 50 : ultimaX - 37;
        if (ultimaX == WIDTH / 2) {
            x = (WIDTH / 2) - 36;
        }

        // voltear ficha
        if (ultimaX !== WIDTH / 2) {
            const antiguaFicha = ladoIzquierdo[index - 1];
            let fichaA = ficha.ladoA;
            if (antiguaFicha.ladoA == fichaA) {
                ficha.ladoA = ficha.ladoB;
                ficha.ladoB = fichaA;
            }
        } else {
            let fichaA = ficha.ladoA;
            if (ficha.ladoA == 6) {
                ficha.ladoA = ficha.ladoB;
                ficha.ladoB = fichaA;
            }
        }


        dibujarFicha({ x, y, ladoA: ficha.ladoA, ladoB: ficha.ladoB, ejeX: esEjeX, escalado: 0.8 })
        if (!esEjeX) {
            x = x + 12;
        }
        ultimaX = x;
    });
}

let chart = null;
const mostrarGrafica = (data) => {
    // mostrar grafica
    if (chart) {
        const dataset = chart.config.data.datasets[0]
        dataset.data = data;
        chart.update()
        return;
    }
    const ctx = document.getElementById('myChart');
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"],
            datasets: [{
                label: "Ganadas",
                data
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Veces ganadas por cada jugador'
                }
            }
        },
    })

}

const dibujarFichasJugadores = (fichasAsignadas) => {
    let fichasJuego = []
    let fichas1 = obtenerFichasUsuario(fichasAsignadas);
    dibujarFichasUsuario(0, 400, 50, fichas1, fichasJuego)


    let fichas2 = obtenerFichasUsuario(fichasAsignadas);
    dibujarFichasUsuario(1, 1050, 225, fichas2, fichasJuego)


    let fichas3 = obtenerFichasUsuario(fichasAsignadas);
    dibujarFichasUsuario(2, 400, 725, fichas3, fichasJuego)


    let fichas4 = obtenerFichasUsuario(fichasAsignadas);
    dibujarFichasUsuario(3, 50, 225, fichas4, fichasJuego)

    const fichasJugadores = [fichas1, fichas2, fichas3, fichas4];
    return { fichasJugadores, fichasJuego }
}

const obtenerPrimerOrden = (fichasJugadores) => {
    let ordenes = fichasJugadores.map((fichas) => {
        return fichas.findIndex((ficha) => {
            return ficha.ladoA == 6 && ficha.ladoB == 6;
        });
    });
    let jugadorIndex = ordenes.findIndex((orden) => { return orden != -1 });
    if (jugadorIndex == -1)
        throw new Error("Internal error. Mala generación de fichas");
    return jugadorIndex;
}

const dibujarFichasUsuario = (numeroUsuario, initialX, initialY, fichas, fichasJuego) => {
    let i = 0;
    let esPar = numeroUsuario % 2 == 0;
    // TODO: simplificar esto
    let multiplicadorX = esPar ? 60 : 0;
    let multiplicadoY = esPar ? 0 : 60;
    for (const ficha of fichas) {
        let x = initialX + (multiplicadorX * i);
        let y = initialY + (multiplicadoY * i);
        const fichaD = {
            x,
            y,
            ladoA: ficha.ladoA,
            ladoB: ficha.ladoB,
            ejeX: !esPar
        }
        dibujarFicha(fichaD)
        fichasJuego.push({ ...fichaD, numeroUsuario })
        i++;
    }
}


const obtenerFichasUsuario = (fichasAsignadas) => {
    const fichas = []
    for (let index = 0; index < 7; index++) {
        let ladoA = monteCarlo()
        let ladoB = monteCarlo()

        while (fichasAsignadas.has(`${ladoA}-${ladoB}`) || fichasAsignadas.has(`${ladoB}-${ladoA}`)) {
            ladoA = monteCarlo()
            ladoB = monteCarlo()
        }

        fichasAsignadas.add(`${ladoA}-${ladoB}`)
        fichas.push({ ladoA, ladoB })
    }
    return fichas;
}

const dibujarFicha = ({ x, y, ladoA, ladoB, ejeX, escalado = 1 }) => {
    let fichaAlto = (ejeX ? 30 : 60) * escalado
    let fichaAncho = (ejeX ? 60 : 30) * escalado


    let newX = x - (fichaAncho / 2)
    let newY = y - (fichaAlto / 2)

    strokeWeight(1)
    rect(newX, newY, fichaAncho, fichaAlto, 3.5)
    if (ejeX) {
        line(newX + fichaAncho / 2, newY, newX + fichaAncho / 2, newY + fichaAlto)
    } else {
        line(newX, newY + (fichaAlto / 2), newX + fichaAncho, newY + (fichaAlto / 2));
    }
    let pointWeight = 5;
    if(escalado == 1){
        pointWeight = 7.5;
    }
    strokeWeight(pointWeight)

    dibujarPuntos(newX, newY, ladoA, ejeX,escalado)
    if (ejeX) {
        newX += fichaAlto;
    } else {
        newY += fichaAncho;
    }
    dibujarPuntos(newX, newY, ladoB, ejeX,escalado)
    strokeWeight(1)
}

const dibujarPuntos = (x, y, puntos, ejeX, escalado =1) => {
    let fichaAlto = ejeX ? 60 : 30
    let fichaAncho = ejeX ? 30 : 60
    if(escalado != 1){
        fichaAlto = ejeX ? 45 : 25
        fichaAncho = ejeX ? 25 : 45
    }
    switch (puntos) {
        case 1:
            if (ejeX) {
                point((x + (fichaAncho * 0.5)),( y + (fichaAlto * 0.25)))
            } else {
                point((x + (fichaAncho * 0.25)),( y + (fichaAlto * 0.5)))
            }
            break;
        case 2:
            if (ejeX) {
                point((x + (fichaAncho * 0.35)), (y + (fichaAlto * 0.15)))
                point((x + (fichaAncho * 0.70)), (y + (fichaAlto * 0.35)))
            } else {
                point((x + (fichaAncho * 0.15)),( y + (fichaAlto * 0.35)))
                point((x + (fichaAncho * 0.35)),( y + (fichaAlto * 0.70)))
            }
            break;
        case 3:
            if (ejeX) {
                point((x + (fichaAncho * 0.25)), (y + (fichaAlto * 0.375)))
                point((x + (fichaAncho * 0.5)), (y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.75)), (y + (fichaAlto * 0.125)))
            } else {
                point((x + (fichaAncho * 0.375)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.25)), (y + (fichaAlto * 0.5)))
                point((x + (fichaAncho * 0.125)), (y + (fichaAlto * 0.75)))
            }
            break;
        case 4:
            if (ejeX) {
                point((x + (fichaAncho * 0.25)), (y + (fichaAlto * 0.125)))
                point((x + (fichaAncho * 0.75)), (y + (fichaAlto * 0.125)))
                point((x + (fichaAncho * 0.25)), (y + (fichaAlto * 0.375)))
                point((x + (fichaAncho * 0.75)), (y + (fichaAlto * 0.375)))
            } else {
                point((x + (fichaAncho * 0.125)), (y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.125)), (y + (fichaAlto * 0.75)))
                point((x + (fichaAncho * 0.375)), (y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.375)), (y + (fichaAlto * 0.75)))
            }
            break;
        case 5:
            if (ejeX) {
                point((x + (fichaAncho * 0.25)), (y + (fichaAlto * 0.125)))
                point((x + (fichaAncho * 0.75)), (y + (fichaAlto * 0.125)))
                point((x + (fichaAncho * 0.5)), (y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.25)), (y + (fichaAlto * 0.375)))
                point((x + (fichaAncho * 0.75)), (y + (fichaAlto * 0.375)))
            } else {
                point((x + (fichaAncho * 0.125)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.125)),( y + (fichaAlto * 0.75)))
                point((x + (fichaAncho * 0.25)),( y + (fichaAlto * 0.5)))
                point((x + (fichaAncho * 0.375)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.375)),( y + (fichaAlto * 0.75)))
            }
            break;
        case 6:
            if (ejeX) {
                point((x + (fichaAncho * 0.25)),( y + (fichaAlto * 0.1)))
                point((x + (fichaAncho * 0.75)),( y + (fichaAlto * 0.1)))
                point((x + (fichaAncho * 0.25)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.75)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.25)), (y + (fichaAlto * 0.4)))
                point((x + (fichaAncho * 0.75)), (y + (fichaAlto * 0.4)))
            } else {
                point((x + (fichaAncho * 0.1)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.1)),( y + (fichaAlto * 0.75)))
                point((x + (fichaAncho * 0.25)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.25)),( y + (fichaAlto * 0.75)))
                point((x + (fichaAncho * 0.4)),( y + (fichaAlto * 0.25)))
                point((x + (fichaAncho * 0.4)),( y + (fichaAlto * 0.75)))
            }
            break;
    }
}

function monteCarlo() {
    let random = Math.random();
    let valor;
    if (random <= 1 / 7) {
        valor = 0
    } else if (random > 1 / 7 && random <= 2 / 7) {
        valor = 1
    }
    else if (random > 2 / 7 && random <= 3 / 7) {
        valor = 2
    }
    else if (random > 3 / 7 && random <= 4 / 7) {
        valor = 3
    }
    else if (random > 4 / 7 && random <= 5 / 7) {
        valor = 4
    }
    else if (random > 5 / 7 && random <= 6 / 7) {
        valor = 5
    }
    else {
        valor = 6
    }
    return valor
}

function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

let tablero = [6, 6]
let numberOfSkips = 0;
let ladoDerecho = [];
let ladoIzquierdo = [];
const tratarDeTirarFicha = async (fichasJugadores, fichasJuego, jugadorIndex, isFirst) => {
    let ladoPorElCualRevisar = Math.floor(Math.random() * 2);
    const fichasJugador = fichasJugadores[jugadorIndex];

    let numeroPorRevisar = tablero[ladoPorElCualRevisar];
    const index = fichasJugador.findIndex((ficha) => {
        if (isFirst) {
            return ficha.ladoA == numeroPorRevisar && ficha.ladoB == numeroPorRevisar;
        }
        return ficha.ladoA == numeroPorRevisar || ficha.ladoB == numeroPorRevisar;
    });

    if (index == -1) {
        numberOfSkips++;
        return;
    }
    numberOfSkips = 0;
    const ficha = fichasJugador[index];

    quitarFicha(fichasJuego, ficha)
    fichasJugador.splice(index, 1);

    if (!isFirst) ladoPorElCualRevisar == 0 ? ladoIzquierdo.push(ficha) : ladoDerecho.push(ficha);
    if (ficha.ladoA == numeroPorRevisar) {
        tablero[ladoPorElCualRevisar] = ficha.ladoB;
    } else {
        tablero[ladoPorElCualRevisar] = ficha.ladoA;
    }
};

const quitarFicha = (fichasJuego, ficha) => {
    const fichaIndex = fichasJuego.findIndex((fichaJuego) => {
        return fichaJuego.ladoA == ficha.ladoA && fichaJuego.ladoB == ficha.ladoB;
    });

    if (fichaIndex == -1) return;
    const fichaPorQuitar = fichasJuego[fichaIndex];

    // quitar ficha
    let fichaAlto = fichaPorQuitar.ejeX ? 30 : 60
    let fichaAncho = fichaPorQuitar.ejeX ? 60 : 30

    let newX = fichaPorQuitar.x - (fichaAncho / 2)
    let newY = fichaPorQuitar.y - (fichaAlto / 2)

    rect(newX, newY, fichaAncho, fichaAlto, 3.5)
    stroke(255, 0, 0)
    line(newX + 1, newY + 1, newX + fichaAncho - 1, newY + fichaAlto - 1, 3.5)
    stroke(0, 0, 0)

    fichasJuego.splice(fichaIndex, 1);
};