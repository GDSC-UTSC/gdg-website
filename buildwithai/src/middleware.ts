import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// No-op middleware for the buildwithai app to prevent inheriting parent middleware
export function middleware(_request: NextRequest) {
	return NextResponse.next();
}

