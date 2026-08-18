<h1>Structure of Folder</h1>

```
/src
│   main.js 
│   READEME.md  
│     
├───controllers  
│       AIHandler.js  
│       Database.js  
│         
└───scenes  
        Boot.js  
        ChooseRole.js  
        GameEnd.js  
        MainMenu.js  
        PlayerAIDashboard.js  
        PlayerSubProblem.js  
        Preloader.js  
        RoleDB.js  
        RoleLog.js  
        RoleServerAdm.js  
        Waiting.js  
```

<h2>main.js</h2>
The main file of phaser project. The entry of the phaser javascript. **Game main configuration** should be written here.

<h2>controllers directory</h2>
Treat this folder as utilities of helper. Write all helpers logic here.

<h2>scenes directory</h2>
Except for Boot.js and Preload.js, all is scene configuration. Treat one file as one screen/page.

For Boot.js => sets up system settings and loads tiny assets needed for a loading screen
For Preload.js => displays that loading screen and fetches all heavy game files

<h3>DEVELOPMENT</h3>
Go to **Preloader.js**, change the target in the **transition method**. Change it to the **Scene Key**, see the scene key in the super method.
