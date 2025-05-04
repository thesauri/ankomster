export const getCurrentDateInSwedenYYYMMdd = (): string =>
  new Date()
    .toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
    .substring(0, 10);

export const getTomorrowsDateInSwedenYYYMMdd = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow
    .toLocaleString("sv-SE", { timeZone: "Europe/Stockholm" })
    .substring(0, 10);
};
