import { Scene } from 'phaser';
import { AIHelper } from '../controllers/AIHandler';

export class PlayerAIDashboard extends Scene {
    constructor() {
        super({ key: 'PlayerAIDashboard' });
        this.currentY = 110; // Offset Y di bawah teks sambutan
        this.isOpen = false;
    }

    preload() {
        // Jika Anda memiliki file image avatar asli, gunakan:
        // this.load.image('ai-avatar', 'assets/ai_avatar.png');
        // this.load.image('user-avatar', 'assets/user_avatar.png');

        // Generator Avatar Lingkaran dengan Border Neon Cyan (Fallback)
        this.createGlowingAvatar('ai-avatar-bg', 0x1e1b4b, '🤖');
        this.createGlowingAvatar('user-avatar-bg', 0x0f172a, '🕵️');
    }

    create() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;
        this.sidebarWidth = screenWidth * 0.8; // Lebar 80%
        const chatAreaHeight = screenHeight - 90;

        // 1. BACKDROP OVERLAY
        this.backdrop = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.6)
            .setOrigin(0)
            .setInteractive()
            .setAlpha(0)
            .setVisible(false);
        
        // this.backdrop.on('pointerdown', () => this.toggleSidebar(false));

        // 2. MAIN SIDEBAR CONTAINER
        this.sidebarContainer = this.add.container(-this.sidebarWidth, 0);

        // Dark Semi-Transparent Panel Background
        const sidebarBg = this.add.rectangle(0, 0, this.sidebarWidth, screenHeight, 0x0a0a10, 0.85).setOrigin(0);

        // Header Text / Subtitle
        const headerText = this.add.text(this.sidebarWidth / 2, 45, 
            "Welcome, User\nYou are chatting with AI ASSISTANT, AI answer may be correct and may be false.", {
            font: '28px Inter',
            fill: '#8888a0',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);

        // Container scrollable untuk pesan
        this.chatContainer = this.add.container(0, 0);

        // Masking agar pesan tidak bocor keluar dari area chat
        const maskGraphics = this.make.graphics();
        maskGraphics.fillStyle(0xffffff);
        maskGraphics.fillRect(0, 80, this.sidebarWidth, chatAreaHeight - 80);
        this.chatContainer.setMask(maskGraphics.createGeometryMask());

        // Mouse Wheel Scroll
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (!this.isOpen) return;
            this.chatContainer.y -= deltaY * 0.5;
            this.clampScroll(chatAreaHeight);
        });

        // 3. INPUT BAR (Kapsul Berbentuk Pill dengan Border Putih & Tombol Play ▶)
        const inputFormHtml = `
            <div style="display: flex; align-items: center; width: ${this.sidebarWidth - 40}px; background: #222228; border: 1.5px solid #ffffff; border-radius: 25px; padding: 2px 8px 2px 18px; box-sizing: border-box;">
                <input type="text" id="chat-input" placeholder="Tulis pesan..." 
                       style="flex: 1; border: none; background: transparent; color: #ffffff; outline: none; font-size: 14px; padding: 8px 0;">
                <button id="send-btn" style="border: none; background: transparent; color: #ffffff; cursor: pointer; padding: 6px 10px; font-size: 16px; display: flex; align-items: center;">
                    ▶
                </button>
            </div>
        `;

        const domInput = this.add.dom(this.sidebarWidth / 2, screenHeight - 45).createFromHTML(inputFormHtml);

        const toggleBtn = this.add.text(this.sidebarWidth+20, 20, '💬 Chat AI', {
            font: 'bold 16px Arial',
            fill: '#ffffff',
            backgroundColor: '#6366f1',
            padding: { x: 12, y: 8 }
        }).setInteractive({ useHandCursor: true });
        
        // this.sidebarContainer.add([sidebarBg, this.chatContainer, domElement, toggleBtn]);
        
        toggleBtn.on('pointerdown', () => this.toggleSidebar(!this.isOpen));
        // Masukkan elemen ke Sidebar Container
        
        this.sidebarContainer.add([sidebarBg, headerText, this.chatContainer, domInput, toggleBtn]);

        // 4. MOCK DATA SESUAI GAMBAR
        this.addMessage('ai', 'Hai, apa ada yang bisa saya bantu?');
    }

    
    // Generator Avatar dengan Ring Neon Cyan
    createGlowingAvatar(key, bgColor, emoji) {
        const size = 200;
        const lineWidth = 10;
        // Radius dikurangi agar ketebalan stroke (10px) tidak terpotong keluar kanvas
        const radius = (size / 2) - (lineWidth / 2) - 4; 

        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Ring Luar Neon Cyan (#00E5FF)
        graphics.lineStyle(lineWidth, 0x00E5FF, 1);
        graphics.strokeCircle(size / 2, size / 2, radius);
        
        // Background Lingkaran Dalam
        graphics.fillStyle(bgColor, 1);
        graphics.fillCircle(size / 2, size / 2, radius - (lineWidth / 2));

        // Emoji/Teks di Tengah (Ukuran font disesuaikan dengan kanvas 200px)
        const txt = this.make.text({
            x: size / 2, 
            y: size / 2, 
            text: emoji,
            style: { font: '80px Arial' },
            add: false
        }).setOrigin(0.5);

        // Render ke RenderTexture & Simpan Tekstur
        const renderTexture = this.add.renderTexture(0, 0, size, size);
        renderTexture.draw(graphics, 0, 0);
        renderTexture.draw(txt, size / 2, size / 2);
        renderTexture.saveTexture(key);

        // Hapus memori sementara
        graphics.destroy();
        txt.destroy();
        renderTexture.destroy();
    }

    // Fungsi Tambah Pesan (Styling Sesuai UI Gambar)
    addMessage(sender, text) {
        const isUser = sender === 'user';
        const padding = 34;
        const maxBubbleWidth = this.sidebarWidth * 0.55;

        // Skema Warna
        const bubbleColor = isUser ? 0xD9D9D9 : 0x2B2EB0;
        const textColor = isUser ? '#000000' : '#ffffff';

        // 1. Buat Teks untuk Mengukur Dimensi Gelembung
        const msgText = this.add.text(0, 0, text, {
            fontFamily: 'Inter, sans-serif',
            fontSize: 34,
            fill: textColor,
            wordWrap: { width: maxBubbleWidth - (padding * 2) }
        });

        const bubbleWidth = msgText.width + (padding * 2);
        const bubbleHeight = msgText.height + (padding * 2);

        // 2. Render Avatar Lebih Awal untuk Mendapatkan Ukuran Aktual (Setelah Scale)
        const avatar = this.add.image(0, 0, isUser ? 'user-avatar' : 'ai-avatar')
                        .setScale(isUser ? 0.137 : 0.177);

        // Ambil ukuran FISIK aktual avatar di layar (~25px - 32px)
        const realAvatarSize = avatar.displayHeight; 
        const avatarRadius = Math.max(avatar.displayWidth, avatar.displayHeight) / 2;

        // Hitung Koordinat Pusat Avatar
        const avatarX = isUser ? this.sidebarWidth - avatarRadius - 20 : avatarRadius + 20;
        const avatarY = this.currentY + (realAvatarSize / 2);
        avatar.setPosition(avatarX, avatarY);

        // 3. Buat Ring Neon Cyan di Belakang Avatar
        const ringThickness = 3;
        const gap = 2;
        const avatarRing = this.add.graphics();
        avatarRing.fillStyle(isUser ? 0x0f172a : 0x1e1b4b, 1);
        avatarRing.fillCircle(avatarX, avatarY, avatarRadius + gap);
        avatarRing.lineStyle(ringThickness, 0x00E5FF, 1);
        avatarRing.strokeCircle(avatarX, avatarY, avatarRadius + gap);

        // 4. Hitung Posisi Y Gelembung (Dinamis)
        let bubbleY;
        if (bubbleHeight <= realAvatarSize) {
            // Teks Pendek: Tepat di tengah vertikal avatar
            bubbleY = avatarY - (bubbleHeight / 2);
        } else {
            // Teks Panjang: Gelembung tumbuh ke atas dari batas bawah avatar
            bubbleY = avatarY + (realAvatarSize / 2) - bubbleHeight;
        }

        const bubbleX = isUser 
            ? avatarX - avatarRadius - 41 - bubbleWidth 
            : avatarX + avatarRadius + 41;

        // 5. Render Gelembung Chat & Teks (Menggunakan bubbleY!)
        const bubble = this.add.graphics();
        bubble.fillStyle(bubbleColor, 1);
        bubble.fillRoundedRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, 14); // FIXED: bubbleY

        msgText.setPosition(bubbleX + padding, bubbleY + padding); // FIXED: bubbleY

        // 6. Masukkan ke Container
        this.chatContainer.add([avatarRing, avatar, bubble, msgText]);

        // 7. Hitung Margin Bawah & Update currentY
        const bottomMargin = Math.max(bubbleY + bubbleHeight, avatarY + (realAvatarSize / 2));
        this.currentY = bottomMargin + 18;

        // 8. Auto Scroll
        const chatAreaHeight = this.scale.height - 90;
        if (this.currentY > chatAreaHeight) {
            this.chatContainer.y = chatAreaHeight - this.currentY;
        }
    }
    // addMessage(sender, text) {
    //     const isUser = sender === 'user';
    //     const padding = 14;
    //     const maxBubbleWidth = this.sidebarWidth * 0.55;
    //     const avatarSize = 181;

    //     // Skema Warna Sesuai Gambar:
    //     // AI: Bubble Biru/Ungu (#2B2EB0), Teks Putih (#FFFFFF)
    //     // User: Bubble Abu-abu Light (#D9D9D9), Teks Hitam (#000000)
    //     const bubbleColor = isUser ? 0xD9D9D9 : 0x2B2EB0;
    //     const textColor = isUser ? '#000000' : '#ffffff';

    //     const msgText = this.add.text(0, 0, text, {
    //         fontFamily: 'Inter, sans-serif',
    //         fontSize: 34,
    //         fill: textColor,
    //         wordWrap: { width: maxBubbleWidth - (padding * 2) }
    //     });

    //     const bubbleWidth = msgText.width + (padding * 2);
    //     const bubbleHeight = msgText.height + (padding * 2);

    //     // Posisi AI di KIRI, User di KANAN
    //     const avatarX = isUser ? this.sidebarWidth - avatarSize/2 +52 : avatarSize/2 +52;
    //     const avatarY = this.currentY + (avatarSize / 2);
    //     // const avatarBg = this.add.image(avatarX, this.currentY + (avatarSize / 2), isUser ? 'user-avatar-bg' : 'ai-avatar-bg')
    //     const avatar = this.add.image(avatarX, this.currentY + (avatarSize / 2), isUser ? 'user-avatar' : 'ai-avatar')
    //                     .setScale(isUser ? 0.137 : 0.177);
    //     console.log("Avatar size: ", avatar.displayWidth);
    //     // 2. HITUNG RADIUS BERDASARKAN UKURAN FISIK GAMBAR AVATAR
    //     // (Math.max digunakan untuk mengantisipasi jika gambar tidak simetris sempurna)
    //     const avatarRadius = Math.max(avatar.displayWidth, avatar.displayHeight) / 2;
    //     const ringThickness = 3; // Ketebalan garis neon
    //     const gap = 2;           // Jarak antara tepi gambar avatar dengan garis neon

    //     // 3. BUAT OUTLINE / RING NEON BERDASARKAN PATOKAN AVATAR
    //     const avatarRing = this.add.graphics();
        
    //     // Background lingkaran hitam/gelap di belakang avatar
    //     avatarRing.fillStyle(isUser ? 0x0f172a : 0x1e1b4b, 1);
    //     avatarRing.fillCircle(avatarX, avatarY, avatarRadius + gap);

    //     // Garis Outline Neon Cyan (#00E5FF)
    //     avatarRing.lineStyle(ringThickness, 0x00E5FF, 1);
    //     avatarRing.strokeCircle(avatarX, avatarY, avatarRadius + gap);

    //     // 2. HITUNG POSISI Y GELEMBUNG (Dinamis)
    //     let bubbleY;
    //     if (bubbleHeight <= avatarSize) {
    //         // Jika teks pendek: Posisi tepat di tengah avatar secara vertikal
    //         bubbleY = avatarY - (bubbleHeight / 2);
    //     } else {
    //         // Jika teks panjang: Avatar berada di kiri bawah gelembung (gelembung naik ke atas)
    //         bubbleY = avatarY + (avatarSize / 2) - bubbleHeight;
    //     }

    //     const bubbleX = isUser 
    //         ? avatarX - (avatarSize / 2) - 12 - bubbleWidth 
    //         : avatarX + (avatarSize / 2) + 12;
        
    //     const bubble = this.add.graphics();
    //     bubble.fillStyle(bubbleColor, 1);
    //     bubble.fillRoundedRect(bubbleX, this.currentY, bubbleWidth, bubbleHeight, 14);

    //     msgText.setPosition(bubbleX + padding, this.currentY + padding);

    //     this.chatContainer.add([avatarRing, avatar, bubble, msgText]);
    //     const topMargin = Math.min(bubbleY, avatarY - avatarSize / 2);
    //     const bottomMargin = Math.max(bubbleY + bubbleHeight, avatarY + avatarSize / 2);
    //     this.currentY = bottomMargin + 18;
    //     // this.currentY += Math.max(bubbleHeight, avatarSize) + 18;

    //     const chatAreaHeight = this.scale.height - 90;
    //     if (this.currentY > chatAreaHeight) {
    //         this.chatContainer.y = chatAreaHeight - this.currentY;
    //     }
    // }

    // Method Streaming AI (Update Dinamis Sesuai Desain Baru)
    startStreamingMessage(sender) {
        const isUser = sender === 'user';
        const padding = 14;
        const maxBubbleWidth = this.sidebarWidth * 0.55;
        const avatarSize = 52;
        const initialY = this.currentY;

        const bubbleColor = isUser ? 0xD9D9D9 : 0x2B2EB0;
        const textColor = isUser ? '#000000' : '#ffffff';

        let fullText = "";

        const msgText = this.add.text(0, 0, "", {
            font: '28px Arial',
            fill: textColor,
            wordWrap: { width: maxBubbleWidth - (padding * 2) }
        });

        const avatarX = isUser ? this.sidebarWidth - 35 : 35;
        const avatar = this.add.image(avatarX, initialY + (avatarSize / 2), isUser ? 'user-avatar' : 'ai-avatar');
        const bubble = this.add.graphics();

        this.chatContainer.add([avatar, bubble, msgText]);

        return {
            appendChunk: (chunk) => {
                fullText += chunk;
                msgText.setText(fullText);

                const bubbleWidth = Math.min(msgText.width + (padding * 2), maxBubbleWidth);
                const bubbleHeight = msgText.height + (padding * 2);
                const bubbleX = isUser ? avatarX - (avatarSize / 2) - 12 - bubbleWidth : avatarX + (avatarSize / 2) + 12;

                bubble.clear();
                bubble.fillStyle(bubbleColor, 1);
                bubble.fillRoundedRect(bubbleX, initialY, bubbleWidth, bubbleHeight, 14);

                msgText.setPosition(bubbleX + padding, initialY + padding);

                const currentTotalY = initialY + Math.max(bubbleHeight, avatarSize) + 18;
                const chatAreaHeight = this.scale.height - 90;
                if (currentTotalY > chatAreaHeight) {
                    this.chatContainer.y = chatAreaHeight - currentTotalY;
                }
            },
            finish: () => {
                const finalBubbleHeight = msgText.height + (padding * 2);
                this.currentY = initialY + Math.max(finalBubbleHeight, avatarSize) + 18;
            }
        };
    }

    toggleSidebar(open) {
        this.isOpen = open;
        if (open) {
            this.backdrop.setVisible(true);
            this.tweens.add({ targets: this.backdrop, alpha: 0.6, duration: 250 });
            this.tweens.add({ targets: this.sidebarContainer, x: 0, duration: 300, ease: 'Power2' });
        } else {
            this.tweens.add({ targets: this.backdrop, alpha: 0, duration: 250, onComplete: () => this.backdrop.setVisible(false) });
            this.tweens.add({ targets: this.sidebarContainer, x: -this.sidebarWidth, duration: 300, ease: 'Power2' });
        }
    }

    clampScroll(chatAreaHeight) {
        const minY = chatAreaHeight - this.currentY;
        if (this.currentY <= chatAreaHeight) {
            this.chatContainer.y = 0;
        } else {
            this.chatContainer.y = Phaser.Math.Clamp(this.chatContainer.y, minY, 0);
        }
    }
}

// export class PlayerAIDashboard extends Scene {
//     constructor() {
//         super({ key: 'PlayerAIDashboard' });
//         this.chatMessages = [];
//         this.currentY = 20;
//         this.isOpen = false;
//     }

//     preload() {
//         // Jika Anda memiliki file image avatar asli, gunakan:
//         // this.load.image('ai-avatar', 'assets/ai_avatar.png');
//         // this.load.image('user-avatar', 'assets/user_avatar.png');

//         // Generator Avatar Lingkaran dengan Border Neon Cyan (Fallback)
//         this.createGlowingAvatar('ai-avatar', 0x1e1b4b, '🤖');
//         this.createGlowingAvatar('user-avatar', 0x0f172a, '🕵️');
//     }

//     create() {
//         const screenWidth = this.scale.width;
//         const screenHeight = this.scale.height;
//         this.sidebarWidth = screenWidth * 0.8; // Lebar Sidebar 80%
//         const chatAreaHeight = screenHeight - 90;

//         // ==========================================
//         // 1. BACKDROP (Latar Redup & Toggle Close)
//         // ==========================================
//         // 1. BACKDROP OVERLAY
//         this.backdrop = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.6)
//             .setOrigin(0)
//             .setInteractive()
//             .setAlpha(0)
//             .setVisible(false);

//         this.backdrop.on('pointerdown', () => this.toggleSidebar(false));

//         // 2. MAIN SIDEBAR CONTAINER
//         this.sidebarContainer = this.add.container(-this.sidebarWidth, 0);

//         // Dark Semi-Transparent Panel Background
//         const sidebarBg = this.add.rectangle(0, 0, this.sidebarWidth, screenHeight, 0x0a0a10, 0.85).setOrigin(0);

//         // Header Text / Subtitle
//         const headerText = this.add.text(this.sidebarWidth / 2, 45, 
//             "Welcome, User\nYou are chatting with AI ASSISTANT, AI answer may be correct and may be false.", {
//             font: '12px Arial',
//             fill: '#8888a0',
//             align: 'center',
//             lineSpacing: 4
//         }).setOrigin(0.5);
//         // this.backdrop = this.add.rectangle(0, 0, screenWidth, screenHeight, 0x000000, 0.5)
//         //     .setOrigin(0)
//         //     .setInteractive()
//         //     .setAlpha(0)
//         //     .setVisible(false);

//         // this.backdrop.on('pointerdown', () => this.toggleSidebar(false));

//         // Container scrollable untuk pesan
//         this.chatContainer = this.add.container(0, 0);

//         // Masking agar pesan tidak bocor keluar dari area chat
//         const maskGraphics = this.make.graphics();
//         maskGraphics.fillStyle(0xffffff);
//         maskGraphics.fillRect(0, 80, this.sidebarWidth, chatAreaHeight - 80);
//         this.chatContainer.setMask(maskGraphics.createGeometryMask());

//         // Mouse Wheel Scroll
//         this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
//             if (!this.isOpen) return;
//             this.chatContainer.y -= deltaY * 0.5;
//             this.clampScroll(chatAreaHeight);
//         });

//         // 3. INPUT BAR (Kapsul Berbentuk Pill dengan Border Putih & Tombol Play ▶)
//         const inputFormHtml = `
//             <div style="display: flex; align-items: center; width: ${this.sidebarWidth - 40}px; background: #222228; border: 1.5px solid #ffffff; border-radius: 25px; padding: 2px 8px 2px 18px; box-sizing: border-box;">
//                 <input type="text" id="ai-prompt-input" placeholder="Tulis pesan..." 
//                        style="flex: 1; border: none; background: transparent; color: #ffffff; outline: none; font-size: 14px; padding: 8px 0;">
//                 <button id="btn-send" style="border: none; background: transparent; color: #ffffff; cursor: pointer; padding: 6px 10px; font-size: 16px; display: flex; align-items: center;">
//                     ▶
//                 </button>
//             </div>
//         `;

//         const domInput = this.add.dom(this.sidebarWidth / 2, screenHeight - 45).createFromHTML(inputFormHtml);

//         // Masukkan elemen ke Sidebar Container
//         this.sidebarContainer.add([sidebarBg, headerText, this.chatContainer, domInput]);

//         // 4. MOCK DATA SESUAI GAMBAR
//         this.addMessage('ai', 'Hai, apa ada yang bisa saya bantu?');

//         // ==========================================
//         // 2. MAIN SIDEBAR CONTAINER (Posisi Awal di Luar Layar Kiri)
//         // ==========================================
//         this.sidebarContainer = this.add.container(-this.sidebarWidth, 0);

//         // Background Panel Sidebar
//         const sidebarBg = this.add.rectangle(0, 0, this.sidebarWidth, screenHeight, 0x181825).setOrigin(0);

//         // Sub-container khusus area pesan agar bisa di-scroll
//         this.chatContainer = this.add.container(0, 0);

//         // Masking Teks agar tidak menembus batas sidebar (0 sampai 80% lebar)
//         const maskGraphics = this.make.graphics();
//         maskGraphics.fillStyle(0xffffff);
//         maskGraphics.fillRect(0, 0, this.sidebarWidth, chatAreaHeight);
//         this.chatContainer.setMask(maskGraphics.createGeometryMask());

//         // Fitur Scroll Wheel
//         this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
//             if (!this.isOpen) return;
//             this.chatContainer.y -= deltaY * 0.5;
//             this.clampScroll(chatAreaHeight);
//         });

//         // ==========================================
//         // 3. INPUT FORM (DOM Element)
//         // ==========================================
//         const inputFormHtml = `
//             <div style="display: flex; gap: 6px; width: ${this.sidebarWidth - 24}px; background: #11111b; padding: 6px; border-radius: 8px;">
//                 <input type="text" id="chat-input" placeholder="Ketik pesan..." 
//                        style="flex: 1; padding: 8px; border: none; border-radius: 4px; outline: none; background: #1e1e2e; color: #fff; font-size: 13px;">
//                 <button id="send-btn" style="padding: 8px 12px; border: none; border-radius: 4px; background: #6366f1; color: white; cursor: pointer; font-weight: bold; font-size: 12px;">SEND</button>
//             </div>
//         `;

//         const domElement = this.add.dom(this.sidebarWidth/2, screenHeight - 40).createFromHTML(inputFormHtml);
        
//         const inputElement = domElement.getChildByID('chat-input');
//         const sendBtn = domElement.getChildByID('send-btn');

//         const sendMessage = async () => {
//             await AIHelper.sendPromptToAI(this);
//         };

//         sendBtn.addEventListener('click', sendMessage);
//         inputElement.addEventListener('keypress', async (e) => {
//             if (e.key === 'Enter') await sendMessage();
//         });

//         // Gabungkan semua komponen ke dalam Sidebar Container Utama
        
//         // ==========================================
//         // 4. TOMBOL TOGGLE UNTUK BUKA/TUTUP CHAT
//         // ==========================================
//         const toggleBtn = this.add.text(this.sidebarWidth+20, 20, '💬 Chat AI', {
//             font: 'bold 16px Arial',
//             fill: '#ffffff',
//             backgroundColor: '#6366f1',
//             padding: { x: 12, y: 8 }
//         }).setInteractive({ useHandCursor: true });
        
//         this.sidebarContainer.add([sidebarBg, this.chatContainer, domElement, toggleBtn]);
        
//         toggleBtn.on('pointerdown', () => this.toggleSidebar(!this.isOpen));

//         // Tambahkan contoh pesan awal
//         this.addMessage('ai', 'Halo! Sidebar chat siap digunakan.');
//     }

//     // ==========================================
//     // ANIMASI SLIDE IN / SLIDE OUT (TWEEN)
//     // ==========================================
//     toggleSidebar(open) {
//         this.isOpen = open;

//         if (open) {
//             this.backdrop.setVisible(true);
//             // Animasi Backdrop Fade-In
//             this.tweens.add({
//                 targets: this.backdrop,
//                 alpha: 0.6,
//                 duration: 250
//             });

//             // Animasi Sidebar Slide dari Kiri ke Kanan (x: -sidebarWidth -> x: 0)
//             this.tweens.add({
//                 targets: this.sidebarContainer,
//                 x: 0,
//                 duration: 300,
//                 ease: 'Power2'
//             });
//         } else {
//             // Animasi Backdrop Fade-Out
//             this.tweens.add({
//                 targets: this.backdrop,
//                 alpha: 0,
//                 duration: 250,
//                 onComplete: () => this.backdrop.setVisible(false)
//             });

//             // Animasi Sidebar Slide dari Kanan ke Kiri (x: 0 -> x: -sidebarWidth)
//             this.tweens.add({
//                 targets: this.sidebarContainer,
//                 x: -this.sidebarWidth,
//                 duration: 300,
//                 ease: 'Power2'
//             });
//         }
//     }

//     // Dynamic Generator untuk Avatar Lingkaran
//     createRoundedAvatarTexture(key, color, label) {
//         const size = 36;
//         const graphics = this.make.graphics({ x: 0, y: 0, add: false });
//         graphics.fillStyle(color, 1);
//         graphics.fillCircle(size / 2, size / 2, size / 2);
//         graphics.generateTexture(key, size, size);

//         const txt = this.make.text({
//             x: size / 2, y: size / 2, text: label,
//             style: { font: 'bold 9px Arial', fill: '#ffffff' },
//             add: false
//         }).setOrigin(0.5);
        
//         const renderTexture = this.add.renderTexture(0, 0, size, size);
//         renderTexture.draw(graphics, 0, 0);
//         renderTexture.draw(txt, size / 2, size / 2);
//         renderTexture.saveTexture(key);
//         renderTexture.destroy();
//     }

//     // Fungsi Tambah Pesan (Disesuaikan dengan lebar 80%)
//     addMessage(sender, text) {
//         const isUser = sender === 'user';
//         const padding = 10;
//         const maxBubbleWidth = this.sidebarWidth * 0.65; // Max lebar bubble disesuaikan dengan sidebar
//         const avatarSize = 36;

//         const msgText = this.add.text(0, 0, text, {
//             font: '13px Arial',
//             fill: '#ffffff',
//             wordWrap: { width: maxBubbleWidth - (padding * 2) }
//         });

//         const bubbleWidth = msgText.width + (padding * 2);
//         const bubbleHeight = msgText.height + (padding * 2);

//         const avatarX = isUser ? this.sidebarWidth - 25 : 25;
//         const bubbleX = isUser ? avatarX - (avatarSize / 2) - 8 - bubbleWidth : avatarX + (avatarSize / 2) + 8;
//         const bubbleColor = isUser ? 0x10B981 : 0x313244;

//         const avatar = this.add.image(avatarX, this.currentY + (avatarSize / 2), isUser ? 'user-avatar' : 'ai-avatar');
        
//         const bubble = this.add.graphics();
//         bubble.fillStyle(bubbleColor, 1);
//         bubble.fillRoundedRect(bubbleX, this.currentY, bubbleWidth, bubbleHeight, 8);

//         msgText.setPosition(bubbleX + padding, this.currentY + padding);

//         this.chatContainer.add([avatar, bubble, msgText]);
//         this.currentY += Math.max(bubbleHeight, avatarSize) + 12;

//         const chatAreaHeight = this.scale.height - 80;
//         if (this.currentY > chatAreaHeight) {
//             this.chatContainer.y = chatAreaHeight - this.currentY;
//         }
//     }

//     startStreamingMessage(sender) {
//         const isUser = sender === 'user';
//         const screenWidth = this.scale.width;
//         const padding = 12;
//         const maxBubbleWidth = 260;
//         const avatarSize = 40;

//         let fullText = "";
//         const initialY = this.currentY;

//         // 1. Inisialisasi Objek Teks Kosong
//         const msgText = this.add.text(0, 0, "", {
//             font: '14px Arial',
//             fill: '#ffffff',
//             wordWrap: { width: maxBubbleWidth - (padding * 2) }
//         });

//         const avatarX = isUser ? screenWidth - 30 : 30;
//         const bubbleColor = isUser ? 0x10B981 : 0x374151;

//         // 2. Avatar & Bubble Graphics
//         const avatar = this.add.image(avatarX, initialY + (avatarSize / 2), isUser ? 'user-avatar' : 'ai-avatar');
//         const bubble = this.add.graphics();

//         // Masukkan ke Container
//         this.chatContainer.add([avatar, bubble, msgText]);

//         // Return controller untuk memperbarui teks & bubble secara streaming
//         return {
//             appendChunk: (chunk) => {
//                 fullText += chunk;
//                 msgText.setText(fullText);

//                 // Hitung ulang ukuran bubble berdasarkan teks baru
//                 const bubbleWidth = Math.min(msgText.width + (padding * 2), maxBubbleWidth);
//                 const bubbleHeight = msgText.height + (padding * 2);
//                 const bubbleX = isUser ? avatarX - (avatarSize / 2) - 10 - bubbleWidth : avatarX + (avatarSize / 2) + 10;

//                 // Gambar ulang gelembung background
//                 bubble.clear();
//                 bubble.fillStyle(bubbleColor, 1);
//                 bubble.fillRoundedRect(bubbleX, initialY, bubbleWidth, bubbleHeight, 10);

//                 // Sesuaikan posisi teks
//                 msgText.setPosition(bubbleX + padding, initialY + padding);

//                 // Auto Scroll ke bawah seiring bertambahnya tinggi teks
//                 const currentTotalY = initialY + Math.max(bubbleHeight, avatarSize) + 15;
//                 const chatAreaHeight = this.scale.height - 80;
//                 if (currentTotalY > chatAreaHeight) {
//                     this.chatContainer.y = chatAreaHeight - currentTotalY;
//                 }
//             },
//             finish: () => {
//                 // Update offset Y global untuk pesan selanjutnya setelah streaming selesai
//                 const finalBubbleHeight = msgText.height + (padding * 2);
//                 this.currentY = initialY + Math.max(finalBubbleHeight, avatarSize) + 15;
//             }
//         };
//     }

//     clampScroll(chatAreaHeight) {
//         const minY = chatAreaHeight - this.currentY;
//         if (this.currentY <= chatAreaHeight) {
//             this.chatContainer.y = 0;
//         } else {
//             this.chatContainer.y = Phaser.Math.Clamp(this.chatContainer.y, minY, 0);
//         }
//     }
// }

// export class PlayerAIDashboard extends Scene
// {
//     constructor ()
//     {
//         super('PlayerAIDashboard');
//         this.chatMessages = [];
//         this.currentY = 20; // Offset vertikal pesan di dalam kontainer
//     }

//     init ()
//     {
//         this.createRoundedAvatarTexture('ai-avatar', 0x4F46E5, 'AI');
//         this.createRoundedAvatarTexture('user-avatar', 0x10B981, 'YOU');
//     }

//     create() {
//         const width = this.scale.width;
//         const height = this.scale.height;

//         const chatAreaHeight = height - 80; // Area obrolan di atas bar input

//         // 1. KONTANER & MASK CHAT (Scrollable Zone)
//         this.chatContainer = this.add.container(0, 0);

//         // Buat Masking agar pesan tidak menembus area input/header
//         const maskGraphics = this.make.graphics();
//         maskGraphics.fillStyle(0xffffff);
//         maskGraphics.fillRect(0, 0, width, chatAreaHeight);
//         const chatMask = maskGraphics.createGeometryMask();
//         this.chatContainer.setMask(chatMask);

//         // Fitur Scroll Menggunakan Mouse Wheel
//         this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
//             this.chatContainer.y -= deltaY * 0.5;
//             this.clampScroll(chatAreaHeight);
//         });

//         // 2. AREA INPUT TEKS & TOMBOL KIRIM (DOM Element)
//         const inputFormHtml = `
//             <div style="display: flex; gap: 8px; width: ${width - 40}px; background: #1e1e2e; padding: 8px; border-radius: 8px;">
//                 <input type="text" id="chat-input" placeholder="Tulis pesan..." 
//                        style="flex: 1; padding: 10px; border: none; border-radius: 4px; outline: none; background: #2d2d3d; color: #fff; font-size: 14px;">
//                 <button id="send-btn" style="padding: 10px 16px; border: none; border-radius: 4px; background: #6366f1; color: white; cursor: pointer; font-weight: bold;">Kirim</button>
//             </div>
//         `;

//         const domElement = this.add.dom(width / 2, height - 40).createFromHTML(inputFormHtml);
        
//         const inputElement = domElement.getChildByID('chat-input');
//         const sendBtn = domElement.getChildByID('send-btn');

//         const sendMessage = async () => {
//             await AIHelper.sendPromptToAI(this);
//         };

//         sendBtn.addEventListener('click', sendMessage);
//         inputElement.addEventListener('keypress', async (e) => {
//             if (e.key === 'Enter') await sendMessage();
//         });

//         // Contoh Pesan Awal
//         this.addMessage('ai', 'Halo! Ada yang bisa saya bantu hari ini?');
//     }

//     // Dynamic Generator untuk Avatar Lingkaran
//     createRoundedAvatarTexture(key, color, label) {
//         const size = 40;
//         const graphics = this.make.graphics({ x: 0, y: 0, add: false });
//         graphics.fillStyle(color, 1);
//         graphics.fillCircle(size / 2, size / 2, size / 2);
//         graphics.generateTexture(key, size, size);

//         // Tambahkan label teks di tengah avatar
//         const txt = this.make.text({
//             x: size / 2, y: size / 2, text: label,
//             style: { font: 'bold 10px Arial', fill: '#ffffff' },
//             add: false
//         }).setOrigin(0.5);
        
//         const renderTexture = this.add.renderTexture(0, 0, size, size);
//         renderTexture.draw(graphics, 0, 0);
//         renderTexture.draw(txt, size / 2, size / 2);
//         renderTexture.saveTexture(key);
//         renderTexture.destroy();
//     }

//     // Fungsi Menambahkan Pesan ke Chat Container
//     addMessage(sender, text) {
//         const isUser = sender === 'user';
//         const screenWidth = this.scale.width;
//         const padding = 12;
//         const maxBubbleWidth = 260;
//         const avatarSize = 40;

//         // Bounding Box Teks
//         const msgText = this.add.text(0, 0, text, {
//             font: '14px Arial',
//             fill: '#ffffff',
//             wordWrap: { width: maxBubbleWidth - (padding * 2) }
//         });

//         const bubbleWidth = msgText.width + (padding * 2);
//         const bubbleHeight = msgText.height + (padding * 2);

//         // Hitung Posisi (Kiri untuk AI, Kanan untuk User)
//         const avatarX = isUser ? screenWidth - 30 : 30;
//         const bubbleX = isUser ? avatarX - (avatarSize / 2) - 10 - bubbleWidth : avatarX + (avatarSize / 2) + 10;
//         const bubbleColor = isUser ? 0x10B981 : 0x374151;

//         // Avatar Image
//         const avatar = this.add.image(avatarX, this.currentY + (avatarSize / 2), isUser ? 'user-avatar' : 'ai-avatar');

//         // Gelembung Chat (Background)
//         const bubble = this.add.graphics();
//         bubble.fillStyle(bubbleColor, 1);
//         bubble.fillRoundedRect(bubbleX, this.currentY, bubbleWidth, bubbleHeight, 10);

//         // Posisikan Teks di dalam Gelembung
//         msgText.setPosition(bubbleX + padding, this.currentY + padding);

//         // Masukkan elemen ke dalam Chat Container
//         this.chatContainer.add([avatar, bubble, msgText]);

//         // Perbarui tinggi vertikal pesan selanjutnya
//         this.currentY += Math.max(bubbleHeight, avatarSize) + 15;

//         // Auto Scroll ke Paling Bawah saat ada pesan baru
//         const chatAreaHeight = this.scale.height - 80;
//         if (this.currentY > chatAreaHeight) {
//             this.chatContainer.y = chatAreaHeight - this.currentY;
//         }
//     }

//     startStreamingMessage(sender) {
//         const isUser = sender === 'user';
//         const screenWidth = this.scale.width;
//         const padding = 12;
//         const maxBubbleWidth = 260;
//         const avatarSize = 40;

//         let fullText = "";
//         const initialY = this.currentY;

//         // 1. Inisialisasi Objek Teks Kosong
//         const msgText = this.add.text(0, 0, "", {
//             font: '14px Arial',
//             fill: '#ffffff',
//             wordWrap: { width: maxBubbleWidth - (padding * 2) }
//         });

//         const avatarX = isUser ? screenWidth - 30 : 30;
//         const bubbleColor = isUser ? 0x10B981 : 0x374151;

//         // 2. Avatar & Bubble Graphics
//         const avatar = this.add.image(avatarX, initialY + (avatarSize / 2), isUser ? 'user-avatar' : 'ai-avatar');
//         const bubble = this.add.graphics();

//         // Masukkan ke Container
//         this.chatContainer.add([avatar, bubble, msgText]);

//         // Return controller untuk memperbarui teks & bubble secara streaming
//         return {
//             appendChunk: (chunk) => {
//                 fullText += chunk;
//                 msgText.setText(fullText);

//                 // Hitung ulang ukuran bubble berdasarkan teks baru
//                 const bubbleWidth = Math.min(msgText.width + (padding * 2), maxBubbleWidth);
//                 const bubbleHeight = msgText.height + (padding * 2);
//                 const bubbleX = isUser ? avatarX - (avatarSize / 2) - 10 - bubbleWidth : avatarX + (avatarSize / 2) + 10;

//                 // Gambar ulang gelembung background
//                 bubble.clear();
//                 bubble.fillStyle(bubbleColor, 1);
//                 bubble.fillRoundedRect(bubbleX, initialY, bubbleWidth, bubbleHeight, 10);

//                 // Sesuaikan posisi teks
//                 msgText.setPosition(bubbleX + padding, initialY + padding);

//                 // Auto Scroll ke bawah seiring bertambahnya tinggi teks
//                 const currentTotalY = initialY + Math.max(bubbleHeight, avatarSize) + 15;
//                 const chatAreaHeight = this.scale.height - 80;
//                 if (currentTotalY > chatAreaHeight) {
//                     this.chatContainer.y = chatAreaHeight - currentTotalY;
//                 }
//             },
//             finish: () => {
//                 // Update offset Y global untuk pesan selanjutnya setelah streaming selesai
//                 const finalBubbleHeight = msgText.height + (padding * 2);
//                 this.currentY = initialY + Math.max(finalBubbleHeight, avatarSize) + 15;
//             }
//         };
//     }

//     // Mengunci nilai Scroll agar tidak melebihi batas atas/bawah
//     clampScroll(chatAreaHeight) {
//         const minY = chatAreaHeight - this.currentY;
//         if (this.currentY <= chatAreaHeight) {
//             this.chatContainer.y = 0;
//         } else {
//             this.chatContainer.y = Phaser.Math.Clamp(this.chatContainer.y, minY, 0);
//         }
//     }
// }
