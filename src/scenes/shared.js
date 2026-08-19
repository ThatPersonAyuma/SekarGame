export const HEIGHT = 1080
export const WIDTH = 1920

export function setupTimeText(obj){
    obj.updateTimer = function() {
        const totalSeconds = obj.registry.get('totalSeconds')+1;
        obj.registry.set('totalSeconds', totalSeconds);

        obj.timerText.setText(calculateTime(totalSeconds));
    }
    var totalSeconds = 0;
    if (!obj.registry.has('totalSeconds')){
        obj.registry.set('totalSeconds', 0);
    }else{
        totalSeconds = obj.registry.get('totalSeconds');
    }
    obj.timerText = obj.add.text(1340, 177, calculateTime(totalSeconds), { 
        font: "124px NFS",
    }).setPadding(0, 0, 36, 0);
    obj.time.addEvent({
        delay: 1000,
        callback: obj.updateTimer,
        callbackScope: obj,
        loop: true
    });
    // obj.add.image(obj.scale.width/2, obj.scale.height/2, 'MainPageTopLayer');
}
function calculateTime(totalSeconds){
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    
    let minStr = minutes < 10 ? "0" + minutes : minutes;
    let secStr = seconds < 10 ? "0" + seconds : seconds;
    return `${minStr}:${secStr}`;
}

export function createButtonIcon(obj, x, y, iconName){
    // 1. Buat Container di posisi (x, y)
    const btnWidth = 367;
    const btnHeight = 367;
    const borderWidth = 10;
    const bgColor = 0x12121e; // Warna background tombol
    
    const button = obj.add.container(x+btnHeight/2, y+btnHeight/2);

    // 2. Buat Graphics untuk Border Gradient & Segitiga
    const graphics = obj.add.graphics();

    // A. Gambar Gradient Border (Atas: #00B2EE, Bawah: #5053FF dengan alpha 0.988)
    graphics.fillGradientStyle(0x00B2EE, 0x00B2EE, 0x5053FF, 0x5053FF, 0.988, 0.988, 0.988, 0.988);
    graphics.fillRect(-btnWidth / 2, -btnHeight / 2, btnWidth, btnHeight);

    // B. Potong bagian dalam dengan Background (sehingga tersisa border 10px)
    graphics.fillStyle(bgColor, 1);
    graphics.fillRect(
        -btnWidth / 2 + borderWidth,
        -btnHeight / 2 + borderWidth,
        btnWidth - (borderWidth * 2),
        btnHeight - (borderWidth * 2)
    );

    // C. Gambar Segitiga di Sudut Pojok Kiri Atas
    const cornerX = -btnWidth / 2 + 2*borderWidth;
    const cornerY = -btnHeight / 2 + 2*borderWidth;
    const triangleSize = 61;

    graphics.fillStyle(0xFFFFFF, 1);
    graphics.beginPath();
    graphics.moveTo(cornerX, cornerY);                       // Titik sudut atas-kiri
    graphics.lineTo(cornerX + triangleSize, cornerY);        // Garis ke kanan
    graphics.lineTo(cornerX, cornerY + triangleSize);        // Garis ke bawah
    graphics.closePath();
    graphics.fillPath();

    // 3. Tambahkan Icon SVG
    const icon = obj.add.image(0, 0, iconName);
    // icon.setDisplaySize(281, 281); // Sesuaikan ukuran SVG jika perlu

    // 5. Masukkan semua elemen ke dalam Container
    button.add([graphics, icon]);

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
}