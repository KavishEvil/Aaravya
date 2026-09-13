"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { SETTINGS_KEYS } from "./config";

export async function updateSettings(formData: FormData) {
  await Promise.all(
    SETTINGS_KEYS.map(({ key }) => {
      const value = String(formData.get(key) ?? "").trim();
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    })
  );
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
