//shivani
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var milk;

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
washroomDog=loadImage("Images/Wash Room.png");
sleepingDog=loadImage("Images/Bed Room.png");
garden=loadImage("Images/Garden.png");
washroom=loadImage("Images/Wash Room.png");
bedroom=loadImage("Images/Bed Room.png");
milk=loadImage("images/milk.png");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
foodStock.set(20);
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  milkB=createSprite(60,300,10,10);
  milkB.addImage(milk);
  milkB.scale=0.1;
  /*
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
*/
}

function draw() {
  background("grey")
  foodObj.display();
   writeStock(foodS);
  
  if(foodS===0){
    dog.addImage(sadDog);
    milkB.visible=false;
  }
  else{
    dog.addImage(happyDog);
    milkB.visible=true;

  }
  if(gameState===1){
    dog.addImage(happyDog);
    dog.scale=0.175;
    dog.y=250;

  }
  if(gameState===2){
    dog.addImage(sadDog);
    dog.scale=0.175;
    dog.y=250;
    milkB.visible=false;
  }

  var bath=createButton("Bathe me");
  bath.position(300,130);
  if(bath.mousePressed(function(){
    gameState=3;
    database.ref('/').update({'gameState':gameState});
  }));
  if(gameState===3){
    dog.addImage(washroomDog);
    dog.scale=1;
    dog.y=250;
    milkB.visible=false;
  }

  var sleep=createButton("Go to sleep");
  sleep.position(300,130);
  if(sleep.mousePressed(function(){
    gameState=4;
    database.ref('/').update({'gameState':gameState});
  }));
  if(gameState===4){
    dog.addImage(sleepingDog);
    dog.y=250;
    milkB.visible=false;
  }
 
  /*
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }
 */
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();

}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}
function writeStock(x){
  database.ref('/').update({food:x});
}
