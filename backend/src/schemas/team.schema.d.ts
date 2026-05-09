import { z } from "zod";
export declare const createTeamSchema: z.ZodObject<{
    teamName: z.ZodString;
    timeZone: z.ZodString;
    open_time: z.ZodString;
    close_time: z.ZodString;
    reminder_time: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=team.schema.d.ts.map