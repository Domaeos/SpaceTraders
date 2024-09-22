export default function formatString(str: string) {
  const replaceUnderscores = str.replace(/_/g, " ").trim();
  const wordArray = replaceUnderscores.split(" ");
  const capitalisedWords = wordArray.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalisedWords.join(" ");
}