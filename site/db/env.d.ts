declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    FILES: R2Bucket;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    SITE_ORIGIN?: string;
    ADMIN_SETUP_TOKEN?: string;
  }
}
