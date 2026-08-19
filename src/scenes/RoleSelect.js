import { Scene } from 'phaser';
import { createButtonIcon, setupTimeText } from './shared';

export class RoleSelect extends Scene
{
    constructor ()
    {
        super('RoleSelect');
    }

    create ()
    {
        //  Get the current highscore from the registry
        // const score = this.registry.get('highscore');

        this.add.video(this.scale.width/2, this.scale.height/2, 'Matrix1')
            .setScale(1.5, 1.5)
            .play(true);

            
        this.add.image(this.scale.width/2, this.scale.height/2, 'RoleSelect');
        setupTimeText(this);
            
        this.add.text(107, 247, "PILIH ROLE", { 
            font: '65px NFS',
            color: '#FFFFFF',
            letterSpacing: 0.07,
            padding: {
                left: 0,
                top: 0,
                right: 14,
                bottom: 0 
            },
            fixedWidth: 497,
            align: "center"
        })

        createButtonIcon(this, 277, 387, "LogAdmin");

        this.add.text(281, 799, "ROLE A", { 
            font: '50px Xirod',
            color: '#FFFFFF',
            letterSpacing: 0.08,
            lineSpacing:-8,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 367,
            align: "center"
        });
        this.add.text(281, 851, "LOG ADMIN", { 
            font: '33px Xirod',
            color: '#FFFFFF',
            letterSpacing: 0.08,
            lineSpacing:-33*0.15,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 367,
            align: "center"
        });

        createButtonIcon(this, 776, 387, "DbAdmin");
        this.add.text(799, 799, "ROLE B", { 
            font: '50px Xirod',
            color: '#FFFFFF',
            letterSpacing: 0.08,
            lineSpacing:-8,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 367,
            align: "center"
        })
        this.add.text(799, 850, "DATABASE ADMIN", { 
            font: '33px Xirod',
            color: '#FFFFFF',
            letterSpacing: 0.08,
            lineSpacing:-33*0.15,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 367,
            wordWrap:{
                width: 367
            },
            align: "center"
        })

        createButtonIcon(this, 1275, 387, "ServerAdmin");
        this.add.text(1279, 799, "ROLE C", { 
            font: '50px Xirod',
            color: '#FFFFFF',
            letterSpacing: 0.08,
            lineSpacing:-8,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 367,
            align: "center"
        })
        this.add.text(1279, 851, "SERVER ADMIN", { 
            font: '33px Xirod',
            color: '#FFFFFF',
            letterSpacing: 0.08,
            lineSpacing:-33*0.15,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 367,
            wordWrap:{
                width: 367
            },
            align: "center"
        })

        this.input.once('pointerdown', () => {
            this.scene.start('WaitingForGm');
            // this.scene.start('ChoseRole.js');
        });
    }
}
