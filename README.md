# jQuery accessible tabs using ARIA
===========================

__This is a work-in-progress!__
I am working on a rework to use this script as a UMD (Universal Module Definition - for mor information check this [link](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/ "What Is AMD, CommonJS, and UMD? by David Calhoun")) module.
Use at your own risk.
I haven't updated the demo yet but I am working on an example.
The script itself works perfectly fine, though.

You can find a presentation and demo page of the original code here: http://a11y.nicolas-hoffmann.net/tabs/

This simple script transforms this simple list of anchors to contents:

```html
<div class="tabs">
  <ul class="tablist">
    <li class="tablist-item">
      <a href="#id_first" id="label_id_first" class="tablist-link">1st tab</a>
    </li>
    <li class="tablist-item">
      <a href="#id_second" id="label_id_second" class="tablist-link">2nd tab</a>
    </li>
    <li class="tablist-item">
      <a href="#id_third" id="label_id_third" class="tablist-link">3rd tab</a>
    </li>
    <li class="tablist-item">
      <a href="#id_fourth" id="label_id_fourth" class="tablist-link">4th tab</a>
    </li>
  </ul>
  <div id="id_first" class="tabcontent">
   here the content of 1st tab
  </div>
  <div id="id_second" class="tabcontent">
   here the content of 2nd tab
  </div>
  <div id="id_third" class="tabcontent">
   here the content of 3rd tab
  </div>
  <div id="id_fourth" class="tabcontent">
   here the content of 4th tab
  </div>
</div>
```
into shiny accessible tabs by adding ARIA attributes.

Upon calling the init function you can specify class names of the elements and the script will use those instead of the default ones.
The default classes are:

```javascript
Tabs.init({
  tab_parent: '.tabs', // div
  tab_list: '.tablist', // ul
  tab_item: '.tablist-item', // li
  tab_link: '.tablist-link', // a
  tab_content: '.tabcontent', // div
  js_link_to_tab: '.js-link-to-tab' // link class
});
```

Keyboard navigation is supported, based on ARIA DP (http://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel && http://www.oaa-accessibility.org/examplep/tabpanel1/):

__If you focus in the tabs "buttons"__
- use Up/Left to see previous tab,
- use Down/Right to see next tab
- Use "Home" to see first tab (wherever you are in tab buttons)
- Use "End" to see last tab (wherever you are in tab buttons)

__If you focus in a tab content__
- use Ctrl Up/left to Set focus on the tab button for the currently displayed tab
- use Ctrl PageUp to Set focus on the previous tab button for the currently displayed tab
- use Ctrl PageDown to Set focus on the next tab button for the currently displayed tab

__Warning__: Ctrl+PageUp/PageDown combination could activate for some browsers a switch of browser tabs. Nothing to do for this, as far as I know (if you have a solution, let me know).

## Features

If there is a fragment in URL, the script detects if it is **on** or **in** a tab content, and select the tab automatically.

You can make a link to a tab (which opens it). ```<a href="#link-to-tab-content" class="js-link-to-tab">link to tab</a>```

Fragment is added to URL if you select a tab.

## Requirements

- jQuery (others smaller libraries should be ok, but didn't test for the moment)
- a small piece of CSS `` .js-tabcontent[aria-hidden=true] { display: none; } ``
- respect the classes given above, and the convention a href="#**id_fourth**" id="label&#95;**id_fourth**" (will improve later)
- Use attribute data-hx="hx" (ex data-hx="h2" if your tab system is after a h1) to specify Hx structure in your tabs if they don't have one in tab content (will be added, and can be hidden throught a class invisible) OR
- Indicate the hx structure contained in your tab contents, using the attribute data-existing-hx="h2"

This jQuery plugin __doesn't style tabs__ (except ``.js-tabcontent[aria-hidden=true]`` of course), styles can be added using other classes.

A demo page is here with full docs and examples: http://a11y.nicolas-hoffmann.net/tabs/

It can be included for one, two tab systems or more in a page.

Enjoy.

<img src="http://www.nicolas-hoffmann.net/bordel/chuck-norris1.jpg" alt="Chuck Norris approved this" />

P.S: this plugin is in [MIT license](https://github.com/nico3333fr/jquery-accessible-tabs-aria/blob/master/LICENSE). It couldn't be done without the precious help of @ScreenFeedFr, @sophieschuermans, @goetsu and @romaingervois.
