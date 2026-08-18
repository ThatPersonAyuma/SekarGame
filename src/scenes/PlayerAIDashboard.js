import { Scene } from 'phaser';

export class PlayerAIDashboard extends Scene
{
    constructor ()
    {
        super('PlayerAIDashboard');
        this.chatMessages = [];
        this.currentY = 20; // Offset vertikal pesan di dalam kontainer
    }

    init ()
    {
        this.createRoundedAvatarTexture('ai-avatar', 0x4F46E5, 'AI');
        this.createRoundedAvatarTexture('user-avatar', 0x10B981, 'YOU');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        const chatAreaHeight = height - 80; // Area obrolan di atas bar input

        // 1. KONTANER & MASK CHAT (Scrollable Zone)
        this.chatContainer = this.add.container(0, 0);

        // Buat Masking agar pesan tidak menembus area input/header
        const maskGraphics = this.make.graphics();
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillRect(0, 0, width, chatAreaHeight);
        const chatMask = maskGraphics.createGeometryMask();
        this.chatContainer.setMask(chatMask);

        // Fitur Scroll Menggunakan Mouse Wheel
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.chatContainer.y -= deltaY * 0.5;
            this.clampScroll(chatAreaHeight);
        });

        // 2. AREA INPUT TEKS & TOMBOL KIRIM (DOM Element)
        const inputFormHtml = `
            <div style="display: flex; gap: 8px; width: ${width - 40}px; background: #1e1e2e; padding: 8px; border-radius: 8px;">
                <input type="text" id="chat-input" placeholder="Tulis pesan..." 
                       style="flex: 1; padding: 10px; border: none; border-radius: 4px; outline: none; background: #2d2d3d; color: #fff; font-size: 14px;">
                <button id="send-btn" style="padding: 10px 16px; border: none; border-radius: 4px; background: #6366f1; color: white; cursor: pointer; font-weight: bold;">Kirim</button>
            </div>
        `;

        const domElement = this.add.dom(width / 2, height - 40).createFromHTML(inputFormHtml);
        
        const inputElement = domElement.getChildByID('chat-input');
        const sendBtn = domElement.getChildByID('send-btn');

        const sendMessage = () => {
            const text = inputElement.value.trim();
            if (text !== '') {
                this.addMessage('user', text);
                inputElement.value = '';

                // Simulasi Balasan AI secara otomatis
                this.time.delayedCall(800, () => {
                    this.addMessage('ai', `Ini adalah balasan otomatis AI untuk: "${text}"`);
                });
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Contoh Pesan Awal
        this.addMessage('ai', 'Halo! Ada yang bisa saya bantu hari ini?');
    }

    // Dynamic Generator untuk Avatar Lingkaran
    createRoundedAvatarTexture(key, color, label) {
        const size = 40;
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(color, 1);
        graphics.fillCircle(size / 2, size / 2, size / 2);
        graphics.generateTexture(key, size, size);

        // Tambahkan label teks di tengah avatar
        const txt = this.make.text({
            x: size / 2, y: size / 2, text: label,
            style: { font: 'bold 10px Arial', fill: '#ffffff' },
            add: false
        }).setOrigin(0.5);
        
        const renderTexture = this.add.renderTexture(0, 0, size, size);
        renderTexture.draw(graphics, 0, 0);
        renderTexture.draw(txt, size / 2, size / 2);
        renderTexture.saveTexture(key);
        renderTexture.destroy();
    }

    // Fungsi Menambahkan Pesan ke Chat Container
    addMessage(sender, text) {
        const isUser = sender === 'user';
        const screenWidth = this.scale.width;
        const padding = 12;
        const maxBubbleWidth = 260;
        const avatarSize = 40;

        // Bounding Box Teks
        const msgText = this.add.text(0, 0, text, {
            font: '14px Arial',
            fill: '#ffffff',
            wordWrap: { width: maxBubbleWidth - (padding * 2) }
        });

        const bubbleWidth = msgText.width + (padding * 2);
        const bubbleHeight = msgText.height + (padding * 2);

        // Hitung Posisi (Kiri untuk AI, Kanan untuk User)
        const avatarX = isUser ? screenWidth - 30 : 30;
        const bubbleX = isUser ? avatarX - (avatarSize / 2) - 10 - bubbleWidth : avatarX + (avatarSize / 2) + 10;
        const bubbleColor = isUser ? 0x10B981 : 0x374151;

        // Avatar Image
        const avatar = this.add.image(avatarX, this.currentY + (avatarSize / 2), isUser ? 'user-avatar' : 'ai-avatar');

        // Gelembung Chat (Background)
        const bubble = this.add.graphics();
        bubble.fillStyle(bubbleColor, 1);
        bubble.fillRoundedRect(bubbleX, this.currentY, bubbleWidth, bubbleHeight, 10);

        // Posisikan Teks di dalam Gelembung
        msgText.setPosition(bubbleX + padding, this.currentY + padding);

        // Masukkan elemen ke dalam Chat Container
        this.chatContainer.add([avatar, bubble, msgText]);

        // Perbarui tinggi vertikal pesan selanjutnya
        this.currentY += Math.max(bubbleHeight, avatarSize) + 15;

        // Auto Scroll ke Paling Bawah saat ada pesan baru
        const chatAreaHeight = this.scale.height - 80;
        if (this.currentY > chatAreaHeight) {
            this.chatContainer.y = chatAreaHeight - this.currentY;
        }
    }

    // Mengunci nilai Scroll agar tidak melebihi batas atas/bawah
    clampScroll(chatAreaHeight) {
        const minY = chatAreaHeight - this.currentY;
        if (this.currentY <= chatAreaHeight) {
            this.chatContainer.y = 0;
        } else {
            this.chatContainer.y = Phaser.Math.Clamp(this.chatContainer.y, minY, 0);
        }
    }
}
