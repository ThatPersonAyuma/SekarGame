import { Scene } from 'phaser';
import { createAskAIButton, createBackButton, createHeaderLine, createRolePanel, createValidationButton, setupTimeText } from './shared';

const WHITE = '#FFFFFF';
const CYAN = '#7FE7FF';
const MUTED = '#8EA0FF';
const AMBER = '#FFC24B';
const RED = '#FF6B6B';

export class RoleLog extends Scene
{
    constructor ()
    {
        super('RoleLog');
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
        this.add.text(140, 116, "LOG ANALYST DASHBOARD", {
            font: '48px ContourGenerator',
            color: WHITE,
            letterSpacing: 0.02
        });
        this.add.text(142, 190, "Session: Incident-Alpha     •     Role: Analyst", {
            font: '26px Xirod',
            color: CYAN,
            letterSpacing: 0.05
        });
        setupTimeText(this);
        createHeaderLine(this, 140, 238, 1640);

        //  ── Panel Data Utama ────────────────────────────────────────────
        createRolePanel(this, 110, 258, 1700, 400, { top: 0x00E676, bottom: 0x00B2EE });

        this.add.text(150, 292, " SYSTEM ACCESS LOGS — March 12, 2026", {
            font: '27px NFS',
            color: CYAN,
            letterSpacing: 0.04
        });

        //  Header tabel
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x1a1a2e, 0.85);
        headerBg.fillRoundedRect(140, 334, 1640, 38, 10);
        this.add.text(195, 348, "#", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(280, 348, "TIMESTAMP", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(480, 348, "EVENT ID", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(660, 348, "USER", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(840, 348, "IP ADDRESS", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(1120, 348, "STATUS", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(1300, 348, "ACTION", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);

        //  Baris data log
        const rows = [
            { no: '1',  ts: '02:12:33', ev: 'EV-0098', user: 'ID-034', ip: '10.0.4.12',    status: '✅', act: 'Login',  flag: null },
            { no: '2',  ts: '02:13:45', ev: 'EV-0099', user: 'ID-034', ip: '10.0.4.12',    status: '✅', act: 'Query',  flag: null },
            { no: '3',  ts: '02:14:00', ev: 'EV-0100', user: 'ID-409', ip: '10.0.4.15',    status: '✅', act: 'Login',  flag: 'ALERT!' },
            { no: '4',  ts: '02:15:30', ev: 'EV-0101', user: 'ID-409', ip: '10.0.4.15',    status: '✅', act: 'SELECT', flag: 'ALERT!' },
            { no: '5',  ts: '02:16:45', ev: 'EV-0102', user: 'ID-409', ip: '10.0.4.15',    status: '✅', act: 'Query',  flag: null },
            { no: '6',  ts: '02:17:00', ev: 'EV-0103', user: 'ID-204', ip: '192.168.1.88', status: '✅', act: 'Login',  flag: null },
            { no: '7',  ts: '02:17:30', ev: 'EV-0104', user: 'ID-204', ip: '192.168.1.88', status: '❌', act: 'Access', flag: 'GAGAL' },
            { no: '8',  ts: '02:18:00', ev: 'EV-0105', user: 'ID-409', ip: '10.0.4.15',    status: '⚠️', act: 'Logout', flag: null }
        ];

        rows.forEach((r, i) => {
            const y = 386 + i * 34;
            const highlight = this.add.graphics();
            if (r.flag === 'ALERT!') {
                highlight.fillStyle(0xffc24b, 0.10);
            } else if (r.flag === 'GAGAL') {
                highlight.fillStyle(0xff6b6b, 0.10);
            } else {
                highlight.fillStyle(0xffffff, 0.03);
            }
            highlight.fillRoundedRect(140, y - 14, 1640, 28, 8);

            const rowColor = r.flag === 'GAGAL' ? RED : WHITE;
            this.add.text(195, y, r.no,     { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(280, y, r.ts,     { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(480, y, r.ev,     { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(660, y, r.user,   { font: '20px Xirod', color: r.user === 'ID-409' ? AMBER : rowColor }).setOrigin(0, 0.5);
            this.add.text(840, y, r.ip,     { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(1120, y, r.status,{ font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(1300, y, r.act,   { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
        });

        //  Navigasi
        createBackButton(this, 150, 990, () => this.scene.start('PlayerMain'));
        createAskAIButton(this, 1420, 990, {
            title: 'ASK A.I.R.I.S.',
            subtitle: 'Ask the AI to pull the key variables from your dashboard.',
            variables: [
                'Incident Window : 02:14:00 - 02:18:00',
                'Suspicious IP   : 10.0.4.15',
                'Primary User    : ID-409'
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
}
