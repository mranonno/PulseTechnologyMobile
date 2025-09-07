import * as Updates from "expo-updates";

export type OTAUpdateStatus = "updated" | "uptodate" | "failed";

export const checkForOTAUpdate = async (): Promise<{
  status: OTAUpdateStatus;
  error?: string;
}> => {
  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
      return { status: "updated" };
    } else {
      return { status: "uptodate" };
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Something went wrong";
    return { status: "failed", error: errorMessage };
  }
};
