# jQuery tabs

The powerful jQuery plugin that creates a tab. <a href="http://amazingsurge.github.io/jquery-tabs">Project page and demos</a>

Download: <a href="https://github.com/amazingSurge/jquery-tabs/archive/master.zip">jquery-tabs-master.zip</a>

***

## Description
jQuery-tabs — Nice, comfortable and easily customizable tabs with skins support. Also support events and public methods, has flexible settings, can be completely altered with CSS.<br />
jQuery-tabs supports touch-devices (iPhone, iPad, etc.).<br />
jQuery-tabs distributed under <a href="https://github.com/amazingSurge/jquery-tabs/blob/master/LICENCE.GPL" target="_blank">GPL licence</a>.

## Dependencies
* <a href="http://jquery.com/" target="_blank">jQuery 1.83+</a>

## Using script

Import this libraries:
* jQuery
* jquery-tabs.min.js

And CSS:
* jquery-tabs.css - desirable if you have not yet connected one


Create base input element:
```html
<ul class="demo tabs">
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

Initialize slider:
```javascript
$(".demo").tabs({panes: '.panes'});
```

Or initialize slider with custom settings:
```javascript
$(".demo").tabs({
        namespace: 'tabs',  // 
        panes: '.panes',
        skin: null,         // set custom skin
        initialIndex: 0,    // set initial index when first open
        effect: 'fade',     // set transition effect
        ajax: false,        // open ajax load function
        cached: false,      // if true, cach ajax load content after first loaded
        history: false,     // open history state function
        keyboard: false,    // keyboard navigation
        event: 'click'      // change index use 'click' or 'mouseover'
});
```

the most important thing is you should set panes value to let plugin find his panes content




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
            <td>panes</td>
            <td>'.panes'</td>
            <td>compulsory property, specify the content to tabs</td>
        </tr>
        <tr>
            <td>namespace</td>
            <td>"tabs"</td>
            <td>Optional property, set a namspace for css class, for example, we have <code>.tabs_active</code> class for active effect, if namespace set to 'as-tabs', then it will be <code>.as-tabs_active</code></td>
        </tr>
        <tr>
            <td>skin</td>
            <td>null</td>
            <td>Optional property, set transition effect, it works after you load   specified skin file</td>
        </tr>
        <tr>
            <td>initialIndex</td>
            <td>0</td>
            <td>Optional property, set initial index when tabs initilize</td>
        </tr>
        <tr>
            <td>effect</td>
            <td>'none'</td>
            <td>Optional property, set transition effect, you can use <code>'fade'</code>, more effects are coming</td>
        </tr>
        <tr>
            <td>ajax</td>
            <td>false</td>
            <td>Optional property, if true, it will load content with ajax, the url attached in tab list element's <code>data-href</code> </td>
        </tr>
        <tr>
            <td>cached</td>
            <td>false</td>
            <td>Optional property, it works only when ajax is set to true, if true, tabs will cach loaded content</td>
        </tr>
        <tr>
            <td>history</td>
            <td>false</td>
            <td>Optional property, if true, use history state function</td>
        </tr>
        <tr>
            <td>keyboard</td>
            <td>false</td>
            <td>Optional property, if true , open keyboard navigation function</td>
        </tr>
        <tr>
            <td>event</td>
            <td>'click'</td>
            <td>Optional property, the way to active tabs index, optioal 'mouseover'</td>
        </tr>
        
    </tbody>
</table>

## Public methods

jquery tabs has different methods , we can use it as below :
```javascript
$(".demo").tabs("getTabs");
$(".demo").tabs("getPanes");
$(".demo").tabs("getIndex");
$(".demo").tabs("getCurrentPane");
$(".demo").tabs("getCurrentTab");
$(".demo").tabs("next");
$(".demo").tabs("prev");
$(".demo").tabs("destroy");
```

## event

* <code>tabs::init</code>: trigger when tabs initilize
* <code>tabs::active</code>: trigger when tabs is selected
* <code>tabs::afterActive</code>:  trigger after acitve

how to use event:
```javascript
$(document).on('tabs::init', function(event,instance) {
	// instance means the $.tabs instance 
    // some stuff
});
```

## Update history
* July 31, 2013 - update readme.md
