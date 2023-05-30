// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/index.css';
import FakeStackOverflow from './components/fakestackoverflow.js'
import axios from 'axios'

function App() {
  axios.defaults.withCredentials = true
  return (
      <FakeStackOverflow />
  );
}

export default App;
