export type BadgeOverflowSizing = {
	estimatedBadgeWidthPx: number;
	estimatedOverflowBadgeWidthPx: number;
	badgeGapPx: number;
};

export const DEFAULT_BADGE_OVERFLOW_SIZING: BadgeOverflowSizing = {
	estimatedBadgeWidthPx: 90,
	estimatedOverflowBadgeWidthPx: 20,
	badgeGapPx: 8
};

const getEstimatedFitCount = (availableWidth: number, sizing: BadgeOverflowSizing) =>
	Math.max(
		1,
		Math.floor(
			(Math.max(0, availableWidth) + sizing.badgeGapPx) /
				(sizing.estimatedBadgeWidthPx + sizing.badgeGapPx)
		)
	);

export const getCollapsedVisibleCount = (
	total: number,
	maxWidth: number,
	sizing: BadgeOverflowSizing
) => {
	if (total === 0) return 0;

	const fitWithoutOverflow = getEstimatedFitCount(maxWidth, sizing);
	if (total <= fitWithoutOverflow) return total;

	const widthWithOverflowReserved =
		maxWidth - sizing.estimatedOverflowBadgeWidthPx - sizing.badgeGapPx;
	const fitWithOverflow = getEstimatedFitCount(widthWithOverflowReserved, sizing);

	return Math.min(total - 1, fitWithOverflow);
};

export const getVisibleCount = (
	total: number,
	maxWidth: number,
	expanded: boolean,
	sizing: BadgeOverflowSizing
) => {
	if (expanded) return total;
	return getCollapsedVisibleCount(total, maxWidth, sizing);
};

export const getHiddenCount = (total: number, maxWidth: number, sizing: BadgeOverflowSizing) => {
	return total - getCollapsedVisibleCount(total, maxWidth, sizing);
};

export const estimateRemainingColumnWidth = (
	tableWidth: number,
	fixedColumnsWidth: number,
	tableChromePx: number,
	minWidth: number
) => Math.max(minWidth, tableWidth - fixedColumnsWidth - tableChromePx);
