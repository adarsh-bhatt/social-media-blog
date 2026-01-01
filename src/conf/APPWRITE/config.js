import { Client, ID, TablesDB, Query, Storage } from "appwrite";
import conf from "../conf";

export class Service {
  client = new Client();
  database;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.database = new TablesDB(this.client);
    this.bucket = new Storage(this.client);
  }

  // ================= POSTS =================

  async createPost({ title, content, featuredImage, status, authorId }) {
    try {
      return await this.database.createRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId: ID.unique(),
        data: {
          title,
          content,
          featuredImage,
          status,
          authorId,
        },
      });
    } catch (error) {
      console.log("Appwrite :: createPost error", error);
      throw error;
    }
  }

  async updatePost(rowId, { title, content, featuredImage, status }) {
    try {
      return await this.database.updateRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId,
        data: {
          title,
          content,
          featuredImage,
          status,
        },
      });
    } catch (error) {
      console.log("Appwrite :: updatePost error", error);
      throw error;
    }
  }

  async deletePost(rowId) {
    try {
      await this.database.deleteRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId,
      });
      return true;
    } catch (error) {
      console.log("Appwrite :: deletePost error", error);
      return false;
    }
  }

  async getPost(rowId) {
    try {
      return await this.database.getRow({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        rowId,
      });
    } catch (error) {
      console.log("Appwrite :: getPost error", error);
      return null;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.database.listRows({
        databaseId: conf.appwriteDatabaseId,
        tableId: conf.appwriteCollectionId,
        queries,
      });
    } catch (error) {
      console.log("Appwrite :: getPosts error", error);
      return [];
    }
  }

  // ================= FILES =================

  async uploadFile(file) {
    try {
      return await this.bucket.createFile({
        bucketId: conf.appwriteBucketId,
        fileId: ID.unique(),
        file,
      });
    } catch (error) {
      console.log("Appwrite :: uploadFile error", error);
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      if (!fileId) return false;

      await this.bucket.deleteFile({
        bucketId: conf.appwriteBucketId,
        fileId,
      });
      return true;
    } catch (error) {
      console.log("Appwrite :: deleteFile error", error);
      return false;
    }
  }

  // 🔒 SAFE IMAGE VIEW (NEW APPWRITE METHOD)
getFileView(fileId) {
  if (!fileId || typeof fileId !== "string" || fileId.trim() === "") {
    return null;
  }

  return this.bucket
    .getFileView(conf.appwriteBucketId, fileId)
    .toString();
}

}

const service = new Service();
export default service;
