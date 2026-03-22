"use server";

import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

import { createModuleLogger } from "@/logger.js";
import { generateAxisNumbers } from "@/server/games";

const logger = createModuleLogger("api-games-axis");

/**
 * Generates random axis numbers for a blocks game via the game ID.
 *
 * @param request - The incoming request
 * @param params - Route params containing the blocks game ID
 * @returns JSON response with the generated axis numbers or an error
 */
export const GET = async (
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	logger.info(`api-games-axis running for blocksGameId: ${id}`);

	if (!id) {
		logger.error("Missing blocksGameId parameter");
		return NextResponse.json(
			{ message: "Missing blocksGameId parameter" },
			{ status: 400 },
		);
	}

	try {
		const result = await generateAxisNumbers(id);

		if (!result.success) {
			logger.error(`Failed to generate axis numbers: ${result.message}`);
			return NextResponse.json({ message: result.message }, { status: 500 });
		}

		logger.info(
			`api-games-axis complete for blocksGameId: ${id}. Axis numbers generated successfully.`,
		);

		return NextResponse.json(
			{
				message: "OK",
				data: result.data,
			},
			{ status: 200 },
		);
	} catch (error) {
		logger.error(
			error instanceof Error ? error : String(error),
			"Unexpected error in api-games-axis",
		);
		return NextResponse.json(
			{
				message: `Unexpected error: ${(error as Error).message}`,
			},
			{ status: 500 },
		);
	}
};
