import { Scene } from 'phaser';
import { createAskAIButton, createBackButton, createHeaderLine, createRolePanel, createValidationButton, setupTimeText } from './shared';

const WHITE = '#FFFFFF';
const CYAN = '#C9A8FF';
const MUTED = '#9E8FD0';
const AMBER = '#FFC24B';
const GREEN = '#6DFFB0';
const RED = '#FF6B6B';
const PURPLE = '#D9C2FF';

export class RoleServerAdm extends Scene
{
    constructor ()
    {
        super('RoleServerAdm');
    }

    create ()
    {
        const { width, height } = this.scale;

        //  Latar belakang sama seperti scene lain
        this.add.video(width / 2, height / 2, 'Matrix1')
            .setScale(1.5, 1.5)
            .play(true);

        this.add.rectangle(width / 2, height / 2, width, height, 0x050510, 0.82);

        //  Header Dashboard
        this.add.text(140, 116, "SERVER ADMIN DASHBOARD", {
            font: '48px ContourGenerator',
            color: WHITE,
            letterSpacing: 0.02
        });
        this.add.text(142, 190, "Session: Incident-Alpha     •     Role: SysAdmin", {
            font: '26px Xirod',
            color: PURPLE,
            letterSpacing: 0.05
        });
        setupTimeText(this);
        createHeaderLine(this, 140, 238, 1640);

        //  ── Panel Data Utama ────────────────────────────────────────────
        createRolePanel(this, 110, 258, 1700, 380, { top: 0x9C27B0, bottom: 0x5053FF });

        this.add.text(150, 288, " NETWORK TRAFFIC ANALYSIS — March 12, 2026", {
            font: '27px NFS',
            color: PURPLE,
            letterSpacing: 0.04
        });

        //  Sub-panel: PORT STATUS
        this.createInnerPanel(140, 324, 790, 292, "PORT STATUS");
        this.add.text(195, 372, "PORT", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(320, 372, "SERVICE", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(570, 372, "STATUS", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(760, 372, "TRAFFIC", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);

        const ports = [
            { port: '22',   svc: 'SSH',      st: '🟢', tr: '1.2MB/s',  bad: false },
            { port: '443',  svc: 'HTTPS',    st: '🟢', tr: '3.4MB/s',  bad: false },
            { port: '8080', svc: 'HTTP',     st: '🟢', tr: '0.8MB/s',  bad: false },
            { port: '5432', svc: 'POSTGRES', st: '🔴', tr: '847MB/s',  bad: true }
        ];
        ports.forEach((p, i) => {
            const y = 408 + i * 46;
            const rowColor = p.bad ? RED : WHITE;
            this.add.text(195, y, p.port, { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(320, y, p.svc,   { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(570, y, p.st,    { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(760, y, p.tr,    { font: '20px Xirod', color: p.bad ? RED : GREEN }).setOrigin(0, 0.5);
        });

        //  Sub-panel: CONNECTION LOG
        this.createInnerPanel(960, 324, 790, 292, "CONNECTION LOG");
        this.add.text(995, 372, "TIME", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(1260, 372, "SRC IP", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);

        const conns = [
            { time: '02:15:30', ip: '10.0.4.15',    dup: false },
            { time: '02:15:30', ip: '192.168.1.88', dup: true },
            { time: '02:16:00', ip: '10.0.4.15',    dup: false },
            { time: '02:17:00', ip: '192.168.1.88', dup: false },
            { time: '02:18:00', ip: '10.0.4.15',    dup: false }
        ];
        conns.forEach((c, i) => {
            const y = 408 + i * 36;
            if (c.dup) {
                const hl = this.add.graphics();
                hl.fillStyle(0xffc24b, 0.10);
                hl.fillRoundedRect(970, y - 14, 540, 28, 8);
            }
            this.add.text(995, y, c.time, { font: '20px Xirod', color: c.dup ? AMBER : WHITE }).setOrigin(0, 0.5);
            this.add.text(1260, y, c.ip,  { font: '20px Xirod', color: c.dup ? AMBER : WHITE }).setOrigin(0, 0.5);
        });

        //  Navigasi
        createBackButton(this, 150, 990, () => this.scene.start('PlayerMain'));
        createAskAIButton(this, 1420, 990, {
            title: 'ASK A.I.R.I.S.',
            subtitle: 'Ask the AI to analyze the traffic and pull the key variables from your dashboard.',
            variables: [
                'Encryption Protocol : SHA-256',
                'Suspicious Port     : 5432',
                'Anomaly             : Two IPs connected at the SAME time'
            ]
        });
        createValidationButton(this, 1715, 990, {
            title: 'MASTER VALIDATION PANEL',
            subtitle: 'One question for the whole team. Each role holds part of the answer combine your data, then submit.'
        });
        this.add.text(960, 1018, "SUB-PROBLEM 1 — THE DISCREPANCY TRAP", {
            font: '18px Xirod',
            color: MUTED,
            letterSpacing: 0.06
        }).setOrigin(0.5);
    }

    createInnerPanel (x, y, w, h, title)
    {
        const g = this.add.graphics();
        g.fillGradientStyle(0x5053FF, 0x5053FF, 0x9C27B0, 0x9C27B0, 0.5, 0.5, 0.5, 0.5);
        g.fillRoundedRect(x, y, w, h, 14);
        g.fillStyle(0x12121e, 1);
        g.fillRoundedRect(x + 4, y + 4, w - 8, h - 8, 11);
        this.add.text(x + 20, y + 16, title, {
            font: '22px NFS',
            color: PURPLE,
            letterSpacing: 0.04
        });
        return g;
    }
}
