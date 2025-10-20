import { Injectable } from '@angular/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class BiometricService {

  async isAvailable(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      const res = await NativeBiometric.isAvailable();
      return !!res.isAvailable;
    } catch {
      return false;
    }
  }

  async verifyIdentity(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return false;
    try {
      await NativeBiometric.verifyIdentity({ reason: 'Autenticación requerida' });
      return true;
    } catch {
      return false;
    }
  }

  async saveCredentials(email: string, password: string, server: string) {
    if (!Capacitor.isNativePlatform()) return;
    await NativeBiometric.setCredentials({ username: email, password, server });
  }

  async getCredentials(server: string): Promise<{ username: string; password: string } | null> {
    if (!Capacitor.isNativePlatform()) return null;
    try {
      const creds = await NativeBiometric.getCredentials({ server });
      return { username: creds.username, password: creds.password };
    } catch {
      return null;
    }
  }
}
