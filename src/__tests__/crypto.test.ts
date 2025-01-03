import { describe, expect, test } from "vitest"
import {crypt,decrypt} from './../utils/crypto';

const data = "I'm State Man";
const key = "State-Man";

describe('Crypt and decrypt', () => {
    test("should crypt a data",()=>{
        const encrypted = crypt(data,key);
        expect(encrypted).not.toBe(data)
    })
    test("should decrypt a data",()=>{
        const encrypted = crypt(data,key);
        const decrypted = decrypt(encrypted,key);
        expect(decrypted).toBe(data);
    })
})