import Sidebar from './components/common/Sidebar';
import ChapterPage from './pages/ChapterPage';
import './assets/styles/main.css'; // You'll create this CSS file

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="content-container">
        <ChapterPage />
      </main>
    </div>
  );
}

export default App;