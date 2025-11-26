import connectDB from "@/lib/mongodb";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";

export interface LoginResult {
  success: boolean;
  message?: string;
  user?: Omit<typeof User, "password">;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    // Connect to the database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email }).lean(); // lean() gives plain JS object
    if (!user) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "Mot de passe incorrect" };
    }

    // Remove password before returning
    const { password: _, ...userWithoutPassword } = user;

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error logging in:", error);
    return { success: false, message: "Erreur du serveur" };
  }
}
