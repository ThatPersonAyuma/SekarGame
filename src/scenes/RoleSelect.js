import { Scene } from 'phaser';
import { setupTimeText } from './shared';

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
        this.input.once('pointerdown', () => {
            this.scene.start('WaitingForGm');
            // this.scene.start('ChoseRole.js');
        });
    }
}
