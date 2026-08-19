import { Scene } from 'phaser';
import { createButtonIcon, setupTimeText, WIDTH } from './shared';

export class PlayerMain extends Scene
{
    constructor ()
    {
        super('PlayerMain');
    }

    create ()
    {
        //  Get the current highscore from the registry
        // const score = this.registry.get('highscore');

        this.add.video(this.scale.width/2, this.scale.height/2, 'Matrix1')
            .setScale(1.5, 1.5)
            .play(true);

            
        this.add.image(this.scale.width/2, this.scale.height/2, 'PlayerMain');
        setupTimeText(this);

        createButtonIcon(this, 214, 460, "LogAdmin");
        this.add.text(340, 898, "LOG", { 
            font: '56px ContourGenerator',
            color: '#FFFFFF',
            // letterSpacing: 0.08,
            // lineSpacing:-8,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            // fixedWidth: 134,
            align: "center"
        });

        createButtonIcon(this, 757, 460, "DbAdmin");
        this.add.text(786, 905, "DATABASE", { 
            font: '51px ContourGenerator',
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

        createButtonIcon(this, 1320, 460, "ServerAdmin");
        this.add.text(1378, 905, "SERVER", { 
            font: '54px ContourGenerator',
            color: '#FFFFFF',
            letterSpacing: 0.08,
            lineSpacing:-8,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            align: "center"
        })

        createButton(this, this.scale.width/2-(780-736), 217+20);

    }
}

function createButton(obj,x, y){
    // 1. Buat Container di posisi (x, y)
    const btnWidth = 422;
    const btnHeight = 141;
    const borderWidth = 9;
    const bgColor = 0x12121e; // Warna background tombol
    
    const button = obj.add.container(x+btnHeight/2, y+btnHeight/2);

    // 2. Buat Graphics untuk Border Gradient
    const graphics = obj.add.graphics();

    // A. Gambar Gradient Border (Atas: #00B2EE, Bawah: #5053FF dengan alpha 0.988)
    graphics.fillGradientStyle(0x00B2EE, 0x00B2EE, 0x5053FF, 0x5053FF, 0.988, 0.988, 0.988, 0.988);
    graphics.fillRoundedRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight, 69);

    // B. Potong bagian dalam dengan Background (sehingga tersisa border 10px)
    graphics.fillStyle(bgColor, 1);
    graphics.fillRoundedRect(
        -btnWidth / 2 + borderWidth,
        -btnHeight / 2 + borderWidth,
        btnWidth - (borderWidth * 2),
        btnHeight - (borderWidth * 2),
        60
    );

    const myText = obj.add.text(-65, -44/2, "AI AGENT", { 
            font: '41px ContourGenerator',
            color: '#FFFFFF',
            // letterSpacing: 0.08,
            // lineSpacing:-8,
            padding: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0 
            },
            // fixedWidth: 134,
            align: "center"
        }).setFixedSize(229, 49);

    // 3. Tambahkan Icon SVG
    const icon = obj.add.image(-202+44, 0, "AIButton");
    // icon.setDisplaySize(281, 281); // Sesuaikan ukuran SVG jika perlu
    icon.setScale(0.136);
    // 5. Masukkan semua elemen ke dalam Container
    button.add([graphics, icon, myText]);

    // 6. Atur Hit Area & Interaktivitas
    button.setSize(btnWidth, btnHeight);
    button.setInteractive({ useHandCursor: true });

    // 7. Event Hover (Membesar sedikit menggunakan Tweens)
    button.on('pointerover', () => {
        obj.tweens.add({
            targets: button,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 150,
            ease: 'Power2'
        });
    });

    button.on('pointerout', () => {
        obj.tweens.add({
            targets: button,
            scaleX: 1.0,
            scaleY: 1.0,
            duration: 150,
            ease: 'Power2'
        });
    });
    // button.setInteractive(
    //     new Phaser.Geom.Rectangle(x, y, width, height),
    //     Phaser.Geom.Rectangle.Contains
    // );
}