import type { Component } from 'solid-js';
import DicomViewer from './components/DicomViewer';


const App: Component = () => {
  return (
    <div class="container">
      <DicomViewer />
    </div>
  );
};

export default App;
