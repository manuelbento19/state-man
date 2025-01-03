export async function generateKey(key: string){
    const encodedKey = new TextEncoder().encode(key);
    const hashedKey = await crypto.subtle.digest('SHA-256', encodedKey);
    const cryptoKey = await crypto.subtle.importKey("raw", hashedKey, "AES-GCM", true, ["encrypt", "decrypt"]);
    return cryptoKey;
}
const iv = crypto.getRandomValues(new Uint8Array(12));


export async function encrypt(data: string, key: CryptoKey){
    const encoded = new TextEncoder().encode(data);

    const encryptedData = await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv,
    },key,encoded)

    return encryptedData;
}

export async function decrypt(data: ArrayBuffer, key: CryptoKey){
    const decryptedData = await window.crypto.subtle.decrypt({
        name: "AES-GCM",
        iv
    },key,data)

    const decoded = new TextDecoder().decode(decryptedData);
    return decoded;
}