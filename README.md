# jQuery asTabs

The powerful jQuery plugin that creates a tab. <a href="http://amazingSurge.github.io/jquery-asTabs/">Project page and demos</a><br />
Download: <a href="https://github.com/amazingSurge/jquery-asTabs/archive/master.zip">jquery-asTabs-master.zip</a>

***

## Features

* **History support** — asTabs can handle browser's back and forward buttons
* **AJAXed asTabs support** — ajax load content support
* **Keyboard navigation support** — use `Arrow left/right` to navigate
* **Lightweight size** — 1 kb gzipped

## Dependencies
* <a href="http://jquery.com/" target="_blank">jQuery 1.83+</a>

## Usage

Import this libraries:
* jQuery
* jquery-asTabs.min.js

And CSS:
* jquery-asTabs.css - desirable if you have not yet connected one


Create base html element:
```html
<ul class="demo asTabs">
    <li>tab1</li>
    <li>tab2</li>
    <li>tab3</li>
</ul>
<div class="panes">
    <div>panes</div>
    <div>panle2</div>
    <div>panle3</div>
</div>
```

Initialize asTabs:
```javascript
$(".demo").asTabs({contentSelector: '.panes'});
```

Or initialize asTabs with custom settings:
```javascript
$(".demo").asTabs({
        namespace: 'asTabs',  // namespace for css class
        navSelector: null,
        contentSelector: '+',
        skin: null,         // set custom skin
        initialIndex: 0,    // set initial index when first open
        ajax: false,        // open ajax load function
        cached: false,      // if true, cach ajax load content after first loaded
        history: false,     // enable history or not
        keyboard: false,    // keyboard navigation support
        effect: false,      // set transition effect
        duration: 300,      // set transition duration time in millisecond
        event: 'click'      // change index use 'click' or 'mouseover'
});
```


## Settings

<table>
    <thead>
        <tr>
            <th>Property</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>namespace</td>
            <td>"asTabs"</td>
            <td>Optional property, set a namspace for css class, for example, we have <code>.asTabs_active</code> class for active effect, if namespace set to 'as-asTabs', then it will be <code>.as-asTabs_active</code></td>
        </tr>
        <tr>
            <td>contentSelector</td>
            <td>'+'</td>
            <td>Optional property, specify the content to asTabs</td>
        </tr>
        <tr>
            <td>skin</td>
            <td>null</td>
            <td>Optional property, set transition effect, it works after you load   specified skin file</td>
        </tr>
        <tr>
            <td>initialIndex</td>
            <td>0</td>
            <td>Optional property, set initial index when asTabs initilize</td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>false</td>
            <td>Optional property, if true, it will load content with ajax, the url attached in tab list element's <code>data-href</code> </td>
        </tr>
        <tr>
            <td>cached</td>
            <td>false</td>
            <td>Optional property, it works only when ajax is set to true, if true, asTabs will cach loaded content</td>
        </tr>
        <tr>
            <td>history</td>
            <td>false</td>
            <td>Optional property, if true, it will enable history function</td>
        </tr>
        <tr>
            <td>keyboard</td>
            <td>false</td>
            <td>Optional property, if true , keyboard navigation function will be enabled</td>
        </tr>
        <tr>
            <td>effect</td>
            <td>'none'</td>
            <td>Optional property, set transition effect</td>
        </tr>
        <tr>
            <td>duration</td>
            <td>300</td>
            <td>Optional property, set transition effect time in millisecond</td>
        </tr>
        <tr>
            <td>event</td>
            <td>'click'</td>
            <td>Optional property, the way to active asTabs index, optioal 'mouseover'</td>
        </tr>  
        <tr>
            <td>onInit</td>
            <td>null</td>
            <td>Optional property, callback, call when asTabs is initilized</td>
        </tr> 
        <tr>
            <td>onInit</td>
            <td>null</td>
            <td>Optional property, callback, call when tab is initilize</td>
        </tr>
        <tr>
            <td>onReady</td>
            <td>null</td>
            <td>Optional property, callback, call when tab is ready</td>
        </tr>
        <tr>
            <td>onActive</td>
            <td>null</td>
            <td>Optional property, callback, call when tab is actived</td>
        </tr>
    </tbody>
</table>

## Public methods

jquery asTabs has different methods , we can use it as below :
```javascript
// active index
$(".demo").asTabs("active", index);

// get all asTabs element
$(".demo").asTabs("getasTabs");

// get all panes element
$(".demo").asTabs("getPanes");

// get current index
$(".demo").asTabs("getIndex");

// get current pane element
$(".demo").asTabs("getCurrentPane");

// get current tab elemnt
$(".demo").asTabs("getCurrentTab");

// goto the next tab, the last will goto the first
$(".demo").asTabs("next");

// goto the prevous tab, the first will goto the last
$(".demo").asTabs("prev");

// disable the tabs
$(".demo").asTabs("disable");

// enable the tabs
$(".demo").asTabs("enable");

// add a new tab to the bottom of the tabs
$(".demo").asTabs("append", "title", "content");

// add a new tab after first tab
$(".demo").asTabs("add", "title", "content", 1);

// remove the second tab
$(".demo").asTabs("remove", 1);

// remove asTabs Dom element and unbound all events
$(".demo").asTabs("destroy");
```

## Event / Callback

* <code>asTabs::init</code>: trigger when asTabs initilize
* <code>asTabs::ready</code>:  trigger when asTabs is ready
* <code>asTabs::active</code>: trigger when asTabs is selected
* <code>asTabs::update</code>:  trigger when tab is changed

how to use event:
```javascript
$(document).on('asTabs::init', function(event,instance) {
    // instance means current asTabs instance 
    // some stuff
});
```

## Browser support
jquery-asTabs is verified to work in Internet Explorer 7+, Firefox 2+, Opera 9+, Google Chrome and Safari browsers. Should also work in many others.

Mobile browsers (like Opera mini, Chrome mobile, Safari mobile, Android browser and others) is also works.

## Author
[amazingSurge](http://amazingSurge.com)

## License
jQuery-asTabs plugin is released under the <a href="https://github.com/amazingSurge/jquery-asTabs/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.


