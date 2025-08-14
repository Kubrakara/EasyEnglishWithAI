import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import supabase from "../supabaseClient";

// GET /api/users/me
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Kullanıcı kimliği doğrulanamadı." });
    }

    // Fetch user data from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ message: "Kullanıcı bulunamadı." });
      }
      return res.status(500).json({ message: "Kullanıcı bilgileri alınamadı." });
    }

    if (!data) {
      return res.status(404).json({ message: "Kullanıcı verisi bulunamadı." });
    }

    res.status(200).json({
      id: data.id,
      name: data.name || data.email?.split('@')[0] || "Kullanıcı",
      email: data.email,
      createdAt: data.created_at
    });

  } catch (error: any) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};

// PUT /api/users/me
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Kullanıcı kimliği doğrulanamadı." });
    }

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "İsim alanı boş olamaz." });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ name: name.trim() })
      .eq('id', userId)
      .select('id, name, email, created_at')
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return res.status(400).json({ message: "Profil güncellenemedi." });
    }

    res.status(200).json({
      id: data.id,
      name: data.name,
      email: data.email,
      createdAt: data.created_at
    });

  } catch (error: any) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};
