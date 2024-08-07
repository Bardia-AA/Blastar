﻿// developed by Bardia-AA (⌐■_■)

const kEmptyIterationMillis = 4;
const kPutSpriteMillis = 40;
const kMainLoopMillis = 150;
const kRocketsLoopMillis = 150;
const kStatusBeamLoopMillis = 220;

let SC = 0, SH;
let P, C;
let H, G;

function blastar() {
    fillTextStyle = "#BBBBBB";
    SH = 5; SC = 0;
    screen(2);
    print(Array(14).join(" ") + "ستاره انفجار");
    blastarTune();
}

function blastarTune() {
    play(3, 9, 50, "CECECDBABADACECEBDACDBDCEGG", blastarTune2);
}

function blastarTune2() {
    play(4, 9, 50, "CECECDBABADACECEBDACDBDCEGG", blastarTune3);
}

function blastarTune3() {
    play(3, 9, 50, "CECECDBABADACECEBDACDBDCEGG", blastarTune4);
}

function blastarTune4() {
    play(4, 9, 50, "CECECDBABADACECEBDACDBDCEGG", showAuthor);
}

function showAuthor() {
    screen(1, 2);
    locate(10, 10);
    print(" Bardia-AA ویرایش و توسعه توسط");
    window.setTimeout(promptForInstructions, 350 * kEmptyIterationMillis);
}

function promptForInstructions() {
    cls();
    locate(10, 5);
    print("             به بازی ستاره انفجار خوش آمدید");
    print("");
    locate(12, 5);
    print("        برای ادامه روی یک کلید بزنید ");
    inKey(maybeGiveInstructions);
}

function maybeGiveInstructions(keycode) {
    beep();
    startGame();
}

function startGame() {
    cls();
    loadSprites();
    mainProgram();
}

function loadSprites() {
    sprite = [
        document.getElementById("sprite0"),
        null,
        document.getElementById("sprite2"),
        document.getElementById("sprite3"),
        document.getElementById("sprite4"),
        document.getElementById("sprite5"),
        document.getElementById("sprite6")
    ];
    spriteBits = [
        [0x99, 0x99, 0x99, 0xe7, 0xc3, 0xc3, 0xc3, 0xc3],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x00, 0x42, 0xa5, 0x42, 0x00, 0x00, 0x00],
        [0x18, 0x42, 0xe7, 0xbd, 0x5a, 0x24, 0x3c, 0x66],
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
        [0x00, 0x10, 0x38, 0x7c, 0x7c, 0x38, 0x10, 0x00]
    ];
}

function mainProgram() {
    locate(0, 0);
    print("   امتیاز" + SC + "       تعداد سفینه " + SH);
    P = 120; C = 180;
    H = 30; G = 15;
    spriteOn();
    startLoop(mainLoop, kMainLoopMillis);
}

function mainLoop() {
    maybeMoveShip();
    putSprite(3, H, G);
    if (Math.abs(H - P) <= 1) {
        stopLoop();
        fireStatusBeam();
    } else {
        H += 3;
        if (H > 250) H = 10;
        if (F) {
            stopLoop();
            shootRockets();
        }
    }
}

function maybeMoveShip() {
    F = strig();
    D = stick();
    putSprite(3, H, G);
    switch (D) {
        case 1: C -= 4; break;
        case 2: P += 2; C -= 2; break;
        case 3: P += 4; break;
        case 4: P += 2; C += 2; break;
        case 5: C += 4; break;
        case 6: P -= 2; C += 2; break;
        case 7: P -= 4; break;
        case 8: P -= 2; C -= 2; break;
    }
    putSprite(0, P, C);
    if (C < 10) C = 10;
    if (C > 190) C = 180;
    if (P < 10) P = 10;
    if (P > 240) P = 240;
}

function shootRockets() {
    U = P; W = C - 5;
    playSoundAndEnterRocketsLoop();
}

function playSoundAndEnterRocketsLoop() {
    play(4, 6, 50, "D", playRocketSound2);
}

function playRocketSound2() {
    play(4, 6, 30, "F", enterRocketsLoop);
}

function enterRocketsLoop() {
    startLoop(rocketsLoop, kRocketsLoopMillis);
}

function rocketsLoop() {
    putSprite(3, H, G);
    H += 4;
    W -= 6;
    putSprite(2, U, W);
    if (H == P) {
        stopLoop();
        fireStatusBeam();
    } else {
        maybeMoveShip();
        spriteOn();
        onSpriteGoSub(destroyFreighter);
        if (F) {
            stopLoop();
            shootRockets();
        } else if (W < -10) {
            stopLoop();
            startLoop(mainLoop, kMainLoopMillis);
        }
    }
}

function destroyFreighter() {
    SC += 80;
    putSprite(4, H, G);
    setTimeout(newFreighter, 20 * kPutSpriteMillis);
}

function newFreighter() {
    cls();
    locate(3, 0);
    print("امتیاز" + SC + "            تعداد سفینه " + SH);
    spriteOff();
    G = 20 + Math.floor(Math.random() * 150);
    startLoop(mainLoop, kMainLoopMillis);
}

function fireStatusBeam() {
    OO = H; NN = G + 5;
    startLoop(statusBeamLoop, kStatusBeamLoopMillis);
}

function statusBeamLoop() {
    spriteOn();
    NN += 4;
    PI = P; maybeMoveShip(); P = PI;
    locate(15, 15); print("            در موقعیت پرتو");
    onSpriteGoSub(destroyShip);
    putSprite(5, OO, NN);
    play(2, 9, 15, "B", maybeEndStatusBeamLoop);
}

function maybeEndStatusBeamLoop() {
    if (NN > 205) {
        stopLoop();
        startLoop(mainLoop, kMainLoopMillis);
    }
}

function destroyShip() {
    SH -= 1;
    setTimeout(nextShip, 60 * kEmptyIterationMillis);
}

function nextShip() {
    cls();
    locate(0, 3);
    print("امتیاز " + SC + "             تعداد سفینه " + SH);
    putSprite(5, 128, 205);
    putSprite(6, P, C);
    G = 20 + Math.floor(170 * Math.random());
    H = 0;
    spriteOff();
    if (SH >= 0) {
        startLoop(mainLoop, kMainLoopMillis);
    } else {
        cls();
        // locate(10, 0);
        // print("                ستاره انفجار");
        locate(12, 0);
        print("             ناوگان منهدم شد");
        locate(14, 0);
        print("    را بفشارید Y اگر میخواهید دوباره تلاش کنید کلید ");
        inKey(maybeStartAnotherGame);
    }
}

function maybeStartAnotherGame(key) {
    if (key == 121 || key == 89) {
        blastar();
    } else {
        cls();
        locate(10, 0);
        print("                                بازی به اتمام رسید");
    }
}

function startLoop(loop, period) {
    function f() {
        try {
            loop();
        } catch (e) { }
    }
    currentInterval = setInterval(f, period);
}

function stopLoop() {
    clearInterval(currentInterval - 1);
    clearInterval(currentInterval);
}

let lastKeyDownMillis = 0;
let left = false;
let right = false;
let up = false;
let down = false;
let spacebar = false;

let ctx;
let fillTextStyle;
let cursorRow = 0, cursorCol = 0;
let textBuffers = [];
let keyPressCallback = null;

let sprite = [];
let spriteX = [-10, -10, -10, -10, -10, -10, -10, -10];
let spriteY = [-10, -10, -10, -10, -10, -10, -10, -10];
let spriteBits;
let spriteStatus = false;
let onSprite = null;

let currentInterval;

function initBasicEnvironment() {
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.font = "24px Commodore, Courier New";
    ctx.strokeStyle = "#BBBBBB";
    ctx.lineWidth = 3;
    ctx.fillRect(0, 0, 750, 600);
    for (let i = 0; i < 25; i++) textBuffers.push("");
    initSound();
    initEventHandling();
}

function putSprite(id, x, y) {
    spriteX[id] = x;
    spriteY[id] = y;
    redraw();
    if (spriteStatus) checkCollisions();
}

function redraw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 750, 600);
    ctx.fillStyle = fillTextStyle;

    for (let i = 0; i < textBuffers.length; i++) {
        ctx.fillText(textBuffers[i], 0, (i + 1) * 24);
    }

    for (let i = 0; i < sprite.length; i++) {
        if (sprite[i]) ctx.drawImage(sprite[i], spriteX[i] * 3, spriteY[i] * 3, 24, 24);
    }
}

function checkCollisions() {
    if (!onSprite) return;
    for (let i = 0; i < 4; i++) {
        if (spriteX[i] < 0 || spriteY[i] > 204) continue;
        const xi = spriteX[i];
        const yi = spriteY[i];
        for (let j = i + 1; j < 6; j++) {
            if (spriteX[j] < 0 || spriteY[j] > 204) continue;
            if (i === 0 && j === 2) continue;
            const xj = spriteX[j];
            const yj = spriteY[j];
            if (Math.abs(xi - xj) < 8 && Math.abs(yi - yj) < 8) {
                for (let y = Math.max(yi, yj); y < Math.min(yi + 8, yj + 8); y++) {
                    if (xj < xi) {
                        if ((spriteBits[i][y - yi] << (xi - xj)) & spriteBits[j][y - yj]) collision();
                    } else {
                        if ((spriteBits[j][y - yj] << (xj - xi)) & spriteBits[i][y - yi]) collision();
                    }
                }
            }
        }
    }
}

function collision() {
    stopLoop();
    const tmpOnSprite = onSprite;
    onSprite = null;
    tmpOnSprite();
    throw "Interrupt";
}

function spriteOn() {
    spriteStatus = true;
    checkCollisions();
    spriteX[2] = -10;
    spriteX[4] = -10;
    spriteX[5] = -10;
    spriteX[6] = -10;
}

function spriteOff() {
    onSprite = null;
    spriteStatus = false;
    spriteX = [-10, -10, -10, -10, -10, -10, -10, -10];
}

function onSpriteGoSub(sub) {
    onSprite = sub;
    if (spriteStatus) checkCollisions();
}

function locate(row, col) {
    cursorRow = row;
    cursorCol = col;
}

function print(txt) {
    const oldText = textBuffers[cursorRow];
    let pre = oldText.substr(0, cursorCol);
    pre += Array(cursorCol - pre.length + 1).join(" ");
    textBuffers[cursorRow] = pre + txt + oldText.substr(cursorCol + pre.length + txt.length);
    cursorRow++;
    cursorCol = 0;
    redraw();
}

function cls() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 750, 600);
    for (let i = 0; i < textBuffers.length; i++) textBuffers[i] = "";
    spriteX = [-10, -10, -10, -10, -10, -10, -10, -10];
    locate(0, 0);
}

function screen(a, b) {
    cls();
}

function initEventHandling() {
    window.addEventListener("keypress", keyPress, false);
    function neuter(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    function pressSpaceBar(e) {
        fakeKeyDown(32);
        fakeKeyUp(32);
        neuter(e);
    }
    function addKeyEvents(el, keyCode) {
        function genKeyDown(evt) {
            fakeKeyDown(keyCode);
            neuter(evt);
        }
        el.addEventListener("mousedown", genKeyDown, false);
        el.addEventListener("touchstart", genKeyDown, false);
        function genKeyUp(evt) {
            fakeKeyUp(keyCode);
            neuter(evt);
        }
        el.addEventListener("mouseup", genKeyUp, false);
        el.addEventListener("touchend", genKeyUp, false);
    }
    addKeyEvents(document.getElementById("left"), 37);
    addKeyEvents(document.getElementById("up"), 38);
    addKeyEvents(document.getElementById("right"), 39);
    addKeyEvents(document.getElementById("down"), 40);
    addKeyEvents(document.getElementById("yes"), 89);
    addKeyEvents(document.getElementById("no"), 78);
    addKeyEvents(document.getElementById("spcbar"), 32);

    const gamepad = document.getElementById("gamepad");
    gamepad.addEventListener("mousedown", neuter);
    gamepad.addEventListener("touchstart", neuter);
    gamepad.addEventListener("mouseup", neuter);
    gamepad.addEventListener("touchend", neuter);
}

function keyDown(evt) {
    lastKeyDownMillis = Date.now();
    switch (evt.keyCode) {
        case 37: left = true; break;
        case 39: right = true; break;
        case 40: down = true; break;
        case 38: up = true; break;
        case 32: spacebar = true; break;
        default: return;
    }
    evt.preventDefault();
}

const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiCodeIndex = 0;

function keyUp(evt) {
    if (konamiCodeIndex < konamiCode.length) {
        if (evt.keyCode !== konamiCode[konamiCodeIndex++]) {
            if (konamiCodeIndex === 3 && evt.keyCode === 38) {
                konamiCodeIndex = 2;
            } else {
                konamiCodeIndex = 0;
            }
        }
        if (konamiCodeIndex === konamiCode.length) {
            sprite[0] = document.getElementById("dragon");
        }
    }
    switch (evt.keyCode) {
        case 37: delayRelease(() => { left = false; }); break;
        case 39: delayRelease(() => { right = false; }); break;
        case 40: delayRelease(() => { down = false; }); break;
        case 38: delayRelease(() => { up = false; }); break;
        case 32: delayRelease(() => { spacebar = false; }); break;
        default: return;
    }
    evt.preventDefault();
}

function delayRelease(callback) {
    setTimeout(callback, Math.max(0, kMainLoopMillis - (Date.now() - lastKeyDownMillis)));
}

function fakeKeyDown(keyCode) {
    if (keyPressCallback === null) keyDown({ keyCode: keyCode, preventDefault: () => { } });
}

function fakeKeyUp(keyCode) {
    const evt = { keyCode: keyCode, preventDefault: () => { } };
    if (keyPressCallback === null) {
        keyUp(evt);
    } else {
        keyPress(evt);
    }
}

function strig() {
    return spacebar;
}

function stick() {
    const r = right && !left;
    const l = left && !right;
    const u = up && !down;
    const d = down && !up;
    if (r) {
        if (u) {
            return 2;
        } else if (d) {
            return 4;
        }
        return 3;
    } else if (l) {
        if (u) {
            return 8;
        } else if (d) {
            return 6;
        }
        return 7;
    } else if (u) {
        return 1;
    } else if (d) {
        return 5;
    }
    return 0;
}

function inKey(callback) {
    keyPressCallback = callback;
    window.removeEventListener("keydown", keyDown, false);
    window.removeEventListener("keyup", keyUp, false);
    up = down = right = left = spacebar = false;
}

function keyPress(evt) {
    if (keyPressCallback) {
        const tmpKeyPressCallback = keyPressCallback;
        keyPressCallback = null;
        window.addEventListener("keydown", keyDown, false);
        window.addEventListener("keyup", keyUp, false);
        tmpKeyPressCallback(evt.keyCode || evt.which);
        evt.preventDefault();
    }
}

let samplingRate = 22050;
const semiTones = {};
const speaker = [];
let currentSpeaker = 0;

function initSound() {
    semiTones["C"] = 0;
    semiTones["C#"] = 1;
    semiTones["D"] = 2;
    semiTones["E-"] = 3;
    semiTones["E"] = 4;
    semiTones["F"] = 5;
    semiTones["F#"] = 6;
    semiTones["G"] = 7;
    semiTones["G#"] = 8;
    semiTones["A"] = 9;
    semiTones["B-"] = 10;
    semiTones["B"] = 11;
    speaker[0] = document.getElementById("speaker0");
    speaker[1] = document.getElementById("speaker1");
    toggleMute(document.getElementById("muted"));
}

function toggleMute(muted) {
    speaker[0].muted = muted.checked;
    speaker[1].muted = muted.checked;
}

function encodeLong(value) {
    let enc = "";
    for (let i = 0; i < 4; ++i) {
        enc += String.fromCharCode(value % 256);
        value = Math.floor(value / 256);
    }
    return enc;
}

function wavHeader(n) {
    return ("RIFF" + encodeLong(36 + 2 * n) + "WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00" +
        encodeLong(samplingRate) + encodeLong(2 * samplingRate) + "\x02\x00\x10\x00data" +
        encodeLong(2 * n));
}

function encodeWave(wave) {
    const n = wave.length;
    let raw = wavHeader(n);
    for (let i = 0; i < n; ++i) {
        let sample = Math.round(wave[i] * 32767);
        if (sample < 0) sample += 1 << 16;
        raw += String.fromCharCode(sample % 256);
        raw += String.fromCharCode(Math.floor(sample / 256));
    }
    return "data:audio/wav;base64," + btoa(raw);
}

function addSoundWave(frequency, duration, amplitude, wave) {
    amplitude *= 0.25;
    const numSamples = Math.round(duration * samplingRate);
    const periodSamples = Math.round(samplingRate * 1.0 / frequency);
    for (let i = 0, ii = 0; i < numSamples; ++i, ++ii) {
        if (ii >= periodSamples) ii -= periodSamples;
        if (ii < periodSamples / 2) {
            wave.push(amplitude);
        } else {
            wave.push(-amplitude);
        }
    }
    return wave;
}

function addNote(o, v, l, note, wave) {
    const cFreq = 32.7 * Math.pow(2, o);
    const frequency = cFreq * Math.pow(Math.pow(2.0, 1 / 12), semiTones[note]);
    addSoundWave(frequency, (2.0 / l) * 7 / 8, v / 15, wave);
    return addSoundWave(frequency, (2.0 / l) * 1 / 8, 0, wave);
}

function playInSpeaker(wave) {
    speaker[currentSpeaker].src = encodeWave(wave);
    speaker[currentSpeaker].play();
    currentSpeaker = 1 - currentSpeaker;
}

function play(o, v, l, notes, callback) {
    const wave = [];
    for (let i = 0; i < notes.length; ++i) {
        addNote(o, v, l, notes[i], wave);
    }
    playInSpeaker(wave);
    window.setTimeout(callback, 1000 * wave.length / samplingRate);
}

function beep() {
    const wave = [];
    addSoundWave(800, 0.25, 9 / 15, wave);
    playInSpeaker(wave);
}

// developed by Bardia-AA (⌐■_■)