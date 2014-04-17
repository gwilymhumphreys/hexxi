# Hexxi v0.0.5
A HTML5 engine for creating hex based games

##Getting started
1. Download the

##Configuration

####Paths
Tell Hexxi where to find your own commands and systems with the `paths` property. These paths are added to Hexxi's
internal list of module paths and all are loaded on init().
```
Hexxi.configure({
  paths:
    commands: 'awesomegame/commands/'
    systems: 'awesomegame/systems/'
```

#####Systems
Hexxi provides a number of builtin systems (see below). With the `systems` property you can, per system
- Configure their individual options by providing an object (see below for system options)
- Replace the system with a class of your own by providing a class inheriting from System
- Replace the system with an instance of your own class
```
Hexxi.configure({
  paths:
    commands: 'awesomegame/commands/'
    systems: 'awesomegame/systems/'
  systems:
    # Builtin
    hex_grid:
      type: 'pointy'
      tile_size: 36
      rows: 7
      columns: 7
    # By class
    multiplayer: MyAwesomeMultiplayerSystem
    # By instance
    pathing: new MyPathingThing({some_options: 'yeah man'})
})
```


##Current status of various modules

#####API
Status: In progress
Extracting lib from prototype

#####Entities
The following are included in core
- board
- grid_tile
- unit ** to extract
- team ** to extract

#####Components
The following are included in core
Some pruning is needed
- views
  - view
  - circle
  - sprite
  - text
- animations
- clickable
- component
- hex_grid
- hex_position
- highlight
- hover_effects
- pathable
- position
- relations
- selectable
- tile
- unit ** to extract
- team ** to extract

#####Systems
The following are included in core
- action_queue
- animations
- command_queue
- hex_grid
- highlights
- hover_effects
- input
- multiplayer
- pathing
- renderer
- selectables
- teams ** to extract

#####Commands & Actions
Currently only movement is supported

#####Multiplayer
Status: In progress
Extending primus.io server side to support users
Extending client multiplayer component
Currently two clients can connect and have their moves mirrored.


