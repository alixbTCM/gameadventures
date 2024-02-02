# WorkAdventure Map Scripting starter kit for gaming and team building

This is a starter kit to help you build map for [WorkAdventure](https://workadventu.re) with pre-prepared scripts.

## Structure
* *maps*: All your map files
* *public*: Static files like PDFs
* *src*: Source files like scripts or PSDs. 
  * *modules*: Re-usable modules to help you build your scripts
  * *translations*: Translations files
  * *utils*: All pre-created functions to help you build your scripts
* *tilesets*: All the tilesets used in your maps
* *views*: All the html view to be included in your maps

NOTE : If you are going to create custom websites to embed in the map, please put it in the "views" directory.

**NOTE : If you want to have more information in one of those folders, you can find a specific README.md inside it.**

## Requirements

Node.js version >=16

## Installation

With npm installed (comes with [node](https://nodejs.org/en/)), run the following commands into a terminal in the root directory of this project:

```shell
npm install
npm run dev
```

## Test production map

You can test the optimized map as it will be in production:
```sh
npm run build
npm run preview
```

## Licenses

This project contains multiple licenses as follows:

* [Code license](./LICENSE.code) *(all files except those for other licenses)*
* [Map license](./LICENSE.map) *(`map.tmj` and the map visual as well)*
* [Assets license](./LICENSE.assets) *(the files inside the `src/assets/` folder)*

### About third party assets

If you add third party assets in your map, do not forget to:
1. Credit the author and license with the "tilesetCopyright" property present in the properties of each tilesets in the `map.jtmj` file
2. Add the license text in LICENSE.assets
