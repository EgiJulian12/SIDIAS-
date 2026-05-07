import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-green-600">404</h1>
      <p className="mt-2 text-gray-500">Halaman tidak ditemukan</p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
      >
        Kembali ke Home
      </Link>
    </div>
  );
};

export default NotFound;