var s;
var scl = 20;

var food;
var score = 0;

var a = 255;
var b = 0;
var c = 0;

var FirstGame = true;
var changeColor = false;

if (performance.navigation.type == performance.navigation.TYPE_RELOAD)
    FirstGame = false;

function generateRandomColor() {

    var letters = '0123456789ABCDEF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function generateRandomColor2() {

    var letters = '0123456789ABCDEGF';
    var color = '#';

    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function setup() {

    createCanvas(600, 600, P2D);

    s = new Snake();
    frameRate(10);

    pickLocation();

    if (typeof (Storage) !== "undefined") {

        if (FirstGame)
            sessionStorage.setItem(Math.random().toString(36).substring(2), "You Started A New Game At: " + Date());

        else
            sessionStorage.setItem(Math.random().toString(36).substring(2), "You Started Another Game At: " + Date());
    }
}

function pickLocation() {

    var cols = floor(width / scl);
    var rows = floor(height / scl);

    food = createVector(floor(random(cols)), floor(random(rows)));

    food.mult(scl);
}

function draw() {

    background(51);

    if (changeColor)
        background(a * 2, b * 2, c * 2);

    s.death();
    s.update();
    s.show();

    if (s.eat(food))
        pickLocation();

    document.getElementById("score").innerHTML = "Score: " + score;

    fill(255, 0, 100)

    if (changeColor)
        fill(a / 2, b / 2, c / 2);

    rect(food.x, food.y, scl, scl);
}

function keyPressed() {

    if (keyCode === UP_ARROW || key === 'w')
        s.dir(0, -1);

    else if (keyCode === DOWN_ARROW || key === 's')
        s.dir(0, 1);

    else if (keyCode === RIGHT_ARROW || key === 'd')
        s.dir(1, 0);

    else if (keyCode === LEFT_ARROW || key === 'a')
        s.dir(-1, 0);

    if (key === 'u') {
        window.localStorage.clear();
    }

    if (key === 'v')
        changeColor = true;

    if (key === 'b' && changeColor)
        changeColor = false;
}

function Snake() {

    this.x = 0;
    this.y = 0;

    this.xSpeed = 1;
    this.ySpeed = 0;

    this.total = 0;
    this.tail = [];

    this.death = function () {

        for (var i = 0; i < this.tail.length; i++) {

            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);

            if (d < 1) {

                if (typeof (Storage) !== "undefined")
                    localStorage.setItem(Math.random().toString(36).substring(2), "Score: " + score);

                    location.reload();
                }
            }
        }

        this.eat = function (pos) {

            var d = dist(this.x, this.y, pos.x, pos.y)

            if (d < 1) {

                this.total++;
                score++;
                return true;
            }

            else
                return false;
        }

        this.dir = function (x, y) {

            this.xSpeed = x;
            this.ySpeed = y;
        }

        this.update = function () {

            if (this.total === this.tail.length) {

                for (var i = 0; i < this.tail.length - 1; i++)
                    this.tail[i] = this.tail[i + 1];
            }

            this.tail[this.total - 1] = createVector(this.x, this.y);

            this.x = this.x + this.xSpeed * scl;
            this.y = this.y + this.ySpeed * scl;

            this.x = constrain(this.x, 0, width - scl);
            this.y = constrain(this.y, 0, height - scl);
        }

        this.show = function () {

            var randomColor = generateRandomColor();
            var randomColor2 = generateRandomColor2();

            fill(255);

            if (changeColor) {

                a = random(300);
                b = random(300);
                c = random(300);

                fill(a, b, c);

                document.body.style.background = randomColor;

                var h1Elements = document.getElementsByTagName("h1");

                for (var i = 0; i < h1Elements.length; i++) {
                    h1Elements[i].style.color = randomColor2;
                }

                var pElements = document.getElementsByTagName("p");

                for (var i = 0; i < pElements.length; i++) {
                    pElements[i].style.color = randomColor2;
                }
            }

            for (var i = 0; i < this.tail.length; i++)
                rect(this.tail[i].x, this.tail[i].y, scl, scl);

            rect(this.x, this.y, scl, scl);
        }
    }
