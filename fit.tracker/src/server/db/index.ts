import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { env } from "~/env.mjs";
import * as mainSchema from "./schema";
import * as weightEntities from "../weight_tracking/weight";

const schema = {
	...weightEntities,
	...mainSchema
}

export const db = drizzle(
	new Client({
		url: env.DATABASE_URL,
	}).connection(),
	{ schema }
);