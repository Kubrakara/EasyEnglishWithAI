import dotenv from "dotenv";
dotenv.config();

// diğer importlar
import { addNameColumn } from "./addNameColumn";
import app from "./app";

const PORT = process.env.PORT || 3000;

// Server başlatılmadan önce database'i hazırla
async function initializeServer() {
  try {
    console.log("Server başlatılıyor...");
    
    // Name kolonunu ekle
    await addNameColumn();
    
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server başlatma hatası:", error);
    process.exit(1);
  }
}

initializeServer();
