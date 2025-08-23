export { PrismaClient } from '@prisma/client';
export * from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
export { createClient };
export declare const databaseConfig: {
    url: string;
    supabase: {
        url: string;
        anonKey: string;
        serviceKey: string;
    };
};
export declare const supabaseClient: import("node_modules/@supabase/supabase-js/dist/module").SupabaseClient<any, "public", any>;
export declare const supabaseAdmin: import("node_modules/@supabase/supabase-js/dist/module").SupabaseClient<any, "public", any>;
//# sourceMappingURL=index.d.ts.map