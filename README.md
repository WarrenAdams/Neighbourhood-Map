## Website Performance Optimization portfolio project

In project #4 of udacity's Frontend Nanodegree the task was to optimize a website that had many
performance issues. The goal was to achieve a PageSpeed score above 90 on the first page and get the second page
to run at 60fps.

### Getting started

1. Clone the repository

  ```bash
  $ git clone https://github.com/WarrenAdams/web-op

  ```

1. Run a local server for the project in the dist folder.

  ```bash
  $> cd /dist
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080

#### Modifications

The steps to improve the performance are:

* Minify the JavaScript and CSS.

  I accomplished this with the gulp task runners cssnano and uglify.

* Compressed the images.

  I used the gulp task runner imagemin to compress the size of the images.

* Loaded the Google fonts in the css file.

  I used `@import` to load the fonts in css so it wouldn't be render blocking.

* Inlined the most immediately-used CSS and allowed the rest to be downloaded using the normal process.

  I accomplished this with a gulp task runner gulp critical. The task runner takes the critical css and inlines it.

* Changes to main.js

Changes needed to be made to the updatePositions function which was called on every scroll event.
The first change that I made was to use a more specific query selector to access the DOM,so I changed
 `querySelectorAll` to `getElementsByClassName`. Also, the `phase` calculation that was being run in every
 iteration of the loop created the same five numbers. So I made a separate loop that handle that calculation and only
 ran five times.

before:

```javascript
var items = document.querySelectorAll('.mover');
 for (var i = 0; i < items.length; i++) {
   var phase = Math.sin((document.body.scrollTop / 1250) + (i % 5));
   items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
 }
```

after:

```javascript
var items = document.getElementsByClassName('mover');
var topOfPage = (document.body.scrollTop / 1250);
var sameNums = [];

for(var i = 0;i < 5;i++){
  sameNums.push(Math.sin(topOfPage + i));
}

for (var i = 0; i < items.length; i++) {
  var phase = sameNums[i % 5];
  items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
}

```

The `changePizzaSizes` function also needed to be fixed because it was causing the page to stutter every time
you used the change pizza size slider. I took all the DOM access and calculation out of loop and made that part separate so it was only done once every time the function was called.

before :

```javascript
function changePizzaSizes(size) {
    for (var i = 0; i < document.querySelectorAll(".randomPizzaContainer").length; i++) {
      var dx = determineDx(document.querySelectorAll(".randomPizzaContainer")[i], size);
      var newwidth = (document.querySelectorAll(".randomPizzaContainer")[i].offsetWidth + dx) + 'px';
      document.querySelectorAll(".randomPizzaContainer")[i].style.width = newwidth;
    }
  }
```

after:

```javascript
function changePizzaSizes(size) {

  var dx = determineDx(document.querySelector(".randomPizzaContainer"), size);
  var newwidth = (document.querySelector(".randomPizzaContainer").offsetWidth + dx) + 'px';
  var elements = document.querySelectorAll(".randomPizzaContainer");

  for (var i = elements.length; i--;) {
    elements[i].style.width = newwidth;
  }
};
```

I also moved a variable declaration out of a for loop so it wasn't being created every time
the loop ran.

Before:

```javascript

for (var i = 2; i < 100; i++) {
  var pizzasDiv = document.getElementById("randomPizzas");
  pizzasDiv.appendChild(pizzaElementGenerator(i));
}
```

After:

```javascript
var pizzasDiv = document.getElementById("randomPizzas");
for (var i = 2; i < 100; i++) {
  pizzasDiv.appendChild(pizzaElementGenerator(i));
}
```




### Results

The PageSpeed score for mobile was 94 and 96 for Desktop. The `pizza.html` site runs and a smooth 60fps.
