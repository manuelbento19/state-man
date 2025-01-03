export function generateKey(key: string){
    const encodedKey = new TextEncoder().encode(key);
    const cryptoKey = crypto.subtle.importKey("raw",encodedKey, "AES-GCM",true, ["encrypt", "decrypt"]);
    return cryptoKey;
}

export async function encrypt(data: string, key: CryptoKey){
    const encoded = new TextEncoder().encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv,
    },key,encoded)

    return encryptedData;
}

export async function decrypt(data: ArrayBuffer, key: CryptoKey){
    const decryptedData = await window.crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: new Uint8Array(12),
    },key,data)

    const decoded = new TextDecoder().decode(decryptedData);
    return decoded;
}