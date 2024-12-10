import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const rootElement = document.getElementById('root') as HTMLElement;
rootElement.style.margin = '30px';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <DndProvider backend={HTML5Backend}>
    <App />
  </DndProvider>
);
