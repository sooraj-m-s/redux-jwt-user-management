import { useSelector } from 'react-redux';


function Home() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to MyApp</h1>
      {isAuthenticated ? (
        <p className="text-lg text-gray-600">Hello, {user?.username}!</p>
      ) : (
        <p className="text-lg text-gray-600">Please log in to access your profile.</p>
      )}
    </div>
  );
}

export default Home;
