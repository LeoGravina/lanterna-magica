import { BrowserRouter } from 'react-router-dom';
import RoutesApp from "./routes.jsx";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './global.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer autoClose={1500} theme="dark" position="bottom-right" />
      <RoutesApp />
    </BrowserRouter>
  );
}

export default App;