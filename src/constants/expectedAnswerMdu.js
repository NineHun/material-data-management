// Deprecated shim: use expectedAnswerMats.js instead.
// Kept only for backward compatibility; will be removed in a future cleanup.
export {
  EXPECTED_KONDUKTOR as EXPECTED_MDU_PERLUASAN,
  EXPECTED_TIANG_BETON as EXPECTED_MDU_3PHASA,
} from "./expectedAnswerMats";

import { checkMaterialAnswers } from "./expectedAnswerMats";

export function checkMduAnswers({ perluasanRows = [], phasaRows = [], items = [] }) {
  const { okKonduktor, okTiang, okAll } = checkMaterialAnswers({
    konduktorRows: perluasanRows,
    tiangRows: phasaRows,
    items,
  });
  return { okPerluasan: okKonduktor, ok3Phasa: okTiang, okAll };
}