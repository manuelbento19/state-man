import { describe, expect, test } from "vitest"
import {generateKey, encrypt, decrypt} from './../utils/crypto';

const key = await generateKey("State-Man");
const data = "I'm State Man";

describe('Crypt and decrypt', () => {
    test("should encrypt a data",async()=>{
        const encrypted = await encrypt(data,key);
        expect(encrypted).not.toBe(data)
    })
    test("should decrypt a data",async()=>{
        const encrypted = await encrypt(data,key);
        const decrypted = await decrypt(encrypted,key);
        expect(decrypted).toBe(data);
    })
})