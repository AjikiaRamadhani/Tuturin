import { BaseService } from './BaseService.js';
import * as Linking from 'expo-linking';

export class AuthService extends BaseService {
  async getSession() {
    return this.unwrap(await this.client.auth.getSession());
  }

  subscribe(listener) {
    const { data } = this.client.auth.onAuthStateChange(listener);
    return () => data.subscription.unsubscribe();
  }

  async signUp(email, password, displayName) {
    const data = this.unwrap(await this.client.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    }));
    return { needsConfirmation: !data.session };
  }

  async signIn(email, password) {
    return this.unwrap(await this.client.auth.signInWithPassword({ email, password }));
  }

  async signOut() {
    let signOutError = null;
    try {
      const { error } = await this.client.auth.signOut({ scope: 'local' });
      signOutError = error;
    } catch (error) {
      signOutError = error;
    }

    // Supabase clears the local session first for scope=local. A failed best-effort
    // revocation request must not make an already signed-out user see a logout error.
    if (signOutError) {
      const current = await this.client.auth.getSession();
      if (current.data?.session) this.unwrap({ data: null, error: signOutError });
    }
  }

  async resetPassword(email) {
    this.unwrap(await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: Linking.createURL('auth-callback'),
    }));
  }

  async updatePassword(password) {
    return this.unwrap(await this.client.auth.updateUser({ password }));
  }

  async completeEmailLink({ code, tokenHash, type, accessToken, refreshToken }) {
    if (code) return this.unwrap(await this.client.auth.exchangeCodeForSession(code));
    if (tokenHash && type) {
      return this.unwrap(await this.client.auth.verifyOtp({ token_hash: tokenHash, type }));
    }
    if (accessToken && refreshToken) {
      return this.unwrap(await this.client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }));
    }
    throw new Error('Tautan tidak lengkap atau sudah kedaluwarsa. Minta tautan baru.');
  }

  async deleteAccount() {
    this.unwrap(await this.client.rpc('delete_my_account'));
    try {
      await this.client.auth.signOut();
    } catch {
      // Akun sudah terhapus; pemulihan sesi lokal tidak boleh membatalkan keberhasilan ini.
    }
  }
}

