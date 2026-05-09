import { z } from "zod";
export const createTeamSchema = z
    .object({
    teamName: z
        .string()
        .min(3, "Team name must be at least 3 characters")
        .max(50, "Team name must not exceed 50 characters")
        .regex(/^[a-zA-Z0-9\s-_]+$/, "Invalid characters in team name"),
    timeZone: z
        .string()
        .min(1, "Timezone is required")
        .refine((val) => Intl.supportedValuesOf("timeZone").includes(val), {
        message: "Invalid timezone",
    }),
    open_time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
    close_time: z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
    reminder_time: z
        .string()
        .min(0, "Reminder time must be positive")
        .max(1440, "Reminder time cannot exceed 24 hours"),
})
    .refine((data) => data.open_time < data.close_time, {
    message: "open_time must be before close_time",
    path: ["close_time"],
});
//# sourceMappingURL=team.schema.js.map