import { logger } from "../utils/logger";
import { db } from "../db/database";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";

const LOGIN_URL = "https://www.naukri.com/central-login-services/v1/login";
const DASHBOARD_URL = "https://www.naukri.com/cloudgateway-mynaukri/resman-aggregator-services/v0/users/self/dashboard";
const PROFILE_UPDATE_URL = "https://www.naukri.com/cloudgateway-mynaukri/resman-aggregator-services/v1/users/self/fullprofiles";

const DEFAULT_HEADERS = {
  "accept": "application/json",
  "appid": "105",
  "clientid": "d3skt0p",
  "content-type": "application/json",
  "referer": "https://www.naukri.com/nlogin/login",
  "systemid": "jobseeker",
  "x-requested-with": "XMLHttpRequest",
};

export class NaukriService {
  public async updateProfileSummary(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Fetch user and their naukri credentials from DB
      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      if (!user) {
        return { success: false, message: "User not found." };
      }

      const username = user.naukriUsername;
      const password = user.naukriPassword; // In production, decrypt this first
      const baseSummary = user.naukriSummary || "Software Engineer passionate about building scalable backends and intelligent systems.";

      if (!username || !password) {
        return { success: false, message: "Naukri credentials not configured in settings." };
      }

      // 1. Login
      const loginRes = await fetch(LOGIN_URL, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ username, password }),
      });

      if (!loginRes.ok) {
        throw new Error(`Login failed with status ${loginRes.status}`);
      }

      const setCookieHeader = loginRes.headers.get("set-cookie") || "";
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : setCookieHeader.split(/,(?=\s*[a-zA-Z0-9_-]+\=)/);
      let token = "";
      
      for (const cookieStr of cookiesArray) {
        if (cookieStr.includes("nauk_at=")) {
          const match = cookieStr.match(/nauk_at=([^;]+)/);
          if (match) {
            token = match[1];
            break;
          }
        }
      }

      if (!token) {
        throw new Error("nauk_at cookie not found in response.");
      }

      const authHeaders = {
        ...DEFAULT_HEADERS,
        "authorization": `Bearer ${token}`,
        "systemid": "105",
      };

      // 2. Fetch Profile ID
      const dashRes = await fetch(DASHBOARD_URL, {
        method: "GET",
        headers: authHeaders,
      });

      if (!dashRes.ok) {
        throw new Error(`Dashboard fetch failed with status ${dashRes.status}`);
      }

      const dashData = await dashRes.json();
      const profileId = dashData?.profileId || dashData?.dashBoard?.profileId;

      if (!profileId) {
        throw new Error("Could not find profileId in dashboard response.");
      }

      // 3. Update Summary
      const hasSpace = user.naukriState || false;
      const newState = !hasSpace;
      const newSummary = newState ? `${baseSummary} ` : baseSummary;

      const updateHeaders = {
        ...authHeaders,
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "origin": "https://www.naukri.com",
        "referer": "https://www.naukri.com/mnjuser/profile?id=&altresid",
        "x-http-method-override": "PUT",
      };

      const updatePayload = {
        profile: {
          summary: newSummary,
        },
        profileId,
      };

      const updateRes = await fetch(PROFILE_UPDATE_URL, {
        method: "POST", 
        headers: updateHeaders as any,
        body: JSON.stringify(updatePayload),
      });

      if (!updateRes.ok) {
        throw new Error(`Profile update failed with status ${updateRes.status}`);
      }

      // 4. Save state in DB instead of file
      await db.update(users).set({ naukriState: newState }).where(eq(users.id, userId));

      return {
        success: true,
        message: `Profile updated successfully! Space ${newState ? "added" : "removed"}.`,
      };
    } catch (error: any) {
      logger.error({ err: error }, "Naukri update failed");
      return { success: false, message: error.message || "Unknown error occurred" };
    }
  }
}

export const naukriService = new NaukriService();
