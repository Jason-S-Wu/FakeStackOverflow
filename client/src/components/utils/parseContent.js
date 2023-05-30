function parseContent(text) {
  const regex = /\[(.*?)\]\((.*?)\)/g;
  let startIndex = 0;
  let endIndex = 0;
  let matches = [];
  let result = [];
  let counter = 0;

  while ((matches = regex.exec(text)) !== null) {
    endIndex = matches.index;
    result.push(
      text.slice(startIndex, endIndex),
      <a href={matches[2]} key={counter} target="_blank" rel="noreferrer">
        {matches[1]}
      </a>
    );
    startIndex = regex.lastIndex;
    counter++;
  }

  result.push(text.slice(startIndex));
  return <>{result}</>;
}

export default parseContent;
