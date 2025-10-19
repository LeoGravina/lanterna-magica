import { BrowserRouter } from 'react-router-dom';
import RoutesApp from "./routes.jsx";
import { ToastContainer } from 'react-toastify';
import AuthProvider from './contexts/auth.jsx';

import 'react-toastify/dist/ReactToastify.css';
import './global.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={2000} theme="dark" position="bottom-right" />
        <RoutesApp />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;