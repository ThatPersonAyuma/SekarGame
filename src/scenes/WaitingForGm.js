import { Scene } from 'phaser';
import { setupTimeText } from './shared';

export class WaitingForGm extends Scene
{
    constructor ()
    {
        super('WaitingForGm');
    }

    create ()
    {
        //  Get the current highscore from the registry
        // const score = this.registry.get('highscore');

        this.add.video(this.scale.width/2, this.scale.height/2, 'Matrix1')
            .setScale(1.5, 1.5)
            .play(true);

            
        this.add.image(this.scale.width/2, this.scale.height/2, 'WaitingForGm');
        setupTimeText(this);
            
        const myText = this.add.text(181, 399, "waiting for gm’s command before starting the game", { 
            font: '84px DreamMMA',
            color: '#FFFFFF',
            letterSpacing: 0.02,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 1561,
            wordWrap: {
                width: 1561
            },
            align: "center",
            
        })
        const gradient = myText.context.createLinearGradient(0, 0, 0, myText.height);

        // 3. Add your color stops matching linear-gradient(180deg, #FFFFFF 0%, #9BCAFF 100%)
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, '#9BCAFF');

        // 4. Assign the gradient to the text fill property
        myText.setFill(gradient);

        this.add.text(374, 696, "-- Click anywhere to start --", { 
            font: '68px NFS',
            color: '#FFFFFF',
            letterSpacing: 0.02,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            fixedWidth: 1174,
            wordWrap: {
                width: 1174
            },
            align: "center",
            
        })
        this.input.once('pointerdown', () => {
            this.scene.start('PlayerMain');
            // this.scene.start('ChoseRole.js');
        });
    }
}
