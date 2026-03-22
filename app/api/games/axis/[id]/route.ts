"use server";

import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

import { createModuleLogger } from "@/logger.js";
import { generateAxisNumbers, getBlocksGameById } from "@/server/games";

const logger = createModuleLogger("api-games-axis");

// TODO: need to create a scheduled queue to call this endpoint
/**
 * Generates random axis numbers for a blocks game via the game ID. ✅
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
		const gameResult = await getBlocksGameById(id);

		if (!gameResult.success || !gameResult.data) {
			logger.error(`Blocks game not found for id: ${id}`);
			return NextResponse.json(
				{ message: `Blocks game not found for id: ${id}` },
				{ status: 400 },
			);
		}

		// Check if axis numbers have already been generated, only allow once per block game
		if (gameResult.data.blocksGame.axisNumbersGenerated) {
			logger.error(`Axis numbers already generated for blocksGameId: ${id}`);
			return NextResponse.json(
				{ message: "Axis numbers have already been generated for this game" },
				{ status: 400 },
			);
		}

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
