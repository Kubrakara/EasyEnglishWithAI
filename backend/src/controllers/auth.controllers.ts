import { Request, Response } from "express";
import supabase from "../supabaseClient";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "E-posta ve şifre alanları zorunludur." });
  }

  try {
    // 1. Create the user in Supabase Auth
    const { data, error: creationError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm user for simplicity
    });

    if (creationError) {
      if (creationError.message?.includes("already registered")) {
        return res.status(409).json({ message: "Bu e-posta adresi ile zaten bir hesap mevcut." });
      }
      throw creationError;
    }
    
    const user = data.user;
    if (!user) {
        throw new Error("Kullanıcı oluşturuldu ancak alınamadı.");
    }

    // 2. Add user to public 'users' table with name
    const { error: insertError } = await supabase.from('users').insert({ 
      id: user.id, 
      email: user.email,
      name: name || email.split('@')[0] // Eğer name yoksa email'den türet
    });

    if (insertError) {
        // If this fails, you might want to delete the auth user to keep things consistent
        await supabase.auth.admin.deleteUser(user.id);
        throw insertError;
    }

    // 3. Kayıt başarılı mesajı döndür
    res.status(201).json({ 
      message: "Kullanıcı başarıyla oluşturuldu.",
      userId: user.id 
    });

  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message || "Sunucu hatası oluştu." });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "E-posta ve şifre alanları zorunludur." });
  }

  try {
    // 1. Verify credentials with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({ message: "E-posta veya şifre hatalı." });
    }

    // 2. Generate tokens
    const payload = { id: data.user.id, email: data.user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // 3. Send tokens to the client
    res.status(200).json({ accessToken, refreshToken });

  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message || "Sunucu hatası oluştu." });
  }
};

// Add refresh token endpoint
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token gerekli." });
  }

  try {
    // Verify the refresh token
    const payload = verifyRefreshToken(refreshToken);
    
    if (!payload || typeof payload === 'string') {
      return res.status(401).json({ message: "Geçersiz refresh token." });
    }

    // Generate new access token
    const newAccessToken = signAccessToken({ id: payload.id, email: payload.email });
    
    res.status(200).json({ accessToken: newAccessToken });

  } catch (error: any) {
    console.error("Refresh token error:", error);
    res.status(401).json({ message: "Geçersiz veya süresi dolmuş token." });
  }
};
