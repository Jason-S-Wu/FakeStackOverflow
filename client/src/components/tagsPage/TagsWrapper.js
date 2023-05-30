import axios from 'axios';
import { useState, useEffect } from 'react';

function TagsWrapper({ updatePage, setSearch, tags, username, userid }) {
  const searchForTag = (element) => {
    setSearch({ tagSearch: true, search: '[' + element + ']' });
    updatePage('questions');
  };

  const [tagQuestionsCount, setTagQuestionsCount] = useState({});

  const [editTag, setEditTag] = useState({ tagId: null, tagName: null, edit: false });
  const [deleteTag, setDeleteTag] = useState({ tagId: null, tagName: null, delete: false });

  useEffect(() => {
    const fetchTagQuestionsCount = async () => {
      const countObj = {};
      for (let i = 0; i < tags.length; i++) {
        const res = await axios.get(`http://localhost:8000/posts/tags/tag_id/${tags[i]._id}/questions`);
        countObj[tags[i]._id] = res.data.length;
      }
      setTagQuestionsCount(countObj);
    };
    fetchTagQuestionsCount();
  }, [tags]);

  return (
    <ul id="tags-wrapper">
      {tags.map((element) => {
        function editTagClicked() {
          setEditTag({ tagId: element._id, tagName: element.name, edit: true, error: false, errorMessage: '' });
        }

        function createEditTagForm() {
          return (
            <form onSubmit={editTagSubmit}>
              <input type="text" value={editTag.tagName} onChange={editTagChange} />
              <input type="submit" value="Submit" />
            </form>
          );
        }

        function editTagChange(e) {
          setEditTag({ ...editTag, tagName: e.target.value });
        }

        function editTagSubmit(e) {
          e.preventDefault();
          const data = { name: editTag.tagName };
          axios.put(`http://localhost:8000/posts/tags/modify/${editTag.tagId}`, data).then((res) => {
            if (typeof res.data === 'string') {
              setEditTag({ ...editTag, error: true, errorMessage: res.data });
              return;
            }
            axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`).then((res) => {
              updatePage({ currentPage: 'tags', tags: res.data, username: username, userid: userid });
              setEditTag({ tagId: null, tagName: null, edit: false });
            });
          });
        }

        function createDeleteWarn() {
          return (
            <div>
              <p>Are you sure you want to delete {deleteTag.tagName}?</p>
              <button onClick={deleteTagSubmit}>Yes</button>
              <button onClick={deleteTagCancel}>No</button>
            </div>
          );
        }

        function deleteTagSubmit() {
          axios.delete(`http://localhost:8000/posts/tags/delete/${deleteTag.tagId}`).then((res) => {
            if (typeof res.data === 'string') {
              setDeleteTag({ ...deleteTag, error: true, errorMessage: res.data });
              return;
            }
            axios.get(`http://localhost:8000/posts/tags/getUser/${userid}`).then((res) => {
              updatePage({ currentPage: 'tags', tags: res.data, username: username, userid: userid });
              setDeleteTag({ tagId: null, tagName: null, delete: false });
            });
          });
        }

        function deleteTagCancel() {
          setDeleteTag({ tagId: null, tagName: null, delete: false, error: false, errorMessage: '' });
        }

        function deleteTagClicked() {
          setDeleteTag({ tagId: element._id, tagName: element.name, delete: true });
        }

        return (
          <li key={element._id} className="tag-container">
            <div className="tag-name-div">
              <h2>
                <a
                  href={element._id}
                  id={element._id}
                  onClick={(e) => {
                    e.preventDefault();
                    searchForTag(element.name);
                  }}
                >
                  {element.name}
                </a>
              </h2>
            </div>
            <div className="tag-num-questions-div">
              <h4>
                {tagQuestionsCount[element._id] ?? 'Loading...'}{' '}
                {tagQuestionsCount[element._id] === 1 ? 'question' : 'questions'}
              </h4>
            </div>
            {username ? (
              <div>
                <button onClick={editTagClicked}> Edit </button>
                <button onClick={deleteTagClicked}> Delete </button>
              </div>
            ) : null}
            {editTag.tagId === element._id && editTag.edit ? createEditTagForm() : null}
            {editTag.tagId === element._id && editTag.error ? <p>{editTag.errorMessage}</p> : null}
            {deleteTag.tagId === element._id && deleteTag.delete ? createDeleteWarn() : null}
            {deleteTag.tagId === element._id && deleteTag.error ? <p>{deleteTag.errorMessage}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}

export default TagsWrapper;
