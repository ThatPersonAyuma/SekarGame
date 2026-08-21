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

    return button;
}

//  Panel dashboard kustom dengan border gradient + background gelap + segitiga sudut
//  (gaya yang sama dengan createButtonIcon)
export function createRolePanel(obj, x, y, w, h, opts = {}) {
    const {
        top = 0x00B2EE,
        bottom = 0x5053FF,
        alpha = 0.988,
        bgColor = 0x0c0c18,
        radius = 20,
        corner = true
    } = opts;

    const g = obj.add.graphics();
    g.fillGradientStyle(top, top, bottom, bottom, alpha, alpha, alpha, alpha);
    g.fillRoundedRect(x, y, w, h, radius);

    g.fillStyle(bgColor, 1);
    g.fillRoundedRect(x + 6, y + 6, w - 12, h - 12, radius - 3);

    if (corner) {
        const cx = x + 16;
        const cy = y + 16;
        const s = 20;
        g.fillStyle(0xffffff, 1);
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(cx + s, cy);
        g.lineTo(cx, cy + s);
        g.closePath();
        g.fillPath();
    }

    return g;
}

//  Tombol kembali / navigasi kecil dengan gaya rounded gradient
export function createBackButton(obj, x, y, onClick, label = '◀ BACK') {
    const w = 270;
    const h = 84;
    const border = 8;

    const btn = obj.add.container(x, y);
    const g = obj.add.graphics();
    g.fillGradientStyle(0x00B2EE, 0x00B2EE, 0x5053FF, 0x5053FF, 0.988, 0.988, 0.988, 0.988);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 30);
    g.fillStyle(0x12121e, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, 24);

    const t = obj.add.text(0, 0, label, {
        font: '28px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.04
    }).setOrigin(0.5);

    btn.add([g, t]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerout', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.0, scaleY: 1.0, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerdown', onClick);

    return btn;
}

//  Garis bawah header dengan gradient biru-ungu
export function createHeaderLine(obj, x, y, w) {
    const g = obj.add.graphics();
    g.fillGradientStyle(0x00B2EE, 0x00B2EE, 0x5053FF, 0x5053FF, 1, 1, 1, 1);
    g.fillRect(x, y, w, 5);
    return g;
}

//  ── Tombol ANSWER (kanan bawah) + Popup jawaban ────────────────────────
export function createAnswerButton(obj, x, y, opts = {}) {
    const {
        title = 'FINAL ANSWER',
        subtitle = 'Type your answer for this role, then press SUBMIT.',
        placeholder = 'Your answer...',
        onSubmit = null
    } = opts;

    const sceneKey = obj.sys.settings.key;
    const w = 250;
    const h = 84;
    const border = 8;

    const btn = obj.add.container(x, y);
    const g = obj.add.graphics();
    g.fillGradientStyle(0x00E676, 0x00E676, 0x00B2EE, 0x00B2EE, 0.988, 0.988, 0.988, 0.988);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 30);
    g.fillStyle(0x12121e, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, 24);

    const label = obj.add.text(0, 0, 'ANSWER', {
        font: '28px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.04
    }).setOrigin(0.5);

    btn.add([g, label]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerout', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.0, scaleY: 1.0, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerdown', () => openAnswerModal(obj, btn, label, { title, subtitle, placeholder, onSubmit, sceneKey }));

    return btn;
}

function openAnswerModal (obj, btn, label, cfg)
{
    // Kalau popup sudah pernah dibuat, tinggal tampilkan lagi
    if (obj._answerModal) {
        showAnswerModal(obj, cfg);
        return;
    }

    const { width, height } = obj.scale;
    const panelW = 900;
    const panelH = 560;
    const px = (width - panelW) / 2;
    const py = (height - panelH) / 2 - 60;

    // 1. Overlay gelap (blokir klik ke belakang)
    const overlay = obj.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.78)
        .setInteractive()
        .setVisible(false);

    // 2. Panel modal (gaya gradient sama dengan dashboard)
    const panel = createRolePanel(obj, px, py, panelW, panelH, { top: 0x00B2EE, bottom: 0x5053FF, bgColor: 0x0c0c18, radius: 24 });
    panel.setVisible(false);

    // 3. Judul & subjudul
    const titleText = obj.add.text(width / 2, py + 64, cfg.title, {
        font: '40px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.03
    }).setOrigin(0.5).setVisible(false);

    const subText = obj.add.text(width / 2, py + 134, cfg.subtitle, {
        font: '24px Xirod',
        color: '#7FE7FF',
        align: 'center',
        wordWrap: { width: panelW - 140 }
    }).setOrigin(0.5).setVisible(false);

    // 4. Kolom input (DOM)
    const inputId = 'answer-input-' + cfg.sceneKey;
    const inputHtml =
        '<input type="text" id="' + inputId + '" placeholder="' + cfg.placeholder + '" ' +
        'style="width: 680px; padding: 16px 20px; font-size: 22px; font-family: Arial, sans-serif; ' +
        'background: #14141f; color: #ffffff; border: 2px solid #00B2EE; border-radius: 14px; ' +
        'outline: none; text-align: center;" />';
    const domInput = obj.add.dom(width / 2, py + 250).createFromHTML(inputHtml);
    domInput.setVisible(false);

    // 5. Tombol SUBMIT & CANCEL
    const submitBtn = createModalButton(obj, width / 2 - 160, py + 410, 'SUBMIT', () => {
        submitAnswer(obj, btn, label, cfg, domInput);
    });
    const cancelBtn = createModalButton(obj, width / 2 + 160, py + 410, 'CANCEL', () => {
        hideAnswerModal(obj);
    });
    submitBtn.setVisible(false);
    cancelBtn.setVisible(false);

    // 6. Tombol tutup ✕ di pojok panel
    const closeX = obj.add.text(px + panelW - 44, py + 40, '✕', {
        font: '34px NFS',
        color: '#8EA0FF'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);
    closeX.on('pointerdown', () => hideAnswerModal(obj));

    // 7. Tekan Enter di input = submit
    const inputNode = domInput.node.querySelector('input');
    if (inputNode) {
        inputNode.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitAnswer(obj, btn, label, cfg, domInput);
            }
        });
    }

    obj._answerModal = { overlay, panel, titleText, subText, domInput, submitBtn, cancelBtn, closeX };
    showAnswerModal(obj, cfg);
}

function showAnswerModal (obj, cfg)
{
    const m = obj._answerModal;
    m.overlay.setVisible(true);
    m.panel.setVisible(true);
    m.titleText.setText(cfg.title).setVisible(true);
    m.subText.setText(cfg.subtitle).setVisible(true);
    m.domInput.setVisible(true);
    if (m.domInput.node) m.domInput.node.style.display = 'block';
    m.submitBtn.setVisible(true);
    m.cancelBtn.setVisible(true);
    m.closeX.setVisible(true);

    const input = m.domInput.node.querySelector('input');
    if (input) {
        input.value = '';
        input.focus();
        if (input.select) input.select();
    }
}

function hideAnswerModal (obj)
{
    const m = obj._answerModal;
    if (!m) return;
    m.overlay.setVisible(false);
    m.panel.setVisible(false);
    m.titleText.setVisible(false);
    m.subText.setVisible(false);
    m.domInput.setVisible(false);
    if (m.domInput.node) m.domInput.node.style.display = 'none';
    m.submitBtn.setVisible(false);
    m.cancelBtn.setVisible(false);
    m.closeX.setVisible(false);
}

function submitAnswer (obj, btn, label, cfg, domInput)
{
    const input = domInput.node.querySelector('input');
    const value = input ? input.value.trim() : '';

    if (!value) {
        if (input) {
            input.style.borderColor = '#FF6B6B';
            setTimeout(() => { input.style.borderColor = '#00B2EE'; }, 900);
        }
        return;
    }
    if (input) input.style.borderColor = '#00E676';

    // Simpan jawaban ke registry global game
    obj.registry.set('answer_' + cfg.sceneKey, {
        role: cfg.sceneKey,
        answer: value,
        submittedAt: new Date().toISOString()
    });
    console.log('[ANSWER] ' + cfg.sceneKey + ' -> ' + value);

    if (typeof cfg.onSubmit === 'function') cfg.onSubmit(value);

    // Tandai tombol sudah dijawab
    label.setText('ANSWERED');
    label.setColor('#6DFFB0');

    // Toast sukses
    const toast = obj.add.text(obj.scale.width / 2, obj.scale.height / 2 - 330, 'ANSWER SUBMITTED', {
        font: '38px NFS',
        color: '#6DFFB0',
        letterSpacing: 0.06
    }).setOrigin(0.5).setDepth(1000);
    obj.tweens.add({
        targets: toast,
        alpha: 0,
        y: toast.y - 30,
        delay: 1100,
        duration: 450,
        onComplete: () => toast.destroy()
    });

    hideAnswerModal(obj);
}

function createModalButton (obj, x, y, labelText, onClick)
{
    const w = 240;
    const h = 76;
    const border = 8;

    const btn = obj.add.container(x, y);
    const g = obj.add.graphics();
    g.fillGradientStyle(0x00B2EE, 0x00B2EE, 0x5053FF, 0x5053FF, 0.988, 0.988, 0.988, 0.988);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 26);
    g.fillStyle(0x12121e, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, 20);

    const t = obj.add.text(0, 0, labelText, {
        font: '28px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.04
    }).setOrigin(0.5);

    btn.add([g, t]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerout', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.0, scaleY: 1.0, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerdown', onClick);

    return btn;
}

//  ── Tombol ASK AI (kiri tombol ANSWER) + Popup extracted variables ─────
//  Untuk saat ini popup menampilkan variabel statis (seperti dulu di panel
  //  EXTRACTED VARIABLE). Nanti tinggal ganti `variables` dengan panggilan
  //  AI asli lewat callback `onAsk`.
export function createAskAIButton(obj, x, y, opts = {}) {
    const {
        title = 'ASK A.I.R.I.S.',
        subtitle = 'Ask the AI to extract the key variables from your dashboard.',
        variables = [],
        onAsk = null
    } = opts;

    const sceneKey = obj.sys.settings.key;
    const w = 250;
    const h = 84;
    const border = 8;

    const btn = obj.add.container(x, y);
    const g = obj.add.graphics();
    g.fillGradientStyle(0x00B2EE, 0x00B2EE, 0x5053FF, 0x5053FF, 0.988, 0.988, 0.988, 0.988);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 30);
    g.fillStyle(0x12121e, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, 24);

    const label = obj.add.text(0, 0, 'ASK AI', {
        font: '28px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.04
    }).setOrigin(0.5);

    btn.add([g, label]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerout', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.0, scaleY: 1.0, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerdown', () => openAskAIModal(obj, { title, subtitle, variables, onAsk, sceneKey }));

    return btn;
}

function openAskAIModal (obj, cfg)
{
    if (obj._askAIModal) {
        showAskAIModal(obj, cfg);
        return;
    }

    const { width, height } = obj.scale;
    const panelW = 820;
    const panelH = 520;
    const px = (width - panelW) / 2;
    const py = (height - panelH) / 2 - 40;

    // 1. Overlay gelap
    const overlay = obj.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.78)
        .setInteractive()
        .setVisible(false);

    // 2. Panel modal
    const panel = createRolePanel(obj, px, py, panelW, panelH, { top: 0x00B2EE, bottom: 0x5053FF, bgColor: 0x0c0c18, radius: 24 });
    panel.setVisible(false);

    // 3. Judul & subjudul
    const titleText = obj.add.text(width / 2, py + 56, cfg.title, {
        font: '38px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.03
    }).setOrigin(0.5).setVisible(false);

    const subText = obj.add.text(width / 2, py + 118, cfg.subtitle, {
        font: '22px Xirod',
        color: '#7FE7FF',
        align: 'center',
        wordWrap: { width: panelW - 140 }
    }).setOrigin(0.5).setVisible(false);

    // 4. Kotak daftar hasil
    const listBg = obj.add.graphics();
    listBg.fillStyle(0x14141f, 1);
    listBg.fillRoundedRect(px + 60, py + 170, panelW - 120, 250, 14);
    listBg.setVisible(false);

    const listTexts = cfg.variables.map((v, i) => {
        return obj.add.text(px + 90, py + 205 + i * 46, v, {
            font: '24px Xirod',
            color: '#FFFFFF',
            letterSpacing: 0.02,
            wordWrap: { width: panelW - 180 }
        }).setOrigin(0, 0.5).setVisible(false);
    });

    // 5. Tombol DONE & tutup ✕
    const doneBtn = createModalButton(obj, width / 2, py + 450, 'DONE', () => hideAskAIModal(obj));
    doneBtn.setVisible(false);

    const closeX = obj.add.text(px + panelW - 44, py + 40, '✕', {
        font: '34px NFS',
        color: '#8EA0FF'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);
    closeX.on('pointerdown', () => hideAskAIModal(obj));

    obj._askAIModal = { overlay, panel, titleText, subText, listBg, listTexts, doneBtn, closeX };
    showAskAIModal(obj, cfg);
}

function showAskAIModal (obj, cfg)
{
    const m = obj._askAIModal;
    m.overlay.setVisible(true);
    m.panel.setVisible(true);
    m.titleText.setText(cfg.title).setVisible(true);
    m.subText.setText(cfg.subtitle).setVisible(true);
    m.listBg.setVisible(true);
    m.doneBtn.setVisible(true);
    m.closeX.setVisible(true);

    m.listTexts.forEach((t, i) => {
        if (cfg.variables[i] !== undefined) {
            t.setText(cfg.variables[i]).setVisible(true);
        } else {
            t.setVisible(false);
        }
    });

    // Titik masuk untuk AI asli di masa depan
    if (typeof cfg.onAsk === 'function') cfg.onAsk(obj, cfg.variables);
}

function hideAskAIModal (obj)
{
    const m = obj._askAIModal;
    if (!m) return;
    m.overlay.setVisible(false);
    m.panel.setVisible(false);
    m.titleText.setVisible(false);
    m.subText.setVisible(false);
    m.listBg.setVisible(false);
    m.listTexts.forEach((t) => t.setVisible(false));
    m.doneBtn.setVisible(false);
    m.closeX.setVisible(false);
}

//  ── Tombol ANSWER = Master Validation (sama untuk semua role) ──────────
//  Satu pertanyaan bersama untuk seluruh tim. Tiap role memegang sebagian
//  datanya, jadi jawaban baru lengkap kalau tim menggabungkan temuan.
export function createValidationButton(obj, x, y, opts = {}) {
    const {
        title = 'MASTER VALIDATION PANEL',
        subtitle = 'One question for the whole team. Each role holds part of the answer combine your data, then submit.',
        fields = [
            { label: 'Main culprit',  placeholder: 'e.g. 409' },
            { label: 'Victim',        placeholder: 'e.g. ID-204 (token stolen)' },
            { label: 'Token used',    placeholder: 'e.g. TKN_SALT04' },
            { label: 'Attack method', placeholder: 'e.g. Session Hijacking / Token Theft' },
            { label: 'Infected port', placeholder: 'e.g. 5432' },
            { label: 'Incident time', placeholder: 'e.g. 02:15:30' },
            { label: 'Attacker IP',   placeholder: 'e.g. 10.0.4.15' },
            { label: 'Victim IP',     placeholder: 'e.g. 192.168.1.88' }
        ],
        onSubmit = null
    } = opts;

    const sceneKey = obj.sys.settings.key;
    const w = 250;
    const h = 84;
    const border = 8;

    const btn = obj.add.container(x, y);
    const g = obj.add.graphics();
    g.fillGradientStyle(0x00E676, 0x00E676, 0x00B2EE, 0x00B2EE, 0.988, 0.988, 0.988, 0.988);
    g.fillRoundedRect(-w / 2, -h / 2, w, h, 30);
    g.fillStyle(0x12121e, 1);
    g.fillRoundedRect(-w / 2 + border, -h / 2 + border, w - border * 2, h - border * 2, 24);

    const label = obj.add.text(0, 0, 'ANSWER', {
        font: '28px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.04
    }).setOrigin(0.5);

    btn.add([g, label]);
    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.06, scaleY: 1.06, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerout', () => {
        obj.tweens.add({ targets: btn, scaleX: 1.0, scaleY: 1.0, duration: 150, ease: 'Power2' });
    });
    btn.on('pointerdown', () => openValidationModal(obj, btn, label, { title, subtitle, fields, onSubmit, sceneKey }));

    return btn;
}

function openValidationModal (obj, btn, label, cfg)
{
    if (obj._validationModal) {
        showValidationModal(obj, cfg);
        return;
    }

    const { width, height } = obj.scale;
    const panelW = 1200;
    const panelH = 680;
    const px = (width - panelW) / 2;
    const py = (height - panelH) / 2 - 40;

    // 1. Overlay gelap
    const overlay = obj.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.78)
        .setInteractive()
        .setVisible(false);

    // 2. Panel modal
    const panel = createRolePanel(obj, px, py, panelW, panelH, { top: 0x00B2EE, bottom: 0x5053FF, bgColor: 0x0c0c18, radius: 24 });
    panel.setVisible(false);

    // 3. Judul & subjudul
    const titleText = obj.add.text(width / 2, py + 56, cfg.title, {
        font: '40px ContourGenerator',
        color: '#FFFFFF',
        letterSpacing: 0.03
    }).setOrigin(0.5).setVisible(false);

    const subText = obj.add.text(width / 2, py + 122, cfg.subtitle, {
        font: '22px Xirod',
        color: '#7FE7FF',
        align: 'center',
        wordWrap: { width: panelW - 160 }
    }).setOrigin(0.5).setVisible(false);

    // 4. Baris label + input (8 kolom validasi, layout 2 kolom)
    const rows = cfg.fields.map((f, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const y = py + 205 + row * 84;
        const labelX = px + 60 + col * 600;
        const inputX = px + 400 + col * 600;

        const labelText = obj.add.text(labelX, y, f.label, {
            font: '20px Xirod',
            color: '#8EA0FF',
            letterSpacing: 0.04,
            wordWrap: { width: 140 }
        }).setOrigin(0, 0.5).setVisible(false);

        const domInput = obj.add.dom(inputX, y).createFromHTML(
            '<input type="text" id="validation-input-' + cfg.sceneKey + '-' + i + '" placeholder="' + f.placeholder + '" ' +
            'style="width: 300px; padding: 13px 16px; font-size: 20px; font-family: Arial, sans-serif; ' +
            'background: #14141f; color: #ffffff; border: 2px solid #00B2EE; border-radius: 12px; ' +
            'outline: none; text-align: center;" />'
        );
        domInput.setVisible(false);
        return { labelText, domInput };
    });

    // 5. Tombol SUBMIT & CANCEL
    const submitBtn = createModalButton(obj, width / 2 - 170, py + 620, 'SUBMIT', () => {
        submitValidation(obj, btn, label, cfg, rows);
    });
    const cancelBtn = createModalButton(obj, width / 2 + 170, py + 620, 'CANCEL', () => {
        hideValidationModal(obj);
    });
    submitBtn.setVisible(false);
    cancelBtn.setVisible(false);

    // 6. Tombol tutup ✕
    const closeX = obj.add.text(px + panelW - 44, py + 40, '✕', {
        font: '34px NFS',
        color: '#8EA0FF'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false);
    closeX.on('pointerdown', () => hideValidationModal(obj));

    // 7. Tekan Enter di input mana pun = submit
    rows.forEach((r) => {
        const node = r.domInput.node.querySelector('input');
        if (node) {
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitValidation(obj, btn, label, cfg, rows);
                }
            });
        }
    });

    obj._validationModal = { overlay, panel, titleText, subText, rows, submitBtn, cancelBtn, closeX };
    showValidationModal(obj, cfg);
}

function showValidationModal (obj, cfg)
{
    const m = obj._validationModal;
    m.overlay.setVisible(true);
    m.panel.setVisible(true);
    m.titleText.setText(cfg.title).setVisible(true);
    m.subText.setText(cfg.subtitle).setVisible(true);
    m.submitBtn.setVisible(true);
    m.cancelBtn.setVisible(true);
    m.closeX.setVisible(true);

    m.rows.forEach((r, i) => {
        r.labelText.setVisible(true);
        r.domInput.setVisible(true);
        if (r.domInput.node) r.domInput.node.style.display = 'block';
        const input = r.domInput.node.querySelector('input');
        if (input) input.value = '';
    });

    // Fokus ke kolom pertama
    const first = m.rows[0] && m.rows[0].domInput.node.querySelector('input');
    if (first) {
        first.focus();
        if (first.select) first.select();
    }
}

function hideValidationModal (obj)
{
    const m = obj._validationModal;
    if (!m) return;
    m.overlay.setVisible(false);
    m.panel.setVisible(false);
    m.titleText.setVisible(false);
    m.subText.setVisible(false);
    m.submitBtn.setVisible(false);
    m.cancelBtn.setVisible(false);
    m.closeX.setVisible(false);
    m.rows.forEach((r) => {
        r.labelText.setVisible(false);
        r.domInput.setVisible(false);
        if (r.domInput.node) r.domInput.node.style.display = 'none';
    });
}

function submitValidation (obj, btn, label, cfg, rows)
{
    const values = rows.map((r) => {
        const input = r.domInput.node.querySelector('input');
        return input ? input.value.trim() : '';
    });

    let empty = false;
    rows.forEach((r, i) => {
        const input = r.domInput.node.querySelector('input');
        if (!values[i]) {
            if (input) {
                input.style.borderColor = '#FF6B6B';
                setTimeout(() => { input.style.borderColor = '#00B2EE'; }, 900);
            }
            empty = true;
        } else if (input) {
            input.style.borderColor = '#00E676';
        }
    });
    if (empty) return;

    // Simpan jawaban gabungan tim ke registry
    const answer = {};
    cfg.fields.forEach((f, i) => {
        const key = f.label.replace(/\n/g, ' ');
        answer[key] = values[i];
    });
    obj.registry.set('master_answer', { fields: answer, submittedAt: new Date().toISOString() });
    console.log('[MASTER ANSWER]', answer);

    if (typeof cfg.onSubmit === 'function') cfg.onSubmit(answer);

    // Tandai tombol sudah dijawab
    label.setText('ANSWERED');
    label.setColor('#6DFFB0');

    // Toast sukses
    const toast = obj.add.text(obj.scale.width / 2, obj.scale.height / 2 - 340, 'MASTER ANSWER SUBMITTED', {
        font: '36px NFS',
        color: '#6DFFB0',
        letterSpacing: 0.05
    }).setOrigin(0.5).setDepth(1000);
    obj.tweens.add({
        targets: toast,
        alpha: 0,
        y: toast.y - 30,
        delay: 1100,
        duration: 450,
        onComplete: () => toast.destroy()
    });

    hideValidationModal(obj);
}