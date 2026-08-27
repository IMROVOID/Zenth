// Spline and area SVG paths for HeroChart
export const CHART_PATH_D =
  'M 0 280 ' +
  'L 120 280 ' +
  'C 155 280, 175 195, 210 195 ' + // Smooth rise to Shelf 1
  'L 255 195 ' + // Horizontal shelf 1 (left)
  'C 285 195, 305 270, 335 270 ' + // Smooth drop to Valley 1
  'L 355 270 ' +
  'C 385 270, 405 135, 435 135 ' + // Smooth rise to Shelf 2
  'L 485 135 ' + // Horizontal shelf 2 (left)
  'C 515 135, 530 85, 560 85 ' + // Smooth rise to High Shelf 3
  'L 615 85 ' + // High shelf 3 (left)
  'C 645 85, 665 210, 695 210 ' + // Smooth descent to Shelf 4
  'L 715 210 ' +
  'C 735 210, 748 290, 765 290 ' + // Pre-launch valley
  'L 780 290 ' +
  'C 795 290, 804 22, 816 22 ' + // Center Towering Needle Apex
  'C 824 22, 835 165, 846 165 ' + // Smooth drop to center shelf
  'L 865 165 ' +
  'C 880 165, 892 26, 908 26 ' + // Smooth rise to Main Plateau
  'L 970 26 ' + // Wide Flat-Top Plateau (centered at 860-970)
  'C 990 26, 1005 95, 1025 95 ' + // Smooth step down to Shelf 1
  'L 1065 95 ' +
  'C 1085 95, 1100 160, 1120 160 ' + // Smooth step down to Shelf 2
  'L 1155 160 ' +
  'C 1175 160, 1190 275, 1210 275 ' + // Valley
  'L 1235 275 ' +
  'C 1255 275, 1270 125, 1295 125 ' + // Smooth rise to Right Shelf 3
  'L 1345 125 ' +
  'C 1370 125, 1390 210, 1415 210 ' + // Smooth step down to Shelf 4
  'L 1445 210 ' +
  'C 1470 210, 1490 280, 1520 280 ' +
  'L 1600 280';

export const CHART_AREA_D = `${CHART_PATH_D} L 1600 420 L 0 420 Z`;

export const CHART_VIEWBOX = '0 -120 1600 540';

export const PIXEL_GRID_COLORS = ['#4ADE80', '#34F59B', '#2CE88A', '#22E881'];
export const PIXEL_GRID_DISABLED_COLOR = '#202422';
