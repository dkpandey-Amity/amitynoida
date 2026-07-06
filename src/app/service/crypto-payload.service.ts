import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CryptoPayloadService {

  private readonly payloadAesKey = 'AmITY!s$3cur3K3y#2026@Amity!ABD1';
  private readonly payloadAesIv = 'AMXV#5020@Amity!';

  private readonly key = CryptoJS.enc.Utf8.parse(this.payloadAesKey);
  private readonly iv = CryptoJS.enc.Utf8.parse(this.payloadAesIv);

  encrypt(payload: object): string {
    const withTs = {
      ...payload,
      ts: Date.now(),
    };

    const json = JSON.stringify(withTs);

    return CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(json),
      this.key,
      {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();
  }

  decrypt(cipherText: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(
        cipherText,
        this.key,
        {
          iv: this.iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );

      const json = bytes.toString(CryptoJS.enc.Utf8);

      return JSON.parse(json);
    } catch (error) {
      console.error('Decrypt Error:', error);
      return null;
    }
  }
}