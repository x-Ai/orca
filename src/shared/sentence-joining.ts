// Japanese and Chinese run on after a full-width terminator; any other sentence takes a space.
const RUNS_ON_AFTER = /[。！？]$/
// local-i18n: zh copy carries no trailing 。, so a sentence that ends in Han runs on with a comma.
const ENDS_IN_HAN = /\p{Script=Han}$/u

/** Whole sentences as one passage. Each gap follows the sentence before it, not the UI language, so
 *  a sentence a language pack left in English keeps its space beside translated ones. */
export function joinSentences(sentences: readonly string[]): string {
  return sentences
    .map((sentence, index) => {
      if (index === 0) {
        return sentence
      }
      const previous = sentences[index - 1]
      if (RUNS_ON_AFTER.test(previous)) {
        return sentence
      }
      return ENDS_IN_HAN.test(previous) ? `，${sentence}` : ` ${sentence}`
    })
    .join('')
}
