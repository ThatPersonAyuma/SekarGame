import { firestoreDocument } from './Database';

 //this is a dummy secret
const OR_KEY = "DUMMY"
export class AIHelper {
    
    static async sendPromptToAI(sceneInstance) { // Kirimkan instance scene ke fungsi
        console.log("from sendPrompt");
        
        const input = document.getElementById('chat-input');
        const promptText = input.value.trim();
        if (!promptText) {
            console.log("prompt kososng");return};

        // Tampilkan pesan USER langsung
        sceneInstance.addMessage('user', promptText);
        input.value = '';

        const lowerPrompt = promptText.toLowerCase();

        // 1. Filter Banned Strings
        const isBanned = firestoreDocument["banned_strings"].some(b => lowerPrompt.includes(b.toLowerCase()));
        if (isBanned) {
            sceneInstance.addMessage('ai', '[SECURITY VIOLATION DETECTED] Prompt diblokir.');
            console.log("Banne dstrings");
            return;
        }

        // UI Loading state
        const sendBtn = document.getElementById('send-btn');
        sendBtn.disabled = true;
        sendBtn.innerText = 'WAIT...';

        // Variable aiStream di-deklarasikan di luar try agar bisa diakses di catch block
        let aiStream = null;
        
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OR_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [
                        { role: "system", content: firestoreDocument["system_prompt"] },
                        { role: "user", content: promptText }
                    ],
                    stream: true
                })
            });
            console.log("Check point 2");
            // 1. HANDLING HTTP ERROR (Contoh: 401 Unauthorized, 429 Quota Exceeded, 500 Server Error)
            if (!response.ok) {
                aiStream = sceneInstance.startStreamingMessage('ai');
                let errorDetails = `HTTP ${response.status}: ${response.statusText}`;

                try {
                    // Coba baca pesan error resmi dari OpenRouter JSON
                    const errorJson = await response.json();
                    if (errorJson?.error?.message) {
                        errorDetails = errorJson.error.message;
                    }
                } catch (_) {
                    // Jika response bukan JSON (misal HTML error dari provider)
                }

                aiStream.appendChunk(`[SYSTEM ERROR]: Gagal terhubung ke AI.\nDetail: ${errorDetails}`);
                aiStream.finish();
                return;
            }

            // 2. KONEKSI BERHASIL: Inisialisasi gelembung AI streaming
            aiStream = sceneInstance.startStreamingMessage('ai');

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                
                // Simpan sisa buffer yang belum utuh
                buffer = lines.pop();

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith(":")) continue;

                    if (trimmed.startsWith("data: ")) {
                        const dataPayload = trimmed.slice(6);

                        if (dataPayload === "[DONE]") {
                            aiStream.finish(); // Selesai & kunci posisi akhir Y
                            return;
                        }

                        try {
                            const parsed = JSON.parse(dataPayload);

                            // 3. HANDLING STREAM ERROR (OpenRouter terkadang mengirim error di pertengahan stream)
                            if (parsed.error) {
                                aiStream.appendChunk(`\n\n[STREAM ERROR]: ${parsed.error.message || 'Terjadi kesalahan pada model AI.'}`);
                                aiStream.finish();
                                return;
                            }

                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                aiStream.appendChunk(content);
                            }
                        } catch (e) {
                            console.error("Error parsing JSON chunk:", e);
                        }
                    }
                }
            }

            aiStream.finish();

        } catch (error) {
            console.error("Streaming error:", error);

            // 4. HANDLING NETWORK / FATAL ERROR (Misal: User offline, CORS error, Timeout)
            if (!aiStream) {
                aiStream = sceneInstance.startStreamingMessage('ai');
            }

            aiStream.appendChunk(`\n\n[CONNECTION ERROR]: Tidak dapat mengirim pesan.\n${error.message || 'Periksa koneksi internet Anda.'}`);
            aiStream.finish();

        } finally {
            console.log("End here");
            sendBtn.disabled = false;
            sendBtn.innerText = 'SEND PROMPT';
        }

        // try {
        //     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        //         method: "POST",
        //         headers: {
        //             "Authorization": `Bearer ${OR_KEY}`,
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify({
        //             model: "openrouter/free",
        //             messages: [
        //                 { role: "system", content: firestoreDocument["system_prompt"] },
        //                 { role: "user", content: promptText }
        //             ],
        //             stream: true
        //         })
        //     });

        //     if (!response.ok) return;

        //     // Inisialisasi gelembung AI streaming di Phaser
        //     const aiStream = sceneInstance.startStreamingMessage('ai');

        //     const reader = response.body.getReader();
        //     const decoder = new TextDecoder("utf-8");
        //     let buffer = "";

        //     while (true) {
        //         const { done, value } = await reader.read();
        //         if (done) break;

        //         buffer += decoder.decode(value, { stream: true });
        //         const lines = buffer.split("\n");
                
        //         // Simpan sisa buffer yang belum utuh
        //         buffer = lines.pop();

        //         for (const line of lines) {
        //             const trimmed = line.trim();
        //             if (!trimmed || trimmed.startsWith(":")) continue;

        //             if (trimmed.startsWith("data: ")) {
        //                 const dataPayload = trimmed.slice(6);

        //                 if (dataPayload === "[DONE]") {
        //                     aiStream.finish(); // Kunci posisi akhir Y
        //                     return;
        //                 }

        //                 try {
        //                     const parsed = JSON.parse(dataPayload);
        //                     const content = parsed.choices?.[0]?.delta?.content;
        //                     if (content) {
        //                         // Salurkan potongan kata langsung ke Phaser UI
        //                         aiStream.appendChunk(content);
        //                     }
        //                 } catch (e) {
        //                     console.error("Error parsing JSON chunk:", e);
        //                 }
        //             }
        //         }
        //     }

        //     aiStream.finish();

        // } catch (error) {
        //     console.error("Streaming error:", error);
        // } finally {
        //     sendBtn.disabled = false;
        //     sendBtn.innerText = 'SEND PROMPT';
        // }
    }
    // appendTerminal(`A.I.R.I.S: [COMMUNICATION ERROR] Gagal terhubung ke modul AI. (${error.message})`, 'text-red-400');

    // static appendTerminal(msg, colorClass) {
    //     const out = document.getElementById('terminal-output');
    //     const div = document.createElement('div');
    //     div.className = colorClass;
    //     div.innerText = msg;
    //     out.appendChild(div);
    //     out.scrollTop = out.scrollHeight;
    // }

    // // FINAL PASSCODE VERIFICATION
    // static verifyRollback() {
    //     const inputVal = document.getElementById('passcode-input').value.trim();
    //     if (inputVal === "5845") {
    //         alert("SYSTEM ROLLBACK SUCCESSFUL!\n\nIdentitas Pelaku: ID-409\nPort Exploit: 5432\nPasscode: 5845\n\nSelamat, tim kalian berhasil menyelesaikan Operation Midnight Phantom!");
    //     } else {
    //         alert("ROLLBACK FAILED! Passcode tidak valid. Periksa kembali hasil kalkulasi tim kalian.");
    //     }
    // }
}