import React, { useState, useEffect } from 'react';
import axios from 'axios';

async function getTagById(tagId) {
  const baseUrl = 'http://localhost:8000/posts/tags/tag_id/';
  const url = baseUrl + tagId;
  const response = await axios.get(url);
  return response.data.name;
}

function GenerateHtmlForTags({ tagIds, qid }) {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTags = await Promise.all(tagIds.map((tagId) => getTagById(tagId)));
      setTags(fetchedTags);
    };
    fetchData();
  }, [tagIds]);

  return (
    <ul key={qid} id="question-tags">
      {tags.map((tag, index) => (
        <li key={qid + tagIds[index]}>{tag}</li>
      ))}
    </ul>
  );
}

export { getTagById };
export default GenerateHtmlForTags;
