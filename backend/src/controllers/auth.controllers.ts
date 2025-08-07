import { Request, Response } from "express";
import supabase from "../supabaseClient";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "E-posta ve şifre alanları zorunludur." });

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (error.message && error.message.includes("already registered")) {
        return res.status(409).json({ error: "Bu e-posta ile zaten kayıt olunmuş." });
      }
      throw error;
    }

    const token = signToken({ id: data.user?.id, email });

    res.status(201).json({ user: data.user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "E-posta ve şifre alanları zorunludur." });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user)
      return res.status(401).json({ error: "E-posta veya şifre hatalı." });

    const token = signToken({ id: data.user.id, email });

    res.status(200).json({ user: data.user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
