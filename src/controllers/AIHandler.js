const OR_KEY = "DUMMY"; //this is a dummy secret
class AIHelper {
    static async sendPromptToAI() {
        const input = document.getElementById('ai-prompt-input');
        const promptText = input.value.trim();
        if (!promptText) return;

        appendTerminal(`USER: ${promptText}`, 'text-slate-400');
        input.value = '';

        const lowerPrompt = promptText.toLowerCase();

        // 1. Filter Banned Strings
        const isBanned = firestoreDocument["banned_strings"].some(b => lowerPrompt.includes(b.toLowerCase()));
        if (isBanned) {
            appendTerminal(`A.I.R.I.S: [SECURITY VIOLATION DETECTED] Prompt diblokir. Upaya manipulasi sistem dicatat.`, 'text-red-400 font-bold');
            return;
        }

        // UI Loading state
        const sendBtn = document.getElementById('btn-send');
        sendBtn.disabled = true;
        sendBtn.innerText = 'WAIT...';
        appendTerminal(`A.I.R.I.S: [TRANSMITTING TO CORE NEURAL NETWORK...]`, 'text-amber-400/80 italic');

        try {
            // 2. Fetch OpenRouter API (Always new fresh prompt: system_prompt + user_prompt)
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

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Pre-stream error:", errorData);
                return;
                //throw new Error(`HTTP Error Status: ${response.status}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                console.log("This is a buffer: \n", buffer);
                const lines = buffer.split("\n");
                for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                // CRITICAL: Safely ignore OpenRouter's keep-alive comment lines 
                if (trimmed.startsWith(":")) continue;

                if (trimmed.startsWith("data: ")) {
                const dataPayload = trimmed.slice(6);
                
                // The stream ends with an explicit [DONE] string token
                if (dataPayload === "[DONE]") {
                    console.log("\nStream complete.");
                    return;
                }

                try {
                    const parsed = JSON.parse(dataPayload);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                    console.log("Content: ", content); // Print stream tokens out cleanly
                    }
                } catch (e) {
                    console.error("Error parsing JSON chunk:", e);
                }
                }
            }

                // Save the last partial element back to the buffer
                buffer = lines.pop();
            }
            // const data = await response.json();
            // const aiResponseText = data.choices[0]?.message?.content || "Tidak ada respon dari A.I.R.I.S.";

            // 3. Render API Response to Terminal
            // appendTerminal(`A.I.R.I.S: ${aiResponseText}`, 'text-emerald-300');
            
        } catch (error) {
            appendTerminal(`A.I.R.I.S: [COMMUNICATION ERROR] Gagal terhubung ke modul AI. (${error.message})`, 'text-red-400');
        } finally {
            sendBtn.disabled = false;
            sendBtn.innerText = 'SEND PROMPT';
        }
    }

    static appendTerminal(msg, colorClass) {
        const out = document.getElementById('terminal-output');
        const div = document.createElement('div');
        div.className = colorClass;
        div.innerText = msg;
        out.appendChild(div);
        out.scrollTop = out.scrollHeight;
    }

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