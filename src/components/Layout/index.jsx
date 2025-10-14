import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';

export function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}