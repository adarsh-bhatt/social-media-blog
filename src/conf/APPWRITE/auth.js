import { Client, Account, ID } from "appwrite";
import conf from "../conf";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  // 🔹 CREATE ACCOUNT
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        return this.login({ email, password });
      }

      return userAccount;
    } catch (error) {
      console.error("Auth :: createAccount error", error);
      return null;
    }
  }

  // 🔹 LOGIN
  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(
        email,
        password
      );
    } catch (error) {
      console.error("Auth :: login error", error);
      return null;
    }
  }

  // 🔹 GET CURRENT USER (MOST IMPORTANT FIX)
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      // ✅ THIS IS EXPECTED WHEN USER IS LOGGED OUT
      if (error.code === 401) {
        return null;
      }

      console.error("Auth :: getCurrentUser error", error);
      return null;
    }
  }

  // 🔹 LOGOUT
  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.error("Auth :: logout error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
