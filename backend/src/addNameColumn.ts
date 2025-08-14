import supabase from "./supabaseClient";

export async function addNameColumn() {
  try {
    console.log("Name kolonu ekleniyor...");

    // Name kolonunu ekle
    const { error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS name TEXT;
      `
    });

    if (addColumnError) {
      console.log("Name kolonu ekleme hatası:", addColumnError.message);
      
      // Alternatif yöntem - SQL Editor'da çalıştırılabilir
      console.log("Alternatif olarak, Supabase SQL Editor'da şu komutu çalıştırın:");
      console.log("ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;");
    } else {
      console.log("Name kolonu başarıyla eklendi!");
    }

  } catch (error) {
    console.error("Name kolonu ekleme hatası:", error);
    console.log("Lütfen Supabase Dashboard'da SQL Editor'ı kullanarak şu komutu çalıştırın:");
    console.log("ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;");
  }
}
