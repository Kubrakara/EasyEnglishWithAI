import { Request, Response } from "express";
import supabase from "../supabaseClient";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
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

    // 2. Add user to public 'users' table (if you have one for profiles)
    // This step is optional and depends on your database schema.
    const { error: insertError } = await supabase.from('users').insert({ id: user.id, email: user.email });

    if (insertError) {
        // If this fails, you might want to delete the auth user to keep things consistent
        await supabase.auth.admin.deleteUser(user.id);
        throw insertError;
    }

    // 3. Generate tokens for auto-login
    const payload = { id: user.id, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // 4. Send tokens to the client
    res.status(201).json({ accessToken, refreshToken });

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