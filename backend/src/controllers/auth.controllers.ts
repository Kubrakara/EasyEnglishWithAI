import { Request, Response } from "express";
import supabase from "../supabaseClient";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw error;

    const token = signToken({ id: data.user?.id, email });

    res.status(201).json({ user: data.user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: data.user.id, email });

    res.status(200).json({ user: data.user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
