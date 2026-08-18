// MOCK FIRESTORE DOCUMENT DATA
const PROJECT_ID = 'gamesekar-52926';
const COLLECTION = 'problems';
const DOCUMENT_ID = 'PROB-002';
const DATABASE_ID = '(default)';

// Native REST endpoint URL
const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/${DATABASE_ID}/documents/${COLLECTION}/${DOCUMENT_ID}`;

class DBHandler{
    static async getDocument() {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const rawData = await response.json();
            console.log('Raw Firestore Payload:', rawData);
            
            // Parse the data out of the strict REST format
            const cleanedData = parseFirestore(rawData.fields);
            console.log('Cleaned JavaScript Object:', cleanedData);
            return cleanedData
        } catch (error) {
            console.error('Fetch failed:', error);
        }
    }

    // Helper to unpack Firestore typed JSON format into plain JS objects
    static parseFirestore(doc) {
        if (!doc || typeof doc !== 'object') {
            return doc;
        }

        // Tipe Data Dasar Firestore
        if ('stringValue' in doc) return doc.stringValue;
        if ('integerValue' in doc) return Number(doc.integerValue);
        if ('doubleValue' in doc) return Number(doc.doubleValue);
        if ('booleanValue' in doc) return doc.booleanValue;
        if ('timestampValue' in doc) return doc.timestampValue;
        if ('nullValue' in doc) return null;

        // Tipe Array
        if ('arrayValue' in doc) {
            const values = doc.arrayValue.values || [];
            return values.map(parseFirestore);
        }

        // Tipe Map
        if ('mapValue' in doc) {
            return parseFirestore(doc.mapValue.fields || {});
        }

        // Struktur Dokumen Utama (Memiliki properti 'fields')
        if ('fields' in doc) {
            return parseFirestore(doc.fields);
        }

        // Objek Key-Value Biasa
        const result = {};
        for (const [key, value] of Object.entries(doc)) {
            result[key] = parseFirestore(value);
        }
        return result;
    }
}
    