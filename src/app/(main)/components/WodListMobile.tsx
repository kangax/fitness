import React, { useState, useMemo } from "react"; // Added useMemo
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Wod, Score } from "~/types/wodTypes";
import {
  formatScore,
  parseTags,
  getPerformanceBadgeDetails,
} from "~/utils/wodUtils"; // Import getPerformanceBadgeDetails
import { HighlightMatch } from "~/utils/uiUtils"; // Import HighlightMatch

type ScoresByWodId = Record<string, Score[]>;

type WodListMobileProps = {
  wods: Wod[];
  scoresByWodId: ScoresByWodId;
  searchTerm: string; // Add searchTerm prop
};

// Updated badge colors for more prominence and consistency
const difficultyStyles: Record<
  string,
  { light: string; dark: string; text: string }
> = {
  Hard: {
    light: "bg-red-300 border-red-400", // True red, matches WodTable
    dark: "dark:bg-red-700",
    text: "text-red-800 dark:text-white",
  },
  Medium: {
    light: "bg-yellow-200 border-yellow-300",
    dark: "dark:bg-yellow-600",
    text: "text-yellow-800 dark:text-white",
  },
  Easy: {
    light: "bg-green-300 border-green-400", // More prominent green
    dark: "dark:bg-green-700",
    text: "text-green-900 dark:text-white",
  },
  "Very Hard": {
    light: "bg-red-200 border-red-300",
    dark: "dark:bg-red-600",
    text: "text-red-800 dark:text-white",
  },
  "Extremely Hard": {
    light: "bg-purple-200 border-purple-300",
    dark: "dark:bg-purple-600",
    text: "text-purple-800 dark:text-white",
  },
};

const badgeColorMap: Record<string, string> = {
  purple: "bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-white",
  green: "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100",
  yellow: "bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-white",
  gray: "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-100",
};

const checkWodMatch = (wod: Wod, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return false;
  const lowerSearchTerm = searchTerm.toLowerCase();

  if (wod.wodName?.toLowerCase().includes(lowerSearchTerm)) {
    return true;
  }
  if (wod.description?.toLowerCase().includes(lowerSearchTerm)) {
    return true;
  }
  const tags = parseTags(wod.tags);
  if (tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))) {
    return true;
  }
  return false;
};

export function WodListMobile({
  wods,
  scoresByWodId,
  searchTerm,
}: WodListMobileProps) {
  const [expandedWodId, setExpandedWodId] = useState<string | null>(null);

  const toggleExpand = (wodId: string) => {
    setExpandedWodId(expandedWodId === wodId ? null : wodId);
  };

  const matchedWodIds = useMemo(() => {
    if (!searchTerm.trim()) return new Set<string>();
    return new Set(
      wods.filter((wod) => checkWodMatch(wod, searchTerm)).map((wod) => wod.id),
    );
  }, [wods, searchTerm]);

  return (
    <div className="space-y-4 px-2 pb-4">
      {wods.map((wod) => {
        const isManuallyExpanded = expandedWodId === wod.id;
        const isSearchMatch = matchedWodIds.has(wod.id);
        const isExpanded =
          isManuallyExpanded || (isSearchMatch && expandedWodId !== wod.id);

        const wodScores = scoresByWodId?.[wod.id] || [];
        const tags = parseTags(wod.tags);

        const diff = difficultyStyles[wod.difficulty ?? ""] || {
          light: "bg-green-300 border-green-400",
          dark: "dark:bg-slate-700",
          text: "text-slate-800 dark:text-slate-100",
        };
        const badgeClasses = `whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${diff.light} ${diff.dark} ${diff.text}`;

        return (
          <div
            key={wod.id}
            className="flex flex-col rounded-xl border border-slate-300 bg-slate-100 px-4 py-3 shadow-lg ring-1 ring-slate-100 transition-colors dark:border-slate-700 dark:bg-[#23293a] dark:shadow-md dark:ring-0"
          >
            {/* Header Section */}
            <div
              className="flex cursor-pointer items-center justify-between"
              onClick={() => toggleExpand(wod.id)}
            >
              <span className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                <HighlightMatch text={wod.wodName} highlight={searchTerm} />
              </span>
              <div className="flex items-center gap-2">
                {wod.wodUrl && (
                  <a
                    href={wod.wodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on Wodwell"
                    className="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={0}
                  >
                    {/* SVG "w" icon for crispness and accessibility */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle cx="8" cy="8" r="8" fill="black" />
                      <text
                        x="8"
                        y="11.5"
                        textAnchor="middle"
                        fontFamily="Geist, Arial, sans-serif"
                        fontWeight="bold"
                        fontSize="10"
                        fill="white"
                        aria-hidden="true"
                      >
                        w
                      </text>
                    </svg>
                  </a>
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {wod.countLikes} likes
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                )}
              </div>
            </div>

            {/* Tags Section (Always Visible) - Use parsed tags */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className={badgeClasses}>{wod.difficulty}</span>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                >
                  <HighlightMatch text={tag} highlight={searchTerm} />
                </span>
              ))}
            </div>

            {/* Expandable Section */}
            {isExpanded && (
              <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
                {/* Description - Apply HighlightMatch */}
                <div className="mb-3">
                  <p className="text-md whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                    <HighlightMatch
                      text={wod.description ?? ""}
                      highlight={searchTerm}
                    />
                  </p>
                </div>

                {/* Separator */}
                <div className="my-3 border-t border-slate-200 dark:border-slate-700"></div>

                {/* Scores */}
                {wodScores.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Your Scores:
                    </h4>
                    <ul className="space-y-2">
                      {wodScores.map((score) => {
                        const { displayLevel, color } =
                          getPerformanceBadgeDetails(wod, score);
                        const badgeColor =
                          badgeColorMap[color] || badgeColorMap.gray;
                        const suffix = score.isRx ? "Rx" : "Scaled";
                        return (
                          <li
                            key={score.id}
                            className="flex flex-col rounded-md bg-slate-100 p-2 dark:bg-slate-700"
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-blue-600 dark:text-blue-400">
                                  {formatScore(score, suffix)}
                                </span>
                                <span
                                  className={`rounded px-1.5 py-0.5 text-xs font-medium ${badgeColor}`}
                                >
                                  {displayLevel}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {new Date(score.scoreDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "2-digit",
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                            {score.notes && (
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {score.notes}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {wodScores.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No scores recorded yet.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default WodListMobile;
