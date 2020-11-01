const frameRate = 45;
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let width = canvas.width;
let height = canvas.height;
const debug = {};



function tile(position, length, height) {
    const tile = {
        position: position,
        height: height,
        length: length,
        color: "#" + "00ffff",
        offset: 0
    }
    return tile;
}


let themeSwitchInProgress = false;






// let darkTheme = true;
let waveAmplitude = 100;
let elapsedTime = 0;
let wavePeriod = 1200;
let pause = false;
let gridSize = 4;
let speed = 0.1;
let oldSize = 0;
let tileHeight = height * 2 / 10;
let grid = [];
let tileLength = width * 0.5 / gridSize;
// tileLength = 100;



function rgb(r, g, b) {
    return {
        r,
        g,
        b
    }
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}


let defaultTheme = {
    type: 'Default Theme',
    t: 0,
    maxTime: 7500,
    color: {
        r: 0,
        g: 0,
        b: 0
    },
    targetColor: {
        r: 0,
        g: 0,
        b: 0,
    },
    error: 1,
    swaps: 0,
    nextColor: function() {
        return {
            r: Math.random() * 255,
            g: Math.random() * 255,
            b: Math.random() * 255,
        }
    }
}
let theme1 = {
    type: 'Heat Wave',
    t: 7600,
    maxTime: 7500,
    color: rgb(217, 181, 4),
    targetColor: {
        r: 0,
        g: 0,
        b: 0,
    },
    error: 1,
    swaps: 0,
    presetColors: [hexToRgb("#D9B504"), hexToRgb("#F29F05"), hexToRgb("#D97904"), hexToRgb("#BF0404"), hexToRgb("#730202")],
    index: 0,
    nextColor: function() {
        this.index = (this.index + ~~(Math.random() * this.presetColors.length)) % this.presetColors.length;
        console.log(this.index);
        return this.presetColors[this.index];

    }
}
let theme2 = {
    type: 'Cold Beach',
    t: 7600,
    maxTime: 7500,
    color: hexToRgb("#516373"),
    targetColor: {
        r: 0,
        g: 0,
        b: 0,
    },
    error: 1,
    swaps: 0,
    presetColors: [hexToRgb("#516373"), hexToRgb("#2A3740"), hexToRgb("#A3B4BF"), hexToRgb("#D5E7F2"), hexToRgb("#F2DEA0")],
    index: 0,
    nextColor: function() {
        this.index = (this.index + ~~(Math.random() * this.presetColors.length - 1)) % this.presetColors.length;
        console.log(this.index);
        return this.presetColors[this.index];

    }
}
let theme3 = {
    type: 'Coffee and Cream',
    t: 7600,
    maxTime: 7500,
    color: hexToRgb("#8C796D"),
    targetColor: {
        r: 0,
        g: 0,
        b: 0,
    },
    error: 1,
    swaps: 0,
    presetColors: [hexToRgb("#8C796D"), hexToRgb("#402116"), hexToRgb("#D9A08B"), hexToRgb("#F2C1AE"), hexToRgb("#D97E7E")],
    index: 0,
    nextColor: function() {
        this.index = (this.index + ~~(Math.random() * this.presetColors.length - 1)) % this.presetColors.length;
        console.log(this.index);
        return this.presetColors[this.index];

    }
}
let theme4 = {
    type: 'Color TV',
    t: 7600,
    maxTime: 7500,
    color: hexToRgb("#04BF68"),
    targetColor: {
        r: 0,
        g: 0,
        b: 0,
    },
    error: 1,
    swaps: 0,
    presetColors: [hexToRgb("#04BF68"), hexToRgb("#F2E205"), hexToRgb("#F2B705"), hexToRgb("#F24141"), hexToRgb("#0D0D0D")],
    index: 0,
    nextColor: function() {
        this.index = (this.index + ~~(Math.random() * this.presetColors.length - 1)) % this.presetColors.length;
        console.log(this.index);
        return this.presetColors[this.index];

    }
}
const themes = [defaultTheme, theme1, theme2, theme3, theme4];
let currentTheme = defaultTheme;
// theme.t = theme.themeLength;

canvas.width = 0
let needToUpdateVisuals = true;
noise.seed(Math.random());


function vector(x, y, z) {
    return {
        x,
        y,
        z
    }
}

function updateGridWave(amplitude, t) {
    // t /= gridSize * gridSize / 2
    for (let x = 0; x < grid.length; x++) {
        for (let y = 0; y < grid.length; y++) {
            let tile = grid[x][y];
            let p = tile.position;
            grid[x][y].offset =
                amplitude * Math.sin(
                    (t * 2 * Math.PI / (wavePeriod)) + p.z
                )
        }
    }
    // drawRequest = true;
}

function resolveGridWave(t) {
    updateGridWave(waveAmplitude, t);

}

function resize() {
    grid = createGrid(gridSize, width * 0.4 / gridSize);
}


function draw(t) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    tileLength = canvas.width * 0.5 / gridSize;
    tileLength = Math.min(1680 / (gridSize * gridSize), tileLength);
    if (width !== canvas.width) {
        resize();
    }
    // globalTileLength=canvas.width
    width = canvas.width;
    height = canvas.height;
    ctx.fillRect(0, 0, width, height);
    oldSize = gridSize;
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i];
        for (let j = 0; j < row.length; j++) {
            const tile = row[j];

            drawTile(ctx, tile);

        }

    }
    let color = getThemeColor(currentTheme);
    let style = `rgba(${color.r},${color.g },${color.b},1)`
    ctx.fillStyle = style;
    ctx.globalCompositeOperation = 'difference';
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1



}

function drawTile(ctx, tile) {
    // tile.length = globalTileLength;
    const tileVerticesInfo = getTileVertices(tile);
    const bottomFace = tileVerticesInfo.bottom;
    const topFace = tileVerticesInfo.top;
    let xShift = width / 2;
    let yShift = height / 2 + tileHeight / 4;


    let ov1 = orthographicTransform(bottomFace[0]);
    let ov2 = orthographicTransform(bottomFace[1]);
    let ov3 = orthographicTransform(bottomFace[2]);
    let ov4 = orthographicTransform(bottomFace[3]);

    let ov5 = orthographicTransform(topFace[0]);
    let ov6 = orthographicTransform(topFace[1]);
    let ov7 = orthographicTransform(topFace[2]);
    let ov8 = orthographicTransform(topFace[3]);


    let initH = 45;
    let coeff = 0
    let grad1 = ctx.createLinearGradient(0, ov6.y + yShift - initH - 0 * coeff, 0, ov2.y + yShift - 0 * coeff)
    let grad2 = ctx.createLinearGradient(0, ov6.y + yShift - initH - 1 * coeff, 0, ov2.y + yShift - 1 * coeff)
    let grad3 = ctx.createLinearGradient(0, ov6.y + yShift - initH - 2 * coeff, 0, ov2.y + yShift - 2 * coeff)
    let startColorStop = 0;
    let endColorStop = 1;
    coeff = 0.25
    grad1.addColorStop(startColorStop, "white");
    grad1.addColorStop(endColorStop, "black");
    grad2.addColorStop(startColorStop + coeff, "white");
    grad2.addColorStop(endColorStop, "black");
    grad3.addColorStop(startColorStop + 2 * coeff, "white");
    grad3.addColorStop(endColorStop, "black");

    ctx.beginPath();
    // Top Face -> every tile will draw this
    for (let i = 0; i < bottomFace.length; i++) {
        const v = topFace[i];
        let orthoVertex = orthographicTransform(v);
        ctx.lineTo(orthoVertex.x + xShift, orthoVertex.y + yShift);
    }
    ctx.closePath();
    ctx.fillStyle = grad1;
    ctx.fill();
    ctx.strokeStyle = grad1;
    ctx.lineWidth = 1;
    ctx.stroke();


    if (tile.col === gridSize - 1 || tile.height + tile.offset > grid[tile.row][tile.col + 1].height + grid[tile.row][tile.col + 1].offset) {


        // Z dominateFace
        ctx.beginPath();
        ctx.lineTo(ov4.x + xShift, ov4.y + yShift);
        ctx.lineTo(ov8.x + xShift, ov8.y + yShift);
        ctx.lineTo(ov7.x + xShift, ov7.y + yShift);
        ctx.lineTo(ov3.x + xShift, ov3.y + yShift);
        ctx.closePath();
        // ctx.fillStyle = hexBrightnessIncrease(color, -0.5);
        ctx.fillStyle = grad2;
        ctx.strokeStyle = grad2;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
    }
    if (tile.row === gridSize - 1 || tile.height + tile.offset > grid[tile.row + 1][tile.col].height + grid[tile.row + 1][tile.col].offset) {


        //X dominateface;
        ctx.beginPath();
        ctx.lineTo(ov4.x + xShift, ov4.y + yShift);
        ctx.lineTo(ov8.x + xShift, ov8.y + yShift);
        ctx.lineTo(ov5.x + xShift, ov5.y + yShift);
        ctx.lineTo(ov1.x + xShift, ov1.y + yShift);

        ctx.closePath();
        ctx.fillStyle = grad3;
        ctx.strokeStyle = grad3;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fill();
    }

    // ctx.strokeStyle = "rgba(255,255,255,1)"
    // ctx.strokeText(tile.row + ":" + tile.col,
    //     ov8.x + xShift-8,
    //     ov8.y + yShift-tileLength/2+4);
    // ctx.strokeText(~~tile.position.x + ":"+ ~~tile.position.z,
    //     ov8.x + xShift-8,
    //     ov8.y + yShift-tileLength/2+4 +16);


}

function getTileVertices(tile) {
    const l = tileLength / 2;
    const pos = tile.position;
    const h = Math.max(tile.height + tile.offset - 2 * tileHeight / 5, 0);
    let bottomFace = [];
    let topFace = [];

    const v1 = {
        x: pos.x * tileLength + l,
        y: pos.y * tileLength,
        z: pos.z * tileLength - l
    }
    const v2 = {
        x: pos.x * tileLength - l,
        y: pos.y * tileLength,
        z: pos.z * tileLength - l
    }
    const v3 = {
        x: pos.x * tileLength - l,
        y: pos.y * tileLength,
        z: pos.z * tileLength + l
    }
    const v4 = {
        x: pos.x * tileLength + l,
        y: pos.y * tileLength,
        z: pos.z * tileLength + l
    }
    const v5 = {
        x: pos.x * tileLength + l,
        y: pos.y * tileLength - h,
        z: pos.z * tileLength - l
    }
    const v6 = {
        x: pos.x * tileLength - l,
        y: pos.y * tileLength - h,
        z: pos.z * tileLength - l
    }
    const v7 = {
        x: pos.x * tileLength - l,
        y: pos.y * tileLength - h,
        z: pos.z * tileLength + l
    }
    const v8 = {
        x: pos.x * tileLength + l,
        y: pos.y * tileLength - h,
        z: pos.z * tileLength + l
    }
    bottomFace.push(v1, v2, v3, v4);
    topFace.push(v5, v6, v7, v8);
    return {
        bottom: bottomFace,
        top: topFace,
        all: bottomFace.concat(topFace)
    }






}

function orthographicTransform(v) {
    const ax = v.x;
    const ay = v.y;
    const az = v.z;
    const r2 = Math.sqrt(2);
    const r3 = Math.sqrt(3);
    const r6 = Math.sqrt(6);
    const bx = (r3 * ax - r3 * az) / r6;
    const by = (ax + 2 * ay + az) / r6;
    const bz = (r2 * ax - r2 * ay + r2 * az) / r6;

    return vector(bx, by, bz);
}

function createGrid(size, tilePixelLength) {
    const half = Math.floor(size / 2);
    const grid = []
    for (let row = 0; row < size; row++) {
        let gridRow = []
        for (let col = 0; col < size; col++) {

            const xi = row // - half + 0.5;
                // const xi = 1;
            const x = xi //* tilePixelLength;
            const yi = col // - half + 0.5;
            const y = yi // * tilePixelLength;
            let pos = vector(x, 0, y);
            let t = tile(pos, tilePixelLength, (noise.perlin2(row / size * 2, col / size * 2) + 1) * tileHeight);
            t.row = row;
            t.col = col;
            // t.height = tileHeight
            gridRow.push(t);
        }

        grid.push(gridRow);
    }
    return grid;
}

function update(t) {
    elapsedTime += t * speed;
    resolveGridWave(elapsedTime);

    progressTheme(currentTheme, t);

}
async function gameLoop() {
    let repetition = 100
    const msPerFrame = 1000 / frameRate;
    while (repetition > 0) {

        let startTime = new Date().getTime();

        update(msPerFrame);
        draw(msPerFrame);

        let endTime = new Date().getTime();
        let elapsedTime = endTime - startTime;
        await sleep(msPerFrame - elapsedTime);

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function initializeGameState() {
    let optionElements = document.querySelectorAll(".option");

    let localStorageTheme = localStorage.getItem("current-theme");
    if(localStorageTheme){
        for (const theme of themes) {
            if(theme.type == localStorageTheme){
                currentTheme = theme;
                break;
            }
        }
    }

    for (let i = 0; i < optionElements.length; i++) {
        let currentOption = optionElements[i];
        let styleImg = currentOption.querySelector(".style-img");
        let styleStr = "linear-gradient( to bottom right, ";
        let themeInfo = themes[i];
        if(themeInfo.hasOwnProperty("presetColors")){

            for (const color of themeInfo.presetColors) {
                styleStr += "rgb(" + color.r + ", " + color.g + ", " + color.b + "), ";
            }
            styleImg.style.background = styleStr.slice(0, -2) + ")"
        }
        currentOption.querySelector(".name").innerHTML = themeInfo.type;
        if(currentTheme == themeInfo){
            currentOption.classList.add("current-theme");
        }
        currentOption.addEventListener("click", ()=>{
            currentTheme = themeInfo;
            document.querySelector(".option.current-theme").classList.remove("current-theme");
            currentOption.classList.add("current-theme");
            localStorage.setItem("current-theme", currentTheme.type);
        })

    }
    // document.onresize=resize;
    resize();
}

function getThemeColor(theme) {
    let progress = theme.t / theme.maxTime;
    let color = {
            r: theme.color.r + (theme.targetColor.r - theme.color.r) * progress,
            g: theme.color.g + (theme.targetColor.g - theme.color.g) * progress,
            b: theme.color.b + (theme.targetColor.b - theme.color.b) * progress
        }
        // console.log(color);
        // console.clear();
    return color;
}

function progressTheme(theme, t) {
    theme.t += t;
    if (theme.t >= theme.maxTime) {
        theme.t %= theme.maxTime;
        switchTheme(theme);
    }
}

function switchTheme(theme) {
    // theme.type = theme.type === 'light' ? 'dark' : 'light';
    theme.t = 0;
    theme.color = theme.targetColor;
    theme.targetColor = theme.nextColor();
    // theme.targetColor={
    //     r:Math.random()*255,
    //     g:Math.random()*255,
    //     b:Math.random()*255
    // }
    // if(theme.swaps%2===0){

    // }
    theme.swaps++;
}

function panRectangle() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
}
resize();
initializeGameState()
gameLoop();