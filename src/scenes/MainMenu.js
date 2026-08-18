import { Scene } from 'phaser';
import { setupTimeText } from './shared';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        //  Get the current highscore from the registry
        // const score = this.registry.get('highscore');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.video(this.scale.width/2, this.scale.height/2, 'Matrix1')
            .setScale(1.5, 1.5)
            .play(true);

        this.add.image(this.scale.width/2, this.scale.height/2, 'LandingPage');
        setupTimeText(this);

        this.add.text(181, 454, "Infosec Day", {
            fontFamily: 'NFS',
            fontSize: '60px',
            padding: {
                left: 0,
                top: 0,
                right: 14,
                bottom: 0 
            },
            wordWrap: { 
                width: 896, // Wrap text when a line hits 300 pixels wide
            },
            fontStyle: 'normal',   // font-weight: 400 / Regular
            lineSpacing: -13,      // line-height: 85% (87px * 0.85 = ~74px, selisih: -13px)
            fill: '#FFFFFF'        // Sesuaikan warna teks
        });      // vertical-align: middle

        this.add.text(181, 512, "AI Cybersecurity Simulation", {
            fontFamily: 'NFS',
            fontSize: '87px',
            wordWrap: { 
                width: 896, // Wrap text when a line hits 300 pixels wide
            },
            fontStyle: 'normal',   // font-weight: 400 / Regular
            lineSpacing: -13,      // line-height: 85% (87px * 0.85 = ~74px, selisih: -13px)
            fill: '#C4EAFF'        // Sesuaikan warna teks
        });      // vertical-align: middle

        this.add.text(1379, 979, "CLICK TO START", { 
            font: '35px ContourGenerator',
            color: '#00EAFF',
        })


        this.input.once('pointerdown', () => {
            this.scene.start('RoleSelect');
            // this.scene.start('ChoseRole.js');
        });
    }
}
