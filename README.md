# Electron K2 Content Editors Tools application

__Electron GUI desktop application__ for Content Editors team in _[K2 Internet S.A. Digital Agency](https://www.k2.pl/)_.

Modules:
* "Files Names Changer"
* "Images Downloader"
* "Screen Shooter"

Used in _[K2 Digital Agency](https://www.k2.pl/)_ in Content Editors team to simplify their job :-)

Created by __[Michał Milanowski](https://www.linkedin.com/in/michalmilanowski/)__.

## Functions _(all of functions are easy to use because of GUI)_:

### "Files Names Changer"
* remove polish special diacritics from file name
* remove whitespaces from file name

### "Images Downloader"
* download images from URLs list in ```.txt``` file
* compress this images

Example ```.txt``` file __(URLs line by line)__:
```
http://www.examplesite.com/test/flowers.jpg
http://www.anotherexamplesite.pl/test2/people.png
```

### "Screen Shooter"
* make website screenshots automatically from ```.txt``` file with __list of URLs__
* save screenshots as __images__
* make __PDF__ files from images
* merge all of PDFs into __one PDF file__
* make ```.zip``` archive with all screenshots
* copy final ```.zip``` archive to remote directory
* catching errors and presenting it in GUI
* __extensive console messages__
* a lot of __[PhantomJS](http://phantomjs.org/)__ config that allow you to:    
    - change viewport size (make screenshots mobile version of website);    
    - change CSS before take screenshots;    
    - run JS scripts before screenshots;    
    - set timeouts;    
    - change userAgent    

    and so much more (cookies, shot size, change quality etc.)
* more examples of __[PhantomJS](http://phantomjs.org/)__ config are in ```/webshot_lib/examples/``` directory

Example ```.txt``` file with URLs __(URLs line by line)__:
```
http://www.onet.pl
http://www.wp.pl
http://www.examplesite.com
http://www.anotherexamplesite.pl
```

## How to start?

1. Install dependencies (you can also use [yarn](https://yarnpkg.com/lang/en/))
```bash
$ npm install
```

2. Run app
```bash
$ npm start
```

3. You can also build __standalone Electron version of app__ (for different OS, more info [here](https://github.com/electron-userland/electron-packager)) 
```bash
$ electron-packager .
```
