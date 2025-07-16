"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function revalidateAuth() {
  revalidatePath("/account", "layout");
  revalidatePath("/", "layout");
  revalidatePath("/account/login", "layout");
  revalidatePath("/account/register", "layout");
  redirect("/");
}
