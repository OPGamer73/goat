const uw = require("you-win")
const { Phone, World, Sprite, Text, Polygon, Rect } = uw

// Load everything we need
await uw.begin()

// Make the world
var world = new World()
world.title = ""
world.background = "lightblue"

world.width = 415
world.height = 460
var player = new Sprite()
player.costume = "🦆"
player.scale = 3.0
player.opacity = 1
player.angle = 0
player.flipped = false
player.posX = uw.randomInt(50, world.width - 50)
player.posY = uw.randomInt(100, world.height)

function addcloud (){

var cloud = new Sprite
cloud.costume = "⛅"
cloud.opacity = 1
cloud.angle = 0
cloud.scale = 3
cloud.flipped = false
cloud.posX = uw.randomInt(0, world.width)
cloud.posY = uw.randomInt(0, world.height)
}
var cloudInterval = setInterval(addcloud, uw.randomInt(1000, 5000))

// uw.loadSound('baah', '')


var touchedEnemy = false
var bounced = false
function addbomb() {
  var enemy = new Sprite()
  enemy.costume = "💣"
  enemy.scale = 0.1
  enemy.posX = uw.randomInt(0, world.width)
  enemy.posY = uw.randomInt(0, world.height)
  function explode() {
    enemy.costume = "💥"
    enemy.scale = 2
    enemy.angle = 1
    exploded = true
  }


  var goingRight = true
  var angle = 0
  var exploded = false
  enemy.forever(() => {
    if (exploded == false) {
      enemy.angle = angle
      if (goingRight == true) {
        angle += 5
      } else {
        angle -= 5
      }
      if (angle == 45) {
        goingRight = false
      }
      if (angle == -135) {
        goingRight = true
      }
    }
    if (enemy.scale < 1) {
      enemy.scale += 0.01
    }
    if (enemy.isTouching(player) && enemy.scale >= 1) {
      touchedEnemy = true
      explode()
    }
  })
  setTimeout(function () {
    explode()
    setTimeout(function () {
      enemy.destroy()
    }, 1000)
  }, 5000)
}
var bombInterval = setInterval(addbomb, uw.randomInt(2000, 10000))
var score = 0
var scoreLabel = new Text()
var gameover = new Text()
//var debugText = new Text()
//debugText.posY = 390
//debugText.text = "debug"
var speedY = 0
var speedX = -2
var goat = new Text()
goat.text = "duck"

function addTornado() {
  //debugText.text = "tornado"
  var tornado = new Sprite()

  // tornado.costume = "🌪️"
   tornado.costume = "🌀"
  tornado.posY = world.height / 2
  tornado.posX = world.width
  tornado.forever(() => {
    tornado.posY = 230
    tornado.posX -= 10
    if (tornado.isTouching(player)) {
      speedY = uw.randomInt(1, 5)
speedX = uw.randomInt(0.1, 10)
    }
  })
  }

var tornadospawn = setInterval(addTornado, uw.randomInt(1000, 3000) )

function addbirb() {
  var birb = new Sprite()
  birb.costume = "🦅"
  birb.posY = world.height
  birb.posX = world.width
  birb.forever(() => {
    birb.posY -= 10
    birb.posX -= 10
    if (birb.isTouching(player)) {
      touchedEnemy = true
    }
  })
}

var birbInterval = setInterval(addbirb, uw.randomInt(1000, 5000))
player.forever(() => {
  if (player.left <= 0) {
    score += 1
    player.flipped = true
    if (score > 0) {
      scoreLabel.text = "score: " + score
      goat.text = ""
    }
    speedX = -speedX
    player.left = 0
  }

  player.posX += speedX
  player.posY += speedY // move the player

  speedY -= 0.2 // fall down because of gravity
  if (player.right > world.width) {
    speedX = -speedX
    player.right = world.width
    score += 1
    goat.text = ""
    player.flipped = false
    scoreLabel.text = "score: " + score
  }
  if (player.top > world.height) {
    speedY = -speedY
    player.top = world.height
  }
  if (player.bottom <= 0 || touchedEnemy == true) {
    goat.text = ""
    var highscore = localStorage.getItem("HighScore")
    if (highscore == null) {
      highscore = 0
    }
    if (score > highscore) {
      highscore = score
      localStorage.setItem("HighScore", score)
    }
    scoreLabel.text = ""
    gameover.text = "High Score: " + highscore
    clearInterval(bombInterval)
    clearInterval(birbInterval)
    clearInterval(tornadospawn)
    clearInterval(cloudInterval)
    var button = new Rect()
    button.width = 150
    button.height = 40
    button.fill = "white"
    button.outline = "black"
    button.thickness = 4
    button.posY = 190
    button.onTap((e) => {
      location.reload()
    })
    var reload = new Text()
    reload.text = "restart"
    reload.posY = 188
    return false
  }
})
world.onTap((e) => {
  speedY += 15 // jump
})
