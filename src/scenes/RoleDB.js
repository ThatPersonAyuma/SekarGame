import { Scene } from 'phaser';
import { createAskAIButton, createBackButton, createHeaderLine, createRolePanel, createValidationButton, setupTimeText } from './shared';

const WHITE = '#FFFFFF';
const CYAN = '#7FE7FF';
const MUTED = '#8EA0FF';
const AMBER = '#FFC24B';
const RED = '#FF6B6B';

export class RoleDB extends Scene
{
    constructor ()
    {
        super('RoleDB');
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
        this.add.text(140, 116, "DATABASE ADMIN DASHBOARD", {
            font: '48px ContourGenerator',
            color: WHITE,
            letterSpacing: 0.02
        });
        this.add.text(142, 190, "Session: Incident-Alpha     •     Role: DBA", {
            font: '26px Xirod',
            color: CYAN,
            letterSpacing: 0.05
        });
        setupTimeText(this);
        createHeaderLine(this, 140, 238, 1640);

        //  ── Panel Data Utama ────────────────────────────────────────────
        createRolePanel(this, 110, 258, 1700, 340, { top: 0x00B2EE, bottom: 0x5053FF });

        this.add.text(150, 292, "🗄️ DATABASE AUDIT LOGS — sys_audit", {
            font: '27px NFS',
            color: CYAN,
            letterSpacing: 0.04
        });

        //  Header tabel
        const headerBg = this.add.graphics();
        headerBg.fillStyle(0x1a1a2e, 0.85);
        headerBg.fillRoundedRect(140, 334, 1640, 38, 10);
        this.add.text(195, 348, "#", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(270, 348, "TIMESTAMP", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(460, 348, "QUERY ID", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(650, 348, "TABLE NAME", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(950, 348, "USER", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);
        this.add.text(1120, 348, "SESSION TOKEN", { font: '21px Xirod', color: CYAN }).setOrigin(0, 0.5);

        //  Baris data audit
        const rows = [
            { no: '1', ts: '02:13:00', qid: 'Q-1001', table: 'products',        user: '034', token: 'TKN_LEGACY_01', flag: null },
            { no: '2', ts: '02:14:00', qid: 'Q-1002', table: 'user_profiles',   user: '409', token: 'TKN_SALT04',    flag: null },
            { no: '3', ts: '02:15:30', qid: 'Q-1003', table: 'users_sensitive', user: '204', token: 'TKN_SALT04',    flag: null },
            { no: '4', ts: '02:16:00', qid: 'Q-1004', table: 'transactions',    user: '409', token: 'TKN_SALT04',    flag: null },
            { no: '5', ts: '02:17:00', qid: 'Q-1005', table: 'products',        user: '204', token: 'TKN_LEGACY_02', flag: null }
        ];

        rows.forEach((r, i) => {
            const y = 392 + i * 42;
            const highlight = this.add.graphics();
            if (r.flag === 'KONTRADIK') {
                highlight.fillStyle(0xffc24b, 0.10);
            } else {
                highlight.fillStyle(0xffffff, 0.03);
            }
            highlight.fillRoundedRect(140, y - 14, 1640, 32, 8);

            const rowColor = r.flag ? AMBER : WHITE;
            this.add.text(195, y, r.no,    { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(270, y, r.ts,    { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(460, y, r.qid,   { font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
            this.add.text(650, y, r.table, {
                font: '20px Xirod',
                color: r.table === 'users_sensitive' ? RED : rowColor
            }).setOrigin(0, 0.5);
            this.add.text(950, y, r.user,  { font: '20px Xirod', color: r.user === '409' ? AMBER : rowColor }).setOrigin(0, 0.5);
            this.add.text(1120, y, r.token,{ font: '20px Xirod', color: rowColor }).setOrigin(0, 0.5);
        });

        //  Navigasi
        createBackButton(this, 150, 990, () => this.scene.start('PlayerMain'));
        createAskAIButton(this, 1420, 990, {
            title: 'ASK A.I.R.I.S.',
            subtitle: 'Ask the AI to verify the token and pull the key variables from your dashboard.',
            variables: [
                'Salt Value    : 04',
                'Session Token : TKN_SALT04',
                'Token Owner   : ID-204 (Budi Santoso)',
                'Token User    : ID-409 (from access logs)'
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
