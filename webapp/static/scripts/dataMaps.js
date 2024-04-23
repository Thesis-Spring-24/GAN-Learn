
//Flower for level 1 training
var flowerLevel1 = document.createElement('img');
flowerLevel1.src = '/static/assets/f-l-1.png';

//Generated images for flower level 1
var fl1g1 = document.createElement('img');
fl1g1.src = '/static/assets/f-l-1-g-1.png';

var fl1g2 = document.createElement('img');
fl1g2.src = '/static/assets/f-l-1-g-2.png';

//List for generated flowers on level 1
var flowerLevel1Generated = [fl1g1, fl1g2];

//Create map
var imageMap = new Map();

imageMap.set(flowerLevel1, [flowerLevel1Generated]);

//get flowerLevel1 image

