# Oversized
##creates a preview  from oversized images


When you are working with professional camera equipment it is common that you encounter oversized picture resolutions that will cause rendering problems in a web conect.

To prevent this, the **OVersoized** package allows the dynamic creation of preview images.
In order to make use of it in a frontend, you have to browserify your project.


```html
	npm install oversized-images
```

To require it, call: 
 
```javascript
	var oversized = require("oversized-images");
```

Then you create an **oversized** object:

```javascript
	
	var reducer = new oversized({
	  		max: 1.4,
  			max_width: 1920,
  			max_height: 1080,
  			});
```

- **max** 			affects all the pictures that have a size greater than max [in MB]
- **max-width**   	the maximal width of your preview
- **max-height**   	the maximal height of your preview


To invoke the reduction process, call

```javascript
	reducer.check([files]);
```

The parameter **files** takes single files as well as an array of files.
Since the library uses **<a href = "https://github.com/kriskowal/q">Q</a> promises**, all the calls are chained.
By using a callback you can use it asynchronously.
   
So your call might look like this:   

```javascript
  
    function done(result) {
      console.log("processed " + result);
  };

var test = new Oversized({
  max: 1.4,
  max_width: 1920,
  max_height: 1080,
  callback: done,
  });

var a = test.check(["file1.jpg", "file2.jpg", "file3.jpg"]);
```   
   
The callback gets an array of files that matches the preview conditions.

