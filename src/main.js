import { Boot } from './scenes/Boot';
import { ClickerGame } from '../.ignore/zClickerGame';
import { Game } from 'phaser';
import { GameOver } from '../.ignore/zGameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { PlayerAIDashboard } from './scenes/PlayerAIDashboard';
import { WIDTH, HEIGHT} from "./scenes/shared";
import * as Phaser from 'phaser';
import { RoleSelect } from './scenes/RoleSelect';
import { WaitingForGm } from './scenes/WaitingForGm';
import { PlayerMain } from './scenes/PlayerMain';
// import { createContext } from 'react';

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    dom: {
        createContainer: true
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        GameOver,
        PlayerAIDashboard,
        RoleSelect,
        WaitingForGm,
        PlayerMain
    ]
};

export default new Game(config);
