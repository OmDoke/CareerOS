import crypto from "crypto";
import { env } from "../config/env";
import { logger } from "../utils/logger";

const ALGORITHM = "aes-256-gcm";

// Generate a valid key if env variable is not 32 bytes
function getValidKey(): Buffer {
  let key = (env as any).ENCRYPTION_KEY;
  if (!key) {
    logger.warn("ENCRYPTION_KEY not set in environment. Using a fallback deterministic key for dev.");
    key = "fallback_encryption_key_for_dev_only!"; // 37 chars
  }
  
  // Hash it to guarantee exactly 32 bytes
  return crypto.createHash("sha256").update(String(key)).digest();
}

export const cryptoService = {
  encrypt(text: string): string {
    if (!text) return "";
    
    try {
      const iv = crypto.randomBytes(16);
      const key = getValidKey();
      
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");
      
      const authTag = cipher.getAuthTag().toString("hex");
      
      // format: iv:authTag:encrypted
      return `${iv.toString("hex")}:${authTag}:${encrypted}`;
    } catch (error) {
      logger.error({ err: error }, "Encryption failed");
      throw new Error("Failed to encrypt data");
    }
  },

  decrypt(encryptedText: string): string {
    if (!encryptedText) return "";
    
    try {
      const parts = encryptedText.split(":");
      if (parts.length !== 3) {
        throw new Error("Invalid encrypted text format");
      }
      
      const [ivHex, authTagHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");
      const key = getValidKey();
      
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encryptedHex, "hex", "utf8");
      decrypted += decipher.final("utf8");
      
      return decrypted;
    } catch (error) {
      logger.error({ err: error }, "Decryption failed");
      throw new Error("Failed to decrypt data");
    }
  },
  
  maskApiKey(apiKey: string): string {
    if (!apiKey) return "";
    if (apiKey.length <= 8) return "********";
    return `${apiKey.substring(0, 4)}************************${apiKey.substring(apiKey.length - 4)}`;
  }
};
